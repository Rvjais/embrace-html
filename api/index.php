<?php
// Get the requested URI
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Clean the URI
$uri = rtrim($uri, '/');
if ($uri === '' || $uri === '/') {
    $uri = '/index.php';
}

$file = __DIR__ . '/..' . $uri;

// Check if a direct PHP file exists
if (file_exists($file) && pathinfo($file, PATHINFO_EXTENSION) === 'php') {
    require $file;
    exit;
}

// Check if a PHP file exists when appending .php (clean URLs)
if (file_exists($file . '.php')) {
    require $file . '.php';
    exit;
}

// If no PHP file matched, return 404
http_response_code(404);
echo "404 Not Found";
