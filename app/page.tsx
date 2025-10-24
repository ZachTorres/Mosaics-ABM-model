'use client'

import { useState } from 'react'

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

  // Contact form state
  const [contactForm, setContactForm] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    currentProblem: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleGenerate = async () => {
    if (!url.trim()) {
      setError('Please enter a company URL')
      return
    }

    setLoading(true)
    setError('')
    setMicrosite(null)
    // Reset contact form when generating new microsite
    setContactForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      currentProblem: ''
    })
    setSubmitSuccess(false)
    setSubmitError('')

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

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError('')
    setSubmitSuccess(false)

    // Validation
    if (!contactForm.firstName || !contactForm.lastName || !contactForm.email) {
      setSubmitError('Please fill in all required fields (First Name, Last Name, Email)')
      setSubmitting(false)
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(contactForm.email)) {
      setSubmitError('Please enter a valid email address')
      setSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...contactForm,
          companyName: microsite?.companyName,
          targetUrl: microsite?.url
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form')
      }

      setSubmitSuccess(true)
      // Reset form
      setContactForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        currentProblem: ''
      })
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const updateContactForm = (field: keyof ContactFormData, value: string) => {
    setContactForm(prev => ({ ...prev, [field]: value }))
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
              {/* Hero Section with Dynamic Colors */}
              <div
                className="text-white p-12"
                style={{
                  background: `linear-gradient(135deg, ${microsite.colors.primary} 0%, ${microsite.colors.secondary} 100%)`
                }}
              >
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-center gap-4 mb-4">
                    <p className="text-sm font-semibold uppercase tracking-wide opacity-90">
                      {microsite.industry}
                    </p>
                  </div>
                  <h2 className="text-4xl font-bold mb-4">
                    {microsite.companyName}
                  </h2>
                  <p className="text-2xl font-light mb-4">
                    {microsite.headline}
                  </p>
                  <p className="text-lg opacity-90 mb-6 leading-relaxed">
                    {microsite.subheadline}
                  </p>
                  <a
                    href={microsite.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-white/80 hover:text-white underline text-sm"
                  >
                    Visit {microsite.companyName} →
                  </a>
                </div>
              </div>

              {/* Company Description */}
              {microsite.description && (
                <div className="bg-gray-50 px-12 py-8 border-b border-gray-200">
                  <div className="max-w-4xl mx-auto">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      About {microsite.companyName}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {microsite.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Content Section */}
              <div className="p-12">
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
                  {/* Pain Points */}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                      Challenges We Solve for {microsite.companyName}
                    </h3>
                    <ul className="space-y-4">
                      {microsite.painPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start">
                          <svg
                            className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            style={{ color: microsite.colors.primary }}
                          >
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
                          <svg
                            className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            style={{ color: microsite.colors.accent }}
                          >
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
                      Schedule a personalized demo to see how Mosaic can transform {microsite.companyName}'s operations
                    </p>
                  </div>
                </div>

                {/* Contact Form Section */}
                <div className="max-w-4xl mx-auto mt-12 pt-12 border-t border-gray-200">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Get Started Today
                    </h3>
                    <p className="text-gray-600">
                      Fill out the form below and we'll be in touch shortly
                    </p>
                  </div>

                  {submitSuccess ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                      <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h4 className="text-xl font-semibold text-green-900 mb-2">
                        Thank You!
                      </h4>
                      <p className="text-green-700">
                        We've received your information and will contact you soon.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* First Name */}
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                            First Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            value={contactForm.firstName}
                            onChange={(e) => updateContactForm('firstName', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="John"
                            required
                            disabled={submitting}
                          />
                        </div>

                        {/* Last Name */}
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            value={contactForm.lastName}
                            onChange={(e) => updateContactForm('lastName', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Doe"
                            required
                            disabled={submitting}
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Email */}
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={contactForm.email}
                            onChange={(e) => updateContactForm('email', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="john.doe@example.com"
                            required
                            disabled={submitting}
                          />
                        </div>

                        {/* Phone Number */}
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            value={contactForm.phone}
                            onChange={(e) => updateContactForm('phone', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="(555) 123-4567"
                            disabled={submitting}
                          />
                        </div>
                      </div>

                      {/* Current Problem */}
                      <div>
                        <label htmlFor="currentProblem" className="block text-sm font-medium text-gray-700 mb-2">
                          What's your current challenge?
                        </label>
                        <textarea
                          id="currentProblem"
                          value={contactForm.currentProblem}
                          onChange={(e) => updateContactForm('currentProblem', e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          placeholder="Tell us about the challenges you're facing..."
                          disabled={submitting}
                        />
                      </div>

                      {submitError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <p className="text-sm text-red-600">{submitError}</p>
                        </div>
                      )}

                      <div className="text-center">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="px-8 py-4 text-white text-lg font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                          style={{
                            background: submitting ? '#9CA3AF' : `linear-gradient(135deg, ${microsite.colors.primary} 0%, ${microsite.colors.secondary} 100%)`
                          }}
                        >
                          {submitting ? 'Submitting...' : 'Submit Information'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-12 py-6 border-t border-gray-200">
                <div className="max-w-4xl mx-auto text-center text-sm text-gray-500">
                  Personalized for {microsite.companyName} • Powered by <a href="https://mosaiccorp.com" target="_blank" rel="noopener noreferrer" className="font-semibold" style={{ color: microsite.colors.primary }}>Mosaic Corporation</a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
