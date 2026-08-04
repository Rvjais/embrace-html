import re

with open('components/header.html', 'r') as f:
    content = f.read()

# Fix nav z-index
content = content.replace('z-[100]', 'z-100')

# Fix dropdowns
# We need to replace the absolute wrapper and add an inner div
# Regex to match the dropdown start
pattern_start = re.compile(
    r'(<div\s+class="absolute left-0 (w-\d+) glass-dropdown rounded-2xl opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto pointer-events-none transition-all duration-300 z-40 translate-y-2 group-hover:translate-y-0 py-3"\s*>)'
)

def repl_start(match):
    w_class = match.group(2)
    return f'<div class="absolute left-0 top-full pt-4 {w_class} opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto pointer-events-none transition-all duration-300 z-50">\n              <div class="glass-dropdown rounded-2xl py-3">'

content_new = pattern_start.sub(repl_start, content)

# Now we need to add the closing </div> for the inner div.
# We know the outer div closes with "</div>\n          </div>" just before the next "<div class="relative group">" or something similar.
# Wait, a safer way is to match the exact end of each dropdown block based on the last link.
# Dropdown 1 ends with >Teen Mental Health</a\n              >\n            </div>
content_new = content_new.replace(
    'Teen Mental Health</a\n              >\n            </div>',
    'Teen Mental Health</a\n              >\n              </div>\n            </div>'
)

# Dropdown 2 ends with >Adult Mental Health Hub</a\n              >\n            </div>
content_new = content_new.replace(
    '>Adult Mental Health Hub</a\n              >\n            </div>',
    '>Adult Mental Health Hub</a\n              >\n              </div>\n            </div>'
)

# Dropdown 3 ends with >Parent Hub</a\n              >\n            </div>
content_new = content_new.replace(
    '>Parent Hub</a\n              >\n            </div>',
    '>Parent Hub</a\n              >\n              </div>\n            </div>'
)

# Dropdown 4 ends with >Schools Hub</a\n              >\n            </div>
content_new = content_new.replace(
    '>Schools Hub</a\n              >\n            </div>',
    '>Schools Hub</a\n              >\n              </div>\n            </div>'
)

# Dropdown 5 ends with >Corporate Wellness Hub</a\n              >\n            </div>
content_new = content_new.replace(
    '>Corporate Wellness Hub</a\n              >\n            </div>',
    '>Corporate Wellness Hub</a\n              >\n              </div>\n            </div>'
)

with open('components/header.html', 'w') as f:
    f.write(content_new)

print("Fixed header.html")
