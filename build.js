const fs = require('fs');
const path = require('path');

console.log("Starting static build via Node.js...");

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
copyDir(path.join(__dirname, 'assets'), path.join(outDir, 'assets'));
copyDir(path.join(__dirname, '_external'), path.join(outDir, '_external'));
if (fs.existsSync(path.join(__dirname, 'media'))) {
    copyDir(path.join(__dirname, 'media'), path.join(outDir, 'media'));
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

// Load components
const headerHtml = fs.existsSync(path.join(__dirname, 'components', 'header.php')) 
    ? fs.readFileSync(path.join(__dirname, 'components', 'header.php'), 'utf8') : '';
const footerHtml = fs.existsSync(path.join(__dirname, 'components', 'footer.php')) 
    ? fs.readFileSync(path.join(__dirname, 'components', 'footer.php'), 'utf8') : '';
const mobileHeaderHtml = fs.existsSync(path.join(__dirname, 'components', 'mobile-header.php')) 
    ? fs.readFileSync(path.join(__dirname, 'components', 'mobile-header.php'), 'utf8') : '';

for (const file of phpFiles) {
    if (file === __filename || file.endsWith('build.php')) continue;
    
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace standard includes
    content = content.replace(/<\?php\s+include\s+__DIR__\s*\.\s*'\/components\/header\.php';\s*\?>/g, headerHtml);
    content = content.replace(/<\?php\s+include\s+__DIR__\s*\.\s*'\/components\/footer\.php';\s*\?>/g, footerHtml);
    content = content.replace(/<\?php\s+include\s+__DIR__\s*\.\s*'\/components\/mobile-header\.php';\s*\?>/g, mobileHeaderHtml);
    
    // Replace subfolder includes (../components)
    content = content.replace(/<\?php\s+include\s+__DIR__\s*\.\s*'\/..\/components\/header\.php';\s*\?>/g, headerHtml);
    content = content.replace(/<\?php\s+include\s+__DIR__\s*\.\s*'\/..\/components\/footer\.php';\s*\?>/g, footerHtml);
    content = content.replace(/<\?php\s+include\s+__DIR__\s*\.\s*'\/..\/components\/mobile-header\.php';\s*\?>/g, mobileHeaderHtml);
    
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
