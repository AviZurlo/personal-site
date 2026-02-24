# Git Hooks

This directory contains git hooks to help maintain code quality.

## Pre-push Hook

The pre-push hook runs `npm run build` before every git push to ensure the build succeeds before deploying to Vercel.

## Setup

The hook is already installed for this repo. If you clone the repo fresh, run:

```bash
git config core.hooksPath .githooks
```

This tells git to use hooks from `.githooks/` instead of `.git/hooks/`.
