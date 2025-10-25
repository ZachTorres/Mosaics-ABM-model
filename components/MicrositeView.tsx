'use client'

import { useState } from 'react'
import { getRelevantCustomers, getCompanyInitial, type Customer } from '@/lib/customerLogos'

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
  companySize?: 'small' | 'medium' | 'large' | 'enterprise'
  location?: string
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

  // Get relevant customer logos based on location and industry
  const relevantCustomers = getRelevantCustomers(
    microsite.industry,
    microsite.companySize || 'large',
    microsite.location,
    6
  )

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
        className="relative text-white px-8 md:px-16 py-24 md:py-32"
        style={{
          background: `linear-gradient(135deg, ${microsite.colors.primary} 0%, ${microsite.colors.secondary} 100%)`
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm uppercase tracking-widest opacity-90 mb-6 font-semibold">
            Mosaic Built This for {microsite.companyName}
          </p>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight tracking-tight">
            {microsite.headline}
          </h1>
          <p className="text-xl md:text-2xl opacity-95 leading-relaxed font-normal max-w-3xl mx-auto">
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
              How Mosaic Can Help {microsite.companyName}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Mosaic has partnered with {microsite.industry.toLowerCase()} companies facing similar challenges. Here's how we can help {microsite.companyName} transform document workflows.
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

          {/* Social Proof - Customer Logos */}
          <div className="py-16 border-t border-gray-200">
            <div className="text-center mb-12">
              <p className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-8">
                Trusted by Industry Leaders
              </p>
              <h3 className="text-2xl font-light text-gray-800 mb-3">
                Companies Like {microsite.companyName} Partner With Mosaic
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Join leading organizations that have transformed their document workflows with Epicor ECM
              </p>
            </div>

            {/* Logo Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {relevantCustomers.map((customer, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-center p-6 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group"
                >
                  <div className="text-center">
                    {/* Company Initial/Monogram */}
                    <div
                      className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-white font-bold text-xl transition-transform group-hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, ${microsite.colors.primary} 0%, ${microsite.colors.secondary} 100%)`
                      }}
                    >
                      {getCompanyInitial(customer.name)}
                    </div>
                    <div className="font-semibold text-gray-800 text-sm mb-1">
                      {customer.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {customer.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Optional: Add a subtle note about location matching */}
            {microsite.location && (
              <p className="text-center text-xs text-gray-500 mt-8">
                Companies in {microsite.location} and the {relevantCustomers[0]?.region || 'region'}
              </p>
            )}
          </div>

          {/* Book a Demo CTA */}
          {showContactForm && (
            <div id="contact-form" className="border-t border-gray-200 pt-16 mt-4">
              <div className="text-center mb-10 bg-gradient-to-br from-slate-50 to-blue-50 p-12 rounded-xl border border-slate-200 shadow-lg">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  {microsite.cta}
                </h2>

                <p className="text-lg text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed">
                  Book a personalized demo to see how Mosaic's workflow automation solutions can transform operations at {microsite.companyName}
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
