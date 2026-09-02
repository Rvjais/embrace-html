const fs = require('fs');
const path = require('path');

console.log("Starting static build via Node.js...");

// Regenerate sitemap.xml first so the copy step below ships a current one.
require('./generate-sitemap.js');

const outDir = path.join(__dirname, 'dist');
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

function copyDir(src, dst) {
    if (!fs.existsSync(src)) return;
    if (!fs.existsSync(dst)) fs.mkdirSync(dst, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') continue;
        
        const srcPath = path.join(src, entry.name);
        const dstPath = path.join(dst, entry.name);
        if (entry.isDirectory()) {
            copyDir(srcPath, dstPath);
        } else {
            fs.copyFileSync(srcPath, dstPath);
        }
    }
}

console.log("Copying static assets...");
const staticFolders = ['assets', '_external', 'media', 'embrace-media', 'practitioner-images', 'videos'];

for (const folder of staticFolders) {
    if (fs.existsSync(path.join(__dirname, folder))) {
        copyDir(path.join(__dirname, folder), path.join(outDir, folder));
    }
}

['Favicon.png', 'og-image.png', 'Logo.svg', 'robots.txt', 'sitemap.xml'].forEach(file => {
    if (fs.existsSync(path.join(__dirname, file))) {
        fs.copyFileSync(path.join(__dirname, file), path.join(outDir, file));
    }
});

function getPhpFiles(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === 'dist' || file === '.git' || file === 'api' || file === 'components') continue;
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getPhpFiles(filePath, fileList);
        } else if (file.endsWith('.php')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const phpFiles = getPhpFiles(__dirname);
console.log(`Found ${phpFiles.length} PHP files to compile...`);

// Load components once, keyed by name, so any component can be included from
// any depth: <?php include __DIR__ . '/../components/<name>.php'; ?>
const componentCache = new Map();
function component(name) {
    if (!componentCache.has(name)) {
        const file = path.join(__dirname, 'components', `${name}.php`);
        componentCache.set(name, fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '');
    }
    return componentCache.get(name);
}

// Matches the include no matter how many '/..' segments precede /components.
const INCLUDE_RE = /<\?php\s+include\s+__DIR__\s*\.\s*'(?:\/\.\.)*\/components\/([A-Za-z0-9_-]+)\.php';\s*\?>/g;

for (const file of phpFiles) {
    // blog.php is a PHP-only 301 stub for the old hub URL. It has no markup,
    // and the string-substitution build below cannot execute its redirect.
    if (file === __filename || file.endsWith('build.php')) continue;
    if (path.relative(__dirname, file) === 'blog.php') continue;
    
    let content = fs.readFileSync(file, 'utf8');
    
    // Inline every component include, at any directory depth
    content = content.replace(INCLUDE_RE, (match, name) => component(name));

    // The footer's copyright year is the one bit of real PHP in the templates;
    // without this it shipped to dist as a literal "<?php echo date('Y'); ?>".
    content = content.replace(/<\?php\s+echo\s+date\('Y'\);\s*\?>/g, String(new Date().getFullYear()));

    // Clean URLs
    content = content.replace(/href="([^"]+)\.php"/g, 'href="$1"');
    content = content.replace(/href="([^"]+)\.php\?([^"]+)"/g, 'href="$1?$2"');
    content = content.replace(/href="\/index"/g, 'href="/"');
    
    // Fix asset paths if they use leading slash incorrectly (Vercel resolves them anyway, but just in case)
    
    const relativePath = path.relative(__dirname, file);
    const outFilePath = path.join(outDir, relativePath).replace(/\.php$/, '.html');
    
    const outDirName = path.dirname(outFilePath);
    if (!fs.existsSync(outDirName)) {
        fs.mkdirSync(outDirName, { recursive: true });
    }
    
    fs.writeFileSync(outFilePath, content);
}

console.log("Build successfully completed!");
