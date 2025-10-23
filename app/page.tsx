import Link from 'next/link'
import { Button } from '@/components/Button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-mosaic-blue-50 via-white to-mosaic-blue-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-mosaic-blue-600">Mosaic ABM</div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Personalized ABM
              <span className="block text-mosaic-blue-600">Microsites at Scale</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12">
              Transform your account-based marketing with AI-powered, personalized microsites that
              show exactly how Mosaic Corporation can help each target account.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="text-lg px-8 py-4">
                  Create Your First Microsite
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  See How It Works
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Everything You Need for ABM Success
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Powered by AI, designed for BDRs and sales teams
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="p-8 rounded-xl border border-gray-200 hover:border-mosaic-blue-400 hover:shadow-lg transition-all">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">1:1 Personalization</h3>
              <p className="text-gray-600">
                Enter any company URL and our AI automatically analyzes their business, identifies
                pain points, and creates a custom microsite showing exactly how Mosaic can help.
              </p>
            </div>

            <div className="p-8 rounded-xl border border-gray-200 hover:border-mosaic-blue-400 hover:shadow-lg transition-all">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">AI-Powered Content</h3>
              <p className="text-gray-600">
                GPT-4 generates compelling, industry-specific messaging, value propositions, and
                solution recommendations tailored to each target account's unique needs.
              </p>
            </div>

            <div className="p-8 rounded-xl border border-gray-200 hover:border-mosaic-blue-400 hover:shadow-lg transition-all">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Real-Time Analytics</h3>
              <p className="text-gray-600">
                Track views, engagement, and conversions for every microsite. Know exactly when
                prospects visit and what they're interested in.
              </p>
            </div>

            <div className="p-8 rounded-xl border border-gray-200 hover:border-mosaic-blue-400 hover:shadow-lg transition-all">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-600">
                Generate a fully personalized microsite in under 60 seconds. From URL input to
                shareable link, the entire process is automated.
              </p>
            </div>

            <div className="p-8 rounded-xl border border-gray-200 hover:border-mosaic-blue-400 hover:shadow-lg transition-all">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Beautiful Design</h3>
              <p className="text-gray-600">
                Every microsite features stunning, responsive design that works perfectly on any
                device and makes a lasting impression.
              </p>
            </div>

            <div className="p-8 rounded-xl border border-gray-200 hover:border-mosaic-blue-400 hover:shadow-lg transition-all">
              <div className="text-5xl mb-4">📈</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Campaign Management</h3>
              <p className="text-gray-600">
                Organize microsites into campaigns, track performance across multiple accounts, and
                export leads directly to your CRM.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-mosaic-blue-600 to-mosaic-blue-700 text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white text-mosaic-blue-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Enter Target URL</h3>
              <p className="text-mosaic-blue-100">
                Input your target company's website URL
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white text-mosaic-blue-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">AI Analysis</h3>
              <p className="text-mosaic-blue-100">
                We analyze their business, industry, and pain points
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white text-mosaic-blue-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Generate Microsite</h3>
              <p className="text-mosaic-blue-100">
                Custom content and solutions are automatically created
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white text-mosaic-blue-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-xl font-bold mb-2">Share & Track</h3>
              <p className="text-mosaic-blue-100">
                Send the link and monitor engagement in real-time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Transform Your ABM Strategy?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start creating personalized microsites that convert prospects into customers
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="text-lg px-12 py-4">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 mb-4">
            &copy; {new Date().getFullYear()} Mosaic Corporation. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            Powered by AI. Built for Sales Success.
          </p>
        </div>
      </footer>
    </div>
  )
}
