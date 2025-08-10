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

    sitemap(
      [
        '/',
        '/gharbeti',
        '/login',
        '/register',
        '/unverified',
        '/verify-email',
        '/list-buyer',
        '/privacy',
        '/terms',
        '/reset-password',
        '/forgot-password',
        '/verification-otp',
        '/list-freelancer',
        '/accepted-work',
        '/task-req',
        '/hostel',
        '/control-hostel'
      ],
      {
        hostname: 'https://gharbeti-sewa.com',
        robots: true,
        outDir: 'dist'
      }
    )
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
