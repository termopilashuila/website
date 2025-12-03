#!/usr/bin/env node
/**
 * Restores the service worker placeholder after deployment.
 * This keeps git history clean with just the placeholder.
 * 
 * Usage: node scripts/restore-service-worker.js
 */

const fs = require('fs');
const path = require('path');

const SERVICE_WORKER_PATH = path.join(__dirname, '..', 'service-worker.js');
const PLACEHOLDER = '__BUILD_TIMESTAMP__';

function restoreServiceWorker() {
  try {
    let content = fs.readFileSync(SERVICE_WORKER_PATH, 'utf8');
    
    // Pattern to match stamped timestamp: termopilas-YYYYMMDD-HHMMSS
    const timestampPattern = /termopilas-\d{8}-\d{6}/g;
    
    if (timestampPattern.test(content)) {
      // Replace timestamp with placeholder
      content = content.replace(timestampPattern, `termopilas-${PLACEHOLDER}`);
      fs.writeFileSync(SERVICE_WORKER_PATH, content, 'utf8');
      console.log('✓ Service worker restored to placeholder');
    } else if (content.includes(PLACEHOLDER)) {
      console.log('✓ Service worker already has placeholder');
    } else {
      console.log('⚠ Warning: Could not find timestamp or placeholder in service-worker.js');
    }
    
  } catch (error) {
    console.error('Error restoring service worker:', error.message);
    process.exit(1);
  }
}

restoreServiceWorker();

