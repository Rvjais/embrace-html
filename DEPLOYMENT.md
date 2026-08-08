# Deployment notes

## 1. The nginx change is required, not optional

The live server is `nginx/1.24.0 (Ubuntu)` with PHP-FPM. The repo's [.htaccess](.htaccess)
contains the clean-URL rewrite rules, but **nginx does not read `.htaccess`** — that is an
Apache file. As a result, today:

| URL | What nginx returns |
| --- | --- |
| `/locations/adhd-assessment-in-delhi` | The **raw PHP source file** as `Content-Type: application/octet-stream` — no header, no footer, and the literal text `<?php include __DIR__ . '/../components/header.php'; ?>` in the output |
| `/locations/adhd-assessment-in-delhi.php` | The correctly rendered page |
| `/about` | Same problem — this affects the whole site, not just locations |

Every canonical tag and every internal link added in this change points at the clean URL.
**Until the nginx config below is applied, those URLs serve raw source.** Applying it also
closes the source-code disclosure.

### The config

In the `server { … }` block for `embracelives.com`:

```nginx
server {
    server_name embracelives.com www.embracelives.com;
    root /var/www/embracelives;   # adjust to the real docroot

    index index.php index.html;

    # Clean URLs: /about -> about.php, /locations/x -> locations/x.php
    #
    # The named-location + `rewrite ... last` is deliberate. Writing
    # `try_files $uri $uri/ $uri.php;` instead is what causes the current bug:
    # try_files serves the matched .php file with the CURRENT location's handler
    # (static), so the source is sent to the browser instead of being executed.
    # `rewrite ... last` re-runs location matching, so the request lands in the
    # `location ~ \.php$` block below and is handed to PHP-FPM.
    location / {
        try_files $uri $uri/ @php;
    }

    location @php {
        rewrite ^(.*)$ $1.php last;
    }

    location ~ \.php$ {
        try_files $uri =404;                       # never pass a missing file to FPM
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;   # match the installed PHP version
    }

    # Belt and braces: if anything ever falls through to a static handler,
    # do not hand out PHP source.
    location ~* \.(php|inc)$ {
        internal;
    }

    # Serve robots.txt and sitemap.xml as real files
    location = /robots.txt  { try_files $uri =404; access_log off; }
    location = /sitemap.xml { try_files $uri =404; add_header Content-Type application/xml; }
}
```

> The final `location ~* \.(php|inc)$ { internal; }` block must come **after** the
> `location ~ \.php$` FPM block, and nginx uses the first matching regex location — so in
> practice the FPM block wins for real requests. If you would rather not risk the ordering,
> drop that last block; the `try_files $uri =404` inside the FPM block is the important part.

Apply and reload:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

### Optional: collapse `.php` duplicates

The existing internal links across the site still use `/about.php`, `/index.php` etc. Those
keep working. To stop both forms being indexed, add a redirect **above** `location /`:

```nginx
# GET-only so form posts to /api/*.php are not broken by a 301
if ($request_method = GET) {
    rewrite ^/(.*)\.php$ /$1 permanent;
}
```

Leave this out if anything posts directly to a `.php` endpoint.

### Verifying afterwards

```bash
curl -sI https://embracelives.com/locations/adhd-assessment-in-delhi | head -3
# expect: HTTP/1.1 200 OK  +  Content-Type: text/html; charset=UTF-8
#         (NOT application/octet-stream)

curl -s https://embracelives.com/locations/adhd-assessment-in-delhi | grep -c '<?php'
# expect: 0

curl -s https://embracelives.com/robots.txt | head -1
# expect: User-agent: *
```

---

## 2. Regenerating the location assets

Six scripts own the generated markup. All are idempotent — re-running updates in place
between `<!-- … :START -->` / `<!-- … :END -->` markers rather than duplicating.

| Script | Writes |
| --- | --- |
| `node generate-canonicals.js` | `<link rel="canonical">` and `<meta property="og:url">` on every page, set to that page's own clean URL |
| `node generate-locations-nav.js` | The "All Locations" accordion in `components/footer.php`, the card grid in `locations/index.php`, and the location clusters in `seo_sitemap.php` |
| `node generate-location-links.js` | The "…across Delhi NCR" block above the footer on 358 pages (service pages get their matched service in 10 areas; location pages get sibling services + the same service elsewhere) |
| `node generate-location-intext.js` | One in-body contextual paragraph on each of the 10 service hub pages |
| `node generate-schema.js` | The JSON-LD `@graph` in every page's `<head>` |
| `node generate-sitemap.js` | `sitemap.xml` (also runs automatically from `build.js`) |

**After adding or removing any page**, run all six — schema last, since it reads the
finished markup:

```bash
node generate-canonicals.js && node generate-locations-nav.js && \
node generate-location-links.js && node generate-location-intext.js && \
node generate-schema.js && node generate-sitemap.js
```

`generate-locations-nav.js` reports any slug in the area × service matrix that has no file
(`MISSING pages`) and any location file not covered by the matrix (`NOT IN NAV`), so a new
area or service is a one-line edit to the `AREAS` / `SERVICES` arrays in that script and in
`generate-location-links.js`.

---

## 3. Post-deploy SEO steps

1. Submit `https://embracelives.com/sitemap.xml` in Google Search Console.
2. Use URL Inspection → *Request Indexing* on `https://embracelives.com/locations` — the hub
   links to all 110 pages, so it seeds discovery for the whole set.
3. Re-check a sample of location pages in GSC after ~2 weeks; before this change their
   canonicals pointed at a 404, so any that were indexed may need time to recover.

## 4. Outstanding items that need someone with server access

Two of the four production defects found during QA are now fixed in the repo. The remaining
two **cannot be fixed from here** — they need someone with server access.

**Fixed in this repo:**

- ~~`Client review Samia.mov` served as `video/quicktime`~~ — the file was always an MP4
  container (`ftypmp42`) wearing the wrong extension, so Chrome refused to play it. Renamed
  to `.mp4` via `git mv` and the single reference in `index.php` updated. Now serves as
  `video/mp4`.
- ~~`og-image.png` missing~~ — all 374 pages referenced it and it 404'd, so every WhatsApp,
  LinkedIn and Facebook share had no preview thumbnail. A 1200×630 PNG now exists at the site
  root, built from the real logo and the site's own hero palette. It matches the
  `og:image:width` / `og:image:height` already declared on every page, and `build.js` already
  copies it. Replace it with something from a designer whenever you like — the filename and
  dimensions are what matter.

**Still blocked on server access:**

1. **`embrace-media/` was never uploaded.** Every image in the homepage "Moments & Memories"
   strip and the whole `/gallery` page 404s on production. The files are all present in the
   repo — the folder just needs deploying alongside the PHP.
2. **The nginx config in §1.** Nothing else in this release reaches users until it is applied,
   and applying it is more urgent than before: all 374 canonicals and all 373 sitemap URLs now
   point at clean URLs which, on the current config, serve raw PHP source.

(`Logo.svg` at the root also 404s; rather than adding a file, the schema now points at the
real `/assets/Logo-DrHvIBUF.svg`.)

## 5. The footer is a redesign that had never been deployed

Worth knowing before you push, because the footer **will visibly change** on every page.

Production currently serves a light cream "glass" footer (`glass-footer`, rounded top corners,
full-colour logo, inline SVG icons). The `components/footer.php` in this repo is a **dark navy
redesign committed on 2026-08-06** (`9dd610b`) that was never deployed — and it was broken in
three ways, all caused by `components/footer.php` not being in the Tailwind content glob when
`assets/index-B-kGA3UA.css` was built:

| Defect | Symptom | Fix applied |
| --- | --- | --- |
| `.bg-[#0f172a]` absent from the CSS | Footer rendered with no background at all | Declared in the generated `<style>` block |
| `.brightness-0` present but `.invert` absent | Logo was blackened and never flipped white — **invisible on the dark footer** | `footer .brightness-0.invert{filter:brightness(0) invert(1)}` |
| Footer used Phosphor icon fonts, loaded on `index.php` **only** | Social + contact icons rendered on the homepage and **nowhere else** (376 pages) | All 6 icons replaced with inline SVGs — no font dependency, renders everywhere |

The icons are now inline SVG using `fill="currentColor"`, so the existing hover states
(LinkedIn blue, Instagram gradient, Facebook blue) still work, and `index.php` keeps its own
Phosphor script for its own icons.

Verified identical on `/`, `/about`, `/gallery`, `/locations`, a location page, a topic page
and `/seo_sitemap`: 3 SVG icons, 0 Phosphor dependencies, accordion present, logo filter applied.

If you would rather the logo stayed **full-colour** on the dark footer instead of monochrome
white, delete `brightness-0 invert` from the logo `<img>` in `components/footer.php` — that is
how the live glass footer renders it.

## 6. Structured data (JSON-LD)

Every page now carries one consolidated `@graph` in `<head>`, generated by
`generate-schema.js`. One block per page, not several loose ones, so the Organization is
declared once with a stable `@id` and everything else references it.

| Node | Count | Notes |
| --- | --- | --- |
| `MedicalBusiness` + `MedicalOrganization` | 375 | Real NAP, all **three actual clinics** as `MedicalClinic` under `location`, real hours (Mo–Sa 10:00–18:00), `sameAs` socials |
| `WebSite` | 375 | |
| `MedicalWebPage` | 345 | Topic, location and hub pages |
| `FAQPage` | 347 | **1,041 questions**, all read from the page's own visible accordion |
| `BreadcrumbList` | 346 | Built from the visible breadcrumb trail |
| `Service` | 110 | One per location page |
| `WebPage` / `CollectionPage` / `AboutPage` / `ContactPage` | 30 | |

**Three deliberate decisions worth knowing:**

1. **FAQ content is extracted from the markup, never written fresh.** Google requires the
   answer to be visible on the page, and every one of the 1,041 is. Three different accordion
   patterns exist on this site (topic pages, homepage, `/faq`) and the generator handles all three.
2. **Location pages get `Service` + `areaServed`, not `LocalBusiness`.** eMbrace has three real
   premises. Emitting ten `LocalBusiness` nodes with invented street addresses for Saket,
   Hauz Khas, Green Park and so on would be fabricated NAP data — the kind of thing that gets
   a business penalised, not ranked.
3. **The legacy blocks' editorial content was rescued.** 45 pages had hand-written
   `MedicalCondition` / `possibleTreatment` detail. It now lives in
   `schema-medical-entities.json` — an explicit, reviewable data file — and is re-applied on
   every run. Edit that file to change it. (Those legacy blocks also carried the same
   root-level URL bug as the canonicals, pointing at `/ados-2-assessment` for a page that
   lives at `/autism/ados-2-assessment`.)

Validation run over all 375 pages: 0 parse failures, 0 pages with more than one block,
0 duplicate `@id`s, 0 unresolved `@id` references, 0 malformed `Question` nodes,
0 page URLs disagreeing with the canonical, and all breadcrumb URLs resolve.

> Note: Google restricted **FAQ rich results** to authoritative government and health sites in
> 2023, so do not expect FAQ accordions in the SERP. The markup still earns its place — it is
> read by AI Overviews, ChatGPT, Perplexity and Bing, which is where FAQ content increasingly
> gets surfaced and cited.

## 7. Known gaps (not addressed here)

- **No structured data on location pages.** None of the 110 pages carry JSON-LD. `LocalBusiness`
  (or `MedicalBusiness`) + `Service` markup with real NAP data per area would be the single
  biggest remaining local-SEO win.
- **`components/footer.html` is stale.** It is fetched by `assets/interactive.js` for pages with
  a `footer-placeholder` div, but zero pages use that mechanism — all 374 use the PHP include.
  It did not receive the locations accordion. Either delete it or keep it in sync.
- **`build.js` does not execute PHP.** It inlines `components/footer.php` as text, so
  `<?php echo date('Y'); ?>` in the copyright line leaks into any static build. Pre-existing;
  the generated locations markup is deliberately plain HTML so it is unaffected.
- **`vercel.json` is a leftover** from a Vercel attempt and has no effect on the nginx host.
- **`gallery.php` still loads the Tailwind Play CDN** (`cdn.tailwindcss.com`), which compiles
  CSS in the browser and is not meant for production. It cannot just be deleted: that page's
  classes (`max-w-[95%]`, `bg-[#E8F8F2]`, `blur-2xl`, the masonry columns) are absent from the
  purged `assets/index-B-kGA3UA.css`, so the layout would collapse. The fix is to rebuild
  Tailwind with `gallery.php` in the content glob, then drop the script tag.
- **The Tailwind build is purged too aggressively.** `components/footer.php` and `gallery.php`
  were clearly not in the content glob when `assets/index-B-kGA3UA.css` was generated —
  `bg-[#0f172a]`, `text-[#F2DC68]`, `border-white/10` and `lg:grid-cols-4` are all missing.
  They are currently patched back in via the generated `<style>` block in the footer.
- **`thank-you.php` has no canonical tag** and `gallery.php` has no `og:url`.
  `generate-canonicals.js` deliberately does not invent tags that were never there.

## 8. QA performed before handover

Run against a local PHP server using the same clean-URL rules as the nginx config above:

| Check | Result |
| --- | --- |
| `php -l` on every PHP file | 0 syntax errors |
| All 377 pages crawled — HTTP status | 377 × 200 |
| JSON-LD present and valid on every page | 375 / 375 |
| All 377 pages — PHP warnings/notices/fatals | 0 |
| All 377 pages — raw `<?php` leaking into output | 0 |
| Every unique internal link (380 targets) | 0 broken |
| Every referenced asset (406 files) | 0 missing |
| Every sitemap URL (373) | 0 unresolvable |
| Canonical is self-referential and clean | 374 / 374 |
| `og:url` matches canonical | 373 / 373 |
| Duplicate or unbalanced generated blocks | 0 |
| Location pages linking to themselves | 0 |
| All six generators idempotent on re-run | confirmed |
