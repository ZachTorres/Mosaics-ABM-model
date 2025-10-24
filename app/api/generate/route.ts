import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

// Enhanced company data interface
interface CompanyData {
  name: string
  url: string
  industry: string
  description: string
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  metaData: {
    title: string
    description: string
    keywords: string[]
  }
  logoUrl?: string
}

// Scrape real company website data
async function scrapeCompanyWebsite(url: string): Promise<CompanyData> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}`)
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // Extract company name
    const companyName =
      $('meta[property="og:site_name"]').attr('content') ||
      $('meta[name="application-name"]').attr('content') ||
      $('title').text().split('|')[0].split('-')[0].trim() ||
      extractCompanyNameFromUrl(url)

    // Extract description
    const description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      $('p').first().text().substring(0, 200) ||
      'A leading company in their industry'

    // Extract meta title
    const metaTitle = $('title').text() || companyName

    // Extract keywords
    const keywordsMeta = $('meta[name="keywords"]').attr('content') || ''
    const keywords = keywordsMeta.split(',').map(k => k.trim()).filter(k => k)

    // Extract logo
    const logoUrl =
      $('meta[property="og:image"]').attr('content') ||
      $('link[rel="icon"]').attr('href') ||
      $('link[rel="apple-touch-icon"]').attr('href') ||
      undefined

    // Extract colors from CSS and style tags
    const colors = await extractColors($, url)

    // Detect industry
    const industry = detectIndustry(url, description, metaTitle, keywords)

    return {
      name: companyName,
      url,
      industry,
      description,
      colors,
      metaData: {
        title: metaTitle,
        description,
        keywords
      },
      logoUrl
    }
  } catch (error) {
    console.error('Scraping error:', error)
    // Fallback to basic extraction
    return {
      name: extractCompanyNameFromUrl(url),
      url,
      industry: detectIndustry(url, '', '', []),
      description: 'A leading company in their industry',
      colors: getDefaultColors(),
      metaData: {
        title: extractCompanyNameFromUrl(url),
        description: '',
        keywords: []
      }
    }
  }
}

// Extract colors from website
async function extractColors($: cheerio.CheerioAPI, url: string): Promise<{ primary: string, secondary: string, accent: string }> {
  const colors: string[] = []

  // Extract from inline styles
  $('[style]').each((_, elem) => {
    const style = $(elem).attr('style') || ''
    const colorMatches = style.match(/#[0-9A-Fa-f]{6}|rgb\([^)]+\)/g)
    if (colorMatches) {
      colors.push(...colorMatches)
    }
  })

  // Extract from style tags
  $('style').each((_, elem) => {
    const css = $(elem).html() || ''
    const colorMatches = css.match(/#[0-9A-Fa-f]{6}|rgb\([^)]+\)/g)
    if (colorMatches) {
      colors.push(...colorMatches)
    }
  })

  // Convert rgb to hex and filter unique colors
  const hexColors = colors
    .map(color => {
      if (color.startsWith('rgb')) {
        const matches = color.match(/\d+/g)
        if (matches && matches.length >= 3) {
          const r = parseInt(matches[0])
          const g = parseInt(matches[1])
          const b = parseInt(matches[2])
          return rgbToHex(r, g, b)
        }
      }
      return color.toLowerCase()
    })
    .filter((color, index, self) => self.indexOf(color) === index)
    .filter(color => !isGrayscale(color)) // Filter out grays/blacks/whites
    .slice(0, 10)

  if (hexColors.length >= 3) {
    return {
      primary: hexColors[0],
      secondary: hexColors[1],
      accent: hexColors[2]
    }
  } else if (hexColors.length > 0) {
    return {
      primary: hexColors[0],
      secondary: hexColors[0],
      accent: hexColors[0]
    }
  } else {
    return getDefaultColors()
  }
}

// Helper: RGB to Hex
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

// Helper: Check if color is grayscale
function isGrayscale(hex: string): boolean {
  if (!hex.startsWith('#')) return false
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  // Consider it grayscale if RGB values are close to each other
  const diff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b))
  return diff < 30
}

// Helper: Get default colors
function getDefaultColors() {
  return {
    primary: '#2563eb',
    secondary: '#4f46e5',
    accent: '#3b82f6'
  }
}

// Extract company name from URL
function extractCompanyNameFromUrl(url: string): string {
  try {
    const domain = url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
    const name = domain.split('.')[0]
    return name.charAt(0).toUpperCase() + name.slice(1)
  } catch {
    return 'Company'
  }
}

// Enhanced industry detection
function detectIndustry(url: string, description: string, title: string, keywords: string[]): string {
  const combined = `${url} ${description} ${title} ${keywords.join(' ')}`.toLowerCase()

  const patterns = {
    'Technology': ['tech', 'software', 'app', 'saas', 'cloud', 'digital', 'ai', 'data', 'analytics', 'platform'],
    'Healthcare': ['health', 'medical', 'hospital', 'clinic', 'pharma', 'patient', 'care', 'medicine', 'doctor'],
    'Financial Services': ['finance', 'bank', 'invest', 'insurance', 'wealth', 'credit', 'loan', 'payment', 'fintech'],
    'Retail': ['retail', 'shop', 'store', 'ecommerce', 'e-commerce', 'fashion', 'clothing', 'merchandise'],
    'Education': ['education', 'university', 'college', 'school', 'learning', 'course', 'student', 'academic'],
    'Manufacturing': ['manufacturing', 'industrial', 'factory', 'production', 'assembly', 'machinery'],
    'Real Estate': ['real estate', 'property', 'realtor', 'housing', 'apartment', 'commercial property'],
    'Consulting': ['consulting', 'advisory', 'professional services', 'strategy', 'management consulting'],
    'Marketing': ['marketing', 'advertising', 'branding', 'agency', 'creative', 'media', 'campaign'],
    'Logistics': ['logistics', 'shipping', 'freight', 'supply chain', 'warehouse', 'delivery', 'transport']
  }

  for (const [industry, terms] of Object.entries(patterns)) {
    if (terms.some(term => combined.includes(term))) {
      return industry
    }
  }

  return 'Business Services'
}

// Enhanced content generation with deep personalization
function generatePersonalizedContent(companyData: CompanyData) {
  const industryContent: Record<string, any> = {
    'Technology': {
      painPoints: [
        `Integrating ${companyData.name}'s existing tech stack with modern automation solutions`,
        'Managing complex workflows across multiple development and deployment pipelines',
        'Scaling infrastructure while maintaining security and compliance standards',
        'Reducing manual processes that slow down innovation and time-to-market'
      ],
      solutions: [
        `Custom workflow automation tailored to ${companyData.name}'s unique tech architecture`,
        'Seamless API integrations with your existing development tools and platforms',
        'Intelligent document processing to eliminate manual data entry across systems',
        'Real-time monitoring and automated compliance reporting for your tech operations'
      ],
      headline: `Accelerate ${companyData.name}'s Innovation with Mosaic Automation`,
      pitch: `${companyData.name} is building cutting-edge technology. But manual processes are holding your team back. Mosaic's intelligent automation platform eliminates the repetitive tasks that slow down innovation, so your engineers can focus on what they do best: building great products.`
    },
    'Healthcare': {
      painPoints: [
        `Managing patient data and records across ${companyData.name}'s multiple systems and locations`,
        'Ensuring HIPAA compliance while streamlining administrative workflows',
        'Reducing the time medical staff spend on paperwork and data entry',
        'Coordinating care and communication between departments and facilities'
      ],
      solutions: [
        `HIPAA-compliant automation that works within ${companyData.name}'s existing healthcare IT infrastructure`,
        'Automated patient record processing and intelligent data extraction from medical documents',
        'Streamlined billing and insurance claim processing reducing administrative burden by 40%',
        'Real-time care coordination workflows connecting all departments and providers'
      ],
      headline: `Transform ${companyData.name}'s Healthcare Operations with Mosaic`,
      pitch: `${companyData.name} is focused on delivering exceptional patient care. Mosaic automates the administrative tasks that take time away from patients—from document processing to billing to care coordination. More time for care, less time on paperwork.`
    },
    'Financial Services': {
      painPoints: [
        `Processing high volumes of financial documents and transactions at ${companyData.name}`,
        'Maintaining regulatory compliance across multiple jurisdictions and frameworks',
        'Reducing risk while accelerating customer onboarding and service delivery',
        'Integrating data from legacy systems with modern digital banking platforms'
      ],
      solutions: [
        `Intelligent document processing for ${companyData.name}'s financial operations with 99.9% accuracy`,
        'Automated compliance monitoring and reporting across all regulatory requirements',
        'Streamlined KYC and customer onboarding reducing time-to-approval by 75%',
        'Secure data integration connecting your core banking systems with digital channels'
      ],
      headline: `Power ${companyData.name}'s Digital Transformation with Mosaic`,
      pitch: `${companyData.name} operates in a highly regulated, fast-paced environment. Mosaic's automation platform helps you move faster while staying compliant—processing documents instantly, onboarding customers in minutes instead of days, and reducing operational risk.`
    },
    'Retail': {
      painPoints: [
        `Managing inventory and orders across ${companyData.name}'s multiple sales channels`,
        'Processing supplier invoices, purchase orders, and shipping documents efficiently',
        'Coordinating between warehouses, retail locations, and e-commerce operations',
        'Delivering personalized customer experiences while scaling operations'
      ],
      solutions: [
        `Unified automation platform connecting ${companyData.name}'s entire retail ecosystem`,
        'Automated invoice and order processing eliminating manual data entry errors',
        'Real-time inventory synchronization across all channels and locations',
        'Intelligent customer data management for personalized omnichannel experiences'
      ],
      headline: `Scale ${companyData.name}'s Retail Operations with Mosaic Automation`,
      pitch: `${companyData.name} is growing fast, but manual processes are creating bottlenecks. Mosaic automates everything from purchase orders to inventory management to customer service—helping you scale seamlessly while delivering the personalized experiences customers expect.`
    },
    'Education': {
      painPoints: [
        `Managing student records and enrollment processes across ${companyData.name}'s programs`,
        'Coordinating communication between students, faculty, and administrative staff',
        'Processing financial aid applications and tuition payments efficiently',
        'Maintaining compliance with educational regulations and accreditation standards'
      ],
      solutions: [
        `Automated enrollment and student record management for ${companyData.name}`,
        'Intelligent document processing for financial aid and admissions applications',
        'Unified communication platform connecting all stakeholders in real-time',
        'Compliance-ready workflows meeting all educational regulations and standards'
      ],
      headline: `Modernize ${companyData.name}'s Educational Operations with Mosaic`,
      pitch: `${companyData.name} is focused on student success. Mosaic automates the administrative tasks that take time away from education—from enrollment to financial aid to record keeping. Spend less time on paperwork, more time on students.`
    }
  }

  const defaultContent = {
    painPoints: [
      `Managing complex workflows and processes across ${companyData.name}'s organization`,
      'Reducing time spent on manual data entry and document processing',
      'Improving collaboration and communication between departments',
      'Gaining real-time visibility into operations and performance metrics'
    ],
    solutions: [
      `Custom workflow automation designed specifically for ${companyData.name}'s unique needs`,
      'Intelligent document processing eliminating manual data entry across your organization',
      'Unified platform connecting all teams, systems, and processes in real-time',
      'Advanced analytics providing actionable insights into your operations'
    ],
    headline: `Transform ${companyData.name}'s Operations with Mosaic Automation`,
    pitch: `${companyData.name} has unique operational challenges. Mosaic's intelligent automation platform is designed to handle them—automating workflows, processing documents, and connecting systems so your team can focus on what matters most: growing your business.`
  }

  const content = industryContent[companyData.industry] || defaultContent

  return {
    companyName: companyData.name,
    url: companyData.url,
    industry: companyData.industry,
    description: companyData.description,
    headline: content.headline,
    subheadline: content.pitch,
    painPoints: content.painPoints,
    solutions: content.solutions,
    colors: companyData.colors,
    logoUrl: companyData.logoUrl,
    cta: `See how Mosaic can transform ${companyData.name}`
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url } = body

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'Please provide a valid URL' },
        { status: 400 }
      )
    }

    // Normalize the URL
    let normalizedUrl = url.trim()
    if (!normalizedUrl.startsWith('http')) {
      normalizedUrl = 'https://' + normalizedUrl
    }

    console.log(`🔍 Scraping ${normalizedUrl}...`)

    // Scrape company website
    const companyData = await scrapeCompanyWebsite(normalizedUrl)

    console.log(`✅ Scraped: ${companyData.name} (${companyData.industry})`)
    console.log(`🎨 Colors: ${companyData.colors.primary}, ${companyData.colors.secondary}, ${companyData.colors.accent}`)

    // Generate personalized content
    const microsite = generatePersonalizedContent(companyData)

    return NextResponse.json({
      success: true,
      microsite
    })

  } catch (error: any) {
    console.error('❌ Error generating microsite:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate microsite' },
      { status: 500 }
    )
  }
}
