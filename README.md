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
