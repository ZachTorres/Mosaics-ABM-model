'use client'

import { useEffect } from 'react'

interface AnalyticsProps {
  micrositeId: string
}

export function Analytics({ micrositeId }: AnalyticsProps) {
  useEffect(() => {
    // Get or create visitor ID
    let visitorId = localStorage.getItem('mosaic_visitor_id')
    if (!visitorId) {
      visitorId = crypto.randomUUID()
      localStorage.setItem('mosaic_visitor_id', visitorId)
    }

    // Track pageview
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        micrositeId,
        event: 'pageview',
        visitorId,
      }),
    }).catch(console.error)

    // Track time on page
    const startTime = Date.now()

    return () => {
      const duration = Math.floor((Date.now() - startTime) / 1000)
      // Could send duration data here if needed
    }
  }, [micrositeId])

  return null
}

export function trackCTAClick(micrositeId: string) {
  const visitorId = localStorage.getItem('mosaic_visitor_id')

  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      micrositeId,
      event: 'cta_click',
      visitorId,
    }),
  }).catch(console.error)
}
