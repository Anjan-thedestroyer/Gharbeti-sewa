import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import sitemap from 'vite-plugin-sitemap';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),

    // Ensure dist folder exists before sitemap generation
    {
      name: 'ensure-dist-folder',
      closeBundle() {
        const distPath = path.resolve(__dirname, 'dist');
        if (!fs.existsSync(distPath)) {
          fs.mkdirSync(distPath, { recursive: true });
        }
      },
    },

    sitemap({
      hostname: 'https://gharbeti-sewa.com', // Make sure this is your live site URL
      dynamicRoutes: [
        '/', '/gharbeti', '/login', '/register', '/unverified',
        '/verify-email', '/list-buyer', '/privacy', '/terms',
        '/reset-password', '/forgot-password', '/verification-otp',
        '/list-freelancer', '/accepted-work', '/task-req',
        '/hostel', '/control-hostel'
      ],
      outDir: 'dist',
      changefreq: 'daily',
      priority: 1,
      generateRobotsTxt: true
    }),
  ],
  build: {
    outDir: 'dist',
  },
});
