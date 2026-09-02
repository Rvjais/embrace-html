<?php
/*
 * The blog hub moved to blog/index.php so that it is reachable at /blog/.
 *
 * embracelives.com is served by nginx, which ignores .htaccess. nginx sees the
 * blog/ directory of articles and 301s /blog to /blog/ before any rewrite could
 * hand the request to a root-level blog.php, so the hub was unreachable there
 * and /blog/ returned 403 for want of an index file.
 *
 * This stub keeps the old /blog.php address alive as a 301 to the canonical
 * /blog/. It is deliberately excluded from build.js and from the schema,
 * canonical and sitemap generators.
 */
header('Location: https://embracelives.com/blog/', true, 301);
exit;
