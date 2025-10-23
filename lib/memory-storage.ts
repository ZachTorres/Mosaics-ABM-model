// In-memory storage - works everywhere, no filesystem needed!
// Data resets when serverless function restarts, but that's fine for demos

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
  setupComplete: boolean
}

// In-memory storage
let microsites: Microsite[] = []
let leads: Lead[] = []
let visits: Visit[] = []
let settings: Settings = { setupComplete: false }

console.log('Memory storage initialized - data will reset on function restart')

export const storage = {
  // Settings
  getSettings(): Settings {
    return settings
  },

  saveSettings(newSettings: Partial<Settings>): void {
    settings = { ...settings, ...newSettings }
    console.log('Settings saved to memory')
  },

  // Microsites
  getMicrosites(): Microsite[] {
    return microsites
  },

  getMicrositeBySlug(slug: string): Microsite | null {
    return microsites.find(m => m.slug === slug) || null
  },

  getMicrositeById(id: string): Microsite | null {
    return microsites.find(m => m.id === id) || null
  },

  createMicrosite(data: Omit<Microsite, 'id' | 'createdAt' | 'views' | 'uniqueVisitors'>): Microsite {
    const microsite: Microsite = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      views: 0,
      uniqueVisitors: 0,
    }
    microsites.push(microsite)
    console.log('Microsite created in memory:', microsite.id)
    return microsite
  },

  updateMicrosite(id: string, updates: Partial<Microsite>): Microsite | null {
    const index = microsites.findIndex(m => m.id === id)
    if (index === -1) return null

    microsites[index] = { ...microsites[index], ...updates }
    return microsites[index]
  },

  incrementViews(id: string, isUnique: boolean = false): void {
    const microsite = microsites.find(m => m.id === id)
    if (microsite) {
      microsite.views++
      if (isUnique) microsite.uniqueVisitors++
    }
  },

  // Leads
  getLeads(): Lead[] {
    return leads
  },

  createLead(data: Omit<Lead, 'id' | 'createdAt' | 'status'>): Lead {
    const lead: Lead = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'NEW',
    }
    leads.push(lead)
    console.log('Lead created in memory:', lead.id)
    return lead
  },

  // Visits
  getVisits(): Visit[] {
    return visits
  },

  getVisitByVisitor(micrositeId: string, visitorId: string): Visit | null {
    return visits.find(v => v.micrositeId === micrositeId && v.visitorId === visitorId) || null
  },

  createVisit(data: Omit<Visit, 'id' | 'createdAt' | 'pageViews'>): Visit {
    const visit: Visit = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      pageViews: 1,
    }
    visits.push(visit)
    return visit
  },

  incrementPageViews(micrositeId: string, visitorId: string): void {
    const visit = visits.find(v => v.micrositeId === micrositeId && v.visitorId === visitorId)
    if (visit) {
      visit.pageViews++
    }
  },
}
