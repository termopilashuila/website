#!/usr/bin/env python3
"""
Image Resizer for Finca Termópilas Website

This script resizes images to a specified width while maintaining the aspect ratio.
Original images are only replaced if the new version is smaller in file size.

Usage:
  python main.py [path] [options]

Arguments:
  path               Path to an image or directory (default: "./")

Options:
  --width=N          Maximum width in pixels (default: 1200)
  --quality=N        Image quality 1-100 (default: 80)

Examples:
  python main.py
  python main.py assets/images/gallery
  python main.py assets/images/blog/featured-image.jpg --width=800 --quality=90
"""

import os
import sys
import argparse
from src.image_processor import resize_image, process_directory, DEFAULT_MAX_WIDTH, DEFAULT_QUALITY


def parse_arguments():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(
        description="Resize images for the Finca Termópilas website",
        formatter_class=argparse.RawTextHelpFormatter
    )
    
    parser.add_argument(
        "path", 
        nargs="?", 
        default="./",
        help="Path to an image or directory (default: ./)"
    )
    
    parser.add_argument(
        "--width", 
        type=int, 
        default=DEFAULT_MAX_WIDTH,
        help=f"Maximum width in pixels (default: {DEFAULT_MAX_WIDTH})"
    )
    
    parser.add_argument(
        "--quality", 
        type=int, 
        default=DEFAULT_QUALITY,
        help=f"Image quality 1-100 (default: {DEFAULT_QUALITY})"
    )
    
    return parser.parse_args()


def main():
    """Main entry point of the script."""
    args = parse_arguments()
    
    # Set options
    options = {
        'max_width': args.width,
        'quality': args.quality
    }
    
    # Process file or directory
    if os.path.exists(args.path):
        if os.path.isdir(args.path):
            process_directory(args.path, options)
        else:
            resize_image(args.path, options)
    else:
        print(f"Error: Path {args.path} does not exist")
        sys.exit(1)


if __name__ == "__main__":
    main() 