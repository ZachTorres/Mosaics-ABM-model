import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage'
import { nanoid } from 'nanoid'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { micrositeId, event, visitorId } = body

    // Get or create visitor ID
    const trackingId = visitorId || nanoid()

    if (event === 'pageview') {
      // Check if this visitor has visited before
      const existingVisit = storage.getVisitByVisitor(micrositeId, trackingId)

      if (existingVisit) {
        // Update existing visit
        storage.incrementPageViews(micrositeId, trackingId)
      } else {
        // Create new visit
        storage.createVisit({
          micrositeId,
          visitorId: trackingId,
        })

        // Increment unique visitors
        storage.incrementViews(micrositeId, true)
      }

      // Always increment total views
      storage.incrementViews(micrositeId, false)
    }

    return NextResponse.json({ success: true, visitorId: trackingId })
  } catch (error) {
    console.error('Error tracking event:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to track event' },
      { status: 500 }
    )
  }
}
