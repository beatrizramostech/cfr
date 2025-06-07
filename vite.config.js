import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import viteBasicSslPlugin from '@vitejs/plugin-basic-ssl';

// https://vite.dev/config/
export default defineConfig({
  server: {
    https: true,
  },
  plugins: [react(), viteBasicSslPlugin()],
  base: '/cfr',
  build: {
    outDir: 'cfr',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
