import { copyFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages has no SPA rewrites: serving index.html as 404.html lets deep links like /proyectos/x load the app.
const spaFallback = () => ({
  name: 'spa-fallback',
  apply: 'build',
  async closeBundle() {
    const dist = resolve(import.meta.dirname, 'dist')
    await copyFile(resolve(dist, 'index.html'), resolve(dist, '404.html'))
  },
})

export default defineConfig({
  plugins: [react(), spaFallback()],
})
