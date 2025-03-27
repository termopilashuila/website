# Image Resizer

This directory contains scripts for resizing images for the Finca Termópilas website.

## Usage

1. Place the images you want to resize in this directory or specify a different path
2. Run the resize script using one of the following methods:

### Method 1: Using the shell script

```bash
# From the project root:
./resize/resize-images.sh

# Resize a specific image (from project root):
./resize/resize-images.sh assets/images/home/my-image.jpg

# Resize all images in a specific directory:
./resize/resize-images.sh assets/images/gallery --width=800 --quality=90

# Run the script from inside the resize directory:
cd resize
./resize-images.sh
```

### Method 2: Using npm

```bash
# From the project root:
npm run resize-images

# Resize with custom parameters:
npm run resize-images -- assets/images/tour --width=800 --quality=90
```

## Default Settings

- Maximum width: 1200px (height is adjusted proportionally)
- Image quality: 80%
- Supported formats: JPG/JPEG and PNG

## Notes

- The script will only resize images that are larger than the specified maximum width
- Original images will be replaced with the resized versions
- The aspect ratio is preserved
- Smaller images remain unchanged 