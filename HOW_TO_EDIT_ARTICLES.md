# How to Edit Your Blog on GitHub

This guide walks you through editing your blog articles using GitHub's web interface. No technical knowledge needed!

## 📍 Quick Links

- **Your Blog:** https://avi.dog
- **Your GitHub Repo:** https://github.com/AviZurlo/personal-site
- **Articles Folder:** https://github.com/AviZurlo/personal-site/tree/main/src/content/articles

---

## 🆕 Creating a New Article

### Step 1: Go to the Articles Folder
1. Go to: https://github.com/AviZurlo/personal-site
2. Click on `src` folder
3. Click on `content` folder
4. Click on `articles` folder

### Step 2: Create New File
1. Click the **"Add file"** button (top right)
2. Click **"Create new file"**

### Step 3: Name Your File
1. In the "Name your file" box at the top, type: `my-article-title.md`
   - Use lowercase letters
   - Replace spaces with hyphens (-)
   - Must end with `.md`
   - Example: `my-trip-to-japan.md`

### Step 4: Add Article Content

Copy and paste this template:

```markdown
---
title: "Your Article Title Here"
date: 2026-02-23
description: "A short description of your article"
tags: ["tech", "personal", "travel"]
source: "original"
featured: false
---

Your article content starts here. Write normally!

## You can use headings

- Bullet points work
- Just like this

**Bold text** and *italic text* work too.

### Add images:

![Image description](/images/articles/your-article/image.jpg)

That's it!
```

### Step 5: Edit the Template
1. Replace `"Your Article Title Here"` with your actual title
2. Change the date to today's date (format: YYYY-MM-DD)
3. Write a short description
4. Add relevant tags (keep the brackets and quotes)
5. Write your article below the `---` line

### Step 6: Save (Commit) the File
1. Scroll to bottom of page
2. In the "Commit new file" box, write: `Add new article: [your title]`
3. Make sure **"Commit directly to the main branch"** is selected
4. Click the green **"Commit new file"** button

### Step 7: Wait for Deployment
1. Your article is now saved!
2. Vercel will automatically rebuild your site (~2 minutes)
3. Check your blog: https://avi.dog

---

## ✏️ Editing an Existing Article

### Step 1: Find Your Article
1. Go to: https://github.com/AviZurlo/personal-site/tree/main/src/content/articles
2. Click on the article file you want to edit (ends in `.md`)

### Step 2: Edit the File
1. Click the **pencil icon** (✏️) in the top right that says "Edit this file"
2. Make your changes in the editor

### Step 3: Preview Your Changes (Optional)
1. Click the **"Preview"** tab at the top
2. See how your markdown will look

### Step 4: Save Your Changes
1. Scroll to bottom
2. In "Commit changes" box, write what you changed
   - Example: `Update article title` or `Fix typo in introduction`
3. Click **"Commit changes"** button
4. Wait ~2 minutes for Vercel to deploy
5. Check https://avi.dog

---

## 🗑️ Deleting an Article

### Step 1: Find the Article
1. Go to: https://github.com/AviZurlo/personal-site/tree/main/src/content/articles
2. Click on the article you want to delete

### Step 2: Delete It
1. Click the **trash can icon** (🗑️) on the right
2. At the bottom, write: `Delete article: [article name]`
3. Click **"Commit changes"**

---

## 📸 Adding Images to Articles

### Step 1: Create Image Folder (One Time)
1. Go to: https://github.com/AviZurlo/personal-site/tree/main/public/images
2. Click **"Add file"** → **"Create new file"**
3. Type: `articles/my-article-name/.gitkeep`
   - Replace `my-article-name` with your article's filename
   - The `.gitkeep` is a dummy file to create the folder
4. Click **"Commit new file"**

### Step 2: Upload Image
1. Go to the folder you just created
2. Click **"Add file"** → **"Upload files"**
3. Drag your image or click "choose your files"
4. Write: `Add image for article`
5. Click **"Commit changes"**

### Step 3: Use Image in Article
1. Note your image filename (e.g., `photo.jpg`)
2. In your article, add:
   ```markdown
   ![Description of image](/images/articles/my-article-name/photo.jpg)
   ```

---

## 📝 Markdown Cheat Sheet

### Headings
```markdown
# Big Heading (H1)
## Medium Heading (H2)
### Small Heading (H3)
```

### Text Formatting
```markdown
**bold text**
*italic text*
***bold and italic***
~~strikethrough~~
```

### Lists
```markdown
- Bullet point
- Another point
  - Indented point

1. Numbered item
2. Another item
```

### Links
```markdown
[Link text](https://example.com)
```

### Images
```markdown
![Alt text](/path/to/image.jpg)
```

### Quotes
```markdown
> This is a quote
> It can span multiple lines
```

### Code
```markdown
Inline `code` looks like this.

```
Code block
looks like this
```
```

---

## ⏱️ How Long Until Changes Appear?

After you commit (save) changes:
1. **GitHub saves immediately** (you'll see it in the repo)
2. **Vercel detects the change** (~10 seconds)
3. **Vercel builds your site** (~1-2 minutes)
4. **Changes are live** on https://avi.dog

**To check build status:**
1. Go to: https://vercel.com/avizurlos-projects/personal-site
2. Look at the **Deployments** tab
3. Wait for green checkmark ✅

---

## 🆘 Common Issues

### "I don't see my changes on the site"
- Wait 2-3 minutes for Vercel to rebuild
- Hard refresh your browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
- Check Vercel deployments for errors

### "My markdown looks wrong"
- Make sure you have blank lines between sections
- Check that code blocks use three backticks (```)
- Preview your changes before committing

### "I made a mistake!"
1. Go to the file on GitHub
2. Click on the file
3. Click **"History"** button
4. Find your mistake
5. Click **"Revert"** to undo

### "I want to see what changed"
1. Go to: https://github.com/AviZurlo/personal-site/commits/main
2. See all your changes with dates
3. Click any commit to see what changed

---

## 💡 Pro Tips

1. **Write in VS Code first:** Draft your article in any text editor, then copy to GitHub
2. **Use the Preview tab:** Always preview before committing
3. **Commit messages matter:** Write clear descriptions like "Fix typo" or "Add new photos"
4. **One change at a time:** Make small commits instead of huge changes
5. **Check your site after changes:** Always verify your changes look good live

---

## 📱 Using GitHub on Mobile

You can do all of this on your phone too!

1. **Use the GitHub app** (iOS/Android) for easier editing
2. **Or use the mobile website:** m.github.com
3. **Or use GitHub's official mobile app** for the best experience

---

## 🎯 Your Workflow Summary

### Quick Edit Workflow:
1. Go to article → Click ✏️ → Make changes → Commit → Wait 2 min → Check site

### New Article Workflow:
1. Go to articles folder → Add file → Name it → Paste template → Fill in → Commit → Wait 2 min → Check site

That's it! You're now a GitHub blogger. 🎉

---

## 🔗 Helpful Links

- **Your Blog:** https://avi.dog
- **Your Repo:** https://github.com/AviZurlo/personal-site
- **Edit Articles:** https://github.com/AviZurlo/personal-site/tree/main/src/content/articles
- **Vercel Dashboard:** https://vercel.com/avizurlos-projects/personal-site
- **Markdown Guide:** https://www.markdownguide.org/basic-syntax/
