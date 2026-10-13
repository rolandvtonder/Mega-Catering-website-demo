import { HREF, SERVICES } from './content'
import { quote } from './quote-store'
import PageHead from './PageHead'
import { ArrowRight, Check } from './icons'

/*
  The services page: the four tiles from the home stage, opened up. Each
  service is a row — photo on one side, what it is and what it includes on the
  other — alternating sides down the page. The tiles on the home page link
  straight to their row (/services/#decor).
*/

export default function Services() {
  return (
    <section aria-labelledby="services-title" className="bg-ink px-5 pb-24 pt-14 sm:px-10 sm:pb-32 sm:pt-20">
      <div className="mx-auto max-w-[1312px]">
        <PageHead eyebrow="Services" id="services-title" title={<>What we <em className="font-medium text-gold">do</em></>}>
          Book one service, or let us handle the whole day. Food, décor and hire from one team, so nothing falls between
          suppliers.
        </PageHead>

        <nav aria-label="Jump to a service" className="mt-10">
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {SERVICES.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-white/20 px-4 text-[14px] font-semibold text-white/85 no-underline transition-colors hover:border-gold/70 hover:text-white"
                >
                  {s.title.join(' ')}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="m-0 mt-14 list-none p-0">
          {SERVICES.map((s, i) => (
            <li
              key={s.id}
              id={s.id}
              className="grid scroll-mt-28 items-center gap-8 border-t border-white/10 py-14 sm:py-20 lg:grid-cols-2 lg:gap-16"
            >
              <div className={'overflow-hidden rounded-[32px] bg-coal ' + (i % 2 ? 'lg:order-2' : '')}>
                {s.photo && (
                  <img src={s.photo} alt={s.photoAlt} loading={i ? 'lazy' : 'eager'} decoding="async" className="aspect-[4/3] w-full object-cover" />
                )}
              </div>

              <div>
                <h2 className="display m-0 text-[42px] sm:text-[58px]">
                  {s.title[0]} <em className="font-medium text-gold">{s.title[1]}</em>
                </h2>
                <p className="m-0 mt-5 max-w-xl text-[17px] leading-7 text-white/80">{s.details}</p>

                <h3 className="label m-0 mt-8 text-white/55">Includes</h3>
                <ul className="m-0 mt-3 grid list-none gap-x-6 p-0 sm:grid-cols-2">
                  {s.includes.map((it) => (
                    <li key={it} className="flex min-h-10 items-center gap-3 text-[15px] text-white/90">
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
                        <Check size={14} />
                      </span>
                      {it}
                    </li>
                  ))}
                </ul>

                <div className="mt-9 flex flex-wrap gap-3">
                  <a
                    href={HREF.quote}
                    onClick={() => quote.addService(s.id)}
                    className="label btn-gold inline-flex h-12 items-center rounded-full px-7 no-underline"
                  >
                    Get a quote
                  </a>
                  {s.more.href !== HREF.quote && (
                    <a href={s.more.href} className="label btn-ghost inline-flex h-12 items-center gap-2 rounded-full px-6 no-underline">
                      {s.more.label} <ArrowRight size={16} />
                    </a>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
