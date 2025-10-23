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
  try {
    const body = await request.json()
    const { targetUrl } = generateSchema.parse(body)

    // Step 1: Scrape company website
    console.log('Scraping website:', targetUrl)
    const companyData = await scrapeCompanyWebsite(targetUrl)

    // Step 2: Generate personalized content (uses AI if configured, templates otherwise)
    console.log('Generating personalized content for:', companyData.name)
    const personalizedContent = await generatePersonalizedContent(companyData)

    // Step 3: Save microsite to file storage
    const slug = generateSlug(companyData.name)

    const microsite = storage.createMicrosite({
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

    return NextResponse.json({
      success: true,
      microsite: {
        id: microsite.id,
        slug: microsite.slug,
        url: `${getAppUrl()}/m/${microsite.slug}`,
      },
    })
  } catch (error) {
    console.error('Error generating microsite:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate microsite',
      },
      { status: 500 }
    )
  }
}
