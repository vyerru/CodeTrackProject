import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/react-router') || id.includes('node_modules/framer-motion')) return 'vendor'
          if (id.includes('node_modules/lucide-react') || id.includes('node_modules/zustand') || id.includes('node_modules/class-variance-authority') || id.includes('node_modules/tailwind-merge') || id.includes('node_modules/clsx')) return 'ui'
          if (id.includes('node_modules/react-hook-form') || id.includes('node_modules/@hookform') || id.includes('node_modules/zod')) return 'forms'
          if (id.includes('node_modules/recharts')) return 'recharts'
        },
      },
    },
  },
})