#!/usr/bin/env node
/*
  Sitemap generator for termopilas.co
  - Discovers public .html files (repo root plus a few content subfolders)
  - Skips pages that must not be indexed: meta refresh redirects, robots noindex,
    canonical pointing to another URL, templates, tests and utility pages
  - lastmod comes from `git log -1 --format=%cI -- <file>`:
      * files with uncommitted changes use the current time (they are about to change)
      * shallow clones (e.g. CI checkouts) reuse the lastmod already in sitemap.xml
      * fallback: file mtime
  - Writes sitemap.xml with deterministic ordering
  Runs as part of `npm run build`.
*/

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const SITE_URL = 'https://termopilas.co';
const REPO_ROOT = path.resolve(__dirname, '..');
const OUTPUT_FILE = path.join(REPO_ROOT, 'sitemap.xml');

// Subfolders whose .html files may be public content (besides the repo root).
const CONTENT_SUBDIRS = ['cata', 'eventos', 'trabajo', 'tour', 'coliving'];

// Never listed, regardless of their meta tags.
const EXCLUDED_FILES = new Set([
  '404.html',
  'offline.html',
  'whatsapp.html',
  'test-popup-automated.html',
  'pago.html',
  'registro.html',
  'feedback.html',
]);

const PRIMARY_PAGES = new Set([
  'alojamiento.html',
  'catalogo.html',
  'salon.html',
  'grupos.html',
]);

const LOW_PRIORITY_PAGES = new Set([
  'privacidad.html',
  'terminos.html',
]);

const PAGE_IMAGE_MAP = {
  'index.html': 'assets/images/home/section1-accommodation1.jpg',
  'alojamiento.html': 'assets/images/alojamiento/habitacion-a/image1.png',
  'salon.html': 'assets/images/venue/image1.png',
  'catalogo.html': 'assets/images/catalog/header.png',
  'galeria.html': 'assets/images/galeria/galeria-01.jpeg',
  'grupos.html': 'assets/images/eventos/header.png',
  'ubicacion.html': 'assets/images/ubicacion/header.png',
  'trabajo.html': 'assets/images/trabajo/header.png',
  'trabajo/cocinero.html': 'assets/images/trabajo/header.png',
  'trabajo/conserje.html': 'assets/images/trabajo/header.png',
  'trabajo/recepcionista.html': 'assets/images/trabajo/header.png',
  'trabajo/web-developer.html': 'assets/images/trabajo/header.png',
};
const FALLBACK_IMAGE = 'assets/images/header.png';

function git(args) {
  const res = spawnSync('git', args, { cwd: REPO_ROOT, encoding: 'utf-8' });
  if (res.status !== 0) return null;
  return (res.stdout || '').trim();
}

const IS_GIT_REPO = git(['rev-parse', '--is-inside-work-tree']) === 'true';
const IS_SHALLOW = IS_GIT_REPO && git(['rev-parse', '--is-shallow-repository']) === 'true';

function listHtmlFiles() {
  const files = [];
  const pushHtml = (relDir) => {
    const abs = path.join(REPO_ROOT, relDir);
    if (!fs.existsSync(abs)) return;
    for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith('.html')) {
        files.push(relDir === '.' ? entry.name : `${relDir}/${entry.name}`);
      }
    }
  };
  pushHtml('.');
  for (const dir of CONTENT_SUBDIRS) pushHtml(dir);
  return files.sort();
}

function toUrl(relPath) {
  if (relPath === 'index.html') return `${SITE_URL}/`;
  if (relPath.endsWith('/index.html')) return `${SITE_URL}/${relPath.slice(0, -'index.html'.length)}`;
  return `${SITE_URL}/${relPath}`;
}

/** Returns a reason string when the page must not be in the sitemap, otherwise null. */
function exclusionReason(relPath, html) {
  const base = path.basename(relPath).toLowerCase();
  if (EXCLUDED_FILES.has(relPath) || base === 'template.html') return 'excluded file';
  if (/^test[-_]/.test(base)) return 'test page';
  const head = (html.split(/<\/head>/i)[0] || html);
  if (/<meta[^>]+http-equiv=["']refresh["']/i.test(head)) return 'meta refresh';
  const robots = head.match(/<meta[^>]+name=["']robots["'][^>]*>/i);
  if (robots && /noindex/i.test(robots[0])) return 'noindex';
  const canonical = head.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  if (canonical && canonical[1] !== toUrl(relPath)) return `canonical -> ${canonical[1]}`;
  return null;
}

function readExistingLastmods() {
  const map = new Map();
  try {
    const xml = fs.readFileSync(OUTPUT_FILE, 'utf-8');
    const re = /<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g;
    let m;
    while ((m = re.exec(xml))) map.set(m[1], m[2]);
  } catch {
    // no previous sitemap
  }
  return map;
}

function lastModFor(relPath, url, previous) {
  if (IS_GIT_REPO) {
    const dirty = git(['status', '--porcelain', '--', relPath]);
    if (dirty) return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
    if (IS_SHALLOW && previous.has(url)) return previous.get(url);
    const fromGit = git(['log', '-1', '--format=%cI', '--', relPath]);
    if (fromGit) return fromGit;
  }
  if (previous.has(url)) return previous.get(url);
  return fs.statSync(path.join(REPO_ROOT, relPath)).mtime.toISOString();
}

function classify(relPath) {
  if (relPath === 'index.html') return { changefreq: 'weekly', priority: 1.0, group: 0 };
  if (PRIMARY_PAGES.has(relPath)) return { changefreq: 'monthly', priority: 0.9, group: 1 };
  if (LOW_PRIORITY_PAGES.has(relPath)) return { changefreq: 'yearly', priority: 0.3, group: 4 };
  if (relPath.startsWith('trabajo/')) return { changefreq: 'monthly', priority: 0.6, group: 3 };
  return { changefreq: 'monthly', priority: 0.7, group: 2 };
}

function imageFor(relPath) {
  const candidate = PAGE_IMAGE_MAP[relPath] || FALLBACK_IMAGE;
  return fs.existsSync(path.join(REPO_ROOT, candidate)) ? `${SITE_URL}/${candidate}` : null;
}

function xmlEscape(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function main() {
  const previous = readExistingLastmods();
  const entries = [];
  const skipped = [];

  for (const relPath of listHtmlFiles()) {
    const html = fs.readFileSync(path.join(REPO_ROOT, relPath), 'utf-8');
    const reason = exclusionReason(relPath, html);
    if (reason) {
      skipped.push(`${relPath} (${reason})`);
      continue;
    }
    const loc = toUrl(relPath);
    entries.push({
      relPath,
      loc,
      lastmod: lastModFor(relPath, loc, previous),
      image: imageFor(relPath),
      ...classify(relPath),
    });
  }

  if (!entries.some((e) => e.relPath === 'index.html')) {
    throw new Error('index.html missing from sitemap: refusing to write an incomplete sitemap');
  }

  entries.sort((a, b) => (a.group - b.group) || a.relPath.localeCompare(b.relPath));

  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
  ];
  for (const e of entries) {
    lines.push('  <url>');
    lines.push(`    <loc>${xmlEscape(e.loc)}</loc>`);
    lines.push(`    <lastmod>${xmlEscape(e.lastmod)}</lastmod>`);
    lines.push(`    <changefreq>${e.changefreq}</changefreq>`);
    lines.push(`    <priority>${e.priority.toFixed(1)}</priority>`);
    if (e.image) {
      lines.push('    <image:image>');
      lines.push(`      <image:loc>${xmlEscape(e.image)}</image:loc>`);
      lines.push('    </image:image>');
    }
    lines.push('  </url>');
  }
  lines.push('</urlset>');

  fs.writeFileSync(OUTPUT_FILE, lines.join('\n') + '\n', 'utf-8');
  console.log(`Generated sitemap.xml with ${entries.length} URLs (skipped ${skipped.length}${IS_SHALLOW ? ', shallow clone: reused previous lastmod' : ''})`);
  if (process.env.SITEMAP_VERBOSE) skipped.forEach((s) => console.log(`  skip: ${s}`));
}

try {
  main();
} catch (err) {
  console.error(err);
  process.exit(1);
}
