import os
import sys
from pathlib import Path
from typing import Dict, Optional, Tuple, Union

from PIL import Image


# Default resize options
DEFAULT_MAX_WIDTH = 1200
DEFAULT_QUALITY = 80


def resize_image(image_path: str, options: Dict = None) -> None:
    """
    Resize an image and replace the original if the new file is smaller.
    
    Args:
        image_path: Path to the image
        options: Resize options including maxWidth and quality
    """
    if options is None:
        options = {}
    
    max_width = options.get('max_width', DEFAULT_MAX_WIDTH)
    quality = options.get('quality', DEFAULT_QUALITY)
    
    try:
        # Open the image
        with Image.open(image_path) as img:
            # Get original dimensions
            original_width, original_height = img.size
            original_size = os.path.getsize(image_path)
            
            # Only resize if the image is larger than max_width
            if original_width > max_width:
                # Calculate new height maintaining aspect ratio
                ratio = max_width / original_width
                new_height = int(original_height * ratio)
                
                # Create a temporary path
                temp_path = f"{image_path}.temp"
                
                # Resize the image
                resized_img = img.resize((max_width, new_height), Image.LANCZOS)
                
                # Save with appropriate format and quality
                file_extension = os.path.splitext(image_path)[1].lower()
                
                if file_extension in ['.jpg', '.jpeg']:
                    resized_img.save(temp_path, 'JPEG', quality=quality, optimize=True)
                elif file_extension == '.png':
                    resized_img.save(temp_path, 'PNG', quality=quality, optimize=True)
                else:
                    print(f"Unsupported file type: {file_extension} for file: {image_path}")
                    return
                
                # Compare file sizes
                processed_size = os.path.getsize(temp_path)
                
                # Only replace if the processed image is smaller
                if processed_size < original_size:
                    os.remove(image_path)
                    os.rename(temp_path, image_path)
                    print(f"Resized: {image_path} ({original_width}x{original_height} -> {max_width}px max width, "
                          f"{original_size/1024:.2f}KB -> {processed_size/1024:.2f}KB)")
                else:
                    os.remove(temp_path)
                    print(f"Skipped: {image_path} (resize would increase file size: "
                          f"{original_size/1024:.2f}KB -> {processed_size/1024:.2f}KB)")
            else:
                print(f"Skipped: {image_path} (already {original_width}px width, below the {max_width}px threshold)")
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
        file_extension = os.path.splitext(file)[1].lower()
        
        # Process only image files
        if file_extension in ['.jpg', '.jpeg', '.png'] and os.path.isfile(file_path):
            resize_image(file_path, options)
    
    print("All images processed!") 