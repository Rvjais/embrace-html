/**
 * Generates sitemap.xml from the PHP page tree.
 *
 * URLs are emitted in the site's clean form (no .php extension), matching the
 * canonical tags on every page. Run this whenever pages are added or removed:
 *
 *     node generate-sitemap.js
 *
 * build.js also calls it, so a deploy always ships a current sitemap.
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const BASE = 'https://embracelives.com';

// Directories that never contain indexable pages.
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', 'api', 'components', '_external', 'assets', 'assets_backup', 'practitioner-images', 'practitioner-images_backup', 'embrace-media', 'videos', '__pycache__']);

// Pages that resolve but must stay out of search results. The lead-magnet guides
// are gated deliverables — they carry noindex and must not be crawlable, or the
// email step is pointless.
const SKIP_FILES = new Set([
  'build.php', 'thank-you.php', 'appointment__confirmation.php',
  'resources/guides/child-milestone-guide.php',
  'resources/guides/adhd-autism-next-steps.php',
  'resources/guides/7-day-reset-plan.php',
]);

// Higher priority for the entry points that should be crawled most often.
const HUB_PAGES = new Set([
  'index.php', 'about.php', 'contact-us.php', 'appointment.php', 'userListing.php',
  'children_and_adolescents.php', 'adult.php', 'partners.php',
  'autism/autism.php', 'adhd/adhd.php', 'speech-therapy/speech-therapy.php',
  'occupational-therapy/occupational-therapy.php',
  'learning-disabilities/learning-disabilities.php',
  'child-psychology/child-psychologist.php', 'parent-hub/parents.php',
  'schools-hub/schools.php', 'corporate-wellness/corporate-wellness.php',
  'locations/index.php', 'resources/index.php',
  'resources/child-milestone-checker.php', 'resources/adhd-autism-screener.php',
  'resources/adult-stress-check.php',
  // Child development services. These are the canonical target for each service
  // keyword; the Delhi and Gurgaon pages under locations/ point back to them.
  'developmental-delay-treatment.php', 'intellectual-disability-treatment.php',
  'down-syndrome-treatment.php', 'oral-motor-therapy.php', 'aba-therapy.php',
  'physiotherapy.php', 'pediatric-neurologist.php', 'developmental-pediatrician.php',
  'child-development-centre.php',
]);

function collect(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      collect(full, out);
    } else if (entry.name.endsWith('.php')) {
      const rel = path.relative(ROOT, full).split(path.sep).join('/');
      if (SKIP_FILES.has(rel) || SKIP_FILES.has(entry.name)) continue;
      out.push(rel);
    }
  }
  return out;
}

/** `about.php` -> `/about`; `index.php` -> `/`; `locations/index.php` -> `/locations` */
function toUrl(rel) {
  if (rel === 'index.php') return '/';
  return '/' + rel.replace(/\/index\.php$/, '').replace(/\.php$/, '');
}

function priorityFor(rel) {
  if (rel === 'index.php') return '1.0';
  if (HUB_PAGES.has(rel)) return '0.9';
  if (rel.startsWith('locations/')) return '0.8';
  return '0.7';
}

function changefreqFor(rel) {
  if (rel === 'index.php') return 'weekly';
  return 'monthly';
}

function lastmod(rel) {
  return fs.statSync(path.join(ROOT, rel)).mtime.toISOString().slice(0, 10);
}

const pages = collect(ROOT).sort();

const body = pages.map(rel => {
  const loc = (BASE + toUrl(rel)).replace(/&/g, '&amp;');
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    `    <lastmod>${lastmod(rel)}</lastmod>`,
    `    <changefreq>${changefreqFor(rel)}</changefreq>`,
    `    <priority>${priorityFor(rel)}</priority>`,
    '  </url>',
  ].join('\n');
}).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);

const locationCount = pages.filter(p => p.startsWith('locations/')).length;
console.log(`sitemap.xml written: ${pages.length} URLs (${locationCount} location pages).`);
