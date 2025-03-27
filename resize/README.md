# Image Resizer

This directory is used for resizing images for the Finca Termópilas website.

## Usage

1. Place the images you want to resize in this directory
2. Run the resize script using one of the following methods:

### Method 1: Using the shell script

```bash
# Resize all images in the resize directory with default settings
./resize-images.sh

# Resize a specific image
./resize-images.sh resize/my-image.jpg

# Resize with custom width and quality
./resize-images.sh resize --width=800 --quality=90
```

### Method 2: Using npm

```bash
# Resize all images in the resize directory with default settings
npm run resize-images

# Resize with custom parameters
npm run resize-images -- resize/my-image.jpg --width=800 --quality=90
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