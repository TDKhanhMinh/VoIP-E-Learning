import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    
  ],
  server: {
    port: 4000, // đổi sang port bạn muốn
  }
})
