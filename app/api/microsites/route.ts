import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/memory-storage'

export async function GET(request: NextRequest) {
  try {
    const microsites = storage.getMicrosites()

    // Add counts
    const micrositesWithCounts = microsites.map(m => ({
      ...m,
      _count: {
        visits: storage.getVisits().filter(v => v.micrositeId === m.id).length,
        leads: storage.getLeads().filter(l => l.micrositeId === m.id).length,
      },
    }))

    return NextResponse.json({ success: true, microsites: micrositesWithCounts })
  } catch (error) {
    console.error('Error fetching microsites:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch microsites' },
      { status: 500 }
    )
  }
}
