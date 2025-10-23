import { storage } from '@/lib/storage'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Analytics } from '@/components/Analytics'
import { ContactForm } from './ContactForm'
import { Metadata } from 'next'

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const microsite = storage.getMicrositeBySlug(params.slug)

  if (!microsite) {
    return {
      title: 'Not Found',
    }
  }

  return {
    title: `${microsite.headline} | Mosaic Corporation`,
    description: microsite.subheadline || undefined,
  }
}

export default async function MicrositePage({ params }: PageProps) {
  const microsite = storage.getMicrositeBySlug(params.slug)

  if (!microsite || microsite.status !== 'PUBLISHED') {
    notFound()
  }

  const valueProps = microsite.valuePropositions as any[]
  const solutions = microsite.recommendedSolutions as any[]
  const customContent = microsite.customContent as any
  const logo = customContent?.logo

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Analytics micrositeId={microsite.id} />

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src="/mosaic-logo.png"
                alt="Mosaic Corporation"
                width={150}
                height={40}
                className="h-10 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Personalized for</span>
              {logo && (
                <Image
                  src={logo}
                  alt={microsite.targetCompanyName}
                  width={24}
                  height={24}
                  className="h-6 w-6 rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              )}
              <span className="font-semibold text-mosaic-blue-700">
                {microsite.targetCompanyName}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {microsite.headline}
            </h1>
            {microsite.subheadline && (
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
                {microsite.subheadline}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <a
                href="#contact"
                className="bg-mosaic-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-mosaic-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                {customContent?.cta || 'Get Your Custom Solution'}
              </a>
              <a
                href="#solutions"
                className="border-2 border-mosaic-blue-600 text-mosaic-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-mosaic-blue-50 transition-all"
              >
                See How We Can Help
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Why {microsite.targetCompanyName} Needs Mosaic
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {valueProps.map((prop, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border border-gray-200 hover:border-mosaic-blue-400 hover:shadow-lg transition-all animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl mb-4">{prop.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{prop.title}</h3>
                <p className="text-gray-600">{prop.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Pitch */}
      {customContent?.customPitch && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-mosaic-blue-50 to-mosaic-blue-100">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
              <div className="prose prose-lg max-w-none">
                {customContent.customPitch.split('\n\n').map((paragraph: string, index: number) => (
                  <p key={index} className="text-gray-700 mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recommended Solutions */}
      <section id="solutions" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Solutions Tailored for {microsite.targetCompanyName}
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Based on our analysis of your {microsite.targetIndustry} business, here are our
            recommended workflow automation solutions
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
              >
                <div className="bg-gradient-to-r from-mosaic-blue-600 to-mosaic-blue-700 p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{solution.name}</h3>
                  <p className="text-mosaic-blue-100">{solution.description}</p>
                </div>
                <div className="p-6">
                  <ul className="space-y-3 mb-6">
                    {solution.benefits.map((benefit: string, bIndex: number) => (
                      <li key={bIndex} className="flex items-start">
                        <svg
                          className="h-6 w-6 text-green-500 mr-2 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="bg-mosaic-blue-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-mosaic-blue-900">Expected ROI</p>
                    <p className="text-lg font-bold text-mosaic-blue-700">{solution.roi}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Trusted by Industry Leaders
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-8 rounded-lg shadow">
              <p className="text-4xl font-bold text-mosaic-blue-600 mb-2">80%</p>
              <p className="text-gray-600">Reduction in Processing Time</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow">
              <p className="text-4xl font-bold text-mosaic-blue-600 mb-2">95%</p>
              <p className="text-gray-600">Accuracy Rate</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow">
              <p className="text-4xl font-bold text-mosaic-blue-600 mb-2">500+</p>
              <p className="text-gray-600">Companies Transformed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-mosaic-blue-700 to-mosaic-blue-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform {microsite.targetCompanyName}?
            </h2>
            <p className="text-xl text-mosaic-blue-100">
              Let's discuss how Mosaic can customize a solution for your specific needs
            </p>
          </div>
          <ContactForm micrositeId={microsite.id} companyName={microsite.targetCompanyName} />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 mb-4">
            &copy; {new Date().getFullYear()} Mosaic Corporation. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            This personalized microsite was created specifically for {microsite.targetCompanyName}
          </p>
          <div className="mt-6">
            <a
              href="https://mosaiccorp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-mosaic-blue-400 hover:text-mosaic-blue-300"
            >
              Visit Mosaic Corporation →
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
