# Image Resizer

This directory contains scripts for resizing images for the Finca Termópilas website.

## Setup

### Creating a Virtual Environment

```bash
cd resize

# From the resize directory:
python -m venv venv

# Activate the virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## Usage

1. Place the images you want to resize in this directory or specify a different path
2. Run the resize script using one of the following methods:

### Using Python

```bash
# From the project root:
python main.py

# Resize a specific image (from project root):
python main.py ../assets/images/**/header.png --width=900 --quality=100

# Resize all images in a specific directory:
python main.py ../assets/images/eventos --width=600 --quality=80

# Run the script from inside the resize directory:
cd resize
python main.py
```

### Using npm (Legacy method)

```bash
# From the project root:
npm run resize-images

# Resize with custom parameters:
npm run resize-images -- assets/images/tour --width=800 --quality=90
```

## Default Settings

- Maximum width: 1200px (height is adjusted proportionally)
- Image quality: 80%
- WebP quality: 80%
- AVIF quality: 75%
- Supported formats: JPG/JPEG and PNG

## Features

- Automatically generates WebP and AVIF variants for modern browsers
- Resizes images that exceed the maximum width while maintaining aspect ratio
- Only replaces original images if the new version is smaller
- WebP provides 25-50% smaller file sizes with excellent browser support (95%+)
- AVIF provides even better compression (30-60% smaller) with growing browser support (85%+)

## Output

For each processed image, the script generates:
- Original format (JPEG/PNG) - optimized and resized if needed
- `.webp` variant - WebP version for modern browsers
- `.avif` variant - AVIF version for cutting-edge browsers

Example: `tour-hero.jpg` → `tour-hero.jpg`, `tour-hero.webp`, `tour-hero.avif`

## Notes

- The script will only resize images that are larger than the specified maximum width
- Original images will be replaced with the resized versions only if smaller
- The aspect ratio is preserved
- Smaller images remain unchanged
- Original images are only replaced if the new version is smaller in file size
- WebP and AVIF variants are always generated regardless of original size
- RGBA/transparent images are converted to RGB with white background for JPEG/AVIF compatibility 