/**
 * Injects internal links between the topic/service pages and the 110 location
 * pages, in both directions.
 *
 *     node generate-location-links.js
 *
 * On a service page  -> "<Service> across Delhi NCR": the 10 area pages for the
 *                       location service that best matches that page's topic.
 * On a location page -> the other 10 services in the same area, plus the same
 *                       service in the 9 other areas.
 *
 * Blocks are written between LOCATION-LINKS markers immediately above the footer
 * include, so re-running updates in place instead of duplicating. Styling lives
 * in the footer stylesheet emitted by generate-locations-nav.js (.emb-nearby*).
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

const AREAS = [
  ['delhi', 'Delhi'],
  ['south-delhi', 'South Delhi'],
  ['saket', 'Saket'],
  ['hauz-khas', 'Hauz Khas'],
  ['green-park', 'Green Park'],
  ['greater-kailash', 'Greater Kailash'],
  ['defence-colony', 'Defence Colony'],
  ['vasant-kunj', 'Vasant Kunj'],
  ['gurgaon', 'Gurgaon'],
  ['noida', 'Noida'],
];

const SERVICES = [
  ['child-psychologist', 'Child Psychologist', 'child psychology consultations'],
  ['child-counselling', 'Child Counselling', 'child counselling'],
  ['teen-counselling', 'Teen Counselling', 'teen counselling'],
  ['adult-counselling', 'Adult Counselling', 'adult counselling and therapy'],
  ['autism-assessment', 'Autism Assessment', 'autism assessments'],
  ['autism-therapy', 'Autism Therapy', 'autism therapy'],
  ['adhd-assessment', 'ADHD Assessment', 'ADHD assessments'],
  ['learning-disability-assessment', 'Learning Disability Assessment', 'learning disability assessments'],
  ['speech-therapy', 'Speech Therapy', 'speech and language therapy'],
  ['occupational-therapy', 'Occupational Therapy', 'occupational therapy'],
  ['special-education', 'Special Education', 'special education support'],
];

const SERVICE_LABEL = Object.fromEntries(SERVICES.map(([s, l]) => [s, l]));
const SERVICE_PHRASE = Object.fromEntries(SERVICES.map(([s, , p]) => [s, p]));
const AREA_LABEL = Object.fromEntries(AREAS);

/** Default location service for every page in a content directory. */
const DIR_DEFAULTS = {
  'adhd': 'adhd-assessment',
  'autism': 'autism-therapy',
  'child-psychology': 'child-counselling',
  'teen-mental-health': 'teen-counselling',
  'adult-mental-health': 'adult-counselling',
  'speech-therapy': 'speech-therapy',
  'occupational-therapy': 'occupational-therapy',
  'learning-disabilities': 'learning-disability-assessment',
  'schools-hub': 'special-education',
  'parent-hub': 'child-counselling',
  'corporate-wellness': 'adult-counselling',
};

/** Pages whose topic points at a different location service than their folder default. */
const PAGE_OVERRIDES = {
  // Autism pages that are really about a specific therapy discipline
  'autism/autism-speech-therapy.php': 'speech-therapy',
  'autism/autism-occupational-therapy.php': 'occupational-therapy',
  'autism/autism-inclusive-education.php': 'special-education',
  'autism/autism-school-support.php': 'special-education',
  'autism/autism-and-learning-disabilities.php': 'learning-disability-assessment',
  // Autism pages that are diagnostic rather than therapeutic
  'autism/autism-assessment.php': 'autism-assessment',
  'autism/autism-screening.php': 'autism-assessment',
  'autism/autism-testing.php': 'autism-assessment',
  'autism/autism-diagnostic-evaluation.php': 'autism-assessment',
  'autism/ados-2-assessment.php': 'autism-assessment',
  'autism/signs-of-autism.php': 'autism-assessment',
  'autism/autism-symptoms.php': 'autism-assessment',
  'autism/what-is-autism.php': 'autism-assessment',
  'autism/late-autism-diagnosis.php': 'autism-assessment',
  'autism/level-1-autism.php': 'autism-assessment',
  'autism/level-2-autism.php': 'autism-assessment',
  'autism/level-3-autism.php': 'autism-assessment',
  'autism/high-functioning-autism.php': 'autism-assessment',
  'autism/autism-spectrum-disorder.php': 'autism-assessment',
  'autism/autism-in-toddlers.php': 'autism-assessment',
  'autism/autism-in-preschoolers.php': 'autism-assessment',
  'autism/autism-in-girls.php': 'autism-assessment',
  'autism/autism-in-boys.php': 'autism-assessment',
  'autism/autism-in-adults.php': 'adult-counselling',
  'autism/autism-workplace-support.php': 'adult-counselling',
  'autism/autism-in-adolescents.php': 'teen-counselling',
  'autism/autism-transition-to-adulthood.php': 'teen-counselling',

  // ADHD
  'adhd/adhd-classroom-accommodations.php': 'special-education',
  'adhd/adhd-teacher-support.php': 'special-education',
  'adhd/adhd-and-school.php': 'special-education',
  'adhd/adhd-and-autism.php': 'autism-assessment',
  'adhd/adult-adhd.php': 'adult-counselling',
  'adhd/adhd-in-men.php': 'adult-counselling',
  'adhd/adhd-in-women.php': 'adult-counselling',
  'adhd/adhd-at-work.php': 'adult-counselling',
  'adhd/adhd-workplace-accommodations.php': 'adult-counselling',
  'adhd/adhd-and-college.php': 'teen-counselling',
  'adhd/adhd-in-teens.php': 'teen-counselling',
  'adhd/adhd-parent-support.php': 'child-counselling',
  'adhd/adhd-counselling.php': 'child-counselling',

  // Child psychology
  'child-psychology/child-psychologist.php': 'child-psychologist',
  'child-psychology/school-refusal.php': 'child-psychologist',
  'child-psychology/academic-stress.php': 'teen-counselling',

  // Learning disabilities that are support/teaching rather than assessment
  'learning-disabilities/special-education-support.php': 'special-education',
  'learning-disabilities/inclusive-education.php': 'special-education',
  'learning-disabilities/iep-support.php': 'special-education',
  'learning-disabilities/academic-intervention.php': 'special-education',
  'learning-disabilities/reading-intervention.php': 'special-education',
  'learning-disabilities/writing-intervention.php': 'special-education',
  'learning-disabilities/school-accommodations.php': 'special-education',
  'learning-disabilities/exam-accommodations.php': 'special-education',
  'learning-disabilities/study-skills-training.php': 'special-education',
  'learning-disabilities/dyslexia-therapy.php': 'special-education',
  'learning-disabilities/reading-disorder.php': 'learning-disability-assessment',
  'learning-disabilities/writing-disorder.php': 'learning-disability-assessment',

  // Speech / OT cross-links
  'speech-therapy/speech-therapy-for-adults.php': 'adult-counselling',
  'occupational-therapy/ot-for-learning-disabilities.php': 'learning-disability-assessment',

  // Parent hub
  'parent-hub/raising-a-child-with-autism.php': 'autism-therapy',
  'parent-hub/raising-a-child-with-adhd.php': 'adhd-assessment',
  'parent-hub/iep-guide.php': 'special-education',
  'parent-hub/inclusive-school-guide.php': 'special-education',
  'parent-hub/parent-counselling.php': 'adult-counselling',
  'parent-hub/parent-burnout.php': 'adult-counselling',
  'parent-hub/caregiver-support.php': 'adult-counselling',

  // Schools hub
  'schools-hub/adhd-in-the-classroom.php': 'adhd-assessment',
  'schools-hub/autism-in-the-classroom.php': 'autism-therapy',
  'schools-hub/learning-disabilities-in-school.php': 'learning-disability-assessment',
  'schools-hub/school-counselling.php': 'child-counselling',
  'schools-hub/school-screening-programs.php': 'learning-disability-assessment',
  'schools-hub/manager-training.php': 'adult-counselling',
  'schools-hub/teacher-wellbeing-programs.php': 'adult-counselling',

  // Adult mental health cross-links
  'adult-mental-health/adult-autism-support.php': 'autism-therapy',
  'adult-mental-health/adult-adhd-support.php': 'adhd-assessment',

  // Corporate wellness cross-links
  'corporate-wellness/workplace-adhd-support.php': 'adhd-assessment',
  'corporate-wellness/workplace-autism-support.php': 'autism-therapy',

  // Top-level audience pages
  'children.php': 'child-counselling',
  'children_and_adolescents.php': 'child-psychologist',
  'adolescents.php': 'teen-counselling',
  'adult.php': 'adult-counselling',
  'individuals.php': 'adult-counselling',
  'couples.php': 'adult-counselling',
  'parent.php': 'child-counselling',
  'teacher.php': 'special-education',
  'university.php': 'teen-counselling',
  'corporate.php': 'adult-counselling',
  'hospitalAndHealthcare.php': 'adult-counselling',
  'practitioner.php': 'child-psychologist',
  'userListing.php': 'child-psychologist',
};

/** Utility, legal and conversion pages get no location block. */
const SKIP = new Set([
  'index.php', 'about.php', 'contact-us.php', 'faq.php', 'careers.php', 'media.php',
  'gallery.php', 'partners.php', 'giftatherapy.php', 'appointment.php',
  'appointment__confirmation.php', 'thank-you.php', 'bookingandCancellation.php',
  'privacypolicy.php', 'terms_and_conditions.php', 'seo_sitemap.php', 'build.php',
  'locations/index.php',
]);

const START = '<!-- LOCATION-LINKS:START (generated by generate-location-links.js — do not edit by hand) -->';
const END = '<!-- LOCATION-LINKS:END -->';

const FOOTER_INCLUDE = /^([ \t]*)(<\?php\s+include\s+__DIR__\s*\.\s*'\/(?:\.\.\/)?components\/footer\.php';\s*\?>)/m;

function link(service, area) {
  return `<li><a href="/locations/${service}-in-${area}">${SERVICE_LABEL[service]} in ${AREA_LABEL[area]}</a></li>`;
}

/**
 * The footer include sits outside each page's padded content container, so the
 * block needs its own gutter + max-width wrapper to line up with the page body.
 */
function wrap(section) {
  return `<div class="px-6 md:px-16 bg-white">
<div class="max-w-7xl mx-auto">
${section}
</div>
</div>`;
}

/** Block for a topic/service page: the matched service in all 10 areas. */
function serviceBlock(service) {
  const items = AREAS.map(([a]) => '      ' + link(service, a)).join('\n');
  return wrap(`<section class="emb-nearby" aria-labelledby="emb-nearby-title">
  <h2 class="emb-nearby__title" id="emb-nearby-title">${SERVICE_LABEL[service]} across Delhi NCR</h2>
  <p class="emb-nearby__sub">We offer ${SERVICE_PHRASE[service]} at eMbrace centres throughout Delhi and the wider NCR. Choose the location closest to you.</p>
  <div class="emb-nearby__cols">
    <div class="emb-nearby__group">
      <ul class="emb-nearby__list emb-nearby__list--wide">
${items}
      </ul>
    </div>
  </div>
  <a class="emb-nearby__more" href="/locations">View all eMbrace locations &rsaquo;</a>
</section>`);
}

/** Block for a location page: siblings in the same area, and the same service elsewhere. */
function locationBlock(service, area) {
  const sameArea = SERVICES
    .filter(([s]) => s !== service)
    .map(([s]) => '        ' + link(s, area))
    .join('\n');
  const otherAreas = AREAS
    .filter(([a]) => a !== area)
    .map(([a]) => '        ' + link(service, a))
    .join('\n');

  return wrap(`<section class="emb-nearby" aria-labelledby="emb-nearby-title">
  <h2 class="emb-nearby__title" id="emb-nearby-title">More eMbrace services near you</h2>
  <p class="emb-nearby__sub">Explore the other assessments and therapies we offer in ${AREA_LABEL[area]}, or find ${SERVICE_PHRASE[service]} at another eMbrace location.</p>
  <div class="emb-nearby__cols emb-nearby__cols--two">
    <div class="emb-nearby__group">
      <h4>Other services in ${AREA_LABEL[area]}</h4>
      <ul class="emb-nearby__list">
${sameArea}
      </ul>
    </div>
    <div class="emb-nearby__group">
      <h4>${SERVICE_LABEL[service]} in other areas</h4>
      <ul class="emb-nearby__list">
${otherAreas}
      </ul>
    </div>
  </div>
  <a class="emb-nearby__more" href="/locations">View all eMbrace locations &rsaquo;</a>
</section>`);
}

/** Split `speech-therapy-in-south-delhi` into its service and area halves. */
function parseLocationSlug(slug) {
  for (const [areaSlug] of AREAS) {
    const suffix = `-in-${areaSlug}`;
    if (slug.endsWith(suffix)) {
      const service = slug.slice(0, -suffix.length);
      if (SERVICE_LABEL[service]) return { service, area: areaSlug };
    }
  }
  return null;
}

function collectPages(dir, out = []) {
  const skipDirs = new Set(['node_modules', 'dist', '.git', 'api', 'components', '_external', 'assets', 'assets_backup', 'practitioner-images', 'practitioner-images_backup', 'embrace-media', 'videos', '__pycache__']);
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (skipDirs.has(entry.name)) continue;
      collectPages(full, out);
    } else if (entry.name.endsWith('.php')) {
      out.push(path.relative(ROOT, full).split(path.sep).join('/'));
    }
  }
  return out;
}

/** Which block, if any, belongs on `rel`. */
function blockFor(rel) {
  if (SKIP.has(rel)) return null;

  if (rel.startsWith('locations/')) {
    const parsed = parseLocationSlug(path.basename(rel, '.php'));
    return parsed ? locationBlock(parsed.service, parsed.area) : null;
  }

  const override = PAGE_OVERRIDES[rel];
  if (override) return serviceBlock(override);

  const dir = rel.includes('/') ? rel.split('/')[0] : null;
  if (dir && DIR_DEFAULTS[dir]) return serviceBlock(DIR_DEFAULTS[dir]);

  return null;
}

const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const MARKER_RE = new RegExp(esc(START) + '[\\s\\S]*?' + esc(END));

const stats = { updated: 0, inserted: 0, skipped: 0, noAnchor: [] };

for (const rel of collectPages(ROOT).sort()) {
  const block = blockFor(rel);
  if (!block) { stats.skipped++; continue; }

  const full = path.join(ROOT, rel);
  let text = fs.readFileSync(full, 'utf8');
  const wrapped = `${START}\n${block}\n${END}`;

  if (MARKER_RE.test(text)) {
    text = text.replace(MARKER_RE, wrapped);
    stats.updated++;
  } else {
    const m = text.match(FOOTER_INCLUDE);
    if (!m) { stats.noAnchor.push(rel); continue; }
    const indent = m[1];
    const indented = wrapped.split('\n').map(l => (l ? indent + l : l)).join('\n');
    text = text.replace(FOOTER_INCLUDE, `${indented}\n$1$2`);
    stats.inserted++;
  }

  fs.writeFileSync(full, text);
}

console.log(`Location link blocks — inserted: ${stats.inserted}, updated: ${stats.updated}, skipped (no match): ${stats.skipped}`);
if (stats.noAnchor.length) {
  console.log(`  NO FOOTER ANCHOR (block not added): ${stats.noAnchor.join(', ')}`);
}
