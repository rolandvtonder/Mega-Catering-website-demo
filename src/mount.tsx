import { StrictMode, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import type { PageId } from './content'
import Layout from './Layout'
import './index.css'

/** Every page entry is one line: which page it is, and what goes in it. */
export function mount(page: PageId, content: ReactNode) {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Layout page={page}>{content}</Layout>
    </StrictMode>,
  )
}
