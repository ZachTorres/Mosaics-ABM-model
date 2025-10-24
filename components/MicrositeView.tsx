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


          {/* Book a Demo CTA */}
          {showContactForm && (
            <div id="contact-form" className="border-t border-gray-200 pt-16 mt-4">
              <div className="text-center mb-10 bg-gradient-to-br from-slate-50 to-blue-50 p-12 rounded-xl border border-slate-200 shadow-lg">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {microsite.cta}
                </h2>

                <p className="text-lg text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed">
                  Book a personalized demo to see how our workflow automation solutions can transform operations at {microsite.companyName}
                </p>

                <a
                  href="https://outlook.office.com/bookwithme/user/28482ab4ec684e649a3667356522a06e%40mosaiccorp.com?anonymous&ismsaljsauthenabled=true"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-10 py-5 text-white text-lg font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  style={{
                    background: `linear-gradient(135deg, ${microsite.colors.primary} 0%, ${microsite.colors.secondary} 100%)`
                  }}
                >
                  <span>Book Your Demo</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </a>

                <p className="text-sm text-gray-600 mt-6">
                  See how Mosaic helps companies streamline document workflows and boost efficiency
                </p>
              </div>
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
