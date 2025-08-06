const { MarkdownToEventConverter } = require('../dist/utils/utils/markdown-to-event.js');

async function main() {
  const converter = new MarkdownToEventConverter();
  
  // Process all markdown files in markdown/eventos directory
  console.log('🚀 Processing markdown files to event entries...');
  await converter.processMarkdownFiles();
  console.log('✅ Event processing complete!');
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.length > 0) {
  // Process specific file if provided
  const filePath = args[0];
  console.log(`🚀 Processing single event file: ${filePath}`);
  
  const converter = new MarkdownToEventConverter();
  converter.processSingleFile(filePath)
    .then(() => {
      console.log('✅ Single event file processing complete!');
    })
    .catch(error => {
      console.error('❌ Error processing event file:', error);
      process.exit(1);
    });
} else {
  // Process all files
  main().catch(error => {
    console.error('❌ Error processing event markdown files:', error);
    process.exit(1);
  });
}