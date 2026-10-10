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

// Local file behind a precache URL ("/" -> index.html)
function fileForUrl(url) {
  const rel = url === '/' ? 'index.html' : url.replace(/^\//, '');
  return path.join(REPO_ROOT, rel);
}

// Redirect stubs (meta refresh) and noindex pages (thank-you, payment, tests) are not worth
// precaching: they are visited once, if ever, and some only exist to forward elsewhere.
function isRedirectOrNoindex(file) {
  const head = fs.readFileSync(file, 'utf8').split(/<\/head>/i)[0];
  return /http-equiv=["']refresh["']/i.test(head) || /<meta[^>]+name=["']robots["'][^>]+noindex/i.test(head);
}

function buildUrlsToCache() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const keep = new Set(manifest.keep || []);
  const urls = [...(manifest.static || [])];
  for (const dir of manifest.directories || []) {
    const dirPath = path.join(REPO_ROOT, dir);
    if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) continue;
    urls.push(...collectHtmlInDir(dir));
  }
  const result = [];
  for (const url of [...new Set(urls)].sort()) {
    const file = fileForUrl(url);
    // cache.addAll() rejects the whole install if a single URL fails, so a missing file is a build error
    if (!fs.existsSync(file)) {
      throw new Error(`precache URL ${url} has no file (${path.relative(REPO_ROOT, file)})`);
    }
    if (file.endsWith('.html') && !keep.has(url) && isRedirectOrNoindex(file)) {
      console.log(`   skip ${url} (redirect or noindex)`);
      continue;
    }
    result.push(url);
  }
  return result;
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

