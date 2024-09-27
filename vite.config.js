import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

const env = process.env.NODE_ENV
const base = env === 'production' ? '/' : '/'
export default defineConfig({
  base: base,
  publicPath: base,
  build: {
    sourcemap: env === 'production'? false : true,
    outDir: 'dist',
    minify: 'terser',
    // rollupOptions: {
    //   output: {
    //     manualChunks(id) {
    //       if (id.includes('node_modules')) {
    //         return id.toString().split('node_modules/')[1].split('/')[0].toString();
    //       }
    //     },
    //   },
    // },
  },
  plugins: [
    vue(),
    visualizer({
      open: true, // 打包后自动打开报告
      gzipSize: true,
      brotliSize: true,
    }),
    ViteImageOptimizer({
      /* pass your config */
    }),
  ],
  resolve: {
    extensions: ['.js', '.vue', '.json', 'jpg'],
    alias: {
      '@': '/src',
    }
  },
  server: {
    host: '0.0.0.0',//方便真机调试
  }
})
