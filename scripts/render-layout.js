#!/usr/bin/env node
/*
  Pre-renders the shared header (navbar + hero H1) and footer into the static HTML
  of the main pages, so nav links, the H1 and the footer NAP exist without JavaScript.

  - The markup comes from src/ts/components/layout.ts, the same module the browser
    bundle uses (transpiled on the fly with the TypeScript compiler), so the static
    output and the client-side rendering cannot drift apart.
  - <header class="hero ..."> and <footer ...> get data-prerendered="true"; header.ts and
    footer.ts then only attach behaviour (menu toggle) instead of re-rendering.
  - Landing pages with their own design (grupos, campamentovino) get a compact footer
    between <!-- layout:footer-lite:start --> and <!-- layout:footer-lite:end --> markers.
  - Idempotent: running it twice produces the same files.

  Usage:
    node scripts/render-layout.js          # rewrite the pages
    node scripts/render-layout.js --check  # exit 1 if any page is out of date (CI)
*/

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ts = require('typescript');

const REPO_ROOT = path.resolve(__dirname, '..');
const LAYOUT_TS = path.join(REPO_ROOT, 'src/ts/components/layout.ts');

// Pages that use the shared header/footer (dist/main.js)
const PAGES = [
  'index.html',
  'alojamiento.html',
  'catalogo.html',
  'salon.html',
  'galeria.html',
  'ubicacion.html',
  'tour.html',
  'preguntas-frecuentes.html',
  'trabajo.html',
  'trabajo/cocinero.html',
  'trabajo/conserje.html',
  'trabajo/recepcionista.html',
  'trabajo/web-developer.html',
  'privacidad.html',
  'terminos.html',
];

// Stand-alone landing pages: they keep their own header, only get a compact NAP footer
const LITE_FOOTER_PAGES = ['grupos.html', 'campamentovino.html'];

const GENERATED_NOTE = '<!-- Generado por scripts/render-layout.js desde src/ts/components/layout.ts: no editar a mano -->';

function loadLayoutModule() {
  const source = fs.readFileSync(LAYOUT_TS, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019 },
    fileName: LAYOUT_TS,
  });
  const module = { exports: {} };
  vm.runInNewContext(outputText, {
    module,
    exports: module.exports,
    require: (id) => {
      throw new Error(`layout.ts must not import runtime modules (tried "${id}")`);
    },
    encodeURIComponent,
    JSON,
    Date,
  }, { filename: 'layout.ts' });
  return module.exports;
}

function escapeAttr(value) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

// Replace (or add) an attribute in an opening tag string
function setAttr(openTag, name, value) {
  const re = new RegExp(`\\s${name}="[^"]*"`);
  const attr = ` ${name}="${escapeAttr(value)}"`;
  if (re.test(openTag)) return openTag.replace(re, attr);
  return openTag.replace(/\s*>$/, `${attr}>`);
}

// Re-indent generated markup (strip the template's common indentation) so it sits nicely in the page
function indent(markup, pad) {
  const lines = markup.split('\n').map((line) => line.replace(/\s+$/, '')).filter(Boolean);
  const common = Math.min(...lines.map((line) => line.match(/^ */)[0].length));
  return lines.map((line) => pad + line.slice(common)).join('\n');
}

function renderPage(layout, relPath, html) {
  const headerConfig = layout.resolveHeaderConfig('/' + relPath);
  if (!headerConfig) throw new Error(`${relPath}: page has no shared header`);

  const headerRe = /<header\b[^>]*\bclass="hero\b[^"]*"[^>]*>[\s\S]*?<\/header>/;
  const headerMatch = html.match(headerRe);
  if (!headerMatch) throw new Error(`${relPath}: <header class="hero ..."> not found`);
  let openTag = headerMatch[0].match(/^<header\b[^>]*>/)[0];
  if (headerConfig.heroClass) openTag = setAttr(openTag, 'class', headerConfig.heroClass);
  if (headerConfig.heroImage) openTag = setAttr(openTag, 'style', layout.heroInlineStyle(headerConfig.heroImage));
  openTag = setAttr(openTag, 'data-prerendered', 'true');
  const heroContent = layout.renderHeroContent(headerConfig);
  const headerInner = indent(layout.renderNavbar(headerConfig), '        ') + (heroContent ? '\n' + indent(heroContent, '        ') : '');
  const header = `${openTag}\n        ${GENERATED_NOTE}\n${headerInner}\n    </header>`;

  const footerRe = /<footer\b[^>]*>[\s\S]*?<\/footer>/;
  const footerMatch = html.match(footerRe);
  if (!footerMatch) throw new Error(`${relPath}: <footer> not found`);
  let footerOpen = footerMatch[0].match(/^<footer\b[^>]*>/)[0];
  footerOpen = setAttr(footerOpen, 'data-prerendered', 'true');
  const footerInner = layout.renderFooter(layout.resolveFooterConfig('/' + relPath));
  const footer = `${footerOpen}\n        ${GENERATED_NOTE}\n${indent(footerInner, '        ')}\n    </footer>`;

  return html.replace(headerRe, () => header).replace(footerRe, () => footer);
}

function renderLiteFooter(layout) {
  const cfg = layout.defaultFooterConfig;
  const phone = cfg.contact.phone;
  const formattedPhone = `(+57) ${phone.slice(3)}`;
  const links = [
    ['/', 'Inicio'],
    ['/alojamiento.html', 'Alojamiento'],
    ['/tour.html', 'Tour de vino y cacao'],
    ['/salon.html', 'Salón de eventos'],
    ['/grupos.html', 'Grupos y empresas'],
    ['/ubicacion.html', 'Cómo llegar'],
    ['/preguntas-frecuentes.html', 'Preguntas frecuentes'],
  ];
  return `<!-- layout:footer-lite:start -->
${GENERATED_NOTE}
<style>
  .site-footer-lite{background:#1f1a14;color:#e9e1d3;font-family:inherit;font-size:.9rem;line-height:1.6;padding:2rem 1.25rem;text-align:center}
  .site-footer-lite a{color:#e9e1d3;text-decoration:none}
  .site-footer-lite a:hover{color:#F29F05;text-decoration:underline}
  .site-footer-lite nav{display:flex;flex-wrap:wrap;justify-content:center;gap:.4rem 1.2rem;margin-bottom:1rem}
  .site-footer-lite address{font-style:normal;opacity:.85}
</style>
<footer class="site-footer-lite" role="contentinfo">
  <nav aria-label="Enlaces de Finca Termópilas">
    ${links.map(([href, text]) => `<a href="${href}">${text}</a>`).join('\n    ')}
  </nav>
  <address>
    <strong>Finca Termópilas</strong> · ${cfg.location.address.slice(0, 2).join(' ')}, ${cfg.location.address.slice(2).join(', ')}, Colombia<br>
    <a href="tel:${phone}">${formattedPhone}</a> · <a href="mailto:${cfg.contact.email}">${cfg.contact.email}</a>
  </address>
</footer>
<!-- layout:footer-lite:end -->`;
}

function renderLitePage(layout, relPath, html) {
  const block = renderLiteFooter(layout);
  const markerRe = /<!-- layout:footer-lite:start -->[\s\S]*?<!-- layout:footer-lite:end -->/;
  if (markerRe.test(html)) return html.replace(markerRe, () => block);
  // First run: insert right before </body>
  const idx = html.lastIndexOf('</body>');
  if (idx === -1) throw new Error(`${relPath}: </body> not found`);
  return html.slice(0, idx) + block + '\n' + html.slice(idx);
}

function main() {
  const check = process.argv.includes('--check');
  const layout = loadLayoutModule();
  const stale = [];
  const jobs = [
    ...PAGES.map((p) => [p, renderPage]),
    ...LITE_FOOTER_PAGES.map((p) => [p, renderLitePage]),
  ];
  for (const [relPath, render] of jobs) {
    const file = path.join(REPO_ROOT, relPath);
    const html = fs.readFileSync(file, 'utf8');
    const out = render(layout, relPath, html);
    if (out !== html) {
      stale.push(relPath);
      if (!check) fs.writeFileSync(file, out);
    }
  }
  if (check) {
    if (stale.length) {
      console.error(`❌ Header/footer out of date in: ${stale.join(', ')}. Run: node scripts/render-layout.js`);
      process.exit(1);
    }
    console.log(`✅ Static header/footer up to date (${jobs.length} pages)`);
  } else {
    console.log(`✅ Static header/footer rendered (${stale.length} of ${jobs.length} pages changed)`);
  }
}

main();
