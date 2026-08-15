/**
 * Places the free-tool entry points across the SEO content pages.
 *
 *     node inject-lead-magnets.js          # apply
 *     node inject-lead-magnets.js --dry    # report what would change
 *
 * Two things get injected:
 *
 *  1. A contextual CTA band immediately above the footer, on every location page
 *     and every condition / audience hub. Which band depends on the page:
 *       neuro  -> ADHD & autism screener   (adhd/, autism/, ADHD+autism locations, school pages)
 *       adult  -> stress & burnout check   (adult-mental-health/, corporate-wellness/, adult pages)
 *       child  -> milestone checker        (everything else in scope)
 *
 *  2. The exit-intent popup, on the main hub pages ONLY (HUB_PAGES below). It is
 *     deliberately not site-wide: a popup on every one of 350+ pages reads as
 *     pushy on a mental health site, and the same visitor would meet it repeatedly.
 *
 * Both are idempotent — re-running never double-injects. The stylesheet and the
 * script tag are added only where they are missing, since the site's Tailwind
 * bundle is purged and does not contain the lm-* classes.
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DRY = process.argv.includes('--dry');

const CSS_TAG = '<link href="/assets/lead-magnets.css" rel="stylesheet"/>';
const JS_TAG = '<script src="/assets/lead-magnets.js"></script>';
const POPUP_INIT = "<script>EmbraceLM.popup({ id: 'lm-popup' });</script>";

/** Folders whose every page is in scope. */
const SCOPE_DIRS = [
  'locations', 'adhd', 'autism', 'speech-therapy', 'occupational-therapy',
  'learning-disabilities', 'child-psychology', 'teen-mental-health',
  'adult-mental-health', 'parent-hub', 'schools-hub', 'corporate-wellness',
];

/** Root-level audience hubs that are also in scope. */
const SCOPE_ROOT_FILES = [
  'children_and_adolescents.php', 'children.php', 'adolescents.php', 'parent.php',
  'teacher.php', 'adult.php', 'individuals.php', 'couples.php', 'partners.php',
  'corporate.php', 'university.php', 'hospitalAndHealthcare.php',
];

/** Pages that also get the popup. Kept short on purpose. */
const HUB_PAGES = new Set([
  'children_and_adolescents.php', 'children.php', 'adolescents.php', 'parent.php', 'adult.php',
  'adhd/adhd.php', 'autism/autism.php',
  'speech-therapy/speech-therapy.php', 'occupational-therapy/occupational-therapy.php',
  'learning-disabilities/learning-disabilities.php', 'child-psychology/child-psychologist.php',
  'teen-mental-health/teen-counselling.php', 'parent-hub/parents.php', 'schools-hub/schools.php',
  'adult-mental-health/adult-counselling.php', 'corporate-wellness/corporate-wellness.php',
]);

/** Decides which band a page gets from its path. */
function bandFor(rel) {
  // Schools get the screener band: the assessment guide it delivers carries the
  // accommodations letter template, which is what teachers actually need.
  const neuro = /^(adhd|autism|schools-hub)\//.test(rel) ||
    /^locations\/(adhd|autism)-/.test(rel) ||
    rel === 'teacher.php';
  if (neuro) return 'neuro';

  const adult = /^(adult-mental-health|corporate-wellness)\//.test(rel) ||
    /^locations\/adult-counselling-/.test(rel) ||
    ['adult.php', 'individuals.php', 'couples.php', 'partners.php', 'corporate.php',
      'university.php', 'hospitalAndHealthcare.php'].includes(rel);
  if (adult) return 'adult';

  return 'child';
}

function collect(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collect(full, out);
    else if (entry.name.endsWith('.php')) out.push(path.relative(ROOT, full).split(path.sep).join('/'));
  }
  return out;
}

const pages = [];
for (const dir of SCOPE_DIRS) {
  const full = path.join(ROOT, dir);
  if (fs.existsSync(full)) pages.push(...collect(full));
}
for (const file of SCOPE_ROOT_FILES) {
  if (fs.existsSync(path.join(ROOT, file))) pages.push(file);
}
pages.sort();

const FOOTER_RE = /([ \t]*)<\?php\s+include\s+__DIR__\s*\.\s*'((?:\/\.\.)*\/components\/footer\.php)';\s*\?>/;

const stats = { band: 0, popup: 0, css: 0, js: 0, skipped: [], counts: { child: 0, neuro: 0, adult: 0 } };

for (const rel of pages) {
  const file = path.join(ROOT, rel);
  let html = fs.readFileSync(file, 'utf8');
  const before = html;

  const footer = html.match(FOOTER_RE);
  if (!footer) { stats.skipped.push(`${rel} (no footer include)`); continue; }

  // '/components/footer.php' -> '/../components/...' etc. Keep the page's own depth prefix.
  const prefix = footer[2].replace('/components/footer.php', '');
  const indent = footer[1];
  const band = bandFor(rel);

  if (!/lead-magnet-band-/.test(html)) {
    const include = `${indent}<?php include __DIR__ . '${prefix}/components/lead-magnet-band-${band}.php'; ?>\n`;
    html = html.replace(FOOTER_RE, `${include}${footer[0]}`);
    stats.band++;
    stats.counts[band]++;
  }

  if (HUB_PAGES.has(rel) && !/lead-magnet-popup/.test(html)) {
    const popup = `<?php include __DIR__ . '${prefix}/components/lead-magnet-popup.php'; ?>\n`;
    if (/<\/body>/i.test(html)) {
      html = html.replace(/<\/body>/i, `${popup}</body>`);
      stats.popup++;
    } else {
      stats.skipped.push(`${rel} (popup: no </body>)`);
    }
  }

  if (!html.includes(CSS_TAG) && /<\/head>/i.test(html)) {
    html = html.replace(/<\/head>/i, `${CSS_TAG}\n</head>`);
    stats.css++;
  }

  if (!html.includes(JS_TAG) && /<\/body>/i.test(html)) {
    html = html.replace(/<\/body>/i, `${JS_TAG}\n</body>`);
    stats.js++;
  }

  // EmbraceLM.popup() must run AFTER lead-magnets.js has loaded. Emit it last,
  // and move it if an earlier run put it in the wrong place.
  if (HUB_PAGES.has(rel)) {
    html = html.replace(/[ \t]*<script>\s*EmbraceLM\.popup\([^)]*\);?\s*<\/script>\r?\n?/g, '');
    html = html.replace(/<\/body>/i, `${POPUP_INIT}\n</body>`);
  }

  if (html !== before && !DRY) fs.writeFileSync(file, html);
}

console.log(`${DRY ? '[dry run] ' : ''}Scanned ${pages.length} pages.`);
console.log(`  CTA band added:  ${stats.band}  (child ${stats.counts.child}, neuro ${stats.counts.neuro}, adult ${stats.counts.adult})`);
console.log(`  Popup added:     ${stats.popup}`);
console.log(`  Stylesheet tag:  ${stats.css}`);
console.log(`  Script tag:      ${stats.js}`);
if (stats.skipped.length) {
  console.log(`  Skipped (${stats.skipped.length}):`);
  stats.skipped.forEach(s => console.log(`    ${s}`));
}
