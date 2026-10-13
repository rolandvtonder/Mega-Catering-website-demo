import { useEffect, useRef, useState } from 'react'
import { HIRE, HREF } from './content'
import { quote, useQuote } from './quote-store'
import { ArrowRight, Check, Plus } from './icons'

/*
  The hire catalogue. No prices by design — each item toggles onto a quote
  list that rides along into the WhatsApp request, so a visitor can browse,
  tick what they need and send it in one go.
*/

export default function Hire() {
  const { items } = useQuote()
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)
  const show = items.length > 0 && inView

  /* the pill only rides along while the catalogue is on screen, never over the form */
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '0px 0px -40% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section ref={ref} id="hire" aria-labelledby="hire-title" className="relative bg-ink px-5 pb-24 pt-14 sm:px-10 sm:pb-32 sm:pt-20">
      <div className="mx-auto max-w-[1312px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label m-0 flex items-center gap-3 text-gold-soft">
              <span className="h-px w-10 bg-gold" aria-hidden="true" />
              Hire catalogue
            </p>
            <h1 id="hire-title" className="display m-0 mt-4 text-[44px] sm:text-[68px]">
              Everything for <em className="font-medium text-gold">the day</em>
            </h1>
          </div>
          <p className="m-0 max-w-md text-[16px] leading-[26px] text-white/75">
            Tap <span className="text-white">Add</span> on anything you need. We'll come back with a quote for your date,
            guest count and venue.
          </p>
        </div>

        <ul className="m-0 mt-12 grid list-none gap-5 p-0 md:grid-cols-2 xl:grid-cols-3">
          {HIRE.map((c) => (
            <li key={c.id} className="flex flex-col overflow-hidden rounded-[28px] border border-white/10 bg-coal">
              <div className="relative aspect-[16/10] overflow-hidden bg-ash">
                {c.src && <img src={c.src} alt={c.alt} loading="lazy" decoding="async" className="size-full object-cover" />}
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-coal via-coal/20 to-transparent" />
                <h2 className="display absolute bottom-4 left-6 m-0 text-[32px]">{c.name}</h2>
              </div>
              <div className="flex flex-1 flex-col p-6 pt-4">
                <p className="m-0 text-[15px] leading-6 text-white/70">{c.note}</p>
                <ul className="m-0 mt-4 list-none p-0" aria-label={`${c.name} items`}>
                  {c.items.map((it) => {
                    const on = items.includes(it)
                    return (
                      <li key={it} className="flex min-h-12 items-center justify-between gap-4 border-t border-white/10">
                        <span className="text-[15px] text-white/90">{it}</span>
                        <button
                          type="button"
                          aria-pressed={on}
                          aria-label={`${on ? 'Remove' : 'Add'} ${it} ${on ? 'from' : 'to'} quote`}
                          onClick={() => quote.toggleItem(it)}
                          className={
                            'label inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[11px] transition-colors ' +
                            (on ? 'border border-gold bg-gold text-ink' : 'border border-white/25 bg-transparent text-white/85 hover:border-white/60')
                          }
                        >
                          {on ? <Check size={14} /> : <Plus size={14} />}
                          {on ? 'Added' : 'Add'}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </li>
          ))}
        </ul>

        <p className="m-0 mt-8 text-[14px] text-white/60">
          Don't see what you need? Just ask in your quote request.
        </p>
      </div>

      {/* the quote list, floating once something is on it */}
      <div
        className={
          'pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 transition-all duration-300 ' +
          (show ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0')
        }
        aria-hidden={!show}
      >
        <a
          href={HREF.quote}
          tabIndex={show ? 0 : -1}
          className="label btn-gold pointer-events-auto inline-flex h-14 items-center gap-3 rounded-full px-6 no-underline shadow-[0_18px_40px_-12px_rgba(0,0,0,0.8)]"
        >
          <span className="grid size-7 place-items-center rounded-full bg-ink text-[12px] tracking-normal text-gold">{items.length}</span>
          {items.length === 1 ? 'item' : 'items'} on your quote list — continue
          <ArrowRight size={16} />
        </a>
      </div>
    </section>
  )
}
