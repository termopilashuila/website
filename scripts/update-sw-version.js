/**
 * Updates the service worker cache version with a timestamp
 * Run this script during the build process to ensure cache busting
 */

const fs = require('fs');
const path = require('path');

const SW_PATH = path.resolve(__dirname, '../service-worker.js');

// Generate version based on current date and time
// Format: YYYY.MM.DD.HHmmss (e.g., 2025.12.03.143052)
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
  let content = fs.readFileSync(SW_PATH, 'utf8');
  
  // Replace the CACHE_NAME value
  content = content.replace(
    /const CACHE_NAME = ['"]termopilas-cache-v[^'"]*['"]/,
    `const CACHE_NAME = '${CACHE_VERSION}'`
  );
  
  fs.writeFileSync(SW_PATH, content, 'utf8');
  
  console.log(`✅ Service worker cache version updated: ${CACHE_VERSION}`);
} catch (error) {
  console.error('❌ Failed to update service worker version:', error.message);
  process.exit(1);
}

