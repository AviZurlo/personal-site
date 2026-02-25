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

### Resume

Add your `resume.pdf` to the `public/` folder.

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
