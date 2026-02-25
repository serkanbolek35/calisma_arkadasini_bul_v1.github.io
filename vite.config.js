import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/calisma_arkadasini_bul_v1.github.io/', // GitHub repo adın
  plugins: [react()],
})