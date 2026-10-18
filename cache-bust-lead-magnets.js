/**
 * Appends a content-hash query string to the three shared lead-magnet assets
 * everywhere they're referenced, so a browser's cache of them busts the
 * instant their content changes.
 *
 *     node cache-bust-lead-magnets.js
 *
 * Why this exists: unlike the site's other built assets (e.g.
 * assets/index-B-kGA3UA.css, whose filename itself is a content hash),
 * assets/lead-magnets.js, assets/lead-magnets.css and assets/recaptcha.js
 * are referenced by a bare, unversioned path. nginx sends
 * `Cache-Control: max-age=2592000` (30 days) on them, so any browser that
 * had the old file cached kept silently running it for up to a month after
 * a deploy — exactly how a tested-and-working change on the dev server (no
 * caching there) could still look unchanged on the live site. Run this
 * after every edit to one of the three files; it is idempotent, so running
 * it with no underlying change is a no-op.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = __dirname;
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', '_external', 'assets_backup',
  'practitioner-images_backup', 'embrace-media', 'videos', '__pycache__']);

const ASSETS = {
  'lead-magnets.js': path.join(ROOT, 'assets', 'lead-magnets.js'),
  'lead-magnets.css': path.join(ROOT, 'assets', 'lead-magnets.css'),
  'recaptcha.js': path.join(ROOT, 'assets', 'recaptcha.js'),
};

function hashOf(file) {
  const buf = fs.readFileSync(file);
  return crypto.createHash('sha256').update(buf).digest('hex').slice(0, 8);
}

/** Rewrites every /assets/<name> reference inside `content` to carry ?v=<version>. */
function versionReferences(content, name, version) {
  const re = new RegExp(
    '((?:href|src)=["\']|["\'])(/assets/' + name.replace('.', '\\.') + ')(?:\\?v=[0-9a-f]+)?(["\'])',
    'g'
  );
  return content.replace(re, (match, prefix, assetPath, suffix) => `${prefix}${assetPath}?v=${version}${suffix}`);
}

// lead-magnets.js carries its own reference to recaptcha.js (the dynamically
// injected <script> in loadCaptcha()), so versioning that reference changes
// lead-magnets.js's own bytes. Resolve that self-reference and write it back
// to disk FIRST, so the hash computed for lead-magnets.js below reflects its
// true final content — otherwise every other file gets stamped with a
// since-stale hash, and the script only converges after being run twice.
const recaptchaVersion = hashOf(ASSETS['recaptcha.js']);
const leadMagnetsJsPath = ASSETS['lead-magnets.js'];
const selfFixed = versionReferences(fs.readFileSync(leadMagnetsJsPath, 'utf8'), 'recaptcha.js', recaptchaVersion);
fs.writeFileSync(leadMagnetsJsPath, selfFixed);

const versions = { 'recaptcha.js': recaptchaVersion };
for (const [name, file] of Object.entries(ASSETS)) {
  if (name === 'recaptcha.js') continue;
  versions[name] = hashOf(file);
}

function collectFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      collectFiles(full, out);
    } else if (entry.name.endsWith('.php') || entry.name.endsWith('.js')) {
      out.push(full);
    }
  }
  return out;
}

let touched = 0;
for (const file of collectFiles(ROOT)) {
  let src = fs.readFileSync(file, 'utf8');
  const before = src;

  for (const [name, version] of Object.entries(versions)) {
    src = versionReferences(src, name, version);
  }

  if (src !== before) {
    fs.writeFileSync(file, src);
    touched++;
  }
}

console.log('Asset versions:', versions);
console.log(`Files updated: ${touched}`);
