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

1. Create the `public.users` table in **SQL Editor** (run the following):

```sql
create table public.users (
  id uuid not null default auth.uid (),
  fname text null,
  lname text null,
  is_active boolean not null default false,
  avatar text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  email text not null,
  provider text null default 'email'::text,
  constraint users_pkey primary key (id),
  constraint users_email_key unique (email),
  constraint users_id_fkey foreign key (id) references auth.users (id) on update cascade on delete cascade,
  constraint users_email_check check ((length(email) <= 50))
) tablespace pg_default;
```

1. Enable **Email** auth in **Authentication → Providers** (default).
2. Make sure to turn off Confirm email switch (Supabase now put a restriction limited number of emails)
3. If turned on use this:
   - In **Authentication → URL Configuration**, set **Redirect URLs** to include:
     - `http://localhost:3000/**` (local)
     - `https://your-production-domain.com/**` (production)
   - In **Authentication → Email Templates → Confirm signup**, use this template so the link points to your app’s `/auth/confirm` route:

   ```html
   <h2>Confirm your signup</h2>
   <p>Follow this link to confirm your user:</p>
   <p>
     <a
       href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email"
       >Confirm your mail</a
     >
   </p>
   ```

   The confirmation link will send users to `/auth/confirm`, which verifies the OTP and upserts the user into `public.users`.

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

1. Deploy. The app will use the same env vars in production.

## Tech stack

- **Next.js 16** (App Router)
- **Tailwind CSS**
- **Supabase** (Auth + `@supabase/ssr` for cookie-based sessions)
- No external UI libraries beyond existing components
