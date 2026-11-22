# Metalhead

Resin collectible statue and figure painting portfolio for Metalhed.

Live: https://metalhed.co.uk (hosted on Yarnham via Dokploy, auto-deploys on push to `main`)

## Stack

Next.js 16 (App Router, Cache Components), React 19, TypeScript. Contact form email goes through Resend.

## Run locally

```bash
npm install
cp .env.example .env.local   # add a Resend key to test the contact form
npm run dev
```

`npm run lint`, `npm run typecheck` and `npm test` should all pass before pushing.

## Adding a piece

1. Add the photo to `public/images/` as WebP.
2. Add an entry to `src/content/projects.ts` with its real width and height (the tests check them).

The piece then gets its own page at `/work/<slug>`, a share image, and entries in the sitemap, `llms.txt` and `llms-full.txt`.

## Contact form

`POST /api/contact` takes the form as multipart data, validates it, checks each file's actual bytes (photos and PDFs only, up to 5 files, 10 MB each, 25 MB total), rate-limits by IP and emails the enquiry to the Metalhed inbox with the files attached. Reply-to is the sender.

Environment variables:

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Resend API key |
| `CONTACT_FROM_EMAIL` | Sender on the verified Resend domain, e.g. `Metalhed site <enquiries@metalhed.co.uk>` |
| `CONTACT_TO_EMAIL` | Where enquiries go (defaults to `metalhed@metalhed.co.uk`) |

## SEO and LLMs

- Metadata, canonicals, Open Graph and Twitter cards on every page
- Generated share images per piece (`opengraph-image.tsx`)
- `sitemap.xml` with image entries, `robots.txt`, web manifest, icons
- JSON-LD: `Organization` and `WebSite` site-wide, `CollectionPage` on the home page, `VisualArtwork` and `BreadcrumbList` on each piece
- `llms.txt` and `llms-full.txt`, generated from the same content
- Unknown `/work/...` URLs return a real 404 (checked in `src/proxy.ts` before streaming starts)

## Deploy

The `Dockerfile` builds a standalone Next.js server listening on port 3000.
