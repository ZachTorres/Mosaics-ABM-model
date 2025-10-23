import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mosaic ABM Platform - Personalized Account-Based Marketing Microsites',
  description: 'Create AI-powered, personalized ABM microsites that convert. Show each prospect exactly how Mosaic can transform their business.',
  keywords: 'ABM, account-based marketing, microsites, B2B marketing, personalization, workflow automation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
