import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  define: {
    // When true, DuckDB loads from CDN (for Cloudflare 25 MiB limit). Replaced at build time so local chunk is tree-shaken.
    __USE_CDN_DUCKDB__: process.env.VITE_USE_CDN_DUCKDB === 'true',
  },
  server: {
    port: 3001,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
}))
