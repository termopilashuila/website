#!/usr/bin/env node
/*
  Verifies the assembled _site/ before it is deployed:
  1. Every local reference (href, src, srcset, poster, CSS url(), og/twitter images on
     termopilas.co) from published HTML and CSS resolves to a file inside _site/.
  2. Nothing private leaked in (Markdown, Terraform, Apps Script, tests, package files...).
  3. SEO consistency: each indexable page has exactly one absolute canonical, every sitemap
     <loc> is published, indexable and matches its page's canonical, and every JSON-LD
     block parses.
  4. The blog lives in Ghost: blog.html and every page under blog/ must stay a redirect to
     https://blog.termopilas.co with a canonical pointing to the same URL, so the posts are
     never duplicated on termopilas.co.
  5. Every indexable page loads Google Analytics with the GA4 id from scripts/site-config.json
     (gtag.js + gtag('config', id)), so no landing page is published untracked.

  Exit code 1 on any problem. Usage: node scripts/check-site.js [siteDir]
*/

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const SITE = path.resolve(REPO_ROOT, process.argv[2] || process.env.SITE_DIR || '_site');
const SITE_URL = 'https://termopilas.co';
const BLOG_URL = 'https://blog.termopilas.co';

const FORBIDDEN = [
  /\.md$/i, /^terraform\//, /^appscript\//, /^archive\//, /^markdown\//, /^resize\//,
  /^scripts\//, /^src\//, /^wompi\//, /^node_modules\//, /^docs\//, /^package(-lock)?\.json$/,
  /^tsconfig\.json$/, /^webpack\.config\.js$/, /^eslint\.config\.js$/, /^test-/, /\.py$/, /\.tf$/,
  /^assets\/data\//,
];

const problems = [];
const problem = (file, msg) => problems.push(`${file}: ${msg}`);

const GA_ID = JSON.parse(fs.readFileSync(path.join(__dirname, 'site-config.json'), 'utf8')).gaId;

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(abs, out);
    else out.push(path.relative(SITE, abs).split(path.sep).join('/'));
  }
  return out;
}

function decode(s) {
  return s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

// Resolve a reference found in `fromRel` to a path inside _site, or null when external/ignored
function resolveRef(fromRel, rawRef) {
  let ref = decode(rawRef.trim());
  if (!ref || ref.startsWith('#') || /^%23/i.test(ref) || ref.includes('{{') || ref.includes('${')) return null;
  if (/^(mailto:|tel:|data:|javascript:|blob:|sms:|whatsapp:)/i.test(ref)) return null;
  if (/^https?:\/\//i.test(ref) || ref.startsWith('//')) {
    const m = ref.match(/^(?:https?:)?\/\/(?:www\.)?termopilas\.co(\/[^?#]*)?/i);
    if (!m) return null; // other hosts
    ref = m[1] || '/';
  }
  ref = ref.split('#')[0].split('?')[0];
  if (!ref) return null;
  let rel;
  try {
    rel = ref.startsWith('/')
      ? decodeURIComponent(ref.slice(1))
      : path.posix.normalize(path.posix.join(path.posix.dirname(fromRel), decodeURIComponent(ref)));
  } catch {
    return { bad: ref };
  }
  // Browsers clamp "../" above the site root to the root (e.g. "../styles/x.css" on /feedback.html)
  while (rel.startsWith('../')) rel = rel.slice(3);
  if (rel === '..') rel = '';
  if (rel === '' || rel.endsWith('/')) rel += 'index.html';
  return { rel, ref };
}

function exists(rel) {
  const abs = path.join(SITE, rel);
  if (fs.existsSync(abs) && fs.statSync(abs).isFile()) return true;
  // GitHub Pages serves /foo for foo.html and /foo/ for foo/index.html
  if (fs.existsSync(abs + '.html')) return true;
  if (fs.existsSync(path.join(abs, 'index.html'))) return true;
  return false;
}

function collectRefs(rel, content) {
  const refs = [];
  const isHtml = rel.endsWith('.html');
  if (isHtml) {
    // Skip HTML comments and inline scripts (template literals, analytics snippets)
    const html = content.replace(/<!--[\s\S]*?-->/g, '').replace(/<script\b(?![^>]*\bsrc=)[^>]*>[\s\S]*?<\/script>/gi, '');
    for (const m of html.matchAll(/\s(?:href|src|poster|data-src)\s*=\s*"([^"]*)"/gi)) refs.push(m[1]);
    for (const m of html.matchAll(/\s(?:srcset|data-srcset)\s*=\s*"([^"]*)"/gi)) {
      for (const part of m[1].split(',')) refs.push(part.trim().split(/\s+/)[0]);
    }
    for (const m of html.matchAll(/<meta[^>]+(?:property|name)="(?:og:image|twitter:image|msapplication-TileImage)"[^>]+content="([^"]+)"/gi)) refs.push(m[1]);
    for (const m of html.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/gi)) refs.push(m[1]);
  } else if (rel.endsWith('.css')) {
    const css = content.replace(/\/\*[\s\S]*?\*\//g, '');
    for (const m of css.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/gi)) refs.push(m[1]);
    for (const m of css.matchAll(/@import\s+['"]([^'"]+)['"]/gi)) refs.push(m[1]);
  } else if (rel === 'manifest.json') {
    const json = JSON.parse(content);
    for (const icon of json.icons || []) refs.push(icon.src);
    for (const s of json.screenshots || []) refs.push(s.src);
    if (json.start_url) refs.push(json.start_url);
  }
  return refs;
}

function headOf(html) {
  return html.split(/<\/head>/i)[0];
}

function isRedirectOrNoindex(html) {
  const head = headOf(html);
  return /http-equiv=["']refresh["']/i.test(head) || /<meta[^>]+name=["']robots["'][^>]+noindex/i.test(head);
}

function main() {
  if (!fs.existsSync(SITE)) {
    console.error(`❌ ${SITE} does not exist. Run node scripts/build-site.js first.`);
    process.exit(1);
  }
  const files = walk(SITE);
  const published = new Set(files);

  for (const rel of files) {
    if (FORBIDDEN.some((re) => re.test(rel))) problem(rel, 'must not be published');
  }

  let refCount = 0;
  const pages = files.filter((f) => f.endsWith('.html'));
  for (const rel of [...pages, ...files.filter((f) => f.endsWith('.css')), 'manifest.json']) {
    if (!published.has(rel)) continue;
    const content = fs.readFileSync(path.join(SITE, rel), 'utf8');
    for (const raw of collectRefs(rel, content)) {
      const r = resolveRef(rel, raw);
      if (!r) continue;
      refCount += 1;
      if (r.bad) problem(rel, `invalid local reference ${r.bad}`);
      else if (!exists(r.rel)) problem(rel, `broken local reference ${r.ref} -> ${r.rel}`);
    }
  }

  // SEO consistency
  let jsonLd = 0;
  const indexable = [];
  const canonicalOf = {};
  for (const rel of pages) {
    const html = fs.readFileSync(path.join(SITE, rel), 'utf8');
    for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      jsonLd += 1;
      try { JSON.parse(m[1]); } catch (e) { problem(rel, `JSON-LD does not parse: ${e.message}`); }
    }
    const head = headOf(html);
    const canonicals = [...head.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map((m) => m[1]);
    canonicalOf[rel] = canonicals;
    if (canonicals.some((c) => !c.startsWith('https://'))) problem(rel, `relative canonical ${canonicals}`);
    if (!isRedirectOrNoindex(html) && rel !== '404.html' && /<head/i.test(html)) {
      indexable.push(rel);
      if (canonicals.length !== 1) problem(rel, `indexable page needs exactly one canonical (has ${canonicals.length})`);
      if (!head.includes(`googletagmanager.com/gtag/js?id=${GA_ID}`) || !html.includes(`gtag('config', '${GA_ID}')`)) {
        problem(rel, `indexable page does not load Google Analytics ${GA_ID}`);
      }
    }
  }

  // Blog pages must only redirect to Ghost
  for (const rel of pages.filter((f) => f === 'blog.html' || f.startsWith('blog/'))) {
    const head = headOf(fs.readFileSync(path.join(SITE, rel), 'utf8'));
    const refresh = head.match(/http-equiv=["']refresh["'][^>]*content=["']\d+;\s*url=([^"']+)["']/i);
    const target = refresh && refresh[1];
    if (!target || !target.startsWith(BLOG_URL)) {
      problem(rel, `blog page must redirect to ${BLOG_URL} (the blog lives in Ghost)`);
    } else if (JSON.stringify(canonicalOf[rel]) !== JSON.stringify([target])) {
      problem(rel, `canonical ${canonicalOf[rel]} must match the redirect target ${target}`);
    }
  }

  const sitemapPath = path.join(SITE, 'sitemap.xml');
  const locs = fs.existsSync(sitemapPath)
    ? [...fs.readFileSync(sitemapPath, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
    : [];
  if (!locs.length) problem('sitemap.xml', 'missing or empty');
  for (const loc of locs) {
    const rel = loc === `${SITE_URL}/` ? 'index.html' : loc.replace(`${SITE_URL}/`, '');
    if (!published.has(rel)) { problem('sitemap.xml', `${loc} is not published`); continue; }
    const html = fs.readFileSync(path.join(SITE, rel), 'utf8');
    if (isRedirectOrNoindex(html)) problem('sitemap.xml', `${loc} redirects or is noindex`);
    if (JSON.stringify(canonicalOf[rel]) !== JSON.stringify([loc])) problem('sitemap.xml', `${loc} canonical is ${canonicalOf[rel]}`);
  }
  const locSet = new Set(locs);
  for (const rel of indexable) {
    const url = rel === 'index.html' ? `${SITE_URL}/` : `${SITE_URL}/${rel}`;
    if (!locSet.has(url) && canonicalOf[rel][0] === url) problem('sitemap.xml', `indexable page ${rel} is missing`);
  }

  console.log(`Checked ${files.length} files, ${pages.length} HTML pages, ${refCount} local references, ${jsonLd} JSON-LD blocks, ${indexable.length} indexable pages, ${locs.length} sitemap URLs`);
  if (problems.length) {
    console.error(`❌ ${problems.length} problem(s):\n  - ${problems.join('\n  - ')}`);
    process.exit(1);
  }
  console.log('✅ _site is consistent');
}

main();
