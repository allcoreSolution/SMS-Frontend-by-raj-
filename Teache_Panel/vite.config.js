import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 3000
  },
  server: {
    port: 5177,
    host: true,
    strictPort: true
  }
})
