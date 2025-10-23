import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { micrositeId, event, visitorId } = body

    // Get or create visitor ID
    const trackingId = visitorId || nanoid()

    // Get visitor information
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    const userAgent = request.headers.get('user-agent')
    const referrer = request.headers.get('referer')

    if (event === 'pageview') {
      // Check if this is a unique visitor
      const existingVisit = await prisma.visit.findFirst({
        where: {
          micrositeId,
          visitorId: trackingId,
        },
      })

      if (existingVisit) {
        // Update existing visit
        await prisma.visit.update({
          where: { id: existingVisit.id },
          data: {
            pageViews: { increment: 1 },
          },
        })
      } else {
        // Create new visit
        await prisma.visit.create({
          data: {
            micrositeId,
            visitorId: trackingId,
            ipAddress: ip,
            userAgent,
            referrer,
          },
        })

        // Increment unique visitors count
        await prisma.microsite.update({
          where: { id: micrositeId },
          data: {
            uniqueVisitors: { increment: 1 },
          },
        })
      }

      // Increment total views
      await prisma.microsite.update({
        where: { id: micrositeId },
        data: {
          views: { increment: 1 },
        },
      })
    }

    if (event === 'cta_click') {
      await prisma.visit.updateMany({
        where: {
          micrositeId,
          visitorId: trackingId,
        },
        data: {
          ctaClicked: true,
        },
      })
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
