# Environment Variables Setup

## Quick Fix

Your `.env` file needs to be converted to `.env.local` with `NEXT_PUBLIC_` prefix for client-side variables.

### Step 1: Create `.env.local` file

Create a new file called `.env.local` in the root directory with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://qequhokhqqfkioslgizv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlcXVob2tocXFma2lvc2xnaXp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NzcwMjEsImV4cCI6MjA3OTA1MzAyMX0.mQUH5-QgTmWwfx0jmpWxkX9qnu-QZ441Zc8k7v4B_No
PORT=3000
```

### Step 2: Restart your dev server

After creating `.env.local`, restart your development server:

```bash
# Stop the current server (Ctrl+C)
pnpm dev
```

## Why `NEXT_PUBLIC_` prefix?

Next.js requires the `NEXT_PUBLIC_` prefix for environment variables that need to be accessed in the browser (client-side code). Since the Supabase client is used in React components and hooks, it needs this prefix.

## File Priority

Next.js loads environment variables in this order (highest priority first):
1. `.env.local` (always loaded, except on test)
2. `.env.development`, `.env.production`, `.env.test` (based on NODE_ENV)
3. `.env` (default)

Use `.env.local` for local development as it's gitignored and won't be committed.

## CSP Warnings (Safe to Ignore)

The Content Security Policy warnings about `adobe_dtm_prod.min.js` and `trackonomics.min.js` are from browser extensions (likely Adobe Analytics extensions) and won't affect your app. These can be safely ignored.

