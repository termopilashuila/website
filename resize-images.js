const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Default resize options
const DEFAULT_MAX_WIDTH = 1200;
const DEFAULT_QUALITY = 80;

/**
 * Resize an image and replace the original
 * @param {string} imagePath - Path to the image
 * @param {Object} options - Resize options
 * @param {number} options.maxWidth - Maximum width of the resized image
 * @param {number} options.quality - Quality of the resized image (1-100)
 */
async function resizeImage(imagePath, options = {}) {
  const maxWidth = options.maxWidth || DEFAULT_MAX_WIDTH;
  const quality = options.quality || DEFAULT_QUALITY;
  
  try {
    // Get image metadata
    const metadata = await sharp(imagePath).metadata();
    
    // Only resize if the image is larger than maxWidth
    if (metadata.width > maxWidth) {
      const ext = path.extname(imagePath).toLowerCase();
      let processedImage;
      
      // Create a temp file path
      const tempPath = `${imagePath}.temp`;
      
      // Process based on image type
      if (ext === '.jpg' || ext === '.jpeg') {
        processedImage = await sharp(imagePath)
          .resize({ width: maxWidth, withoutEnlargement: true })
          .jpeg({ quality: quality })
          .toBuffer();
      } else if (ext === '.png') {
        processedImage = await sharp(imagePath)
          .resize({ width: maxWidth, withoutEnlargement: true })
          .png({ quality: quality })
          .toBuffer();
      } else {
        console.log(`Unsupported file type: ${ext} for file: ${imagePath}`);
        return;
      }
      
      // Get original file size
      const originalSize = fs.statSync(imagePath).size;
      const processedSize = processedImage.length;
      
      // Only save if the processed image is smaller than the original
      if (processedSize < originalSize) {
        // Write to temp file
        fs.writeFileSync(tempPath, processedImage);
        
        // Replace original with temp file
        fs.unlinkSync(imagePath);
        fs.renameSync(tempPath, imagePath);
        
        console.log(`Resized: ${imagePath} (${metadata.width}x${metadata.height} -> ${maxWidth}px max width, ${(originalSize/1024).toFixed(2)}KB -> ${(processedSize/1024).toFixed(2)}KB)`);
      } else {
        console.log(`Skipped: ${imagePath} (resize would increase file size: ${(originalSize/1024).toFixed(2)}KB -> ${(processedSize/1024).toFixed(2)}KB)`);
      }
    } else {
      console.log(`Skipped: ${imagePath} (already ${metadata.width}px width, below the ${maxWidth}px threshold)`);
    }
  } catch (error) {
    console.error(`Error processing ${imagePath}:`, error);
  }
}

/**
 * Process all images in a directory
 * @param {string} dirPath - Path to the directory
 * @param {Object} options - Resize options
 */
async function processDirectory(dirPath, options = {}) {
  // Create directory if it doesn't exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
    return;
  }
  
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const ext = path.extname(file).toLowerCase();
    
    // Skip if not jpg or png
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      continue;
    }
    
    await resizeImage(filePath, options);
  }
  
  console.log('All images processed!');
}

// Command line interface
function main() {
  const args = process.argv.slice(2);
  
  // Print usage if no args provided
  if (args.length === 0) {
    console.log(`
Usage: node resize-images.js [path] [options]

Arguments:
  path            Path to an image or directory (default: "./resize")

Options:
  --width=N       Maximum width in pixels (default: ${DEFAULT_MAX_WIDTH})
  --quality=N     Image quality 1-100 (default: ${DEFAULT_QUALITY})

Examples:
  node resize-images.js
  node resize-images.js ./resize/my-image.jpg
  node resize-images.js ./resize --width=800 --quality=90
    `);
    return;
  }
  
  // Parse arguments
  const imagePath = args[0].match(/^--/) ? './resize' : args[0];
  const options = {};
  
  for (const arg of args) {
    if (arg.match(/^--width=/)) {
      options.maxWidth = parseInt(arg.split('=')[1]);
    } else if (arg.match(/^--quality=/)) {
      options.quality = parseInt(arg.split('=')[1]);
    }
  }
  
  // Process file or directory
  if (fs.existsSync(imagePath)) {
    const stats = fs.statSync(imagePath);
    if (stats.isDirectory()) {
      processDirectory(imagePath, options);
    } else {
      resizeImage(imagePath, options);
    }
  } else {
    console.error(`Error: Path ${imagePath} does not exist`);
    process.exit(1);
  }
}

main(); 