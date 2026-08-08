/**
 * Normalises <link rel="canonical"> and <meta property="og:url"> on every page
 * to that page's own clean URL.
 *
 *     node generate-canonicals.js
 *
 * Why this exists: the canonicals shipped with this site were written as if
 * every page lived at the site root with a .php extension. Pages inside
 * subfolders therefore pointed at URLs that do not exist — e.g.
 * adhd/adhd-and-anxiety.php claimed https://embracelives.com/adhd-and-anxiety.php,
 * which returns a hard 404. Google treats that as "the real version of this page
 * is missing" and drops the page.
 *
 * Only tags that already exist are rewritten — this never injects a canonical
 * into a page that deliberately has none (e.g. thank-you.php).
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const BASE = 'https://embracelives.com';

const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', 'api', 'components', '_external', 'assets', 'assets_backup', 'practitioner-images', 'practitioner-images_backup', 'embrace-media', 'videos', '__pycache__']);
const SKIP_FILES = new Set(['build.php']);

function collect(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      collect(full, out);
    } else if (entry.name.endsWith('.php')) {
      const rel = path.relative(ROOT, full).split(path.sep).join('/');
      if (SKIP_FILES.has(rel)) continue;
      out.push(rel);
    }
  }
  return out;
}

/** `about.php` -> `/about`; `index.php` -> `/`; `locations/index.php` -> `/locations` */
function canonicalFor(rel) {
  if (rel === 'index.php') return BASE + '/';
  return BASE + '/' + rel.replace(/\/index\.php$/, '').replace(/\.php$/, '');
}

let canonFixed = 0, ogFixed = 0, canonMissing = [], ogMissing = [], unchanged = 0;

for (const rel of collect(ROOT).sort()) {
  const full = path.join(ROOT, rel);
  const want = canonicalFor(rel);
  let src = fs.readFileSync(full, 'utf8');
  const before = src;

  const canonTag = /<link\b[^>]*rel=["']canonical["'][^>]*>/i;
  if (canonTag.test(src)) {
    src = src.replace(canonTag, tag => {
      if (!/href=/.test(tag)) return tag;
      const updated = tag.replace(/href=(["'])[^"']*\1/, `href="${want}"`);
      if (updated !== tag) canonFixed++;
      return updated;
    });
  } else {
    canonMissing.push(rel);
  }

  const ogTag = /<meta\b[^>]*property=["']og:url["'][^>]*>/i;
  if (ogTag.test(src)) {
    src = src.replace(ogTag, tag => {
      if (!/content=/.test(tag)) return tag;
      const updated = tag.replace(/content=(["'])[^"']*\1/, `content="${want}"`);
      if (updated !== tag) ogFixed++;
      return updated;
    });
  } else {
    ogMissing.push(rel);
  }

  if (src !== before) fs.writeFileSync(full, src);
  else unchanged++;
}

console.log(`Canonicals rewritten: ${canonFixed} | og:url rewritten: ${ogFixed} | already correct: ${unchanged}`);
if (canonMissing.length) console.log(`  No canonical tag (left alone): ${canonMissing.join(', ')}`);
if (ogMissing.length) console.log(`  No og:url tag (left alone): ${ogMissing.join(', ')}`);
