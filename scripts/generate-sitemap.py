#!/usr/bin/env python3
"""
Sitemap generator for termopilas.co (Python version)
- Discovers public .html files in repo root, eventos/, trabajo/, blog/, blog/posts/
- Computes lastmod using Git commit time (fallback to file mtime)
- Assigns changefreq and priority per policy
- Resolves representative images
- Writes sitemap.xml with proper namespaces and deterministic ordering
"""

import os
import subprocess
from pathlib import Path
from datetime import datetime
import xml.etree.ElementTree as ET

SITE_URL = 'https://termopilas.co'
REPO_ROOT = Path(__file__).parent.parent
OUTPUT_FILE = REPO_ROOT / 'sitemap.xml'

TARGET_DIRECTORIES = [
    '.',
    'eventos',
    'trabajo',
    'blog',
    'blog/posts',
]

PRIMARY_PAGES = {
    'alojamiento.html',
    'tour.html',
    'coliving.html',
    'eventos.html',
    'blog.html',
    'catalogo.html',
    'cata-vinos.html',
    'pago.html',
}

UTILITY_PAGES = {
    'privacidad.html',
    'whatsapp.html',
    'registro.html',
}

FALLBACK_IMAGES = [
    'assets/images/home/header.jpg',
    'assets/images/header.png',
]


def collect_html_files(relative_dir):
    """Recursively collect .html files in a directory (relative to REPO_ROOT)."""
    collected = []
    dir_path = REPO_ROOT / relative_dir

    if not dir_path.exists():
        return collected

    for entry in dir_path.iterdir():
        entry_rel_path = Path(relative_dir) / entry.name

        if entry.is_dir():
            # Skip hidden and non-target directories
            if entry.name.startswith('.'):
                continue

            # Skip large dependency/vendor folders
            skip_dirs = {
                'node_modules', 'venv', '.git', 'appscript', 'assets',
                'octorate', 'resize', 'terraform', 'src', 'styles', 'scripts',
                'archive', 'cata', 'coliving/gracias.html', 'tour/error.html',
                'tour/gracias.html', 'tour/index.html'
            }
            if entry.name in skip_dirs and relative_dir == '.':
                continue

            # Allow recursion inside target directories
            if (relative_dir == '.' or
                str(relative_dir) in ['eventos', 'trabajo', 'blog'] or
                str(relative_dir).startswith('blog')):
                nested = collect_html_files(entry_rel_path)
                collected.extend(nested)
            continue

        if entry.is_file() and entry.name.endswith('.html'):
            collected.append(str(entry_rel_path))

    return collected


def get_git_last_commit_iso(file_abs_path):
    """Get last commit date for a file from git."""
    try:
        result = subprocess.run(
            ['git', 'log', '-1', '--format=%cI', '--', str(file_abs_path)],
            cwd=REPO_ROOT,
            capture_output=True,
            text=True,
            timeout=5
        )
        output = result.stdout.strip()
        if result.returncode == 0 and output:
            return output
    except Exception:
        pass
    return None


def get_last_mod_iso(file_abs_path):
    """Get last modification date (git or file mtime)."""
    from_git = get_git_last_commit_iso(file_abs_path)
    if from_git:
        return from_git

    # Fallback to file mtime
    stat = os.stat(file_abs_path)
    return datetime.fromtimestamp(stat.st_mtime).isoformat() + 'Z'


def to_canonical_url(relative_html_path):
    """Convert relative path to canonical URL."""
    if relative_html_path == 'index.html':
        return f'{SITE_URL}/'
    return f'{SITE_URL}/{relative_html_path.replace(os.sep, "/")}'


def file_exists(rel_path):
    """Check if a file exists relative to REPO_ROOT."""
    return (REPO_ROOT / rel_path).exists()


def guess_image_for_page(relative_html_path):
    """Guess the representative image for a page."""
    # Blog posts: assets/images/blog/[slug]/main.(jpg|png|jpeg)
    if relative_html_path.startswith(str(Path('blog') / 'posts')):
        slug = Path(relative_html_path).stem
        for ext in ['jpg', 'jpeg', 'png']:
            candidate = f'assets/images/blog/{slug}/main.{ext}'
            if file_exists(candidate):
                return f'{SITE_URL}/{candidate}'

    # Fallbacks
    for fallback in FALLBACK_IMAGES:
        if file_exists(fallback):
            return f'{SITE_URL}/{fallback}'

    return None


def classify_page(relative_html_path):
    """Classify page to assign changefreq, priority, and group."""
    base = os.path.basename(relative_html_path)

    if relative_html_path == 'index.html':
        return {'changefreq': 'monthly', 'priority': 1.0, 'group': 0}

    if base in PRIMARY_PAGES:
        changefreq = 'weekly' if base == 'blog.html' else 'monthly'
        return {'changefreq': changefreq, 'priority': 0.9, 'group': 1}

    if base in UTILITY_PAGES:
        return {'changefreq': 'yearly', 'priority': 0.3, 'group': 2}

    if relative_html_path.startswith('eventos' + os.sep):
        return {'changefreq': 'monthly', 'priority': 0.8, 'group': 3}

    if relative_html_path.startswith('trabajo' + os.sep):
        return {'changefreq': 'monthly', 'priority': 0.6, 'group': 4}

    if relative_html_path.startswith(str(Path('blog') / 'posts')):
        return {'changefreq': 'monthly', 'priority': 0.8, 'group': 6}

    if relative_html_path.startswith('blog' + os.sep):
        return {'changefreq': 'monthly', 'priority': 0.7, 'group': 5}

    # Other public pages
    return {'changefreq': 'monthly', 'priority': 0.7, 'group': 5}


def xml_escape(text):
    """Escape special XML characters."""
    return (text.replace('&', '&amp;')
            .replace('<', '&lt;')
            .replace('>', '&gt;')
            .replace('"', '&quot;')
            .replace("'", '&apos;'))


def main():
    """Generate sitemap.xml."""
    # Pre-compute slugs from blog/posts to avoid duplicating top-level blog post duplicates
    blog_posts = collect_html_files(str(Path('blog') / 'posts'))
    post_slugs = {Path(p).stem for p in blog_posts}

    # Collect files from target directories
    all_files_nested = []
    for target_dir in TARGET_DIRECTORIES:
        all_files_nested.extend(collect_html_files(target_dir))

    all_files = list(set(all_files_nested))

    # Normalize and filter
    filtered_files = []
    for p in all_files:
        # Remove leading './'
        p = p.lstrip('./').lstrip('.\\')
        parts = Path(p).parts

        if len(parts) > 0 and parts[0] == '.':
            continue

        # Exclude 404 pages
        if os.path.basename(p).lower() == '404.html':
            continue

        # Exclude template files
        if os.path.basename(p).lower() == 'template.html':
            continue

        # Exclude duplicate blog top-level posts when a posts/* of same slug exists
        if len(parts) >= 2 and parts[0] == 'blog' and parts[1] != 'posts':
            slug = Path(p).stem
            if slug in post_slugs:
                continue

        # Include root .html files only (except target subdirectories)
        if parts[0] not in ['eventos', 'trabajo', 'blog'] and len(parts) > 1:
            continue

        filtered_files.append(p)

    all_files = filtered_files

    # Ensure index.html is included if present
    if file_exists('index.html') and 'index.html' not in all_files:
        all_files.append('index.html')

    # Build entries with metadata
    entries = []
    for rel_path in all_files:
        abs_path = REPO_ROOT / rel_path
        loc = to_canonical_url(rel_path)
        lastmod = get_last_mod_iso(abs_path)
        img = guess_image_for_page(rel_path)
        classification = classify_page(rel_path)

        entries.append({
            'relPath': rel_path,
            'loc': loc,
            'lastmod': lastmod,
            'changefreq': classification['changefreq'],
            'priority': classification['priority'],
            'image': img,
            'group': classification['group']
        })

    # Sort: root, primary, other root, eventos, trabajo, other, blog posts by lastmod desc
    def sort_key(entry):
        if entry['group'] == 6:  # blog posts by lastmod desc
            return (entry['group'], -datetime.fromisoformat(entry['lastmod'].replace('Z', '+00:00')).timestamp())
        return (entry['group'], entry['relPath'])

    entries.sort(key=sort_key)

    # Write XML
    lines = ['<?xml version="1.0" encoding="UTF-8"?>']
    lines.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">')

    for entry in entries:
        lines.append('  <url>')
        lines.append(f'    <loc>{xml_escape(entry["loc"])}</loc>')
        lines.append(f'    <lastmod>{xml_escape(entry["lastmod"])}</lastmod>')
        lines.append(f'    <changefreq>{entry["changefreq"]}</changefreq>')
        lines.append(f'    <priority>{entry["priority"]:.1f}</priority>')
        if entry['image']:
            lines.append('    <image:image>')
            lines.append(f'      <image:loc>{xml_escape(entry["image"])}</image:loc>')
            lines.append('    </image:image>')
        lines.append('  </url>')

    lines.append('</urlset>')

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines) + '\n')

    num_urls = len(entries)
    num_images = sum(1 for e in entries if e['image'])
    print(f'Generated sitemap.xml with {num_urls} URLs ({num_images} images)')


if __name__ == '__main__':
    main()
