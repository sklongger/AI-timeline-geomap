import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

console.log(process.env.NODE_ENV)
const base = process.env.NODE_ENV === 'production' ? '/' : '/'
export default defineConfig({
  // base: base,
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
