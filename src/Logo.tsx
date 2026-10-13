/*
  The Mega mark: a serif "M" in gold inside a double ring, with a small
  four-point spark above it for "we bring brightness". Vector, so it stays
  crisp from the 16px browser tab up to print. public/favicon.svg is the
  same drawing.
*/

const GOLD = '#d9b45a'

export default function Logo({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false" style={{ display: 'block', flexShrink: 0 }}>
      <circle cx="24" cy="24" r="23.25" fill="#0c0b09" stroke={GOLD} strokeWidth="1.5" />
      <circle cx="24" cy="24" r="19.75" fill="none" stroke={GOLD} strokeOpacity="0.4" strokeWidth="0.75" />
      <path d="M24 6.6l.9 2.4 2.4.9-2.4.9-.9 2.4-.9-2.4-2.4-.9 2.4-.9z" fill={GOLD} />
      <text
        x="24"
        y="34.2"
        textAnchor="middle"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontWeight="600"
        fontSize="25"
        fill={GOLD}
      >
        M
      </text>
    </svg>
  )
}
