# Netlify Deployment Guide

## Steps to Deploy to Netlify

1. **Go to [Netlify](https://www.netlify.com/)**
   - Sign in or create an account
   - Click "Add new site" → "Import an existing project"

2. **Connect to GitHub**
   - Select "GitHub" as your Git provider
   - Authorize Netlify to access your repositories
   - Select the repository: `ssr4king/Daily-Global-Insights`

3. **Configure Build Settings**
   - **Build command:** `npm run build`
   - **Publish directory:** `dist/public`
   - Netlify will automatically detect the `netlify.toml` configuration

4. **Environment Variables (if needed)**
   - Go to Site settings → Environment variables
   - Add any required environment variables (e.g., API keys, database URLs)

5. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy your application

## How It Works

- **Frontend:** Built with Vite and served as static files from `dist/public`
- **Backend API:** Express server wrapped with `serverless-http` as a Netlify Function
- **Routing:** All `/api/*` requests are redirected to the Netlify Function
- **SPA Routing:** All other routes fallback to `index.html` for client-side routing

## Important Notes

- The Netlify Function is located at `netlify/functions/server.ts`
- Make sure `serverless-http` is installed (already added to `package.json`)
- The build process compiles the frontend and prepares everything for deployment

## Troubleshooting

If you encounter issues:
1. Check the build logs in Netlify dashboard
2. Ensure all dependencies are listed in `package.json`
3. Verify that the build command completes successfully
4. Check that environment variables are set correctly

