'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Card, CardContent, CardHeader } from '@/components/Card'
import Link from 'next/link'

export default function SettingsPage() {
  const [openaiKey, setOpenaiKey] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [isConfigured, setIsConfigured] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setIsConfigured(data.settings.setupComplete)
        }
      })
      .catch(console.error)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage('')

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ openaiApiKey: openaiKey }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage('✅ Settings saved successfully!')
        setIsConfigured(true)
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('❌ ' + (data.error || 'Failed to save settings'))
      }
    } catch (error) {
      setMessage('❌ Failed to save settings')
    } finally {
      setIsSaving(false)
    }
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
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

        {/* Configuration Status */}
        <Card className="mb-8">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Configuration Status</h3>
                <p className="text-gray-600 mt-1">
                  {isConfigured
                    ? 'Your platform is configured and ready to use!'
                    : 'Configure your API keys to unlock all features'}
                </p>
              </div>
              <div>
                {isConfigured ? (
                  <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
                    ✓ Configured
                  </span>
                ) : (
                  <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-semibold">
                    ⚠ Setup Required
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* OpenAI Configuration */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-900">OpenAI API Key (Optional)</h2>
            <p className="text-gray-600 mt-1">
              Add your OpenAI API key to enable AI-powered personalization. Without this, the platform will use intelligent templates.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="sk-proj-your-api-key-here"
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  label="OpenAI API Key"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Get your API key from{' '}
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-mosaic-blue-600 hover:underline"
                  >
                    platform.openai.com/api-keys
                  </a>
                </p>
              </div>

              <Button type="submit" isLoading={isSaving}>
                Save Settings
              </Button>

              {message && (
                <div className={`p-4 rounded-lg ${message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  {message}
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* How it Works */}
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-900">How It Works</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">✅ Works Without Configuration</h3>
                <p className="text-gray-600">
                  The platform works immediately with intelligent templates. Microsites are generated using rule-based personalization.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">🤖 Enhanced with AI</h3>
                <p className="text-gray-600">
                  Add your OpenAI API key to unlock GPT-4 powered content generation for even more personalized microsites.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">💾 File-Based Storage</h3>
                <p className="text-gray-600">
                  All data is stored in simple JSON files. No database setup required. Your microsites, leads, and analytics are saved locally.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">🚀 Deploy Anywhere</h3>
                <p className="text-gray-600">
                  Works on Vercel, Netlify, or any Node.js hosting. No external dependencies required.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
