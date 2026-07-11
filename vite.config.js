import { defineConfig } from 'vite';

export default defineConfig({
  // GitHub Pages ke sub-folder (repository name) ke liye base path add kiya
  base: '/ali-software-studio/', 
  
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});