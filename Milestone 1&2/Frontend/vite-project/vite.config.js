import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 1. Import Tailwind v4 for Vite

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 2. Add Tailwind to your plugins array
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8081', // Preserves your backend API proxy link
        changeOrigin: true,
        secure: false
      }
    }
  }
})