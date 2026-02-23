# Repository Structure

Clean, simple blog powered by Astro. Edit content directly on GitHub.

## 📁 Directory Structure

```
personal-site/
├── src/
│   ├── content/
│   │   ├── articles/          ← YOUR BLOG ARTICLES (edit here!)
│   │   ├── about.md           ← Your about page
│   │   └── investments.md     ← Investments page
│   ├── layouts/
│   │   └── Layout.astro       ← Main site layout
│   ├── pages/
│   │   ├── index.astro        ← Homepage
│   │   ├── about.astro        ← About page
│   │   ├── articles/
│   │   │   └── [...slug].astro ← Dynamic article pages
│   │   ├── photos.astro       ← Photos page
│   │   ├── resume.astro       ← Resume page
│   │   └── investments.astro  ← Investments page
│   └── styles/
│       └── global.css         ← Global styles
├── public/
│   ├── images/
│   │   └── articles/          ← Article images (upload here!)
│   └── photos/                ← Photo gallery images
├── HOW_TO_EDIT_ARTICLES.md   ← Complete editing guide
├── REPO_STRUCTURE.md          ← This file
└── astro.config.mjs           ← Astro configuration
```

## ✅ What's In The Repo

### Content (What You Edit)
- **`src/content/articles/`** - Your blog articles in markdown
- **`src/content/about.md`** - About page content
- **`public/images/articles/`** - Images for your articles

### Site Code (Don't Touch Unless You Know What You're Doing)
- **`src/pages/`** - Page components
- **`src/layouts/`** - Layout components
- **`src/styles/`** - CSS styles
- **`astro.config.mjs`** - Site configuration

### Documentation
- **`HOW_TO_EDIT_ARTICLES.md`** - Complete guide for editing
- **`REPO_STRUCTURE.md`** - This file

## 🗑️ What Was Removed (Clean Slate)

### Removed in Cleanup:
- ❌ Custom admin interface (was too complex)
- ❌ Decap CMS (OAuth issues)
- ❌ All API routes (not needed)
- ❌ Authentication system (not needed)
- ❌ OAuth handlers (not needed)
- ❌ Image upload API (not needed)
- ❌ Duplicate `/articles` folder
- ❌ Old image folders

## 🎯 How It Works Now

### Writing & Publishing:
1. **Edit on GitHub:** https://github.com/AviZurlo/personal-site/tree/main/src/content/articles
2. **Vercel Auto-Deploys:** Changes go live in ~2 minutes
3. **That's It!** No CMS, no complexity

### Architecture:
- **Astro:** Static site generator
- **React:** For interactive components (if needed)
- **Vercel:** Hosting & auto-deployment
- **GitHub:** Version control & content editing

## 📝 To Edit Content:

### Blog Articles:
**Location:** `src/content/articles/`
**Edit:** Click file → Click ✏️ → Make changes → Commit
**Guide:** [HOW_TO_EDIT_ARTICLES.md](./HOW_TO_EDIT_ARTICLES.md)

### About Page:
**Location:** `src/content/about.md`
**Edit:** Same process as articles

### Images:
**Location:** `public/images/articles/[article-name]/`
**Upload:** Add file → Upload files → Drag images → Commit
**Use:** `![Alt](/images/articles/article-name/image.jpg)`

## 🚀 Deployment

### Auto-Deploy on Push:
1. You commit to GitHub
2. Vercel detects change
3. Vercel builds site
4. Changes live in ~2 minutes

### Check Deployment Status:
**Vercel Dashboard:** https://vercel.com/avizurlos-projects/personal-site

## 🔧 Configuration

### Environment Variables (in Vercel):
None needed! It's all static now.

### Astro Config:
```javascript
export default defineConfig({
  output: 'static',        // All pages are static
  adapter: vercel(),       // Deploy to Vercel
  integrations: [react()], // React support
});
```

## 📊 Content Collections

Articles are defined in `src/content/config.ts`:

```typescript
{
  title: string;
  date: Date;
  description: string;
  tags: string[];
  source: 'mirror' | 'x' | 'original';
  featured: boolean;
}
```

## 🆘 If Something Breaks

### Site Not Building?
1. Check Vercel deployments
2. Look for red ❌ deployment
3. Click it to see error
4. Usually it's a markdown formatting error

### Article Not Showing?
1. Check frontmatter format (see HOW_TO_EDIT_ARTICLES.md)
2. Verify date format: YYYY-MM-DD
3. Make sure file ends in `.md`
4. Wait 2-3 minutes for deployment

### Images Not Loading?
1. Check image path matches folder name
2. Verify image is in `/public/images/articles/`
3. Path in markdown should start with `/images/`

## 💡 Best Practices

1. **One change at a time:** Small commits are easier to track
2. **Clear commit messages:** "Fix typo in article" not "update"
3. **Preview before commit:** Use GitHub's preview tab
4. **Check live site:** Always verify after deployment
5. **Keep images organized:** One folder per article

## 🎉 What You Got

- ✅ Simple, fast blog
- ✅ Edit directly on GitHub
- ✅ Auto-deploys on commit
- ✅ Version control of all content
- ✅ No CMS complexity
- ✅ No authentication needed
- ✅ No database to manage
- ✅ Free hosting on Vercel
- ✅ Clean, organized codebase

## 📚 Useful Links

- **Your Site:** https://avi.dog
- **GitHub Repo:** https://github.com/AviZurlo/personal-site
- **Edit Articles:** https://github.com/AviZurlo/personal-site/tree/main/src/content/articles
- **Vercel Dashboard:** https://vercel.com/avizurlos-projects/personal-site
- **Editing Guide:** [HOW_TO_EDIT_ARTICLES.md](./HOW_TO_EDIT_ARTICLES.md)
