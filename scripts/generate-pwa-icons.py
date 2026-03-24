#!/usr/bin/env python3
"""
Generate PWA icons in multiple sizes from the logo
"""

from PIL import Image, ImageDraw
import os

# Icon sizes needed for PWA
ICON_SIZES = [72, 96, 128, 144, 192, 512]

# Paths
LOGO_PATH = "assets/images/logo.png"
ICONS_DIR = "assets/images/icons"
FAVICON_PATH = "assets/images/favicon.png"

def create_maskable_icon(logo, size, padding_percent=10):
    """
    Create a maskable icon with safe area padding.
    Maskable icons need 10% padding on all sides for adaptive icons.
    """
    # Create a new image with background color (Finca's accent color)
    bg_color = (242, 159, 5)  # #F29F05
    icon = Image.new('RGB', (size, size), bg_color)

    # Calculate logo size with padding
    padding = int(size * (padding_percent / 100))
    logo_size = size - (2 * padding)

    # Resize logo to fit with padding
    logo_resized = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)

    # Convert to RGBA if needed
    if logo_resized.mode != 'RGBA':
        logo_resized = logo_resized.convert('RGBA')

    # Paste logo in center (handle transparency)
    icon_rgba = icon.convert('RGBA')
    icon_rgba.paste(logo_resized, (padding, padding), logo_resized if logo_resized.mode == 'RGBA' else None)

    # Convert back to RGB for final output
    final_icon = Image.new('RGB', icon_rgba.size, bg_color)
    final_icon.paste(icon_rgba, (0, 0), icon_rgba if icon_rgba.mode == 'RGBA' else None)

    return final_icon

def main():
    print("PWA Icon Generator")
    print("=" * 50)

    # Check if logo exists
    if not os.path.exists(LOGO_PATH):
        print(f"❌ Logo not found at {LOGO_PATH}")
        return 1

    # Create icons directory if it doesn't exist
    os.makedirs(ICONS_DIR, exist_ok=True)
    print(f"✓ Icons directory: {ICONS_DIR}")

    # Load the logo
    try:
        logo = Image.open(LOGO_PATH)
        print(f"✓ Loaded logo: {logo.size[0]}x{logo.size[1]} ({logo.mode})")
    except Exception as e:
        print(f"❌ Error loading logo: {e}")
        return 1

    # Generate icons
    print("\nGenerating PWA icons...")
    for size in ICON_SIZES:
        try:
            icon = create_maskable_icon(logo, size)
            output_path = os.path.join(ICONS_DIR, f"icon-{size}x{size}.png")
            icon.save(output_path, 'PNG', optimize=True)
            file_size = os.path.getsize(output_path)
            print(f"✓ Generated {size}x{size} icon ({file_size:,} bytes)")
        except Exception as e:
            print(f"❌ Error generating {size}x{size} icon: {e}")

    # Also create an apple-touch-icon (180x180 for iOS)
    try:
        apple_icon = create_maskable_icon(logo, 180)
        apple_path = os.path.join(ICONS_DIR, "apple-touch-icon.png")
        apple_icon.save(apple_path, 'PNG', optimize=True)
        file_size = os.path.getsize(apple_path)
        print(f"✓ Generated Apple Touch Icon 180x180 ({file_size:,} bytes)")
    except Exception as e:
        print(f"❌ Error generating Apple Touch Icon: {e}")

    print("\n" + "=" * 50)
    print(f"✅ Generated {len(ICON_SIZES) + 1} PWA icons successfully!")
    print(f"   Icons saved to: {ICONS_DIR}/")

    return 0

if __name__ == "__main__":
    exit(main())
