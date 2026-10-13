/*
  Scroll choreography.

  Same model as the Marlin reference: the whole stage is one timeline and the
  scrollbar is the clock. The hero words keep the reference's stagger, written
  in milliseconds of a 20,000ms prototype so the cascade reads the same:

      We bring      t=0ms     300ms ease-out
      brightness    t=75ms    300ms
      to every…     t=150ms   300ms
      body l.1      t=200ms   ·  l.2  t=275ms  ·  l.3  t=350ms

  Those also play on a real clock when the page opens (INTRO_MS), so the hero
  is never blank before the first scroll.

  The three groups are a vertical filmstrip with parallax, as in the
  reference, but the holds are rebalanced for reading rather than looping:

      0.00 – 0.30   hero holds
      0.30 – 0.52   hero leaves, services arrive        (move1)
      0.52 – 0.66   services hold
      0.66 – 0.84   services leave, the about block arrives  (move2)
      0.84 – 1.00   about holds, then the page flows into the gallery
*/

export const TOTAL_MS = 20000
export const SCROLL_VH = 520
export const INTRO_MS = 1600

const at = (ms: number) => ms / TOTAL_MS

/** Phase windows as scroll progress. */
export const P = {
  word: [at(0), at(300)],
  word2: [at(75), at(375)],
  word3: [at(150), at(450)],
  body1: [at(200), at(500)],
  body2: [at(275), at(575)],
  body3: [at(350), at(650)],
  /* the glass card counts up over the reference's 2084ms SLOW smart-animate */
  stat: [at(200), at(2284)],
  move1: [0.3, 0.52],
  move2: [0.66, 0.84],
} as const

/** 0 before `a`, 1 after `b`, cubic-eased between. */
export function span(p: number, [a, b]: readonly [number, number]) {
  if (p <= a) return 0
  if (p >= b) return 1
  const t = (p - a) / (b - a)
  return 1 - Math.pow(1 - t, 3)
}

/** Linear ramp, for values that should track the scrollbar exactly. */
export function ramp(p: number, [a, b]: readonly [number, number]) {
  if (p <= a) return 0
  if (p >= b) return 1
  return (p - a) / (b - a)
}

/** Ramp with soft shoulders, for group travel — no jolt where a hold begins. */
export function glide(p: number, w: readonly [number, number]) {
  const t = ramp(p, w)
  return t * t * (3 - 2 * t)
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
