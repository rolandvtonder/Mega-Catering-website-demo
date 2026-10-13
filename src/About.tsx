import { BRAND, HREF, waLink } from './content'
import { pick } from './photos'
import PageHead from './PageHead'
import { ArrowRight, Chat, Facebook, MapPin, Phone } from './icons'

/*
  The about page: who Mega are, in their own words from Facebook ("we bring
  brightness… big or small we do it all… all budgets"), a collage of their
  work, what they stand for, and where to find them.
*/

const COLLAGE = [
  { src: pick('498682625', 0), alt: 'Royal blue velvet chairs with gold rims at a long table under a white marquee' },
  { src: pick('491267155', 3), alt: 'Black and gold table setting with a balloon arch' },
  { src: pick('530631614', 11), alt: 'Long banquet table with cross-back chairs and centrepieces' },
]

const VALUES = [
  {
    t: ['Any', 'budget'],
    d: "Tell us what you have to spend and we'll make it work. We'd rather shape a beautiful day around your budget than talk you out of one.",
  },
  {
    t: ['Big or', 'small'],
    d: 'An intimate birthday lunch or a wedding marquee for hundreds gets the same care, from the first call to the last plate cleared.',
  },
  {
    t: ['One', 'team'],
    d: 'Catering, décor and hire under one roof, so the food, the furniture and the finishing touches all arrive on the same page.',
  },
]

export default function About() {
  return (
    <>
      <section aria-labelledby="about-title" className="bg-ink px-5 pb-20 pt-14 sm:px-10 sm:pt-20">
        <div className="mx-auto max-w-[1312px]">
          <PageHead
            eyebrow="About Mega"
            id="about-title"
            title={
              <>
                Styled with care, <em className="font-medium text-gold">served with heart.</em>
              </>
            }
          />

          <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <ul className="m-0 grid list-none auto-rows-[160px] grid-cols-2 gap-3 p-0 sm:auto-rows-[220px] sm:gap-4">
              {COLLAGE.map((c, i) => (
                <li key={i} className={'overflow-hidden rounded-[26px] bg-coal ' + (i === 0 ? 'row-span-2' : '')}>
                  {c.src && <img src={c.src} alt={c.alt} decoding="async" className="size-full object-cover" />}
                </li>
              ))}
            </ul>

            <div className="flex flex-col justify-center">
              <p className="display m-0 text-[28px] font-medium italic leading-[1.2] text-gold-soft sm:text-[34px]">
                "We bring brightness to people's occasions. Big or small, we do it all."
              </p>
              <p className="m-0 mt-6 text-[17px] leading-7 text-white/80">
                Mega Catering & Decor Hire is based in {BRAND.location}. We style and cater weddings, birthdays, kiddies
                parties, baby showers, memorials and corporate days, and hire out everything from tents and chairs to
                cutlery and linen.
              </p>
              <p className="m-0 mt-4 text-[17px] leading-7 text-white/80">
                Whatever the size and whatever the budget, we'll put together the décor, food and hire you need.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={HREF.gallery} className="label btn-ghost inline-flex h-12 items-center gap-2 rounded-full px-6 no-underline">
                  See our work <ArrowRight size={16} />
                </a>
                <a href={HREF.services} className="label inline-flex h-12 items-center gap-2 rounded-full px-4 text-white/80 no-underline hover:text-white">
                  Our services <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="values-title" className="bg-coal px-5 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto max-w-[1312px]">
          <h2 id="values-title" className="display m-0 text-[38px] sm:text-[52px]">
            What we <em className="font-medium text-gold">stand for</em>
          </h2>
          <ul className="m-0 mt-10 grid list-none gap-5 p-0 md:grid-cols-3">
            {VALUES.map((v) => (
              <li key={v.t.join(' ')} className="rounded-[28px] border border-white/10 bg-ink p-8">
                <h3 className="display m-0 text-[36px]">
                  {v.t[0]} <em className="font-medium text-gold">{v.t[1]}</em>
                </h3>
                <p className="m-0 mt-4 text-[16px] leading-[26px] text-white/75">{v.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="find-title" className="bg-ink px-5 py-20 sm:px-10 sm:py-28">
        <div className="mx-auto grid max-w-[1312px] items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 id="find-title" className="display m-0 text-[38px] sm:text-[52px]">
              Where to <em className="font-medium text-gold">find us</em>
            </h2>
            <p className="m-0 mt-4 max-w-md text-[16px] leading-[26px] text-white/75">
              The quickest way to reach us is WhatsApp. Send a message any time and we'll get back to you.
            </p>
          </div>
          <ul className="m-0 grid list-none gap-3 p-0">
            <li>
              <a
                href={waLink(`Hi ${BRAND.name}! I'd like to find out about your services.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-16 items-center gap-4 rounded-2xl border border-white/10 px-5 text-white no-underline transition-colors hover:border-gold/60"
              >
                <span className="grid size-10 place-items-center rounded-full bg-gold text-ink">
                  <Chat size={18} />
                </span>
                <span>
                  <span className="label block text-[11px] text-white/55">WhatsApp</span>
                  <span className="text-[17px] font-semibold">{BRAND.phoneDisplay}</span>
                </span>
              </a>
            </li>
            <li>
              <a
                href={`tel:${BRAND.phoneTel}`}
                className="flex min-h-16 items-center gap-4 rounded-2xl border border-white/10 px-5 text-white no-underline transition-colors hover:border-gold/60"
              >
                <span className="grid size-10 place-items-center rounded-full border border-white/25 text-gold-soft">
                  <Phone size={18} />
                </span>
                <span>
                  <span className="label block text-[11px] text-white/55">Call us</span>
                  <span className="text-[17px] font-semibold">{BRAND.phoneDisplay}</span>
                </span>
              </a>
            </li>
            <li>
              <a
                href={BRAND.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-16 items-center gap-4 rounded-2xl border border-white/10 px-5 text-white no-underline transition-colors hover:border-gold/60"
              >
                <span className="grid size-10 place-items-center rounded-full border border-white/25 text-gold-soft">
                  <Facebook size={18} />
                </span>
                <span>
                  <span className="label block text-[11px] text-white/55">Facebook</span>
                  <span className="text-[17px] font-semibold">Mega Hiring · {BRAND.followers}K followers</span>
                </span>
              </a>
            </li>
            <li className="flex min-h-16 items-center gap-4 rounded-2xl border border-white/10 px-5">
              <span className="grid size-10 place-items-center rounded-full border border-white/25 text-gold-soft">
                <MapPin size={18} />
              </span>
              <span>
                <span className="label block text-[11px] text-white/55">Based in</span>
                <span className="text-[17px] font-semibold">{BRAND.location}</span>
              </span>
            </li>
          </ul>
        </div>
      </section>
    </>
  )
}
