// Simple AI with graceful fallback when API key not configured
import { CompanyData } from './simple-scraper'
import { storage } from './storage'

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
    description: 'Streamline invoice processing with automated workflows',
    benefits: [
      'Eliminate manual data entry',
      'Reduce processing time by 80%',
      'Improve accuracy',
      'Accelerate payments',
    ],
  },
  hrAutomation: {
    name: 'HR Automation',
    description: 'Paperless employee management and onboarding',
    benefits: [
      'HIPAA-compliant storage',
      'Streamlined onboarding',
      'Centralized records',
      'Automated tracking',
    ],
  },
  intelligentDataCapture: {
    name: 'Intelligent Data Capture',
    description: 'AI-powered document processing',
    benefits: [
      'Automatic classification',
      'Data validation',
      'Intelligent routing',
      'Multi-format support',
    ],
  },
}

export async function generatePersonalizedContent(
  companyData: CompanyData
): Promise<PersonalizedContent> {
  const settings = storage.getSettings()

  // Try AI generation if API key is configured
  if (settings.openaiApiKey) {
    try {
      return await generateWithAI(companyData, settings.openaiApiKey)
    } catch (error) {
      console.error('AI generation failed, using template:', error)
    }
  }

  // Fallback to intelligent templates
  return generateFromTemplate(companyData)
}

async function generateWithAI(
  companyData: CompanyData,
  apiKey: string
): Promise<PersonalizedContent> {
  const OpenAI = (await import('openai')).default
  const openai = new OpenAI({ apiKey })

  const prompt = `Create personalized ABM content for ${companyData.name}, a ${companyData.industry} company.

Pain points: ${companyData.painPoints.join(', ')}
Size: ${companyData.companySize}

Generate JSON with:
- headline (80 chars max)
- subheadline (150 chars max)
- 3 valuePropositions with title, description, icon emoji
- 2-3 recommendedSolutions with name, description, benefits array, roi
- customPitch (3 paragraphs)
- cta text

Focus on Mosaic's workflow automation solutions.`

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are a B2B marketing expert. Return only valid JSON.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' },
  })

  const content = JSON.parse(response.choices[0].message.content || '{}')
  return {
    headline: content.headline || generateFromTemplate(companyData).headline,
    subheadline: content.subheadline || generateFromTemplate(companyData).subheadline,
    valuePropositions:
      content.valuePropositions || generateFromTemplate(companyData).valuePropositions,
    recommendedSolutions:
      content.recommendedSolutions || generateFromTemplate(companyData).recommendedSolutions,
    customPitch: content.customPitch || generateFromTemplate(companyData).customPitch,
    cta: content.cta || 'Schedule Your Consultation',
  }
}

function generateFromTemplate(companyData: CompanyData): PersonalizedContent {
  const industry = companyData.industry
  const companyName = companyData.name

  return {
    headline: `Transform ${companyName} with Intelligent Automation`,
    subheadline: `Eliminate manual processes and accelerate ${industry.toLowerCase()} operations`,
    valuePropositions: [
      {
        title: 'Eliminate Manual Work',
        description: `Save hours every week by automating document processing and workflows specifically designed for ${industry} businesses like ${companyName}.`,
        icon: '⚡',
      },
      {
        title: 'Seamless Integration',
        description:
          'Connect directly with your existing ERP systems including Microsoft Dynamics, SAP, NetSuite, and more.',
        icon: '🔗',
      },
      {
        title: `Built for ${industry}`,
        description: `Industry-specific automation designed for the unique challenges of ${industry} organizations.`,
        icon: '🎯',
      },
    ],
    recommendedSolutions: recommendSolutions(companyData),
    customPitch: generatePitch(companyData),
    cta: 'Get Your Custom Solution',
  }
}

function recommendSolutions(
  companyData: CompanyData
): PersonalizedContent['recommendedSolutions'] {
  const solutions: PersonalizedContent['recommendedSolutions'] = []

  // Rule-based recommendation
  if (companyData.painPoints.some(p => p.toLowerCase().includes('invoice'))) {
    solutions.push({
      name: MOSAIC_SOLUTIONS.apAutomation.name,
      description: MOSAIC_SOLUTIONS.apAutomation.description,
      benefits: MOSAIC_SOLUTIONS.apAutomation.benefits,
      roi: '80% faster processing',
    })
  }

  if (companyData.industry === 'Healthcare' || companyData.painPoints.some(p => p.toLowerCase().includes('hr'))) {
    solutions.push({
      name: MOSAIC_SOLUTIONS.hrAutomation.name,
      description: MOSAIC_SOLUTIONS.hrAutomation.description,
      benefits: MOSAIC_SOLUTIONS.hrAutomation.benefits,
      roi: '60% faster onboarding',
    })
  }

  // Always include data capture
  solutions.push({
    name: MOSAIC_SOLUTIONS.intelligentDataCapture.name,
    description: MOSAIC_SOLUTIONS.intelligentDataCapture.description,
    benefits: MOSAIC_SOLUTIONS.intelligentDataCapture.benefits,
    roi: '95%+ accuracy',
  })

  return solutions.slice(0, 3)
}

function generatePitch(companyData: CompanyData): string {
  return `Dear ${companyData.name} Team,

We understand that ${companyData.industry} organizations like yours face unique challenges when it comes to document management and workflow automation. ${companyData.painPoints.length > 0 ? `We've identified that you may be experiencing challenges with ${companyData.painPoints.slice(0, 2).join(' and ')}.` : 'Manual processes can significantly impact operational efficiency.'}

Mosaic Corporation has helped hundreds of ${companyData.industry} companies transform their operations through customized workflow automation. Our solutions eliminate manual data entry, reduce errors by up to 95%, and deliver measurable ROI within months.

With seamless integration to major ERP systems and industry-specific customizations, we can help ${companyData.name} move forward without the burden of legacy paper-based processes. Let's discuss how we can customize a solution specifically for your needs.`
}
