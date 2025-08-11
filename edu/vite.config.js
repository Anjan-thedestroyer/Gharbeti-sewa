import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),

    {
      name: 'ensure-dist-folder',
      closeBundle() {
        const distPath = path.resolve(__dirname, 'dist')
        if (!fs.existsSync(distPath)) {
          fs.mkdirSync(distPath, { recursive: true })
        }
      },
    },

    sitemap({
      hostname: 'https://gharbeti-sewa.com',
      outDir: 'dist',
      robots: true,
      urls: [
        { url: '/' },
        { url: '/gharbeti' },
        { url: '/login' },
        { url: '/register' },
        { url: '/unverified' },
        { url: '/verify-email' },
        { url: '/list-buyer' },
        { url: '/privacy' },
        { url: '/terms' },
        { url: '/reset-password' },
        { url: '/forgot-password' },
        { url: '/verification-otp' },
        { url: '/list-freelancer' },
        { url: '/accepted-work' },
        { url: '/task-req' },
        { url: '/hostel' },
        { url: '/control-hostel' }
      ]
    })
  ],
  build: {
    outDir: 'dist'
  },
  server: {
    historyApiFallback: true
  },
  preview: {
    historyApiFallback: true
  }
})
