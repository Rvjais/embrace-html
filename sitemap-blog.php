<?php

require_once __DIR__ . '/components/publish-gate.php';

$catalog = require __DIR__ . '/components/scheduled-blog-catalog.php';
$scheduledBySlug = [];
foreach ($catalog as $post) {
    $scheduledBySlug[$post['slug']] = $post['date'];
}

header('Content-Type: application/xml; charset=UTF-8');

$base = 'https://embracelives.com';
$entries = [];

foreach (glob(__DIR__ . '/blog/*.php') ?: [] as $file) {
    if (basename($file) === 'index.php') {
        continue;
    }

    $html = file_get_contents($file);
    $slug = basename($file, '.php');
    if (isset($scheduledBySlug[$slug])) {
        $date = $scheduledBySlug[$slug];
    } elseif (preg_match('/property="article:published_time"[^>]*content="(\d{4}-\d{2}-\d{2})"|content="(\d{4}-\d{2}-\d{2})"[^>]*property="article:published_time"/', $html, $dateMatch)) {
        $date = $dateMatch[1] ?: $dateMatch[2];
    } else {
        continue;
    }
    if (!embrace_is_published($date)) {
        continue;
    }

    $entries[] = [
        'url' => $base . '/blog/' . $slug,
        'date' => $date,
    ];
}

usort($entries, static fn(array $a, array $b): int => strcmp($b['date'], $a['date']));

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
foreach ($entries as $entry) {
    echo "  <url>\n";
    echo '    <loc>' . htmlspecialchars($entry['url'], ENT_XML1) . "</loc>\n";
    echo '    <lastmod>' . $entry['date'] . "</lastmod>\n";
    echo "    <changefreq>monthly</changefreq>\n";
    echo "    <priority>0.7</priority>\n";
    echo "  </url>\n";
}
echo "</urlset>\n";
