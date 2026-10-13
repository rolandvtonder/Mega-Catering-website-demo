import { BRAND, HREF, SERVICE_LABEL, SERVICES, waLink } from './content'
import Logo from './Logo'
import { Chat, Facebook, MapPin, Phone } from './icons'

/*
  Footer, structured after the reference: a CTA band, a rule, the brand
  column beside the link columns, a legal bar, and the oversized wordmark
  fading out at the bottom. Ordinary flow, so a real responsive layout.
*/

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative bg-ink px-4 pb-6 sm:px-6">
      <div className="mx-auto max-w-[1312px] overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-b from-[#1c1913] to-[#100e0b] px-6 pb-2 pt-12 sm:px-14 sm:pt-14">
        {/* ---- CTA band ---- */}
        <div className="flex flex-wrap items-start gap-10">
          <div className="min-w-0 flex-[1_1_420px]">
            <span className="label inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-2 text-white/80">
              <span className="size-1.5 rounded-full bg-gold" aria-hidden="true" />
              Now booking
            </span>
            <h2 className="display m-0 mt-5 text-[40px] leading-[1.05] sm:text-[48px]">
              Let's make it <em className="font-medium text-gold-soft">memorable</em>
            </h2>
            <p className="m-0 mt-3 max-w-md text-[15px] leading-6 text-white/65">
              Weddings, birthdays, kiddies parties, memorials and corporate days, on any budget.
            </p>
          </div>
          <div className="flex flex-[0_1_380px] flex-wrap gap-3">
            <a
              href={waLink(`Hi ${BRAND.name}! I'd like to find out about your services.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="label btn-gold inline-flex h-13 min-h-12 flex-1 items-center justify-center gap-2 rounded-full px-6 no-underline"
            >
              <Chat size={17} /> WhatsApp
            </a>
            <a href={`tel:${BRAND.phoneTel}`} className="label btn-ghost inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full px-6 no-underline">
              <Phone size={17} /> Call us
            </a>
          </div>
        </div>

        <div className="my-10 h-px bg-white/10" />

        {/* ---- brand + link columns ---- */}
        <div className="flex flex-wrap gap-10">
          <div className="flex-[1_1_300px]">
            <div className="flex items-center gap-3">
              <Logo size={46} />
              <span className="display text-[24px]">{BRAND.name}</span>
            </div>
            <p className="m-0 mt-4 max-w-[300px] text-[14px] leading-[22px] text-white/60">
              We bring brightness to people's occasions. Big or small, we do it all.
            </p>
          </div>

          <nav aria-label="Services" className="flex-[0_1_180px]">
            <p className="label m-0 mb-4 text-white/50">Services</p>
            <ul className="m-0 list-none p-0">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <a
                    href={`${HREF.services}#${s.id}`}
                    className="inline-flex min-h-9 items-center text-[15px] text-white/80 no-underline hover:text-white"
                  >
                    {SERVICE_LABEL[s.id]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Explore" className="flex-[0_1_180px]">
            <p className="label m-0 mb-4 text-white/50">Explore</p>
            <ul className="m-0 list-none p-0">
              {(
                [
                  ['Home', HREF.home],
                  ['About us', HREF.about],
                  ['Gallery', HREF.gallery],
                  ['Hire catalogue', HREF.hire],
                  ['Get a quote', HREF.quote],
                ] as const
              ).map(([t, href]) => (
                <li key={t}>
                  <a href={href} className="inline-flex min-h-9 items-center text-[15px] text-white/80 no-underline hover:text-white">
                    {t}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex-[0_1_220px]">
            <p className="label m-0 mb-4 text-white/50">Contact</p>
            <ul className="m-0 list-none space-y-1 p-0 text-[15px] text-white/80">
              <li>
                <a href={`tel:${BRAND.phoneTel}`} className="inline-flex min-h-9 items-center gap-2 text-white/80 no-underline hover:text-white">
                  <Phone size={15} /> {BRAND.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={BRAND.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center gap-2 text-white/80 no-underline hover:text-white">
                  <Facebook size={15} /> Mega Hiring on Facebook
                </a>
              </li>
              <li className="flex min-h-9 items-center gap-2">
                <MapPin size={15} /> {BRAND.location}
              </li>
            </ul>
          </div>
        </div>

        {/* ---- legal bar ---- */}
        <div className="mt-10 flex flex-wrap justify-between gap-4 border-t border-white/10 pb-6 pt-5 text-[13px] text-white/50">
          <span>
            &#169; {year} {BRAND.name}. All rights reserved.
          </span>
          <span>Olievenhoutbosch · Centurion · Gauteng</span>
        </div>

        {/* ---- the wordmark, fading into the panel ---- */}
        <div
          aria-hidden="true"
          className="display select-none text-center"
          style={{
            fontSize: 'clamp(110px, 24vw, 330px)',
            lineHeight: 0.9,
            letterSpacing: '-0.02em',
            background: 'linear-gradient(180deg, rgba(217,180,90,0.42) 0%, rgba(217,180,90,0.02) 85%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            marginBottom: '-0.08em',
          }}
        >
          Mega
        </div>
      </div>
    </footer>
  )
}
