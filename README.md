# Mosaic ABM Platform

A high-end, AI-powered Account-Based Marketing (ABM) microsite generator for Mosaic Corporation. Create personalized, conversion-focused microsites for target accounts in under 60 seconds.

## 🎯 Overview

This platform enables BDR and sales teams at Mosaic Corporation to create personalized microsites that show each prospect **exactly** how Mosaic's workflow automation solutions can transform their specific business. Inspired by platforms like Userled.io, but customized for Mosaic's unique value proposition.

### Key Features

- **🤖 AI-Powered Personalization**: Uses GPT-4 to analyze target companies and generate tailored content
- **⚡ Lightning Fast**: Generate a complete microsite in under 60 seconds
- **🎨 Beautiful Design**: Responsive, professional microsites that make lasting impressions
- **📊 Real-Time Analytics**: Track views, engagement, and conversions for every microsite
- **🔗 Intelligent Data Extraction**: Automatically scrapes company info, industry, tech stack, and pain points
- **💼 Campaign Management**: Organize microsites into campaigns and track performance
- **📈 Lead Capture**: Built-in contact forms with lead management and CSV export
- **🎯 Solution Mapping**: Automatically recommends relevant Mosaic solutions based on company analysis

## 🏗️ Architecture

### Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL with Prisma ORM
- **AI**: OpenAI GPT-4 Turbo
- **Web Scraping**: Puppeteer, Cheerio
- **Analytics**: Custom tracking system
- **Deployment**: Vercel-ready

### Project Structure

```
mosaic-abm-platform/
├── app/
│   ├── api/                    # API routes
│   │   ├── generate/          # Microsite generation
│   │   ├── microsites/        # Microsite management
│   │   ├── leads/             # Lead capture
│   │   ├── track/             # Analytics tracking
│   │   └── campaigns/         # Campaign management
│   ├── m/[slug]/              # Dynamic microsite pages
│   ├── dashboard/             # Admin dashboard
│   ├── analytics/             # Analytics view
│   ├── leads/                 # Leads management
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Landing page
│   └── globals.css            # Global styles
├── components/                 # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   └── Analytics.tsx
├── lib/                       # Core utilities
│   ├── prisma.ts             # Database client
│   ├── scraper.ts            # Web scraping engine
│   ├── ai-generator.ts       # AI content generation
│   └── utils.ts              # Helper functions
├── prisma/
│   └── schema.prisma         # Database schema
└── public/                    # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ZachTorres/Mosaics-ABM-model.git
   cd Mosaics-ABM-model
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```

   Required environment variables:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/mosaic_abm"
   OPENAI_API_KEY="sk-your-openai-api-key"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### Creating a Microsite

1. **Go to the Dashboard** at `/dashboard`
2. **Enter the target company's URL** (e.g., `https://example.com`)
3. **Click "Generate Microsite"**
4. The system will:
   - Scrape the company's website
   - Extract business information, industry, and pain points
   - Generate personalized content using AI
   - Create a unique microsite with custom URL
5. **Share the microsite link** with your prospect

### Microsite Features

Each generated microsite includes:

- **Personalized headline** addressing the company by name
- **Custom value propositions** tailored to their industry
- **Recommended solutions** based on identified pain points
- **AI-generated pitch** explaining transformation potential
- **Professional design** with Mosaic branding
- **Lead capture form** for contact information
- **Analytics tracking** for engagement metrics

### Dashboard Features

- **Quick generation** interface
- **Microsite library** with all created microsites
- **Performance metrics** (views, visitors, leads)
- **Copy & share** functionality
- **Real-time statistics**

### Analytics

Track performance across all microsites:
- Total views and unique visitors
- Conversion rates
- Performance by microsite
- Industry breakdown
- Lead generation metrics

### Lead Management

- View all captured leads
- Export to CSV for CRM import
- Track lead status
- See which microsite generated each lead

## 🎨 Customization

### Mosaic Solutions

The platform automatically recommends solutions based on company analysis. Solutions are defined in `lib/ai-generator.ts`:

- AP Automation
- Sales Order Processing
- HR Automation
- Intelligent Data Capture
- Enterprise Content Management
- Freight Process Automation

### Branding

Update branding elements:
- Logo: Replace `/public/mosaic-logo.png`
- Colors: Modify Tailwind config in `tailwind.config.ts`
- Messaging: Update in `lib/ai-generator.ts`

## 🗄️ Database Schema

### Models

- **Campaign**: Organize microsites into campaigns
- **Microsite**: Core microsite data and personalization
- **Visit**: Track individual page visits and engagement
- **Lead**: Captured contact information

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `OPENAI_API_KEY` | OpenAI API key for GPT-4 | Yes |
| `NEXT_PUBLIC_APP_URL` | Base URL of application | Yes |
| `CLEARBIT_API_KEY` | Clearbit API for enhanced data (optional) | No |
| `BUILTWITH_API_KEY` | BuiltWith API for tech stack (optional) | No |

## 🚢 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables
   - Deploy

3. **Set up PostgreSQL**
   - Use Vercel Postgres, Supabase, or any PostgreSQL provider
   - Update `DATABASE_URL` in Vercel environment variables

4. **Run migrations**
   ```bash
   npx prisma db push
   ```

### Other Platforms

This Next.js application can be deployed to:
- Netlify
- Railway
- AWS
- Google Cloud
- Azure

## 📊 How It Works

### 1. Web Scraping
```typescript
// Scrapes target company website
const companyData = await scrapeCompanyWebsite(targetUrl)
```
Extracts:
- Company name and description
- Industry classification
- Tech stack detection
- Pain point identification
- Company size estimation

### 2. AI Content Generation
```typescript
// Generates personalized content
const content = await generatePersonalizedContent(companyData)
```
Creates:
- Custom headline and subheadline
- Industry-specific value propositions
- Tailored solution recommendations
- Personalized pitch narrative

### 3. Microsite Creation
```typescript
// Stores in database
const microsite = await prisma.microsite.create({ ... })
```
Generates:
- Unique slug URL
- Complete microsite data
- Analytics tracking setup
- Lead capture system

### 4. Analytics Tracking
```typescript
// Tracks engagement
await trackEvent({ micrositeId, event: 'pageview' })
```
Monitors:
- Page views
- Unique visitors
- Time on page
- CTA clicks
- Form submissions

## 🧪 Development

### Running Tests
```bash
npm run test
```

### Linting
```bash
npm run lint
```

### Build for Production
```bash
npm run build
npm run start
```

## 🤝 Contributing

This is a proprietary tool for Mosaic Corporation. For internal contributions:

1. Create a feature branch
2. Make your changes
3. Submit a pull request
4. Request review from team lead

## 📝 API Documentation

### POST `/api/generate`
Generate a new microsite

**Request:**
```json
{
  "targetUrl": "https://example.com",
  "campaignId": "optional-campaign-id"
}
```

**Response:**
```json
{
  "success": true,
  "microsite": {
    "id": "...",
    "slug": "...",
    "url": "https://your-domain.com/m/slug"
  }
}
```

### GET `/api/microsites`
List all microsites

### GET `/api/leads`
List all captured leads

### POST `/api/track`
Track analytics events

## 🎯 Use Cases

### BDR Outreach
Create personalized microsites for cold outreach that demonstrate understanding of prospect's business.

### Account-Based Marketing
Generate custom content for each target account in your ABM strategy.

### Sales Presentations
Share microsites during sales calls to visualize solutions.

### Follow-Up
Send personalized microsites after meetings to reinforce value proposition.

## 🔒 Security

- Environment variables for sensitive data
- API rate limiting on generation endpoints
- SQL injection protection via Prisma
- XSS protection in user inputs
- HTTPS required in production

## 📞 Support

For issues or questions:
- GitHub Issues: https://github.com/ZachTorres/Mosaics-ABM-model/issues
- Email: [Your team email]

## 📄 License

Proprietary - Mosaic Corporation © 2025

---

**Built with ❤️ for Mosaic Corporation's BDR Team**

Transform every prospect interaction with personalized, AI-powered microsites that convert.
