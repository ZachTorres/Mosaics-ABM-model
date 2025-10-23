'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/Card'
import { Button } from '@/components/Button'
import Link from 'next/link'

interface Microsite {
  id: string
  slug: string
  targetCompanyName: string
  targetIndustry: string
  views: number
  uniqueVisitors: number
  createdAt: string
  _count: {
    visits: number
    leads: number
  }
}

export default function AnalyticsPage() {
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

  const totalViews = microsites.reduce((sum, m) => sum + m.views, 0)
  const totalVisitors = microsites.reduce((sum, m) => sum + m.uniqueVisitors, 0)
  const totalLeads = microsites.reduce((sum, m) => sum + m._count.leads, 0)
  const avgConversionRate = totalVisitors > 0 ? ((totalLeads / totalVisitors) * 100).toFixed(1) : '0.0'

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
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <Link href="/leads">
                <Button variant="outline">Leads</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics Overview</h1>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="py-6">
              <p className="text-sm text-gray-600 mb-1">Total Microsites</p>
              <p className="text-3xl font-bold text-mosaic-blue-600">{microsites.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <p className="text-sm text-gray-600 mb-1">Total Views</p>
              <p className="text-3xl font-bold text-mosaic-blue-600">{totalViews}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <p className="text-sm text-gray-600 mb-1">Unique Visitors</p>
              <p className="text-3xl font-bold text-mosaic-blue-600">{totalVisitors}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-6">
              <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
              <p className="text-3xl font-bold text-green-600">{avgConversionRate}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Performance by Microsite */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-900">Performance by Microsite</h2>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading analytics...</p>
              </div>
            ) : microsites.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No data yet. Create microsites to see analytics.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {microsites.map((microsite) => {
                  const conversionRate = microsite.uniqueVisitors > 0
                    ? ((microsite._count.leads / microsite.uniqueVisitors) * 100).toFixed(1)
                    : '0.0'

                  return (
                    <div key={microsite.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-gray-900">{microsite.targetCompanyName}</h3>
                          <p className="text-sm text-gray-500">{microsite.targetIndustry}</p>
                        </div>
                        <a
                          href={`/m/${microsite.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline" size="sm">View Microsite</Button>
                        </a>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Views</p>
                          <p className="text-2xl font-bold text-mosaic-blue-600">{microsite.views}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Visitors</p>
                          <p className="text-2xl font-bold text-mosaic-blue-600">{microsite.uniqueVisitors}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Leads</p>
                          <p className="text-2xl font-bold text-green-600">{microsite._count.leads}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Conversion</p>
                          <p className="text-2xl font-bold text-purple-600">{conversionRate}%</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Industry Breakdown */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-900">Industry Breakdown</h2>
          </CardHeader>
          <CardContent>
            {microsites.length > 0 ? (
              <div className="space-y-3">
                {Object.entries(
                  microsites.reduce((acc, m) => {
                    const industry = m.targetIndustry || 'Unknown'
                    acc[industry] = (acc[industry] || 0) + 1
                    return acc
                  }, {} as Record<string, number>)
                ).map(([industry, count]) => (
                  <div key={industry} className="flex items-center justify-between">
                    <span className="text-gray-700">{industry}</span>
                    <span className="font-bold text-mosaic-blue-600">{count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">No data available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
