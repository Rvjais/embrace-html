/**
 * Adds the image attributes that Core Web Vitals depend on, across every page.
 *
 *     node optimise-images.js --dry
 *     node optimise-images.js
 *
 * For each <img> pointing at a local file it adds, only where missing:
 *
 *   width / height   intrinsic pixel size, read from the file itself. This is
 *                    what lets the browser reserve space before the image
 *                    arrives, which is the single biggest lever on CLS. It is
 *                    safe here because the site's Tailwind preflight already
 *                    sets img { max-width: 100%; height: auto }, so CSS still
 *                    controls the rendered size and the attributes only supply
 *                    the aspect ratio.
 *   decoding="async" keeps image decode off the main thread.
 *   loading="lazy"   for images past the first few in document order, so
 *                    offscreen images stop competing with the ones on screen.
 *   fetchpriority    "high" on the first content image, which is usually the
 *                    LCP element, and it is otherwise fetched at low priority.
 *
 * Dimensions are parsed in pure Node because this machine has no image tooling.
 * PNG, JPEG, GIF, WebP and SVG are all handled; anything unrecognised is left
 * alone rather than guessed at.
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DRY = process.argv.includes('--dry');

const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', 'api', '_external', 'assets_backup',
  'practitioner-images_backup', '__pycache__']);

/** Images that must never be lazy-loaded: they are in the header on every page. */
const NEVER_LAZY = /Logo-|Favicon/i;

/** How many images at the top of a page stay eager. */
const EAGER_COUNT = 3;

/* --------------------------------------------------------- size extraction */

function sizeOfPng(buf) {
  if (buf.length < 24 || buf.readUInt32BE(0) !== 0x89504e47) return null;
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

function sizeOfGif(buf) {
  if (buf.length < 10 || buf.toString('ascii', 0, 3) !== 'GIF') return null;
  return { w: buf.readUInt16LE(6), h: buf.readUInt16LE(8) };
}

function sizeOfJpeg(buf) {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let i = 2;
  while (i < buf.length - 9) {
    if (buf[i] !== 0xff) { i++; continue; }
    const marker = buf[i + 1];
    // SOF0-SOF15, excluding DHT/JPG/DAC which share the range
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
    }
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return null;
}

function sizeOfWebp(buf) {
  if (buf.length < 30 || buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WEBP') return null;
  const fmt = buf.toString('ascii', 12, 16);
  if (fmt === 'VP8 ') return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
  if (fmt === 'VP8L') {
    const b = buf.readUInt32LE(21);
    return { w: (b & 0x3fff) + 1, h: ((b >> 14) & 0x3fff) + 1 };
  }
  if (fmt === 'VP8X') return { w: (buf.readUIntLE(24, 3) & 0xffffff) + 1, h: (buf.readUIntLE(27, 3) & 0xffffff) + 1 };
  return null;
}

function sizeOfSvg(buf) {
  const head = buf.toString('utf8', 0, Math.min(buf.length, 4000));
  const tag = head.match(/<svg[^>]*>/i);
  if (!tag) return null;
  const w = tag[0].match(/\bwidth="([\d.]+)(px)?"/i);
  const h = tag[0].match(/\bheight="([\d.]+)(px)?"/i);
  if (w && h) return { w: Math.round(+w[1]), h: Math.round(+h[1]) };
  const vb = tag[0].match(/viewBox="\s*[\d.-]+\s+[\d.-]+\s+([\d.]+)\s+([\d.]+)/i);
  if (vb) return { w: Math.round(+vb[1]), h: Math.round(+vb[2]) };
  return null;
}

const sizeCache = new Map();
function intrinsicSize(file) {
  if (sizeCache.has(file)) return sizeCache.get(file);
  let out = null;
  try {
    const fd = fs.openSync(file, 'r');
    const buf = Buffer.alloc(Math.min(65536, fs.fstatSync(fd).size));
    fs.readSync(fd, buf, 0, buf.length, 0);
    fs.closeSync(fd);
    out = sizeOfPng(buf) || sizeOfJpeg(buf) || sizeOfGif(buf) || sizeOfWebp(buf) || sizeOfSvg(buf);
  } catch (e) { out = null; }
  sizeCache.set(file, out);
  return out;
}

/* -------------------------------------------------------------- rewriting */

function collect(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || SKIP_DIRS.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) collect(full, out);
    else if (/\.(php|html)$/.test(e.name) && e.name !== 'build.php') out.push(full);
  }
  return out;
}

const stats = { files: 0, dims: 0, lazy: 0, decoding: 0, priority: 0, unresolved: new Map() };

for (const file of collect(ROOT)) {
  let html = fs.readFileSync(file, 'utf8');
  const before = html;
  let index = 0;

  html = html.replace(/<img\b[^>]*>/gi, (tag) => {
    const srcM = tag.match(/\bsrc="([^"]+)"/i);
    if (!srcM) return tag;
    const src = srcM[1];
    if (/^(https?:|data:)/i.test(src)) return tag;

    const position = index++;
    let out = tag;

    // Dimensions, from the file on disk.
    if (!/\bwidth=/i.test(out) && !/\bheight=/i.test(out)) {
      const rel = decodeURIComponent(src.split('?')[0]).replace(/^\//, '');
      const onDisk = path.join(ROOT, rel);
      const size = fs.existsSync(onDisk) ? intrinsicSize(onDisk) : null;
      if (size && size.w > 0 && size.h > 0) {
        out = out.replace(/<img\b/i, `<img width="${size.w}" height="${size.h}"`);
        stats.dims++;
      } else if (!fs.existsSync(onDisk)) {
        stats.unresolved.set(src, (stats.unresolved.get(src) || 0) + 1);
      }
    }

    if (!/\bdecoding=/i.test(out)) {
      out = out.replace(/<img\b/i, '<img decoding="async"');
      stats.decoding++;
    }

    const neverLazy = NEVER_LAZY.test(src);
    if (!/\bloading=/i.test(out) && !neverLazy && position >= EAGER_COUNT) {
      out = out.replace(/<img\b/i, '<img loading="lazy"');
      stats.lazy++;
    }

    // The first content image is the likely LCP element on these layouts.
    if (position === (NEVER_LAZY.test(src) ? -1 : 1) && !/\bfetchpriority=/i.test(out) && !neverLazy) {
      out = out.replace(/<img\b/i, '<img fetchpriority="high"');
      stats.priority++;
    }

    return out;
  });

  if (html !== before) {
    stats.files++;
    if (!DRY) fs.writeFileSync(file, html);
  }
}

console.log(`${DRY ? '[dry run] ' : ''}${stats.files} files changed.`);
console.log(`  width/height added:   ${stats.dims}`);
console.log(`  decoding="async":     ${stats.decoding}`);
console.log(`  loading="lazy":       ${stats.lazy}`);
console.log(`  fetchpriority="high": ${stats.priority}`);
if (stats.unresolved.size) {
  console.log(`  could not resolve ${stats.unresolved.size} src value(s) to a file:`);
  [...stats.unresolved].slice(0, 8).forEach(([s, n]) => console.log(`    x${n}  ${s}`));
}
