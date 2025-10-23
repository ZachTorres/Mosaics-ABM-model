'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Card, CardContent, CardHeader } from '@/components/Card'
import Link from 'next/link'

interface Microsite {
  id: string
  slug: string
  targetCompanyName: string
  targetCompanyUrl: string
  targetIndustry: string
  status: string
  views: number
  uniqueVisitors: number
  createdAt: string
  _count: {
    visits: number
    leads: number
  }
}

export default function DashboardPage() {
  const [targetUrl, setTargetUrl] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [microsites, setMicrosites] = useState<Microsite[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadMicrosites()
  }, [])

  const loadMicrosites = async () => {
    try {
      const response = await fetch('/api/microsites')
      const data = await response.json()
      if (data.success) {
        setMicrosites(data.microsites)
      }
    } catch (err) {
      console.error('Failed to load microsites:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    setError('')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUrl }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate microsite')
      }

      // Reload microsites
      await loadMicrosites()

      // Reset form
      setTargetUrl('')

      // Navigate to the new microsite
      window.open(data.microsite.url, '_blank')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate microsite')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    alert('URL copied to clipboard!')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-mosaic-blue-600">
              Mosaic ABM
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/analytics">
                <Button variant="outline">Analytics</Button>
              </Link>
              <Link href="/leads">
                <Button variant="outline">Leads</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Generator Section */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-900">Generate New Microsite</h2>
            <p className="text-gray-600 mt-1">
              Enter a company's website URL to create a personalized ABM microsite
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="flex gap-4">
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button type="submit" isLoading={isGenerating} disabled={isGenerating}>
                  {isGenerating ? 'Generating...' : 'Generate Microsite'}
                </Button>
              </div>
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600">{error}</p>
                </div>
              )}
              <p className="text-sm text-gray-500">
                Our AI will analyze the company, identify pain points, and create a custom
                microsite in under 60 seconds.
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-3xl font-bold text-mosaic-blue-600">{microsites.length}</p>
              <p className="text-gray-600">Total Microsites</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-3xl font-bold text-mosaic-blue-600">
                {microsites.reduce((sum, m) => sum + m.views, 0)}
              </p>
              <p className="text-gray-600">Total Views</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-3xl font-bold text-mosaic-blue-600">
                {microsites.reduce((sum, m) => sum + m.uniqueVisitors, 0)}
              </p>
              <p className="text-gray-600">Unique Visitors</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-3xl font-bold text-mosaic-blue-600">
                {microsites.reduce((sum, m) => sum + m._count.leads, 0)}
              </p>
              <p className="text-gray-600">Total Leads</p>
            </CardContent>
          </Card>
        </div>

        {/* Microsites List */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-900">Your Microsites</h2>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading microsites...</p>
              </div>
            ) : microsites.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No microsites yet. Create your first one above!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Company</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Industry</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Views</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Visitors</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Leads</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Created</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {microsites.map((microsite) => (
                      <tr key={microsite.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {microsite.targetCompanyName}
                            </p>
                            <p className="text-sm text-gray-500">{microsite.targetCompanyUrl}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">{microsite.targetIndustry}</td>
                        <td className="py-3 px-4 text-center text-gray-900 font-semibold">
                          {microsite.views}
                        </td>
                        <td className="py-3 px-4 text-center text-gray-900 font-semibold">
                          {microsite.uniqueVisitors}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-semibold">
                            {microsite._count.leads}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 text-sm">
                          {new Date(microsite.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <a
                              href={`/m/${microsite.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button variant="outline" size="sm">
                                View
                              </Button>
                            </a>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() =>
                                copyToClipboard(
                                  `${window.location.origin}/m/${microsite.slug}`
                                )
                              }
                            >
                              Copy Link
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
