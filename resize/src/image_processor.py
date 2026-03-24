import os
import sys
from pathlib import Path
from typing import Dict, Optional, Tuple, Union

from PIL import Image


# Default resize options
DEFAULT_MAX_WIDTH = 600
DEFAULT_QUALITY = 80
DEFAULT_WEBP_QUALITY = 80
DEFAULT_AVIF_QUALITY = 75

# Supported file extensions
SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png']


def resize_image(image_path: str, options: Dict = None) -> None:
    """
    Resize an image and replace the original if the new file is smaller.
    Also generates WebP and AVIF variants for modern browsers.

    Args:
        image_path: Path to the image
        options: Resize options including max_width, quality, generate_webp, generate_avif
    """
    if options is None:
        options = {}

    # Check if file extension is supported
    file_extension = os.path.splitext(image_path)[1].lower()
    if file_extension not in SUPPORTED_EXTENSIONS:
        print(f"Skipped: {image_path} (unsupported file type: {file_extension})")
        return

    max_width = options.get('max_width', DEFAULT_MAX_WIDTH)
    quality = options.get('quality', DEFAULT_QUALITY)
    generate_webp = options.get('generate_webp', True)
    generate_avif = options.get('generate_avif', True)
    webp_quality = options.get('webp_quality', DEFAULT_WEBP_QUALITY)
    avif_quality = options.get('avif_quality', DEFAULT_AVIF_QUALITY)

    try:
        # Open the image
        with Image.open(image_path) as img:
            # Convert RGBA to RGB for formats that don't support transparency
            if img.mode in ('RGBA', 'LA', 'P'):
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
                img = background

            # Get original dimensions
            original_width, original_height = img.size
            original_size = os.path.getsize(image_path)

            # Determine target dimensions
            if original_width > max_width:
                ratio = max_width / original_width
                new_height = int(original_height * ratio)
                target_width = max_width
                target_height = new_height
            else:
                target_width = original_width
                target_height = original_height

            # Resize if necessary
            if original_width > max_width:
                resized_img = img.resize((target_width, target_height), Image.LANCZOS)
            else:
                resized_img = img

            # Save optimized original format
            temp_path = f"{image_path}.temp"
            if file_extension in ['.jpg', '.jpeg']:
                resized_img.save(temp_path, 'JPEG', quality=quality, optimize=True)
            elif file_extension == '.png':
                resized_img.save(temp_path, 'PNG', quality=quality, optimize=True)

            # Compare file sizes and replace if smaller
            processed_size = os.path.getsize(temp_path)
            original_replaced = False
            if processed_size < original_size or original_width > max_width:
                os.remove(image_path)
                os.rename(temp_path, image_path)
                print(f"Resized: {image_path} ({original_width}x{original_height} -> {target_width}x{target_height}, "
                      f"{original_size/1024:.2f}KB -> {processed_size/1024:.2f}KB)")
                original_replaced = True
            else:
                os.remove(temp_path)
                if original_width <= max_width:
                    print(f"Skipped resize: {image_path} (already {original_width}px width, below the {max_width}px threshold)")
                else:
                    print(f"Skipped resize: {image_path} (resize would increase file size: "
                          f"{original_size/1024:.2f}KB -> {processed_size/1024:.2f}KB)")

            # Generate WebP variant
            if generate_webp:
                webp_path = os.path.splitext(image_path)[0] + '.webp'
                resized_img.save(webp_path, 'WEBP', quality=webp_quality, method=6)
                webp_size = os.path.getsize(webp_path)
                savings_pct = ((original_size - webp_size) / original_size * 100) if original_size > 0 else 0
                print(f"  → WebP: {webp_path} ({webp_size/1024:.2f}KB, {savings_pct:.1f}% smaller)")

            # Generate AVIF variant
            if generate_avif:
                try:
                    avif_path = os.path.splitext(image_path)[0] + '.avif'
                    resized_img.save(avif_path, 'AVIF', quality=avif_quality)
                    avif_size = os.path.getsize(avif_path)
                    savings_pct = ((original_size - avif_size) / original_size * 100) if original_size > 0 else 0
                    print(f"  → AVIF: {avif_path} ({avif_size/1024:.2f}KB, {savings_pct:.1f}% smaller)")
                except Exception as avif_error:
                    print(f"  → AVIF generation failed (may need pillow-avif-plugin): {str(avif_error)}")

    except Exception as e:
        print(f"Error processing {image_path}: {str(e)}")


def process_directory(dir_path: str, options: Dict = None) -> None:
    """
    Process all images in a directory.
    
    Args:
        dir_path: Path to the directory
        options: Resize options
    """
    if options is None:
        options = {}
    
    # Create directory if it doesn't exist
    if not os.path.exists(dir_path):
        os.makedirs(dir_path, exist_ok=True)
        print(f"Created directory: {dir_path}")
        return
    
    # Get all files in the directory
    for file in os.listdir(dir_path):
        file_path = os.path.join(dir_path, file)
        
        # Process subdirectories recursively
        if os.path.isdir(file_path):
            print(f"Processing subdirectory: {file_path}")
            process_directory(file_path, options)
            continue
            
        # Skip files that are not images with supported extensions
        file_extension = os.path.splitext(file)[1].lower()
        if file_extension not in SUPPORTED_EXTENSIONS:
            print(f"Skipped: {file_path} (unsupported file type: {file_extension})")
            continue
        
        resize_image(file_path, options)
    
    print(f"Completed processing directory: {dir_path}") 