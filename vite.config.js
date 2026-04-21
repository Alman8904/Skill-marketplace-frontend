import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/health': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        pathRewrite: { '^/health': '/' }
      },
      '/auth': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/public': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/user-skills': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/orders': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/payment': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/trust': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      },
      '/admin': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  }
})