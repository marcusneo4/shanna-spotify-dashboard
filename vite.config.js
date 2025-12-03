import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  // For GitHub Pages: use repository name as base path
  // Set GITHUB_REPOSITORY_NAME environment variable or it defaults to 'shanna-spotify-dashboard'
  // For local dev, use '/' so data files load correctly
  const repoName = process.env.GITHUB_REPOSITORY_NAME || 'shanna-spotify-dashboard'
  const base = command === 'build' ? `/${repoName}/` : '/'
  
  return {
    plugins: [react()],
    base,
    server: {
      port: 3000,
      open: true
    }
  }
})
