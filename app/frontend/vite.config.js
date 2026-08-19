import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/v1': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/ws/v1/game': {
        target: 'ws://localhost:3001',
        rewrite: path => path.replace(/^\/ws/,''),
        ws: true,
        rewriteWsOrigin: true,
      }
    }
  }
})
