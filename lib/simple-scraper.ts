// Simplified scraper - works without Puppeteer (no browser needed!)
// @ts-nocheck
import axios from 'axios'
import * as cheerio from 'cheerio'

export interface CompanyData {
  name: string
  description: string
  industry: string
  companySize: string
  techStack: string[]
  painPoints: string[]
  logo?: string
  metadata: {
    hasEcommerce: boolean
    hasDocumentation: boolean
    hasAutomation: boolean
    usesManualProcesses: boolean
  }
}

export async function scrapeCompanyWebsite(url: string): Promise<CompanyData> {
  const normalizedUrl = url.startsWith('http') ? url : `https://${url}`

  try {
    const response = await axios.get(normalizedUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      maxRedirects: 5,
    })

    const $ = cheerio.load(response.data)
    const domain = new URL(normalizedUrl).hostname.replace('www.', '')

    // Extract company name
    const companyName =
      $('meta[property="og:site_name"]').attr('content') ||
      $('meta[name="application-name"]').attr('content') ||
      $('title').text().split('|')[0].split('-')[0].trim() ||
      domain.split('.')[0]

    // Extract description
    const description =
      $('meta[name="description"]').attr('content') ||
      $('meta[property="og:description"]').attr('content') ||
      $('p').first().text().trim() ||
      'No description available'

    // Extract logo
    const logo =
      $('meta[property="og:image"]').attr('content') ||
      $('link[rel="icon"]').attr('href') ||
      `https://logo.clearbit.com/${domain}`

    const html = response.data.toLowerCase()
    const text = $('body').text().toLowerCase()

    return {
      name: companyName,
      description: description.substring(0, 500),
      industry: detectIndustry(text),
      companySize: estimateSize($),
      techStack: detectTechStack(html),
      painPoints: identifyPainPoints(text),
      logo,
      metadata: {
        hasEcommerce: /cart|checkout|shop|ecommerce/.test(text),
        hasDocumentation: /documentation|docs|api/.test(text),
        hasAutomation: /automat/.test(text),
        usesManualProcesses: /manual|paperwork|filing/.test(text),
      },
    }
  } catch (error) {
    console.error('Scraping error:', error)

    // Fallback data
    const domain = new URL(normalizedUrl).hostname.replace('www.', '')
    return {
      name: domain.split('.')[0],
      description: `A business focused on innovation and growth`,
      industry: 'Professional Services',
      companySize: '10-50 employees',
      techStack: [],
      painPoints: ['Manual processes', 'Document management', 'Workflow inefficiencies'],
      logo: `https://logo.clearbit.com/${domain}`,
      metadata: {
        hasEcommerce: false,
        hasDocumentation: false,
        hasAutomation: false,
        usesManualProcesses: true,
      },
    }
  }
}

function detectIndustry(text: string): string {
  const industries: Record<string, string[]> = {
    'Healthcare': ['healthcare', 'medical', 'hospital', 'patient', 'clinic', 'dental', 'hipaa'],
    'Manufacturing': ['manufacturing', 'production', 'factory', 'supply chain', 'logistics'],
    'Construction': ['construction', 'building', 'contractor', 'development'],
    'Education': ['education', 'school', 'university', 'learning', 'student'],
    'Finance': ['finance', 'banking', 'investment', 'accounting', 'financial'],
    'Legal': ['legal', 'law firm', 'attorney', 'lawyer'],
    'Retail': ['retail', 'store', 'shopping', 'ecommerce'],
    'Technology': ['software', 'technology', 'saas', 'platform', 'api'],
    'Real Estate': ['real estate', 'property', 'realtor'],
  }

  for (const [industry, keywords] of Object.entries(industries)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return industry
    }
  }

  return 'Professional Services'
}

function estimateSize($: cheerio.CheerioAPI): string {
  const text = $('body').text().toLowerCase()
  const navItems = $('nav a, header a').length

  if (text.includes('enterprise') || navItems > 20) {
    return '200+ employees'
  } else if (text.includes('careers') || navItems > 10) {
    return '50-200 employees'
  } else if (navItems > 5) {
    return '10-50 employees'
  }
  return '1-10 employees'
}

function detectTechStack(html: string): string[] {
  const stack: string[] = []
  const indicators: Record<string, string[]> = {
    'Shopify': ['cdn.shopify.com', 'shopify'],
    'WordPress': ['wp-content', 'wordpress'],
    'React': ['react', '__react'],
    'Salesforce': ['salesforce.com'],
    'HubSpot': ['hubspot', 'hs-scripts'],
    'Google Analytics': ['google-analytics', 'gtag'],
  }

  for (const [tech, patterns] of Object.entries(indicators)) {
    if (patterns.some(pattern => html.includes(pattern))) {
      stack.push(tech)
    }
  }

  return stack
}

function identifyPainPoints(text: string): string[] {
  const painPoints: string[] = []
  const indicators: Record<string, string[]> = {
    'Manual data entry': ['manual', 'data entry', 'paperwork'],
    'Invoice processing delays': ['invoice', 'billing', 'accounts payable'],
    'Document management challenges': ['document', 'filing', 'storage', 'paper'],
    'Slow approval workflows': ['approval', 'workflow', 'process'],
    'Compliance concerns': ['compliance', 'audit', 'regulation'],
  }

  for (const [painPoint, keywords] of Object.entries(indicators)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      painPoints.push(painPoint)
    }
  }

  if (painPoints.length === 0) {
    painPoints.push('Manual processes', 'Workflow inefficiencies')
  }

  return painPoints.slice(0, 5)
}
