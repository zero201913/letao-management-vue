import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import compression from 'vite-plugin-compression'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    cssInjectedByJsPlugin(),
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      deleteOriginFile: false,
    }),
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      deleteOriginFile: false,
    }),
    ViteImageOptimizer({
      png: {
        quality: 80,
        compressionLevel: 9,
      },
      jpeg: {
        quality: 80,
        progressive: true,
      },
      webp: {
        quality: 80,
        lossless: false,
      },
      avif: {
        quality: 70,
        lossless: false,
      },
      svg: {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeViewBox: false,
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    // 启用更严格的构建检查
    strict: true,
    // 使用esbuild加速构建
    minify: 'esbuild',
    // 提高esbuild压缩级别
    esbuildOptions: {
      minifyIdentifiers: true,
      minifySyntax: true,
      minifyWhitespace: true,
      drop: ['console', 'debugger'],
    },
    // 优化CSS输出
    cssCodeSplit: true,
    // 配置静态资源大小限制
    assetsInlineLimit: 4096,
    // 生成sourcemap用于调试（生产环境可关闭）
    sourcemap: false,
    // 配置chunk分割策略
    rollupOptions: {
      // 禁用生成大型chunk警告
      onwarn: (warning, warn) => {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return
        warn(warning)
      },
      output: {
        // 使用更高效的chunk命名
        chunkFileNames: 'js/[hash].js',
        entryFileNames: 'js/[hash].js',
        assetFileNames: '[ext]/[hash].[ext]',
        // 优化chunk分割算法
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('echarts')) {
              return 'echarts'
            } else if (id.includes('@fortawesome')) {
              return 'fontawesome'
            } else if (id.includes('vue') || id.includes('pinia') || id.includes('vue-router')) {
              return 'vendor'
            }
            return 'vendor'
          }
        }
      },
      // 启用tree-shaking
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
      },
    },
    // 配置缓存加速构建
    cacheDir: '.vite-cache',
  },
  // 优化开发服务器
  server: {
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia', 'echarts'],
      exclude: [],
      // 预构建依赖
      force: false,
    },
  },
  // 优化依赖分析
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'echarts'],
    // 禁用esbuild优化（根据需要调整）
    esbuildOptions: {
      target: 'es2020',
    },
  },
})
