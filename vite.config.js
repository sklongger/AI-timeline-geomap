import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  build: {
    sourcemap: true
  },
  plugins: [vue()],
  resolve: {
    extensions: ['.js', '.vue', '.json', 'jpg'],
    alias: {
      '@': '/src',
    }
  },
  server: {
    host: '0.0.0.0'//方便真机调试
  }
})
