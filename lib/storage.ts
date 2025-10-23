// Simple file-based storage - no database required!
// Data persists in JSON files during the session

import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), '.data')

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

interface Microsite {
  id: string
  slug: string
  targetCompanyName: string
  targetCompanyUrl: string
  targetIndustry: string
  targetCompanySize: string
  companyDescription: string
  techStack: string[]
  painPoints: string[]
  headline: string
  subheadline: string
  valuePropositions: any[]
  customContent: any
  recommendedSolutions: any[]
  status: string
  views: number
  uniqueVisitors: number
  createdAt: string
  publishedAt: string | null
}

interface Lead {
  id: string
  micrositeId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  companyName: string
  jobTitle?: string
  message?: string
  status: string
  createdAt: string
}

interface Visit {
  id: string
  micrositeId: string
  visitorId: string
  createdAt: string
  pageViews: number
}

interface Settings {
  openaiApiKey?: string
  databaseUrl?: string
  setupComplete: boolean
}

// Helper functions
function readJSON<T>(filename: string, defaultValue: T): T {
  const filepath = path.join(DATA_DIR, filename)
  try {
    if (fs.existsSync(filepath)) {
      const data = fs.readFileSync(filepath, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error(`Error reading ${filename}:`, error)
  }
  return defaultValue
}

function writeJSON(filename: string, data: any): void {
  const filepath = path.join(DATA_DIR, filename)
  try {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error(`Error writing ${filename}:`, error)
  }
}

// Storage functions
export const storage = {
  // Settings
  getSettings(): Settings {
    return readJSON('settings.json', { setupComplete: false })
  },

  saveSettings(settings: Partial<Settings>): void {
    const current = this.getSettings()
    writeJSON('settings.json', { ...current, ...settings })
  },

  // Microsites
  getMicrosites(): Microsite[] {
    return readJSON('microsites.json', [])
  },

  getMicrositeBySlug(slug: string): Microsite | null {
    const microsites = this.getMicrosites()
    return microsites.find(m => m.slug === slug) || null
  },

  getMicrositeById(id: string): Microsite | null {
    const microsites = this.getMicrosites()
    return microsites.find(m => m.id === id) || null
  },

  createMicrosite(data: Omit<Microsite, 'id' | 'createdAt' | 'views' | 'uniqueVisitors'>): Microsite {
    const microsites = this.getMicrosites()
    const microsite: Microsite = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      views: 0,
      uniqueVisitors: 0,
    }
    microsites.push(microsite)
    writeJSON('microsites.json', microsites)
    return microsite
  },

  updateMicrosite(id: string, updates: Partial<Microsite>): Microsite | null {
    const microsites = this.getMicrosites()
    const index = microsites.findIndex(m => m.id === id)
    if (index === -1) return null

    microsites[index] = { ...microsites[index], ...updates }
    writeJSON('microsites.json', microsites)
    return microsites[index]
  },

  incrementViews(id: string, isUnique: boolean = false): void {
    const microsites = this.getMicrosites()
    const microsite = microsites.find(m => m.id === id)
    if (microsite) {
      microsite.views++
      if (isUnique) microsite.uniqueVisitors++
      writeJSON('microsites.json', microsites)
    }
  },

  // Leads
  getLeads(): Lead[] {
    return readJSON('leads.json', [])
  },

  createLead(data: Omit<Lead, 'id' | 'createdAt' | 'status'>): Lead {
    const leads = this.getLeads()
    const lead: Lead = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'NEW',
    }
    leads.push(lead)
    writeJSON('leads.json', leads)
    return lead
  },

  // Visits
  getVisits(): Visit[] {
    return readJSON('visits.json', [])
  },

  getVisitByVisitor(micrositeId: string, visitorId: string): Visit | null {
    const visits = this.getVisits()
    return visits.find(v => v.micrositeId === micrositeId && v.visitorId === visitorId) || null
  },

  createVisit(data: Omit<Visit, 'id' | 'createdAt' | 'pageViews'>): Visit {
    const visits = this.getVisits()
    const visit: Visit = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      pageViews: 1,
    }
    visits.push(visit)
    writeJSON('visits.json', visits)
    return visit
  },

  incrementPageViews(micrositeId: string, visitorId: string): void {
    const visits = this.getVisits()
    const visit = visits.find(v => v.micrositeId === micrositeId && v.visitorId === visitorId)
    if (visit) {
      visit.pageViews++
      writeJSON('visits.json', visits)
    }
  },
}
