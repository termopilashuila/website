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
python main.py assets/images/blog/nibs-cacao-parfait-bowl/featured-image.jpg --width=400 --quality=50

# Resize all images in a specific directory:
python main.py ../assets/images/coliving --width=600 --quality=80

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
- Supported formats: JPG/JPEG and PNG

## Notes

- The script will only resize images that are larger than the specified maximum width
- Original images will be replaced with the resized versions
- The aspect ratio is preserved
- Smaller images remain unchanged 
- Original images are only replaced if the new version is smaller in file size 