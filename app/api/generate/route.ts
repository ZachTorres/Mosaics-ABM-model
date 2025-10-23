import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { scrapeCompanyWebsite } from '@/lib/scraper'
import { generatePersonalizedContent } from '@/lib/ai-generator'
import { generateSlug } from '@/lib/utils'
import { z } from 'zod'

const generateSchema = z.object({
  targetUrl: z.string().url(),
  campaignId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { targetUrl, campaignId } = generateSchema.parse(body)

    // Step 1: Scrape company website
    console.log('Scraping website:', targetUrl)
    const companyData = await scrapeCompanyWebsite(targetUrl)

    // Step 2: Generate personalized content using AI
    console.log('Generating personalized content for:', companyData.name)
    const personalizedContent = await generatePersonalizedContent(companyData)

    // Step 3: Create microsite in database
    const slug = generateSlug(companyData.name)

    const microsite = await prisma.microsite.create({
      data: {
        slug,
        campaignId: campaignId || null,
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
        publishedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      microsite: {
        id: microsite.id,
        slug: microsite.slug,
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/m/${microsite.slug}`,
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
