import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  // Only use base path for production builds (GitHub Pages)
  // For local dev (serve command), use '/' so data files load correctly
  const base = command === 'build' ? '/shanna-spotify-dashboard/' : '/'
  
  return {
    plugins: [react()],
    base,
    server: {
      port: 3000,
      open: true
    }
  }
})
