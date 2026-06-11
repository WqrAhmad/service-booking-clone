import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const googleMapsKey = env.VITE_GOOGLE_MAPS_API_KEY || ''

  return {
    plugins: [vue(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
      dedupe: ['vue']
    },
    server: {
      proxy: {
        '/api/google-places': {
          target: 'https://maps.googleapis.com',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/google-places/, '/maps/api/place'),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              const fullPath = proxyReq.path || ''
              const [pathname, query] = fullPath.split('?')
              const params = new URLSearchParams(query || '')
              params.set('key', googleMapsKey)
              proxyReq.path = pathname + '?' + params.toString()

              // Remove these headers so Google doesn't reject the request
              proxyReq.removeHeader('origin')
              proxyReq.removeHeader('referer')
            })

            proxy.on('proxyRes', (proxyRes) => {
              // Allow the browser to accept the response
              proxyRes.headers['access-control-allow-origin'] = '*'
              proxyRes.headers['access-control-allow-methods'] = 'GET, OPTIONS'
              proxyRes.headers['access-control-allow-headers'] = 'Content-Type'
            })
          }
        }
      }
    }
  }
})