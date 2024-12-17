import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/database'],
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'chart': ['chart.js', 'react-chartjs-2'],
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
