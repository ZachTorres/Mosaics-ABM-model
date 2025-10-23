import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage'
import { scrapeCompanyWebsite } from '@/lib/simple-scraper'
import { generatePersonalizedContent } from '@/lib/simple-ai'
import { generateSlug } from '@/lib/utils'
import { getAppUrl } from '@/lib/env'
import { z } from 'zod'

const generateSchema = z.object({
  targetUrl: z.string().url(),
})

export async function POST(request: NextRequest) {
  console.log('=== Generate API Called ===')

  try {
    // Parse request body
    let body
    try {
      body = await request.json()
      console.log('Request body:', body)
    } catch (e) {
      console.error('Failed to parse request body:', e)
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    // Validate input
    let targetUrl
    try {
      const parsed = generateSchema.parse(body)
      targetUrl = parsed.targetUrl
      console.log('Target URL:', targetUrl)
    } catch (e) {
      console.error('Validation error:', e)
      if (e instanceof z.ZodError) {
        return NextResponse.json(
          { success: false, error: 'Invalid request data', details: e.errors },
          { status: 400 }
        )
      }
      throw e
    }

    // Step 1: Scrape company website
    console.log('Step 1: Scraping website...')
    let companyData
    try {
      companyData = await scrapeCompanyWebsite(targetUrl)
      console.log('Scraping successful:', companyData.name)
    } catch (e) {
      console.error('Scraping failed:', e)
      return NextResponse.json(
        { success: false, error: 'Failed to scrape website: ' + (e instanceof Error ? e.message : 'Unknown error') },
        { status: 500 }
      )
    }

    // Step 2: Generate personalized content
    console.log('Step 2: Generating content...')
    let personalizedContent
    try {
      personalizedContent = await generatePersonalizedContent(companyData)
      console.log('Content generation successful')
    } catch (e) {
      console.error('Content generation failed:', e)
      return NextResponse.json(
        { success: false, error: 'Failed to generate content: ' + (e instanceof Error ? e.message : 'Unknown error') },
        { status: 500 }
      )
    }

    // Step 3: Save microsite to file storage
    console.log('Step 3: Creating microsite...')
    let microsite
    try {
      const slug = generateSlug(companyData.name)
      console.log('Generated slug:', slug)

      microsite = storage.createMicrosite({
        slug,
        targetCompanyName: companyData.name,
        targetCompanyUrl: targetUrl,
        targetIndustry: companyData.industry,
        targetCompanySize: companyData.companySize,
        companyDescription: companyData.description,
        techStack: companyData.techStack,
        painPoints: companyData.painPoints,
        headline: personalizedContent.headline,
        subheadline: personalizedContent.subheadline,
        valuePropositions: personalizedContent.valuePropositions,
        customContent: {
          customPitch: personalizedContent.customPitch,
          cta: personalizedContent.cta,
          logo: companyData.logo,
          metadata: companyData.metadata,
        },
        recommendedSolutions: personalizedContent.recommendedSolutions,
        status: 'PUBLISHED',
        publishedAt: new Date().toISOString(),
      })
      console.log('Microsite created:', microsite.id)
    } catch (e) {
      console.error('Failed to create microsite:', e)
      return NextResponse.json(
        { success: false, error: 'Failed to save microsite: ' + (e instanceof Error ? e.message : 'Unknown error') },
        { status: 500 }
      )
    }

    // Return success
    console.log('=== Success ===')
    return NextResponse.json({
      success: true,
      microsite: {
        id: microsite.id,
        slug: microsite.slug,
        url: `${getAppUrl()}/m/${microsite.slug}`,
      },
    })
  } catch (error) {
    console.error('=== Unexpected Error ===')
    console.error('Error generating microsite:', error)
    console.error('Stack:', error instanceof Error ? error.stack : 'No stack trace')

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate microsite',
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}
