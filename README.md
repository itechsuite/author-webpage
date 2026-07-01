# Author Ebook Platform

A Next.js storefront for an author to showcase and sell digital books
(ebooks/audiobooks), with a dark editorial UI inspired by
[markmanson.net](https://markmanson.net/), plus a full admin dashboard for
managing the catalog.

## Stack

- **Next.js 15** (App Router, Server Components, Route Handlers)
- **MongoDB** (native driver) for book data
- **Cloudflare R2** (S3-compatible) for cover images, preview videos, and
  deliverable files — uploaded directly from the browser via presigned URLs
- **Tailwind CSS** for styling
- **jose + bcryptjs** for a lightweight, dependency-free admin session
  (no third-party auth provider required)

## Project Structure

```
src/
  app/
    page.tsx                 Home page (hero, featured books, newsletter)
    books/page.tsx            Public storefront ("Books" listing)
    books/[slug]/page.tsx      Individual book detail + Buy Now
    admin/
      login/page.tsx          Admin login (no sidebar)
      (dashboard)/layout.tsx   Sidebar shell for all protected admin pages
      (dashboard)/page.tsx     Dashboard overview
      (dashboard)/books/       List / create / edit books
    api/
      books/                   REST-ish CRUD for books
      upload/                  Issues presigned R2 upload URLs
      auth/                    login/logout for admin session
      checkout/                Placeholder — wire up Stripe/Paddle/etc here
  components/                 Shared UI (Navbar, Hero, BookCard, ...)
  components/admin/            Admin-only UI (Sidebar, BookForm, FileUploader)
  lib/
    mongodb.ts                 Cached MongoDB client
    r2.ts                      R2 client + presigned URL helpers
    auth.ts                    Admin session (JWT cookie) helpers
    models/Book.ts              Data-access functions for the books collection
  types/book.ts                 Shared Book type
  middleware.ts                 Protects /admin/* routes
scripts/
  seed-admin.ts                 Upsert the admin login into the admins collection
  seed.ts                       Insert sample books so the store isn't empty
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in:

- **MongoDB**: `MONGODB_URI`, `MONGODB_DB` — from MongoDB Atlas (or a local instance).
- **Cloudflare R2**: create a bucket in the Cloudflare dashboard, generate
  an API token (R2 → Manage API Tokens), and fill in `R2_ACCOUNT_ID`,
  `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_ENDPOINT`.
  Enable the bucket's public access (or a custom domain) and set
  `R2_PUBLIC_BASE_URL` accordingly so uploaded covers/videos can be displayed.
- **Admin login**: stored in the `admins` collection in MongoDB (see step 3
  below), not in env vars. Set `AUTH_SECRET` to any long random string
  (e.g. `openssl rand -hex 32`) — it's only used to sign the session JWT.

### 3. Seed data

```bash
npm run seed              # sample books
npm run seed:admin -- "admin@example.com" "your-chosen-password"
```

### 4. Run the dev server

```bash
npm run dev
```

Visit `http://localhost:3000` for the storefront and
`http://localhost:3000/admin/login` for the admin dashboard.

## How the "booking" (books) section works

- Every book lives in the `books` collection in MongoDB with fields for
  title, slug, description, price, format, cover image URL, optional
  preview video URL, and an optional deliverable file URL (the actual
  ebook/audiobook file, meant to be delivered after purchase).
- In the **admin dashboard**, adding/editing a book lets you upload a cover
  image and preview video directly — the browser requests a short-lived
  presigned URL from `/api/upload`, then `PUT`s the file straight to your
  R2 bucket. Nothing passes through the Next.js server, so this scales fine
  for large video files.
- Public pages (`/books` and `/books/[slug]`) only ever show
  `published: true` books. Draft books are visible to the admin (via the
  admin dashboard and `/api/books` when authenticated) but hidden from
  visitors.
- The `featured` flag controls which books show up in the homepage grid.

## Payments

The "Buy Now" button currently posts to `/api/checkout`, which is a
**placeholder** — it just confirms the book exists and redirects back.
Swap in a real processor:

- **Stripe**: create a Checkout Session with the book's price inside
  `src/app/api/checkout/route.ts`, redirect to `session.url`, and handle
  fulfillment (emailing the `fileUrl` download link) via a webhook.
- **Lemon Squeezy / Paddle**: similar pattern using their hosted checkout
  and webhooks — both handle tax/VAT for digital goods automatically,
  which is worth considering for ebook sales.

## Customizing the design

The color palette lives in `tailwind.config.ts` under `colors.ink`,
`colors.cream`, and `colors.accent` — swap these for your own brand colors
whenever you're ready; every component references these tokens instead of
hard-coded colors, so a palette change is a one-file edit.

Replace `public/author-photo.jpg` with your own headshot (same filename,
or update the path in `src/components/Hero.tsx`).

## Deployment

This deploys cleanly to **Vercel** (recommended for Next.js) — just add the
same environment variables from `.env.local` to your Vercel project
settings. MongoDB Atlas and Cloudflare R2 both work from any region Vercel
deploys to.
