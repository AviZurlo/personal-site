# Admin CMS Setup Guide

## Architecture Overview

Your admin interface now works in production using:
- **GitHub API** - Content (markdown files) committed to your repo
- **Vercel Blob** - Images uploaded to Vercel's CDN storage
- **Auto-deployment** - Changes trigger Vercel rebuild (~1-2 minutes)

## Setup Instructions

### 1. Create GitHub Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: `personal-site-cms`
4. Select scopes:
   - ✅ `repo` (Full control of private repositories)
5. Click "Generate token"
6. **Copy the token** (you won't see it again)

### 2. Configure Environment Variables Locally

Create a `.env` file (already in .gitignore):

```bash
# Admin password
ADMIN_PASSWORD=your-secure-password

# GitHub settings
GITHUB_TOKEN=ghp_your_token_here
GITHUB_OWNER=your-github-username
GITHUB_REPO=personal-site
GITHUB_BRANCH=main
```

### 3. Configure Vercel Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add these variables:
   - `ADMIN_PASSWORD` → your admin password
   - `GITHUB_TOKEN` → your GitHub token
   - `GITHUB_OWNER` → your GitHub username
   - `GITHUB_REPO` → your repo name (e.g., `personal-site`)
   - `GITHUB_BRANCH` → `main`

3. **Vercel Blob** (for images):
   - Go to **Storage** → **Create Database** → **Blob**
   - This automatically provides `BLOB_READ_WRITE_TOKEN`

### 4. Deploy to Vercel

```bash
# Commit your changes
git add .
git commit -m "Add production-ready admin CMS"
git push

# Vercel will auto-deploy
```

## How It Works

### Development (Local)
- Content: Read/write directly to filesystem
- Images: Saved to `/public/images/` (local development)
- Fast iteration, no commits

### Production (Vercel)
- Content: Read/write via GitHub API → triggers Vercel rebuild
- Images: Upload to Vercel Blob → served from CDN instantly
- All changes versioned in git

## Using the Admin

### Access
- Local: http://localhost:4321/admin/login
- Production: https://yoursite.com/admin/login

### Workflow
1. **Login** with your admin password
2. **Edit content** - changes saved to markdown files
3. **Upload images** - drag & drop, stored in Vercel Blob
4. **Save** - commits to GitHub, triggers auto-deploy
5. **Wait ~1-2 minutes** for Vercel rebuild
6. **View changes** on your public site

### Features
- ✅ Create new articles
- ✅ Edit existing articles
- ✅ Delete articles
- ✅ Edit about page
- ✅ Drag-and-drop image upload
- ✅ Live markdown preview
- ✅ All changes versioned in git

## Troubleshooting

### Images not uploading
- Check Vercel Blob is configured in Vercel dashboard
- Verify `BLOB_READ_WRITE_TOKEN` exists in environment

### Content not saving
- Verify GitHub token has `repo` scope
- Check GitHub username/repo are correct
- Ensure token hasn't expired

### Deployment not triggering
- Check Vercel is connected to your GitHub repo
- Verify auto-deploy is enabled in Vercel settings

### Can't login
- Verify `ADMIN_PASSWORD` is set in Vercel environment variables
- Clear cookies and try again

## Security Notes

- ⚠️ Never commit `.env` (already in .gitignore)
- ⚠️ Keep GitHub token secure (has write access to your repo)
- ⚠️ Use a strong admin password
- ✅ Admin only accessible with authentication
- ✅ All API routes check authentication

## Cost

- **GitHub**: Free (public repos)
- **Vercel Hosting**: Free tier (hobby plan)
- **Vercel Blob**: Free tier (5GB storage, generous bandwidth)

Perfect for personal blogs!
