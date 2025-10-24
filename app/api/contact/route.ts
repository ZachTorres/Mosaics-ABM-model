import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, currentProblem, companyName, targetUrl } = body

    // Validation
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'First Name, Last Name, and Email are required' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    // Log the contact form submission
    // In a real application, you would:
    // 1. Save to a database
    // 2. Send an email notification
    // 3. Integrate with a CRM (like HubSpot, Salesforce, etc.)
    // 4. Send to a marketing automation platform

    console.log('Contact Form Submission:', {
      timestamp: new Date().toISOString(),
      firstName,
      lastName,
      email,
      phone: phone || 'Not provided',
      currentProblem: currentProblem || 'Not provided',
      companyName: companyName || 'Unknown',
      targetUrl: targetUrl || 'Unknown',
    })

    // For now, we'll just return success
    // TODO: Integrate with your preferred CRM or email service

    return NextResponse.json({
      success: true,
      message: 'Contact information received successfully'
    })

  } catch (error: any) {
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process contact form' },
      { status: 500 }
    )
  }
}
