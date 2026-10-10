<?php
// router.php for PHP built-in server
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// If the requested file or directory exists, serve it as-is
if (file_exists(__DIR__ . $path) && !is_dir(__DIR__ . $path)) {
    return false;
}

// Emulate: RewriteRule ^(.*)/$ /$1 [L,R=301]
if (strlen($path) > 1 && substr($path, -1) === '/' && !is_dir(__DIR__ . substr($path, 0, -1))) {
    $path = substr($path, 0, -1);
}

// Emulate: RewriteRule ^(.*)$ $1.php
$phpFile = __DIR__ . $path . '.php';
if (file_exists($phpFile)) {
    $_SERVER['SCRIPT_NAME'] = $path . '.php';
    include $phpFile;
    exit;
}

// Emulate DirectoryIndex index.php
if (is_dir(__DIR__ . $path) && file_exists(__DIR__ . $path . '/index.php')) {
    $_SERVER['SCRIPT_NAME'] = rtrim($path, '/') . '/index.php';
    include __DIR__ . $path . '/index.php';
    exit;
}

// 404 Not Found
return false;
