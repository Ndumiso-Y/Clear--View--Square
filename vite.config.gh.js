
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages Configuration
// This config is for deploying to GitHub Pages at: https://ndumiso-y.github.io/Clear--View--Square/
// Use: npm run build:gh (or npm run build for backward compatibility)
export default defineConfig({
  plugins: [react()],
  base: '/Clear--View--Square/',
  build: {
    // Disable source maps in production for security
    sourcemap: false,
    // Output to dist/ folder
    outDir: 'dist',
    // Clean dist before build
    emptyOutDir: true
  }
})
