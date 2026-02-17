#!/usr/bin/env node
/**
 * Injects Facebook (Meta) Pixel from scripts/site-config.json into all HTML files.
 *
 * - Pages that already have the pixel: updates the pixel ID to match config.
 * - Pages without the pixel: inserts the full snippet before </head>.
 * - Skips files in archive/ (frozen pages).
 *
 * Run: node scripts/inject-fb-pixel-from-config.js
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const CONFIG_PATH = path.join(__dirname, 'site-config.json');

const HTML_DIRS = [
  '.',
  'cata',
  'trabajo',
  'blog',
  'coliving',
  'tour',
  'appscript/eventos',
  'appscript/tour',
  'appscript/subscribe',
];

function pixelSnippet(pixelId) {
  return [
    '',
    '    <!-- Meta Pixel Code -->',
    '    <script>',
    '        !function(f,b,e,v,n,t,s)',
    '        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?',
    '        n.callMethod.apply(n,arguments):n.queue.push(arguments)};',
    "        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';",
    "        n.queue=[];t=b.createElement(e);t.async=!0;",
    "        t.src=v;s=b.getElementsByTagName(e)[0];",
    "        s.parentNode.insertBefore(t,s)}(window, document,'script',",
    "        'https://connect.facebook.net/en_US/fbevents.js');",
    `        fbq('init', '${pixelId}');`,
    "        fbq('track', 'PageView');",
    '    </script>',
    '    <noscript><img height="1" width="1" style="display:none"',
    `    src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1"`,
    '    /></noscript>',
    '    <!-- End Meta Pixel Code -->',
  ].join('\n');
}

function listHtmlFiles() {
  const files = [];
  for (const dir of HTML_DIRS) {
    const abs = path.join(REPO_ROOT, dir);
    if (!fs.existsSync(abs) || !fs.statSync(abs).isDirectory()) continue;
    for (const name of fs.readdirSync(abs)) {
      if (name.endsWith('.html')) {
        files.push(path.join(abs, name));
      }
    }
  }
  return files;
}

function main() {
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  const pixelId = config.fbPixelId;
  if (!pixelId || !/^\d+$/.test(pixelId)) {
    console.error('Invalid fbPixelId in site-config.json');
    process.exit(1);
  }

  const files = listHtmlFiles();
  const pixelIdRegex = /fbq\('init',\s*'\d+'\)/g;
  const noscriptIdRegex = /facebook\.com\/tr\?id=\d+/g;
  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    const rel = path.relative(REPO_ROOT, file);

    if (content.includes('Meta Pixel Code') || content.includes('fbevents.js')) {
      // Already has pixel — update the ID in case it changed
      const before = content;
      content = content.replace(pixelIdRegex, `fbq('init', '${pixelId}')`);
      content = content.replace(noscriptIdRegex, `facebook.com/tr?id=${pixelId}`);
      if (content !== before) {
        fs.writeFileSync(file, content, 'utf8');
        updated++;
        console.log(`  🔄 Updated pixel ID: ${rel}`);
      } else {
        skipped++;
      }
    } else if (content.includes('</head>')) {
      // No pixel yet — insert before </head>
      content = content.replace('</head>', pixelSnippet(pixelId) + '\n</head>');
      fs.writeFileSync(file, content, 'utf8');
      inserted++;
      console.log(`  ✅ Inserted pixel:   ${rel}`);
    } else {
      console.log(`  ⚠️  No </head> tag:  ${rel}`);
    }
  }

  console.log('');
  console.log(`Done — inserted: ${inserted}, updated: ${updated}, already OK: ${skipped}`);
  console.log(`Total files scanned: ${files.length}`);
}

main();
