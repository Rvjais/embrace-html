with open('components/footer.html', 'r') as f:
    content = f.read()

# Fix logo color
content = content.replace('w-35 h-35 object-contain drop-shadow-lg brightness-0 invert', 'w-35 h-35 object-contain drop-shadow-lg')
content = content.replace('brightness-0 invert', '') # just in case

# Fix alignment
content = content.replace(
    '<div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10">\n          <div>',
    '<div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10">\n          <div class="md:col-span-3 lg:col-span-2">'
)

with open('components/footer.html', 'w') as f:
    f.write(content)

print("Fixed footer.html")
