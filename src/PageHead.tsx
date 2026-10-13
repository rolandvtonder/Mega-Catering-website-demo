import type { ReactNode } from 'react'

/** The opening of an inner page: gold eyebrow, the page's h1, a short lead. */
export default function PageHead({ eyebrow, id, title, children }: { eyebrow: string; id: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div>
        <p className="label m-0 flex items-center gap-3 text-gold-soft">
          <span className="h-px w-10 bg-gold" aria-hidden="true" />
          {eyebrow}
        </p>
        <h1 id={id} className="display m-0 mt-4 text-[44px] sm:text-[68px]">
          {title}
        </h1>
      </div>
      {children && <p className="m-0 max-w-md text-[16px] leading-[26px] text-white/75">{children}</p>}
    </div>
  )
}
