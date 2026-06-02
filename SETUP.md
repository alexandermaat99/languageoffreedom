# New book preorder site (from waitingtofly)

This project is a copy of `waitingtofly` with the same stack: **Next.js 16**, **React 19**, **Tailwind**, **shadcn/ui**, **Supabase**, **Stripe**, and **Resend**.

## Before you go live

1. **Create a new Supabase project** — separate database from Waiting to Fly
3. **Run SQL** in order (Supabase SQL editor):
   - `database-schema.sql`
   - `site-config-schema.sql` (edit book title, description, and images first)
   - `enable-rls-policies.sql` and any other `add-*.sql` files you need from this repo
4. **Copy `.env.example` → `.env.local`** and fill in keys (new Stripe + Supabase only)
5. **Replace images** in `public/images/` (cover, author photo, bonus assets)
6. **Edit foreword** in `components/foreword.tsx` (or move to `site_config` later)
7. **Configure Stripe** — new webhook URL pointing at this deployment’s `/api/webhooks/stripe`
8. **Deploy** (e.g. Vercel) and set production env vars

## Content

- **Admin UI**: `/protected/admin` — edit book info, pricing, testimonials, preorder status
- **Seed data**: `site-config-schema.sql` — update title, description, `previousBook` (Waiting to Fly), and series label before running

## Dev

```bash
cd /Users/alexandermaat/Desktop/program/languageoffreedom
npm install
npm run dev
```
