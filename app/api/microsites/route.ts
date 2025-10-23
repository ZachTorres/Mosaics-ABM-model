import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get('campaignId')
    const status = searchParams.get('status')

    const microsites = await prisma.microsite.findMany({
      where: {
        ...(campaignId && { campaignId }),
        ...(status && { status: status as any }),
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        campaign: true,
        _count: {
          select: {
            visits: true,
            leads: true,
          },
        },
      },
    })

    return NextResponse.json({ success: true, microsites })
  } catch (error) {
    console.error('Error fetching microsites:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch microsites' },
      { status: 500 }
    )
  }
}
