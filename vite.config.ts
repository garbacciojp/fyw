import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/config': path.resolve(__dirname, './src/config'),
      '@/core': path.resolve(__dirname, './src/core'),
      '@/modules': path.resolve(__dirname, './src/modules'),
      '@/widgets': path.resolve(__dirname, './src/widgets'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/styles': path.resolve(__dirname, './src/styles'),
    },
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT ? parseInt(process.env.PORT) : 4173,
    strictPort: false,
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/widgets/findYourWord.tsx'),
      name: 'FindYourWordWidget',
      fileName: 'find-your-word-v2',
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        // Don't externalize React - bundle it in the widget
        // This makes the widget self-contained and work anywhere
      },
    },
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: false,
      },
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    // Hardcode production API URL (like the old working version)
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify('https://fyw-lrqe8.ondigitalocean.app'),
    'import.meta.env.VITE_DEBUG_MODE': JSON.stringify('false'),
    'import.meta.env.PROD': true,
  },
});


