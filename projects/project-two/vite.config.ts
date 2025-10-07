import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Important for GitHub Pages deployment
  build: {
    // Emit directly into docs/ so GitHub Pages (docs root) can serve it
    outDir: '../../docs/projects/project-two',
    assetsDir: 'assets',
  }
})
