import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/global.scss";`,
      },
    },
  },
  plugins: [tsconfigPaths(), vue()],
})
