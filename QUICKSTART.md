# Quick Start Guide

Get your Mosaic ABM Platform running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Environment

Create a `.env` file:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/mosaic_abm?schema=public"
OPENAI_API_KEY="sk-your-openai-api-key-here"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Getting an OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key and paste it in your `.env` file

### Database Options

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL locally
# Create a database named 'mosaic_abm'
# Use: postgresql://postgres:password@localhost:5432/mosaic_abm
```

**Option B: Free Hosted Database (Recommended)**

Use [Supabase](https://supabase.com) for free PostgreSQL:
1. Sign up at supabase.com
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string
5. Replace `[YOUR-PASSWORD]` with your database password

**Option C: Vercel Postgres**
```bash
# If deploying to Vercel
vercel postgres create
```

## Step 3: Initialize Database

```bash
npx prisma generate
npx prisma db push
```

## Step 4: Run Development Server

```bash
npm run dev
```

Visit **http://localhost:3000** 🎉

## Step 5: Create Your First Microsite

1. Go to **http://localhost:3000/dashboard**
2. Enter a company URL (try `https://shopify.com` or `https://salesforce.com`)
3. Click **"Generate Microsite"**
4. Wait ~30-60 seconds
5. Your personalized microsite will open in a new tab!

## Troubleshooting

### Issue: Database Connection Error

**Solution:**
- Verify your `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check username and password

### Issue: OpenAI API Error

**Solution:**
- Verify your `OPENAI_API_KEY` is correct
- Ensure you have API credits
- Check your OpenAI account status

### Issue: Web Scraping Fails

**Solution:**
- Some websites block scraping
- Try a different URL
- The system will use fallback data if scraping fails

### Issue: Port 3000 Already in Use

**Solution:**
```bash
# Use a different port
npm run dev -- -p 3001
```

## Next Steps

1. **Customize Branding**
   - Replace `/public/mosaic-logo.png` with your logo
   - Update colors in `tailwind.config.ts`

2. **Add Your Company Info**
   - Update Mosaic solutions in `lib/ai-generator.ts`
   - Customize messaging for your brand

3. **Deploy to Production**
   - See `README.md` for deployment instructions
   - Recommended: Deploy to Vercel

## Production Checklist

Before deploying to production:

- [ ] Add real Mosaic logo to `/public/mosaic-logo.png`
- [ ] Update `NEXT_PUBLIC_APP_URL` to your production domain
- [ ] Set up production PostgreSQL database
- [ ] Add OpenAI API key with sufficient credits
- [ ] Test microsite generation with real URLs
- [ ] Set up analytics (optional: Google Analytics)
- [ ] Configure custom domain
- [ ] Enable HTTPS

## Support

Need help? Check:
- Full documentation in `README.md`
- GitHub Issues: https://github.com/ZachTorres/Mosaics-ABM-model/issues

---

**You're ready to create personalized ABM microsites! 🚀**
