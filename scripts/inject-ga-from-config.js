#!/usr/bin/env node
/**
 * Injects GA ID from scripts/site-config.json into all HTML files.
 * Run after changing site-config.json so a single config drives analytics.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const CONFIG_PATH = path.join(__dirname, 'site-config.json');

const HTML_DIRS = ['.', 'cata', 'trabajo', 'blog', 'coliving', 'tour', 'appscript/eventos', 'appscript/tour', 'appscript/subscribe'];

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
  const gaId = config.gaId;
  if (!gaId || !/^G-[A-Z0-9]+$/.test(gaId)) {
    console.error('Invalid gaId in site-config.json');
    process.exit(1);
  }
  const files = listHtmlFiles();
  const gaIdRegex = /G-[A-Z0-9]{10,}/g;
  let total = 0;
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    const before = content;
    content = content.replace(gaIdRegex, gaId);
    if (content !== before) {
      fs.writeFileSync(file, content, 'utf8');
      total++;
    }
  }
  console.log(`✅ GA ID from config applied to ${total} HTML file(s)`);
}

main();
