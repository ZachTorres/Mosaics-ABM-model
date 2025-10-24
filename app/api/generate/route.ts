import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

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
  businessContext: {
    mainServices: string[]
    keyOperations: string[]
    painPoints: string[]
    departments: string[]
    contentThemes: string[]
  }
  size: 'small' | 'medium' | 'large' | 'enterprise'
}

// Deep scrape company website for rich context
async function deepScrapeCompany(url: string): Promise<CompanyData> {
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
      $('p').first().text().substring(0, 300) ||
      'A leading company in their industry'

    // Extract ALL text content from the page for deep analysis
    const pageText = $('body').text().toLowerCase()
    const headings = $('h1, h2, h3').map((_, el) => $(el).text()).get().join(' ').toLowerCase()
    const metaKeywords = $('meta[name="keywords"]').attr('content') || ''

    // Analyze business context from page content
    const businessContext = analyzeBusinessContext(pageText, headings, description)

    // Detect industry with deep analysis
    const industry = detectIndustryDeep(url, description, headings, pageText, businessContext)

    // Estimate company size
    const size = estimateCompanySize(pageText, description)

    // Extract colors
    const colors = await extractColors($, url)

    return {
      name: companyName,
      url,
      industry,
      description,
      colors,
      businessContext,
      size
    }
  } catch (error) {
    console.error('Deep scraping error:', error)
    return getFallbackData(url)
  }
}

// Analyze business context from page content
function analyzeBusinessContext(pageText: string, headings: string, description: string): CompanyData['businessContext'] {
  const combined = `${pageText} ${headings} ${description}`.toLowerCase()

  // Detect main services/offerings
  const serviceKeywords = {
    'Software/SaaS': ['software', 'platform', 'saas', 'application', 'cloud', 'api', 'integration'],
    'Consulting': ['consulting', 'advisory', 'strategy', 'professional services'],
    'Healthcare Services': ['patient', 'care', 'medical', 'clinical', 'treatment', 'health'],
    'Financial Services': ['investment', 'banking', 'insurance', 'loans', 'financial planning'],
    'Manufacturing': ['manufacturing', 'production', 'assembly', 'supply chain', 'distribution'],
    'Retail/E-commerce': ['shop', 'store', 'ecommerce', 'products', 'merchandise', 'customers'],
    'Education': ['students', 'courses', 'learning', 'education', 'training', 'curriculum']
  }

  const mainServices: string[] = []
  for (const [service, keywords] of Object.entries(serviceKeywords)) {
    const matches = keywords.filter(kw => combined.includes(kw)).length
    if (matches >= 2) mainServices.push(service)
  }

  // Detect key operations that need automation
  const operationKeywords = {
    'Invoice Processing': ['invoice', 'billing', 'accounts payable', 'ap', 'vendor'],
    'Order Management': ['orders', 'order processing', 'sales order', 'fulfillment', 'purchasing'],
    'Document Management': ['documents', 'files', 'records', 'paperwork', 'forms'],
    'HR/Payroll': ['payroll', 'hr', 'human resources', 'employees', 'onboarding'],
    'Customer Service': ['customer support', 'service', 'help desk', 'tickets'],
    'Compliance/Regulatory': ['compliance', 'regulatory', 'audit', 'governance']
  }

  const keyOperations: string[] = []
  for (const [operation, keywords] of Object.entries(operationKeywords)) {
    if (keywords.some(kw => combined.includes(kw))) {
      keyOperations.push(operation)
    }
  }

  // Detect pain points from common phrases
  const painPoints: string[] = []
  const painIndicators = [
    { phrase: 'manual', point: 'Manual processes slowing down operations' },
    { phrase: 'paper', point: 'Paper-based workflows causing inefficiencies' },
    { phrase: 'error', point: 'Data entry errors impacting accuracy' },
    { phrase: 'time-consuming', point: 'Time-consuming administrative tasks' },
    { phrase: 'compliance', point: 'Compliance and audit trail challenges' },
    { phrase: 'integration', point: 'System integration and data silos' }
  ]

  painIndicators.forEach(({ phrase, point }) => {
    if (combined.includes(phrase)) painPoints.push(point)
  })

  // Detect departments
  const departments: string[] = []
  const deptKeywords = ['finance', 'accounting', 'hr', 'operations', 'sales', 'procurement', 'it', 'legal']
  deptKeywords.forEach(dept => {
    if (combined.includes(dept)) departments.push(dept.toUpperCase())
  })

  // Extract content themes
  const contentThemes: string[] = []
  const themeKeywords = {
    'efficiency': ['efficiency', 'productivity', 'streamline', 'optimize'],
    'innovation': ['innovation', 'transform', 'digital', 'technology'],
    'growth': ['growth', 'scale', 'expand', 'revenue'],
    'quality': ['quality', 'excellence', 'best', 'premium']
  }

  for (const [theme, keywords] of Object.entries(themeKeywords)) {
    if (keywords.some(kw => combined.includes(kw))) {
      contentThemes.push(theme)
    }
  }

  return {
    mainServices: mainServices.length > 0 ? mainServices : ['Business Services'],
    keyOperations: keyOperations.length > 0 ? keyOperations : ['Document Management'],
    painPoints: painPoints.length > 0 ? painPoints : ['Manual workflow inefficiencies'],
    departments,
    contentThemes
  }
}

// Detect industry with deep analysis
function detectIndustryDeep(url: string, description: string, headings: string, pageText: string, context: CompanyData['businessContext']): string {
  const combined = `${url} ${description} ${headings} ${pageText}`.toLowerCase()

  const industryPatterns = {
    'Healthcare': ['health', 'medical', 'hospital', 'clinic', 'pharma', 'patient', 'doctor', 'medicine', 'care'],
    'Financial Services': ['bank', 'finance', 'insurance', 'investment', 'loan', 'credit', 'wealth', 'fintech'],
    'Technology': ['tech', 'software', 'saas', 'cloud', 'digital', 'platform', 'app', 'api', 'data'],
    'Manufacturing': ['manufacturing', 'factory', 'production', 'industrial', 'assembly', 'supply chain'],
    'Retail': ['retail', 'store', 'shop', 'ecommerce', 'e-commerce', 'merchandise', 'fashion'],
    'Education': ['education', 'university', 'school', 'college', 'learning', 'student', 'academic'],
    'Real Estate': ['real estate', 'property', 'realtor', 'housing', 'commercial property'],
    'Legal': ['legal', 'law', 'attorney', 'lawyer', 'litigation', 'court'],
    'Professional Services': ['consulting', 'advisory', 'professional services', 'strategy']
  }

  let maxScore = 0
  let detectedIndustry = 'Business Services'

  for (const [industry, keywords] of Object.entries(industryPatterns)) {
    const score = keywords.filter(kw => combined.includes(kw)).length
    if (score > maxScore) {
      maxScore = score
      detectedIndustry = industry
    }
  }

  return detectedIndustry
}

// Estimate company size
function estimateCompanySize(pageText: string, description: string): 'small' | 'medium' | 'large' | 'enterprise' {
  const combined = `${pageText} ${description}`.toLowerCase()

  if (combined.includes('enterprise') || combined.includes('global') || combined.includes('worldwide')) {
    return 'enterprise'
  } else if (combined.includes('fortune') || combined.includes('leading') || combined.includes('largest')) {
    return 'large'
  } else if (combined.includes('growing') || combined.includes('mid-size')) {
    return 'medium'
  }

  return 'medium' // default
}

// Known brand colors database for popular companies
const BRAND_COLORS: Record<string, { primary: string, secondary: string, accent: string }> = {
  'stripe': { primary: '#635bff', secondary: '#0a2540', accent: '#00d4ff' },
  'spotify': { primary: '#1db954', secondary: '#191414', accent: '#1ed760' },
  'netflix': { primary: '#e50914', secondary: '#221f1f', accent: '#b20710' },
  'airbnb': { primary: '#ff5a5f', secondary: '#00a699', accent: '#fc642d' },
  'uber': { primary: '#000000', secondary: '#5fb709', accent: '#1fbad6' },
  'slack': { primary: '#4a154b', secondary: '#36c5f0', accent: '#2eb67d' },
  'twitter': { primary: '#1da1f2', secondary: '#14171a', accent: '#657786' },
  'facebook': { primary: '#1877f2', secondary: '#4267b2', accent: '#42b72a' },
  'linkedin': { primary: '#0077b5', secondary: '#00a0dc', accent: '#313335' },
  'microsoft': { primary: '#00a4ef', secondary: '#7fba00', accent: '#ffb900' },
  'google': { primary: '#4285f4', secondary: '#ea4335', accent: '#fbbc04' },
  'amazon': { primary: '#ff9900', secondary: '#146eb4', accent: '#232f3e' },
  'salesforce': { primary: '#00a1e0', secondary: '#032d60', accent: '#1798c1' },
  'shopify': { primary: '#96bf48', secondary: '#5e8e3e', accent: '#7ab55c' },
  'hubspot': { primary: '#ff7a59', secondary: '#33475b', accent: '#00bda5' },
  'zoom': { primary: '#2d8cff', secondary: '#0e5a8a', accent: '#1a73e8' },
  'dropbox': { primary: '#0061ff', secondary: '#1e87f0', accent: '#007ee5' },
  'nike': { primary: '#111111', secondary: '#757575', accent: '#ffffff' },
  'adidas': { primary: '#000000', secondary: '#767677', accent: '#eceff1' },
  'cocacola': { primary: '#f40009', secondary: '#000000', accent: '#ffffff' },
  'pepsi': { primary: '#004b93', secondary: '#e32934', accent: '#ffffff' },
  'starbucks': { primary: '#00704a', secondary: '#1e3932', accent: '#d4af37' },
  'mcdonalds': { primary: '#ffc72c', secondary: '#da291c', accent: '#27251f' },
  'target': { primary: '#cc0000', secondary: '#ffffff', accent: '#000000' },
  'walmart': { primary: '#0071ce', secondary: '#ffc220', accent: '#004f9a' },
  'tesla': { primary: '#cc0000', secondary: '#000000', accent: '#393c41' }
}

// Extract colors from website with multiple fallback methods
async function extractColors($: cheerio.CheerioAPI, url: string): Promise<{ primary: string, secondary: string, accent: string }> {
  // First, check if this is a known brand
  const domain = url.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].split('.')[0]
  if (BRAND_COLORS[domain]) {
    console.log(`🎨 Using known brand colors for: ${domain}`)
    return BRAND_COLORS[domain]
  }

  const colorFrequency: Record<string, number> = {}

  // Method 1: Check meta theme-color (highest priority)
  const themeColor = $('meta[name="theme-color"]').attr('content')
  if (themeColor) {
    extractColorFromText(themeColor, colorFrequency, 20)
    console.log(`🎨 Found theme-color meta tag: ${themeColor}`)
  }

  // Method 2: Extract from SVG elements (logos often contain brand colors)
  $('svg').each((_, elem) => {
    const svgHtml = $(elem).html() || ''
    const fill = $(elem).attr('fill') || ''
    const stroke = $(elem).attr('stroke') || ''

    extractColorFromText(svgHtml, colorFrequency, 8)
    extractColorFromText(fill, colorFrequency, 8)
    extractColorFromText(stroke, colorFrequency, 8)
  })

  // Method 3: Extract from inline styles (prioritize header, nav, buttons, CTAs)
  $('header, nav, .header, .navbar, button, .btn, .cta, a[class*="button"], a[class*="btn"]').each((_, elem) => {
    const style = $(elem).attr('style') || ''
    extractColorFromText(style, colorFrequency, 5)
  })

  // Method 4: Extract from all elements with background/color attributes
  $('[style*="background"], [style*="color"], [bgcolor], [color]').each((_, elem) => {
    const style = $(elem).attr('style') || ''
    const bgcolor = $(elem).attr('bgcolor') || ''
    const color = $(elem).attr('color') || ''

    extractColorFromText(style, colorFrequency, 3)
    extractColorFromText(bgcolor, colorFrequency, 3)
    extractColorFromText(color, colorFrequency, 3)
  })

  // Method 5: Extract from style tags
  $('style').each((_, elem) => {
    const css = $(elem).html() || ''

    // Look for CSS custom properties (variables)
    const varPattern = /--[a-z-]+(?:color|bg|brand|primary|accent|theme)[^:]*:\s*([^;]+)/gi
    const varMatches = css.matchAll(varPattern)
    for (const match of varMatches) {
      if (match[1]) {
        extractColorFromText(match[1], colorFrequency, 10)
      }
    }

    // Look for button/primary classes
    const classPattern = /\.(btn|button|primary|cta|brand)[^{]*\{([^}]+)\}/gi
    const classMatches = css.matchAll(classPattern)
    for (const match of classMatches) {
      if (match[2]) {
        extractColorFromText(match[2], colorFrequency, 6)
      }
    }

    // Extract all colors
    extractColorFromText(css, colorFrequency, 1)
  })

  // Convert frequency map to sorted array
  const sortedColors = Object.entries(colorFrequency)
    .map(([color, freq]) => ({ color, freq }))
    .sort((a, b) => b.freq - a.freq)
    .map(item => item.color)
    .filter(color => !isGrayscale(color))
    .filter(color => !isCommonUIColor(color))

  console.log(`🎨 Extracted ${sortedColors.length} brand colors from ${domain}:`, sortedColors.slice(0, 5).map((c, i) => `${c} (${Object.entries(colorFrequency).find(([col]) => col === c)?.[1] || 0})`))

  // Need at least one strong color to be confident
  if (sortedColors.length >= 3) {
    return {
      primary: sortedColors[0],
      secondary: sortedColors[1],
      accent: sortedColors[2]
    }
  } else if (sortedColors.length === 2) {
    return {
      primary: sortedColors[0],
      secondary: sortedColors[1],
      accent: sortedColors[0]
    }
  } else if (sortedColors.length === 1) {
    return {
      primary: sortedColors[0],
      secondary: darkenColor(sortedColors[0], 20),
      accent: lightenColor(sortedColors[0], 20)
    }
  }

  // Last resort: generate colors based on domain/company name
  console.log(`⚠️ No brand colors found for ${domain}, generating from domain hash`)
  return generateColorsFromString(domain)
}

// Generate consistent colors from a string (domain name)
function generateColorsFromString(str: string): { primary: string, secondary: string, accent: string } {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  const h = Math.abs(hash % 360)
  const primary = hslToHex(h, 65, 50)
  const secondary = hslToHex((h + 30) % 360, 65, 40)
  const accent = hslToHex((h + 60) % 360, 65, 60)

  return { primary, secondary, accent }
}

// Convert HSL to Hex
function hslToHex(h: number, s: number, l: number): string {
  s /= 100
  l /= 100

  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs((h / 60) % 2 - 1))
  const m = l - c / 2
  let r = 0, g = 0, b = 0

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c
  } else {
    r = c; g = 0; b = x
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

// Darken a color
function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.slice(1), 16)
  const r = Math.max(0, Math.floor((num >> 16) * (1 - percent / 100)))
  const g = Math.max(0, Math.floor(((num >> 8) & 0x00FF) * (1 - percent / 100)))
  const b = Math.max(0, Math.floor((num & 0x0000FF) * (1 - percent / 100)))
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`
}

// Lighten a color
function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.slice(1), 16)
  const r = Math.min(255, Math.floor((num >> 16) + (255 - (num >> 16)) * (percent / 100)))
  const g = Math.min(255, Math.floor(((num >> 8) & 0x00FF) + (255 - ((num >> 8) & 0x00FF)) * (percent / 100)))
  const b = Math.min(255, Math.floor((num & 0x0000FF) + (255 - (num & 0x0000FF)) * (percent / 100)))
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`
}

// Helper to extract colors from text and add to frequency map
function extractColorFromText(text: string, frequencyMap: Record<string, number>, weight: number) {
  const colorMatches = text.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}|rgba?\([^)]+\)/gi)
  if (colorMatches) {
    colorMatches.forEach(color => {
      let hex = color.toLowerCase()

      if (hex.startsWith('rgb')) {
        const matches = hex.match(/\d+/g)
        if (matches && matches.length >= 3) {
          hex = rgbToHex(parseInt(matches[0]), parseInt(matches[1]), parseInt(matches[2]))
        } else {
          return
        }
      } else if (hex.length === 4) { // #RGB to #RRGGBB
        hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3]
      }

      if (hex.startsWith('#') && hex.length === 7) {
        frequencyMap[hex] = (frequencyMap[hex] || 0) + weight
      }
    })
  }
}

// Filter out very common UI colors (pure white, pure black, very light grays)
function isCommonUIColor(hex: string): boolean {
  if (!hex.startsWith('#') || hex.length !== 7) return false
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  // Pure white or very close to white
  if (r > 250 && g > 250 && b > 250) return true
  // Pure black or very close to black
  if (r < 10 && g < 10 && b < 10) return true
  // Very light grays
  if (Math.abs(r - g) < 10 && Math.abs(g - b) < 10 && r > 240) return true

  return false
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
}

function isGrayscale(hex: string): boolean {
  if (!hex.startsWith('#') || hex.length !== 7) return false
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b)) < 30
}

function extractCompanyNameFromUrl(url: string): string {
  try {
    const domain = url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
    const name = domain.split('.')[0]
    return name.charAt(0).toUpperCase() + name.slice(1)
  } catch {
    return 'Company'
  }
}

function getFallbackData(url: string): CompanyData {
  return {
    name: extractCompanyNameFromUrl(url),
    url,
    industry: 'Business Services',
    description: 'A leading company in their industry',
    colors: { primary: '#2563eb', secondary: '#4f46e5', accent: '#3b82f6' },
    businessContext: {
      mainServices: ['Business Services'],
      keyOperations: ['Document Management'],
      painPoints: ['Manual workflow inefficiencies'],
      departments: [],
      contentThemes: ['efficiency']
    },
    size: 'medium'
  }
}

// Generate deeply personalized content using Mosaic's actual solutions
function generateMosaicSolution(companyData: CompanyData) {
  const { name, industry, businessContext, size } = companyData

  // Build specific pain points based on their actual operations
  const painPoints: string[] = []
  const solutions: string[] = []

  // AP/Invoice Processing (core Mosaic solution)
  if (businessContext.keyOperations.includes('Invoice Processing') || businessContext.departments.includes('FINANCE') || businessContext.departments.includes('ACCOUNTING')) {
    painPoints.push(`${name} is likely processing hundreds of invoices monthly through manual data entry, leading to errors, delayed payments, and frustrated AP staff`)
    painPoints.push(`Paper invoices and email attachments create bottlenecks in ${name}'s accounts payable workflow, making it impossible to track approval status or payment timelines`)

    solutions.push(`DocStar IDC (Intelligent Data Capture) automatically captures invoice data from any format—paper, email, or digital—eliminating 90% of manual data entry at ${name}`)
    solutions.push(`DocStar ECM provides ${name} with a single digital repository for all invoices, enabling instant search, automated routing, and complete audit trails for compliance`)
  }

  // Order Processing
  if (businessContext.keyOperations.includes('Order Management')) {
    painPoints.push(`Manual sales order processing at ${name} creates delays between order receipt and fulfillment, impacting customer satisfaction and revenue recognition`)

    solutions.push(`Mosaic's Sales Order Processing Automation integrates directly with ${name}'s ERP system, automatically capturing orders, validating data, and routing for approval—reducing cycle time by 75%`)
  }

  // Document Management (applies to almost everyone)
  if (businessContext.keyOperations.includes('Document Management') || businessContext.painPoints.includes('Paper-based workflows causing inefficiencies')) {
    painPoints.push(`${name}'s teams waste valuable time searching for documents across email, shared drives, and paper files—time that could be spent on strategic work`)

    solutions.push(`DocStar ECM (Enterprise Content Management) gives ${name} a single, searchable repository for all business documents with role-based security, version control, and retention policies`)
  }

  // HR/Payroll
  if (businessContext.keyOperations.includes('HR/Payroll') || businessContext.departments.includes('HR')) {
    painPoints.push(`${name}'s HR department is buried in paperwork—employee onboarding forms, time-off requests, performance reviews—all requiring manual processing and filing`)

    solutions.push(`Mosaic HR Automation digitizes ${name}'s entire employee lifecycle, from onboarding forms to benefits enrollment, with automated workflows and secure document storage`)
  }

  // Compliance/Audit
  if (businessContext.keyOperations.includes('Compliance/Regulatory') || industry === 'Healthcare' || industry === 'Financial Services') {
    painPoints.push(`Compliance audits are painful for ${name}—tracking down documents, proving approval chains, and demonstrating retention policies consumes weeks of staff time`)

    solutions.push(`DocStar ECM's complete audit trail shows ${name} exactly who accessed, edited, or approved every document, with automated retention policies ensuring compliance without manual tracking`)
  }

  // Add ERP integration benefit
  solutions.push(`Seamless ERP Integration: Mosaic connects directly to ${name}'s existing systems (Microsoft Dynamics 365, Sage Intacct, SAP, or any ERP), eliminating double entry and ensuring data accuracy`)

  // Industry-specific additions
  if (industry === 'Healthcare') {
    painPoints.push(`Healthcare regulations like HIPAA create compliance burdens for ${name}, requiring meticulous document management and audit trails that manual processes can't reliably provide`)
    solutions.push(`Mosaic's healthcare-compliant workflows ensure ${name} meets HIPAA requirements with encrypted storage, controlled access, and comprehensive audit logging`)
  } else if (industry === 'Manufacturing') {
    painPoints.push(`${name}'s manufacturing operations generate massive volumes of documents—purchase orders, packing slips, quality certifications—that need to move quickly through approvals`)
    solutions.push(`Mosaic's Freight & Shipping Automation processes ${name}'s logistics documents instantly, matching POs to receipts and automatically updating inventory systems`)
  } else if (industry === 'Financial Services') {
    painPoints.push(`${name} faces stringent regulatory requirements for document retention, audit trails, and data security that manual processes simply cannot guarantee`)
    solutions.push(`DocStar ECM provides ${name} with bank-level security, immutable audit trails, and configurable retention policies that automatically enforce regulatory compliance`)
  }

  // Add a few more generic pain points if we don't have enough
  while (painPoints.length < 4) {
    painPoints.push(`Manual workflows at ${name} mean key staff spend hours on repetitive tasks instead of strategic initiatives that drive growth`)
  }

  while (solutions.length < 4) {
    solutions.push(`Mosaic's customized workflow automation is designed specifically for ${name}'s business rules and processes, not a one-size-fits-all solution`)
  }

  // Generate personalized headline and pitch with softer, consultative approach
  const headline = `Streamlining Operations for ${name}`

  const pitch = `We understand the unique challenges ${size === 'enterprise' ? 'enterprise organizations' : 'growing companies'} like ${name} face. Our DocStar platform is designed to make your team's work easier—helping you manage documents, automate workflows, and focus on what matters most.`

  const cta = `Let's Explore Solutions Together`

  return {
    companyName: name,
    url: companyData.url,
    industry,
    description: companyData.description,
    headline,
    subheadline: pitch,
    painPoints: painPoints.slice(0, 5), // Top 5 most relevant
    solutions: solutions.slice(0, 5), // Top 5 solutions
    colors: companyData.colors,
    cta
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

    let normalizedUrl = url.trim()
    if (!normalizedUrl.startsWith('http')) {
      normalizedUrl = 'https://' + normalizedUrl
    }

    console.log(`\n🔍 Deep scraping ${normalizedUrl}...`)

    // Deep scrape the company website
    const companyData = await deepScrapeCompany(normalizedUrl)

    console.log(`✅ Scraped: ${companyData.name}`)
    console.log(`📊 Industry: ${companyData.industry}`)
    console.log(`🏢 Size: ${companyData.size}`)
    console.log(`🎯 Key Operations: ${companyData.businessContext.keyOperations.join(', ')}`)
    console.log(`🎨 Colors: ${companyData.colors.primary}, ${companyData.colors.secondary}`)

    // Generate deeply personalized Mosaic solution
    const microsite = generateMosaicSolution(companyData)

    console.log(`✨ Generated personalized microsite for ${companyData.name}\n`)

    return NextResponse.json({
      success: true,
      microsite
    })

  } catch (error: any) {
    console.error('❌ Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate microsite' },
      { status: 500 }
    )
  }
}
