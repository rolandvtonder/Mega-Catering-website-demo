import { pick } from './photos'

/*
  All of the business copy lives here, so prices, items and wording can be
  changed without touching a layout file.
*/

export const BRAND = {
  name: 'Mega Catering & Decor Hire',
  short: 'Mega',
  phoneDisplay: '076 818 0749',
  phoneTel: '+27768180749',
  phoneWa: '27768180749',
  location: 'Olievenhoutbosch, Centurion',
  facebook: 'https://www.facebook.com/p/Mega-Hiring-100063774859505/',
  followers: 10,
}

/*
  Every page on the site. Trailing slashes matter: each page is a folder.
  BASE_URL is "/" normally and "/<repo>/" on GitHub Pages, so links work in both.
*/
const B = import.meta.env.BASE_URL

export const HREF = {
  home: B,
  services: `${B}services/`,
  about: `${B}about/`,
  gallery: `${B}gallery/`,
  hire: `${B}hire/`,
  quote: `${B}quote/`,
} as const

export type PageId = keyof typeof HREF

export const waLink = (text?: string) =>
  `https://wa.me/${BRAND.phoneWa}${text ? `?text=${encodeURIComponent(text)}` : ''}`

/* The five scenes behind the scroll story, each owning a fifth of the scroll. */
export const HERO_PHOTOS = [
  { src: pick('498682625', 0), alt: 'Royal blue velvet chairs with gold rims at a long table under a white marquee' },
  { src: pick('503585433', 1), alt: 'White table with ribbed glassware, pink satin napkins and fresh flowers' },
  { src: pick('713004248', 2), alt: 'Catering buffet of canapés and fruit skewers on gold stands' },
  { src: pick('528222713', 3), alt: 'White stretch tents set up on a lawn' },
  { src: pick('508111813', 4), alt: 'Long table styled in terracotta with candles and dried flowers' },
]

export type ServiceId = 'decor' | 'catering' | 'hire' | 'kiddies'

type Service = {
  id: ServiceId
  title: [string, string]
  blurb: string
  src?: string
  alt: string
  /* the services page */
  photo?: string
  photoAlt: string
  details: string
  includes: string[]
  more: { label: string; href: string }
}

/*
  The longer descriptions and "includes" lists on the services page are a
  first draft written from the photos — check them against what Mega really
  offers.
*/
export const SERVICES: Service[] = [
  {
    id: 'decor',
    title: ['Wedding', '& Décor'],
    blurb: 'Draping, centrepieces, backdrops and full table styling.',
    src: pick('490412941', 5),
    alt: 'Black and gold table setting under a draped tent',
    photo: pick('503585433', 1),
    photoAlt: 'White table with ribbed glassware, pink satin napkins and fresh flowers',
    details:
      'Tell us your colours and your theme and we style the whole room around them — from the welcome backdrop to the last napkin fold. Weddings, engagements, birthdays, baby showers, memorials and corporate functions.',
    includes: ['Table styling & place settings', 'Draping & ceiling liners', 'Backdrops, arches & welcome signs', 'Centrepieces & flowers', 'Red carpet & stanchions'],
    more: { label: 'See our work', href: HREF.gallery },
  },
  {
    id: 'catering',
    title: ['Event', 'Catering'],
    blurb: 'Canapés, buffets and platters, served with care.',
    src: pick('709883051', 6),
    alt: 'Canapés, fruit skewers and glasses of juice on a buffet table',
    photo: pick('713004248', 2),
    photoAlt: 'Catering buffet of canapés and fruit skewers on gold stands',
    details:
      'Food that looks as good as the table it sits on. From canapés and fruit skewers to full buffets, we plan a menu around your guest count and your budget, and present it on proper stands and platters.',
    includes: ['Canapés & finger food', 'Buffets & platters', 'Fruit & dessert tables', 'Welcome drinks', 'Serving staff on request'],
    more: { label: 'Ask about menus', href: HREF.quote },
  },
  {
    id: 'hire',
    title: ['Equipment', 'Hire'],
    blurb: 'Tents, chairs, tables, linen, crockery and cutlery.',
    src: pick('498147248', 7),
    alt: 'White aisle lined with blue chairs on a lawn',
    photo: pick('528222713', 3),
    photoAlt: 'White stretch tents set up on a lawn',
    details:
      'Everything you need to host, whether you style it yourself or let us do it. Pick from tents, seating, tables, tableware and linen — tick what you need in the catalogue and we come back with a quote.',
    includes: ['Stretch, frame & clear-top tents', 'Chairs, couches & tables', 'Crockery, cutlery & glassware', 'Tablecloths, runners & napkins', 'Lighting & décor pieces'],
    more: { label: 'Browse the catalogue', href: HREF.hire },
  },
  {
    id: 'kiddies',
    title: ['Kiddies', 'Parties'],
    blurb: 'Themed backdrops, balloons and little tables and chairs.',
    src: pick('529448146', 8),
    alt: 'Pink and peach balloon garland over a kids party lounge',
    photo: pick('530360418', 15),
    photoAlt: 'Blue and pink balloons over a kids party lounge',
    details:
      'Big colour for little people. Pick a theme and we bring it to life with balloon garlands, a photo backdrop, kid-sized tables and chairs and a cake table worth remembering.',
    includes: ['Themed backdrops', 'Balloon garlands & arches', 'Kids tables & chairs', 'Cake & sweetie tables', 'Throne chairs for the birthday star'],
    more: { label: 'See party setups', href: HREF.gallery },
  },
]

export const SERVICE_LABEL: Record<ServiceId, string> = {
  decor: 'Wedding & décor',
  catering: 'Catering',
  hire: 'Equipment hire',
  kiddies: 'Kiddies party',
}

/*
  The hire catalogue. No prices — every item is "ask for a quote". Edit the
  lists freely; anything ticked is carried into the WhatsApp quote request.
*/
export const HIRE: { id: string; name: string; note: string; src?: string; alt: string; items: string[] }[] = [
  {
    id: 'tents',
    name: 'Tents & Marquees',
    note: 'Cover for the garden, the yard or the open field.',
    src: pick('502511641', 9),
    alt: 'Clear-top marquee from above',
    items: ['Stretch tents', 'Frame marquees', 'Clear-top marquees', 'Ceiling liners & draping', 'Fairy & festoon lights'],
  },
  {
    id: 'seating',
    name: 'Seating & Lounge',
    note: 'From banquet rows to a relaxed lounge corner.',
    src: pick('493274253', 10),
    alt: 'Outdoor lounge setup with couches and a coffee table',
    items: ['Royal velvet chairs', 'Tiffany chairs', 'Cross-back chairs', 'Throne chairs', 'Couches & ottomans', 'Kids chairs'],
  },
  {
    id: 'tables',
    name: 'Tables',
    note: 'Long, round, cocktail and kids sizes.',
    src: pick('530631614', 11),
    alt: 'Long banquet table with cross-back chairs',
    items: ['Long banquet tables', 'Round tables', 'Cocktail tables', 'Kids tables', 'Cake & gift tables'],
  },
  {
    id: 'tableware',
    name: 'Tableware',
    note: 'Everything that sits on the table.',
    src: pick('491350933', 12),
    alt: 'Black plate with gold cutlery and a gold-rimmed charger',
    items: ['Charger plates', 'Dinner & side plates', 'Gold cutlery', 'Glassware', 'Cake stands & platters'],
  },
  {
    id: 'linen',
    name: 'Linen & Draping',
    note: 'The fabric that pulls a colour scheme together.',
    src: pick('529959739', 13),
    alt: 'Gold sequin tablecloth with white chairs',
    items: ['Tablecloths', 'Table runners', 'Satin & linen napkins', 'Chair covers & sashes', 'Wall & backdrop draping'],
  },
  {
    id: 'decor',
    name: 'Décor & Backdrops',
    note: 'The finishing touches people take photos of.',
    src: pick('490955563', 14),
    alt: 'Black and gold backdrop with a throne chair and red carpet',
    items: ['Backdrops & arches', 'Balloon garlands', 'Centrepieces & flowers', 'Red carpet & stanchions', 'Candle holders'],
  },
]

export const EVENT_TYPES = [
  'Wedding',
  'Birthday',
  'Kiddies party',
  'Baby shower',
  'Corporate function',
  'Memorial / funeral',
  'Graduation',
  'Other',
]
