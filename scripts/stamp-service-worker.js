#!/usr/bin/env node
/**
 * Stamps the service worker with a build timestamp.
 * This ensures cache invalidation on each deployment.
 * 
 * Usage: node scripts/stamp-service-worker.js
 * 
 * The script replaces __BUILD_TIMESTAMP__ in service-worker.js
 * with a timestamp in format: YYYYMMDD-HHMMSS
 */

const fs = require('fs');
const path = require('path');

const SERVICE_WORKER_PATH = path.join(__dirname, '..', 'service-worker.js');
const PLACEHOLDER = '__BUILD_TIMESTAMP__';

// Generate timestamp: YYYYMMDD-HHMMSS
function generateTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}-${hours}${minutes}${seconds}`;
}

function stampServiceWorker() {
  try {
    // Read the service worker file
    let content = fs.readFileSync(SERVICE_WORKER_PATH, 'utf8');
    
    // Check if placeholder exists
    if (!content.includes(PLACEHOLDER)) {
      // Check if already stamped (contains a timestamp pattern)
      const timestampPattern = /termopilas-\d{8}-\d{6}/;
      if (timestampPattern.test(content)) {
        // Replace existing timestamp with placeholder first, then stamp
        content = content.replace(timestampPattern, `termopilas-${PLACEHOLDER}`);
      } else {
        console.error('Error: Placeholder __BUILD_TIMESTAMP__ not found in service-worker.js');
        console.error('Make sure service-worker.js contains: const CACHE_NAME = \'termopilas-__BUILD_TIMESTAMP__\';');
        process.exit(1);
      }
    }
    
    // Generate new timestamp
    const timestamp = generateTimestamp();
    
    // Replace placeholder with timestamp
    const stampedContent = content.replace(PLACEHOLDER, timestamp);
    
    // Write back to file
    fs.writeFileSync(SERVICE_WORKER_PATH, stampedContent, 'utf8');
    
    console.log(`✓ Service worker stamped with: ${timestamp}`);
    console.log(`  Cache name: termopilas-${timestamp}`);
    
  } catch (error) {
    console.error('Error stamping service worker:', error.message);
    process.exit(1);
  }
}

// Run the script
stampServiceWorker();

