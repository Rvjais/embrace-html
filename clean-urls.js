/**
 * Removes the .php extension from internal links across the site.
 *
 *     node clean-urls.js --dry
 *     node clean-urls.js
 *
 * Canonical tags, Open Graph URLs and the sitemap already declare extensionless
 * URLs, and the server already serves them, so every internal link pointing at
 * "/about.php" was sending visitors and crawlers to a URL the page itself says
 * is not canonical. This aligns the links with what the site already claims.
 *
 * Only href and src attribute values are touched. PHP include paths keep their
 * extension: those are resolved on disk by PHP, not by the web server, and
 * stripping them would break every page.
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DRY = process.argv.includes('--dry');
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', 'api', '_external', 'assets',
  'assets_backup', 'practitioner-images', 'practitioner-images_backup', 'embrace-media',
  'videos', '__pycache__', 'media']);

function collect(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || SKIP_DIRS.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) collect(full, out);
    else if (/\.(php|html|js)$/.test(e.name)) out.push(full);
  }
  return out;
}

/** "/adhd/adhd.php" -> "/adhd/adhd";  "/locations/index.php" -> "/locations" */
function clean(url) {
  let out = url.replace(/\.php(?=$|[?#])/, '');
  out = out.replace(/(^|\/)index(?=$|[?#])/, '$1');
  if (out === '') out = '/';
  if (out.length > 1 && out.endsWith('/')) out = out.slice(0, -1);
  return out || '/';
}

const stats = { files: 0, links: 0 };
const generators = [];

for (const file of collect(ROOT)) {
  const rel = path.relative(ROOT, file).split(path.sep).join('/');
  if (rel === 'clean-urls.js' || rel === 'build.js') continue;

  let text = fs.readFileSync(file, 'utf8');
  const before = text;

  // href="/x.php" and src="/x.php", including query strings and fragments.
  text = text.replace(/(\b(?:href|src)=")(\/[^"]*?\.php(?:[?#][^"]*)?)(")/g, (m, a, url, b) => {
    stats.links++;
    return a + clean(url) + b;
  });

  // Links built in JavaScript, e.g. '/appointment.php' inside a template string.
  // Component paths are excluded: those are PHP include targets resolved on
  // disk, and the generators match on them literally. Same for anything that is
  // compared against a filesystem path rather than emitted as a link.
  if (/\.js$/.test(rel)) {
    text = text.replace(/(['"`])(\/[a-z0-9\-\/]*?\.php)(['"`])/gi, (m, q1, url, q2) => {
      if (url.includes('/components/')) return m;
      if (url === '/index.php') return m;   // used as an input path, not a link
      stats.links++;
      return q1 + clean(url) + q2;
    });
  }

  if (text !== before) {
    stats.files++;
    if (!DRY) fs.writeFileSync(file, text);
    if (/^generate-|^inject-|^optimise-/.test(rel)) generators.push(rel);
  }
}

console.log(`${DRY ? '[dry run] ' : ''}${stats.links} links cleaned across ${stats.files} files.`);
if (generators.length) {
  console.log('  generators updated, so future runs emit clean URLs too:');
  generators.forEach(g => console.log(`    ${g}`));
}
