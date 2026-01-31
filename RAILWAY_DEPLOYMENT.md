# Railway Deployment Guide

## Overview

Your Astro project is configured to automatically detect Railway and use the Node.js adapter. When deploying to Vercel, it will use the Vercel adapter automatically.

## Prerequisites

1. [Railway account](https://railway.app)
2. Railway CLI (optional, for local testing)

## Deployment Steps

### Option 1: Deploy via Railway Dashboard (Recommended)

1. **Push your code to GitHub** (if not already done)

2. **Create a new project on Railway:**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Environment Variables:**
   - In Railway dashboard, go to your project
   - Click on "Variables" tab
   - Add the following variables:
     ```
     SANITY_PROJECT_ID=your_project_id
     SANITY_DATASET=production
     ```

4. **Railway will automatically:**
   - Detect Node.js
   - Run `npm install`
   - Run `npm run build`
   - Run `npm start` to start the server

5. **Access your site:**
   - Railway will provide a URL (e.g., `your-app.up.railway.app`)
   - You can also add a custom domain in the Railway dashboard

### Option 2: Deploy via Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Link to existing project or create new one
railway link

# Add environment variables
railway variables set SANITY_PROJECT_ID=your_project_id
railway variables set SANITY_DATASET=production

# Deploy
railway up
```

## How It Works

The project automatically detects Railway using the `RAILWAY_ENVIRONMENT` variable and switches to the Node.js adapter:

```javascript
adapter: process.env.RAILWAY_ENVIRONMENT
  ? node({ mode: "standalone" })
  : vercel({ /* vercel config */ })
```

## Build Configuration

Railway will use these scripts from `package.json`:
- **Build**: `npm run build` - Builds the Astro site with Node.js adapter
- **Start**: `npm start` - Runs `node ./dist/server/entry.mjs`

## Port Configuration

Railway automatically sets the `PORT` environment variable. The Node.js adapter will use it automatically. No additional configuration needed.

## Important Notes

### Authentication
- The auth system works the same on Railway as on Vercel
- Make sure your Sanity categories have the correct `passwordHash` values
- Cookies will work correctly with the Node.js adapter

### Performance
- Railway provides good performance for Node.js apps
- Consider adding Railway's Redis for session storage if you scale up
- The Node.js adapter is production-ready and performant

### Differences from Vercel
- **Vercel**: Uses serverless functions (edge runtime)
- **Railway**: Uses traditional Node.js server (always running)
- **Cost**: Railway has a free tier with generous limits
- **Deploy time**: Railway typically faster for Node.js apps

## Troubleshooting

### Build Fails
```bash
# Check build logs in Railway dashboard
# Common issues:
# 1. Missing environment variables
# 2. Node version mismatch
```

### Server Doesn't Start
```bash
# Verify the start command in Railway:
# Should be: npm start
# Or: node ./dist/server/entry.mjs
```

### Port Issues
```bash
# Railway sets PORT automatically
# Make sure you're not hardcoding a port
# The Node adapter handles this automatically
```

### Can't Access Site
```bash
# Check Railway logs for errors
# Verify domain/URL in Railway dashboard
# Ensure build completed successfully
```

## Local Testing with Railway Config

To test the Railway build locally:

```bash
# Set Railway environment variable
export RAILWAY_ENVIRONMENT=true  # Unix/Mac
set RAILWAY_ENVIRONMENT=true     # Windows

# Build and preview
npm run build
npm start
```

## Switching Between Vercel and Railway

The project automatically uses the correct adapter based on environment:

- **Railway**: Detected via `RAILWAY_ENVIRONMENT` variable → Uses Node.js adapter
- **Vercel**: Default → Uses Vercel adapter
- **Local Development**: Uses whichever adapter you want to test

You can deploy to both platforms simultaneously without code changes!

## Custom Domain

In Railway dashboard:
1. Go to your project
2. Click "Settings"
3. Scroll to "Domains"
4. Click "Add Domain"
5. Follow Railway's instructions for DNS configuration

## Monitoring

Railway provides:
- Real-time logs
- Metrics dashboard
- Deployment history
- Rollback functionality

Access these in your Railway project dashboard.

## Need Help?

- [Railway Documentation](https://docs.railway.app)
- [Astro Node Adapter Docs](https://docs.astro.build/en/guides/integrations-guide/node/)
- Check Railway logs for specific errors
