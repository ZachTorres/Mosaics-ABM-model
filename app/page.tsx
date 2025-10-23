'use client'

import { useState } from 'react'

interface MicrositeData {
  companyName: string
  url: string
  industry: string
  headline: string
  painPoints: string[]
  solutions: string[]
  cta: string
}

export default function Home() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [microsite, setMicrosite] = useState<MicrositeData | null>(null)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!url.trim()) {
      setError('Please enter a company URL')
      return
    }

    setLoading(true)
    setError('')
    setMicrosite(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate microsite')
      }

      setMicrosite(data.microsite)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Mosaic ABM Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enter any company URL to instantly create a personalized microsite showing how Mosaic can help their business
          </p>
        </div>

        {/* Input Section */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company URL
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="e.g., apple.com or https://www.tesla.com"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Generating...' : 'Generate'}
              </button>
            </div>
            {error && (
              <p className="mt-3 text-sm text-red-600">{error}</p>
            )}
          </div>
        </div>

        {/* Microsite Display */}
        {microsite && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
              {/* Hero Section */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-12">
                <div className="max-w-4xl mx-auto">
                  <p className="text-sm font-semibold uppercase tracking-wide mb-2">
                    {microsite.industry}
                  </p>
                  <h2 className="text-4xl font-bold mb-4">
                    {microsite.companyName}
                  </h2>
                  <p className="text-2xl font-light mb-6">
                    {microsite.headline}
                  </p>
                  <a
                    href={microsite.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-200 hover:text-white underline"
                  >
                    {microsite.url}
                  </a>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-12">
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
                  {/* Pain Points */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                      Challenges We Solve
                    </h3>
                    <ul className="space-y-4">
                      {microsite.painPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start">
                          <svg className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <span className="text-gray-700">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Solutions */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                      How Mosaic Helps
                    </h3>
                    <ul className="space-y-4">
                      {microsite.solutions.map((solution, idx) => (
                        <li key={idx} className="flex items-start">
                          <svg className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-gray-700">{solution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTA Section */}
                <div className="max-w-4xl mx-auto mt-12 pt-12 border-t border-gray-200">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                      {microsite.cta}
                    </h3>
                    <p className="text-gray-600 mb-8">
                      Schedule a personalized demo to see how Mosaic can transform your business
                    </p>
                    <button className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg">
                      Schedule Your Demo
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-12 py-6 border-t border-gray-200">
                <div className="max-w-4xl mx-auto text-center text-sm text-gray-500">
                  Powered by <a href="https://mosaiccorp.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-semibold">Mosaic Corporation</a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
