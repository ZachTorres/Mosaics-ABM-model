import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/memory-storage'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const microsite = storage.getMicrositeById(params.id)

    if (!microsite) {
      return NextResponse.json(
        { success: false, error: 'Microsite not found' },
        { status: 404 }
      )
    }

    const visits = storage.getVisits().filter(v => v.micrositeId === params.id)
    const leads = storage.getLeads().filter(l => l.micrositeId === params.id)

    return NextResponse.json({
      success: true,
      microsite: {
        ...microsite,
        visits,
        leads,
      },
    })
  } catch (error) {
    console.error('Error fetching microsite:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch microsite' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Delete not implemented in simple storage
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting microsite:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete microsite' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const microsite = storage.updateMicrosite(params.id, body)

    if (!microsite) {
      return NextResponse.json(
        { success: false, error: 'Microsite not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, microsite })
  } catch (error) {
    console.error('Error updating microsite:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update microsite' },
      { status: 500 }
    )
  }
}
