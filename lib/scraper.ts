import puppeteer from 'puppeteer'
import * as cheerio from 'cheerio'
import axios from 'axios'

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
    // Launch headless browser
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    const page = await browser.newPage()
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    )

    // Navigate to the page
    await page.goto(normalizedUrl, {
      waitUntil: 'networkidle0',
      timeout: 30000
    })

    // Get page content
    const html = await page.content()
    const $ = cheerio.load(html)

    // Extract company name
    const companyName =
      $('meta[property="og:site_name"]').attr('content') ||
      $('meta[name="application-name"]').attr('content') ||
      $('title').text().split('|')[0].trim() ||
      'Unknown Company'

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
      `https://logo.clearbit.com/${new URL(normalizedUrl).hostname}`

    // Detect tech stack from page
    const techStack = detectTechStack(html)

    // Analyze industry based on keywords
    const industry = detectIndustry($, html)

    // Estimate company size based on website complexity
    const companySize = estimateCompanySize($)

    // Identify pain points based on content analysis
    const painPoints = identifyPainPoints($, html)

    // Analyze metadata for automation opportunities
    const metadata = analyzeMetadata($, html)

    await browser.close()

    return {
      name: companyName,
      description: description.substring(0, 500),
      industry,
      companySize,
      techStack,
      painPoints,
      logo,
      metadata,
    }
  } catch (error) {
    console.error('Error scraping website:', error)

    // Fallback to basic axios request
    try {
      const response = await axios.get(normalizedUrl, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      })

      const $ = cheerio.load(response.data)
      const domain = new URL(normalizedUrl).hostname.replace('www.', '')

      return {
        name: $('title').text().split('|')[0].trim() || domain,
        description: $('meta[name="description"]').attr('content') || 'No description available',
        industry: 'General Business',
        companySize: 'Unknown',
        techStack: [],
        painPoints: ['Manual processes', 'Data entry inefficiency'],
        logo: `https://logo.clearbit.com/${domain}`,
        metadata: {
          hasEcommerce: false,
          hasDocumentation: false,
          hasAutomation: false,
          usesManualProcesses: true,
        },
      }
    } catch (fallbackError) {
      throw new Error('Failed to scrape website')
    }
  }
}

function detectTechStack(html: string): string[] {
  const stack: string[] = []
  const htmlLower = html.toLowerCase()

  // Common tech indicators
  const techIndicators: Record<string, string[]> = {
    'Shopify': ['cdn.shopify.com', 'shopify analytics'],
    'WordPress': ['wp-content', 'wordpress'],
    'React': ['react', '__react'],
    'Angular': ['ng-', 'angular'],
    'Vue': ['vue', '__vue__'],
    'Salesforce': ['salesforce.com', 'force.com'],
    'HubSpot': ['hubspot', 'hs-scripts'],
    'Google Analytics': ['google-analytics.com', 'gtag'],
    'Stripe': ['stripe.com', 'stripe.js'],
    'Mailchimp': ['mailchimp', 'mc.js'],
  }

  for (const [tech, indicators] of Object.entries(techIndicators)) {
    if (indicators.some(indicator => htmlLower.includes(indicator))) {
      stack.push(tech)
    }
  }

  return stack
}

function detectIndustry($: cheerio.CheerioAPI, html: string): string {
  const text = $.text().toLowerCase()

  const industries: Record<string, string[]> = {
    'Healthcare': ['healthcare', 'medical', 'hospital', 'patient', 'clinic', 'dental', 'hipaa'],
    'Manufacturing': ['manufacturing', 'production', 'factory', 'supply chain', 'logistics', 'warehouse'],
    'Construction': ['construction', 'building', 'contractor', 'development'],
    'Education': ['education', 'school', 'university', 'learning', 'student'],
    'Finance': ['finance', 'banking', 'investment', 'accounting', 'financial'],
    'Legal': ['legal', 'law firm', 'attorney', 'lawyer'],
    'Retail': ['retail', 'store', 'shopping', 'ecommerce', 'e-commerce'],
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

function estimateCompanySize($: cheerio.CheerioAPI): string {
  const teamPage = $.text().toLowerCase()
  const hasCareerPage = teamPage.includes('careers') || teamPage.includes('join our team')
  const hasMultipleLocations = teamPage.includes('locations') && teamPage.includes('offices')
  const navItems = $('nav a, header a').length

  if (hasMultipleLocations || navItems > 20) {
    return '200+ employees'
  } else if (hasCareerPage || navItems > 10) {
    return '50-200 employees'
  } else if (navItems > 5) {
    return '10-50 employees'
  }

  return '1-10 employees'
}

function identifyPainPoints($: cheerio.CheerioAPI, html: string): string[] {
  const painPoints: string[] = []
  const text = $.text().toLowerCase()

  const painPointIndicators: Record<string, string[]> = {
    'Manual data entry': ['manual', 'data entry', 'paperwork', 'filing'],
    'Inefficient invoice processing': ['invoice', 'billing', 'accounts payable', 'payment processing'],
    'Document management challenges': ['document', 'filing', 'storage', 'paper'],
    'Slow approval workflows': ['approval', 'workflow', 'process', 'bottleneck'],
    'Compliance and audit concerns': ['compliance', 'audit', 'regulation', 'hipaa', 'gdpr'],
    'Data accuracy issues': ['error', 'mistake', 'accuracy', 'validation'],
    'Integration complexity': ['integration', 'system', 'erp', 'multiple platforms'],
    'Scalability limitations': ['scale', 'growth', 'expand', 'capacity'],
  }

  for (const [painPoint, indicators] of Object.entries(painPointIndicators)) {
    if (indicators.some(indicator => text.includes(indicator))) {
      painPoints.push(painPoint)
    }
  }

  // Default pain points if none detected
  if (painPoints.length === 0) {
    painPoints.push('Manual processes', 'Inefficient workflows', 'Document management')
  }

  return painPoints.slice(0, 5)
}

function analyzeMetadata($: cheerio.CheerioAPI, html: string): CompanyData['metadata'] {
  const text = $.text().toLowerCase()

  return {
    hasEcommerce: text.includes('cart') || text.includes('checkout') || text.includes('shop'),
    hasDocumentation: text.includes('documentation') || text.includes('docs') || text.includes('api'),
    hasAutomation: text.includes('automation') || text.includes('automated'),
    usesManualProcesses: text.includes('manual') || text.includes('paperwork') || text.includes('filing'),
  }
}
