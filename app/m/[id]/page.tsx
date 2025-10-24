'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import MicrositeView from '@/components/MicrositeView'

interface SavedMicrositeData {
  id: string
  microsite: any
  createdAt: string
  viewCount: number
}

export default function MicrositePage() {
  const params = useParams()
  const id = params.id as string

  const [data, setData] = useState<SavedMicrositeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function loadMicrosite() {
      try {
        // ID is now just the short ID (no slug parsing needed)
        const response = await fetch(`/api/save-microsite?id=${id}`)

        if (!response.ok) {
          setError(true)
          return
        }

        const result = await response.json()
        setData(result.data)
      } catch (err) {
        console.error('Error loading microsite:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    loadMicrosite()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading microsite...</p>
        </div>
      </div>
    )
  }

  if (error || !data || !data.microsite) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Microsite Not Found</h2>
          <p className="text-gray-600 mb-8">
            This microsite doesn't exist or may have expired.
          </p>
          <a
            href="/"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            Generate a New Microsite
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        {/* Microsite Display */}
        <div className="max-w-5xl mx-auto">
          <MicrositeView microsite={data.microsite} showContactForm={true} />
        </div>
      </div>
    </div>
  )
}
