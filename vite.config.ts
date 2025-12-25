import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
// import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  // plugins: [react(), basicSsl()],
  plugins: [react(),],
  base: "/",
  build: {
    chunkSizeWarningLimit: 3000,
  },
  server: {
    // https: false, // bật HTTPS
    host: true,  // cho phép truy cập qua IP mạng LAN
    // open: true,
  },
})
