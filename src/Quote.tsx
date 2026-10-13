import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { BRAND, EVENT_TYPES, HREF, SERVICES, SERVICE_LABEL, waLink } from './content'
import { quote, useQuote } from './quote-store'
import { Chat, Close, MapPin, Phone } from './icons'

/*
  Quote request. There is no server: on submit the details are written into a
  WhatsApp message to the business number and WhatsApp opens with it ready to
  send. Validation runs on blur and again on submit; a failed submit moves
  focus to a summary that links to each field.
*/

type Fields = {
  name: string
  phone: string
  type: string
  date: string
  guests: string
  venue: string
  notes: string
}

const EMPTY: Fields = { name: '', phone: '', type: '', date: '', guests: '', venue: '', notes: '' }

function validate(f: Fields): Partial<Record<keyof Fields, string>> {
  const e: Partial<Record<keyof Fields, string>> = {}
  if (!f.name.trim()) e.name = 'Please tell us your name.'
  const digits = f.phone.replace(/\D/g, '')
  if (!digits) e.phone = 'Add a number we can call or WhatsApp you on.'
  else if (digits.length < 9) e.phone = 'That number looks too short — include the area code, e.g. 076 818 0749.'
  if (!f.type) e.type = 'Choose the type of event.'
  if (!f.date) e.date = 'Pick your event date — an estimate is fine.'
  if (f.guests && !(Number(f.guests) > 0)) e.guests = 'Enter a number of guests, e.g. 120.'
  return e
}

const today = () => new Date().toISOString().slice(0, 10)

function Field({
  id,
  label,
  error,
  hint,
  required,
  children,
}: {
  id: string
  label: string
  error?: string
  hint?: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[14px] font-semibold text-white/90">
        {label}
        {required ? (
          <span className="text-gold" aria-hidden="true">
            {' '}
            *
          </span>
        ) : (
          <span className="font-normal text-white/50"> (optional)</span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="m-0 mt-1.5 text-[13px] text-white/55">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} className="m-0 mt-1.5 text-[13px] font-medium text-[#ffb4a2]">
          {error}
        </p>
      )}
    </div>
  )
}

const input =
  'block h-12 w-full rounded-xl border bg-white/[0.04] px-4 text-[16px] text-white outline-none transition-colors placeholder:text-white/35 focus:border-gold focus:bg-white/[0.07]'

export default function Quote() {
  const uid = useId()
  const id = (k: string) => `${uid}-${k}`
  const [f, setF] = useState<Fields>(EMPTY)
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [sentLink, setSentLink] = useState<string | null>(null)
  const summary = useRef<HTMLDivElement>(null)
  const { items, services } = useQuote()

  const errors = validate(f)
  const show = (k: keyof Fields) => (touched[k] || submitted ? errors[k] : undefined)
  const set = (k: keyof Fields) => (e: { target: { value: string } }) => setF((s) => ({ ...s, [k]: e.target.value }))
  const blur = (k: keyof Fields) => () => setTouched((t) => ({ ...t, [k]: true }))
  const a11y = (k: keyof Fields, hint = false) => ({
    id: id(k),
    'aria-invalid': show(k) ? true : undefined,
    'aria-describedby': show(k) ? `${id(k)}-err` : hint ? `${id(k)}-hint` : undefined,
    className: `${input} ${show(k) ? 'border-[#ffb4a2]' : 'border-white/15'}`,
  })

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    if (Object.keys(errors).length) {
      setAttempt((a) => a + 1)
      return
    }
    const date = new Date(f.date + 'T12:00:00').toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })
    const lines = [
      `Hi ${BRAND.name}! I'd like a quote please.`,
      '',
      `Name: ${f.name.trim()}`,
      `Phone: ${f.phone.trim()}`,
      `Event: ${f.type} on ${date}`,
      f.guests ? `Guests: ${f.guests}` : null,
      f.venue.trim() ? `Venue / area: ${f.venue.trim()}` : null,
      services.length ? `Services: ${services.map((s) => SERVICE_LABEL[s]).join(', ')}` : null,
      items.length ? `Hire items: ${items.join(', ')}` : null,
      f.notes.trim() ? `Notes: ${f.notes.trim()}` : null,
    ].filter((l) => l != null)
    const link = waLink(lines.join('\n'))
    setSentLink(link)
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  const errList = Object.entries(errors) as [keyof Fields, string][]

  /* after a failed submit, take focus to the summary once it has rendered */
  useEffect(() => {
    if (attempt) summary.current?.focus()
  }, [attempt])

  return (
    <section id="quote" aria-labelledby="quote-title" className="relative bg-ink px-5 pb-24 pt-14 sm:px-10 sm:pb-32 sm:pt-20">
      <div className="mx-auto grid max-w-[1312px] gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-20">
        {/* ---- the pitch and the direct lines ---- */}
        <div>
          <p className="label m-0 flex items-center gap-3 text-gold-soft">
            <span className="h-px w-10 bg-gold" aria-hidden="true" />
            Request a quote
          </p>
          <h1 id="quote-title" className="display m-0 mt-4 text-[44px] sm:text-[68px]">
            Let's plan <em className="font-medium text-gold">your day</em>
          </h1>
          <p className="m-0 mt-6 max-w-md text-[17px] leading-7 text-white/75">
            Tell us a little about your event and we'll come back with a quote that fits your budget. Sending the form opens
            WhatsApp with your details filled in. You just press send.
          </p>

          <ul className="m-0 mt-10 list-none space-y-3 p-0">
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

        {/* ---- the form ---- */}
        <form noValidate onSubmit={onSubmit} className="rounded-[28px] border border-white/10 bg-coal p-6 sm:p-10" aria-describedby={id('req')}>
          <p id={id('req')} className="m-0 mb-6 text-[13px] text-white/55">
            Fields marked <span className="text-gold">*</span> are required.
          </p>

          {submitted && errList.length > 0 && (
            <div ref={summary} tabIndex={-1} role="alert" className="mb-6 rounded-2xl border border-[#ffb4a2]/50 bg-[#ffb4a2]/10 p-5">
              <p className="m-0 font-semibold text-white">
                Please check {errList.length === 1 ? '1 field' : `${errList.length} fields`}:
              </p>
              <ul className="m-0 mt-2 pl-5 text-[14px] leading-6">
                {errList.map(([k, msg]) => (
                  <li key={k}>
                    <a href={`#${id(k)}`} className="text-[#ffd2c6] underline">
                      {msg}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <Field id={id('name')} label="Your name" required error={show('name')}>
              <input {...a11y('name')} type="text" autoComplete="name" value={f.name} onChange={set('name')} onBlur={blur('name')} />
            </Field>
            <Field id={id('phone')} label="Phone / WhatsApp" required error={show('phone')}>
              <input
                {...a11y('phone')}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="e.g. 076 818 0749"
                value={f.phone}
                onChange={set('phone')}
                onBlur={blur('phone')}
              />
            </Field>
            <Field id={id('type')} label="Type of event" required error={show('type')}>
              <select {...a11y('type')} value={f.type} onChange={set('type')} onBlur={blur('type')}>
                <option value="" disabled className="bg-coal">
                  Choose one…
                </option>
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t} className="bg-coal">
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field id={id('date')} label="Event date" required error={show('date')}>
              <input {...a11y('date')} type="date" min={today()} value={f.date} onChange={set('date')} onBlur={blur('date')} className={`${a11y('date').className} [color-scheme:dark]`} />
            </Field>
            <Field id={id('guests')} label="Number of guests" error={show('guests')}>
              <input
                {...a11y('guests')}
                type="number"
                inputMode="numeric"
                min={1}
                placeholder="e.g. 120"
                value={f.guests}
                onChange={set('guests')}
                onBlur={blur('guests')}
              />
            </Field>
            <Field id={id('venue')} label="Venue or area" error={show('venue')}>
              <input {...a11y('venue')} type="text" placeholder="e.g. Centurion, own garden" value={f.venue} onChange={set('venue')} onBlur={blur('venue')} />
            </Field>
          </div>

          <fieldset className="m-0 mt-6 border-0 p-0">
            <legend className="mb-3 p-0 text-[14px] font-semibold text-white/90">
              What do you need? <span className="font-normal text-white/50">(optional)</span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {SERVICES.map((s) => {
                const on = services.includes(s.id)
                return (
                  <button
                    key={s.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => quote.toggleService(s.id)}
                    className={
                      'inline-flex min-h-11 items-center rounded-full px-4 text-[14px] font-semibold transition-colors ' +
                      (on ? 'border border-gold bg-gold text-ink' : 'border border-white/20 bg-transparent text-white/85 hover:border-white/50')
                    }
                  >
                    {SERVICE_LABEL[s.id]}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <div className="mt-6">
            <p className="m-0 mb-3 text-[14px] font-semibold text-white/90">
              Hire items <span className="font-normal text-white/50">(from the catalogue)</span>
            </p>
            {items.length === 0 ? (
              <p className="m-0 text-[14px] text-white/55">
                None yet.{' '}
                <a href={HREF.hire} className="text-gold-soft underline">
                  Browse the hire catalogue
                </a>{' '}
                and tap Add, or just list what you need below.
              </p>
            ) : (
              <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                {items.map((it) => (
                  <li key={it}>
                    <button
                      type="button"
                      onClick={() => quote.toggleItem(it)}
                      aria-label={`Remove ${it}`}
                      className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/20 bg-white/5 py-1 pl-4 pr-2 text-[14px] text-white"
                    >
                      {it}
                      <span className="grid size-6 place-items-center rounded-full bg-white/10">
                        <Close size={13} />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-6">
            <Field id={id('notes')} label="Anything else?" error={show('notes')}>
              <textarea
                id={id('notes')}
                rows={4}
                value={f.notes}
                onChange={set('notes')}
                placeholder="Theme, colours, menu ideas, budget…"
                className="block w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-[16px] leading-6 text-white outline-none transition-colors placeholder:text-white/35 focus:border-gold focus:bg-white/[0.07]"
              />
            </Field>
          </div>

          <button type="submit" className="label btn-gold mt-8 inline-flex h-14 w-full items-center justify-center gap-3 rounded-full border-0 text-[13px]">
            <Chat size={18} /> Send via WhatsApp
          </button>

          <div aria-live="polite">
            {sentLink && (
              <p className="m-0 mt-4 text-center text-[14px] text-white/75">
                WhatsApp should have opened with your request. If it didn't,{' '}
                <a href={sentLink} target="_blank" rel="noopener noreferrer" className="text-gold-soft underline">
                  tap here to open it
                </a>{' '}
                or call {BRAND.phoneDisplay}.
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}
