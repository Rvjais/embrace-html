<?php
echo "Starting static build...\n";

$outDir = __DIR__ . '/dist';
if (!is_dir($outDir)) {
    mkdir($outDir, 0777, true);
}

// Function to copy a directory recursively
function copyDir($src, $dst) {
    if (!is_dir($src)) return;
    if (!is_dir($dst)) mkdir($dst, 0777, true);
    $dir = opendir($src);
    while (false !== ($file = readdir($dir))) {
        if ($file != '.' && $file != '..') {
            if (is_dir($src . '/' . $file)) {
                copyDir($src . '/' . $file, $dst . '/' . $file);
            } else {
                copy($src . '/' . $file, $dst . '/' . $file);
            }
        }
    }
    closedir($dir);
}

// Copy static assets
echo "Copying static assets...\n";
copyDir(__DIR__ . '/assets', $outDir . '/assets');
copyDir(__DIR__ . '/_external', $outDir . '/_external');
copyDir(__DIR__ . '/media', $outDir . '/media'); // if exists

// Copy specific files if they exist
$staticFiles = ['Favicon.png', 'og-image.png', 'Logo.svg', 'robots.txt', 'sitemap.xml'];
foreach ($staticFiles as $sf) {
    if (file_exists(__DIR__ . '/' . $sf)) {
        copy(__DIR__ . '/' . $sf, $outDir . '/' . $sf);
    }
}

// Compile PHP files to HTML
echo "Compiling PHP pages to HTML...\n";
$phpFiles = glob(__DIR__ . '/*.php');
foreach ($phpFiles as $file) {
    $basename = basename($file);
    if ($basename === 'build.php') continue;
    
    // Execute the PHP file and capture the HTML output
    ob_start();
    include $file;
    $html = ob_get_clean();
    
    // Fix all links pointing to .php files to point to clean URLs (without .php)
    $html = preg_replace('/href="([^"]+)\.php"/', 'href="$1"', $html);
    $html = preg_replace('/href="([^"]+)\.php\?([^"]+)"/', 'href="$1?$2"', $html);
    
    // For index, change href="/index" to href="/"
    $html = str_replace('href="/index"', 'href="/"', $html);
    
    // Save as .html
    $htmlFile = str_replace('.php', '.html', $basename);
    file_put_contents($outDir . '/' . $htmlFile, $html);
    echo "Compiled: $basename -> $htmlFile\n";
}

echo "Build successfully completed!\n";
