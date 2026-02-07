/**
 * Updates the service worker cache version and urlsToCache from manifest.
 * Run during build so new pages (cata/, tour/, blog/, etc.) are precached after deploy.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const SW_PATH = path.join(REPO_ROOT, 'service-worker.js');
const MANIFEST_PATH = path.join(__dirname, 'sw-cache-manifest.json');

function collectHtmlInDir(relativeDir) {
  const collected = [];
  const dirPath = path.join(REPO_ROOT, relativeDir);
  let entries = [];
  try {
    entries = fs.readdirSync(dirPath, { withFileTypes: true });
  } catch {
    return collected;
  }
  for (const entry of entries) {
    const entryRelPath = path.join(relativeDir, entry.name).replace(/\\/g, '/');
    if (entry.isDirectory()) continue;
    if (entry.isFile() && entry.name.endsWith('.html') && entry.name.toLowerCase() !== 'template.html') {
      collected.push('/' + entryRelPath);
    }
  }
  return collected;
}

function buildUrlsToCache() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const urls = [...(manifest.static || [])];
  for (const dir of manifest.directories || []) {
    const dirPath = path.join(REPO_ROOT, dir);
    if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) continue;
    urls.push(...collectHtmlInDir(dir));
  }
  return [...new Set(urls)].sort();
}

// Generate version: YYYY.MM.DD.HHmmss
const now = new Date();
const version = [
  now.getFullYear(),
  String(now.getMonth() + 1).padStart(2, '0'),
  String(now.getDate()).padStart(2, '0'),
  String(now.getHours()).padStart(2, '0') +
  String(now.getMinutes()).padStart(2, '0') +
  String(now.getSeconds()).padStart(2, '0')
].join('.');
const CACHE_VERSION = `termopilas-cache-v${version}`;

try {
  const urlsToCache = buildUrlsToCache();
  let content = fs.readFileSync(SW_PATH, 'utf8');

  content = content.replace(
    /const CACHE_NAME = ['"]termopilas-cache-v[^'"]*['"]/,
    `const CACHE_NAME = '${CACHE_VERSION}'`
  );

  const urlsArrayStr = '[\n  ' + urlsToCache.map((u) => `'${u}'`).join(',\n  ') + '\n]';
  content = content.replace(
    /const urlsToCache = \[[\s\S]*?\];/,
    `const urlsToCache = ${urlsArrayStr};`
  );

  fs.writeFileSync(SW_PATH, content, 'utf8');
  console.log(`✅ Service worker updated: ${CACHE_VERSION} (${urlsToCache.length} URLs)`);
} catch (error) {
  console.error('❌ Failed to update service worker:', error.message);
  process.exit(1);
}

