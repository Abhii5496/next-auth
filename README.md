# Auth App

A production-ready authentication app built with **Next.js** (App Router), **Tailwind CSS**, and **Supabase Authentication**. Supports signup, login, logout, and session-based route protection.

## Features

- **Sign up** – Email + password with client-side validation and error handling
- **Log in** – Email + password with invalid-credential handling; session persists across refresh
- **Log out** – Clears session and redirects to login
- **Protected routes** – Authenticated users only; unauthenticated users are redirected to `/login`
- **Public routes** – `/login` and `/signup`; logged-in users are redirected to `/`
- **Session handling** – Supabase session management with Next.js middleware (session persists across reloads)

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/Abhii5496/next-auth.git
cd next-auth
npm install
```

### 2. Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. In **Project Settings → API**, copy:

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** key → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- **secret** key → `SUPABASE_SERVICE_ROLE_KEY`

3. Enable **Email** auth in **Authentication → Providers** (default).

### 3. Environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Generate Supabase types (before first run)

Generate TypeScript types from your Supabase schema - change your project id package.json (logs in to Supabase if needed, then writes `utils/supabase/database.types.ts`):

```bash
npm run gen:types
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You’ll be redirected to `/login` until you sign up or log in.

## Email setup on Supabase

1. In your Supabase project, go to **Authentication → Emails**.
2. Under **Confirm your signup**, replace the default template with:

```html
<h2>Confirm your signup</h2>
<p>Follow this link to confirm your user:</p>
<p>
  <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email"
    >Confirm your mail</a
  >
</p>
```

## Project structure

- `app/` – App Router pages and layout
  - `actions/auth.ts` – Server actions: signUp, signIn, signOut
  - `login/page.tsx` – Login form
  - `signup/page.tsx` – Signup form
  - `page.tsx` – Protected home/dashboard
- `components/` – Reusable UI (e.g. `logout-button.tsx`)
- `utils/supabase/` – Supabase client (browser), server client, and middleware session refresh (`proxy.ts`)
- `middleware.ts` – Route protection and session refresh

## Deploy on Vercel

1. Push the repo to GitHub.
2. In [Vercel](https://vercel.com), **Add New Project** and import the repo.
3. In **Settings → Environment Variables**, add:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

4. Deploy. The app will use the same env vars in production.

## Tech stack

- **Next.js 16** (App Router)
- **Tailwind CSS**
- **Supabase** (Auth + `@supabase/ssr` for cookie-based sessions)
- No external UI libraries beyond existing components
