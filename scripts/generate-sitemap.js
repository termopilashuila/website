#!/usr/bin/env node
/*
  Sitemap generator for termopilas.co
  - Discovers public .html files in repo root, eventos/, trabajo/, blog/, blog/posts/
  - Computes lastmod using Git commit time (fallback to file mtime)
  - Assigns changefreq and priority per policy
  - Resolves representative images (blog posts get specific image when available; otherwise fallback)
  - Writes sitemap.xml with proper namespaces and deterministic ordering
*/

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const SITE_URL = 'https://termopilas.co';
const REPO_ROOT = path.resolve(__dirname, '..');
const OUTPUT_FILE = path.join(REPO_ROOT, 'sitemap.xml');

const TARGET_DIRECTORIES = [
  '.',
  'eventos',
  'trabajo',
  'blog',
  path.join('blog', 'posts'),
];

const PRIMARY_PAGES = new Set([
  'alojamiento.html',
  'tour.html',
  'coliving.html',
  'eventos.html',
  'blog.html',
  'catalogo.html',
  'cata-vinos.html',
]);

const UTILITY_PAGES = new Set([
  'privacidad.html',
  'whatsapp.html',
  'registro.html',
]);

const FALLBACK_IMAGES = [
  path.join('assets', 'images', 'home', 'header.jpg'),
  path.join('assets', 'images', 'header.png'),
];

/** Recursively collect .html files in a directory (relative to REPO_ROOT). */
async function collectHtmlFiles(relativeDir) {
  const collected = [];
  const dirPath = path.join(REPO_ROOT, relativeDir);
  let entries = [];
  try {
    entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
  } catch (_) {
    return collected;
  }
  for (const entry of entries) {
    const entryRelPath = path.join(relativeDir, entry.name);
    const entryAbsPath = path.join(REPO_ROOT, entryRelPath);
    if (entry.isDirectory()) {
      // Skip hidden and non-target deep directories by default
      if (entry.name.startsWith('.')) continue;
      // Only recurse into target directories when starting from '.' or explicit subdirectories
      // Avoid scanning huge dependency/vendor folders
      if ([
        'node_modules',
        'venv',
        '.git',
        'appscript',
        'assets',
        'octorate',
        'resize',
        'terraform',
        'src',
        'styles',
        'scripts',
      ].includes(entry.name) && relativeDir === '.') {
        continue;
      }
      // Allow recursion inside directories we explicitly target (eventos, trabajo, blog)
      if (relativeDir === '.' || ['eventos', 'trabajo', 'blog'].includes(relativeDir) || relativeDir.startsWith('blog')) {
        const nested = await collectHtmlFiles(entryRelPath);
        collected.push(...nested);
      }
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.html')) {
      collected.push(entryRelPath);
    }
  }
  return collected;
}

function getGitLastCommitIso(fileAbsPath) {
  try {
    const res = spawnSync('git', ['log', '-1', '--format=%cI', '--', fileAbsPath], {
      cwd: REPO_ROOT,
      encoding: 'utf-8',
    });
    const output = (res.stdout || '').trim();
    if (res.status === 0 && output) return output;
  } catch (_) {}
  return null;
}

async function getLastModIso(fileAbsPath) {
  const fromGit = getGitLastCommitIso(fileAbsPath);
  if (fromGit) return fromGit;
  const stat = await fs.promises.stat(fileAbsPath);
  // RFC3339 with timezone: use toISOString (UTC)
  return stat.mtime.toISOString();
}

function toCanonicalUrl(relativeHtmlPath) {
  if (relativeHtmlPath === 'index.html') return `${SITE_URL}/`;
  return `${SITE_URL}/${relativeHtmlPath.replace(/\\/g, '/')}`;
}

function fileExists(relPath) {
  try {
    return fs.existsSync(path.join(REPO_ROOT, relPath));
  } catch (_) {
    return false;
  }
}

function guessImageForPage(relativeHtmlPath) {
  // Blog posts: assets/images/blog/[slug]/main.(jpg|png|jpeg)
  if (relativeHtmlPath.startsWith(path.join('blog', 'posts') + path.sep)) {
    const slug = path.basename(relativeHtmlPath, '.html');
    const candidates = ['jpg', 'jpeg', 'png'].map((ext) =>
      path.join('assets', 'images', 'blog', slug, `main.${ext}`)
    );
    for (const rel of candidates) {
      if (fileExists(rel)) return `${SITE_URL}/${rel.replace(/\\/g, '/')}`;
    }
  }
  // Fallbacks
  for (const fallback of FALLBACK_IMAGES) {
    if (fileExists(fallback)) return `${SITE_URL}/${fallback.replace(/\\/g, '/')}`;
  }
  return null;
}

function classifyPage(relativeHtmlPath) {
  const base = path.basename(relativeHtmlPath);
  if (relativeHtmlPath === 'index.html') {
    return { changefreq: 'monthly', priority: 1.0, group: 0 };
  }
  if (PRIMARY_PAGES.has(base)) {
    const changefreq = base === 'blog.html' ? 'weekly' : 'monthly';
    return { changefreq, priority: 0.9, group: 1 };
  }
  if (UTILITY_PAGES.has(base)) {
    return { changefreq: 'yearly', priority: 0.3, group: 2 };
  }
  if (relativeHtmlPath.startsWith('eventos' + path.sep)) {
    return { changefreq: 'monthly', priority: 0.8, group: 3 };
  }
  if (relativeHtmlPath.startsWith('trabajo' + path.sep)) {
    return { changefreq: 'monthly', priority: 0.6, group: 4 };
  }
  if (relativeHtmlPath.startsWith(path.join('blog', 'posts') + path.sep)) {
    return { changefreq: 'monthly', priority: 0.8, group: 6 };
  }
  // Treat top-level blog/*.html (non-post index pages) as regular pages at 0.7 priority
  if (relativeHtmlPath.startsWith('blog' + path.sep)) {
    return { changefreq: 'monthly', priority: 0.7, group: 5 };
  }
  // Other public pages
  return { changefreq: 'monthly', priority: 0.7, group: 5 };
}

function xmlEscape(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function main() {
  // Pre-compute slugs from blog/posts to avoid duplicating top-level blog post duplicates
  const blogPosts = await collectHtmlFiles(path.join('blog', 'posts'));
  const postSlugs = new Set(blogPosts.map((p) => path.basename(p, '.html')));

  // Collect files from target directories
  const allFilesNested = await Promise.all(
    TARGET_DIRECTORIES.map((dir) => collectHtmlFiles(dir))
  );
  let allFiles = Array.from(new Set(allFilesNested.flat()));

  // Normalize and filter
  allFiles = allFiles
    .map((p) => p.replace(/^\.\//, ''))
    .filter((p) => {
      // Only top-level or specifically targeted subfolders
      const parts = p.split(path.sep);
      if (parts[0] === '.') return false;
      // Exclude 404 pages
      if (path.basename(p).toLowerCase() === '404.html') return false;
      // Exclude template files from indexing
      if (path.basename(p).toLowerCase() === 'template.html') return false;
      // Exclude duplicate blog top-level posts when a posts/* of same slug exists
      if (parts[0] === 'blog' && parts[1] !== 'posts') {
        const slug = path.basename(p, '.html');
        if (postSlugs.has(slug)) return false;
      }
      // Include root .html files only
      if (!['eventos', 'trabajo', 'blog'].includes(parts[0]) && parts.length > 1) return false;
      return true;
    });

  // Ensure index.html is included if present
  if (fileExists('index.html') && !allFiles.includes('index.html')) {
    allFiles.push('index.html');
  }

  // Build entries with metadata
  const entries = [];
  for (const relPath of allFiles) {
    const abs = path.join(REPO_ROOT, relPath);
    const loc = toCanonicalUrl(relPath);
    const lastmod = await getLastModIso(abs);
    const img = guessImageForPage(relPath);
    const { changefreq, priority, group } = classifyPage(relPath);
    entries.push({ relPath, loc, lastmod, changefreq, priority, image: img, group });
  }

  // Sort: root, primary, other root, eventos, trabajo, other, blog posts by lastmod desc
  entries.sort((a, b) => {
    if (a.group !== b.group) return a.group - b.group;
    if (a.group === 6) {
      // blog posts by lastmod desc
      return new Date(b.lastmod).getTime() - new Date(a.lastmod).getTime();
    }
    // Otherwise alpha by path
    return a.relPath.localeCompare(b.relPath);
  });

  // Write XML
  const lines = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">');
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

  await fs.promises.writeFile(OUTPUT_FILE, lines.join('\n') + '\n', 'utf-8');

  const numUrls = entries.length;
  const numImages = entries.filter((e) => Boolean(e.image)).length;
  // eslint-disable-next-line no-console
  console.log(`Generated sitemap.xml with ${numUrls} URLs (${numImages} images)`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});


