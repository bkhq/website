---
title:
  en: Usage Guide
  zh: 使用指南
order: 1
---

## Quick Start

Install Image Compressor via your preferred package manager:

```bash
# macOS
brew install image-compressor

# Windows (winget)
winget install ImageCompressor

# Linux (snap)
sudo snap install image-compressor
```

Or download the installer directly from the [releases page](https://example.com).

## CLI Usage

Image Compressor includes a powerful command-line interface for scripting and automation:

```bash
# Compress a single image
imgc compress photo.jpg

# Compress with custom quality (0-100)
imgc compress --quality 80 photo.jpg

# Batch compress an entire directory
imgc compress --recursive ./images/

# Convert to WebP format
imgc convert --format webp --quality 85 ./images/*.png

# Watch a folder for new images
imgc watch --quality 75 --format webp ~/Downloads/
```

### CLI Options Reference

```
Usage: imgc <command> [options] <files...>

Commands:
  compress    Compress images in place or to output directory
  convert     Convert images between formats
  watch       Monitor directory for new images
  info        Display image metadata and compression stats

Options:
  -q, --quality <n>     Quality level 0-100 (default: 80)
  -f, --format <type>   Output format: jpg, png, webp (default: same as input)
  -o, --output <dir>    Output directory (default: overwrite in place)
  -r, --recursive       Process subdirectories
  --lossless            Use lossless compression
  --strip-metadata      Remove EXIF/IPTC data
  --keep-gps            Preserve GPS coordinates (stripped by default)
  --max-width <px>      Resize if wider than specified pixels
  --max-height <px>     Resize if taller than specified pixels
  --threads <n>         Number of parallel workers (default: CPU cores)
  -v, --verbose         Show detailed processing info
  --dry-run             Preview changes without writing files
```

## Node.js API

Use Image Compressor programmatically in your build pipeline:

```typescript
import { compress, convert, ImageOptions } from 'image-compressor';

// Basic compression
const result = await compress('photo.jpg', { quality: 80 });
console.log(`Saved ${result.savedBytes} bytes (${result.savedPercent}%)`);

// Batch compression with options
const options: ImageOptions = {
  quality: 75,
  format: 'webp',
  stripMetadata: true,
  maxWidth: 1920,
  progressive: true,
};

const files = await compress('./images/**/*.{jpg,png}', options);
for (const file of files) {
  console.log(`${file.path}: ${file.originalSize} → ${file.compressedSize}`);
}
```

### Integration with Build Tools

**Vite Plugin:**

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import imageCompressor from 'image-compressor/vite';

export default defineConfig({
  plugins: [
    imageCompressor({
      include: ['**/*.{jpg,png,webp}'],
      exclude: ['node_modules/**'],
      quality: 80,
      format: 'webp',
      // Only compress in production builds
      enabled: process.env.NODE_ENV === 'production',
    }),
  ],
});
```

**Webpack Loader:**

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|webp)$/i,
        use: [
          {
            loader: 'image-compressor/webpack',
            options: {
              quality: 80,
              progressive: true,
              stripMetadata: true,
            },
          },
        ],
      },
    ],
  },
};
```

## GitHub Actions

Automate image compression in your CI/CD pipeline:

```yaml
# .github/workflows/compress-images.yml
name: Compress Images

on:
  pull_request:
    paths:
      - '**.jpg'
      - '**.jpeg'
      - '**.png'
      - '**.webp'

jobs:
  compress:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Compress new/changed images
        uses: example/image-compressor-action@v2
        with:
          quality: 80
          format: preserve
          strip-metadata: true
          commit-changes: true
          commit-message: 'chore: compress images [skip ci]'
```

## Configuration File

Create an `.imgcrc.json` in your project root for persistent settings:

```json
{
  "quality": 80,
  "format": "preserve",
  "stripMetadata": true,
  "keepGps": false,
  "progressive": true,
  "lossless": false,
  "maxWidth": 2560,
  "threads": 4,
  "ignore": [
    "node_modules/**",
    ".git/**",
    "dist/**",
    "**/*.ico"
  ],
  "overrides": [
    {
      "match": "**/thumbnails/**",
      "quality": 60,
      "maxWidth": 400
    },
    {
      "match": "**/hero-*",
      "quality": 90,
      "lossless": false
    }
  ]
}
```

## Output Example

When running in verbose mode, you'll see detailed compression stats:

```
$ imgc compress --verbose --recursive ./photos/

Processing 47 images with 8 threads...

  photos/landscape.jpg   4.2 MB → 1.1 MB  (73.8% saved)  ✓
  photos/portrait.png    8.7 MB → 2.3 MB  (73.6% saved)  ✓
  photos/icon.png        24 KB  → 18 KB   (25.0% saved)  ✓
  photos/banner.webp     1.8 MB → 890 KB  (51.7% saved)  ✓
  photos/tiny.jpg        3.2 KB → 3.2 KB  (skipped, already optimal)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Total: 47 files processed in 2.3s
  Saved: 89.4 MB (68.2% average reduction)
  Skipped: 3 files (already optimal)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```
