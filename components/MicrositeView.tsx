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

interface MicrositeViewProps {
  microsite: MicrositeData
  showContactForm?: boolean
  onContactSubmit?: (formData: ContactFormData) => Promise<void>
}

export default function MicrositeView({ microsite, showContactForm = true, onContactSubmit }: MicrositeViewProps) {
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

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError('')
    setSubmitSuccess(false)

    // Validation
    if (!contactForm.firstName || !contactForm.lastName || !contactForm.email) {
      setSubmitError('Please fill in all required fields')
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
      if (onContactSubmit) {
        await onContactSubmit(contactForm)
      } else {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...contactForm,
            companyName: microsite.companyName,
            targetUrl: microsite.url
          })
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to submit form')
        }
      }

      setSubmitSuccess(true)
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
    <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
      {/* Hero Section */}
      <div
        className="relative text-white px-8 md:px-16 py-16 md:py-20"
        style={{
          background: `linear-gradient(135deg, ${microsite.colors.primary} 0%, ${microsite.colors.secondary} 100%)`
        }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {microsite.headline}
          </h1>
          <p className="text-xl md:text-2xl opacity-95 leading-relaxed">
            {microsite.subheadline}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 md:px-16 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Challenges & Solutions Grid */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-12">
            {/* Challenges */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-red-500">⚠️</span>
                Your Challenges
              </h2>
              <div className="space-y-4">
                {microsite.painPoints.slice(0, 4).map((point, idx) => (
                  <div key={idx} className="flex items-start bg-red-50 p-4 rounded-lg border border-red-100">
                    <svg
                      className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-800 font-medium leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Solutions */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Our Solutions
              </h2>
              <div className="space-y-4">
                {microsite.solutions.slice(0, 4).map((solution, idx) => (
                  <div key={idx} className="flex items-start bg-green-50 p-4 rounded-lg border border-green-100">
                    <svg
                      className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-800 font-medium leading-relaxed">{solution}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Prominent CTA Section */}
          <div className="mt-12 pt-12 border-t border-gray-200">
            <div className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border-2 border-blue-200">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {microsite.cta}
              </h3>
              <p className="text-gray-700 mb-8 text-lg">
                Schedule a personalized demo to see how Mosaic can transform {microsite.companyName}'s operations
              </p>
              <a
                href="#contact-form"
                className="inline-flex items-center gap-3 px-10 py-5 text-white text-xl font-bold rounded-xl transition-all shadow-2xl hover:shadow-xl transform hover:scale-105 hover:-translate-y-1"
                style={{
                  background: `linear-gradient(135deg, ${microsite.colors.primary} 0%, ${microsite.colors.secondary} 100%)`
                }}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                <span>Get Your Free Demo</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <p className="text-sm text-gray-600 mt-4">
                No credit card required • 30-minute consultation • See results in real-time
              </p>
            </div>
          </div>

          {/* Contact Form */}
          {showContactForm && (
            <div id="contact-form" className="border-t border-gray-200 pt-12 mt-12 scroll-mt-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Get Started Today
                </h2>
                <p className="text-lg text-gray-600">
                  Fill out the form below and we'll be in touch shortly
                </p>
              </div>

              {submitSuccess ? (
                <div className="max-w-2xl mx-auto bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
                  <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-2xl font-bold text-green-900 mb-2">
                    Thank You!
                  </h3>
                  <p className="text-green-700 text-lg">
                    We'll be in touch shortly to discuss your needs.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="max-w-2xl mx-auto space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        value={contactForm.firstName}
                        onChange={(e) => updateContactForm('firstName', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="First Name"
                        required
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={contactForm.lastName}
                        onChange={(e) => updateContactForm('lastName', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Last Name"
                        required
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => updateContactForm('email', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Email Address"
                        required
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) => updateContactForm('phone', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Phone Number"
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  <div>
                    <textarea
                      value={contactForm.currentProblem}
                      onChange={(e) => updateContactForm('currentProblem', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                      placeholder="Tell us about your biggest workflow challenge..."
                      disabled={submitting}
                    />
                  </div>

                  {submitError && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                      <p className="text-red-700 text-center">{submitError}</p>
                    </div>
                  )}

                  <div className="text-center">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-10 py-4 text-white text-lg font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      style={{
                        background: submitting ? '#9CA3AF' : `linear-gradient(135deg, ${microsite.colors.primary} 0%, ${microsite.colors.secondary} 100%)`
                      }}
                    >
                      {submitting ? 'Sending...' : 'Request a Demo'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img
              src="https://mosaiccorp.com/wp-content/uploads/2017/06/mosaicpaperless.png"
              alt="Mosaic"
              className="h-8"
            />
          </div>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Mosaic Corporation. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
