/**
 * Generates the sitewide "All Locations" accordion and writes it into
 * components/footer.php between the LOCATIONS-NAV markers.
 *
 *     node generate-locations-nav.js
 *
 * The block is emitted as plain HTML (no PHP tags) so it renders identically
 * whether the page is served by PHP or compiled by build.js.
 *
 * Every one of the location pages is a real <a> in the markup — the accordion
 * only hides them visually, so crawlers still follow all of them from any page.
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const LOCATIONS_DIR = path.join(ROOT, 'locations');

// Display order for the area columns: Delhi first, then South Delhi localities,
// then the NCR satellites.
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

// Display order for the services inside each area.
const SERVICES = [
  ['child-psychologist', 'Child Psychologist'],
  ['child-counselling', 'Child Counselling'],
  ['teen-counselling', 'Teen Counselling'],
  ['adult-counselling', 'Adult Counselling'],
  ['autism-assessment', 'Autism Assessment'],
  ['autism-therapy', 'Autism Therapy'],
  ['adhd-assessment', 'ADHD Assessment'],
  ['learning-disability-assessment', 'Learning Disability Assessment'],
  ['speech-therapy', 'Speech Therapy'],
  ['occupational-therapy', 'Occupational Therapy'],
  ['special-education', 'Special Education'],
  // Child development services. Only Delhi and Gurgaon have pages so far; the
  // existing-slug check below skips the localities that do not.
  ['developmental-delay-treatment', 'Developmental Delay Treatment'],
  ['intellectual-disability-treatment', 'Intellectual Disability Treatment'],
  ['down-syndrome-treatment', 'Down Syndrome Treatment'],
  ['oral-motor-therapy', 'Oral Motor Delay Treatment'],
  ['aba-therapy', 'ABA Therapy'],
  ['physiotherapy', 'Physiotherapy'],
  ['pediatric-neurologist', 'Pediatric Neurologist'],
  ['developmental-pediatrician', 'Developmental Pediatrician'],
  ['child-development-centre', 'Child Development Centre'],
];

/** Slugs that actually exist on disk, so we never emit a link to a missing page. */
function existingSlugs() {
  return new Set(
    fs.readdirSync(LOCATIONS_DIR)
      .filter(f => f.endsWith('.php') && f !== 'index.php')
      .map(f => f.replace(/\.php$/, ''))
  );
}

const CSS = `<style>
    /* Footer utilities that were dropped by the Tailwind purge in
       assets/index-B-kGA3UA.css — without them <footer> renders on a white
       background with no accent colour. Delete this block once the CSS is
       rebuilt with components/footer.php in the content glob. */
    footer.bg-\\[\\#0f172a\\]{background-color:#0f172a}
    /* .brightness-0 IS in the build but .invert is NOT, so the logo was being
       blackened and never flipped white — invisible on the dark footer. */
    footer .brightness-0.invert{filter:brightness(0) invert(1)}
    footer .text-\\[\\#F2DC68\\]{color:#F2DC68}
    footer .hover\\:text-\\[\\#F2DC68\\]:hover{color:#F2DC68}
    footer .hover\\:bg-\\[\\#0077b5\\]:hover{background-color:#0077b5}
    footer .border-white\\/10{border-color:rgba(255,255,255,.1)}
    @media(min-width:1024px){footer .lg\\:grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}}

    .emb-locnav{background:#0f172a;color:#fff;padding:3.5rem 0 0.5rem;border-top:1px solid rgba(255,255,255,.08)}
    .emb-locnav__inner{max-width:80rem;margin:0 auto;padding:0 1.5rem}
    @media(min-width:768px){.emb-locnav__inner{padding:0 3rem}}
    .emb-locnav__head{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:1rem;margin-bottom:1.75rem}
    .emb-locnav__title{font-size:1.25rem;font-weight:700;color:#fff;margin:0}
    .emb-locnav__all{font-size:.8125rem;font-weight:600;color:#F2DC68;text-decoration:none;white-space:nowrap}
    .emb-locnav__all:hover{text-decoration:underline}
    .emb-locnav__grid{display:grid;align-items:start;grid-template-columns:repeat(1,minmax(0,1fr));gap:0 2.5rem}
    @media(min-width:640px){.emb-locnav__grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
    @media(min-width:900px){.emb-locnav__grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
    @media(min-width:1200px){.emb-locnav__grid{grid-template-columns:repeat(5,minmax(0,1fr))}}
    .emb-locnav__item{margin-bottom:1.5rem}
    .emb-locnav__item>summary{list-style:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:0 0 .625rem;border-bottom:1px solid rgba(255,255,255,.28);font-size:.9375rem;font-weight:500;color:#fff;transition:color .2s,border-color .2s}
    .emb-locnav__item>summary::-webkit-details-marker{display:none}
    .emb-locnav__item>summary::marker{content:""}
    .emb-locnav__item>summary:hover{color:#F2DC68;border-bottom-color:#F2DC68}
    .emb-locnav__item>summary:focus-visible{outline:2px solid #F2DC68;outline-offset:3px;border-radius:2px}
    .emb-locnav__icon{position:relative;width:.8125rem;height:.8125rem;flex:none}
    .emb-locnav__icon::before,.emb-locnav__icon::after{content:"";position:absolute;background:currentColor;transition:transform .25s ease,opacity .25s ease}
    .emb-locnav__icon::before{left:0;top:50%;width:100%;height:1.5px;transform:translateY(-50%)}
    .emb-locnav__icon::after{top:0;left:50%;height:100%;width:1.5px;transform:translateX(-50%)}
    .emb-locnav__item[open]>summary .emb-locnav__icon::after{transform:translateX(-50%) scaleY(0);opacity:0}
    .emb-locnav__links{list-style:none;margin:.875rem 0 0;padding:0 0 0 .875rem;border-left:1px solid rgba(255,255,255,.22)}
    .emb-locnav__links li{margin-bottom:.625rem}
    .emb-locnav__links a{display:inline-block;color:#cbd5e1;font-size:.8125rem;line-height:1.45;text-decoration:none;transition:color .2s}
    .emb-locnav__links a:hover,.emb-locnav__links a:focus-visible{color:#F2DC68;text-decoration:underline}

    /* "Available near you" blocks injected into service and location pages by
       generate-location-links.js. Defined here because the footer is on every page. */
    .emb-nearby{margin:3rem 0;background:#F9FBFF;border:1px solid #E0E6F0;border-radius:1.5rem;padding:1.75rem}
    .emb-nearby__title{font-size:1.125rem;font-weight:800;color:#234394;margin:0 0 .35rem}
    .emb-nearby__sub{font-size:.8125rem;color:#64748b;margin:0 0 1.25rem;line-height:1.5}
    .emb-nearby__cols{display:grid;grid-template-columns:minmax(0,1fr);gap:1.5rem 2.5rem}
    @media(min-width:900px){.emb-nearby__cols--two{grid-template-columns:repeat(2,minmax(0,1fr))}}
    .emb-nearby__group h4{font-size:.6875rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#94a3b8;margin:0 0 .625rem}
    .emb-nearby__list{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:minmax(0,1fr);gap:.125rem}
    @media(min-width:640px){.emb-nearby__list--wide{grid-template-columns:repeat(2,minmax(0,1fr))}}
    .emb-nearby__list a{display:block;font-size:.8125rem;line-height:1.4;color:#475569;text-decoration:none;padding:.35rem .5rem;border-radius:.5rem;transition:background .15s,color .15s}
    .emb-nearby__list a:hover,.emb-nearby__list a:focus-visible{background:#E7F7FF;color:#234394}
    .emb-nearby__more{display:inline-block;margin-top:1.125rem;font-size:.8125rem;font-weight:700;color:#234394;text-decoration:none}
    .emb-nearby__more:hover{text-decoration:underline}
  </style>`;

function build() {
  const slugs = existingSlugs();
  const missing = [];
  let linkCount = 0;

  const items = AREAS.map(([areaSlug, areaLabel]) => {
    const links = SERVICES.map(([svcSlug, svcLabel]) => {
      const slug = `${svcSlug}-in-${areaSlug}`;
      if (!slugs.has(slug)) { missing.push(slug); return null; }
      linkCount++;
      return `<li><a href="/locations/${slug}">${svcLabel} in ${areaLabel}</a></li>`;
    }).filter(Boolean);

    return `      <details class="emb-locnav__item">
        <summary>${areaLabel}<span class="emb-locnav__icon" aria-hidden="true"></span></summary>
        <ul class="emb-locnav__links">
${links.map(l => '          ' + l).join('\n')}
        </ul>
      </details>`;
  }).join('\n');

  const html = `${CSS}
  <nav class="emb-locnav" aria-label="All locations">
    <div class="emb-locnav__inner">
      <div class="emb-locnav__head">
        <h2 class="emb-locnav__title">All Locations</h2>
        <a class="emb-locnav__all" href="/locations">View all locations &rsaquo;</a>
      </div>
      <div class="emb-locnav__grid">
${items}
      </div>
    </div>
  </nav>`;

  // The same matrix rendered as expanded cards for the /locations hub page.
  const hub = '<div class="emb-areas">\n' + AREAS.map(([areaSlug, areaLabel]) => {
    const links = SERVICES
      .filter(([svcSlug]) => slugs.has(`${svcSlug}-in-${areaSlug}`))
      .map(([svcSlug, svcLabel]) =>
        `<li><a href="/locations/${svcSlug}-in-${areaSlug}">${svcLabel} in ${areaLabel}</a></li>`);

    return `<div class="emb-area">
<h3 class="emb-area__name">${areaLabel}</h3>
<p class="emb-area__count">${links.length} services available</p>
<ul class="emb-area__links">
${links.map(l => '  ' + l).join('\n')}
</ul>
</div>`;
  }).join('\n') + '\n</div>';

  // The same matrix as a cluster block for the HTML sitemap page (seo_sitemap.php).
  const seomap = AREAS.map(([areaSlug, areaLabel]) => {
    const links = SERVICES
      .filter(([svcSlug]) => slugs.has(`${svcSlug}-in-${areaSlug}`))
      .map(([svcSlug]) =>
        `            <a href="/locations/${svcSlug}-in-${areaSlug}">/${svcSlug}-in-${areaSlug}</a>`);

    return `        <div class="cluster">
          <h2>Locations &ndash; ${areaLabel} <span>(${links.length} pages)</span></h2>
          <div class="url-grid">
            <a href="/locations">/locations</a>
${links.join('\n')}
          </div>
        </div>`;
  }).join('\n');

  // Report any slug in the AREAS x SERVICES matrix that has no page yet.
  const orphaned = [...slugs].filter(s => {
    return !AREAS.some(([a]) => SERVICES.some(([sv]) => `${sv}-in-${a}` === s));
  });

  return { html, hub, seomap, linkCount, missing, orphaned };
}

const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Replace the content between START/END markers in `file`, or report if absent. */
function writeBetweenMarkers(file, start, end, inner, fallback) {
  let text = fs.readFileSync(file, 'utf8');
  const block = `${start}\n${inner}\n${end}`;
  if (text.includes(start) && text.includes(end)) {
    text = text.replace(new RegExp(esc(start) + '[\\s\\S]*?' + esc(end)), block);
  } else if (fallback) {
    text = fallback(text, block);
  } else {
    throw new Error(`Markers not found in ${file}`);
  }
  fs.writeFileSync(file, text);
}

const NAV_START = '<!-- LOCATIONS-NAV:START (generated by generate-locations-nav.js — do not edit by hand) -->';
const NAV_END = '  <!-- LOCATIONS-NAV:END -->';
const HUB_START = '<!-- LOCATIONS-HUB:START (generated by generate-locations-nav.js — do not edit by hand) -->';
const HUB_END = '<!-- LOCATIONS-HUB:END -->';
const SEOMAP_START = '<!-- LOCATIONS-SEOMAP:START (generated by generate-locations-nav.js — do not edit by hand) -->';
const SEOMAP_END = '<!-- LOCATIONS-SEOMAP:END -->';

const { html, hub, seomap, linkCount, missing, orphaned } = build();

writeBetweenMarkers(
  path.join(ROOT, 'components', 'footer.php'),
  NAV_START, NAV_END, html,
  // First run: insert immediately above the <footer> element.
  (text, block) => text.replace(/^<footer /m, `${block}\n<footer `)
);

writeBetweenMarkers(path.join(ROOT, 'locations', 'index.php'), HUB_START, HUB_END, hub);
writeBetweenMarkers(path.join(ROOT, 'seo_sitemap.php'), SEOMAP_START, SEOMAP_END, seomap);

console.log(`footer.php + locations/index.php + seo_sitemap.php updated: ${AREAS.length} areas, ${linkCount} location links.`);
if (missing.length) console.log(`  MISSING pages (linked in matrix, no file): ${missing.join(', ')}`);
if (orphaned.length) console.log(`  NOT IN NAV (file exists, not in matrix): ${orphaned.join(', ')}`);
