# Deployment Guide - Vercel

Complete guide to deploy your Mosaic ABM Platform to Vercel.

## Prerequisites

- GitHub account (already done ✅)
- Vercel account (free tier works great)
- OpenAI API key
- PostgreSQL database (we'll set this up)

## Step 1: Set Up PostgreSQL Database

You have several options:

### Option A: Vercel Postgres (Recommended - Easiest)

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Go to Storage tab
4. Click "Create Database"
5. Select "Postgres"
6. Choose your region (US East recommended)
7. Click "Create"
8. Copy the `DATABASE_URL` connection string

### Option B: Supabase (Free & Easy)

1. Go to [supabase.com](https://supabase.com)
2. Create a new account
3. Create a new project
4. Go to Settings → Database
5. Copy the connection string (URI format)
6. Replace `[YOUR-PASSWORD]` with your database password

### Option C: Railway (Free Tier Available)

1. Go to [railway.app](https://railway.app)
2. Create a new project
3. Add PostgreSQL database
4. Copy the connection string from Variables tab

### Option D: Neon (Serverless Postgres - Free)

1. Go to [neon.tech](https://neon.tech)
2. Sign up and create a project
3. Copy the connection string

## Step 2: Deploy to Vercel

### Method 1: Using Vercel Dashboard (Easiest)

1. **Go to [vercel.com/new](https://vercel.com/new)**

2. **Import your GitHub repository**
   - Click "Import Git Repository"
   - Select your GitHub account
   - Find "Mosaics-ABM-model"
   - Click "Import"

3. **Configure Project**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: Leave default
   - Output Directory: Leave default

4. **Add Environment Variables**

   Click "Environment Variables" and add:

   ```
   DATABASE_URL
   postgresql://user:password@host:5432/database?sslmode=require
   ```
   (Use the connection string from Step 1)

   ```
   OPENAI_API_KEY
   sk-your-openai-api-key-here
   ```
   (Get from https://platform.openai.com/api-keys)

   ```
   NEXT_PUBLIC_APP_URL
   https://your-project-name.vercel.app
   ```
   (You'll update this after first deploy with actual URL)

5. **Click "Deploy"**

   Vercel will:
   - Install dependencies
   - Generate Prisma client
   - Build your Next.js app
   - Deploy to production

6. **Initialize Database**

   After first deploy, run:
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login
   vercel login

   # Link to your project
   vercel link

   # Run database migrations
   vercel env pull .env.local
   npx prisma db push
   ```

7. **Update NEXT_PUBLIC_APP_URL**

   - Copy your deployment URL (e.g., `https://mosaics-abm-model.vercel.app`)
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Update `NEXT_PUBLIC_APP_URL` with your actual URL
   - Redeploy

### Method 2: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No
# - Project name? mosaics-abm-model
# - Directory? ./
# - Override settings? No

# Add environment variables
vercel env add DATABASE_URL
# Paste your database URL

vercel env add OPENAI_API_KEY
# Paste your OpenAI API key

vercel env add NEXT_PUBLIC_APP_URL
# Enter: https://mosaics-abm-model.vercel.app (or your URL)

# Deploy to production
vercel --prod

# Initialize database
npx prisma db push
```

## Step 3: Initialize Database Schema

After deployment, you need to set up the database tables:

### Option A: Local Setup (Recommended)

```bash
# Pull environment variables
vercel env pull .env.local

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Optional: Open Prisma Studio to verify
npx prisma studio
```

### Option B: Using Vercel CLI

```bash
# SSH into Vercel (requires Pro plan)
# Or use their online editor

# Alternative: Use database GUI
# - Supabase has built-in SQL editor
# - PgAdmin for PostgreSQL
# - TablePlus, Postico, DBeaver
```

## Step 4: Test Your Deployment

1. **Visit your site**
   ```
   https://your-project-name.vercel.app
   ```

2. **Test microsite generation**
   - Go to `/dashboard`
   - Enter a company URL (try `https://shopify.com`)
   - Click "Generate Microsite"
   - Verify it works!

3. **Check analytics**
   - View the generated microsite
   - Check if visit tracking works
   - Test the contact form

## Step 5: Custom Domain (Optional)

1. **Go to Vercel Dashboard → Settings → Domains**

2. **Add your domain**
   ```
   abm.mosaiccorp.com
   ```

3. **Update DNS records** (at your domain provider)
   ```
   Type: CNAME
   Name: abm
   Value: cname.vercel-dns.com
   ```

4. **Update environment variable**
   ```
   NEXT_PUBLIC_APP_URL=https://abm.mosaiccorp.com
   ```

## Troubleshooting

### Issue: Build Fails with Prisma Error

**Solution:**
- Ensure `DATABASE_URL` is set in environment variables
- Check the database connection string format
- Add `postinstall` script in package.json:
  ```json
  "postinstall": "prisma generate"
  ```

### Issue: "Cannot find module '@prisma/client'"

**Solution:**
```bash
npx prisma generate
vercel --prod
```

### Issue: Database Connection Timeout

**Solution:**
- Ensure your database allows connections from anywhere (0.0.0.0/0)
- Check SSL settings: add `?sslmode=require` to connection string
- Verify database is running

### Issue: OpenAI API Errors

**Solution:**
- Verify API key is correct
- Check OpenAI account has credits
- Ensure key has GPT-4 access

### Issue: Images Not Loading

**Solution:**
- Check `next.config.js` has correct image domains
- Verify logo exists in `/public` directory
- Test with different image URLs

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `OPENAI_API_KEY` | OpenAI API key for GPT-4 | `sk-proj-...` |
| `NEXT_PUBLIC_APP_URL` | Your app's public URL | `https://your-app.vercel.app` |
| `CLEARBIT_API_KEY` | (Optional) Enhanced company data | `sk_...` |
| `BUILTWITH_API_KEY` | (Optional) Tech stack detection | `...` |

## Post-Deployment Checklist

- [ ] Site loads successfully
- [ ] Database connection working
- [ ] Can generate microsites
- [ ] Analytics tracking works
- [ ] Contact forms submit successfully
- [ ] Leads appear in dashboard
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Environment variables set correctly
- [ ] Prisma schema pushed to database

## Monitoring & Maintenance

### View Logs
```bash
vercel logs
```

### View Production Logs
```bash
vercel logs --prod
```

### Redeploy
```bash
vercel --prod
```

### Environment Variable Management
```bash
# List all env vars
vercel env ls

# Add new variable
vercel env add VARIABLE_NAME

# Remove variable
vercel env rm VARIABLE_NAME
```

## Performance Optimization

Once deployed, consider:

1. **Add caching headers** for static assets
2. **Enable Vercel Analytics** (free)
3. **Set up error monitoring** (Sentry)
4. **Configure rate limiting** for API routes
5. **Add Redis** for session management (optional)

## Scaling

The free Vercel tier includes:
- Unlimited deployments
- 100GB bandwidth
- Serverless functions
- Automatic HTTPS

For production use:
- Consider Vercel Pro ($20/month)
- Upgrade database plan as needed
- Monitor OpenAI API usage

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review database connection
3. Verify environment variables
4. Test locally first
5. Contact Vercel support

---

**You're ready to go live! 🚀**

Your Mosaic ABM Platform will be available at:
`https://your-project-name.vercel.app`

Share microsites with prospects and start converting!
