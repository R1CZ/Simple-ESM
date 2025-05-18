import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    // Disable HMR temporarily (if needed)
    hmr: true // Set this to `false` if you want to disable Hot Module Replacement for troubleshooting.
  }
})
