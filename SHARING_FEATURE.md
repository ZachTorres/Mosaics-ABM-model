# Microsite Sharing Feature

## Overview

This document describes the new sharing feature that allows you to save generated microsites and share them with clients via unique URLs.

## How It Works

### 1. Generate a Microsite
- Enter a company URL (e.g., `apple.com`)
- Click "Generate" to create a personalized microsite

### 2. Save & Share
- After generation, click the "Save & Share" button
- The system generates a unique, shareable URL
- Example: `https://yoursite.com/m/apple-abc12345`

### 3. Share with Clients
- Click "Copy Link" to copy the URL to clipboard
- Send the link via email, Slack, or any other method
- Clients can view the microsite directly without any login

## Technical Architecture

### File Structure

```
app/
├── page.tsx                         # Main generator page with save/share UI
├── m/[id]/
│   ├── page.tsx                    # Dynamic route for viewing saved microsites
│   └── not-found.tsx               # 404 page for missing microsites
├── api/
│   ├── generate/route.ts           # Generate microsite from URL
│   ├── save-microsite/route.ts     # Save and retrieve microsites
│   └── contact/route.ts            # Handle contact form submissions
components/
└── MicrositeView.tsx               # Reusable microsite display component
lib/
└── utils.ts                        # Utility functions (ID generation, slugs)
data/
└── microsites/                     # JSON storage for saved microsites
    └── *.json                      # Individual microsite files
```

### URL Format

Saved microsites use a human-readable URL format:
```
/m/{company-slug}-{unique-id}
```

Examples:
- `/m/apple-a7b3c9d2`
- `/m/tesla-x9y2z4k6`
- `/m/acme-corp-m5n8p1q3`

### Storage System

**Current Implementation:** File-based JSON storage
- Microsites are saved to `data/microsites/{id}.json`
- In-memory cache for fast retrieval
- Falls back to file system if not in cache

**Production Ready Upgrade Options:**
1. **Vercel KV** - Redis-based key-value store
2. **Vercel Postgres** - Full SQL database
3. **Supabase** - PostgreSQL with real-time capabilities
4. **PlanetScale** - Serverless MySQL

### API Endpoints

#### POST `/api/save-microsite`
Saves a microsite and returns a shareable URL.

**Request:**
```json
{
  "microsite": {
    "companyName": "Apple",
    "url": "https://apple.com",
    "industry": "Technology",
    ...
  }
}
```

**Response:**
```json
{
  "success": true,
  "id": "a7b3c9d2",
  "urlPath": "apple-a7b3c9d2",
  "shareUrl": "/m/apple-a7b3c9d2"
}
```

#### GET `/api/save-microsite?id={id}`
Retrieves a saved microsite by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "a7b3c9d2",
    "slug": "apple",
    "urlPath": "apple-a7b3c9d2",
    "microsite": { ... },
    "createdAt": "2025-01-15T10:30:00.000Z",
    "viewCount": 42
  }
}
```

## Features

### Save & Share Bar
After generating a microsite, you'll see a prominent save/share bar with:
- **Company name** in the heading
- **"Save & Share" button** to generate the shareable link
- **Copy Link button** to easily copy the URL
- **Visual feedback** (spinner while saving, checkmark when copied)

### Shared Microsite View
When clients visit the shared link, they see:
- **Full microsite** with personalized content
- **Contact form** to submit their information
- **Professional branding** with Mosaic logo
- **Call-to-action** link back to the generator

### View Tracking
The system tracks how many times each microsite has been viewed, useful for:
- Measuring client engagement
- Understanding which prospects are interested
- Following up with engaged leads

## Usage Examples

### Example 1: Quick Share
```bash
1. Generate microsite for "tesla.com"
2. Click "Save & Share"
3. Click "Copy Link"
4. Paste in email: "Check out this personalized demo: https://yoursite.com/m/tesla-x9y2z4k6"
```

### Example 2: Multiple Clients
```bash
# Generate and save multiple microsites
1. Generate for apple.com → /m/apple-a1b2c3d4
2. Generate for microsoft.com → /m/microsoft-e5f6g7h8
3. Generate for amazon.com → /m/amazon-i9j0k1l2

# Each has its own unique URL to share
```

## Development

### Running Locally
```bash
npm run dev
# Open http://localhost:3000
# Generate a microsite
# Click "Save & Share"
# Visit the generated URL
```

### Testing
1. Generate a microsite for any company
2. Click "Save & Share"
3. Copy the generated link
4. Open the link in a new tab/window
5. Verify the microsite displays correctly
6. Fill out the contact form
7. Check console logs for form submission

## Upgrading to Production Database

To upgrade from file storage to a database:

### Option 1: Vercel KV (Redis)
```typescript
import { kv } from '@vercel/kv'

// Save
await kv.set(`microsite:${id}`, savedData)

// Retrieve
const data = await kv.get(`microsite:${id}`)
```

### Option 2: Vercel Postgres
```typescript
import { sql } from '@vercel/postgres'

// Save
await sql`
  INSERT INTO microsites (id, data, created_at)
  VALUES (${id}, ${JSON.stringify(microsite)}, NOW())
`

// Retrieve
const { rows } = await sql`
  SELECT * FROM microsites WHERE id = ${id}
`
```

## Security Considerations

- **No authentication required** - Microsites are publicly accessible via URL
- **Random IDs** - 8-character alphanumeric IDs provide ~2.8 trillion combinations
- **No sensitive data** - Contact form submissions are logged (upgrade to CRM recommended)
- **Rate limiting** - Consider adding rate limiting in production

## Future Enhancements

1. **Expiration dates** - Auto-delete microsites after 30/60/90 days
2. **Analytics** - Track views, clicks, form submissions
3. **Custom domains** - Allow clients to use their own domain
4. **Password protection** - Optional password for sensitive microsites
5. **Email integration** - Auto-send microsite links via email
6. **CRM integration** - Connect to HubSpot, Salesforce, etc.
7. **A/B testing** - Test different versions of microsites
8. **PDF export** - Download microsite as PDF
