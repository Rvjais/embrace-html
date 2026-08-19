/**
 * Builds the pages for the nine services that had target keywords but no page.
 *
 *     node generate-service-pages.js --dry
 *     node generate-service-pages.js
 *
 * For each service it emits three pages with three different jobs, so they do
 * not compete with each other or repeat each other:
 *
 *   hub      /<folder>/<slug>            the clinical depth. Targets the bare
 *                                        service keyword.
 *   Delhi    /locations/<slug>-in-delhi   where you are seen, how to get there,
 *   Gurgaon  /locations/<slug>-in-gurgaon what happens first. Targets "<service>
 *                                        in <city>".
 *
 * One keyword, one page: the hub deliberately does not target "in Delhi",
 * because the Delhi page does. Location pages carry locality content and link
 * to the hub for the clinical detail rather than restating it, which is what
 * keeps them from being near-duplicates of each other.
 *
 * Meta titles are held to 50-60 characters and descriptions to 150-160, counted
 * decoded, by trying ranked variants and keeping the first that fits.
 */
const fs = require('fs');
const path = require('path');

const SERVICES = require('./service-pages-content.js');
const DRY = process.argv.includes('--dry');
const ROOT = __dirname;

const TITLE_MIN = 50, TITLE_MAX = 60;
const DESC_MIN = 150, DESC_MAX = 160;

const PHONE_DISPLAY = '+91 99715 76800';
const CSS = '/assets/index-B-kGA3UA.css';

/** Where related links point. New services resolve from the content model. */
const EXISTING_LINKS = {
  'speech-therapy': ['/speech-therapy/speech-therapy', 'Speech &amp; Language Therapy'],
  'occupational-therapy': ['/occupational-therapy/occupational-therapy', 'Occupational Therapy'],
  'autism': ['/autism/autism', 'Autism Hub'],
  'adhd': ['/adhd/adhd', 'ADHD Hub'],
  'learning-disabilities': ['/learning-disabilities/learning-disabilities', 'Learning Disabilities'],
  'special-education': ['/learning-disabilities/special-education-support', 'Special Education Support'],
};

/** Ranked longest first; the fitter walks down until a title lands in range. */
const TITLE_SUFFIXES = [
  ' | RCI-Certified Team | eMbrace',
  ' for Children & Teens | eMbrace Delhi NCR',
  ' | Child Development Centre | eMbrace',
  ' | eMbrace Delhi NCR Centres',
  ' | RCI-Certified | eMbrace',
  ' | eMbrace Delhi NCR',
  ' | eMbrace Lives',
  ' | eMbrace',
];

/** Ranked longest first, so the useful part of a description survives. */
const CTAS = [
  'Book a free 15-minute intake call with our clinical team.',
  'Book a free 15-minute call before you commit to anything.',
  'Book a free 15-minute call with a clinician.',
  'Start with a free 15-minute intake call.',
  'Free 15-minute intake call available.',
  'Book a free intake call today.',
  'Book a free intake call.',
];

const CITY = {
  delhi: {
    name: 'Delhi',
    centres: 'our Vasant Kunj and Malviya Nagar centres',
    centreVariants: ['our Vasant Kunj and Malviya Nagar centres', 'our two Delhi centres', 'our Delhi centres'],
    where:
      'Families across Delhi are seen at one of our two Delhi centres. Vasant Kunj sits in South West Delhi at C-7, Sector C, Pocket 5, Grand Vasant Kunj. Malviya Nagar is in South Delhi at FC-29, Plot No. 5, Geetanjali, beside Malviya Nagar Metro Station Gate No. 1, which puts it within reach of Saket, Hauz Khas, Green Park, Greater Kailash and Defence Colony without a long drive.',
    nearby: ['saket', 'hauz-khas', 'green-park', 'greater-kailash', 'defence-colony', 'south-delhi', 'vasant-kunj'],
  },
  gurgaon: {
    name: 'Gurgaon',
    centres: 'our Gurugram centre',
    centreVariants: ['our Gurugram centre on MG Road', 'our Gurugram centre in Sector 24', 'our Gurugram centre'],
    where:
      'Families in Gurgaon are seen at our Gurugram centre, 710 DLF City Court on Mehrauli-Gurgaon Road in Nathupur, Sector 24. It sits on the main MG Road corridor, which makes it reachable from DLF Phases 1 to 5, Sushant Lok, Sector 14 and Cyber City without crossing into Delhi, with Guru Dronacharya on the Yellow Line roughly 700 metres away.',
    nearby: ['gurgaon', 'delhi', 'south-delhi', 'noida'],
  },
};

/* ------------------------------------------------------------------ helpers */

const enc = s => String(s).replace(/&(?!amp;|lt;|gt;|quot;|#\d+;|[a-z]+;)/g, '&amp;');
const dec = s => String(s).replace(/&amp;/g, '&').replace(/&rsquo;/g, "'").replace(/&amp;/g, '&');
const len = s => dec(s).length;

/** First variant whose decoded length lands in [min,max]. */
function fit(variants, min, max, label, problems) {
  for (const v of variants) {
    const l = len(v);
    if (l >= min && l <= max) return v;
  }
  problems.push(`${label}: no variant fits ${min}-${max} (tried ${variants.map(v => len(v)).join(', ')})`);
  return variants[variants.length - 1];
}

/**
 * RCI registration covers psychologists and allied therapists, so this used to
 * strip the RCI suffixes only for doctors (`medical`) and physiotherapists
 * (`noRci`), where the claim would plainly be wrong.
 *
 * As of 19 August 2026 it strips them for everyone. The client's clinician
 * table carries no RCI registration for any of the eleven clinicians, so the
 * claim is unverified across the board rather than only for the doctors. The
 * `medical` and `noRci` flags are kept because they still document why those
 * services could never carry it. See LOCATION-PAGES-BRIEF.md section 10.
 */
function suffixesFor(svc) {
  return TITLE_SUFFIXES.filter(s => !/RCI/.test(s));
}

/**
 * Component includes are the one place a real path is still needed: PHP
 * resolves them on disk, so they keep the .php extension and must reflect how
 * deep the page sits. Hub pages are at the root, location pages one level down.
 */
function withIncludes(html, prefix) {
  return html
    .replace(/\{\{HEADER\}\}/g, `<?php include __DIR__ . '${prefix}/components/header.php'; ?>`)
    .replace(/\{\{FOOTER\}\}/g,
      `<?php include __DIR__ . '${prefix}/components/lead-magnet-band-child.php'; ?>
` +
      `<?php include __DIR__ . '${prefix}/components/footer.php'; ?>`);
}

/** Hub pages sit at the site root, one URL segment, no extension. */
const hubUrl = svc => `/${svc.slug}`;

function linkFor(key, services) {
  if (EXISTING_LINKS[key]) return EXISTING_LINKS[key];
  const svc = services.find(s => s.slug === key);
  if (svc) return [hubUrl(svc), enc(svc.hubName)];
  return null;
}

/* ------------------------------------------------------------- page pieces */

function head({ title, desc, url, extraStyle }) {
  return `<!DOCTYPE html>
<html lang="en-IN">
<head>
<meta charset="utf-8"/>
<link href="/Favicon.png" rel="icon" type="image/svg+xml"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<meta content="${enc(desc)}" name="description"/>
<meta content="index, follow" name="robots"/>
<link href="https://embracelives.com${url}" rel="canonical"/>
<!-- Open Graph -->
<meta content="website" property="og:type"/>
<meta content="https://embracelives.com${url}" property="og:url"/>
<meta content="${enc(title)}" property="og:title"/>
<meta content="${enc(desc)}" property="og:description"/>
<meta content="https://embracelives.com/og-image.png" property="og:image"/>
<meta content="1200" property="og:image:width"/>
<meta content="630" property="og:image:height"/>
<meta content="eMbrace Lives" property="og:site_name"/>
<meta content="en_IN" property="og:locale"/>
<!-- Twitter Card -->
<meta content="summary_large_image" name="twitter:card"/>
<meta content="${enc(title)}" name="twitter:title"/>
<meta content="${enc(desc)}" name="twitter:description"/>
<meta content="https://embracelives.com/og-image.png" name="twitter:image"/>
<title>${enc(title)}</title>
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link href="https://fonts.gstatic.com" rel="preconnect" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
<link href="${CSS}" rel="stylesheet"/>
<link href="/assets/lead-magnets.css" rel="stylesheet"/>
<style>
  body, h1, h2, h3, h4, h5, h6, p, a, span, div, button, input { font-family: 'Outfit', sans-serif; }
  .breadcrumbs { background: linear-gradient(to right, #f8fafc, #f1f5f9); }
  .breadcrumbs a { color: #234394; transition: color 0.2s; }
  .breadcrumbs a:hover { color: #1a1a2e; text-decoration: underline; }
  .article-content h2 { color: #1e293b; font-weight: 800; font-size: 1.65rem; margin-top: 2.5rem; margin-bottom: 0.75rem; letter-spacing: -0.02em; }
  .article-content h3 { color: #334155; font-weight: 700; font-size: 1.25rem; margin-top: 2rem; margin-bottom: 0.5rem; }
  .article-content p { color: #475569; line-height: 1.8; margin-bottom: 1.25rem; font-size: 1rem; }
  .article-content ul { list-style: none; padding-left: 0; margin-bottom: 1.5rem; }
  .article-content ul li { position: relative; padding-left: 1.75rem; margin-bottom: 0.75rem; color: #475569; line-height: 1.7; }
  .article-content ul li::before { content: "\\25B8"; position: absolute; left: 0; color: #234394; font-weight: 700; font-size: 1rem; }
  .key-points-card { background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border: 1px solid #e2e8f0; border-radius: 1.5rem; padding: 2rem; }
  .key-points-card ul { margin-bottom: 0 !important; }
  .key-points-card ul li { padding-left: 2.25rem !important; margin-bottom: 1rem !important; }
  /* Accordion. Everything it needs is defined here, so it does not depend on
     utilities surviving the Tailwind purge. */
  .faq-item { border-bottom: 1px solid #e2e8f0; }
  .faq-btn { display: flex; width: 100%; align-items: center; justify-content: space-between;
             gap: 1rem; text-align: left; padding: 1.25rem 1rem; background: none; border: 0;
             cursor: pointer; font: inherit; border-radius: 0.75rem; transition: background 0.2s; }
  .faq-btn:hover { background: #f8fafc; }
  .faq-btn:focus-visible { outline: 2px solid #234394; outline-offset: 2px; }
  .faq-q { font-weight: 600; font-size: 1rem; color: #234394; }
  @media (min-width: 768px) { .faq-q { font-size: 1.125rem; } }
  .faq-icon { width: 1.25rem; height: 1.25rem; flex: none; transition: transform 0.25s ease; }
  /* Toggled with the hidden attribute rather than an animated max-height.
     A max-height transition depends on a height guess and proved unreliable
     here; display none/block cannot silently fail. */
  .faq-panel[hidden] { display: none; }
  .faq-panel { animation: faq-open 0.2s ease; }
  .faq-panel p { margin: 0; padding: 0 1rem 1.25rem; color: #475569; line-height: 1.7;
                 font-size: 0.95rem; }
  @keyframes faq-open { from { opacity: 0; transform: translateY(-4px); }
                        to { opacity: 1; transform: none; } }
  .faq-item.is-open .faq-icon { transform: rotate(45deg); }
  .side-menu a { display: block; padding: 0.5rem 0.75rem; border-radius: 0.5rem; color: #475569; font-size: 0.9rem; transition: all 0.2s; }
  .side-menu a:hover { background: rgba(35,67,148,0.08); color: #234394; }
  .side-menu a.is-current { background: #234394; color: #fff; font-weight: 600; }
${extraStyle || ''}
</style>
</head>`;
}

function hero(h1, lede, eyebrow) {
  return `<div class="px-4 md:px-8 lg:px-16 py-14 md:py-20 bg-gradient-to-b from-[#E7F7FF] to-[#FFFFFF] text-center">
  <div class="max-w-4xl mx-auto">
    <span class="inline-block bg-[#234394] text-white text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-full mb-5">${enc(eyebrow)}</span>
    <h1 class="text-3xl md:text-5xl font-extrabold text-[#234394] leading-tight mb-4">${enc(h1)}</h1>
    <p class="text-base md:text-lg text-gray-600 max-w-3xl mx-auto">${enc(lede)}</p>
    <a href="/appointment" class="inline-block mt-8 px-8 py-3 rounded-full bg-[#234394] text-white font-semibold hover:bg-[#1a3272] transition-colors">Book a free 15-minute call</a>
  </div>
</div>`;
}

function breadcrumbs(trail) {
  const items = trail.map((t, i) =>
    i === trail.length - 1
      ? `<span class="text-gray-700 font-medium">${enc(t.label)}</span>`
      : `<a href="${t.href}">${enc(t.label)}</a><span class="text-gray-300">/</span>`
  ).join('\n      ');
  return `<div class="py-3 px-6 md:px-16 border-b border-gray-100 text-xs md:text-sm text-gray-500 breadcrumbs">
  <div class="max-w-7xl mx-auto flex items-center gap-2 flex-wrap">
      ${items}
  </div>
</div>`;
}

function sidebar(svc, services, currentSlug) {
  const links = services.map(s =>
    `<a class="${s.slug === currentSlug ? 'is-current' : ''}" href="/${s.folder}/${s.slug}">${enc(s.hubName)}</a>`
  ).join('\n      ');
  // Only outward links here. Sibling services are already listed above, and
  // showing them twice in one sidebar just looks like a bug.
  const related = (svc.related || [])
    .filter(k => !services.some(s => s.slug === k))
    .map(k => linkFor(k, services)).filter(Boolean)
    .map(([href, label]) => `<a href="${href}">${label}</a>`).join('\n      ');
  return `<aside class="md:w-72 flex-shrink-0">
  <div class="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm md:sticky md:top-24 side-menu">
    <h2 class="text-lg font-bold text-[#234394] mb-4 border-b pb-3">Child Development Services</h2>
    <div class="space-y-1">
      ${links}
    </div>
    <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400 mt-6 mb-2">Related</h3>
    <div class="space-y-1">
      ${related}
    </div>
  </div>
</aside>`;
}

/**
 * Self-contained accordion.
 *
 * The site's shared handler in assets/interactive.js drives these by swapping
 * Tailwind utilities (max-h-0 against max-h-[1000px]). That is fragile here:
 * max-h-[1000px] is an arbitrary value that the purged bundle does not contain,
 * so the open state depends on a class with no rule behind it. These pages use
 * their own class and their own CSS instead, with the toggle bound by a small
 * script at the bottom of the page.
 *
 * The markup deliberately avoids `transition-all` on the panel, which is the
 * hook interactive.js keys on, so the shared handler stays inert here and the
 * two cannot fight over the same element.
 */
function faqBlock(faqs) {
  const items = faqs.map(f => `<div class="faq-item">
  <button type="button" class="faq-btn" aria-expanded="false">
    <span class="faq-q">${enc(f.q)}</span>
    <svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="#234394" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
  </button>
  <div class="faq-panel" hidden><p>${enc(f.a)}</p></div>
</div>`).join('\n');
  return `<h2 class="text-2xl font-bold mt-12 mb-6 text-[#1e293b]">Frequently Asked Questions</h2>
<div class="space-y-2 mb-10">
${items}
</div>`;
}

function ctaBlock(name) {
  return `<div class="pathway-card mt-12 rounded-3xl p-8 bg-gradient-to-br from-[#eef2ff] to-[#e0e7ff] border border-[#c7d2fe]">
  <h2 class="text-xl md:text-2xl font-bold text-gray-800 mb-3">Not sure whether you need this yet?</h2>
  <p class="text-gray-600 mb-6">Start with a free 15-minute intake call. A clinician will tell you honestly whether ${enc(name)} is the right next step, or whether something else is. There is no obligation and no waiting list to join.</p>
  <div class="flex flex-wrap gap-3">
    <a href="/appointment" class="inline-block px-7 py-3 rounded-full bg-[#234394] text-white font-semibold hover:bg-[#1a3272] transition-colors">Book a free call</a>
    <a href="https://wa.me/919971576800" target="_blank" rel="noopener" class="inline-block px-7 py-3 rounded-full bg-white border border-[#c7d2fe] text-[#234394] font-semibold hover:bg-[#f8faff] transition-colors">WhatsApp ${PHONE_DISPLAY}</a>
  </div>
</div>`;
}

function scripts() {
  return `<script src="/assets/interactive.js"></script>
<script src="/assets/lead-magnets.js"></script>
<script>
(function () {
  // Accordion toggle. Delegated, so it works no matter when the DOM settles.
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('.faq-btn');
    if (!btn) return;
    var item = btn.closest('.faq-item');
    if (!item) return;
    var panel = item.querySelector('.faq-panel');
    var open = item.classList.toggle('is-open');
    if (panel) panel.hidden = !open;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();
</script>`;
}

/* ------------------------------------------------------------- page builders */

function hubPage(svc, services, problems) {
  const url = hubUrl(svc);
  const title = fit(
    suffixesFor(svc).map(s => `${svc.keyword}${s}`),
    TITLE_MIN, TITLE_MAX, `${svc.slug} hub title`, problems);

  const bases = [
    `${svc.keyword} at eMbrace across Delhi NCR: ${svc.metaBlurb}.`,
    `${svc.keyword} at eMbrace, Delhi NCR: ${svc.metaBlurb}.`,
    `${svc.keyword} at eMbrace in Delhi NCR.`,
  ];
  const desc = fit(
    bases.flatMap(b => CTAS.map(c => `${b} ${c}`)),
    DESC_MIN, DESC_MAX, `${svc.slug} hub desc`, problems);

  const body = svc.sections.map(s => {
    const paras = s.paras.map(p => `<p>${enc(p)}</p>`).join('\n');
    const list = s.list ? `<ul>\n${s.list.map(li => `<li>${enc(li)}</li>`).join('\n')}\n</ul>` : '';
    return `<h2>${enc(s.h2)}</h2>\n${paras}\n${list}`;
  }).join('\n\n');

  const keyPoints = `<div class="key-points-card my-10">
  <h3 class="text-lg font-bold text-[#1e293b] mb-4 mt-0">What you get at eMbrace</h3>
  <ul>
${svc.keyPoints.map(k => `    <li>${enc(k)}</li>`).join('\n')}
  </ul>
</div>`;

  const cities = `<h2>Where we offer ${enc(svc.shortName)}</h2>
<p>eMbrace runs three centres across Delhi NCR, plus online sessions for families elsewhere in India and abroad. For locality-specific details, including addresses, travel and what happens at a first visit:</p>
<ul>
  <li><a href="/locations/${svc.slug}-in-delhi" class="text-[#234394] font-semibold">${enc(svc.keyword)} in Delhi</a></li>
  <li><a href="/locations/${svc.slug}-in-gurgaon" class="text-[#234394] font-semibold">${enc(svc.keyword)} in Gurgaon</a></li>
  <li><a href="/locations" class="text-[#234394] font-semibold">All eMbrace locations across Delhi NCR</a></li>
</ul>`;

  return `${head({ title, desc, url })}
<body class="overflow-x-hidden">
<div id="root" class="overflow-x-hidden">
{{HEADER}}
${hero(svc.hubName, svc.lede, 'Child Development')}
${breadcrumbs([
    { label: 'Home', href: '/index.php' },
    { label: 'Child Development Centre', href: '/child-development-centre' },
    { label: svc.breadcrumb },
  ])}
<div class="px-4 md:px-8 lg:px-16 py-12 bg-white">
  <div class="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 lg:gap-12">
${sidebar(svc, services, svc.slug)}
    <div class="flex-grow max-w-4xl article-content">
${body}
${keyPoints}
${cities}
${faqBlock(svc.faqs)}
${ctaBlock(svc.shortName)}
    </div>
  </div>
</div>
{{FOOTER}}
</div>
${scripts()}
</body>
</html>
`;
}

function cityPage(svc, cityKey, services, problems) {
  const city = CITY[cityKey];
  const url = `/locations/${svc.slug}-in-${cityKey}`;
  const kw = `${svc.keyword} in ${city.name}`;

  const title = fit(
    suffixesFor(svc).map(s => `${kw}${s}`).concat([kw]),
    TITLE_MIN, TITLE_MAX, `${svc.slug}-${cityKey} title`, problems);

  const cityBases = city.centreVariants.flatMap(centre => ([
    `${kw} at ${centre}: ${svc.metaBlurb}.`,
    `${kw} at ${centre}.`,
  ]));
  const desc = fit(
    cityBases.flatMap(b => CTAS.map(c => `${b} ${c}`)),
    DESC_MIN, DESC_MAX, `${svc.slug}-${cityKey} desc`, problems);

  const nearbyLinks = city.nearby
    .map(slug => `<li><a href="/locations/child-psychologist-in-${slug}" class="text-[#234394]">Child psychology in ${slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}</a></li>`)
    .join('\n');

  const lede = `${svc.keyword} for families in ${city.name}, delivered by the same multidisciplinary team that runs our assessments. This page covers where you will be seen, how to get there and what happens first.`;

  return `${head({ title, desc, url })}
<body class="overflow-x-hidden">
<div id="root" class="overflow-x-hidden">
{{HEADER}}
${hero(kw, lede, 'Location Services')}
${breadcrumbs([
    { label: 'Home', href: '/index.php' },
    { label: svc.breadcrumb, href: hubUrl(svc) },
    { label: `In ${city.name}` },
  ])}
<div class="px-4 md:px-8 lg:px-16 py-12 bg-white">
  <div class="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 lg:gap-12">
${sidebar(svc, services, svc.slug)}
    <div class="flex-grow max-w-4xl article-content">

<h2>Where you will be seen in ${enc(city.name)}</h2>
<p>${enc(city.where)}</p>
<p>Sessions can also run online where the work suits it. History-taking, feedback and a good deal of therapy transfer well to video; direct assessment components are done in person.</p>

<h2>What ${enc(svc.shortName)} covers here</h2>
<div class="key-points-card my-8">
  <ul>
${svc.keyPoints.map(k => `    <li>${enc(k)}</li>`).join('\n')}
  </ul>
</div>
<p>For the full clinical picture, including what the difficulty is, the signs worth acting on and how treatment is planned, read our <a href="${hubUrl(svc)}" class="text-[#234394] font-semibold">${enc(svc.hubName)} guide</a>.</p>

<h2>How to start</h2>
<ul>
  <li><strong>Free 15-minute intake call.</strong> A clinician hears your concern and tells you honestly whether an appointment is the right next step. Some calls end with strategies to try at home instead.</li>
  <li><strong>Assessment or first session.</strong> Booked at whichever ${enc(city.name)} centre suits you, at a time that works around school where possible.</li>
  <li><strong>A written plan.</strong> What happens, how often, what to do at home, and what the school is being asked to do.</li>
  <li><strong>Review.</strong> Progress measured against the baseline set at the start, discussed openly with you.</li>
</ul>
<p>Fees are quoted upfront on your intake call, in writing, before you commit to anything.</p>

${faqBlock([
    {
      q: `Do you offer ${svc.shortName} in ${city.name}?`,
      a: `Yes. Families in ${city.name} are seen at ${city.centres}, and online where that suits the work. Start with a free 15-minute intake call.`,
    },
    {
      q: `How quickly can we be seen in ${city.name}?`,
      a: 'The intake call is usually arranged within a few working days. Appointment timing depends on the service and the clinician needed, and we will tell you honestly on the call.',
    },
    {
      q: 'Can we be seen outside school hours?',
      a: 'We offer later slots and Saturday appointments where availability allows. Tell the intake team what you need and they will work around school.',
    },
    ...svc.faqs.slice(0, 2),
  ])}

<h2>Other eMbrace services near you</h2>
<ul>
${nearbyLinks}
  <li><a href="/locations" class="text-[#234394]">View all eMbrace locations</a></li>
</ul>

${ctaBlock(svc.shortName)}
    </div>
  </div>
</div>
{{FOOTER}}
</div>
${scripts()}
</body>
</html>
`;
}

/* -------------------------------------------------------------------- write */

const problems = [];
let written = 0;

function write(rel, contents) {
  // Location pages carrying an authored body from generate-location-body.js are
  // owned by that pipeline now. Regenerating them here would silently discard
  // hand-written content. The hub pages this script also produces are
  // unaffected, since they never carry the marker.
  {
    const target = path.join(ROOT, rel);
    if (fs.existsSync(target) && fs.readFileSync(target, "utf8").includes("LOCATION-BODY:START")) return;
  }
  const full = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  if (!DRY) fs.writeFileSync(full, contents);
  written++;
  console.log(`  ${DRY ? 'would write' : 'wrote'}  ${rel}  (${contents.length.toLocaleString()} bytes)`);
}

for (const svc of SERVICES) {
  write(`${svc.slug}.php`, withIncludes(hubPage(svc, SERVICES, problems), ''));
  write(`locations/${svc.slug}-in-delhi.php`, withIncludes(cityPage(svc, 'delhi', SERVICES, problems), '/..'));
  write(`locations/${svc.slug}-in-gurgaon.php`, withIncludes(cityPage(svc, 'gurgaon', SERVICES, problems), '/..'));
}

console.log(`\n${DRY ? '[dry run] ' : ''}${written} pages for ${SERVICES.length} services.`);
if (problems.length) {
  console.log(`\n${problems.length} meta problem(s):`);
  problems.forEach(p => console.log(`  ${p}`));
  process.exitCode = 1;
} else {
  console.log('All titles 50-60 chars and descriptions 150-160 chars.');
}
