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
    specificOfferings: string[]
    valueProps: string[]
    technologies: string[]
    // Deep analysis fields
    explicitChallenges: string[]
    customerTypes: string[]
    specificWorkflows: string[]
    problemsTheySolve: string[]
  }
  size: 'small' | 'medium' | 'large' | 'enterprise'
}

// Enhanced multi-page scraping for deep company understanding
async function deepScrapeCompany(url: string): Promise<CompanyData> {
  try {
    console.log(`\n🔍 Starting deep scrape of ${url}...`)

    // Scrape homepage first
    const homeData = await scrapePage(url)
    const $ = homeData.$

    // Extract company name and clean it
    let companyName =
      $('meta[property="og:site_name"]').attr('content') ||
      $('meta[name="application-name"]').attr('content') ||
      $('title').text().split('|')[0].split('-')[0].trim() ||
      extractCompanyNameFromUrl(url)
    companyName = companyName.replace(/\.(com|net|org|io|co|ai|app|dev)$/i, '').trim()

    // Extract description
    const description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      $('p').first().text().substring(0, 300) ||
      'A leading company in their industry'

    console.log(`✅ Found company: ${companyName}`)
    console.log(`📝 Description: ${description.substring(0, 100)}...`)

    // Find and scrape additional pages for DEEP context
    const additionalPages = await findKeyPages($, url)
    console.log(`🔗 Found ${additionalPages.length} additional pages to scrape`)

    // Scrape up to 6 additional pages for comprehensive analysis
    const allPageData = [homeData]
    for (const pageUrl of additionalPages.slice(0, 6)) {
      try {
        const pageData = await scrapePage(pageUrl)
        allPageData.push(pageData)
        console.log(`  ✓ Scraped: ${pageUrl}`)
      } catch (err) {
        console.log(`  ✗ Failed: ${pageUrl}`)
      }
    }

    // Combine all text from all pages
    const combinedText = allPageData.map(p => p.text).join(' ').toLowerCase()
    const combinedHeadings = allPageData.map(p => p.headings).join(' ').toLowerCase()

    // Extract full paragraphs for deeper context analysis
    const allParagraphs = allPageData.flatMap(p => {
      const paragraphs: string[] = []
      p.$('p, li, div.description, div.content').each((_, el) => {
        const text = p.$(el).text().trim()
        if (text.length > 50 && text.length < 500) {
          paragraphs.push(text)
        }
      })
      return paragraphs
    })

    console.log(`📊 Analyzed ${combinedText.split(' ').length} words across ${allPageData.length} pages`)
    console.log(`📝 Extracted ${allParagraphs.length} content paragraphs for deep analysis`)

    // ENHANCED: Deep analysis with full paragraph context
    const businessContext = analyzeBusinessContext(combinedText, combinedHeadings, description, companyName, allParagraphs)

    // Detect industry with deep analysis
    const industry = detectIndustryDeep(url, description, combinedHeadings, combinedText, businessContext)

    // Estimate company size
    const size = estimateCompanySize(combinedText, description)

    // Extract colors
    const colors = await extractColors($, url)

    console.log(`✨ Analysis complete!`)
    console.log(`   Industry: ${industry}`)
    console.log(`   Size: ${size}`)
    console.log(`   Colors: Primary=${colors.primary}, Secondary=${colors.secondary}, Accent=${colors.accent}`)
    console.log(`   Services: ${businessContext.mainServices.join(', ')}`)
    console.log(`   Operations: ${businessContext.keyOperations.join(', ')}`)

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
    console.error('❌ Deep scraping error:', error)
    return getFallbackData(url)
  }
}

// Scrape a single page and extract text content
async function scrapePage(url: string) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
    signal: AbortSignal.timeout(5000) // 5 second timeout per page
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}`)
  }

  const html = await response.text()
  const $ = cheerio.load(html)

  // Remove script, style, and nav elements
  $('script, style, nav, header, footer').remove()

  const text = $('body').text().replace(/\s+/g, ' ').trim()
  const headings = $('h1, h2, h3, h4').map((_, el) => $(el).text()).get().join(' ')

  return { $, text, headings }
}

// Find key pages that might have valuable information
function findKeyPages($: cheerio.CheerioAPI, baseUrl: string): string[] {
  const keyPages: string[] = []
  const baseUrlObj = new URL(baseUrl)

  // Look for common informational pages
  const keyPhrases = [
    'about', 'what-we-do', 'services', 'solutions', 'products',
    'industries', 'capabilities', 'how-it-works', 'platform',
    'features', 'overview', 'company'
  ]

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href')
    if (!href) return

    try {
      // Convert relative URLs to absolute
      const linkUrl = new URL(href, baseUrl).href

      // Only include pages from the same domain
      if (!linkUrl.startsWith(baseUrlObj.origin)) return

      // Check if the link contains key phrases
      const linkText = $(el).text().toLowerCase()
      const linkPath = linkUrl.toLowerCase()

      const isKeyPage = keyPhrases.some(phrase =>
        linkPath.includes(phrase) || linkText.includes(phrase)
      )

      if (isKeyPage && !keyPages.includes(linkUrl) && keyPages.length < 10) {
        keyPages.push(linkUrl)
      }
    } catch (e) {
      // Invalid URL, skip
    }
  })

  return keyPages
}

// Analyze business context from page content with DEEP paragraph analysis
function analyzeBusinessContext(pageText: string, headings: string, description: string, companyName: string, paragraphs: string[]): CompanyData['businessContext'] {
  const combined = `${pageText} ${headings} ${description}`.toLowerCase()

  console.log(`🔬 Deep analyzing business context for ${companyName}...`)
  console.log(`📝 Analyzing ${paragraphs.length} content paragraphs for specific insights...`)

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

  // Extract specific offerings/products mentioned
  const specificOfferings: string[] = []
  const offeringPatterns = [
    /(?:we offer|we provide|our services include|we specialize in)\s+([^.]{10,80})/gi,
    /(?:solutions? for|products? for|services? for)\s+([^.]{10,60})/gi,
    /(?:helping|enabling|empowering)\s+(?:companies|businesses|organizations)\s+(?:to\s+)?([^.]{10,60})/gi
  ]

  offeringPatterns.forEach(pattern => {
    const matches = combined.matchAll(pattern)
    for (const match of matches) {
      if (match[1]) {
        const offering = match[1].trim()
        if (offering.length > 15 && offering.length < 100) {
          specificOfferings.push(offering)
        }
      }
    }
  })

  // Extract company's own value propositions from headings
  const valueProps: string[] = []
  if (headings) {
    const headingLines = headings.toLowerCase().split(/[.,\n]/).filter(h => h.trim().length > 10 && h.trim().length < 100)
    headingLines.forEach(heading => {
      // Look for value-oriented headings
      if (heading.match(/(?:transform|improve|increase|reduce|automate|streamline|optimize|enhance|accelerate)/)) {
        valueProps.push(heading.trim())
      }
    })
  }

  // Extract technology/tools they mention
  const technologies: string[] = []
  const techKeywords = ['salesforce', 'microsoft', 'sap', 'oracle', 'aws', 'azure', 'google cloud', 'dynamics', 'netsuite', 'quickbooks', 'sage', 'erp', 'crm', 'api']
  techKeywords.forEach(tech => {
    if (combined.includes(tech)) {
      technologies.push(tech)
    }
  })

  // ENHANCED: Deep paragraph analysis for SPECIFIC problems and challenges
  const explicitChallenges: string[] = []
  const customerTypes: string[] = []
  const specificWorkflows: string[] = []
  const problemsTheySolve: string[] = []

  // Analyze each paragraph for explicit mentions of problems, challenges, customers
  paragraphs.forEach(para => {
    const paraLower = para.toLowerCase()

    // Extract explicit challenges - INDUSTRY-AGNOSTIC patterns
    const challengePatterns = [
      // Direct challenge/problem mentions
      /(?:challenges?|problems?|issues?|struggles?|difficulties?)[:\s]+([^.!?]{20,200})/gi,
      /(?:struggling|dealing|grappling)\s+with\s+([^.!?]{20,150})/gi,

      // Without/lack patterns
      /without\s+([a-z\s]{10,100})/gi,
      /(?:lack(?:ing)?|absence|missing)\s+(?:of\s+)?([a-z\s]{10,100}(?:visibility|control|coordination|insight|integration|transparency|efficiency|automation))/gi,

      // Need/require improvements
      /(?:need|require|must)\s+(?:better|improved|more|enhanced)\s+([^.!?]{15,120})/gi,

      // Negative descriptors + ANY process/system
      /(?:inefficient|outdated|manual|fragmented|disconnected|siloed|time-consuming|complex|difficult)\s+([a-z\s]{8,100})/gi,

      // Managing/coordinating challenges
      /(?:coordinating|managing|handling|tracking|monitoring|forecasting|planning)\s+([^,.]{15,120}(?:across|between|among|throughout))/gi,

      // Difficulty/challenge doing something
      /(?:difficult|challenging|hard)\s+to\s+([^.!?]{15,120})/gi
    ]

    challengePatterns.forEach(pattern => {
      const matches = paraLower.matchAll(pattern)
      for (const match of matches) {
        if (match[1]) {
          const challenge = match[1].trim()
          // More flexible filtering - accept if it mentions ANY operational concept
          if (challenge.length > 12 && challenge.length < 200 &&
              (challenge.match(/(?:process|workflow|system|data|information|document|report|track|manage|coordinate|plan|schedule|forecast|monitor|operation|supply|communicat|collaborat|visibilit|integrat|automat)/) ||
               challenge.split(' ').length >= 3)) {  // Or if it's a multi-word phrase
            explicitChallenges.push(challenge)
          }
        }
      }
    })

    // Extract WHO they serve (their customer types)
    const customerPatterns = [
      /(?:we (?:help|serve|work with|support))\s+([^.!?]{10,80})/gi,
      /(?:for|serving)\s+([a-z\s]+(?:companies|businesses|organizations|manufacturers|retailers|providers|firms))/gi,
      /(?:industries|sectors|verticals)[:\s]+([^.!?]{10,100})/gi
    ]

    customerPatterns.forEach(pattern => {
      const matches = paraLower.matchAll(pattern)
      for (const match of matches) {
        if (match[1]) {
          customerTypes.push(match[1].trim())
        }
      }
    })

    // Extract specific workflows or processes they mention
    const workflowPatterns = [
      /([a-z\s]+(?:process|workflow|procedure|system)(?:es)?)/gi,
      /(?:automate|streamline|manage|track|process)\s+([^.!?]{10,60})/gi
    ]

    workflowPatterns.forEach(pattern => {
      const matches = paraLower.matchAll(pattern)
      for (const match of matches) {
        if (match[1]) {
          const workflow = match[1].trim()
          if (workflow.length > 10 && workflow.length < 80) {
            specificWorkflows.push(workflow)
          }
        }
      }
    })

    // Extract what problems THEY solve (shows what their customers need)
    const solutionPatterns = [
      /(?:eliminates?|removes?|solves?|fixes?|addresses?)\s+([^.!?]{15,100})/gi,
      /(?:reduces?|cuts?|minimizes?)\s+([^.!?]{15,100})/gi,
      /(?:no more|stop|avoid|prevent)\s+([^.!?]{15,100})/gi
    ]

    solutionPatterns.forEach(pattern => {
      const matches = paraLower.matchAll(pattern)
      for (const match of matches) {
        if (match[1]) {
          problemsTheySolve.push(match[1].trim())
        }
      }
    })
  })

  // Deduplicate and filter
  const uniqueChallenges = [...new Set(explicitChallenges)].filter(c => c.length > 20 && c.length < 200)
  const uniqueCustomers = [...new Set(customerTypes)].filter(c => c.length > 5 && c.length < 100)
  const uniqueWorkflows = [...new Set(specificWorkflows)].filter(w => w.length > 10 && w.length < 80)
  const uniqueProblems = [...new Set(problemsTheySolve)].filter(p => p.length > 15 && p.length < 120)

  console.log(`  ✓ Found ${mainServices.length} services, ${keyOperations.length} operations, ${specificOfferings.length} offerings`)
  console.log(`  ✓ Extracted ${uniqueChallenges.length} explicit challenges, ${uniqueCustomers.length} customer types`)
  console.log(`  ✓ Identified ${uniqueWorkflows.length} specific workflows, ${uniqueProblems.length} problems they solve`)

  return {
    mainServices: mainServices.length > 0 ? mainServices : ['Business Services'],
    keyOperations: keyOperations.length > 0 ? keyOperations : ['Document Management'],
    painPoints: painPoints.length > 0 ? painPoints : ['Manual workflow inefficiencies'],
    departments,
    contentThemes,
    specificOfferings: specificOfferings.slice(0, 3),
    valueProps: valueProps.slice(0, 3),
    technologies: technologies.slice(0, 5),
    // NEW: Deep insights from paragraph analysis
    explicitChallenges: uniqueChallenges.slice(0, 5),
    customerTypes: uniqueCustomers.slice(0, 5),
    specificWorkflows: uniqueWorkflows.slice(0, 5),
    problemsTheySolve: uniqueProblems.slice(0, 5)
  }
}

// Detect industry with deep analysis
function detectIndustryDeep(url: string, description: string, headings: string, pageText: string, context: CompanyData['businessContext']): string {
  const combined = `${url} ${description} ${headings} ${pageText}`.toLowerCase()

  // Weighted keyword scoring - primary keywords worth more than secondary
  const industryPatterns = {
    'Healthcare': {
      primary: ['hospital', 'clinic', 'medical center', 'patient care', 'healthcare', 'pharmaceutical', 'biotech'],
      secondary: ['patient', 'doctor', 'medicine', 'clinical', 'diagnosis', 'treatment']
    },
    'Financial Services': {
      primary: ['bank', 'banking', 'insurance', 'investment', 'financial services', 'fintech', 'wealth management'],
      secondary: ['loan', 'credit', 'mortgage', 'assets', 'portfolio']
    },
    'Technology': {
      primary: ['software', 'saas', 'cloud computing', 'technology company', 'tech company', 'platform', 'app development'],
      secondary: ['digital', 'api', 'data', 'innovation', 'developer']
    },
    'Manufacturing': {
      primary: ['manufacturing', 'factory', 'production facility', 'industrial', 'assembly'],
      secondary: ['supply chain', 'production', 'machinery', 'materials']
    },
    'Retail': {
      primary: ['retail', 'ecommerce', 'e-commerce', 'online store', 'shopping'],
      secondary: ['merchandise', 'fashion', 'products', 'customers']
    },
    'Education': {
      primary: ['university', 'school', 'college', 'education', 'academy'],
      secondary: ['learning', 'student', 'academic', 'curriculum', 'courses']
    },
    'Energy': {
      primary: ['energy', 'power', 'electricity', 'utility', 'grid', 'renewable energy'],
      secondary: ['transmission', 'distribution', 'generation']
    },
    'Real Estate': {
      primary: ['real estate', 'property management', 'realtor', 'realty'],
      secondary: ['housing', 'commercial property', 'leasing']
    },
    'Legal': {
      primary: ['law firm', 'legal services', 'attorney', 'lawyer'],
      secondary: ['litigation', 'court', 'legal']
    },
    'Professional Services': {
      primary: ['consulting', 'advisory', 'professional services'],
      secondary: ['strategy', 'consulting services']
    }
  }

  let maxScore = 0
  let detectedIndustry = 'Business Services'

  // Check for well-known tech companies first (Apple, Microsoft, Google, etc.)
  const techGiants = ['apple', 'microsoft', 'google', 'amazon', 'meta', 'facebook', 'tesla', 'nvidia', 'intel', 'amd', 'oracle', 'salesforce', 'adobe', 'ibm', 'cisco', 'dell', 'hp', 'lenovo']
  if (techGiants.some(company => url.toLowerCase().includes(company) || description.toLowerCase().includes(company))) {
    console.log('   ✓ Detected as Tech Giant from brand recognition')
    return 'Technology'
  }

  for (const [industry, keywords] of Object.entries(industryPatterns)) {
    // Primary keywords worth 3 points, secondary worth 1 point
    const primaryScore = keywords.primary.filter(kw => combined.includes(kw)).length * 3
    const secondaryScore = keywords.secondary.filter(kw => combined.includes(kw)).length * 1
    const score = primaryScore + secondaryScore

    if (score > maxScore) {
      maxScore = score
      detectedIndustry = industry
    }
  }

  // Require minimum score threshold to avoid false positives
  if (maxScore < 3) {
    console.log(`   ⚠ Industry score too low (${maxScore}), defaulting to Business Services`)
    return 'Business Services'
  }

  console.log(`   ✓ Detected industry: ${detectedIndustry} (score: ${maxScore})`)
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

// Massively expanded brand colors database (100+ companies)
const BRAND_COLORS: Record<string, { primary: string, secondary: string, accent: string }> = {
  // Tech Giants
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
  'apple': { primary: '#000000', secondary: '#555555', accent: '#a6a6a6' },
  'meta': { primary: '#0081fb', secondary: '#0467df', accent: '#00c6ff' },
  'x': { primary: '#000000', secondary: '#1da1f2', accent: '#657786' },

  // SaaS/Business Tools
  'salesforce': { primary: '#00a1e0', secondary: '#032d60', accent: '#1798c1' },
  'shopify': { primary: '#96bf48', secondary: '#5e8e3e', accent: '#7ab55c' },
  'hubspot': { primary: '#ff7a59', secondary: '#33475b', accent: '#00bda5' },
  'zoom': { primary: '#2d8cff', secondary: '#0e5a8a', accent: '#1a73e8' },
  'dropbox': { primary: '#0061ff', secondary: '#1e87f0', accent: '#007ee5' },
  'asana': { primary: '#f06a6a', secondary: '#e91e63', accent: '#ffb900' },
  'notion': { primary: '#000000', secondary: '#ffffff', accent: '#3f3f3f' },
  'airtable': { primary: '#18bfff', secondary: '#fcb400', accent: '#f82b60' },
  'monday': { primary: '#ff3d57', secondary: '#6c6cff', accent: '#ffcb00' },
  'trello': { primary: '#0079bf', secondary: '#026aa7', accent: '#5ba4cf' },
  'figma': { primary: '#f24e1e', secondary: '#a259ff', accent: '#0acf83' },
  'canva': { primary: '#00c4cc', secondary: '#7d2ae8', accent: '#ff5757' },
  'mailchimp': { primary: '#ffe01b', secondary: '#241c15', accent: '#007c89' },
  'twilio': { primary: '#f22f46', secondary: '#0d122b', accent: '#ffffff' },

  // Retail/Consumer
  'nike': { primary: '#111111', secondary: '#757575', accent: '#ffffff' },
  'adidas': { primary: '#000000', secondary: '#767677', accent: '#eceff1' },
  'cocacola': { primary: '#f40009', secondary: '#000000', accent: '#ffffff' },
  'coke': { primary: '#f40009', secondary: '#000000', accent: '#ffffff' },
  'pepsi': { primary: '#004b93', secondary: '#e32934', accent: '#ffffff' },
  'starbucks': { primary: '#00704a', secondary: '#1e3932', accent: '#d4af37' },
  'mcdonalds': { primary: '#ffc72c', secondary: '#da291c', accent: '#27251f' },
  'target': { primary: '#cc0000', secondary: '#ffffff', accent: '#000000' },
  'walmart': { primary: '#0071ce', secondary: '#ffc220', accent: '#004f9a' },
  'costco': { primary: '#0c5ea3', secondary: '#e31837', accent: '#ffffff' },
  'ikea': { primary: '#0051ba', secondary: '#ffdb00', accent: '#ffffff' },
  'bestbuy': { primary: '#0046be', secondary: '#fff200', accent: '#1d252d' },
  'homedepot': { primary: '#f96302', secondary: '#ffffff', accent: '#000000' },
  'lowes': { primary: '#004990', secondary: '#c41e3a', accent: '#ffffff' },

  // Automotive
  'tesla': { primary: '#cc0000', secondary: '#000000', accent: '#393c41' },
  'ford': { primary: '#003478', secondary: '#ffffff', accent: '#c9d0d8' },
  'toyota': { primary: '#eb0a1e', secondary: '#000000', accent: '#ffffff' },
  'bmw': { primary: '#1c69d4', secondary: '#ffffff', accent: '#000000' },
  'mercedes': { primary: '#00adef', secondary: '#000000', accent: '#e5e5e5' },
  'honda': { primary: '#e40521', secondary: '#000000', accent: '#ffffff' },

  // Airlines
  'delta': { primary: '#003a70', secondary: '#ce1126', accent: '#ffffff' },
  'united': { primary: '#002147', secondary: '#0e6ab3', accent: '#ffffff' },
  'american': { primary: '#0078d2', secondary: '#c60c30', accent: '#4d4f53' },
  'southwest': { primary: '#304cb2', secondary: '#ffbf27', accent: '#e31c23' },

  // Financial
  'visa': { primary: '#1a1f71', secondary: '#f7b600', accent: '#ffffff' },
  'mastercard': { primary: '#eb001b', secondary: '#ff5f00', accent: '#f79e1b' },
  'amex': { primary: '#006fcf', secondary: '#ffffff', accent: '#00175a' },
  'paypal': { primary: '#003087', secondary: '#009cde', accent: '#012169' },
  'chase': { primary: '#117aca', secondary: '#004987', accent: '#ffffff' },
  'wellsfargo': { primary: '#d71e28', secondary: '#fdb71a', accent: '#ffffff' },
  'bankofamerica': { primary: '#e31837', secondary: '#012169', accent: '#ffffff' },
  'bofa': { primary: '#e31837', secondary: '#012169', accent: '#ffffff' },

  // Social Media
  'instagram': { primary: '#e4405f', secondary: '#5851db', accent: '#fcaf45' },
  'tiktok': { primary: '#fe2c55', secondary: '#000000', accent: '#25f4ee' },
  'snapchat': { primary: '#fffc00', secondary: '#000000', accent: '#ffffff' },
  'pinterest': { primary: '#e60023', secondary: '#000000', accent: '#ffffff' },
  'reddit': { primary: '#ff4500', secondary: '#ffffff', accent: '#000000' },
  'youtube': { primary: '#ff0000', secondary: '#282828', accent: '#ffffff' },
  'whatsapp': { primary: '#25d366', secondary: '#075e54', accent: '#128c7e' },
  'telegram': { primary: '#0088cc', secondary: '#ffffff', accent: '#2196f3' },
  'discord': { primary: '#5865f2', secondary: '#404eed', accent: '#3ba55d' },

  // Streaming/Entertainment
  'hulu': { primary: '#1ce783', secondary: '#0b0c0f', accent: '#ffffff' },
  'disney': { primary: '#113ccf', secondary: '#ffffff', accent: '#000000' },
  'hbo': { primary: '#000000', secondary: '#b8b8b8', accent: '#ffffff' },
  'peacock': { primary: '#000000', secondary: '#ffffff', accent: '#ffd700' },
  'paramount': { primary: '#0064ff', secondary: '#ffffff', accent: '#000000' },

  // Food Delivery
  'doordash': { primary: '#ff3008', secondary: '#ffffff', accent: '#000000' },
  'ubereats': { primary: '#06c167', secondary: '#000000', accent: '#ffffff' },
  'grubhub': { primary: '#f63440', secondary: '#ff8000', accent: '#000000' },
  'postmates': { primary: '#000000', secondary: '#ffffff', accent: '#fe3a24' },

  // E-commerce
  'ebay': { primary: '#e53238', secondary: '#0064d2', accent: '#f5af02' },
  'etsy': { primary: '#f16521', secondary: '#000000', accent: '#ffffff' },
  'wayfair': { primary: '#7b0099', secondary: '#ffffff', accent: '#000000' },

  // Tech Services
  'aws': { primary: '#ff9900', secondary: '#232f3e', accent: '#ffffff' },
  'azure': { primary: '#0089d6', secondary: '#50e6ff', accent: '#ffffff' },
  'heroku': { primary: '#430098', secondary: '#6762a6', accent: '#c9c3e6' },
  'github': { primary: '#24292f', secondary: '#ffffff', accent: '#0969da' },
  'gitlab': { primary: '#fc6d26', secondary: '#fca326', accent: '#6e49cb' },
  'bitbucket': { primary: '#0052cc', secondary: '#2684ff', accent: '#ffffff' }
}

// Extract colors from website with multiple fallback methods
async function extractColors($: cheerio.CheerioAPI, url: string): Promise<{ primary: string, secondary: string, accent: string }> {
  // First, check if this is a known brand (with fuzzy matching)
  const fullDomain = url.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
  const domain = fullDomain.split('.')[0]

  // Try exact match first
  if (BRAND_COLORS[domain]) {
    console.log(`🎨 Using known brand colors for: ${domain}`)
    return BRAND_COLORS[domain]
  }

  // Try fuzzy matching (e.g., "bank-of-america" matches "bankofamerica")
  const normalizedDomain = domain.replace(/[-_]/g, '')
  for (const [brandKey, colors] of Object.entries(BRAND_COLORS)) {
    if (brandKey.replace(/[-_]/g, '') === normalizedDomain) {
      console.log(`🎨 Using known brand colors for: ${brandKey} (fuzzy match)`)
      return colors
    }
  }

  const colorFrequency: Record<string, number> = {}

  // Priority weights for different extraction methods
  const WEIGHT_THEME_COLOR = 25      // Meta theme-color tag (highest priority)
  const WEIGHT_FAVICON = 20          // Colors from favicon
  const WEIGHT_CSS_VAR = 15          // CSS custom properties
  const WEIGHT_LOGO_SVG = 12         // SVG logos
  const WEIGHT_HEADER_NAV = 10       // Header/nav elements
  const WEIGHT_CTA_BUTTON = 8        // Call-to-action buttons
  const WEIGHT_INLINE_STYLE = 5      // Inline styles
  const WEIGHT_GENERAL_CSS = 2       // General CSS

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
      contentThemes: ['efficiency'],
      specificOfferings: [],
      valueProps: [],
      technologies: [],
      explicitChallenges: [],
      customerTypes: [],
      specificWorkflows: [],
      problemsTheySolve: []
    },
    size: 'medium'
  }
}

// Generate deeply personalized content using Mosaic's actual solutions and proven outcomes
function generateMosaicSolution(companyData: CompanyData) {
  const { name, industry, businessContext, size } = companyData

  // Build detailed, specific pain points and solutions that demonstrate research
  const painPoints: string[] = []
  const solutions: string[] = []

  console.log(`\n🎯 Generating ultra-targeted pain points for ${name}...`)
  console.log(`   Using ${businessContext.explicitChallenges.length} explicit challenges found on their site`)
  console.log(`   Using ${businessContext.specificWorkflows.length} specific workflows identified`)
  console.log(`   Using ${businessContext.problemsTheySolve.length} problems they currently solve`)

  // PRIORITY 1: Use EXPLICIT challenges found on their website for ultra-specific pain points
  if (businessContext.explicitChallenges.length > 0) {
    businessContext.explicitChallenges.slice(0, 2).forEach(challenge => {
      // Mirror their challenge back to them with our solution angle
      const painPoint = `Like many in ${industry.toLowerCase()}, ${name} faces ${challenge}—a perfect scenario for document automation`
      painPoints.push(painPoint)
      console.log(`   ✓ Added explicit challenge: "${challenge.substring(0, 60)}..."`)
    })
  }

  // PRIORITY 2: Use specific workflows they mention to create targeted pain points
  if (businessContext.specificWorkflows.length > 0) {
    businessContext.specificWorkflows.slice(0, 2).forEach(workflow => {
      if (workflow.includes('invoice') || workflow.includes('ap') || workflow.includes('payable')) {
        painPoints.push(`${name}'s ${workflow} likely involves significant manual work that could be automated with intelligent document capture`)
      } else if (workflow.includes('order') || workflow.includes('fulfillment')) {
        painPoints.push(`Manual handling of ${workflow} at ${name} creates delays that impact customer satisfaction and operational efficiency`)
      } else {
        painPoints.push(`${name}'s ${workflow} could benefit from automation to reduce errors and speed up cycle times`)
      }
      console.log(`   ✓ Added workflow-based pain point: "${workflow}"`)
    })
  }

  // PRIORITY 3: Use problems THEY solve (their customers' pain = what they likely have too)
  if (businessContext.problemsTheySolve.length > 0) {
    const firstProblem = businessContext.problemsTheySolve[0]
    if (firstProblem.includes('time') || firstProblem.includes('manual') || firstProblem.includes('paper') || firstProblem.includes('process')) {
      painPoints.push(`While ${name} helps customers ${firstProblem}, internal document processes may still rely on manual methods that slow down operations`)
      console.log(`   ✓ Added mirror pain point based on what they solve`)
    }
  }

  // Check for technologies to personalize solutions
  const hasMicrosoftTech = businessContext.technologies.some(t => t.includes('microsoft') || t.includes('dynamics'))
  const hasSAPTech = businessContext.technologies.some(t => t.includes('sap'))
  const hasSYSPROTech = businessContext.technologies.some(t => t.includes('syspro'))
  const hasSageTech = businessContext.technologies.some(t => t.includes('sage') || t.includes('intacct'))
  const hasOtherERP = businessContext.technologies.some(t => t.includes('netsuite') || t.includes('erp'))

  // ONLY add generic pain points if we don't have enough specific ones from deep analysis
  const hasSpecificPainPoints = painPoints.length >= 3
  console.log(`   Current pain points count: ${painPoints.length}`)
  console.log(`   ${hasSpecificPainPoints ? '✓ Have specific pain points, skipping generics' : '⚠ Need more pain points, using industry-targeted fallbacks'}`)

  // If we don't have specific pain points, create INDUSTRY-SPECIFIC ones (not generic invoices/HR)
  if (!hasSpecificPainPoints) {
    // Create pain points based on their ACTUAL industry and services with more variety
    if (industry === 'Technology') {
      // For tech companies, focus on scaling, developer productivity, customer onboarding
      const techFocus = size === 'enterprise' || size === 'large' ? 'enterprise-scale' : 'growing'
      if (techFocus === 'enterprise-scale') {
        painPoints.push(`As ${name} scales globally, manual contract management and approval workflows across departments create bottlenecks that slow deal velocity`)
        painPoints.push(`Customer onboarding documents—MSAs, SOWs, technical specs—require coordination between sales, legal, and engineering, often delaying time-to-value`)
        painPoints.push(`${name}'s development and product teams generate extensive documentation that needs instant access across time zones, yet version control and search remain challenging`)
        solutions.push(`Mosaic's Epicor ECM gives ${name}'s global teams instant access to contracts, technical docs, and customer files with advanced search, automated versioning, and role-based permissions`)
        solutions.push(`Mosaic's automated routing moves ${name}'s customer agreements through approval chains in hours instead of weeks, accelerating revenue recognition and improving customer experience`)
      } else {
        painPoints.push(`${name}'s rapid growth means more customer contracts, vendor agreements, and internal documents—manual filing systems can't keep pace`)
        painPoints.push(`Engineering documentation, product specs, and customer implementations are scattered across email, shared drives, and individual computers, making knowledge sharing difficult`)
        painPoints.push(`As ${name} adds team members, ensuring everyone can find the right document version becomes increasingly time-consuming and error-prone`)
        solutions.push(`Mosaic's Epicor ECM centralizes ${name}'s critical documents in one searchable repository, ensuring your growing team always finds the latest version instantly`)
        solutions.push(`Mosaic's automated workflows route ${name}'s contracts and approvals to the right people automatically, eliminating manual tracking and reducing approval time by 70%`)
      }
      console.log(`   ✓ Generated technology company-specific pain points`)
    } else if (industry === 'Energy' || industry === 'Utilities' || businessContext.mainServices.some(s => s.toLowerCase().includes('energy') || s.toLowerCase().includes('power') || s.toLowerCase().includes('grid'))) {
      painPoints.push(`${name} coordinates complex energy operations across multiple regions, likely managing vast amounts of operational data, compliance reports, and coordination documents manually`)
      painPoints.push(`Real-time grid management and forecasting at ${name} generates continuous documentation flows—outage reports, capacity planning documents, regulatory filings—that require rapid routing and approval`)
      painPoints.push(`With interconnected operations spanning multiple states and utilities, ${name} needs seamless document sharing and workflow coordination to maintain grid reliability and regulatory compliance`)
      solutions.push(`Mosaic's Epicor ECM centralizes ${name}'s operational documents—from grid status reports to regulatory compliance filings—enabling instant access across regions with role-based security and audit trails`)
      solutions.push(`Mosaic's automated workflow routing ensures ${name}'s critical operational documents move through approval chains without delays, maintaining the rapid response times essential for grid management`)
      console.log(`   ✓ Generated energy/utilities industry-specific pain points`)
    } else if (industry === 'Government' || industry === 'Public Sector' || businessContext.mainServices.some(s => s.toLowerCase().includes('government') || s.toLowerCase().includes('public'))) {
      painPoints.push(`${name} manages extensive documentation requirements across multiple departments and jurisdictions, with strict compliance and public records obligations`)
      painPoints.push(`Public records requests and FOIA compliance at ${name} require tracking documents across departments—time-consuming manual searches strain resources and delay responses`)
      painPoints.push(`Multi-level approval processes and complex retention requirements mean ${name}'s staff spend significant time managing document workflows instead of mission-critical work`)
      solutions.push(`Mosaic's Epicor ECM provides ${name} with centralized document management and automated retention policies that ensure compliance while reducing administrative burden`)
      solutions.push(`Mosaic's automated workflow routing and complete audit trails help ${name} respond to public records requests quickly while maintaining transparency and accountability`)
      console.log(`   ✓ Generated government/public sector-specific pain points`)
    } else if (industry === 'Retail') {
      painPoints.push(`${name} handles high volumes of purchase orders, invoices, and supplier agreements—manual processing creates payment delays and makes it difficult to negotiate better terms`)
      painPoints.push(`Inventory and merchandising documentation scattered across systems makes it hard for ${name}'s buying teams to quickly access product specs, vendor contracts, and pricing history`)
      painPoints.push(`Seasonal spikes in order volume overwhelm ${name}'s manual document workflows, creating fulfillment delays that impact customer satisfaction during peak periods`)
      solutions.push(`Mosaic's Epicor IDC automatically captures and routes ${name}'s supplier invoices and POs, matching documents to purchase orders and flagging discrepancies—reducing AP processing time by 75%`)
      solutions.push(`Mosaic's centralized document access means ${name}'s merchandising and operations teams find vendor contracts, product specs, and compliance documents in seconds, not hours`)
      console.log(`   ✓ Generated retail-specific pain points`)
    } else if (businessContext.keyOperations.includes('Invoice Processing') || businessContext.departments.includes('FINANCE') || businessContext.departments.includes('ACCOUNTING')) {
      // Only use invoice pain points if finance is detected
      painPoints.push(`${name} is likely processing hundreds of invoices monthly through manual data entry, creating payment delays, bottlenecks, and errors that frustrate AP teams and strain vendor relationships`)
      painPoints.push(`Paper invoices arriving via email, fax, and mail make it nearly impossible to track approval status or prevent duplicate payments—forcing staff to manually chase down documents`)

      solutions.push(`Mosaic's Epicor IDC automatically captures invoice data from any format (paper, email, PDF) and intelligently routes them through approval workflows—eliminating 90% of manual data entry`)
      solutions.push(`Mosaic provides instant visibility into every invoice's status with Epicor ECM's centralized repository, complete with automated GL coding and audit trails that reduce AP processing time by up to 75%`)
      console.log(`   ✓ Generated finance/AP-specific pain points`)
    } else {
      // Ultimate fallback for any other industry - document management focus with variety based on size
      const sizeBasedVariation = Math.floor(Math.random() * 3)
      if (sizeBasedVariation === 0) {
        painPoints.push(`${name}'s operations generate significant documentation that requires coordination across teams—manual processes create bottlenecks and limit operational visibility`)
        painPoints.push(`Document version confusion means ${name}'s teams sometimes work from outdated information, leading to errors, rework, and compliance risks`)
        solutions.push(`Mosaic's Epicor ECM provides ${name} with a single, cloud-accessible repository for all operational documents—searchable in seconds with role-based security and automatic version control`)
      } else if (sizeBasedVariation === 1) {
        painPoints.push(`${name}'s teams spend hours each week searching for documents across email, shared drives, and local folders—time that could be spent on higher-value work`)
        painPoints.push(`Manual document routing and approvals mean ${name}'s critical processes take longer than necessary, impacting customer responsiveness and operational agility`)
        solutions.push(`Mosaic's intelligent document capture and automated workflows eliminate manual routing at ${name}, ensuring documents reach the right people for approval in minutes, not days`)
      } else {
        painPoints.push(`Without centralized document control, ${name} faces risks from lost files, unclear version history, and difficulty proving compliance during audits`)
        painPoints.push(`Remote and hybrid work make document access even more challenging for ${name}—emails asking "where's that file?" waste time and frustrate employees`)
        solutions.push(`Mosaic's cloud-based Epicor ECM gives ${name}'s distributed teams secure, instant access to all documents from anywhere, with advanced search that finds files in seconds`)
      }
      console.log(`   ✓ Generated general operational pain points (variation ${sizeBasedVariation})`)
    }
  }

  // Additional pain point for order-heavy operations (if detected)
  if (businessContext.keyOperations.includes('Order Management') && painPoints.length < 4) {
    painPoints.push(`Manual sales order entry at ${name} creates delays between order receipt and fulfillment, directly impacting customer satisfaction and your order-to-cash cycle`)
    solutions.push(`Mosaic's Epicor IDC intelligently captures order data from any source (email, EDI, fax), validates against business rules, and auto-populates your ERP—reducing order processing time by 96%`)
  }

  // ERP Integration - detailed and technology-specific
  if (hasMicrosoftTech) {
    solutions.push(`Proven Microsoft Dynamics Integration: Mosaic's deep expertise with Dynamics 365 Business Central ensures seamless two-way synchronization between ${name}'s Epicor workflows and financial systems`)
  } else if (hasSYSPROTech) {
    solutions.push(`Native SYSPRO Integration: Mosaic's specialized connectors sync ${name}'s Epicor documents with SYSPRO ERP in real-time—AP invoices, sales orders, and inventory documents flow automatically`)
  } else if (hasSageTech) {
    solutions.push(`Certified Sage Intacct Integration: Mosaic's Epicor connects directly to ${name}'s Sage Intacct, automatically syncing AP invoices, vendor records, and GL coding with zero double-entry`)
  } else if (hasSAPTech) {
    solutions.push(`SAP-Certified Integration: Mosaic's Epicor integrates seamlessly with ${name}'s SAP environment, syncing documents and master data across enterprise systems with proven reliability`)
  } else if (hasOtherERP) {
    solutions.push(`ERP Integration Expertise: With 25+ years in automation, Mosaic connects Epicor to ${name}'s ERP (NetSuite, QuickBooks, or others) through proven APIs that eliminate double-entry`)
  } else {
    solutions.push(`Flexible System Integration: Mosaic specializes in connecting Epicor to ${name}'s existing business systems, ensuring documents and data flow seamlessly without disrupting operations`)
  }

  // Industry-specific - detailed and valuable
  if (industry === 'Healthcare') {
    painPoints.push(`HIPAA regulations require ${name} to meticulously document who accessed patient records, when, and why—something manual processes simply cannot deliver reliably`)
    solutions.push(`Mosaic's healthcare-compliant workflows ensure ${name} meets HIPAA requirements with encrypted storage, role-based access, automatic audit logging, and patient consent tracking built in`)
  } else if (industry === 'Manufacturing') {
    painPoints.push(`${name}'s manufacturing operations generate constant document flows—POs, packing slips, quality certs, BOMs—that must move rapidly through approvals to prevent production delays`)
    solutions.push(`Mosaic's Freight & Logistics Automation processes ${name}'s shipping documents instantly, auto-matching POs to receipts, flagging discrepancies, and updating inventory systems in real-time`)
  } else if (industry === 'Financial Services') {
    painPoints.push(`${name} operates under strict regulatory scrutiny requiring perfect document retention, immutable audit trails, and instant retrieval during examinations`)
    solutions.push(`Mosaic provides bank-grade security with encryption at rest and in transit, immutable audit trails, granular permissions, and automated retention policies that enforce ${name}'s regulatory compliance`)
  } else if (industry === 'Education') {
    painPoints.push(`${name} manages student records, enrollment forms, financial aid documents, and compliance paperwork across departments—creating silos that make it difficult to serve students efficiently`)
    solutions.push(`Mosaic's centralized student document repository with secure, role-based access lets ${name}'s advisors, financial aid, and registrar staff collaborate while protecting student privacy`)
  }

  // Thoughtful fallbacks that still show value
  if (painPoints.length < 4) {
    painPoints.push(`Manual, paper-based workflows mean ${name}'s talented staff spend hours on repetitive tasks instead of the strategic work that drives competitive advantage`)
  }
  if (painPoints.length < 4) {
    painPoints.push(`As ${name} grows, manual processes don't scale—adding more people to handle paperwork creates a costly cycle that limits margins and growth potential`)
  }

  if (solutions.length < 4) {
    solutions.push(`Unlike one-size-fits-all platforms, Mosaic customizes Epicor to match ${name}'s specific business rules, approval hierarchies, and workflows—not forcing you to change how you work`)
  }
  if (solutions.length < 4) {
    solutions.push(`With 25+ years implementing document automation, Mosaic brings deep process expertise to help ${name} design workflows that deliver measurable ROI and lasting efficiency gains`)
  }

  // Generate professional, person-focused headline
  const headline = `Streamline Workflows at ${name}`
  console.log(`✨ Generated headline: "${headline}"`)
  console.log(`✨ Generated for company: ${name}, Industry: ${industry}`)

  // Create industry-aware, personalized subheadline with Mosaic branding
  let pitch = ''
  if (industry && industry !== 'Business Services') {
    pitch = `Mosaic partners with ${industry.toLowerCase()} companies to eliminate manual document processes and streamline workflows.`
  } else if (businessContext.mainServices.length > 0 && businessContext.mainServices[0] !== 'Business Services') {
    pitch = `Mosaic helps companies in ${businessContext.mainServices[0].toLowerCase()} spend less time on administrative work and more time driving growth.`
  } else {
    pitch = `Mosaic specializes in helping companies like ${name} automate document workflows and eliminate manual processes.`
  }

  const cta = `See Mosaic in Action for ${name}`

  return {
    companyName: name,
    url: companyData.url,
    industry,
    description: companyData.description,
    headline,
    subheadline: pitch,
    painPoints: painPoints.slice(0, 5), // Top 5 most relevant - detailed to show research
    solutions: solutions.slice(0, 5), // Top 5 solutions - comprehensive and specific
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
