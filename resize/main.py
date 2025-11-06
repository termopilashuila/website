#!/usr/bin/env python3
"""
Image Resizer for Finca Termópilas Website

This script resizes images to a specified width while maintaining the aspect ratio.
Original images are only replaced if the new version is smaller in file size.

Usage:
  python main.py [path ...] [options]

Arguments:
  path               Path(s) to image(s) or directory/directories (default: "./")
                     Multiple paths can be specified

Options:
  --width=N          Maximum width in pixels (default: 1200)
  --quality=N        Image quality 1-100 (default: 80)

Examples:
  python main.py
  python main.py assets/images/gallery
  python main.py assets/images/blog/featured-image.jpg --width=800 --quality=90
  python main.py image1.jpg image2.jpg image3.jpg --width=400 --quality=50
  python main.py ../assets/images/blog/header.png ../assets/images/catalog/header.png --width=400
"""

import os
import sys
import argparse

# Add parent directory to sys.path when running from resize directory
if os.path.basename(os.getcwd()) == 'resize':
    from src.image_processor import resize_image, process_directory, DEFAULT_MAX_WIDTH, DEFAULT_QUALITY
else:
    from resize.src.image_processor import resize_image, process_directory, DEFAULT_MAX_WIDTH, DEFAULT_QUALITY


def parse_arguments():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(
        description="Resize images for the Finca Termópilas website",
        formatter_class=argparse.RawTextHelpFormatter
    )
    
    parser.add_argument(
        "paths", 
        nargs="*", 
        default=["./"],
        help="Path(s) to image(s) or directory/directories (default: ./)"
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
    
    # Handle default case when no paths are provided
    paths = args.paths if args.paths else ["./"]
    
    # Set options
    options = {
        'max_width': args.width,
        'quality': args.quality
    }
    
    # Process each file or directory
    errors = []
    for path in paths:
        if os.path.exists(path):
            if os.path.isdir(path):
                process_directory(path, options)
            else:
                resize_image(path, options)
        else:
            errors.append(path)
            print(f"Error: Path {path} does not exist")
    
    # Exit with error code if any paths were invalid
    if errors:
        sys.exit(1)


if __name__ == "__main__":
    main() 