import { NextResponse } from 'next/server'

// Campaigns feature disabled in simple version
export async function POST() {
  return NextResponse.json(
    { success: false, error: 'Campaigns feature not available in simplified version' },
    { status: 501 }
  )
}

export async function GET() {
  return NextResponse.json({ success: true, campaigns: [] })
}
