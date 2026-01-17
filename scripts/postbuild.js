import fs from 'node:fs';
import path from 'node:path';

const buildDir = path.resolve('build/client');
const indexHtml = path.join(buildDir, 'index.html');
const notFoundHtml = path.join(buildDir, '404.html');

if (fs.existsSync(indexHtml)) {
  fs.copyFileSync(indexHtml, notFoundHtml);
  console.log('Copied index.html to 404.html for GitHub Pages support.');
} else {
  console.warn('Warning: build/client/index.html not found. Skipping 404.html creation.');
}
