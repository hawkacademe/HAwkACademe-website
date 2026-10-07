import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'client',
  plugins: [react()],
  build: { outDir: 'dist', emptyOutDir: true, sourcemap: false },
  // Server-side rendering bundle (npm run build): self-contained so the server needs no React install.
  ssr: { noExternal: true },
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:4000', '/uploads': 'http://localhost:4000', '/sitemap.xml': 'http://localhost:4000', '/robots.txt': 'http://localhost:4000' }
  }
});
