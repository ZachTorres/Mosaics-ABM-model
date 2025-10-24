import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

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
      <body className={dmSans.className}>{children}</body>
    </html>
  )
}
