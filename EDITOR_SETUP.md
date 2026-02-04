# Content Editor Setup

## Overview
A local development editing interface has been added to edit articles and the about page directly from the frontend with authentication, markdown editing, and file persistence.

## Features Implemented

### 1. Authentication System
- Login/logout functionality
- Session-based authentication using JWT
- Credentials stored in `.env.local`
- Sessions persist across page refreshes

### 2. Content Management APIs
- Read and write articles from `src/content/articles/`
- Edit about page at `src/content/about.md`
- Direct file system operations
- Frontmatter parsing and validation

### 3. Editor UI
- Split-pane markdown editor with live preview
- CodeMirror for syntax highlighting
- Frontmatter editor for article metadata
- Save functionality with success/error messages

### 4. Admin Routes
- `/admin/login` - Login page
- `/admin` - Admin dashboard (lists all articles)
- `/admin/edit/about` - Edit about page
- `/admin/edit/article/[slug]` - Edit specific article

### 5. Edit Mode Indicators
- Yellow banner at top when authenticated
- Edit buttons on article pages
- Edit links on homepage article list
- Edit button on about page

## Getting Started

### 1. Configure Credentials
Edit `.env.local` and change the default credentials:

```env
EDITOR_USERNAME=admin
EDITOR_PASSWORD=your-secure-password
SESSION_SECRET=your-random-secret-key
```

### 2. Start Development Server
```bash
npm run dev
```

The server will start at `http://localhost:4321/` (or next available port)

### 3. Login
1. Navigate to `http://localhost:4321/admin/login`
2. Enter your credentials from `.env.local`
3. Click "Sign in"
4. You'll be redirected to the admin dashboard

### 4. Edit Content

**To edit an article:**
- From admin dashboard, click on any article
- Or click "Edit this article" button on any article page
- Edit the frontmatter (title, date, description, tags, source, featured)
- Edit the markdown content in the left pane
- See live preview on the right
- Click "Save" to persist changes

**To edit the about page:**
- From admin dashboard, click "About Page"
- Or click "Edit this page" button on the about page
- Edit the markdown content
- Click "Save" to persist changes

## File Structure

```
src/
├── lib/
│   ├── auth.ts                  # Authentication utilities
│   └── content-manager.ts       # File system operations
├── pages/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login.ts         # Login endpoint
│   │   │   ├── logout.ts        # Logout endpoint
│   │   │   └── check.ts         # Auth check endpoint
│   │   └── content/
│   │       ├── articles/
│   │       │   ├── index.ts     # List articles
│   │       │   └── [slug].ts    # Get/update article
│   │       └── about.ts         # Get/update about page
│   └── admin/
│       ├── login.astro          # Login page
│       ├── index.astro          # Admin dashboard
│       └── edit/
│           ├── about.astro      # About editor
│           └── article/
│               └── [slug].astro # Article editor
└── components/
    └── Editor/
        ├── LoginForm.tsx        # Login form component
        ├── MarkdownEditor.tsx   # Split-pane editor
        ├── ArticleEditor.tsx    # Article editor wrapper
        └── AboutEditor.tsx      # About page editor wrapper
```

## Security Notes

- **Development only**: All editor routes return 404 in production
- **Credentials**: Never commit `.env.local` to version control
- **Sessions**: Session tokens are signed with your secret key
- **File access**: Sanitized to prevent directory traversal
- **Scope**: Only files in `src/content/` can be edited

## Important Notes

1. **Changes are immediate**: Saved changes are written directly to markdown files
2. **Server restart**: Astro may need to rebuild after file changes
3. **Git**: Changes to markdown files will show up in git - commit them as needed
4. **Production**: This editor will NOT be available in production builds

## Troubleshooting

### Can't login
- Check credentials in `.env.local`
- Ensure dev server is running (`npm run dev`)
- Clear browser cookies and try again

### Changes not appearing
- Check the save success message appeared
- Refresh the page to see changes
- Check file permissions on `src/content/` directory

### Edit buttons not showing
- Ensure you're logged in at `/admin/login`
- Check the yellow "Edit Mode Active" banner appears
- Only works in development mode

## Testing Checklist

- [ ] Login with correct credentials works
- [ ] Login with incorrect credentials fails
- [ ] Session persists across page refreshes
- [ ] Can edit article frontmatter
- [ ] Can edit article content
- [ ] Live preview updates as you type
- [ ] Save button works and shows success message
- [ ] Changes persist to markdown files
- [ ] Can edit about page
- [ ] Edit buttons appear when authenticated
- [ ] Logout works
