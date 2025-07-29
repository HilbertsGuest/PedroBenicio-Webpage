import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // GHPages-Base-Config
  base: './',
  build: {
    outDir: 'dist'
  },
  plugins: [react()],
})
