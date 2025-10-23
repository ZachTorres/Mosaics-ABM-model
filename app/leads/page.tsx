'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/Card'
import { Button } from '@/components/Button'
import Link from 'next/link'

interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  companyName: string
  jobTitle: string | null
  message: string | null
  status: string
  createdAt: string
  microsite: {
    targetCompanyName: string
    slug: string
  }
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadLeads()
  }, [])

  const loadLeads = async () => {
    try {
      const response = await fetch('/api/leads')
      const data = await response.json()
      if (data.success) {
        setLeads(data.leads)
      }
    } catch (err) {
      console.error('Failed to load leads:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const exportToCSV = () => {
    const headers = ['Date', 'First Name', 'Last Name', 'Email', 'Phone', 'Company', 'Job Title', 'Microsite', 'Message', 'Status']
    const rows = leads.map(lead => [
      new Date(lead.createdAt).toLocaleDateString(),
      lead.firstName,
      lead.lastName,
      lead.email,
      lead.phone || '',
      lead.companyName,
      lead.jobTitle || '',
      lead.microsite.targetCompanyName,
      lead.message || '',
      lead.status,
    ])

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mosaic-leads-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
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
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <Link href="/analytics">
                <Button variant="outline">Analytics</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Leads</h2>
                <p className="text-gray-600 mt-1">
                  All leads captured from your ABM microsites
                </p>
              </div>
              {leads.length > 0 && (
                <Button onClick={exportToCSV}>Export to CSV</Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading leads...</p>
              </div>
            ) : leads.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No leads yet. Share your microsites to start capturing leads!</p>
                <Link href="/dashboard">
                  <Button>Go to Dashboard</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Company</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Microsite</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {lead.firstName} {lead.lastName}
                            </p>
                            {lead.jobTitle && (
                              <p className="text-sm text-gray-500">{lead.jobTitle}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-gray-900">{lead.email}</p>
                            {lead.phone && (
                              <p className="text-sm text-gray-500">{lead.phone}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-900">{lead.companyName}</td>
                        <td className="py-3 px-4">
                          <a
                            href={`/m/${lead.microsite.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-mosaic-blue-600 hover:text-mosaic-blue-700 hover:underline"
                          >
                            {lead.microsite.targetCompanyName}
                          </a>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
                            lead.status === 'NEW' ? 'bg-blue-100 text-blue-800' :
                            lead.status === 'CONTACTED' ? 'bg-yellow-100 text-yellow-800' :
                            lead.status === 'QUALIFIED' ? 'bg-purple-100 text-purple-800' :
                            lead.status === 'CONVERTED' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {lead.status}
                          </span>
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
