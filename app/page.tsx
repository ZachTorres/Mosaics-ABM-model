'use client'

import { useState, useEffect, useRef } from 'react'
import MicrositeView from '@/components/MicrositeView'
import { searchCompanies, type Company } from '@/lib/companyDatabase'

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

  // Autocomplete state
  const [suggestions, setSuggestions] = useState<Company[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

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

      // Scroll to microsite after a brief delay to allow rendering
      setTimeout(() => {
        const micrositeElement = document.getElementById('microsite-container')
        if (micrositeElement) {
          micrositeElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
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

  // Autocomplete handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUrl(value)
    setError('')

    // Search for companies matching input (even single characters)
    if (value.trim().length >= 1) {
      const results = searchCompanies(value.trim())
      setSuggestions(results)
      setShowSuggestions(results.length > 0)
      setSelectedIndex(-1)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleSelectSuggestion = (company: Company) => {
    // Add https:// prefix if not present
    const fullUrl = company.domain.startsWith('http') ? company.domain : `https://${company.domain}`
    setUrl(fullUrl)
    setSuggestions([])
    setShowSuggestions(false)
    setSelectedIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSelectSuggestion(suggestions[selectedIndex])
      } else {
        handleGenerate()
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setSelectedIndex(-1)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

        {/* Input Section with blue accent - overflow-visible allows dropdown to extend outside */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-xl shadow-xl border border-blue-200 p-10 overflow-visible">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Enter Your Prospect's Website
              </h2>
              <p className="text-gray-600">
                We'll analyze their business and create a personalized solution presentation
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={url}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g., apple, microsoft, or tesla.com"
                  className="w-full px-6 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg transition-all"
                  disabled={loading}
                  autoComplete="off"
                />

                {/* Autocomplete Dropdown - Fixed positioning to prevent layout shift */}
                {showSuggestions && suggestions.length > 0 && (
                  <div
                    ref={dropdownRef}
                    className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-2xl max-h-96 overflow-y-auto"
                  >
                    {suggestions.map((company, index) => (
                      <button
                        key={`${company.domain}-${index}`}
                        onClick={() => handleSelectSuggestion(company)}
                        className={`w-full px-6 py-4 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                          index === selectedIndex ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 text-lg">
                              {company.name}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {company.domain}
                            </div>
                          </div>
                          <div className="ml-4 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                            {company.industry}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

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
          <div id="microsite-container" className="max-w-6xl mx-auto">
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
