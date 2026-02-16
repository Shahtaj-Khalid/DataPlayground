// Remove DuckDB WASM/worker assets from dist after build when using CDN (Cloudflare 25 MiB limit).
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'dist', 'assets');
if (!fs.existsSync(dir)) process.exit(0);
fs.readdirSync(dir)
  .filter((f) => f.includes('duckdb'))
  .forEach((f) => {
    fs.unlinkSync(path.join(dir, f));
    console.log('Removed', f);
  });
