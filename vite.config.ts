import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  build: {
    chunkSizeWarningLimit: 600, // increase limit to reduce warnings
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // put all node_modules code into a separate vendor chunk
            return 'vendor';
          }
        }
      }
    }
  }
});
