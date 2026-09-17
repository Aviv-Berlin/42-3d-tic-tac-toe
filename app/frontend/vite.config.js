import { defineConfig } from 'vite'
import { parse } from 'cookie'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/guide/api-plugin.html#configureserver
const myPlugin = () => ({
  name: 'token_check_before_login',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url === '/login') {
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
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    myPlugin(),
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

/*
app.use((req, res, next) => {

    if (req.path.startsWith('/v1') || req.path.startsWith('/login')) return next();
    if (req.path.match(/\.\w+$/)) {
        return next();
    }
    const cookie = req.cookies;
    if (!cookie || !cookie['token']) {
        return (res.redirect(302, '/login'));
    }
    next();
});
*/