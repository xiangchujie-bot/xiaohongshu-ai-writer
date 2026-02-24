import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/xiaohongshu-ai-writer/',
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
