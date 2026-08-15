/**
 * Brings <title> and meta description into range on the rest of the site: the
 * condition hubs, audience pages, service pages and policy pages that sit
 * outside locations/ and outside the generated child development pages.
 *
 *     node generate-page-meta.js --dry
 *     node generate-page-meta.js
 *
 * Titles land in 50-60 characters, descriptions in 150-160, counted decoded.
 *
 * Each page keeps its own topic. The title's subject is taken from the title
 * already on the page, and the description is grown or trimmed from the one
 * already there, so nothing invents a claim the page does not make.
 *
 * Search intent drives the closing line, because a policy page and an autism
 * hub should not end the same way:
 *
 *   informational  a hub or condition explainer      soft close, read/learn
 *   commercial     a service or assessment page      free intake call
 *   b2b            schools, corporates, universities offer to talk about a programme
 *   support        careers, contact, gallery, media  practical close
 *   legal          policies and terms                no CTA at all
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

/**
 * --reset rebuilds each description from the version committed in git rather
 * than from whatever is on disk. Needed because an earlier pass trimmed some
 * descriptions mid-phrase, and a bad description that happens to be the right
 * length would otherwise be treated as already correct.
 */
const RESET = process.argv.includes('--reset');

function committedDescription(rel) {
  try {
    const src = execFileSync('git', ['show', `HEAD:${rel}`], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    const m = src.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/i)
      || src.match(/<meta[^>]*content="([^"]*)"[^>]*name="description"[^>]*>/i);
    return m ? m[1] : null;
  } catch (e) {
    return null;  // new file, not in HEAD
  }
}

const ROOT = __dirname;
const DRY = process.argv.includes('--dry');
const TITLE_MIN = 50, TITLE_MAX = 60;
const DESC_MIN = 150, DESC_MAX = 160;

/** Handled by their own generators, or deliberately left alone. */
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', 'api', 'components', '_external', 'assets',
  'assets_backup', 'practitioner-images', 'practitioner-images_backup', 'embrace-media', 'videos',
  '__pycache__', 'media', 'locations',
  'developmental-delay', 'intellectual-disability', 'down-syndrome', 'oral-motor-therapy',
  'aba-therapy', 'physiotherapy', 'pediatric-neurology', 'developmental-pediatrics',
  'child-development-centre']);
const SKIP_FILES = new Set(['build.php', 'thank-you.php', 'appointment__confirmation.php', 'seo_sitemap.php']);
/** Gated deliverables carry noindex, so their meta does not matter. */
const SKIP_PATHS = [/^resources\/guides\//];

/**
 * The homepage title is the most valuable on the site and is written by hand,
 * not assembled. Everything else is derived from the page's own title.
 */
const HANDWRITTEN = {
  'index.php': 'Best Child Psychologist in Delhi NCR | eMbrace Lives',
  'resources/index.php': 'Free Mental Health Tools & Screeners | eMbrace Delhi',
  'resources/child-milestone-checker.php': 'Free Child Milestone Checker (0-12) | eMbrace Delhi',
  'resources/adhd-autism-screener.php': 'Free ADHD & Autism Screener for Parents | eMbrace Delhi',
  'resources/adult-stress-check.php': 'Free Stress, Anxiety & Burnout Self-Check | eMbrace',
};

/** Descriptions written by hand where an automated trim would read badly. */
const HANDWRITTEN_DESC = {
  'resources/index.php':
    'Three free clinician-built screeners: child milestones, ADHD and autism early signs, and adult stress and burnout. Instant results, no sign-up needed.',
  'resources/child-milestone-checker.php':
    'Free 2-minute milestone checker for ages 0-12, covering speech, motor, social and learning skills. Instant domain-by-domain result and a free parent guide.',
  'resources/adhd-autism-screener.php':
    'Free 3-minute ADHD and autism early-signs screener for parents. Four behaviour clusters profiled, plus a straight answer on whether an assessment is worth it.',
  'resources/adult-stress-check.php':
    'Free 3-minute self-check giving four separate scores: worry, mood, body and sleep, and burnout. Private, instant, and paired with a free 7-Day Reset Plan.',
};

/** Longest first. The fitter walks down until a title lands in range. */
const TITLE_SUFFIXES = [
  ' | A Guide from eMbrace Psychologists, Delhi',
  ' | eMbrace Child Psychology, Delhi NCR',
  ' | eMbrace Child Psychology Delhi',
  ' | RCI-Certified Team | eMbrace',
  ' | eMbrace Psychologists Delhi',
  ' | eMbrace Delhi NCR Centres',
  ' | eMbrace Delhi NCR',
  ' | eMbrace Lives',
  ' | eMbrace',
];

/** Closing lines by intent, each ranked longest first. */
const CLOSERS = {
  informational: [
    'Written by our RCI-certified clinical team in Delhi NCR.',
    'Free 15-minute call with a clinician if you need one.',
    'From eMbrace, Delhi NCR. Book a free 15-minute call.',
    'From our RCI-certified clinical team in Delhi NCR.',
    'Guidance from our clinical team in Delhi NCR.',
    'From our clinical team across Delhi NCR.',
    'From our clinical team in Delhi NCR.',
    'From eMbrace psychologists, Delhi.',
    'From eMbrace, Delhi NCR.',
    'eMbrace, Delhi NCR.',
    'Delhi NCR.',
  ],
  commercial: [
    'Book a free 15-minute intake call with our clinical team.',
    'Book a free 15-minute call before you commit to anything.',
    'Book a free 15-minute call with one of our clinicians.',
    'Book a free 15-minute call with a clinician.',
    'Start with a free 15-minute intake call.',
    'Free 15-minute intake call available.',
    'Book a free intake call today.',
    'Book a free intake call.',
    'Free intake call.',
    'Delhi NCR.',
  ],
  b2b: [
    'Talk to our team about a programme for your organisation.',
    'Speak to our team about a programme built around you.',
    'Speak to our team about a programme built for you.',
    'Talk to us about a programme for your team.',
    'Talk to us about a programme.',
    'Speak to our partnerships team.',
    'Talk to our team today.',
    'Talk to our team.',
    'Delhi NCR.',
  ],
  support: [
    'Get in touch with the eMbrace team in Delhi NCR today.',
    'Get in touch with the eMbrace team in Delhi NCR.',
    'Get in touch with our team in Delhi NCR.',
    'Get in touch with the eMbrace team.',
    'Get in touch with us today.',
    'Get in touch with us.',
    'Get in touch.',
    'Delhi NCR.',
  ],
  legal: [
    'Please read this alongside our other policies.',
    'Applies to all eMbrace services.',
    'eMbrace, Delhi NCR.',
    'Delhi NCR.',
  ],
};

/** Filler used only when a short description still cannot reach 150. */
const FILLERS = [
  ' eMbrace is a multidisciplinary psychology and neurodevelopmental practice across Delhi NCR.',
  ' eMbrace is a psychology and neurodevelopmental practice across Delhi NCR.',
  ' From eMbrace, a multidisciplinary practice across Delhi NCR.',
  ' From eMbrace in Delhi NCR.',
];

function intentFor(rel) {
  if (/^(privacypolicy|terms_and_conditions|bookingandCancellation)\.php$/.test(rel)) return 'legal';
  if (/^(careers|contact-us|gallery|media|faq|userListing|practitioner|giftatherapy)\.php$/.test(rel)) return 'support';
  if (/^(schools-hub|corporate-wellness)\//.test(rel)) return 'b2b';
  if (/^(partners|corporate|university|hospitalAndHealthcare|teacher)\.php$/.test(rel)) return 'b2b';
  if (/^(appointment)\.php$/.test(rel)) return 'commercial';
  if (/^(adult|individuals|couples|children|adolescents|parent|children_and_adolescents|about|index)\.php$/.test(rel)) return 'commercial';
  // Condition and topic hubs explain something before they sell anything.
  return 'informational';
}

const dec = s => String(s).replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, "'").replace(/&quot;/g, '"');
const enc = s => String(s).replace(/&(?!amp;|lt;|gt;|quot;|#\d+;|[a-z]+;)/g, '&amp;');
const len = s => dec(s).length;

/** Cuts to at most max characters on a word boundary. */
function trimTo(text, max) {
  const plain = dec(text);
  if (plain.length <= max) return plain;
  const cut = plain.slice(0, max + 1);
  const at = Math.max(cut.lastIndexOf(' '), cut.lastIndexOf(','), cut.lastIndexOf('.'));
  return plain.slice(0, at > 0 ? at : max).replace(/[\s,.:;\-|–—]+$/, '');
}

/** Strips any existing brand tail so a new one can be fitted. */
function subjectOf(title) {
  return dec(title).replace(/\s*[|–-]\s*eMbrace.*$/i, '').replace(/\s+/g, ' ').trim();
}

function buildTitle(subject, problems, rel) {
  for (const suffix of TITLE_SUFFIXES) {
    const full = subject + suffix;
    if (full.length >= TITLE_MIN && full.length <= TITLE_MAX) return full;
  }
  // Subject too long for any suffix: trim the subject, keep the shortest brand.
  for (const suffix of [' | eMbrace', ' | eMbrace Lives']) {
    const room = TITLE_MAX - suffix.length;
    const trimmed = trimTo(subject, room);
    const full = trimmed + suffix;
    if (full.length >= TITLE_MIN && full.length <= TITLE_MAX) return full;
  }
  problems.push(`${rel}: could not fit a title from subject "${subject}" (${subject.length} chars)`);
  return subject + ' | eMbrace';
}

function buildDescription(existing, intent, problems, rel) {
  const base = dec(existing).replace(/\s+/g, ' ').trim();

  if (base.length >= DESC_MIN && base.length <= DESC_MAX) return base;

  if (base.length > DESC_MAX) {
    // Prefer ending on a complete sentence rather than mid-clause.
    const sentences = base.match(/[^.!?]+[.!?]+/g) || [];
    let acc = '';
    for (const s of sentences) {
      if ((acc + s).trim().length > DESC_MAX) break;
      acc += s;
    }
    acc = acc.trim();
    if (acc.length >= DESC_MIN && acc.length <= DESC_MAX) return acc;

    // Cut at a clause boundary and close with a real sentence, so a description
    // never trails off mid-phrase like "and multidisciplinary neurodevelopmental."
    for (const closer of CLOSERS[intent] || []) {
      const room = DESC_MAX - closer.length - 2;
      const cut = trimTo(base, room).replace(/[\s,;:]+$/, '').replace(/\s+(and|or|with|for|the|a|an|of|to|in|&)$/i, '');
      const candidate = `${cut}. ${closer}`;
      if (candidate.length >= DESC_MIN && candidate.length <= DESC_MAX) return candidate;
    }
    const trimmed = trimTo(base, DESC_MAX - 1);
    if (trimmed.length >= DESC_MIN) return trimmed.replace(/[,;:]$/, '') + (/[.!?]$/.test(trimmed) ? '' : '.');
    // Trimming overshot below the floor: add a closer back on.
    for (const closer of CLOSERS[intent] || []) {
      const candidate = `${trimmed}. ${closer}`;
      if (candidate.length >= DESC_MIN && candidate.length <= DESC_MAX) return candidate;
    }
    return trimmed;
  }

  const stem = /[.!?]$/.test(base) ? base : base + '.';
  if (stem.length >= DESC_MIN && stem.length <= DESC_MAX) return stem;
  for (const closer of CLOSERS[intent] || []) {
    const candidate = `${stem} ${closer}`;
    if (candidate.length >= DESC_MIN && candidate.length <= DESC_MAX) return candidate;
  }
  for (const filler of FILLERS) {
    for (const closer of (CLOSERS[intent] || []).concat([''])) {
      const candidate = `${stem}${filler}${closer ? ' ' + closer : ''}`.replace(/\s+/g, ' ');
      if (candidate.length >= DESC_MIN && candidate.length <= DESC_MAX) return candidate;
    }
  }
  problems.push(`${rel}: could not fit a description (base ${base.length} chars, intent ${intent})`);
  return stem;
}

function collect(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || SKIP_DIRS.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) collect(full, out);
    else if (e.name.endsWith('.php') && !SKIP_FILES.has(e.name)) out.push(full);
  }
  return out;
}

const problems = [];
const seenTitles = new Map(), seenDescs = new Map();
let changed = 0, scanned = 0;

for (const file of collect(ROOT).sort()) {
  const rel = path.relative(ROOT, file).split(path.sep).join('/');
  let html = fs.readFileSync(file, 'utf8');
  const before = html;
  scanned++;

  const titleM = html.match(/<title>([\s\S]*?)<\/title>/i);
  if (!titleM) { problems.push(`${rel}: no <title>`); continue; }
  let descM = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/i);
  let descFirst = false;
  if (!descM) {
    descM = html.match(/<meta[^>]*content="([^"]*)"[^>]*name="description"[^>]*>/i);
    descFirst = true;
  }
  if (!descM) { problems.push(`${rel}: no meta description`); continue; }

  if (SKIP_PATHS.some(re => re.test(rel))) continue;

  const intent = intentFor(rel);
  const title = HANDWRITTEN[rel] || buildTitle(subjectOf(titleM[1]), problems, rel);
  const source = RESET ? (committedDescription(rel) || descM[1]) : descM[1];
  const desc = HANDWRITTEN_DESC[rel] || buildDescription(source, intent, problems, rel);

  if (seenTitles.has(title)) problems.push(`${rel}: duplicate title with ${seenTitles.get(title)}`);
  if (seenDescs.has(desc)) problems.push(`${rel}: duplicate description with ${seenDescs.get(desc)}`);
  seenTitles.set(title, rel);
  seenDescs.set(desc, rel);

  const t = enc(title), d = enc(desc);
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${t}</title>`);
  html = html.replace(/(<meta[^>]*name="description"[^>]*content=")[^"]*(")/i, `$1${d}$2`);
  html = html.replace(/(<meta[^>]*content=")[^"]*("[^>]*name="description"[^>]*>)/i, `$1${d}$2`);
  html = html.replace(/(<meta[^>]*content=")[^"]*("[^>]*property="og:title"[^>]*>)/i, `$1${t}$2`);
  html = html.replace(/(<meta[^>]*property="og:title"[^>]*content=")[^"]*(")/i, `$1${t}$2`);
  html = html.replace(/(<meta[^>]*content=")[^"]*("[^>]*property="og:description"[^>]*>)/i, `$1${d}$2`);
  html = html.replace(/(<meta[^>]*property="og:description"[^>]*content=")[^"]*(")/i, `$1${d}$2`);
  html = html.replace(/(<meta[^>]*content=")[^"]*("[^>]*name="twitter:title"[^>]*>)/i, `$1${t}$2`);
  html = html.replace(/(<meta[^>]*name="twitter:title"[^>]*content=")[^"]*(")/i, `$1${t}$2`);
  html = html.replace(/(<meta[^>]*content=")[^"]*("[^>]*name="twitter:description"[^>]*>)/i, `$1${d}$2`);
  html = html.replace(/(<meta[^>]*name="twitter:description"[^>]*content=")[^"]*(")/i, `$1${d}$2`);

  if (html !== before) {
    changed++;
    if (!DRY) fs.writeFileSync(file, html);
  }
}

console.log(`${DRY ? '[dry run] ' : ''}${scanned} pages scanned, ${changed} updated.`);
console.log(`  unique titles: ${seenTitles.size}   unique descriptions: ${seenDescs.size}`);
if (problems.length) {
  console.log(`\n  ${problems.length} problem(s):`);
  problems.slice(0, 25).forEach(p => console.log(`    ${p}`));
  if (problems.length > 25) console.log(`    ... and ${problems.length - 25} more`);
  process.exitCode = 1;
}
