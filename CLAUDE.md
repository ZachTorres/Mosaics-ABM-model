# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js-based ABM (Account-Based Marketing) microsite generator for Mosaic Corporation. It generates personalized marketing microsites based on a company's URL without requiring any external APIs, databases, or AI services. The entire application uses template-based content generation with simple pattern matching.

**Key characteristic**: This is an intentionally simple, zero-dependency application. There are no AI APIs, no databases, no authentication - just URL parsing and template matching.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm lint
```

## Architecture

### Application Structure

This is a Next.js 14 App Router application with the following structure:

- **[app/page.tsx](app/page.tsx)** - Main client component with URL input form and microsite display
- **[app/api/generate/route.ts](app/api/generate/route.ts)** - API route that generates microsite content
- **[app/layout.tsx](app/layout.tsx)** - Root layout with metadata and Inter font

### Content Generation Flow

1. User enters a company URL in [app/page.tsx](app/page.tsx)
2. Frontend sends POST request to `/api/generate` endpoint
3. [app/api/generate/route.ts](app/api/generate/route.ts) processes the URL:
   - `extractCompanyName()` - Parses domain to extract company name
   - `detectIndustry()` - Uses simple keyword matching on domain to detect industry
   - `generateContent()` - Selects pre-written content from templates based on detected industry
4. Returns microsite data (headline, pain points, solutions, CTA)
5. Frontend displays the generated microsite

### Industry Templates

The application supports 7 industry templates (defined in [app/api/generate/route.ts:37-143](app/api/generate/route.ts#L37-L143)):
- Technology
- Healthcare
- Financial Services
- Retail
- Education
- Manufacturing
- Business Services (default fallback)

Each template contains:
- 4 pain points
- 4 solutions
- Custom headline
- Industry-specific CTA

**Important**: Industry detection is done purely by domain keyword matching. If you need to modify detection logic or add new industries, update both `detectIndustry()` and the `industryContent` object in [app/api/generate/route.ts](app/api/generate/route.ts).

## Technology Stack

- **Next.js 14** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** with custom mosaic color palette and animations (see [tailwind.config.ts](tailwind.config.ts))
- **No external dependencies** for core functionality

## Styling System

Tailwind configuration includes:
- Custom `mosaic.blue` color palette ([tailwind.config.ts:12-24](tailwind.config.ts#L12-L24))
- Custom animations: `fade-in`, `slide-up`, `slide-down`, `scale-in` ([tailwind.config.ts:31-54](tailwind.config.ts#L31-L54))

## Deployment

This application is designed for Vercel deployment with zero configuration:
- No environment variables required
- No database setup needed
- No API keys necessary
- No external service integrations

The [next.config.js](next.config.js) includes:
- React strict mode enabled
- Image domains configured for potential logo fetching
- Server actions with 2MB body size limit

## Important Constraints

1. **No AI/LLM integration** - This is a template-based system, not AI-powered
2. **No database** - All content is statically defined in code
3. **No authentication** - Public-facing, no user accounts
4. **Stateless** - Each generation is independent, no session storage
5. **Vercel-optimized** - Designed specifically for serverless deployment

## Making Changes

### Adding a New Industry

1. Add keyword detection in `detectIndustry()` function ([app/api/generate/route.ts:15-33](app/api/generate/route.ts#L15-L33))
2. Add new industry template in `industryContent` object ([app/api/generate/route.ts:37-143](app/api/generate/route.ts#L37-L143))
3. Update README.md supported industries list

### Modifying Microsite Layout

The microsite display structure is in [app/page.tsx:96-184](app/page.tsx#L96-L184) and includes:
- Hero section (gradient header with company name)
- Two-column content grid (pain points | solutions)
- CTA section
- Footer

All sections use Tailwind utility classes with the custom mosaic color scheme.

### Changing Content Templates

All template content lives in the `generateContent()` function in [app/api/generate/route.ts:36-156](app/api/generate/route.ts#L36-L156). Each industry template should maintain the same structure (4 pain points, 4 solutions, headline, CTA).
