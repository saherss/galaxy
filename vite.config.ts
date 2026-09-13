import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'

// Vite config — https://vitejs.dev/config/
export default defineConfig({
  // GitHub Pages serves a project site from /<repo>/, so assets need that
  // prefix. BASE_PATH is set by .github/workflows/deploy.yml; local dev and
  // plain builds fall back to the root.
  base: process.env.BASE_PATH || '/',
  build: {
    rollupOptions: {
      input: {
        // Two pages: the public menu, and the staff-only price editor.
        main: path.resolve(import.meta.dirname, 'index.html'),
        admin: path.resolve(import.meta.dirname, 'admin.html'),
      },
    },
  },
  plugins: [react(), tailwindcss(), menuJsonLd()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '8443'),
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '8443'),
  },
})

/**
 * Fill the JSON-LD section list in index.html from src/menu.json. Sections are
 * added and renamed through the data file, and the admin page republishes on
 * every save, so a hand-kept copy in the HTML goes stale; this one rebuilds
 * with the menu. Only sections that have drinks are listed.
 */
function menuJsonLd(): Plugin {
  const TOKEN = '"%MENU_SECTIONS%"'
  return {
    name: 'menu-json-ld',
    transformIndexHtml(html) {
      if (!html.includes(TOKEN)) return html
      const file = path.resolve(import.meta.dirname, 'src/menu.json')
      const menu = JSON.parse(fs.readFileSync(file, 'utf8')) as {
        sections: { id: number; name: { ar: string }; group?: { ar: string }; items: unknown[] }[]
      }
      const priced = [...menu.sections].sort((a, b) => a.id - b.id).filter((s) => s.items.length > 0)

      // Sections sharing a `group` (ريد بول / تويست / فيوري under مشروبات
      // الطاقة) nest under one parent MenuSection, matching the shared page
      // heading on the printed menu instead of listing as three flat peers.
      const sections: unknown[] = []
      const nested = new Map<string, { '@type': string; name: string; hasMenuSection: unknown[] }>()
      for (const s of priced) {
        if (!s.group) { sections.push({ '@type': 'MenuSection', name: s.name.ar }); continue }
        let parent = nested.get(s.group.ar)
        if (!parent) {
          parent = { '@type': 'MenuSection', name: s.group.ar, hasMenuSection: [] }
          nested.set(s.group.ar, parent)
          sections.push(parent)
        }
        parent.hasMenuSection.push({ '@type': 'MenuSection', name: s.name.ar })
      }
      return html.replace(TOKEN, JSON.stringify(sections))
    },
  }
}
