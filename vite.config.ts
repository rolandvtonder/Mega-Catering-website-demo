import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

/* A real multi-page site: every page is its own index.html in its own folder,
   so the URLs are clean (/gallery/) and work on any static host. */
const page = (p: string) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig(({ isSsrBuild }) => ({
  /* "/" locally; GitHub Pages serves a project site from /<repo>/ (set in the workflow) */
  base: process.env.BASE_PATH || '/',
  appType: 'mpa',
  plugins: [react(), tailwindcss()],
  build: isSsrBuild
    ? {}
    : {
        rollupOptions: {
          input: {
            home: page('./index.html'),
            services: page('./services/index.html'),
            about: page('./about/index.html'),
            gallery: page('./gallery/index.html'),
            hire: page('./hire/index.html'),
            quote: page('./quote/index.html'),
          },
        },
      },
}))
