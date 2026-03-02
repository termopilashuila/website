# Image resize analysis

Scan date: 2025-02-07

## Summary

| Metric | Count |
|--------|-------|
| **Total raster images** (PNG/JPG/JPEG) in repo | 224 |
| **Images wider than 1200px** (candidates for resize) | 38 |
| **Largest files** | eventos/corporativos.png, eventos/quince-anos.png (~10 MB each) |

Images are under `assets/images/` and `archive/`. The **resize** service (`resize/main.py`) supports PNG and JPG/JPEG; it only resizes when width &gt; max_width and only overwrites when the new file is smaller.

## Which images should go through resize

**All images under `assets/images/`** that are wider than the chosen max width (e.g. 1200px) should be processed. The resize tool skips smaller images and only replaces when the result is smaller in file size.

### Highest impact (width &gt; 1200px, large file size)

| Width | Size (KB) | Path |
|-------|-----------|------|
| 2560 px | 10311 KB | assets/images/eventos/corporativos.png |
| 2560 px | 10211 KB | assets/images/eventos/quince-anos.png |
| 2560 px | 2034 KB | assets/images/galeria/galeria-01.jpeg |
| 2560 px | 1946 KB | assets/images/tour/tour-orchids.png |
| 2560 px | 1934 KB | assets/images/tour/header.png |
| 2560 px | 1882 KB | assets/images/galeria/galeria-14.jpeg |
| 2560 px | 1869 KB | assets/images/galeria/galeria-07.jpeg |
| … | … | (all 23 galeria/*.jpeg at 2560px) |
| 2036 px | 7047 KB | assets/images/tour/tour-zen.png |
| 2034 px | 5723 KB | assets/images/tour/tour-mountains.png |
| 1712 px | 3255 KB | assets/images/eventos/experiencia-evento.jpg |
| 1600 px | 680 KB | assets/images/tour/tour-river.png |
| 1600 px | 633 KB | assets/images/tour/tour-gorge.png |
| 1600 px | 566 KB | assets/images/tour/tour-chocolate.png |
| 1600 px | 549 KB | assets/images/tour/tour-overview.png |
| 1446 px | 3122 KB | assets/images/eventos/interior-salon.png |
| 1424 px | 4276 KB | assets/images/tour/tour-cacao.png |
| 1312 px | 3382 KB | assets/images/eventos/vista-exterior.jpg |

### Directories to run resize on (from repo root)

- **assets/images** — main site images (headers, gallery, tour, eventos, blog, etc.). Use `--width=1200 --quality=80` (or 100 for headers if desired).
- **archive/** — optional; same tool can be run on archive paths if you want archived assets optimized.

### Excluded from resize

- **SVG** — vector; no resize needed.
- **Small icons** (e.g. favicon, small logos) — resize script skips when width ≤ max_width and when resizing would increase file size.

## How to run resize

From project root (requires Python 3 and Pillow in `resize/`):

```bash
cd resize
pip install -r requirements.txt   # once
python main.py ../assets/images --width=1200 --quality=80
```

Or via npm (from project root):

```bash
npm run resize-images
```

For custom paths or options (e.g. `--width=800 --quality=90`), run from `resize/` (see `resize/README.md`).

## Including resize in the npm build

- **resize-images** is available as an npm script and can be run before the normal build.
- **Full build with image optimization**:  
  `npm run build:with-images`  
  This runs `resize-images` then `build` (webpack + update-sw). Use this when you want optimized assets as part of the build.
- Resize requires Python 3 and Pillow: `cd resize && pip install -r requirements.txt`. If Python/Pillow is not available, use `npm run build` only (no resize step).

To re-scan images and regenerate this report, run the image scan (e.g. script or manual `sips`/`find` on macOS) and update this file.
