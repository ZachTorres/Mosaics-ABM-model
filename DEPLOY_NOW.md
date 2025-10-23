# 🚀 ONE-CLICK DEPLOYMENT GUIDE

Everything is configured for instant deployment. Just follow these 3 simple steps!

## Step 1: Get Your Database URL (2 minutes)

Choose ONE option:

### Option A: Vercel Postgres (Easiest - Recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Storage"** tab at top
3. Click **"Create Database"**
4. Select **"Postgres"**
5. Name it: `mosaic-abm-db`
6. Click **"Create"**
7. Copy the **"DATABASE_URL"** connection string (looks like `postgresql://...`)

### Option B: Supabase (Free Forever)

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Create account (use GitHub)
4. Click **"New Project"**
5. Name: `mosaic-abm`, choose region, set password
6. Go to **Settings** → **Database**
7. Under "Connection string", select **URI**
8. Copy the connection string
9. Replace `[YOUR-PASSWORD]` with your password

### Option C: Neon (Serverless Postgres - Free)

1. Go to [neon.tech](https://neon.tech)
2. Click **"Sign Up"** (use GitHub)
3. Create a new project: `mosaic-abm`
4. Copy the connection string from dashboard

**Save your DATABASE_URL - you'll need it in Step 3!**

---

## Step 2: Get Your OpenAI API Key (1 minute)

1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click **"Create new secret key"**
4. Name it: `mosaic-abm`
5. Copy the key (starts with `sk-proj-...`)

⚠️ **Important**: Make sure you have at least $5 credit on your OpenAI account

**Save your OPENAI_API_KEY - you'll need it in Step 3!**

---

## Step 3: Deploy to Vercel (30 seconds)

### Click Here to Deploy:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ZachTorres/Mosaics-ABM-model)

**OR** Manual import:

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Enter: `https://github.com/ZachTorres/Mosaics-ABM-model`
4. Click **"Import"**

### During Import:

**Configure Project:**
- Project Name: `mosaic-abm-platform` (or whatever you like)
- Framework: Next.js (auto-detected ✓)
- Root Directory: `./` (default ✓)

**Environment Variables:**

Click **"Add"** and enter these 2 variables:

```
Name: DATABASE_URL
Value: [Paste your database URL from Step 1]
```

```
Name: OPENAI_API_KEY
Value: [Paste your OpenAI key from Step 2]
```

**That's it!** Click **"Deploy"**

---

## What Happens Now?

Vercel will automatically:
1. ✅ Clone your repository
2. ✅ Install all dependencies
3. ✅ Generate Prisma database client
4. ✅ **Automatically create database tables** (via `vercel-build` script)
5. ✅ Build your Next.js app
6. ✅ Deploy to production
7. ✅ Give you a live URL

**Total time: ~2-3 minutes**

---

## Step 4: Test Your Deployment

Once deployment completes:

1. Click **"Visit"** or go to your deployment URL
2. Click **"Dashboard"** or go to `/dashboard`
3. Enter a company URL, try: `https://shopify.com`
4. Click **"Generate Microsite"**
5. Wait ~30-60 seconds
6. 🎉 Your personalized microsite opens in a new tab!

---

## Troubleshooting

### Build Fails?

**Error: "Can't connect to database"**
- Check your `DATABASE_URL` has `?sslmode=require` at the end
- Verify database is running and accessible

**Error: "OpenAI API error"**
- Verify your API key is correct
- Check you have credits: [platform.openai.com/usage](https://platform.openai.com/usage)
- Ensure you have GPT-4 access

### Build Succeeds but Site Doesn't Work?

1. Check Vercel logs: Click **"Deployment"** → **"Functions"** → View logs
2. Verify both environment variables are set correctly
3. Try redeploying: Click **"Deployments"** → **"Redeploy"**

---

## You're Done! 🎉

Your Mosaic ABM Platform is now live at:
```
https://your-project-name.vercel.app
```

### What You Can Do Now:

✅ Create unlimited personalized microsites
✅ Track analytics and engagement
✅ Capture leads and export to CSV
✅ Share microsite links with prospects
✅ View performance dashboard

### Next Steps:

1. **Bookmark your dashboard**: `https://your-url.vercel.app/dashboard`
2. **Create your first microsite** for a real prospect
3. **Share the link** via email or LinkedIn
4. **Track engagement** in real-time

---

## Custom Domain (Optional)

Want to use `abm.mosaiccorp.com`?

1. In Vercel → **Settings** → **Domains**
2. Add your domain
3. Update DNS with provided CNAME record
4. Done! Auto-SSL included

---

## Support

Issues? Questions?
- Check Vercel deployment logs
- Review [README.md](README.md) for full documentation
- Open a GitHub issue

**You're now ready to transform your ABM outreach! 🚀**

---

## Summary

✅ Database automatically set up
✅ Zero manual configuration needed
✅ Auto-deploys on every git push
✅ Built-in SSL certificate
✅ Automatic scaling
✅ Edge-optimized performance

**Just click Import → Deploy → Done!**
