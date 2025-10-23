import OpenAI from 'openai'
import { CompanyData } from './scraper'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface PersonalizedContent {
  headline: string
  subheadline: string
  valuePropositions: Array<{
    title: string
    description: string
    icon: string
  }>
  recommendedSolutions: Array<{
    name: string
    description: string
    benefits: string[]
    roi: string
  }>
  customPitch: string
  cta: string
}

const MOSAIC_SOLUTIONS = {
  apAutomation: {
    name: 'AP Automation',
    description: 'Streamline invoice processing with automated data capture, approval workflows, and seamless ERP integration.',
    benefits: [
      'Eliminate manual data entry',
      'Reduce processing time by 80%',
      'Improve accuracy and reduce errors',
      'Accelerate payment cycles',
    ],
  },
  salesOrderProcessing: {
    name: 'Sales Order Processing',
    description: 'Compress order-to-cash cycles with automated order capture and processing.',
    benefits: [
      'Faster order fulfillment',
      'Reduced order errors',
      'Improved customer satisfaction',
      'Real-time order tracking',
    ],
  },
  hrAutomation: {
    name: 'HR Automation',
    description: 'Transform HR operations with paperless employee files and automated onboarding workflows.',
    benefits: [
      'HIPAA-compliant document storage',
      'Streamlined onboarding',
      'Centralized employee records',
      'Automated compliance tracking',
    ],
  },
  intelligentDataCapture: {
    name: 'Intelligent Data Capture',
    description: 'Automated document classification, validation, and routing powered by AI.',
    benefits: [
      'Automatic document classification',
      'Data validation and verification',
      'Intelligent routing',
      'Multi-format support',
    ],
  },
  ecm: {
    name: 'Enterprise Content Management',
    description: 'Single repository system for all your business documents and content.',
    benefits: [
      'Centralized document storage',
      'Advanced search capabilities',
      'Version control',
      'Secure access management',
    ],
  },
  freightAutomation: {
    name: 'Freight Process Automation',
    description: 'Automate shipping documentation and accelerate billing processes.',
    benefits: [
      'Automated shipping documents',
      'Faster billing cycles',
      'Reduced shipping errors',
      'Better carrier management',
    ],
  },
}

export async function generatePersonalizedContent(
  companyData: CompanyData
): Promise<PersonalizedContent> {
  const prompt = `You are an expert B2B marketing copywriter for Mosaic Corporation, a leader in workflow automation and document digitization solutions.

Company Context:
- Name: ${companyData.name}
- Industry: ${companyData.industry}
- Size: ${companyData.companySize}
- Description: ${companyData.description}
- Identified Pain Points: ${companyData.painPoints.join(', ')}
- Tech Stack: ${companyData.techStack.join(', ') || 'Unknown'}

Mosaic's Core Solutions:
1. AP Automation - Invoice processing, data entry elimination, ERP integration
2. Sales Order Processing - Order-to-cash cycle compression
3. HR Automation - Paperless employee files, onboarding workflows, HIPAA-compliant
4. Intelligent Data Capture - Automated classification and validation
5. Enterprise Content Management - Single repository systems
6. Freight Process Automation - Shipping document automation

Mosaic's Value Proposition: "Leave Paper Behind. Move Business Forward."
Mosaic specializes in customized workflow automation that eliminates manual data entry, reduces errors, and delivers maximum ROI through seamless ERP integration.

Your Task:
Create a highly personalized microsite pitch for ${companyData.name} that:
1. Addresses their specific industry challenges
2. Connects their pain points to Mosaic's solutions
3. Demonstrates deep understanding of their business
4. Presents compelling ROI and transformation potential

Generate the content in JSON format with these fields:
{
  "headline": "Compelling, personalized headline (max 80 chars) that speaks directly to their situation",
  "subheadline": "Supporting subheadline (max 150 chars) that reinforces value",
  "valuePropositions": [
    {
      "title": "Value prop title",
      "description": "2-3 sentence description tailored to their needs",
      "icon": "emoji icon that represents this value"
    }
  ],
  "recommendedSolutions": [
    {
      "name": "Solution name from Mosaic's offerings",
      "description": "Why this solution is perfect for them",
      "benefits": ["Specific benefit 1", "Specific benefit 2", "Specific benefit 3"],
      "roi": "Expected ROI or time savings"
    }
  ],
  "customPitch": "3-4 paragraph personalized pitch that tells a story about their transformation with Mosaic. Be specific to their industry and challenges.",
  "cta": "Compelling call-to-action text"
}

Make it feel like this was written specifically for ${companyData.name}, not a generic template. Use their industry terminology and reference their specific challenges.`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert B2B marketing copywriter specializing in personalized account-based marketing content. Return only valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    })

    const content = JSON.parse(response.choices[0].message.content || '{}')

    // Validate and ensure all required fields exist
    return {
      headline: content.headline || `Transform ${companyData.name} with Workflow Automation`,
      subheadline:
        content.subheadline ||
        'Eliminate manual processes and accelerate your business operations',
      valuePropositions: content.valuePropositions || generateDefaultValueProps(companyData),
      recommendedSolutions:
        content.recommendedSolutions || recommendSolutions(companyData),
      customPitch: content.customPitch || generateDefaultPitch(companyData),
      cta: content.cta || 'Schedule Your Personalized Demo',
    }
  } catch (error) {
    console.error('Error generating AI content:', error)
    // Fallback to rule-based content generation
    return generateFallbackContent(companyData)
  }
}

function generateDefaultValueProps(companyData: CompanyData) {
  const props = [
    {
      title: 'Eliminate Manual Data Entry',
      description: `Save hours every week by automating document processing and data capture specifically for ${companyData.industry} businesses like yours.`,
      icon: '⚡',
    },
    {
      title: 'Seamless ERP Integration',
      description:
        'Connect directly with your existing systems including Microsoft Dynamics, SAP, NetSuite, and more without disrupting current workflows.',
      icon: '🔗',
    },
    {
      title: 'Industry-Specific Solutions',
      description: `Customized workflow automation designed for the unique challenges of ${companyData.industry} organizations.`,
      icon: '🎯',
    },
  ]

  return props
}

function recommendSolutions(companyData: CompanyData): PersonalizedContent['recommendedSolutions'] {
  const solutions: PersonalizedContent['recommendedSolutions'] = []

  // Rule-based solution recommendation
  if (
    companyData.painPoints.some(p =>
      p.toLowerCase().includes('invoice' || 'billing' || 'payable')
    )
  ) {
    solutions.push({
      name: MOSAIC_SOLUTIONS.apAutomation.name,
      description: `Perfect for ${companyData.name}'s invoice processing needs`,
      benefits: MOSAIC_SOLUTIONS.apAutomation.benefits,
      roi: '80% reduction in processing time',
    })
  }

  if (companyData.industry === 'Healthcare' || companyData.painPoints.some(p => p.toLowerCase().includes('hr' || 'employee'))) {
    solutions.push({
      name: MOSAIC_SOLUTIONS.hrAutomation.name,
      description: `HIPAA-compliant HR automation for ${companyData.industry} organizations`,
      benefits: MOSAIC_SOLUTIONS.hrAutomation.benefits,
      roi: '60% faster onboarding',
    })
  }

  if (
    companyData.industry === 'Manufacturing' ||
    companyData.painPoints.some(p => p.toLowerCase().includes('freight' || 'shipping'))
  ) {
    solutions.push({
      name: MOSAIC_SOLUTIONS.freightAutomation.name,
      description: `Streamline shipping and logistics for ${companyData.name}`,
      benefits: MOSAIC_SOLUTIONS.freightAutomation.benefits,
      roi: '50% faster billing cycles',
    })
  }

  // Always recommend ECM and IDC as foundation
  solutions.push({
    name: MOSAIC_SOLUTIONS.intelligentDataCapture.name,
    description: 'AI-powered document processing foundation',
    benefits: MOSAIC_SOLUTIONS.intelligentDataCapture.benefits,
    roi: '95%+ accuracy rate',
  })

  return solutions.slice(0, 3)
}

function generateDefaultPitch(companyData: CompanyData): string {
  return `Dear ${companyData.name} Team,

We understand that ${companyData.industry} organizations like yours face unique challenges when it comes to document management and workflow automation. ${companyData.painPoints.length > 0 ? `We've identified that you may be experiencing challenges with ${companyData.painPoints.slice(0, 2).join(' and ')}.` : 'Manual processes can significantly impact your operational efficiency.'}

Mosaic Corporation has helped hundreds of ${companyData.industry} companies transform their operations through customized workflow automation. Our solutions eliminate manual data entry, reduce errors by up to 95%, and deliver measurable ROI within months.

With seamless integration to major ERP systems and industry-specific customizations, we can help ${companyData.name} move forward without the burden of legacy paper-based processes.

Let's discuss how we can customize a solution specifically for your needs.`
}

function generateFallbackContent(companyData: CompanyData): PersonalizedContent {
  return {
    headline: `Transform ${companyData.name} with Intelligent Automation`,
    subheadline: `Customized workflow solutions for ${companyData.industry} excellence`,
    valuePropositions: generateDefaultValueProps(companyData),
    recommendedSolutions: recommendSolutions(companyData),
    customPitch: generateDefaultPitch(companyData),
    cta: 'Talk to a Consultant Today',
  }
}
