import { NextRequest, NextResponse } from 'next/server'
import { generateShortId, createSlug } from '@/lib/utils'
import fs from 'fs'
import path from 'path'

// In-memory storage for saved microsites
// In production, this would be a database (Vercel KV, Postgres, etc.)
const micrositesStore = new Map<string, any>()

// Directory for storing microsites (for persistence across serverless invocations)
const STORAGE_DIR = path.join(process.cwd(), 'data', 'microsites')

// Ensure storage directory exists
function ensureStorageDir() {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true })
  }
}

// Save microsite to file
function saveMicrositeToFile(id: string, data: any) {
  try {
    ensureStorageDir()
    const filePath = path.join(STORAGE_DIR, `${id}.json`)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Error saving microsite to file:', error)
    // Don't throw - fallback to in-memory storage
  }
}

// Load microsite from file
function loadMicrositeFromFile(id: string): any | null {
  try {
    const filePath = path.join(STORAGE_DIR, `${id}.json`)
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error loading microsite from file:', error)
  }
  return null
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { microsite } = body

    if (!microsite || !microsite.companyName) {
      return NextResponse.json(
        { error: 'Invalid microsite data' },
        { status: 400 }
      )
    }

    // Generate unique ID and slug
    const id = generateShortId()
    const slug = createSlug(microsite.companyName)
    const urlPath = `${slug}-${id}`

    // Save microsite data with metadata
    const savedData = {
      id,
      slug,
      urlPath,
      microsite,
      createdAt: new Date().toISOString(),
      viewCount: 0
    }

    // Store in memory
    micrositesStore.set(id, savedData)

    // Persist to file
    saveMicrositeToFile(id, savedData)

    console.log(`✅ Saved microsite: ${microsite.companyName} (ID: ${id})`)

    return NextResponse.json({
      success: true,
      id,
      urlPath,
      shareUrl: `/m/${urlPath}`
    })

  } catch (error: any) {
    console.error('Error saving microsite:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save microsite' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Microsite ID required' },
        { status: 400 }
      )
    }

    // Try in-memory first
    let savedData = micrositesStore.get(id)

    // Fallback to file storage
    if (!savedData) {
      savedData = loadMicrositeFromFile(id)
      if (savedData) {
        // Load back into memory
        micrositesStore.set(id, savedData)
      }
    }

    if (!savedData) {
      return NextResponse.json(
        { error: 'Microsite not found' },
        { status: 404 }
      )
    }

    // Increment view count
    savedData.viewCount = (savedData.viewCount || 0) + 1
    micrositesStore.set(id, savedData)
    saveMicrositeToFile(id, savedData)

    return NextResponse.json({
      success: true,
      data: savedData
    })

  } catch (error: any) {
    console.error('Error retrieving microsite:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve microsite' },
      { status: 500 }
    )
  }
}
