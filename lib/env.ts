// Environment variable helpers with automatic Vercel URL detection

export function getAppUrl(): string {
  // In production, use VERCEL_URL if NEXT_PUBLIC_APP_URL is not set
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // Development fallback
  return 'http://localhost:3000'
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}
