import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap' // ✅ default import

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://gharbeti-sewa.com',
      urls: [
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
      ]
    })
  ],
  build: {
    outDir: 'dist',
  },
  server: {
    historyApiFallback: true,
  },
  preview: {
    historyApiFallback: true,
  }
})
