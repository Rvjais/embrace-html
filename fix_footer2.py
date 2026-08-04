import re

with open('components/footer.html', 'r') as f:
    html = f.read()

# Fix alignment
html = html.replace(
    '<div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10">',
    '<div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 relative z-10">'
)
html = html.replace('<div class="md:col-span-3 lg:col-span-2">', '<div>')

with open('components/footer.html', 'w') as f:
    f.write(html)

# Fix CSS background
with open('assets/index-B-kGA3UA.css', 'r') as f:
    css = f.read()

css = css.replace(
    'background: rgba(15, 12, 41, 0.85);',
    'background: rgba(69, 98, 173, 1);'  # Use solid #4562AD or a slightly transparent version. Let's use 1 to match the solid screenshot
)
# Wait, the screenshot looks solid blue, not glassy. I'll use rgba(69, 98, 173, 1).

with open('assets/index-B-kGA3UA.css', 'w') as f:
    f.write(css)

print("Fixed footer layout and background")
