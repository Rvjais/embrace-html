# eMbrace site conventions

Static-built PHP site for embracelives.com. Source pages are `.php`, compiled to
`dist/*.html` by `node build.js`, served with clean URLs.

## Clean URL rule (applies to every new page)

**No URL on this site ever contains `.php` or `index.php`.** Every internal link,
canonical tag, Open Graph URL, sitemap entry and breadcrumb uses the extensionless
form.

| Correct | Wrong |
|---|---|
| `/blog/` | `/blog.php`, `/blog/index.php`, `/blog` |
| `/blog/symptoms-of-adhd-in-adulthood` | `/blog/symptoms-of-adhd-in-adulthood.php` |
| `/adhd/adhd-symptoms` | `/adhd/adhd-symptoms.php` |

**The production server is nginx, not Apache.** `.htaccess` is read by nobody.
Anything the clean URL scheme needs must therefore hold under nginx's own
`try_files` behaviour, and the one rule that matters is: **when a directory
exists, nginx 301s `/<dir>` to `/<dir>/` before any other handler sees the
request.** A section hub whose name collides with a directory is only ever
reachable at the trailing-slash form.

Rules for new pages:

1. **Write `href` values extensionless from the start.** Do not add `.php` and rely
   on the build to strip it. `build.js` does strip it, and `clean-urls.js` can
   retrofit a whole tree, but source and output should already agree.
2. **A section hub with child pages goes at `<section>/index.php`, and its URL keeps
   the trailing slash.** `blog/index.php` serves `/blog/`; the articles beside it
   are at `/blog/<slug>`. `locations/index.php` and `resources/index.php` follow
   the same shape.
   - A root-level `<section>.php` sitting beside a `<section>/` directory does
     **not** work here. nginx redirects `/<section>` to `/<section>/` because the
     directory exists, then serves that directory's index; the root-level hub is
     never consulted. This is exactly how `/blog` broke: it 301'd to `/blog/`,
     which 403'd for want of an index file, leaving the hub reachable only at the
     `/blog.php` the clean URL rule forbids.
   - `blog.php` now survives only as a 301 stub to `/blog/`, and is excluded from
     `build.js`, `generate-schema.js` and `generate-sitemap.js`.
   - A hub with **no** child directory still lives at `<page>.php` and has no
     trailing slash: `/about`, `/contact-us`, `/faq`.
3. **PHP `include` paths keep their `.php` extension.** Those are resolved on disk by
   PHP, not by the web server. `<?php include __DIR__ . '/components/header.php'; ?>`
   is correct and must not be cleaned.
4. **Canonical, `og:url`, breadcrumb hrefs and sitemap entries must match the URL
   that actually returns 200** — trailing slash for a `<dir>/index.php` hub, no
   trailing slash for everything else. `generate-canonicals.js`,
   `generate-schema.js` and `generate-sitemap.js` all encode this same rule; if you
   change one, change all three. A canonical pointing at a URL that redirects tells
   Google the real version of the page is somewhere it is not.
5. Slugs are lowercase, hyphen-separated, and match the page's primary keyword.

Verify before committing:

```bash
node clean-urls.js --dry   # must report 0 links cleaned
```

## After adding or changing a page

Run these, in this order:

```bash
node generate-schema.js    # rewrites the SCHEMA:START/END block on every page
node generate-sitemap.js   # rebuilds sitemap.xml from the .php tree
node build.js              # compiles dist/ (also regenerates the sitemap)
```

`generate-schema.js` **overwrites any hand-written JSON-LD on every run.** Never paste
structured data into a page. Add a branch to the generator instead. It reads FAQs,
breadcrumbs, headlines, publish dates and reviewer names out of the visible page
markup, so schema can never claim something the page does not show.

New pages are picked up automatically by both generators. Add a page to `HUB_PAGES` in
`generate-sitemap.js` only if it is a genuine section entry point (priority 0.9).

## Blog

- Hub: `blog/index.php`, URL `/blog/` (trailing slash — see the Clean URL rule).
- Articles: `blog/<slug>.php`, URL `/blog/<slug>`.
- `blog.php` at the repo root is a 301 stub only. Do not add content to it.
- Every article carries an `article:published_time` meta tag and a visible
  `.author-card` block. `generate-schema.js` reads both to build the `BlogPosting`
  node, including `reviewedBy`. Omit either and the schema silently loses that field.
- **The card grid in `blog/index.php` is built from two lists and sorted by date.**
  Standalone posts are rows in the `$manualPosts` array at the top of that file;
  scheduled series posts come from `components/scheduled-blog-catalog.php` and only
  appear once their date has passed. Both are merged and sorted newest first before
  rendering, so a card's position follows its publication date rather than which list
  it came from. Do not render them as two separate blocks again: that is what put a
  13 September post above a 15 September one.
  - Adding a standalone post means adding one row to `$manualPosts`, not pasting card
    markup. Its `date` must match the article's own `article:published_time`, because
    that field is what orders the grid and what the card displays.
- Nav entry for the blog lives in `components/header.php`, in both the desktop
  `emb-nav__item` list and the `#mobile-menu` panel.

## Content standards

Health content on this site is YMYL. Clinical claims must trace to a real source
(NIMH, DSM-5, CHADD, peer-reviewed literature) or to something the site already
states. No invented statistics, testimonials or outcomes. Site language is Indian
English: *counselling*, *behaviour*, *organised*, *recognise*.
