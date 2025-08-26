import { defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import svgr from 'vite-plugin-svgr';


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), svgr(),

  ],
  base: '/',
  css: {
    modules: {
      localsConvention: 'camelCase', 
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          i18n: ['i18next', 'react-i18next', 'i18next-http-backend'],
          ui: ['react-bootstrap'],
        },
        // หรือแบบฟังก์ชัน (ยืดหยุ่นกว่า)
        // manualChunks(id) {
        //   if (id.includes('node_modules')) {
        //     if (id.includes('react')) return 'react-vendor'
        //     if (id.includes('i18next')) return 'i18n'
        //     return 'vendor'
        //   }
        // },
      },
    },
    },
})
