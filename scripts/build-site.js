#!/usr/bin/env node
/*
  Assembles _site/: the only directory GitHub Pages publishes (see .github/workflows/pages.yml).

  Allowlist, not denylist: anything not listed here (docs, terraform/, appscript/, archive/,
  markdown/, resize/, scripts/, src/, wompi/, tests, package files, ...) is never published.

  Run after the build (webpack, render-layout, service worker, sitemap):
    node scripts/build-site.js            # writes _site/
    node scripts/check-site.js            # verifies every local link inside _site/
*/

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(REPO_ROOT, process.env.SITE_DIR || '_site');

// Single files at the repo root
const ROOT_FILES = [
  'CNAME',
  'robots.txt',
  'sitemap.xml',
  'manifest.json',
  'service-worker.js',
  'share-modal.js', // referenced by index.html
];

// Root HTML pages that must not be published (tests, internal tools)
const EXCLUDED_ROOT_HTML = new Set([
  'test-popup-automated.html',
]);

// Directories copied as a whole (minus EXCLUDED_PATTERNS)
const ASSET_DIRS = ['assets', 'styles', 'dist'];

// Content directories with public pages (most are redirect stubs that keep old URLs alive)
const PAGE_DIRS = ['blog', 'cata', 'coliving', 'eventos', 'tour', 'trabajo'];

// Never published, even inside an allowed directory
const EXCLUDED_PATTERNS = [
  /\.md$/i,
  /(^|\/)template\.html$/i,
  /(^|\/)\.DS_Store$/,
  /\.LICENSE\.txt$/,
  /\.map$/,
  /^assets\/data\//, // internal spreadsheets
];

function isExcluded(rel) {
  return EXCLUDED_PATTERNS.some((re) => re.test(rel));
}

let fileCount = 0;
let byteCount = 0;

function copyFile(rel) {
  const src = path.join(REPO_ROOT, rel);
  const dest = path.join(OUT_DIR, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  fileCount += 1;
  byteCount += fs.statSync(src).size;
}

function copyDir(relDir) {
  const abs = path.join(REPO_ROOT, relDir);
  if (!fs.existsSync(abs)) throw new Error(`missing directory ${relDir}`);
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    const rel = `${relDir}/${entry.name}`;
    if (isExcluded(rel)) continue;
    if (entry.isDirectory()) copyDir(rel);
    else if (entry.isFile()) copyFile(rel);
  }
}

function main() {
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const file of ROOT_FILES) {
    if (!fs.existsSync(path.join(REPO_ROOT, file))) throw new Error(`missing root file ${file}`);
    copyFile(file);
  }

  for (const entry of fs.readdirSync(REPO_ROOT, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith('.html') && !EXCLUDED_ROOT_HTML.has(entry.name) && !isExcluded(entry.name)) {
      copyFile(entry.name);
    }
  }

  for (const dir of [...ASSET_DIRS, ...PAGE_DIRS]) copyDir(dir);

  console.log(`✅ ${path.relative(REPO_ROOT, OUT_DIR)}/ assembled: ${fileCount} files, ${(byteCount / 1024 / 1024).toFixed(1)} MB`);
}

main();
