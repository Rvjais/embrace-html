import re

with open('components/footer.html', 'r') as f:
    html = f.read()

# 1. Update button
html = html.replace('class="glass-btn mt-5 px-5 py-2.5 rounded-full cursor-pointer text-sm font-medium"', 
                    'class="bg-[#234394] text-white mt-5 px-5 py-2.5 rounded-full cursor-pointer text-sm font-medium hover:bg-[#1a3375] transition-colors"')

# 2. Update social icons
html = html.replace('<span class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center backdrop-blur-sm">',
                    '<span class="w-10 h-10 rounded-lg bg-[#0077b5] text-white flex items-center justify-center hover:opacity-90 transition-all">', 1)

html = html.replace('<span class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center backdrop-blur-sm">',
                    '<span class="w-10 h-10 rounded-lg bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center hover:opacity-90 transition-all">', 1)

html = html.replace('<span class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center backdrop-blur-sm">',
                    '<span class="w-10 h-10 rounded-full bg-[#1877f2] text-white flex items-center justify-center hover:opacity-90 transition-all">', 1)

# 3. Update Contact icons (remove the bg-white/10 circle)
html = html.replace('<span class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">',
                    '<span class="text-[#234394] flex items-center justify-center flex-shrink-0">')

# 4. Update underline on headings
html = html.replace('after:bg-[#234394]/40', 'after:bg-[#234394]')

with open('components/footer.html', 'w') as f:
    f.write(html)

# 5. Update CSS
with open('assets/index-B-kGA3UA.css', 'r') as f:
    css = f.read()

# Replace the previous fix with the new off-white background
css = css.replace(
    'background: rgba(69, 98, 173, 1);',
    'background: rgba(253, 248, 240, 0.95);\n  border-top-left-radius: 2.5rem;\n  border-top-right-radius: 2.5rem;\n  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.05);'
)

# And we also need to change the color in .glass-footer from white to blue
# We know it has `color: rgba(255, 255, 255, 0.9);` or similar. Let's find and replace it.
css = re.sub(r'color:\s*rgba\(255,\s*255,\s*255,\s*0\.9\);', 'color: #234394;', css)

with open('assets/index-B-kGA3UA.css', 'w') as f:
    f.write(css)

print("Footer updated successfully.")
