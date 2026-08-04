import os
import glob
import re

html_files = glob.glob('**/*.html', recursive=True)

for filepath in html_files:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Replace .html in relative links and convert to absolute paths
        # href="./about.html" -> href="/about"
        content = re.sub(r'href="\.\/([^"#]+)\.html"', r'href="/\1"', content)
        content = re.sub(r'href="\.\.\/([^"#]+)\.html"', r'href="/\1"', content)
        
        # Replace non-.html relative links to absolute
        content = re.sub(r'href="\.\/([^"#]+)"', r'href="/\1"', content)
        content = re.sub(r'href="\.\.\/([^"#]+)"', r'href="/\1"', content)
        
        # Replace src relative paths to absolute
        content = re.sub(r'src="\.\/([^"#]+)"', r'src="/\1"', content)
        content = re.sub(r'src="\.\.\/([^"#]+)"', r'src="/\1"', content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
            
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

print("Successfully converted all paths to absolute!")
