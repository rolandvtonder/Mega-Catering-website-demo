import { HREF, SERVICES } from './content'
import { pick } from './photos'
import { ArrowUpRight } from './icons'

/*
  Where the home page's scroll story ends: one card per inner page, so the
  visitor always has a next step before the footer.
*/

const CARDS = [
  { href: HREF.services, t: ['Our', 'services'], d: 'Décor, catering, hire and kiddies parties.', src: SERVICES[0].src },
  { href: HREF.gallery, t: ['Recent', 'events'], d: 'Real setups from our team.', src: pick('503585433', 1) },
  { href: HREF.hire, t: ['Hire', 'catalogue'], d: 'Tents, seating, tables and tableware.', src: pick('502511641', 9) },
  { href: HREF.quote, t: ['Get a', 'quote'], d: 'Tell us about your day — we reply on WhatsApp.', src: pick('529448146', 8) },
]

export default function HomeNext() {
  return (
    <section aria-labelledby="next-title" className="bg-ink px-5 pb-24 pt-20 sm:px-10 sm:pt-28">
      <div className="mx-auto max-w-[1312px]">
        <h2 id="next-title" className="display m-0 text-[40px] sm:text-[56px]">
          Where to <em className="font-medium text-gold">next?</em>
        </h2>
        <ul className="m-0 mt-10 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((c) => (
            <li key={c.href}>
              <a href={c.href} className="tile group relative block aspect-[4/5] overflow-hidden rounded-[28px] bg-coal text-white no-underline sm:aspect-[3/4]">
                {c.src && <img src={c.src} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />}
                <span
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(180deg, rgba(10,9,7,0.2) 0%, rgba(10,9,7,0.35) 45%, rgba(10,9,7,0.9) 100%)' }}
                />
                <span aria-hidden="true" className="absolute inset-0 rounded-[28px] ring-1 ring-inset ring-white/20" />
                <span className="absolute right-5 top-5 grid size-12 place-items-center rounded-full border border-white/40 bg-white/15 backdrop-blur-md">
                  <ArrowUpRight size={20} />
                </span>
                <span className="absolute inset-x-6 bottom-6">
                  <span className="display block text-[34px] leading-none">
                    {c.t[0]} <em className="font-medium text-gold-soft">{c.t[1]}</em>
                  </span>
                  <span className="mt-2 block text-[15px] leading-6 text-white/80">{c.d}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
