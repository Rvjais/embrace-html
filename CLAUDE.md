# eMbrace site conventions

Static-built PHP site for embracelives.com. Source pages are `.php`, compiled to
`dist/*.html` by `node build.js`, served with clean URLs.

## Clean URL rule (applies to every new page)

**No URL on this site ever contains `.php` or `index.php`.** Every internal link,
canonical tag, Open Graph URL, sitemap entry and breadcrumb uses the extensionless
form.

| Correct | Wrong |
|---|---|
| `/blog` | `/blog.php`, `/blog/index.php`, `/blog/` |
| `/blog/symptoms-of-adhd-in-adulthood` | `/blog/symptoms-of-adhd-in-adulthood.php` |
| `/adhd/adhd-symptoms` | `/adhd/adhd-symptoms.php` |

Rules for new pages:

1. **Write `href` values extensionless from the start.** Do not add `.php` and rely
   on the build to strip it. `build.js` does strip it, and `clean-urls.js` can
   retrofit a whole tree, but source and output should already agree.
2. **A section hub goes at `<section>.php` in the repo root, not `<section>/index.php`.**
   `blog.php` serves `/blog`; the `blog/` directory beside it holds the articles at
   `/blog/<slug>`. This keeps `index` out of the URL entirely.
   - Older hubs (`locations/index.php`, `resources/index.php`) predate this rule.
     They resolve to `/locations` and `/resources` correctly, so leave them alone,
     but do not copy the pattern for anything new.
   - A root-level hub sitting beside a same-named directory needs the `.htaccess`
     rewrite to test for the `.php` file *without* a `!-d` directory guard, or
     Apache hands the request to `DirectoryIndex` and the hub 404s. That fix is
     already in `.htaccess`; do not reintroduce the guard.
3. **PHP `include` paths keep their `.php` extension.** Those are resolved on disk by
   PHP, not by the web server. `<?php include __DIR__ . '/components/header.php'; ?>`
   is correct and must not be cleaned.
4. **Canonical, `og:url` and breadcrumb hrefs must match the clean URL exactly**, with
   no trailing slash. `.htaccess` 301s trailing slashes away.
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

- Hub: `blog.php` at repo root, URL `/blog`.
- Articles: `blog/<slug>.php`, URL `/blog/<slug>`.
- Every article carries an `article:published_time` meta tag and a visible
  `.author-card` block. `generate-schema.js` reads both to build the `BlogPosting`
  node, including `reviewedBy`. Omit either and the schema silently loses that field.
- Add each new post to the card grid in `blog.php`; nothing auto-generates that list.
- Nav entry for the blog lives in `components/header.php`, in both the desktop
  `emb-nav__item` list and the `#mobile-menu` panel.

## Content standards

Health content on this site is YMYL. Clinical claims must trace to a real source
(NIMH, DSM-5, CHADD, peer-reviewed literature) or to something the site already
states. No invented statistics, testimonials or outcomes. Site language is Indian
English: *counselling*, *behaviour*, *organised*, *recognise*.
