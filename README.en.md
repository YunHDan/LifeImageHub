# LifeImageHub

[中文](README.md) | English

A Next.js-based photo album / life timeline website that displays photos in chronological order.

This project is adapted from the site structure of ned.im. Some components and documentation routes from the original project are retained.

## Features

- Life timeline display (each entry can include multiple photos)
- Thumbnail prefetching and click-to-open viewer
- Two photo source options:
  - Publicly accessible photo base URL (CDN / public bucket / your own domain)
  - Private object storage (currently implemented for Qiniu private bucket) with temporary signed access via an API
- Built-in MDX docs routes (this repo currently includes Noty documentation pages)

## TODO

- 2026-01-14 :white_check_mark: Added support for using the album locally.
- 2026-xx-xx :brain: Add compatibility with the Shoka theme blog.
- 2026-xx-xx :brain: Add compatibility with Telegram image hosting, to achieve unlimited storage space for LifeImageHub.

## Tech Stack

- Next.js 15 (App Router)
- React 19
- Tailwind CSS
- MDX (@next/mdx)

## Quick Start

### 1) Install dependencies

> pnpm is recommended.

```bash
pnpm install
```

### 2) Configure environment variables (optional)

Copy the example file and fill in the values you need:

```bash
copy .env.example .env.local
```

See “Environment Variables” below.

### 3) Start the dev server

```bash
pnpm dev
```

Open:

- http://localhost:3000

### 4) Build & start (production)

```bash
pnpm build
pnpm start
```

## Environment Variables

There are two image loading paths in this project — choose either one:

### Option A: Public photo base (simplest)

If your photos are hosted under a publicly accessible domain (e.g. CDN, public bucket, or your own domain), set this in `.env.local`:

- `NEXT_PUBLIC_PHOTO_BASE`

Example:

```env
NEXT_PUBLIC_PHOTO_BASE=https://cdn.example.com
```

Then the page will resolve photo keys into:

`https://cdn.example.com/<your-key>`

Note: If you want to use Next.js `public/` static files locally during development, you can set:

```env
NEXT_PUBLIC_PHOTO_BASE=http://localhost:3000
```

And use keys like `"/xxx.jpg"` or `"xxx.jpg"` in your data.

### Option B: Qiniu private bucket (signed URLs)

If your photos are stored in a Qiniu private bucket (or you want time-limited signed URLs), configure:

- `QINIU_ACCESS_KEY`
- `QINIU_SECRET_KEY`
- `QINIU_BUCKET_DOMAIN` (e.g. `https://img.example.com`, without query params)

The frontend will request the signing API to get a temporary accessible URL:

- `GET /api/sign?key=<object-key>` (defaults to 307 redirect, suitable for direct `<img src>`)
- `GET /api/sign?mode=json&key=<object-key>` (returns `{ url }`, suitable for fetching first)

## How to add / edit photo content

The current example data lives in:

- `lib/utils.tsx`

Add new entries in `changelogItems` (date, title, description, photos, etc.).

About `photos[].src`:

- If it is a full URL (starts with http/https), it will be used directly.
- If it is a key/relative path, it will be resolved via `NEXT_PUBLIC_PHOTO_BASE` or `/api/sign`.

## Troubleshooting

### 1) Images don’t show / image URLs expire after refresh

This usually means the image source configuration is incorrect:

- Using Qiniu private bucket: ensure all three `QINIU_*` vars exist in `.env.local`.
- Using public base: ensure `NEXT_PUBLIC_PHOTO_BASE` is set in `.env.local` and the domain can access the corresponding keys.

Tip: Open browser DevTools → Network to check whether image requests return a 307 redirect, or if they’re returning 4xx/5xx.

### 2) Can’t access remote images in local dev

If you access the dev server via a LAN IP (phone/other devices), Next dev may show CORS-related restrictions.
This project sets `allowedDevOrigins` in `next.config.mjs`; change it to match your own dev access origins.

## Optional: Deployment

- You can deploy to any Node.js platform by default (e.g. Vercel or self-hosted).
- This repo includes `wrangler.json` as a starting point for Cloudflare deployments (ignore/remove if not using Cloudflare).

## Credits

- Site structure and some components are from ned.im (adapted into an album-style site)

## License

See LICENSE.
