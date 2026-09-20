import { defineConfig } from 'vite'
import { parse } from 'cookie'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
  
const protectedPlugin = () => ({
  name: 'token_check_before_protected',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url === '/home' || req.url === '/game-settings'
          || req.url === '/lobby' || req.url === '/waiting-room'
          || /^\/game\//.test(req.url) || /^\/waiting\//.test(req.url)
          || req.url === '/game/:matchId' || req.url === '/waiting/:'
          || req.url === '/replay' || req.url === '/waiting-room'
          || req.url === '/profile' || req.url === '/settings') {
        console.log("in vite config, req.url = ", req.url)
        const cookies = parse(req.headers.cookie || '')
        if (!cookies['token']) {
          res.statusCode = 302
          res.setHeader('Location', '/login')
          res.end()
          return
        }
      }
      next()
    })
  },
})

// https://vite.dev/guide/api-plugin.html#configureserver
const beforeLoginPlugin = () => ({
  name: 'token_check_before_login',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url === '/login' || req.url === '/register'
		|| req.url === '/register-success') {
		console.log("in vite config, req.url = ", req.url)
        const cookies = parse(req.headers.cookie || '')
        if (cookies['token']) {
          res.statusCode = 302
          res.setHeader('Location', '/home')
          res.end()
          return
        }
      }
      next()
    })
  }
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    beforeLoginPlugin(),
	  protectedPlugin()
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
