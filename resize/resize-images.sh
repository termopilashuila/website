#!/bin/bash

# resize-images.sh - A shell script to resize images
# Usage: ./resize-images.sh [path] [options]

# Make sure it's executable with: chmod +x resize-images.sh

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Forward all arguments to the Node.js script
node "$SCRIPT_DIR/resize-images.js" "$@" 