import { StrictMode, type ReactNode } from 'react'
import { renderToString } from 'react-dom/server'
import { HERO_PHOTOS, HREF, type PageId } from './content'
import Layout from './Layout'
import Stage from './Stage'
import HomeNext from './HomeNext'
import Services from './Services'
import About from './About'
import Gallery from './Gallery'
import Hire from './Hire'
import Quote from './Quote'

/*
  Build-time rendering, for search engines and link previews.

  scripts/prerender.mjs calls render() for every page and writes the markup
  into that page's #root, so the HTML Google downloads already carries every
  heading, paragraph, link and photo. In the browser, mount() then renders
  the live page over it. Keep this table in step with src/pages/*.tsx.
*/

const PAGES: Record<PageId, () => ReactNode> = {
  home: () => (
    <>
      <Stage />
      <HomeNext />
    </>
  ),
  services: () => <Services />,
  about: () => <About />,
  gallery: () => <Gallery />,
  hire: () => <Hire />,
  quote: () => <Quote />,
}

export const ROUTES = Object.entries(HREF) as [PageId, string][]

/** The photo shown when a link is shared on WhatsApp or Facebook. */
export const SHARE_IMAGE = HERO_PHOTOS[0].src

export function render(page: PageId) {
  return renderToString(
    <StrictMode>
      <Layout page={page}>{PAGES[page]()}</Layout>
    </StrictMode>,
  )
}
