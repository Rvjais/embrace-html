# Performance: what was fixed, and what is left

Measured locally with headless Chrome against the built site, at a 390px mobile
viewport. The PageSpeed Insights link could not be read directly: that page is a
JavaScript app that serves an empty shell to a fetcher, and the public
PageSpeed API had already hit its daily anonymous quota. Everything below comes
from measuring the pages themselves, which is where the fixes had to be made
regardless.

Last updated: 11 August 2026.

---

## 1. Fixed in this pass

### A broken image inside a circular badge on children.php

Four `<img>` tags had `src="[object Object],[object Object]"`, a JavaScript
object stringified into the markup at some point in the page's history. They sat
inside the numbered step badges, so each one rendered as a broken-image glyph in
the middle of a coloured circle. Removed; the badges keep their number and
colour, which is all the design needed.

### Layout shift: 1,991 images had no dimensions

Not a single `<img>` on the site declared `width` and `height`, so the browser
could not reserve space and every image pushed content down as it arrived. That
is the main driver of Cumulative Layout Shift, and CLS is a ranking signal.

`optimise-images.js` now reads the intrinsic size out of each file (PNG, JPEG,
GIF, WebP and SVG parsed in pure Node, since this machine has no image tooling)
and writes the attributes in. It is safe because the site's Tailwind preflight
already sets `img { max-width: 100%; height: auto }`, so CSS still controls the
rendered size and the attributes only supply the aspect ratio.

On the home page, images missing dimensions went from **69 to 4**. The remaining
handful are injected by JavaScript at runtime.

### Lazy loading, decode and fetch priority

- `loading="lazy"` added to 653 offscreen images, so they stop competing with
  what is on screen. The logo and the first three images per page stay eager.
- `decoding="async"` on 1,991 images, keeping decode off the main thread.
- `fetchpriority="high"` on the first content image of each page, which is
  usually the LCP element and is otherwise fetched at low priority.

### A render-blocking third-party script

`https://unpkg.com/@phosphor-icons/web` sat in `<head>` on five pages with no
`defer`, blocking first paint on a third-party connection. Now deferred, with a
`preconnect` so the connection is warm when it does run. Render-blocking head
scripts on the home page: **1 to 0**.

### Caching and compression

Added to `vercel.json` (30 days for `/assets`, a year for media and video, HTML
always fresh) and to `.htaccess` for Apache. See section 3 for nginx, which is
what actually serves the live site today and ignores both files.

---

## 2. The big one, which needs work I cannot do here

**Images are 3.2 MB of the home page's 3.4 MB.** No amount of markup tuning
fixes that; the files themselves have to change. This machine has no image
tooling (no sharp, no ImageMagick, no ffmpeg), so this is a handover.

### Measured page weights

| Page | Weight | Requests |
|---|---|---|
| /gallery | 13.7 MB | 97 |
| /contact-us | 6.6 MB | 65 |
| /media | 5.3 MB | 52 |
| / | 3.4 MB | 55 |
| /about | 3.0 MB | 39 |
| /careers | 2.2 MB | 30 |

A mobile visitor on a typical Indian 4G connection is waiting several seconds
for the home page and far longer for the gallery.

### Root cause: SVGs that are not really SVGs

Twelve files in `assets/` are 240 to 270 KB each. Every one is an SVG wrapper
around a **single base64-encoded raster image**:

```
270 KB  Pre2-D1lzUDb9.svg          256 KB  card5-DgPC6hsC.svg
265 KB  whyEmbrace2-0IEKABAK.svg   255 KB  card1-D7K00Rlt.svg
260 KB  Therapy3-CVhirgQ3.svg      255 KB  Hospital-DyKfuRmN.svg
258 KB  Program3-CwpuI0zi.svg      249 KB  Pre3-DIWc9Wig.svg
257 KB  Child-B5wmfdHC.svg         248 KB  Emotional-C76VLMBu.svg
256 KB  card7-Cq5PwFTF.svg         238 KB  Clinic3-Rilx_xXh.svg
```

Base64 inflates binary data by roughly a third, and because the payload is
already-compressed image data, gzip cannot win it back. So each of these costs
about 25% more than the same picture served as a plain file, before any other
consideration.

### They are also far larger than they are ever displayed

| File | Natural width | Displayed at |
|---|---|---|
| wellBeingChild-UCyF3uBq.svg | 2301px | 343px |
| PHOTO-2023-03-11-20-14-38.jpg | 1560px | 164px |
| PHOTO-2025-04-03-12-06-08.jpg | 1600px | 164px |
| Press-DdP2XViH.svg | 837px | 232px |

24 images on the home page alone are more than 2.5x their display size. The
gallery has 50.

### What to do

1. **Un-wrap the twelve base64 SVGs.** Extract the embedded raster and save it
   as a real file. Immediate saving of roughly 25% each, about 750 KB across the
   set, with no visual change.
2. **Re-export at display size.** Nothing needs to be wider than about 800px for
   these layouts, and most need far less. This is where the bulk of the saving
   sits.
3. **Convert to WebP** with a JPEG or PNG fallback, or just WebP given browser
   support in 2026. Typically 25 to 35% smaller again at equal quality.
4. **Then add `srcset`** so phones fetch a phone-sized file.

Realistic outcome: the home page from 3.4 MB to somewhere near 800 KB, and the
gallery from 13.7 MB to under 2 MB. That is a Lighthouse performance score
moving by tens of points, not single digits.

`embrace-media/` is **164 MB across 129 files** and `videos/` is **42 MB across
2 files**. Whatever of that is actually served needs the same treatment, and the
videos want `preload="none"` plus a poster image.

---

## 3. nginx configuration, for the live server

`embracelives.com` is served by nginx, which ignores `.htaccess` completely.
These have to be applied in the server config by whoever administers it.

```nginx
# Compression. text/html is compressed by default; the rest is not.
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_proxied any;
gzip_types text/plain text/css text/xml application/javascript
           application/json image/svg+xml application/xml+rss;

# Brotli, if the module is available. Better than gzip on text.
# brotli on;
# brotli_types text/plain text/css application/javascript application/json image/svg+xml;

# Caching. Asset filenames are content-hashed, so a long life is safe.
location ~* \.(?:css|js|svg|png|jpe?g|webp|gif|ico|woff2?)$ {
    expires 30d;
    add_header Cache-Control "public";
    access_log off;
}

location ~* \.(?:mp4|webm)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# HTML must stay fresh so content edits appear immediately.
location ~* \.html?$ {
    expires -1;
    add_header Cache-Control "no-cache";
}
```

### Redirect the .php form to the clean URL

Internal links are now all extensionless, and canonical tags always were. But
both forms still return 200: `/about` and `/about.php` are the same page at two
URLs, which is duplicate content that canonical only papers over.

A permanent redirect closes it properly, and consolidates any link equity that
older `.php` URLs have picked up:

```nginx
# /about.php -> /about, once, permanently.
location ~ ^(/.+)\.php$ {
    return 301 $1$is_args$args;
}

# Serve the clean URL from the PHP file behind it.
location / {
    try_files $uri $uri.php $uri/ =404;
}
```

Order matters: the redirect block must come before the `try_files` block, or
nginx will serve the `.php` URL rather than redirecting it. Test on staging
first, since a mistake here takes the whole site down rather than one page.

---

## 4. Known issue: the Tailwind CDN on gallery.php

`gallery.php` loads `https://cdn.tailwindcss.com`, which is the browser-side
Tailwind compiler. It is explicitly not for production: it ships a large
JavaScript bundle and generates CSS at runtime, blocking render on the heaviest
page on the site.

It cannot simply be removed, because the compiled stylesheet
(`assets/index-B-kGA3UA.css`) was purged without `gallery.php` in its content
glob, so the classes that page uses are not in the bundle. Deleting the CDN
script would leave the gallery unstyled.

The correct fix is to rebuild the Tailwind CSS with `gallery.php` and
`components/*.php` included in the content configuration, then drop the CDN
script. That also clears the two existing workaround style blocks in
`components/footer.php`, which exist for exactly the same reason. It needs the
original Tailwind build setup, which is not in this repository.

---

## 5. Re-running the checks

```bash
node optimise-images.js --dry     # reports what image attributes are missing
node build.js                     # rebuild dist/
```

For a live score once the daily quota resets, or with an API key:

```bash
curl "https://www.googleapis.com/pagespeedonline/v5/runPagespeed\
?url=https%3A%2F%2Fembracelives.com%2F&strategy=mobile&category=performance"
```
