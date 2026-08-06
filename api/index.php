<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

try {
    // Get the requested URI
    $uri = $_SERVER['REQUEST_URI'] ?? '/';
    $path = parse_url($uri, PHP_URL_PATH);

    // Clean the URI
    $path = rtrim($path, '/');
    if ($path === '' || $path === '/') {
        $path = '/index.php';
    }

    $file = __DIR__ . '/..' . $path;

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

    // If no PHP file matched, output debug information
    http_response_code(404);
    echo "<h1>404 Not Found</h1>";
    echo "<p>File searched: " . htmlspecialchars($file) . "</p>";
    echo "<p>Current __DIR__: " . htmlspecialchars(__DIR__) . "</p>";
    
    $parentDir = realpath(__DIR__ . '/..');
    echo "<p>Parent Dir: " . htmlspecialchars($parentDir) . "</p>";
    
    if ($parentDir) {
        echo "<h3>Contents of Parent Dir:</h3><pre>";
        print_r(scandir($parentDir));
        echo "</pre>";
    }

} catch (Throwable $e) {
    http_response_code(500);
    echo "<h1>PHP Exception Caught</h1>";
    echo "<p>" . htmlspecialchars($e->getMessage()) . "</p>";
    echo "<p>In " . htmlspecialchars($e->getFile()) . " on line " . $e->getLine() . "</p>";
}
