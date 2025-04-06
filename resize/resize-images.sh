#!/bin/bash

# resize-images.sh - A shell script to resize images
# Usage: ./resize-images.sh [path] [options]

# Make sure it's executable with: chmod +x resize-images.sh

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Verify paths
echo "Execution directory: $(pwd)"
echo "Script directory: $SCRIPT_DIR"
echo "JS file path: $SCRIPT_DIR/resize-images.js"
if [ -f "$SCRIPT_DIR/resize-images.js" ]; then
    echo "✅ JS file exists"
else
    echo "❌ JS file not found at $SCRIPT_DIR/resize-images.js"
    exit 1
fi

# Forward all arguments to the Node.js script
node "$SCRIPT_DIR/resize-images.js" "$@" 