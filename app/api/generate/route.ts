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

// Extract colors from website
async function extractColors($: cheerio.CheerioAPI, url: string): Promise<{ primary: string, secondary: string, accent: string }> {
  const colors: string[] = []

  // Extract from inline styles
  $('[style]').each((_, elem) => {
    const style = $(elem).attr('style') || ''
    const colorMatches = style.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}|rgb\([^)]+\)/g)
    if (colorMatches) colors.push(...colorMatches)
  })

  // Extract from style tags
  $('style').each((_, elem) => {
    const css = $(elem).html() || ''
    const colorMatches = css.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}|rgb\([^)]+\)/g)
    if (colorMatches) colors.push(...colorMatches)
  })

  // Convert to hex and filter
  const hexColors = colors
    .map(color => {
      if (color.startsWith('rgb')) {
        const matches = color.match(/\d+/g)
        if (matches && matches.length >= 3) {
          return rgbToHex(parseInt(matches[0]), parseInt(matches[1]), parseInt(matches[2]))
        }
      }
      if (color.length === 4) { // #RGB to #RRGGBB
        return '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3]
      }
      return color.toLowerCase()
    })
    .filter((color, index, self) => self.indexOf(color) === index)
    .filter(color => color.startsWith('#') && !isGrayscale(color))
    .slice(0, 10)

  if (hexColors.length >= 3) {
    return { primary: hexColors[0], secondary: hexColors[1], accent: hexColors[2] }
  } else if (hexColors.length > 0) {
    return { primary: hexColors[0], secondary: hexColors[0], accent: hexColors[0] }
  }

  return { primary: '#2563eb', secondary: '#4f46e5', accent: '#3b82f6' }
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

    solutions.push(`**DocStar IDC (Intelligent Data Capture)** automatically captures invoice data from any format—paper, email, or digital—eliminating 90% of manual data entry at ${name}`)
    solutions.push(`**DocStar ECM** provides ${name} with a single digital repository for all invoices, enabling instant search, automated routing, and complete audit trails for compliance`)
  }

  // Order Processing
  if (businessContext.keyOperations.includes('Order Management')) {
    painPoints.push(`Manual sales order processing at ${name} creates delays between order receipt and fulfillment, impacting customer satisfaction and revenue recognition`)

    solutions.push(`Mosaic's **Sales Order Processing Automation** integrates directly with ${name}'s ERP system, automatically capturing orders, validating data, and routing for approval—reducing cycle time by 75%`)
  }

  // Document Management (applies to almost everyone)
  if (businessContext.keyOperations.includes('Document Management') || businessContext.painPoints.includes('Paper-based workflows causing inefficiencies')) {
    painPoints.push(`${name}'s teams waste valuable time searching for documents across email, shared drives, and paper files—time that could be spent on strategic work`)

    solutions.push(`**DocStar ECM (Enterprise Content Management)** gives ${name} a single, searchable repository for all business documents with role-based security, version control, and retention policies`)
  }

  // HR/Payroll
  if (businessContext.keyOperations.includes('HR/Payroll') || businessContext.departments.includes('HR')) {
    painPoints.push(`${name}'s HR department is buried in paperwork—employee onboarding forms, time-off requests, performance reviews—all requiring manual processing and filing`)

    solutions.push(`**Mosaic HR Automation** digitizes ${name}'s entire employee lifecycle, from onboarding forms to benefits enrollment, with automated workflows and secure document storage`)
  }

  // Compliance/Audit
  if (businessContext.keyOperations.includes('Compliance/Regulatory') || industry === 'Healthcare' || industry === 'Financial Services') {
    painPoints.push(`Compliance audits are painful for ${name}—tracking down documents, proving approval chains, and demonstrating retention policies consumes weeks of staff time`)

    solutions.push(`DocStar ECM's **complete audit trail** shows ${name} exactly who accessed, edited, or approved every document, with automated retention policies ensuring compliance without manual tracking`)
  }

  // Add ERP integration benefit
  solutions.push(`**Seamless ERP Integration**: Mosaic connects directly to ${name}'s existing systems (Microsoft Dynamics 365, Sage Intacct, SAP, or any ERP), eliminating double entry and ensuring data accuracy`)

  // Industry-specific additions
  if (industry === 'Healthcare') {
    painPoints.push(`Healthcare regulations like HIPAA create compliance burdens for ${name}, requiring meticulous document management and audit trails that manual processes can't reliably provide`)
    solutions.push(`Mosaic's healthcare-compliant workflows ensure ${name} meets HIPAA requirements with encrypted storage, controlled access, and comprehensive audit logging`)
  } else if (industry === 'Manufacturing') {
    painPoints.push(`${name}'s manufacturing operations generate massive volumes of documents—purchase orders, packing slips, quality certifications—that need to move quickly through approvals`)
    solutions.push(`Mosaic's **Freight & Shipping Automation** processes ${name}'s logistics documents instantly, matching POs to receipts and automatically updating inventory systems`)
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

  // Generate personalized headline and pitch
  const headline = `Transform ${name}'s Workflow Automation with DocStar ECM & IDC`

  const pitch = `${name} ${businessContext.mainServices.length > 0 ? 'is focused on ' + businessContext.mainServices[0].toLowerCase() : 'has unique operational needs'}, but manual processes are holding your team back. Mosaic's DocStar platform—combining Intelligent Data Capture (IDC) and Enterprise Content Management (ECM)—eliminates the paper-based workflows, manual data entry, and document chaos that waste your team's time. We've helped ${size === 'enterprise' ? 'Fortune 500 companies' : 'companies like yours'} reduce AP processing time by 80%, cut document retrieval time from hours to seconds, and achieve complete compliance visibility—all while integrating seamlessly with your existing systems.`

  const cta = `See How DocStar Can Transform ${name}'s Operations`

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
