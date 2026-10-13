import { useEffect, useRef, useState } from 'react'
import { BRAND, HREF, type PageId } from './content'
import Logo from './Logo'
import { useQuote } from './quote-store'
import { Close, Menu } from './icons'

/*
  The navbar sits outside the scaled artboard, at natural size, so it stays
  readable at every width. Over the home page's photo stage it is a fading
  gradient (a solid bar would draw a hard seam across the photos); everywhere
  else, and once the home page flows past the stage, it is a solid blurred bar.
*/

const LINKS: { id: PageId; t: string }[] = [
  { id: 'services', t: 'Services' },
  { id: 'about', t: 'About' },
  { id: 'gallery', t: 'Gallery' },
  { id: 'hire', t: 'Hire' },
]

export default function Nav({ page }: { page: PageId }) {
  const [solid, setSolid] = useState(page !== 'home')
  const [open, setOpen] = useState(false)
  const { items, services } = useQuote()
  const count = items.length + services.length
  const btn = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (page !== 'home') return
    const onScroll = () => {
      const stage = document.getElementById('stage')
      const end = stage ? stage.offsetTop + stage.offsetHeight - window.innerHeight * 0.6 : 0
      setSolid(window.scrollY > end)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [page])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        btn.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const current = (id: PageId) => (id === page ? ('page' as const) : undefined)

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          height: 120,
          background: 'linear-gradient(180deg, rgba(10,9,7,0.8) 0%, rgba(10,9,7,0.4) 50%, rgba(10,9,7,0) 100%)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          maskImage: 'linear-gradient(180deg, #000 0%, #000 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(180deg, #000 0%, #000 40%, transparent 100%)',
          opacity: solid || open ? 0 : 1,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-b border-white/10 bg-ink/85 backdrop-blur-xl transition-opacity duration-300"
        style={{ opacity: solid || open ? 1 : 0 }}
      />

      <nav aria-label="Main" className="relative mx-auto flex h-[76px] items-center gap-3 px-4 sm:h-[88px] sm:gap-6 sm:px-10">
        <a
          href={HREF.home}
          aria-current={current('home')}
          className="flex min-h-11 min-w-0 items-center gap-2.5 text-white no-underline sm:gap-3"
          aria-label={`${BRAND.name} — home`}
        >
          <Logo size={42} />
          <span className="leading-none">
            <span className="display block text-[25px] tracking-wide">Mega</span>
            <span className="label mt-1 block whitespace-nowrap text-[8.5px] tracking-[0.12em] text-gold-soft sm:text-[9.5px] sm:tracking-[0.22em]">
              Catering & Décor Hire
            </span>
          </span>
        </a>

        <ul className="nav-links m-0 flex flex-1 list-none justify-center gap-12 p-0">
          {LINKS.map((l) => (
            <li key={l.id}>
              <a
                href={HREF[l.id]}
                aria-current={current(l.id)}
                className={
                  'label relative inline-flex min-h-11 items-center no-underline transition-colors ' +
                  (l.id === page
                    ? 'text-gold after:absolute after:inset-x-0 after:bottom-2 after:h-px after:bg-gold'
                    : 'text-white/80 hover:text-white')
                }
              >
                {l.t}
              </a>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <a
            href={HREF.quote}
            aria-current={current('quote')}
            className="label btn-gold inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full px-4 no-underline sm:px-5"
          >
            <span className="hidden min-[420px]:inline">Get a&nbsp;</span>Quote
            {count > 0 && (
              <span className="grid size-6 place-items-center rounded-full bg-ink text-[11px] tracking-normal text-gold">
                {count}
                <span className="sr-only"> on your quote list</span>
              </span>
            )}
          </a>
          <button
            ref={btn}
            type="button"
            className="nav-menu-btn grid size-11 place-items-center rounded-full border border-white/30 bg-transparent text-white"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <Close size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="nav-menu-btn relative border-b border-white/10 bg-ink/95 backdrop-blur-xl">
          <ul className="m-0 list-none px-5 pb-6 pt-2">
            {[{ id: 'home' as PageId, t: 'Home' }, ...LINKS, { id: 'quote' as PageId, t: 'Get a quote' }].map((l) => (
              <li key={l.id} className="border-t border-white/10 first:border-t-0">
                <a
                  href={HREF[l.id]}
                  aria-current={current(l.id)}
                  className={'display flex min-h-14 items-center text-[30px] no-underline ' + (l.id === page ? 'text-gold' : 'text-white')}
                >
                  {l.t}
                </a>
              </li>
            ))}
            <li className="border-t border-white/10 pt-4">
              <a href={`tel:${BRAND.phoneTel}`} className="label inline-flex min-h-11 items-center text-gold-soft no-underline">
                Call {BRAND.phoneDisplay}
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
