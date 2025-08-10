import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // default but explicit
  },
  server: {
    historyApiFallback: true, // for local dev
  },
  preview: {
    historyApiFallback: true, // for `vite preview`
  }
})
