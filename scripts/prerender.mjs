/*
  Runs after both Vite builds (see "build" in package.json).

  For every page: render it with the server bundle, put the markup inside
  #root, and add the tags search engines and link previews look for —
  canonical URL, og:url and og:image. Then write sitemap.xml and robots.txt.

  SITE_URL is the public address of the site, ending in "/". It defaults to
  the GitHub Pages address; set it to the real domain once there is one.
*/

import { readFile, writeFile, rm } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'

/* render with React's production build: smaller markup, no dev-only checks */
process.env.NODE_ENV ||= 'production'

const root = fileURLToPath(new URL('..', import.meta.url))
const dist = `${root}dist/`
const SITE_URL = (process.env.SITE_URL || 'https://rolandvtonder.github.io/Mega-Catering-website-demo/').replace(/\/?$/, '/')
const origin = new URL(SITE_URL).origin
const base = new URL(SITE_URL).pathname

const { render, ROUTES, SHARE_IMAGE } = await import(pathToFileURL(`${root}dist-ssr/entry-server.js`).href)

const escapeAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;')

for (const [page, href] of ROUTES) {
  /* href already carries the base path; the file lives under dist/ without it */
  const rel = href.startsWith(base) ? href.slice(base.length) : href.replace(/^\//, '')
  const file = `${dist}${rel}index.html`
  const url = SITE_URL + rel

  let html = await readFile(file, 'utf8')
  if (!html.includes('<div id="root"></div>')) throw new Error(`#root not found in ${file}`)

  const head = [
    `<link rel="canonical" href="${escapeAttr(url)}" />`,
    `<meta property="og:url" content="${escapeAttr(url)}" />`,
    SHARE_IMAGE ? `<meta property="og:image" content="${escapeAttr(origin + SHARE_IMAGE)}" />` : '',
    `<meta name="twitter:card" content="summary_large_image" />`,
  ]
    .filter(Boolean)
    .join('\n    ')

  html = html
    .replace('</head>', `    ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${render(page)}</div>`)

  await writeFile(file, html)
  console.log(`prerendered ${url}`)
}

const today = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map(([, href]) => {
  const rel = href.startsWith(base) ? href.slice(base.length) : href.replace(/^\//, '')
  return `  <url><loc>${SITE_URL + rel}</loc><lastmod>${today}</lastmod></url>`
}).join('\n')}
</urlset>
`
await writeFile(`${dist}sitemap.xml`, sitemap)
await writeFile(`${dist}robots.txt`, `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}sitemap.xml\n`)
console.log(`wrote sitemap.xml and robots.txt for ${SITE_URL}`)

/* the server bundle was only needed for this step */
await rm(`${root}dist-ssr`, { recursive: true, force: true })
