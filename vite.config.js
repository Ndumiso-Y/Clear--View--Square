
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/',
  define: {
    __BUNDLED_DEV__: 'false',
    __SERVER_FORWARD_CONSOLE__: 'false'
  },
  build: {
    sourcemap: false,
    outDir: 'dist',
    emptyOutDir: true
  }
})
