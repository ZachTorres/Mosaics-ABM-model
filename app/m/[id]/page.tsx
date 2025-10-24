import { notFound } from 'next/navigation'
import MicrositeView from '@/components/MicrositeView'

async function getMicrosite(urlPath: string) {
  try {
    // Extract the ID from the URL path (format: slug-id)
    const parts = urlPath.split('-')
    const id = parts[parts.length - 1]

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/save-microsite?id=${id}`, {
      cache: 'no-store' // Always fetch fresh data
    })

    if (!response.ok) {
      return null
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    console.error('Error fetching microsite:', error)
    return null
  }
}

export default async function MicrositePage({ params }: { params: { id: string } }) {
  const data = await getMicrosite(params.id)

  if (!data || !data.microsite) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header with branding */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mosaic ABM Microsite
          </h1>
          <p className="text-sm text-gray-600">
            Personalized for {data.microsite.companyName}
          </p>
        </div>

        {/* Microsite Display */}
        <div className="max-w-5xl mx-auto">
          <MicrositeView microsite={data.microsite} showContactForm={true} />
        </div>

        {/* Powered by footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          Want to create your own personalized microsite? Visit{' '}
          <a href="/" className="text-blue-600 hover:text-blue-700 font-semibold">
            Mosaic ABM Generator
          </a>
        </div>
      </div>
    </div>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { id: string } }) {
  const data = await getMicrosite(params.id)

  if (!data || !data.microsite) {
    return {
      title: 'Microsite Not Found'
    }
  }

  return {
    title: `${data.microsite.companyName} - Mosaic Solutions`,
    description: data.microsite.headline,
  }
}
