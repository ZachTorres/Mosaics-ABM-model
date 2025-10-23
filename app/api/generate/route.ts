import { NextRequest, NextResponse } from 'next/server'

// Simple function to extract company name from URL
function extractCompanyName(url: string): string {
  try {
    const domain = url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
    const name = domain.split('.')[0]
    return name.charAt(0).toUpperCase() + name.slice(1)
  } catch {
    return 'Company'
  }
}

// Simple function to detect industry from domain
function detectIndustry(domain: string): string {
  const lowerDomain = domain.toLowerCase()

  if (lowerDomain.includes('tech') || lowerDomain.includes('soft') || lowerDomain.includes('app')) {
    return 'Technology'
  } else if (lowerDomain.includes('health') || lowerDomain.includes('medical') || lowerDomain.includes('pharma')) {
    return 'Healthcare'
  } else if (lowerDomain.includes('finance') || lowerDomain.includes('bank') || lowerDomain.includes('invest')) {
    return 'Financial Services'
  } else if (lowerDomain.includes('retail') || lowerDomain.includes('shop') || lowerDomain.includes('store')) {
    return 'Retail'
  } else if (lowerDomain.includes('edu') || lowerDomain.includes('university') || lowerDomain.includes('school')) {
    return 'Education'
  } else if (lowerDomain.includes('manu') || lowerDomain.includes('industrial')) {
    return 'Manufacturing'
  } else {
    return 'Business Services'
  }
}

// Template-based content generation (no API keys needed!)
function generateContent(companyName: string, industry: string, url: string) {
  const industryContent: Record<string, any> = {
    'Technology': {
      painPoints: [
        'Managing complex tech infrastructure across multiple platforms',
        'Scaling operations while maintaining system reliability',
        'Integrating legacy systems with modern cloud solutions',
        'Protecting sensitive data from evolving cyber threats'
      ],
      solutions: [
        'Unified mosaic platform that connects all your tech systems seamlessly',
        'Enterprise-grade scalability with 99.9% uptime guarantee',
        'Smart integration layer that bridges old and new technologies',
        'Advanced security protocols with real-time threat monitoring'
      ],
      headline: 'Transform Your Technology Infrastructure with Mosaic'
    },
    'Healthcare': {
      painPoints: [
        'Maintaining HIPAA compliance across digital operations',
        'Managing patient data across disconnected systems',
        'Reducing administrative burden on medical staff',
        'Improving patient engagement and satisfaction'
      ],
      solutions: [
        'HIPAA-compliant platform with built-in security and audit trails',
        'Unified patient data management with real-time synchronization',
        'Automated workflows that free up 40% more staff time',
        'Patient portal integration for seamless communication'
      ],
      headline: 'Revolutionize Healthcare Delivery with Mosaic'
    },
    'Financial Services': {
      painPoints: [
        'Meeting strict regulatory compliance requirements',
        'Preventing fraud while maintaining user experience',
        'Processing high-volume transactions reliably',
        'Managing customer data across multiple touchpoints'
      ],
      solutions: [
        'Compliance-ready platform with automated regulatory reporting',
        'AI-powered fraud detection with 99.8% accuracy',
        'High-throughput transaction processing at scale',
        'Unified customer view across all channels and services'
      ],
      headline: 'Secure, Compliant, and Scalable Financial Solutions'
    },
    'Retail': {
      painPoints: [
        'Managing inventory across multiple channels and locations',
        'Creating personalized customer experiences at scale',
        'Unifying online and in-store operations',
        'Optimizing supply chain and fulfillment'
      ],
      solutions: [
        'Real-time inventory management across all sales channels',
        'AI-driven personalization engine for every customer',
        'Seamless omnichannel platform connecting digital and physical',
        'Smart supply chain optimization reducing costs by 25%'
      ],
      headline: 'Power Your Retail Success with Mosaic'
    },
    'Education': {
      painPoints: [
        'Managing diverse learning management systems',
        'Tracking student progress and engagement',
        'Coordinating communication between stakeholders',
        'Scaling educational delivery to remote learners'
      ],
      solutions: [
        'Unified learning platform supporting all content types',
        'Advanced analytics dashboard for student insights',
        'Integrated communication hub for students, teachers, and parents',
        'Cloud-based infrastructure supporting unlimited remote access'
      ],
      headline: 'Empower Education Excellence with Mosaic'
    },
    'Manufacturing': {
      painPoints: [
        'Optimizing production workflows and reducing downtime',
        'Managing complex supply chain dependencies',
        'Ensuring quality control across production lines',
        'Tracking inventory and equipment in real-time'
      ],
      solutions: [
        'IoT-enabled production monitoring with predictive maintenance',
        'Supply chain visibility platform reducing delays by 30%',
        'Automated quality assurance with AI-powered inspection',
        'Real-time asset tracking across your entire operation'
      ],
      headline: 'Modernize Manufacturing with Mosaic Intelligence'
    },
    'Business Services': {
      painPoints: [
        'Coordinating teams and projects across the organization',
        'Managing client relationships and deliverables',
        'Automating repetitive manual processes',
        'Gaining visibility into business performance'
      ],
      solutions: [
        'Collaborative workspace connecting all teams and tools',
        'Client portal with real-time project tracking and updates',
        'Workflow automation saving 20+ hours per week',
        'Comprehensive analytics dashboard with actionable insights'
      ],
      headline: 'Streamline Your Business Operations with Mosaic'
    }
  }

  const content = industryContent[industry] || industryContent['Business Services']

  return {
    companyName,
    url,
    industry,
    headline: content.headline,
    painPoints: content.painPoints,
    solutions: content.solutions,
    cta: `Ready to see Mosaic in action at ${companyName}?`
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

    // Extract company info
    const companyName = extractCompanyName(normalizedUrl)
    const industry = detectIndustry(normalizedUrl)

    // Generate microsite content
    const microsite = generateContent(companyName, industry, normalizedUrl)

    return NextResponse.json({
      success: true,
      microsite
    })

  } catch (error: any) {
    console.error('Error generating microsite:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate microsite' },
      { status: 500 }
    )
  }
}
