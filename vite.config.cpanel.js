
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// cPanel / Live Domain Configuration
// This config is for deploying to a root domain (e.g., clearviewsquare.co.za)
// Use: npm run build:cpanel
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    // Disable source maps in production for security
    sourcemap: false,
    // Output to dist/ folder
    outDir: 'dist',
    // Clean dist before build
    emptyOutDir: true
  }
})
