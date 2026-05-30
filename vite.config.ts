import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'RePlan',
        short_name: 'RePlan',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          { src: '/assets/pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: '/assets/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/assets/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/assets/maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
