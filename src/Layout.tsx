import type { ReactNode } from 'react'
import type { PageId } from './content'
import Nav from './Nav'
import Footer from './Footer'

/*
  The frame every page shares: skip link, navbar, the page itself, footer.
  Inner pages clear the fixed navbar; the home page lets its photo stage run
  underneath it.
*/
export default function Layout({ page, children }: { page: PageId; children: ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="label fixed left-4 top-4 z-[60] -translate-y-24 rounded-full bg-gold px-5 py-3 text-ink no-underline focus:translate-y-0"
      >
        Skip to content
      </a>
      <Nav page={page} />
      <main id="main" tabIndex={-1} className={page === 'home' ? 'outline-none' : 'pt-[76px] outline-none sm:pt-[88px]'}>
        {children}
      </main>
      <Footer />
    </>
  )
}
