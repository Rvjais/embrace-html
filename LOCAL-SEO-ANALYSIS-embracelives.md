# Local SEO Analysis — embracelives.com

Audit date: 26 October 2026. Performed by reading the repository directly (no live web/GBP
access) — see Limitations at the end for what that does and does not cover.

**Business type:** Brick-and-mortar, multi-location. **Industry vertical:** Healthcare
(psychology / neurodevelopmental care).

## Score: 61 / 100

| Dimension | Weight | Score | Notes |
|---|---|---|---|
| GBP signals | 25% | — / not assessed | Requires live GBP data; see Limitations |
| Reviews & reputation | 20% | — / not assessed | Requires live GBP/third-party data; see Limitations |
| Local on-page SEO | 20% | 17/20 | Strong location pages, no doorway pattern, good internal linking; no `tel:` click-to-call |
| NAP consistency & citations | 15% | 11/15 | NAP fully consistent on-site; citation presence not checkable from code |
| Local schema markup | 10% | 6/10 | Correct subtypes, good coverage, missing `geo` and `aggregateRating` |
| Local link & authority signals | 10% | — / not assessed | Requires live backlink/citation data |

GBP, reviews, citations and backlink dimensions (55% of the full weighting) could not be scored
from the codebase and are reported as gaps, not zeros — see Limitations.

## NAP Consistency Audit

Checked `components/header.php`, `components/footer.php`, `contact-us.php`, and the
`generate-schema.js`-emitted Organization/MedicalClinic block (identical across all 420+
generated pages).

- **Phone:** `+91-9971576800` — identical everywhere: footer, contact-us.php body, schema
  `telephone`. ✅ Consistent.
- **Email:** `info@embracelives.com` — identical everywhere. ✅ Consistent.
- **Addresses:** three centres (Vasant Kunj, Gurugram, Malviya Nagar) — the street
  address/locality/postcode in `contact-us.php`'s visible page body matches the schema's
  `MedicalClinic` location nodes exactly (e.g. "C-7, Sector C, Pocket 5, Basement, Grand Vasant
  Kunj... 110070"). ✅ Consistent.
- **Gap:** the phone number is never rendered as a `tel:` link anywhere checked (footer links to
  `https://wa.me/919971576800`, contact-us.php does the same). A visitor on mobile has to copy the
  number rather than tap to call — WhatsApp-first is a reasonable product choice for this
  audience, but a `tel:` link should exist alongside it for direct-call intent.

## Local Schema Status

`generate-schema.js` emits, site-wide:
- Correct subtypes for the vertical: `['MedicalBusiness','MedicalOrganization']` for the org,
  `MedicalClinic` for each of the three locations (not the generic `LocalBusiness`). ✅
- `telephone`, `email`, `priceRange` ($$), `address` (full `PostalAddress`),
  `openingHoursSpecification`, `sameAs` (LinkedIn/Instagram/Facebook), `areaServed` (11 named
  places), `medicalSpecialty`, `availableService`. ✅ Good coverage.
- **Missing: `geo` (GeoCoordinates).** No `latitude`/`longitude` anywhere in `generate-schema.js`
  or any generated page. This is on the skill's "recommended properties" list and is a quick,
  concrete fix — one `GeoCoordinates` block per centre, hardcoded once in the generator.
- **Missing: `aggregateRating`.** No review schema anywhere, consistent with no review data being
  checkable from the repo (see Limitations) — add once real GBP rating/count figures are
  available; do not fabricate placeholder numbers.

## Location Page Quality (swap test)

Read `locations/adhd-assessment-in-defence-colony.php` in full and compared its body content
against `locations/adhd-assessment-in-greater-kailash.php` and `locations/adhd-assessment-in-saket.php`
(129 location pages total, confirmed via `generate-sitemap.js`'s own count).

**Result: passes the swap test.** This is not templated doorway content with the city name
swapped — each page carries genuinely area-specific material:
- Real travel directions from that specific neighbourhood (e.g. "From Defence Colony, Jangpura
  and Lajpat Nagar the road route runs via Ring Road and Press Enclave Marg... a Violet Line to
  Yellow Line change at Central Secretariat or Hauz Khas").
- The nearest actual centre and named clinicians who staff it, stated explicitly per catchment.
- Catchment-specific referral patterns (e.g. "assessments are often prompted by a school
  counsellor" for one area vs. different framing elsewhere).
- FAQs phrased around that specific catchment's real patterns, not generic Q&A.

This is a genuine strength worth protecting: any future location-page template change should
preserve this level of per-page specificity rather than homogenising it for speed.

Breadcrumbs link each location page back toward its topic hub, and 376 pages site-wide carry the
`emb-nearby` component linking topic/condition pages down to relevant location pages — a working
hub-and-spoke structure in both directions.

## The two new PDF lead-magnet pages

`resources/assessment-guide.php` and `resources/speech-language-checklist.php` were checked
against the established precedent (`resources/adult-stress-burnout-guide.php`,
`resources/learning-difficulties-checklist.php`). Both new pages carry:
- The same shared Organization/MedicalClinic schema block (NAP identical to the rest of the site).
- A "Delhi NCR" mention in the hero body copy, exactly matching the precedent pages' pattern.

**No local-SEO gap specific to these two pages** — they match the existing five-page precedent
exactly. Neither the new pages nor the three earlier ones put a street address inline in the page
body; all five rely on the shared header/footer/schema for that, which is a site-wide pattern, not
something introduced by this addition. Not flagging it as a defect of these two pages
specifically, since fixing it would mean changing the whole guide-page template, not these two
files.

## Top Prioritized Actions

**Critical**
1. None found that block indexing or basic function.

**High**
2. Add `GeoCoordinates` (`geo`) for all three centres to `generate-schema.js` — a concrete,
   low-effort fix with a clear spec match.
3. Supply live GBP data (or GBP listing URLs) for a real GBP/reviews audit — 45% of the scoring
   weight here is currently unscored, not low-scored, for lack of that data.

**Medium**
4. Add a `tel:` link alongside the existing WhatsApp link in the footer and contact page for
   direct-call intent on mobile.
5. Once real review counts/ratings exist in GBP, add `aggregateRating` to the schema — do not add
   it with placeholder numbers before then.

**Low**
6. Submit to Bing Places (feeds ChatGPT/Copilot/Alexa) and Apple Maps/Business listings if not
   already claimed — cannot be verified from the codebase; ask the practice directly.

## Limitations

This audit was performed entirely by reading repository files (`Read`/`Grep`/`Bash`), with no
live web or GBP API access. It could **not** assess:
- Actual Google Business Profile status, category, posts, photos, or Q&A.
- Real review count, rating, recency, or response patterns.
- Third-party citation presence (Yelp, BBB, Bing Places, Apple Maps, data aggregators).
- Live local pack ranking position or geo-grid visibility.
- Domain Authority or comprehensive backlink profile.

Closing that gap requires either the practice's own GBP dashboard access, or a follow-up pass with
live web/DataForSEO tools against the actual listing URLs.
