# 7mmcoffee

A bilingual, production-ready foundation for a premium coffee-shop website and CMS, built with Next.js App Router, TypeScript, Tailwind CSS, MongoDB/Mongoose, next-intl, SWR, React Hook Form, Zod and a shadcn-compatible component layer.

## Start locally

1. Install dependencies with `pnpm install` (or `npm install` if npm is available).
2. Copy `.env.example` to `.env.local` and fill in `MONGODB_URI` and a 32+ character `AUTH_SECRET`.
3. Run `pnpm seed` to create the admin, five categories, ten products, four stories, About content and site settings.
4. Start with `pnpm dev`, then visit `http://localhost:3000/vi`.
5. Sign in to `http://localhost:3000/admin/login` using `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` (defaults are shown in `.env.example`; change them before production).

## Commands

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm typecheck
pnpm seed
```

## Deployment checklist

- Configure MongoDB Atlas networking and set `MONGODB_URI`, `MONGODB_DB`, `AUTH_SECRET`, and `NEXT_PUBLIC_SITE_URL` in Vercel.
- Configure the three Cloudinary variables to enable CMS image uploads. Until then, admins can still enter an existing HTTPS image URL.
- Change the seeded administrator password and replace all sample copy/images with the shop’s material.
- Run `pnpm lint`, `pnpm typecheck`, and `pnpm build` before deployment.

## Architecture

- Public pages are server-rendered from MongoDB under `/vi` and `/en`.
- CMS routes live under `/admin`, with JWT httpOnly-cookie authorization at the dashboard layout and all write APIs.
- `/api/products`, `/api/categories`, `/api/stories`, `/api/about`, `/api/settings`, and `/api/contact` return consistent `{ success, data }` responses and validate writes with Zod.
- CMS content is not embedded in public components; the seed script only supplies first-run content.
