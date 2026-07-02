with open('assets/index-B-kGA3UA.css', 'r') as f:
    css = f.read()

# Replace .glass-footer a
css = css.replace('color: rgba(255, 255, 255, 0.75);', 'color: #234394;')
# Replace .glass-footer a:hover
css = css.replace('color: #fff;', 'color: #1a3375;')
# Replace .glass-footer h3
css = css.replace('color: rgba(255, 255, 255, 0.95);', 'color: #234394;')

with open('assets/index-B-kGA3UA.css', 'w') as f:
    f.write(css)

print("Text colors fixed.")
