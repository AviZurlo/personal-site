# Personal Website - Avi Zurlo

A minimal, content-focused personal website built with Astro and Tailwind CSS.

## Getting Started

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

## Content Structure

### Articles

Add article markdown files to `src/content/articles/`. Each article should have frontmatter:

```yaml
---
title: "Your Article Title"
date: 2024-01-15
description: "A brief description"
tags: ["tag1", "tag2"]
source: "original"  # or "mirror" or "x"
featured: false
---

Your article content here...
```

### About

Edit `src/content/about.md` with your personal information and bio.

### Investments

Edit `src/content/investments.md` with your investment thesis and portfolio companies.

### Photos

Add photos to `public/photos/`. Supported formats: jpg, jpeg, png, gif, webp.

### Resume

Add your `resume.pdf` to the `public/` folder.

## Deployment

This site is configured for Vercel deployment:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push to main
4. Configure your custom domain (avizurlo.com) in Vercel settings

## Project Structure

```
/
├── public/
│   ├── photos/         # Photo gallery images
│   └── resume.pdf      # Your resume PDF
├── src/
│   ├── content/
│   │   ├── articles/   # Article markdown files
│   │   ├── about.md    # About page content
│   │   └── investments.md
│   ├── layouts/
│   │   └── Layout.astro # Main layout with header
│   ├── pages/
│   │   ├── index.astro      # Homepage (about + articles)
│   │   ├── articles/
│   │   │   └── [...slug].astro  # Article detail pages
│   │   ├── photos.astro     # Photo gallery
│   │   ├── resume.astro     # Resume page
│   │   └── investments.astro
│   └── styles/
│       └── global.css   # Global styles
└── package.json
```

## Tech Stack

- **Framework**: [Astro](https://astro.build)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Hosting**: [Vercel](https://vercel.com)
- **Domain**: avizurlo.com

## Design Principles

- Minimal and clean
- Typography-first
- Content-focused
- Fast and lightweight
- Mobile-friendly
