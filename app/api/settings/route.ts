import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage'

export async function GET() {
  try {
    const settings = storage.getSettings()

    return NextResponse.json({
      success: true,
      settings: {
        setupComplete: settings.setupComplete || false,
        hasOpenAI: !!settings.openaiApiKey,
      },
    })
  } catch (error) {
    console.error('Error loading settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to load settings' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { openaiApiKey } = body

    if (openaiApiKey) {
      storage.saveSettings({
        openaiApiKey,
        setupComplete: true,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving settings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save settings' },
      { status: 500 }
    )
  }
}
