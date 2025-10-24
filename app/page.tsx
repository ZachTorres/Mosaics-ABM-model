'use client'

import { useState } from 'react'
import MicrositeView from '@/components/MicrositeView'

interface MicrositeData {
  companyName: string
  url: string
  industry: string
  description: string
  headline: string
  subheadline: string
  painPoints: string[]
  solutions: string[]
  cta: string
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  logoUrl?: string
}

interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  currentProblem: string
}

export default function Home() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [microsite, setMicrosite] = useState<MicrositeData | null>(null)
  const [error, setError] = useState('')

  // Save/Share state
  const [saving, setSaving] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!url.trim()) {
      setError('Please enter a company URL')
      return
    }

    setLoading(true)
    setError('')
    setMicrosite(null)
    setShareUrl('')
    setCopied(false)

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

  const handleSaveAndShare = async () => {
    if (!microsite) return

    setSaving(true)
    try {
      const response = await fetch('/api/save-microsite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ microsite })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save microsite')
      }

      const fullUrl = `${window.location.origin}${data.shareUrl}`
      setShareUrl(fullUrl)
    } catch (err: any) {
      alert(err.message || 'Failed to save microsite')
    } finally {
      setSaving(false)
    }
  }

  const handleCopyLink = async () => {
    if (!shareUrl) return

    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      alert('Failed to copy link')
    }
  }

  const handleContactSubmit = async (formData: ContactFormData) => {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        companyName: microsite?.companyName,
        targetUrl: microsite?.url
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to submit form')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero section with blue theme */}
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center mb-8">
            <img
              src="https://mosaiccorp.com/wp-content/uploads/2017/06/mosaicpaperless.png"
              alt="Mosaic Corporation"
              className="h-20 md:h-24"
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Personalized Client Solutions
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-4 font-light">
            Generate customized presentations showing how Epicor ECM transforms your prospect's operations
          </p>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Powered by 25+ years of workflow automation expertise
          </p>
        </div>

        {/* Input Section with blue accent */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-xl shadow-xl border border-blue-200 p-10">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Enter Your Prospect's Website
              </h2>
              <p className="text-gray-600">
                We'll analyze their business and create a personalized solution presentation
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="e.g., apple.com or https://www.tesla.com"
                className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-all"
                disabled={loading}
              />
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="px-10 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  'Generate Microsite'
                )}
              </button>
            </div>
            {error && (
              <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
            )}
          </div>
        </div>

        {/* Microsite Display */}
        {microsite && (
          <div className="max-w-6xl mx-auto">
            {/* Save & Share Bar with blue theme */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-2xl p-8 mb-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 text-white">
                  <h3 className="text-2xl font-bold mb-2">
                    Share with {microsite.companyName}
                  </h3>
                  <p className="text-blue-100 text-base">
                    Generate a shareable link to send this personalized presentation to your prospect
                  </p>
                </div>
                <div className="flex gap-3">
                  {!shareUrl ? (
                    <button
                      onClick={handleSaveAndShare}
                      disabled={saving}
                      className="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-3 text-lg"
                    >
                      {saving ? (
                        <>
                          <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                          Save & Share
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="flex flex-col md:flex-row gap-3">
                      <input
                        type="text"
                        readOnly
                        value={shareUrl}
                        className="px-5 py-4 border-2 border-blue-300 rounded-lg bg-blue-50 text-blue-900 text-base w-full md:w-96 focus:outline-none focus:border-white"
                      />
                      <button
                        onClick={handleCopyLink}
                        className="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-lg whitespace-nowrap"
                      >
                        {copied ? (
                          <>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Copied!
                          </>
                        ) : (
                          <>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy Link
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Microsite Component */}
            <MicrositeView microsite={microsite} showContactForm={true} onContactSubmit={handleContactSubmit} />
          </div>
        )}
      </div>
    </div>
  )
}
