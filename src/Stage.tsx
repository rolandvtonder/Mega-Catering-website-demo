import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { useScroll, useMotionValueEvent, useReducedMotion } from 'motion/react'
import { SCROLL_VH, INTRO_MS, P, span, ramp, glide, lerp } from './scroll'
import { BRAND, HERO_PHOTOS, HREF, SERVICES, waLink } from './content'
import { ArrowRight, ArrowUpRight, Chat } from './icons'

/*
  The scroll stage — the Marlin layout model with Mega's photography.

  As in the reference, everything inside is drawn on a fixed artboard at its
  designed coordinates and then scaled as one piece, so the composition is
  exact. Two things differ, both on purpose:

  - There are two artboards. Desktop is 1440x810; phones get a 390x760
    portrait board with its own coordinates. Scaling the desktop board onto a
    390px phone shrinks 18px body copy to 5px, which nobody can read.
  - The board is fitted with `contain` and centred, not width-locked. The
    backgrounds (photos and scrims) are viewport layers, not part of the board,
    so contain never shows a bar — and nothing on the board is ever cropped
    under a phone's URL bar.

  The background is a set of event photos rather than footage: each owns a
  fifth of the scroll and drifts slowly (a scroll-driven Ken Burns), and
  neighbours cross-dissolve where they meet.
*/

type Layout = {
  W: number
  H: number
  SAFE: number
  g1: { start: number; end: number }
  g2: { enter: number; mid: number; end: number }
  g3: { enter: number; mid: number; end: number }
}

const DESK: Layout = {
  W: 1440,
  H: 810,
  SAFE: 96,
  g1: { start: 170, end: -820 },
  g2: { enter: 1000, mid: 122, end: -1100 },
  g3: { enter: 1400, mid: 900, end: 120 },
}

const MOB: Layout = {
  W: 390,
  H: 760,
  SAFE: 22,
  g1: { start: 100, end: -820 },
  g2: { enter: 900, mid: 100, end: -900 },
  g3: { enter: 1200, mid: 800, end: 140 },
}

const GOLD = '#d9b45a'
const INK = '10,9,7'

const px = (n: number) => `${n}px`
const box = (x: number, y: number, w?: number, h?: number): CSSProperties => ({
  position: 'absolute',
  left: px(x),
  top: px(y),
  ...(w != null ? { width: px(w) } : null),
  ...(h != null ? { height: px(h) } : null),
})

/** Reveals behind a clip mask, rising. */
function Mask({ t, children, style }: { t: number; children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ ...style, overflow: 'hidden' }}>
      <div style={{ height: '100%', transform: `translateY(${(1 - t) * 115}%)`, willChange: 'transform' }}>
        {children}
      </div>
    </div>
  )
}

/** Fits the right artboard into the sticky frame. */
function useFit(frame: React.RefObject<HTMLDivElement | null>) {
  const [fit, setFit] = useState({ mobile: false, scale: 1, x: 0, y: 0 })
  useLayoutEffect(() => {
    const el = frame.current
    if (!el) return
    const measure = () => {
      const vw = el.clientWidth
      const vh = el.clientHeight
      const mobile = vw < 760 || vw / vh < 0.8
      const L = mobile ? MOB : DESK
      const scale = Math.min(vw / L.W, vh / L.H)
      setFit({ mobile, scale, x: (vw - L.W * scale) / 2, y: (vh - L.H * scale) / 2 })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [frame])
  return fit
}

/** Plays the hero cascade on a real clock once, so the page never opens blank. */
function useIntro(still: boolean) {
  const [t, setT] = useState(still ? 1 : 0)
  useEffect(() => {
    if (still) {
      setT(1)
      return
    }
    let raf = 0
    const t0 = performance.now() + 150
    const tick = (now: number) => {
      const k = Math.max(0, Math.min(1, (now - t0) / INTRO_MS))
      setT(k)
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [still])
  return t
}

function Backdrop({ p, still }: { p: number; still: boolean }) {
  const n = HERO_PHOTOS.length
  const seg = 1 / n
  const X = 0.035
  return (
    <>
      {HERO_PHOTOS.map((ph, i) => {
        if (!ph.src) return null
        const fadeIn = i === 0 ? 1 : ramp(p, [i * seg - X, i * seg + X])
        const fadeOut = i === n - 1 ? 0 : ramp(p, [(i + 1) * seg - X, (i + 1) * seg + X])
        const o = fadeIn * (1 - fadeOut)
        const t = Math.max(-0.2, Math.min(1.2, (p - i * seg) / seg))
        const s = still ? 1.02 : 1.14 - 0.1 * t
        const dx = still ? 0 : (i % 2 ? 1 : -1) * (t - 0.5) * 2.4
        return (
          <img
            key={i}
            src={ph.src}
            alt=""
            decoding="async"
            fetchPriority={i === 0 ? 'high' : 'low'}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: o,
              visibility: o <= 0 ? 'hidden' : 'visible',
              transform: `translate3d(${dx}%,0,0) scale(${s})`,
              willChange: 'transform, opacity',
            }}
          />
        )
      })}
    </>
  )
}

function Tile({ s, w, h, mobile, t }: { s: (typeof SERVICES)[number]; w: number; h: number; mobile: boolean; t: number }) {
  const r = mobile ? 28 : 40
  return (
    <a
      href={`${HREF.services}#${s.id}`}
      className="tile"
      aria-label={`${s.title.join(' ')} — see what's included`}
      style={{
        position: 'absolute',
        inset: 0,
        display: 'block',
        width: px(w),
        height: px(h),
        opacity: t,
        color: '#fff',
        textDecoration: 'none',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, borderRadius: px(r), overflow: 'hidden', background: '#16140f' }}>
        {s.src && (
          <img
            src={s.src}
            alt=""
            loading="lazy"
            decoding="async"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
        {/* the label sits on a busy photo, so it gets its own ground */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(160deg, rgba(${INK},0.84) 0%, rgba(${INK},0.25) 52%, rgba(${INK},0.72) 100%)`,
          }}
        />
      </div>
      <div style={{ position: 'absolute', inset: 0, borderRadius: px(r), border: '1px solid rgba(255,255,255,0.26)', pointerEvents: 'none' }} />
      <div
        className="display"
        style={{
          position: 'absolute',
          left: px(mobile ? 16 : 24),
          top: px(mobile ? 16 : 24),
          fontSize: px(mobile ? 22 : 31),
          lineHeight: px(mobile ? 22 : 31),
        }}
      >
        {s.title[0]}
        <br />
        <em style={{ color: '#ecd59c' }}>{s.title[1]}</em>
      </div>
      <div
        style={{
          position: 'absolute',
          right: px(mobile ? 12 : 18),
          top: px(mobile ? 12 : 18),
          width: px(mobile ? 34 : 54),
          height: px(mobile ? 34 : 54),
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)',
          border: '1px solid rgba(255,255,255,0.4)',
          display: 'grid',
          placeItems: 'center',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      >
        <ArrowUpRight size={mobile ? 16 : 22} />
      </div>
      {!mobile && (
        <div
          style={{
            position: 'absolute',
            left: px(24),
            bottom: px(22),
            width: px(w - 48),
            fontSize: px(14),
            lineHeight: px(20),
            color: 'rgba(255,255,255,0.88)',
          }}
        >
          {s.blurb}
        </div>
      )}
    </a>
  )
}

export default function Stage() {
  const wrap = useRef<HTMLDivElement>(null)
  const frame = useRef<HTMLDivElement>(null)
  const [p, setP] = useState(0)
  const still = useReducedMotion() ?? false
  const { mobile, scale, x, y } = useFit(frame)
  const intro = useIntro(still)

  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', (v) => setP(v))

  const L = mobile ? MOB : DESK
  const GW = L.W - L.SAFE * 2

  /* the hero reads from whichever is further along: the opening clock or the scroll */
  const hp = Math.max(p, intro * P.stat[1])

  const m1 = glide(p, P.move1)
  const m2 = glide(p, P.move2)
  const y1 = lerp(L.g1.start, L.g1.end, m1)
  const y2 = lerp(lerp(L.g2.enter, L.g2.mid, m1), L.g2.end, m2)
  const y3 = lerp(lerp(L.g3.enter, L.g3.mid, m1), L.g3.end, m2)

  /* a group that is fully off the board leaves the tab order */
  const off1 = m1 > 0.95
  const off2 = m1 < 0.05 || m2 > 0.95
  const off3 = m2 < 0.05

  const stat = span(hp, P.stat)

  /* ---- per-board type and coordinates ---- */
  const H1 = mobile ? { size: 46, lh: 52, step: 48 } : { size: 96, lh: 100, step: 88 }
  const BODY = mobile
    ? { top: 166, step: 24, size: 16, lh: 22, w: GW, lines: ['Catering, décor & event hire from', 'Centurion. Weddings, birthdays, kiddies', 'parties & more — we do it all.'] }
    : {
        top: 300,
        step: 28,
        size: 18,
        lh: 26,
        w: 560,
        lines: [
          'Catering, décor and event hire from Centurion —',
          'weddings, birthdays, kiddies parties, memorials',
          'and corporate days. Big or small, we do it all.',
        ],
      }
  const BTN = mobile ? { top: 252, h: 48 } : { top: 412, h: 54 }
  const CARD = mobile ? { x: 0, y: 326, w: GW, h: 206, r: 32, pad: [22, 24] } : { x: GW - 440, y: 250, w: 440, h: 290, r: 48, pad: [36, 40] }

  const TILE = mobile ? { w: 166, h: 150 } : { w: 280, h: 230 }
  const tilePos = mobile
    ? [
        [0, 0],
        [GW - 166, 0],
        [0, 164],
        [GW - 166, 164],
      ]
    : [
        [0, 0],
        [GW - 280, 0],
        [130, 250],
        [GW - 410, 250],
      ]

  return (
    <section id="stage" aria-label="Welcome" ref={wrap} style={{ height: `${SCROLL_VH}vh`, background: '#0c0b09', position: 'relative' }}>
      <div ref={frame} className="stage-frame" style={{ position: 'sticky', top: 0, overflow: 'hidden' }}>
        {/* ---- viewport layers: photos and scrims span the window, not the board ---- */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(80% 70% at 70% 30%, #2a2316 0%, #0c0b09 70%)' }} />
        <Backdrop p={p} still={still} />
        <div style={{ position: 'absolute', inset: 0, background: `rgba(${INK},0.3)`, pointerEvents: 'none' }} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: mobile
              ? `linear-gradient(180deg, rgba(${INK},0.62) 0%, rgba(${INK},0.8) 55%, rgba(${INK},0.9) 100%)`
              : `linear-gradient(90deg, rgba(${INK},0.92) 0%, rgba(${INK},0.66) 38%, rgba(${INK},0.12) 72%)`,
            opacity: 1 - m1,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: mobile
              ? `rgba(${INK},0.7)`
              : `radial-gradient(72% 62% at 50% 64%, rgba(${INK},0.9) 0%, rgba(${INK},0.55) 60%, rgba(${INK},0.25) 100%)`,
            opacity: m1 * (1 - m2),
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: mobile
              ? `linear-gradient(180deg, rgba(${INK},0.55) 0%, rgba(${INK},0.88) 40%, rgba(${INK},0.95) 100%)`
              : `linear-gradient(180deg, rgba(${INK},0.1) 25%, rgba(${INK},0.84) 62%, rgba(${INK},0.94) 100%)`,
            opacity: m2,
            pointerEvents: 'none',
          }}
        />

        {/* ---- the artboard ---- */}
        <div
          style={{
            position: 'absolute',
            left: px(x),
            top: px(y),
            width: px(L.W),
            height: px(L.H),
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          {/* ================= GROUP 1 — the hero ================= */}
          <div inert={off1} style={{ ...box(L.SAFE, 0, GW, 640), transform: `translateY(${y1}px)`, willChange: 'transform' }}>
            <h1 style={{ margin: 0 }}>
              {['We bring', 'brightness', 'to every occasion'].map((w, i) => (
                <Mask
                  key={w}
                  t={span(hp, [P.word, P.word2, P.word3][i])}
                  style={{ position: 'absolute', left: 0, top: px(i * H1.step - 6), width: px(mobile ? GW : 820), height: px(H1.lh + 12) }}
                >
                  <span
                    className="display"
                    style={{
                      display: 'block',
                      fontSize: px(H1.size),
                      lineHeight: px(H1.lh),
                      ...(i === 1 ? { fontStyle: 'italic', color: GOLD, fontWeight: 500 } : null),
                    }}
                  >
                    {w}
                    {/* a trailing space so the heading reads as words, not "We bringbrightness" */}
                    {i < 2 && ' '}
                  </span>
                </Mask>
              ))}
            </h1>

            {BODY.lines.map((line, i) => (
              <Mask
                key={line}
                t={span(hp, [P.body1, P.body2, P.body3][i])}
                style={{ position: 'absolute', left: 0, top: px(BODY.top + i * BODY.step), width: px(BODY.w), height: px(BODY.lh + 6) }}
              >
                <p style={{ margin: 0, fontSize: px(BODY.size), lineHeight: px(BODY.lh), color: 'rgba(255,255,255,0.86)' }}>{line}</p>
              </Mask>
            ))}

            <div
              style={{
                position: 'absolute',
                left: 0,
                top: px(BTN.top),
                width: mobile ? px(GW) : undefined,
                opacity: span(hp, P.body3),
                display: 'flex',
                gap: px(mobile ? 10 : 14),
              }}
            >
              <a
                href={HREF.quote}
                className="label btn-gold"
                style={{
                  flex: mobile ? 1 : undefined,
                  height: px(BTN.h),
                  padding: `0 ${px(mobile ? 16 : 30)}`,
                  borderRadius: 999,
                  display: 'grid',
                  placeItems: 'center',
                  textDecoration: 'none',
                  fontSize: px(mobile ? 12 : 13),
                }}
              >
                {mobile ? 'Get a quote' : 'Request a quote'}
              </a>
              <a
                href={waLink(`Hi ${BRAND.name}! I'd like to find out about your services.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="label btn-ghost"
                style={{
                  flex: mobile ? 1 : undefined,
                  height: px(BTN.h),
                  padding: `0 ${px(mobile ? 8 : 10)} 0 ${px(mobile ? 18 : 24)}`,
                  borderRadius: 999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: px(12),
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  fontSize: px(mobile ? 12 : 13),
                }}
              >
                {mobile ? 'WhatsApp' : 'WhatsApp us'}
                <span
                  style={{
                    width: px(mobile ? 32 : 36),
                    height: px(mobile ? 32 : 36),
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.16)',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <Chat size={mobile ? 15 : 17} />
                </span>
              </a>
            </div>

            {/* the community card — the reference's telemetry card, carrying Mega's own numbers */}
            <a
              href={BRAND.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Mega Hiring on Facebook — ${BRAND.followers} thousand followers`}
              className="glass"
              style={{
                position: 'absolute',
                left: px(CARD.x),
                top: px(CARD.y),
                width: px(CARD.w),
                height: px(CARD.h),
                borderRadius: px(CARD.r),
                opacity: stat,
                transform: `translateY(${(1 - stat) * 28}px)`,
                color: '#fff',
                textDecoration: 'none',
              }}
            >
              <div style={{ position: 'absolute', inset: `${px(CARD.pad[0])} ${px(CARD.pad[1])}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div className="label" style={{ fontSize: px(11), color: 'rgba(255,255,255,0.72)' }}>
                      Follow our work
                    </div>
                    <div
                      className="display"
                      style={{ marginTop: px(mobile ? 8 : 12), fontSize: px(mobile ? 21 : 27), lineHeight: px(mobile ? 23 : 29), fontStyle: 'italic', fontWeight: 500 }}
                    >
                      Big or small,
                      <br />
                      we do it all.
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="display" style={{ fontSize: px(mobile ? 54 : 78), lineHeight: px(mobile ? 50 : 70), fontWeight: 500 }}>
                      {Math.round(BRAND.followers * stat)}
                      <span style={{ fontSize: px(mobile ? 30 : 42), color: GOLD }}>K+</span>
                    </div>
                    <div className="label" style={{ marginTop: px(6), fontSize: px(10.5), color: 'rgba(255,255,255,0.6)' }}>
                      on Facebook
                    </div>
                  </div>
                </div>

                <div style={{ position: 'absolute', left: 0, right: 0, top: px(mobile ? 92 : 132), height: 1, background: 'rgba(255,255,255,0.16)' }} />

                <div style={{ position: 'absolute', left: 0, right: 0, top: px(mobile ? 108 : 156), display: 'flex' }}>
                  {[
                    [String(Math.round(4 * stat)), 'Services'],
                    ['All', 'Budgets'],
                    ['Any', 'Event size'],
                  ].map(([v, k], i) => (
                    <div
                      key={k}
                      style={{ flex: 1, paddingLeft: i ? px(mobile ? 14 : 20) : 0, borderLeft: i ? '1px solid rgba(255,255,255,0.16)' : undefined }}
                    >
                      <div className="display" style={{ fontSize: px(mobile ? 26 : 34), lineHeight: 1, fontWeight: 600 }}>
                        {v}
                      </div>
                      <div className="label" style={{ marginTop: px(8), fontSize: px(10.5), color: 'rgba(255,255,255,0.62)' }}>
                        {k}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </a>
          </div>

          {/* ================= GROUP 2 — services ================= */}
          <div inert={off2} style={{ ...box(L.SAFE, 0, GW, 680), transform: `translateY(${y2}px)`, willChange: 'transform' }}>
            <h2 style={{ position: 'absolute', clip: 'rect(0 0 0 0)', width: 1, height: 1, overflow: 'hidden', margin: 0 }}>Our services</h2>
            {SERVICES.map((s, i) => {
              /* tiles land one after another as the group rises into place */
              const t = span(p, [P.move1[0] + 0.06 + i * 0.02, P.move1[1] - 0.04 + i * 0.01])
              return (
                <div key={s.id} style={{ ...box(tilePos[i][0], tilePos[i][1], TILE.w, TILE.h) }}>
                  <Tile s={s} w={TILE.w} h={TILE.h} mobile={mobile} t={t} />
                </div>
              )
            })}

            <div
              className="display"
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: 0,
                width: px(GW),
                top: px(mobile ? 334 : 505),
                fontSize: px(mobile ? 42 : 84),
                lineHeight: px(mobile ? 44 : 84),
                textAlign: 'center',
              }}
            >
              Big or small,{mobile ? <br /> : ' '}
              <em style={{ color: GOLD, fontWeight: 500 }}>we do it all</em>
            </div>
            <p
              style={{
                position: 'absolute',
                left: px(mobile ? 0 : (GW - 680) / 2),
                top: px(mobile ? 436 : 604),
                width: px(mobile ? GW : 680),
                margin: 0,
                fontSize: px(mobile ? 16 : 21),
                lineHeight: px(mobile ? 24 : 32),
                textAlign: 'center',
                color: 'rgba(255,255,255,0.86)',
              }}
            >
              {mobile
                ? 'Food, tables, tents and the finishing touches. Tap a service to see more.'
                : 'One call covers the food, the tables, the tent and the finishing touches. Tap a service to see what it includes.'}
            </p>
          </div>

          {/* ================= GROUP 3 — about ================= */}
          <div inert={off3} style={{ ...box(L.SAFE, 0, GW, 810), transform: `translateY(${y3}px)`, willChange: 'transform' }}>
            {(() => {
              const top = mobile ? 0 : 372
              return (
                <>
                  <div style={{ position: 'absolute', left: 0, top: px(top + 8), width: px(48), height: px(2), background: GOLD }} />
                  <div className="label" style={{ position: 'absolute', left: px(64), top: px(top), color: '#ecd59c' }}>
                    About Mega
                  </div>
                  <h2
                    className="display"
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: px(top + (mobile ? 30 : 34)),
                      width: px(mobile ? GW : 620),
                      margin: 0,
                      fontSize: px(mobile ? 40 : 64),
                      lineHeight: px(mobile ? 42 : 64),
                    }}
                  >
                    Styled with care, <em style={{ color: GOLD, fontWeight: 500 }}>served with heart.</em>
                  </h2>
                  <p
                    style={{
                      position: 'absolute',
                      left: px(mobile ? 0 : GW - 470),
                      top: px(mobile ? top + 176 : top + 38),
                      width: px(mobile ? GW : 470),
                      margin: 0,
                      fontSize: px(mobile ? 16 : 17),
                      lineHeight: px(mobile ? 26 : 28),
                      color: 'rgba(255,255,255,0.84)',
                    }}
                  >
                    Based in {BRAND.location}, we bring brightness to people's occasions — intimate birthdays, kiddies
                    parties, weddings and corporate days. Whatever the size and whatever the budget, we'll put together the
                    décor, food and hire you need.
                  </p>
                  <a
                    href={HREF.gallery}
                    className="label"
                    style={{
                      position: 'absolute',
                      left: px(mobile ? 0 : GW - 470),
                      top: px(mobile ? top + 400 : top + 236),
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: px(10),
                      minHeight: px(44),
                      color: '#fff',
                      textDecoration: 'none',
                      borderBottom: `1px solid ${GOLD}`,
                    }}
                  >
                    See recent events <ArrowRight size={16} />
                  </a>
                </>
              )
            })()}
          </div>
        </div>
      </div>
    </section>
  )
}
