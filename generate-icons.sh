#!/bin/bash

# This script generates favicon and icon files for the website
# Requires ImageMagick to be installed: brew install imagemagick

# Create favicon.png (32x32)
convert assets/images/hero-bg.jpg -resize 32x32 assets/images/favicon.png

# Create apple-touch-icon.png (180x180)
convert assets/images/hero-bg.jpg -resize 180x180 assets/images/apple-touch-icon.png

# Create icon-192x192.png for PWA
convert assets/images/hero-bg.jpg -resize 192x192 assets/images/icon-192x192.png

# Create icon-512x512.png for PWA
convert assets/images/hero-bg.jpg -resize 512x512 assets/images/icon-512x512.png

# Create screenshot1.jpg (1280x720)
convert assets/images/hero-bg.jpg -resize 1280x720 assets/images/screenshot1.jpg

# Create screenshot2.jpg (1280x720)
convert assets/images/couples.jpg -resize 1280x720 assets/images/screenshot2.jpg

echo "Icon generation complete!" 