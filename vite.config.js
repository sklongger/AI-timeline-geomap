import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'


const base = process.env.NODE_ENV === 'production' ? '/AI-timeline-geomap/' : '/'
export default defineConfig({
  base: base,
  publicPath: base,
  build: {
    sourcemap: true,
    outDir: 'dist',
  },
  plugins: [vue()],
  resolve: {
    extensions: ['.js', '.vue', '.json', 'jpg'],
    alias: {
      '@': '/src',
    }
  },
  server: {
    host: '0.0.0.0',//方便真机调试
    proxy: {
      '/autumnRiver': {
        target: 'http://101.42.16.7/autumnRiver',
        changeOrigin: true
      }
    }
  }
})
