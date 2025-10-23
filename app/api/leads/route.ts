import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage'
import { z } from 'zod'

const leadSchema = z.object({
  micrositeId: z.string(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  companyName: z.string().min(1),
  jobTitle: z.string().optional(),
  message: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = leadSchema.parse(body)

    const lead = storage.createLead(data)

    return NextResponse.json({ success: true, lead })
  } catch (error) {
    console.error('Error creating lead:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create lead' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const micrositeId = searchParams.get('micrositeId')

    let leads = storage.getLeads()

    if (micrositeId) {
      leads = leads.filter(l => l.micrositeId === micrositeId)
    }

    // Add microsite info
    const leadsWithMicrosite = leads.map(lead => ({
      ...lead,
      microsite: {
        targetCompanyName: storage.getMicrositeById(lead.micrositeId)?.targetCompanyName || 'Unknown',
        slug: storage.getMicrositeById(lead.micrositeId)?.slug || '',
      },
    }))

    return NextResponse.json({ success: true, leads: leadsWithMicrosite })
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}
