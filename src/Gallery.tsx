import { useEffect, useRef, useState } from 'react'
import { GALLERY } from './photos'
import { BRAND } from './content'
import { ChevronLeft, ChevronRight, Close, Facebook } from './icons'

/*
  Every photo in /media, newest first, in an editorial grid. Tiles have fixed
  row heights (some span two rows), so nothing shifts as the images load.
  Clicking one opens a lightbox built on <dialog>: Esc closes it, the arrow
  keys move through the set, and focus returns to the tile.
*/

const PAGE = 16
const TALL = new Set([0, 5, 9, 14])

export default function Gallery() {
  const [shown, setShown] = useState(PAGE)
  const [idx, setIdx] = useState<number | null>(null)
  const dlg = useRef<HTMLDialogElement>(null)
  const opener = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const d = dlg.current
    if (!d) return
    if (idx != null && !d.open) d.showModal()
    if (idx == null) {
      if (d.open) d.close()
      /* only once the modal is gone can focus go back to the photo that opened it */
      opener.current?.focus()
    }
  }, [idx])

  useEffect(() => {
    if (idx == null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setIdx((i) => (i == null ? i : (i + 1) % GALLERY.length))
      if (e.key === 'ArrowLeft') setIdx((i) => (i == null ? i : (i - 1 + GALLERY.length) % GALLERY.length))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [idx])

  const close = () => setIdx(null)

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="relative bg-ink px-5 pb-24 pt-14 sm:px-10 sm:pt-20">
      <div className="mx-auto max-w-[1312px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label m-0 flex items-center gap-3 text-gold-soft">
              <span className="h-px w-10 bg-gold" aria-hidden="true" />
              Gallery
            </p>
            <h1 id="gallery-title" className="display m-0 mt-4 text-[44px] sm:text-[68px]">
              Recent <em className="font-medium text-gold">events</em>
            </h1>
          </div>
          <p className="m-0 max-w-md text-[16px] leading-[26px] text-white/75">
            Real setups from our team — weddings, birthdays, kiddies parties, memorials and more. Tap a photo to see it full
            size.
          </p>
        </div>

        {GALLERY.length === 0 ? (
          <p className="mt-12 rounded-3xl border border-white/10 p-10 text-white/70">
            Photos are on their way. In the meantime, see our latest work on{' '}
            <a href={BRAND.facebook} className="text-gold-soft underline" target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
            .
          </p>
        ) : (
          <ul className="m-0 mt-12 grid list-none grid-flow-row-dense auto-rows-[180px] grid-cols-2 gap-3 p-0 sm:auto-rows-[220px] sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {GALLERY.slice(0, shown).map((g, i) => (
              <li key={g.name} className={TALL.has(i % 16) ? 'row-span-2' : ''}>
                <button
                  type="button"
                  onClick={(e) => {
                    opener.current = e.currentTarget
                    setIdx(i)
                  }}
                  className="group relative block size-full overflow-hidden rounded-[22px] border-0 bg-coal p-0"
                  aria-label={`Open photo ${i + 1} of ${GALLERY.length}`}
                >
                  <img
                    src={g.url}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-[22px] ring-1 ring-inset ring-white/15"
                  />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {shown < GALLERY.length && (
            <button
              type="button"
              onClick={() => setShown((s) => s + PAGE)}
              className="label btn-ghost h-12 rounded-full bg-transparent px-7"
            >
              Show more photos ({GALLERY.length - shown} more)
            </button>
          )}
          <a
            href={BRAND.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="label inline-flex h-12 items-center gap-2 rounded-full px-5 text-white/80 no-underline hover:text-white"
          >
            <Facebook size={16} /> More on Facebook
          </a>
        </div>
      </div>

      <dialog
        ref={dlg}
        onClose={() => idx != null && close()}
        onClick={(e) => e.target === dlg.current && close()}
        aria-label="Photo viewer"
        className="m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-black/92 p-0 text-white backdrop:bg-black/80"
      >
        {idx != null && (
          <div className="relative flex size-full items-center justify-center p-4 sm:p-16" onClick={(e) => e.target === e.currentTarget && close()}>
            <img src={GALLERY[idx].url} alt={`Event photo ${idx + 1} of ${GALLERY.length}`} className="max-h-full max-w-full rounded-2xl object-contain" />
            <button
              type="button"
              onClick={close}
              aria-label="Close photo viewer"
              className="absolute right-4 top-4 grid size-12 place-items-center rounded-full border border-white/30 bg-black/50 text-white"
            >
              <Close size={22} />
            </button>
            <button
              type="button"
              onClick={() => setIdx((idx - 1 + GALLERY.length) % GALLERY.length)}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-black/50 text-white"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={() => setIdx((idx + 1) % GALLERY.length)}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-black/50 text-white"
            >
              <ChevronRight size={22} />
            </button>
            <p className="label absolute bottom-4 left-1/2 m-0 -translate-x-1/2 text-white/70" aria-live="polite">
              {idx + 1} / {GALLERY.length}
            </p>
          </div>
        )}
      </dialog>
    </section>
  )
}
