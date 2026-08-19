/**
 * Rewrites <title>, meta description, and the matching Open Graph and Twitter
 * tags on every page in locations/.
 *
 *     node generate-location-meta.js --dry    # report only
 *     node generate-location-meta.js          # apply
 *
 * Rules enforced, from the seo-content-workflow skill:
 *   - Title 50 to 60 characters including spaces
 *   - Description 150 to 160 characters including spaces
 *   - Both counted on the DECODED string, which is what a SERP shows
 *   - Every title and description unique across the whole set
 *   - Primary keyword leads the title, brand trails it
 *
 * Titles and descriptions are assembled by trying ranked variants and keeping
 * the first that lands in range, so the character limits are met by
 * construction rather than by hand-counting 111 pages. Anything that cannot be
 * fitted is reported loudly instead of being silently written out of range.
 *
 * Indian English throughout. No em dashes.
 */
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'locations');
const DRY = process.argv.includes('--dry');

const TITLE_MIN = 50, TITLE_MAX = 60;
const DESC_MIN = 150, DESC_MAX = 160;

/** Locality slug -> display name. */
const PLACES = {
  'delhi': 'Delhi',
  'south-delhi': 'South Delhi',
  'saket': 'Saket',
  'hauz-khas': 'Hauz Khas',
  'green-park': 'Green Park',
  'greater-kailash': 'Greater Kailash',
  'defence-colony': 'Defence Colony',
  'vasant-kunj': 'Vasant Kunj',
  'gurgaon': 'Gurgaon',
  'noida': 'Noida',
};

/**
 * Where families from each locality are actually seen. eMbrace has three
 * centres: Vasant Kunj, Gurugram and Malviya Nagar. Saying "our centre in
 * Saket" would be false, so each locality points at the centre that really
 * serves it. Ranked longest first so the description fitter has room to move.
 */
const CENTRES = {
  'delhi': ['at our Vasant Kunj and Malviya Nagar centres', 'at our Delhi centres'],
  'south-delhi': ['at our Malviya Nagar and Vasant Kunj centres', 'at our Malviya Nagar centre'],
  'saket': ['at our Malviya Nagar centre, minutes from Saket', 'at our Malviya Nagar centre'],
  'hauz-khas': ['at our Malviya Nagar centre, minutes away', 'at our Malviya Nagar centre'],
  'green-park': ['at our Malviya Nagar centre, minutes away', 'at our Malviya Nagar centre'],
  'greater-kailash': ['at our Malviya Nagar centre, a short drive away', 'at our Malviya Nagar centre'],
  'defence-colony': ['at our Malviya Nagar centre, a short drive away', 'at our Malviya Nagar centre'],
  'vasant-kunj': ['at our Vasant Kunj centre, online or in person', 'at our Vasant Kunj centre'],
  'gurgaon': ['at our Gurugram centre on MG Road', 'at our Gurugram centre'],
  'noida': ['at our Delhi NCR centres or online', 'online or at our Delhi centres'],
};

/**
 * One entry per service that has pages. `titles` are ranked longest first;
 * `props` are the description opener, also ranked longest first. Secondary
 * terms only appear where the service genuinely covers them.
 */
const SERVICES = {
  'adhd-assessment': {
    titles: ['ADHD Assessment & Treatment in {P}', 'ADHD Assessment in {P}', 'ADHD Testing in {P}'],
    props: [
      'Structured ADHD assessment and treatment for children and teens in {P}, covering attention, impulsivity and school support',
      'Structured ADHD assessment and treatment in {P}, covering attention, impulsivity and school support',
      'ADHD assessment and treatment for children and teens in {P}',
    ],
  },
  'autism-assessment': {
    titles: ['Autism Assessment & Diagnosis in {P}', 'Autism Assessment in {P}', 'Autism Testing in {P}'],
    props: [
      // ADOS-2 was queried with the client on 19 August 2026, because the
      // clinician table lists ISAA and CARS as the autism instruments and never
      // mentions ADOS-2. The client confirmed ADOS-2 is used and asked for it to
      // stay. It is therefore a client-attested claim, not one derived from the
      // clinician table. The RCI wording that sat alongside it is gone and does
      // not come back without per-clinician confirmation.
      'ADOS-2 based autism assessment in {P} by our clinical psychology team, with a written report your school will accept',
      'ADOS-2 based autism assessment in {P}, with a written report your school will accept',
      'ADOS-2 based autism assessment in {P} by our clinical psychology team',
    ],
  },
  'autism-therapy': {
    titles: ['Autism Treatment & Therapy in {P}', 'Autism Therapy in {P}', 'Autism Support in {P}'],
    props: [
      'Autism treatment in {P} built around your child: speech, occupational therapy, behaviour support and parent coaching under one roof',
      'Autism treatment in {P}: speech, occupational therapy, behaviour support and parent coaching under one roof',
      'Autism therapy in {P} across speech, occupational therapy and behaviour support',
    ],
  },
  'child-psychologist': {
    titles: ['Child Psychologist in {P}', 'Child Psychologist Near {P}', 'Child Psychology in {P}'],
    props: [
      'See an experienced child psychologist in {P} for anxiety, behaviour, school refusal and developmental concerns, from toddlers to teens',
      'See an experienced child psychologist in {P} for anxiety, behaviour, school refusal and developmental concerns',
      'Experienced child psychologists in {P} for anxiety, behaviour and developmental concerns',
    ],
  },
  'child-counselling': {
    titles: ['Child Counselling in {P}', 'Child Counselling Near {P}', 'Child Therapy in {P}'],
    props: [
      'Child counselling in {P} using play, art and CBT-based work for anxiety, anger, low confidence, grief and friendship difficulties',
      'Child counselling in {P} using play, art and CBT-based work for anxiety, anger and low confidence',
      'Child counselling in {P} for anxiety, anger, confidence and friendship difficulties',
    ],
  },
  'teen-counselling': {
    titles: ['Teen Counselling in {P}', 'Teen Counselling Near {P}', 'Teen Therapy in {P}'],
    props: [
      'Teen counselling in {P} for exam stress, anxiety, low mood, screen use and identity, in a confidential space built for adolescents',
      'Teen counselling in {P} for exam stress, anxiety, low mood and screen use, in a confidential space',
      'Teen counselling in {P} for exam stress, anxiety, low mood and screen use',
    ],
  },
  'adult-counselling': {
    titles: ['Adult Counselling in {P}', 'Adult Counselling Near {P}', 'Adult Therapy in {P}'],
    props: [
      'Adult counselling in {P} for anxiety, low mood, burnout, grief and relationships, with structured CBT-based work in English or Hindi',
      'Adult counselling in {P} for anxiety, low mood, burnout, grief and relationships, in English or Hindi',
      'Adult counselling in {P} for anxiety, low mood, burnout and relationships',
    ],
  },
  'speech-therapy': {
    titles: ['Speech Therapy in {P}', 'Speech Therapy Near {P}', 'Speech & Language Therapy in {P}'],
    props: [
      'Speech therapy in {P} for speech delay, unclear speech, oral motor difficulty, stammering and language delay, from toddlers upwards',
      'Speech therapy in {P} for speech delay, unclear speech, oral motor difficulty and stammering',
      'Speech therapy in {P} for speech delay, unclear speech and oral motor difficulty',
    ],
  },
  'occupational-therapy': {
    titles: ['Occupational Therapy in {P}', 'Occupational Therapy Near {P}', 'Paediatric OT in {P}'],
    props: [
      'Occupational therapy in {P} for sensory processing, handwriting, fine motor skills, daily living and self-regulation difficulties',
      'Occupational therapy in {P} for sensory processing, handwriting, fine motor and daily living skills',
      'Occupational therapy in {P} for sensory, handwriting and fine motor difficulties',
    ],
  },
  'special-education': {
    titles: ['Special Education Therapy in {P}', 'Special Education in {P}', 'Special Educators in {P}'],
    props: [
      'Special education therapy in {P} for learning difficulty, intellectual disability and Down syndrome, with individual education plans',
      'Special education therapy in {P} for learning difficulty and intellectual disability, with individual education plans',
      'Special education therapy in {P} for learning and developmental difficulties',
    ],
  },
  'learning-disability-assessment': {
    titles: ['Learning Disability Therapy in {P}', 'Learning Disability Assessment in {P}', 'Learning Disability Help in {P}'],
    props: [
      'Learning disability assessment and therapy in {P} for dyslexia, dysgraphia and dyscalculia, including reports for board concessions',
      'Learning disability assessment and therapy in {P} for dyslexia, dysgraphia and dyscalculia',
      'Learning disability assessment and therapy in {P}, with reports for board concessions',
    ],
  },
};

/**
 * Ranked title suffixes, longest first.
 *
 * The two RCI suffixes that used to lead this list were removed on 18 August
 * 2026. The client's clinician table carries no RCI registration data for any
 * of the eleven clinicians, so "RCI-Certified" was an unverified credential
 * claim sitting on 110 live pages. Do not reinstate without written
 * confirmation, per clinician. See LOCATION-PAGES-BRIEF.md section 8.
 */
const TITLE_SUFFIXES = [
  ' | eMbrace Centres Delhi NCR',
  ' | eMbrace Lives Delhi NCR',
  ' | eMbrace Delhi NCR',
  ' | eMbrace Lives',
  ' | eMbrace',
];

/** Ranked closers for the description, longest first. */
const CTAS = [
  'Book a free 15-minute intake call with our clinical team.',
  'Book a free 15-minute call before you commit to anything.',
  'Book a free 15-minute call with a clinician.',
  'Start with a free 15-minute intake call.',
  'Free 15-minute intake call available.',
  'Book a free intake call today.',
  'Book a free 15-minute call.',
  'Book a free intake call.',
];

/**
 * The hero line every location page carries. As shipped it read "conveniently
 * located in Gurgaon, Delhi", which is wrong twice over: Gurgaon is in Haryana,
 * Noida is in Uttar Pradesh, and eMbrace has no centre at all in seven of the
 * ten localities. This replaces it with what is actually true, and keeps the
 * page consistent with the meta description written above.
 */
const HERO = {
  'delhi': 'Professional {S} for {A} across Delhi, at our Vasant Kunj and Malviya Nagar centres.',
  'south-delhi': 'Professional {S} for {A} across South Delhi, at our Malviya Nagar and Vasant Kunj centres.',
  'saket': 'Professional {S} for {A} in Saket, at our Malviya Nagar centre just minutes away.',
  'hauz-khas': 'Professional {S} for {A} in Hauz Khas, at our Malviya Nagar centre just minutes away.',
  'green-park': 'Professional {S} for {A} in Green Park, at our Malviya Nagar centre just minutes away.',
  'greater-kailash': 'Professional {S} for {A} in Greater Kailash, at our Malviya Nagar centre a short drive away.',
  'defence-colony': 'Professional {S} for {A} in Defence Colony, at our Malviya Nagar centre a short drive away.',
  'vasant-kunj': 'Professional {S} at our Vasant Kunj centre in New Delhi, in person or online.',
  'gurgaon': 'Professional {S} at our Gurugram centre on MG Road, Sector 24, Haryana.',
  'noida': 'Professional {S} for {A} in Noida, Uttar Pradesh, at our Delhi NCR centres or online.',
};

/**
 * What to call the place families actually attend, for localities where eMbrace
 * has no centre. Vasant Kunj and Gurgaon are omitted because a centre really
 * does sit in each, so "our Vasant Kunj centre" is already true.
 */
const CENTRE_NOUN = {
  'delhi': 'Delhi centres',
  'south-delhi': 'Malviya Nagar centre',
  'saket': 'Malviya Nagar centre',
  'hauz-khas': 'Malviya Nagar centre',
  'green-park': 'Malviya Nagar centre',
  'greater-kailash': 'Malviya Nagar centre',
  'defence-colony': 'Malviya Nagar centre',
  'noida': 'Delhi NCR centres',
};

/** Who each service is actually for. "families" is wrong on the adult pages. */
const SERVICE_AUDIENCE = {
  'adult-counselling': 'adults',
  'teen-counselling': 'teenagers and their families',
};
const audienceFor = s => SERVICE_AUDIENCE[s] || 'families';

/** Filename service slug -> the phrase used in the hero sentence. */
const SERVICE_PHRASE = {
  'adhd-assessment': 'ADHD assessment and treatment',
  'autism-assessment': 'autism assessment and diagnosis',
  'autism-therapy': 'autism therapy and treatment',
  'child-psychologist': 'child psychology services',
  'child-counselling': 'child counselling',
  'teen-counselling': 'teen counselling',
  'adult-counselling': 'adult counselling',
  'speech-therapy': 'speech and language therapy',
  'occupational-therapy': 'occupational therapy',
  'special-education': 'special education therapy',
  'learning-disability-assessment': 'learning disability assessment and therapy',
};

const decode = s => s.replace(/&amp;/g, '&');
const encode = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

/** Picks the first title variant that lands inside the character window. */
function buildTitle(service, place) {
  const bases = SERVICES[service].titles.map(t => t.replace('{P}', place));
  for (const base of bases) {
    for (const suffix of TITLE_SUFFIXES) {
      const full = base + suffix;
      if (full.length >= TITLE_MIN && full.length <= TITLE_MAX) return full;
    }
  }
  return null;
}

/**
 * Picks the first prop + centre + CTA combination inside the window. Centre is
 * the outermost loop on purpose: the accurate "where you actually go" phrase is
 * the most valuable part of the description, so length is absorbed by shortening
 * the service blurb or the CTA before the centre phrase is allowed to degrade.
 */
function buildDescription(service, place, slug) {
  const props = SERVICES[service].props.map(p => p.replace('{P}', place));
  for (const centre of CENTRES[slug]) {
    for (const prop of props) {
      for (const cta of CTAS) {
        const full = `${prop}, ${centre}. ${cta}`;
        if (full.length >= DESC_MIN && full.length <= DESC_MAX) return full;
      }
    }
  }
  return null;
}

/** locations/adhd-assessment-in-hauz-khas.php -> { service, slug } */
function parse(file) {
  const stem = file.replace(/\.php$/, '');
  for (const slug of Object.keys(PLACES)) {
    if (stem.endsWith(`-in-${slug}`)) {
      return { service: stem.slice(0, -`-in-${slug}`.length), slug };
    }
  }
  return null;
}

const files = fs.readdirSync(DIR).filter(f => f.endsWith('.php') && f !== 'index.php');
const seenTitles = new Map(), seenDescs = new Map();
const problems = [];
let changed = 0;

for (const file of files.sort()) {
  const parsed = parse(file);
  if (!parsed) { problems.push(`${file}: could not parse service and locality from filename`); continue; }
  const { service, slug } = parsed;
  if (!SERVICES[service]) { problems.push(`${file}: no keyword mapping for service "${service}"`); continue; }

  const place = PLACES[slug];
  const title = buildTitle(service, place);
  const desc = buildDescription(service, place, slug);
  if (!title) { problems.push(`${file}: no title variant fits ${TITLE_MIN}-${TITLE_MAX} chars`); continue; }
  if (!desc) { problems.push(`${file}: no description variant fits ${DESC_MIN}-${DESC_MAX} chars`); continue; }

  if (seenTitles.has(title)) problems.push(`${file}: duplicate title, also on ${seenTitles.get(title)}`);
  if (seenDescs.has(desc)) problems.push(`${file}: duplicate description, also on ${seenDescs.get(desc)}`);
  seenTitles.set(title, file);
  seenDescs.set(desc, file);

  const full = path.join(DIR, file);
  let html = fs.readFileSync(full, 'utf8');
  const before = html;
  const t = encode(title), d = encode(desc);

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${t}</title>`);
  html = html.replace(/(<meta[^>]*content=")[^"]*("[^>]*name="description"[^>]*>)/i, `$1${d}$2`);
  html = html.replace(/(<meta[^>]*name="description"[^>]*content=")[^"]*(")/i, `$1${d}$2`);
  html = html.replace(/(<meta[^>]*content=")[^"]*("[^>]*property="og:title"[^>]*>)/i, `$1${t}$2`);
  html = html.replace(/(<meta[^>]*content=")[^"]*("[^>]*property="og:description"[^>]*>)/i, `$1${d}$2`);
  html = html.replace(/(<meta[^>]*content=")[^"]*("[^>]*name="twitter:title"[^>]*>)/i, `$1${t}$2`);
  html = html.replace(/(<meta[^>]*content=")[^"]*("[^>]*name="twitter:description"[^>]*>)/i, `$1${d}$2`);

  // Correct the geography and the "located in" claim. The same broken sentence
  // appears twice per page: once under the H1, once opening the services
  // section. Both are replaced, with different wording so the page does not
  // repeat itself.
  const phrase = SERVICE_PHRASE[service];
  const audience = audienceFor(service);
  const hero = encode(HERO[slug].replace('{S}', phrase).replace('{A}', audience));
  const heroRe = /(<p class="text-base md:text-lg text-gray-600 max-w-3xl mx-auto italic">)[\s\S]*?(<\/p>)/i;
  if (heroRe.test(html)) html = html.replace(heroRe, `$1${hero}$2`);
  else problems.push(`${file}: hero sentence not found, geography not corrected`);

  // Everything below this point patches the ORIGINAL templated body copy. Once
  // a page has an authored body from generate-location-body.js, that copy no
  // longer exists and these rewrites would only corrupt hand-written prose, so
  // authored pages are left alone from here. Titles, descriptions, Open Graph,
  // Twitter and the hero line above are still maintained for every page.
  if (html.includes('LOCATION-BODY:START')) {
    if (html !== before) {
      changed++;
      if (!DRY) fs.writeFileSync(full, html);
    }
    continue;
  }

  const intro = encode(
    `Our team provides ${phrase} for ${audience} in ${place}. ` +
    `Sessions run ${CENTRES[slug][0].replace(/^at /, 'at ').replace(/^online or /, 'online or ')}, ` +
    `with a free 15-minute intake call before you book anything.`
  );
  const introRe = /(<p class="text-lg text-gray-700 leading-relaxed font-light mb-8">)[\s\S]*?(<\/p>)/i;
  if (introRe.test(html)) html = html.replace(introRe, `$1${intro}$2`);
  else problems.push(`${file}: services intro sentence not found`);

  // The bullets and FAQs were templated from the URL slug, which left two
  // defects on every page: "adhd assessment" in lower case, and claims of a
  // centre in localities where there is none ("Our Saket centre"). Both are
  // rewritten inside text nodes only, so attributes and URLs are never touched.
  html = html.replace(/>([^<]+)</g, (match, text) => {
    let t = text;
    t = t.replace(/\badhd\b/g, 'ADHD');
    if (CENTRE_NOUN[slug]) {
      const p = place.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      t = t.replace(new RegExp(`our ${p} (centre|location)`, 'gi'), (m) =>
        (m[0] === m[0].toUpperCase() ? 'Our ' : 'our ') + CENTRE_NOUN[slug]);
    }
    return t === text ? match : `>${t}<`;
  });

  if (html !== before) {
    changed++;
    if (!DRY) fs.writeFileSync(full, html);
  }
}

console.log(`${DRY ? '[dry run] ' : ''}${files.length} location pages processed, ${changed} updated.`);
console.log(`  unique titles: ${seenTitles.size}   unique descriptions: ${seenDescs.size}`);
if (problems.length) {
  console.log(`\n  ${problems.length} problem(s):`);
  problems.forEach(p => console.log(`    ${p}`));
  process.exitCode = 1;
} else {
  console.log('  every title 50-60 chars, every description 150-160 chars, all unique.');
}
