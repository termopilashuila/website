#!/usr/bin/env python3
"""
Add PWA manifest and meta tags to all HTML pages
"""

import os
import re
from pathlib import Path

# PWA meta tags to add
PWA_META_TAGS = '''
    <!-- PWA Manifest -->
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#F29F05">

    <!-- Apple Touch Icon -->
    <link rel="apple-touch-icon" href="/assets/images/icons/apple-touch-icon.png">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="Termópilas">

    <!-- Microsoft Tiles -->
    <meta name="msapplication-TileColor" content="#F29F05">
    <meta name="msapplication-TileImage" content="/assets/images/icons/icon-144x144.png">
'''

def should_process_file(filepath):
    """Check if file should be processed (skip offline.html)"""
    filename = os.path.basename(filepath)
    return filename != 'offline.html'

def has_pwa_tags(content):
    """Check if file already has PWA tags"""
    return 'rel="manifest"' in content or 'manifest.json' in content

def add_pwa_tags(filepath):
    """Add PWA meta tags to an HTML file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip if already has PWA tags
    if has_pwa_tags(content):
        return False, "Already has PWA tags"

    # Find the closing </head> tag
    if '</head>' not in content:
        return False, "No </head> tag found"

    # Insert PWA tags before </head>
    updated_content = content.replace('</head>', PWA_META_TAGS + '\n</head>')

    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(updated_content)

    return True, "PWA tags added"

def main():
    print("PWA Meta Tags Injector")
    print("=" * 60)

    website_dir = Path(".")
    html_files = []

    # Find all HTML files (root level)
    html_files.extend(website_dir.glob("*.html"))

    # Find HTML files in subdirectories
    for subdir in ['cata', 'coliving', 'eventos', 'tour', 'trabajo']:
        subdir_path = website_dir / subdir
        if subdir_path.exists():
            html_files.extend(subdir_path.glob("*.html"))

    processed = 0
    skipped = 0
    errors = 0

    for filepath in sorted(html_files):
        filename = str(filepath)

        if not should_process_file(filepath):
            print(f"⊗ Skipped: {filename} (offline page)")
            skipped += 1
            continue

        try:
            success, message = add_pwa_tags(filepath)
            if success:
                print(f"✓ Updated: {filename}")
                processed += 1
            else:
                print(f"- Skipped: {filename} ({message})")
                skipped += 1
        except Exception as e:
            print(f"✗ Error: {filename} - {e}")
            errors += 1

    print("\n" + "=" * 60)
    print(f"✅ Processed: {processed} files")
    print(f"⊗ Skipped: {skipped} files")
    if errors > 0:
        print(f"✗ Errors: {errors} files")

    return 0 if errors == 0 else 1

if __name__ == "__main__":
    exit(main())
