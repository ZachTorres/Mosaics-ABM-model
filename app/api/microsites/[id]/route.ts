import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const microsite = await prisma.microsite.findUnique({
      where: { id: params.id },
      include: {
        campaign: true,
        visits: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        leads: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!microsite) {
      return NextResponse.json(
        { success: false, error: 'Microsite not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, microsite })
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
    await prisma.microsite.delete({
      where: { id: params.id },
    })

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

    const microsite = await prisma.microsite.update({
      where: { id: params.id },
      data: {
        ...body,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true, microsite })
  } catch (error) {
    console.error('Error updating microsite:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update microsite' },
      { status: 500 }
    )
  }
}
