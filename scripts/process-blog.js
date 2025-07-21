const { MarkdownToBlogConverter } = require('../dist/utils/utils/markdown-to-blog.js');

async function main() {
  const converter = new MarkdownToBlogConverter();
  
  // Process all markdown files in markdown/blog directory
  console.log('🚀 Processing markdown files to blog entries...');
  await converter.processMarkdownFiles();
  console.log('✅ Blog processing complete!');
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.length > 0) {
  // Process specific file if provided
  const filePath = args[0];
  console.log(`🚀 Processing single file: ${filePath}`);
  
  const converter = new MarkdownToBlogConverter();
  converter.processSingleFile(filePath)
    .then(() => {
      console.log('✅ Single file processing complete!');
    })
    .catch(error => {
      console.error('❌ Error processing file:', error);
      process.exit(1);
    });
} else {
  // Process all files
  main().catch(error => {
    console.error('❌ Error processing markdown files:', error);
    process.exit(1);
  });
} 