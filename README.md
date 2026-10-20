# Personal Website - Avi Zurlo

A minimal, content-focused personal website built with Astro. Clean, fast, and easy to maintain.

## Editing Content

**The easiest way to edit content is directly on GitHub.** See [HOW_TO_EDIT_ARTICLES.md](./HOW_TO_EDIT_ARTICLES.md) for a complete guide.

## Local Development

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Visit `http://localhost:4321` to see your site.

### Build for Production

```bash
npm run build
```

**Note:** A pre-push git hook automatically runs the build before every push to prevent broken deployments.

## Content Structure

### Articles

Articles live in `src/content/articles/`. Each article needs frontmatter:

```yaml
---
title: "Your Article Title"
date: 2024-01-15
description: "A brief description"
tags: ["tag1", "tag2"]
source: "original"  # Must be: "original", "mirror", or "x"
featured: false
---

Your article content here...
```

**Edit on GitHub:** [src/content/articles](https://github.com/AviZurlo/personal-site/tree/main/src/content/articles)

### About Page

Edit `src/content/about/index.md` to update your bio and background.

**Edit on GitHub:** [src/content/about/index.md](https://github.com/AviZurlo/personal-site/blob/main/src/content/about/index.md)

### Investments

Edit `src/content/investments/index.md` to update your portfolio.

**Edit on GitHub:** [src/content/investments/index.md](https://github.com/AviZurlo/personal-site/blob/main/src/content/investments/index.md)

### Photos

Add photos to `public/photos/`. Supported formats: jpg, jpeg, png, gif, webp.

The Photos page displays a collage with hover enlargement and a keyboard-accessible
photo viewer. Optimized gallery and popup images are generated automatically before
`npm run dev` and `npm run build`; the original files stay in `public/photos/`.
After adding photos while the development server is running, run
`npm run photos:prepare` to refresh the gallery. The gallery is arranged by each
photo's dominant color palette. Descriptions live in `src/data/photo-gallery.json`.

In the local preview, click **Edit gallery**, then **×** on a photo to remove it.
Changes save to `src/data/photo-gallery.json` and persist after refreshing or
restarting. Use **Undo** or expand **Removed photos** to restore a photo. Original
files remain intact. Editing controls and the local editing endpoint are absent
from the published static site.

The popup shows a thumbnail immediately while its larger image loads, falls back
to the original file if necessary, and offers **Retry** if both requests fail.

Hover enlargement eases in and out over 720ms and respects reduced motion.
Click any empty space around an enlarged photo to close the viewer, or use its
close button or Escape. Arrow keys and the arrow buttons navigate between photos.

### Resume

Add your `resume.pdf` to the `public/` folder.

When replacing it, update `resumeLastEdited` in `src/pages/resume.astro` to the
document's last edit date. The date is recorded explicitly so deployments do not
change it.

## Deployment

This site auto-deploys to Vercel:

1. **Push to GitHub** → Vercel automatically builds and deploys
2. **Live in ~2 minutes** at [avi.dog](https://avi.dog)
3. **Pre-push hook** ensures builds succeed before pushing

## Project Structure

```
/
├── .githooks/
│   └── pre-push           # Auto-validates builds before push
├── public/
│   ├── photos/            # Photo gallery images
│   ├── favicon.svg        # Site favicon
│   └── resume.pdf         # Your resume PDF
├── src/
│   ├── content/
│   │   ├── articles/      # Article markdown files
│   │   ├── about/
│   │   │   └── index.md   # About page content
│   │   └── investments/
│   │       └── index.md   # Investments page content
│   ├── layouts/
│   │   └── Layout.astro   # Main layout with header/footer
│   ├── pages/
│   │   ├── index.astro    # Homepage (bio + articles list)
│   │   ├── about.astro    # About page
│   │   ├── articles/
│   │   │   └── [...slug].astro  # Dynamic article pages
│   │   ├── photos.astro   # Photo gallery
│   │   ├── resume.astro   # Resume page
│   │   └── investments.astro
│   └── styles/
│       └── global.css     # Global styles & CSS variables
├── HOW_TO_EDIT_ARTICLES.md   # Complete editing guide
├── REPO_STRUCTURE.md          # Detailed repo documentation
└── package.json
```

## Tech Stack

- **Framework**: [Astro](https://astro.build) (static site generation)
- **Styling**: Vanilla CSS with custom properties
- **Hosting**: [Vercel](https://vercel.com)
- **Domain**: [avi.dog](https://avi.dog)
- **Content**: Markdown with Astro Content Collections

## Design Principles

- Minimal and clean
- Typography-first
- Content-focused
- Fast and lightweight
- Mobile-friendly
