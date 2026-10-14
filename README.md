# Mega Catering & Decor Hire — website

Catering, décor and event hire in Olievenhoutbosch, Centurion.

**Live demo:** https://rolandvtonder.github.io/Mega-Catering-website-demo/

## Pages

| Page | Path |
|---|---|
| Home (scroll story) | `/` |
| Services | `/services/` |
| About | `/about/` |
| Gallery | `/gallery/` |
| Hire catalogue | `/hire/` |
| Get a quote (WhatsApp) | `/quote/` |

## Run it locally

```bash
npm install
npm run dev
```

## Editing

- **Photos** — drop images into `media/`; they appear in the gallery automatically. Prefix a filename with `_` to hide it.
- **Wording, services, hire items, phone number** — `src/content.ts`.

Every push to `main` rebuilds and publishes the site to GitHub Pages.

## Search engines

`npm run build` prerenders every page to plain HTML (so Google reads the full
content without running JavaScript) and writes `sitemap.xml` and `robots.txt`.

When a custom domain is connected, change `SITE_URL` (and `BASE_PATH` to `/`)
in `.github/workflows/pages.yml` so the sitemap and canonical links use it.
