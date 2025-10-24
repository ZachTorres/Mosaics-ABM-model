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
        className="relative text-white px-8 md:px-16 py-20 md:py-24"
        style={{
          background: `linear-gradient(135deg, ${microsite.colors.primary} 0%, ${microsite.colors.secondary} 100%)`
        }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm uppercase tracking-wider opacity-90 mb-4 font-medium">
            A Personalized Overview for {microsite.companyName}
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold mb-6 leading-relaxed">
            {microsite.headline}
          </h1>
          <p className="text-lg md:text-xl opacity-90 leading-relaxed font-light max-w-2xl mx-auto">
            {microsite.subheadline}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 md:px-16 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-light text-gray-800 mb-4">
              How We Can Help
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              We've worked with organizations facing similar opportunities. Here's what might be relevant for {microsite.companyName}.
            </p>
          </div>

          {/* Challenges & Solutions Grid */}
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 mb-16">
            {/* Challenges */}
            <div className="bg-gray-50 rounded-xl p-8">
              <h3 className="text-xl font-medium text-gray-800 mb-6">
                Common Challenges
              </h3>
              <div className="space-y-5">
                {microsite.painPoints.slice(0, 3).map((point, idx) => (
                  <div key={idx} className="flex items-start">
                    <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2.5 mr-4 opacity-40" style={{ backgroundColor: microsite.colors.primary }}></div>
                    <p className="text-gray-600 leading-relaxed text-sm">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Solutions */}
            <div className="bg-gray-50 rounded-xl p-8">
              <h3 className="text-xl font-medium text-gray-800 mb-6">
                What We Offer
              </h3>
              <div className="space-y-5">
                {microsite.solutions.slice(0, 3).map((solution, idx) => (
                  <div key={idx} className="flex items-start">
                    <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2.5 mr-4 opacity-40" style={{ backgroundColor: microsite.colors.accent }}></div>
                    <p className="text-gray-600 leading-relaxed text-sm">{solution}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>


          {/* Contact Form */}
          {showContactForm && (
            <div id="contact-form" className="border-t border-gray-200 pt-16 mt-4">
              <div className="text-center mb-10">
                <h2 className="text-2xl font-light text-gray-800 mb-3">
                  {microsite.cta}
                </h2>
                <p className="text-gray-600">
                  We'd be happy to discuss how we might be able to help
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
