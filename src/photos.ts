/*
  Every image in /media is picked up automatically — drop a photo in the folder
  and it appears in the gallery on the next build. Nothing to register.

  Files starting with "_" are skipped, so a photo can be parked without being
  deleted. logo.png (the old photo avatar) is left out entirely; the brand
  mark is the vector logo in Logo.tsx.
*/

const files = import.meta.glob(['/media/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', '!/media/logo.png'], {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const byName = new Map(Object.entries(files).map(([path, url]) => [path.split('/').pop()!, url]))

/** Newest first: Facebook ids grow over time, so a numeric sort descending is upload order. */
export const GALLERY = [...byName.entries()]
  .filter(([name]) => !name.startsWith('_'))
  .sort(([a], [b]) => b.localeCompare(a, undefined, { numeric: true }))
  .map(([name, url]) => ({ name, url }))

/**
  Look a photo up by the start of its filename (the long Facebook names are
  unwieldy, the first block of digits is unique). Falls back to a gallery photo
  so a renamed or removed file never leaves a hole in the layout.
*/
export function pick(prefix: string, fallback = 0): string | undefined {
  for (const [name, url] of byName) if (name.startsWith(prefix)) return url
  return GALLERY[fallback % Math.max(GALLERY.length, 1)]?.url
}
