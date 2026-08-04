#!/usr/bin/env python3
"""Fix UI across all generated pages - improved hero, article, FAQ, CTA, etc."""

import os, re, sys

DIR = "/home/veer/Desktop/Office/embrace/embrace-html/embrace_clone"

NEW_STYLES = """
      .breadcrumbs { background: linear-gradient(to right, #f8fafc, #f1f5f9); }
      .breadcrumbs a { color: #234394; transition: color 0.2s; }
      .breadcrumbs a:hover { color: #1a1a2e; text-decoration: underline; }
      .article-content h2 { color: #1e293b; font-weight: 800; font-size: 1.65rem; margin-top: 2.5rem; margin-bottom: 0.75rem; letter-spacing: -0.02em; }
      .article-content h3 { color: #334155; font-weight: 700; font-size: 1.25rem; margin-top: 2rem; margin-bottom: 0.5rem; }
      .article-content p { color: #475569; line-height: 1.8; margin-bottom: 1.25rem; font-size: 1rem; }
      .article-content ul { list-style: none; padding-left: 0; margin-bottom: 1.5rem; }
      .article-content ul li { position: relative; padding-left: 1.75rem; margin-bottom: 0.75rem; color: #475569; line-height: 1.7; }
      .article-content ul li::before { content: "\\25B8"; position: absolute; left: 0; color: #234394; font-weight: 700; font-size: 1rem; }
      .key-points-card { background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border: 1px solid #e2e8f0; border-radius: 1.5rem; padding: 2rem; }
      .key-points-card ul { margin-bottom: 0 !important; }
      .key-points-card ul li { padding-left: 2.25rem !important; margin-bottom: 1rem !important; }
      .key-points-card ul li::before { display: none; }
      .key-points-card ul li img { position: absolute; left: 0; top: 0.35rem; }
      .pathway-card { background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%); border: 1px solid #c7d2fe; border-radius: 1.5rem; padding: 2rem; position: relative; overflow: hidden; }
      .pathway-card::before { content: ""; position: absolute; top: -50%; right: -50%; width: 12rem; height: 12rem; border-radius: 9999px; background: rgba(99,102,241,0.06); }
      .faq-item { border-bottom: 1px solid #e2e8f0; transition: background 0.2s; }
      .faq-item:hover { background: #f8fafc; }
      .faq-item button { padding: 1.25rem 1rem; border-radius: 0.75rem; }
      .faq-item button .faq-icon { transition: transform 0.3s ease; width: 1.5rem; height: 1.5rem; flex-shrink: 0; }
      .faq-item button .faq-icon.open { transform: rotate(45deg); }
      .cta-card { background: linear-gradient(135deg, #fef9e7 0%, #fef3c7 50%, #fff8e1 100%); border: 1px solid #fde68a; border-radius: 2rem; padding: 2.5rem 2rem; text-align: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
      .hero-tag { background: linear-gradient(135deg, #234394, #1e3a8a) !important; color: white !important; box-shadow: 0 2px 4px rgba(35,67,148,0.2); }
      .hero-section { position: relative; }
      .hero-section .deco-circle-1 { position: absolute; width: 8rem; height: 8rem; background: rgba(196,153,246,0.12); border-radius: 9999px; top: -2rem; left: -2rem; pointer-events: none; }
      .hero-section .deco-circle-2 { position: absolute; width: 14rem; height: 14rem; background: rgba(46,196,182,0.06); border-radius: 9999px; bottom: -4rem; right: -3rem; pointer-events: none; }
      .hero-section .deco-dots { position: absolute; top: 2rem; right: 4rem; width: 4rem; height: 4rem; background-image: radial-gradient(circle, #c5b9e4 1px, transparent 1px); background-size: 8px 8px; opacity: 0.4; pointer-events: none; }
      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
      ::-webkit-scrollbar-thumb { background: #c5b9e4; border-radius: 10px; }
      ::-webkit-scrollbar-thumb:hover { background: #a899d3; }
"""

OLD_STYLE_BLOCK_START = "<style>\n      .breadcrumbs a:hover"
OLD_STYLE_BLOCK_END = ".scrollbar-thumb:hover { background: #a899d3; }\n    </style>"

files_updated = 0
files_skipped = 0
files_error = 0

for fn in sorted(os.listdir(DIR)):
    if not fn.endswith(".html"):
        continue
    filepath = os.path.join(DIR, fn)
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        files_error += 1
        continue
    
    original = content
    
    # Skip if doesn't have our generated structure
    if 'class="article-content"' not in content:
        files_skipped += 1
        continue
    
    # 1. Replace old style block
    si = content.find(OLD_STYLE_BLOCK_START)
    ei = content.find(OLD_STYLE_BLOCK_END, si)
    if si >= 0 and ei >= 0:
        ei += len(OLD_STYLE_BLOCK_END)
        content = content[:si] + "<style>" + NEW_STYLES + "\n    </style>" + content[ei:]
    
    # 2. Hero: replace old tag badge classes
    content = content.replace(
        'class="inline-block px-4 py-1 text-xs font-bold rounded-full bg-[#E7F7FF] text-[#234394] mb-4 tracking-wider uppercase">',
        'class="inline-block px-5 py-1.5 text-xs font-bold rounded-full hero-tag mb-5 tracking-wider uppercase shadow-sm">'
    )
    
    # 3. Hero: add hero-section class, replace decoration circles, add deco elements
    if 'deco-circle-1' not in content:
        content = content.replace(
            '<div class="px-6 md:px-16 py-12 md:py-20 bg-gradient-to-b from-[#E7F7FF] to-white relative overflow-hidden flex items-center justify-center border-b border-[#E0E6F0]">',
            '<div class="px-6 md:px-16 py-12 md:py-20 bg-gradient-to-b from-[#E7F7FF] to-white relative overflow-hidden flex items-center justify-center border-b border-[#E0E6F0] hero-section">'
        )
        # Remove old deco circles
        content = content.replace(
            '<div class="absolute w-24 h-24 bg-purple-200/50 rounded-full -left-10 top-10 hidden md:block"></div>',
            ''
        )
        content = content.replace(
            '<div class="absolute w-32 h-32 bg-blue-100/60 rounded-full -right-12 bottom-5 hidden md:block"></div>',
            ''
        )
        # Add new deco elements after the hero-section opening
        deco = '<div class="deco-circle-1"></div><div class="deco-circle-2"></div><div class="deco-dots"></div>'
        content = content.replace('hero-section">', 'hero-section">\n' + deco)
    
    # 4. Breadcrumb: improve styling
    content = content.replace(
        'class="bg-gray-50 py-3 px-6 md:px-16 border-b border-gray-200 text-xs md:text-sm text-gray-500 breadcrumbs"',
        'class="py-3 px-6 md:px-16 border-b border-gray-100 text-xs md:text-sm text-gray-500 breadcrumbs"'
    )
    
    # 5. Article: improve h2 class
    content = content.replace(
        'class="text-2xl md:text-3xl font-bold mb-6 text-[#234394]"',
        'class="text-2xl md:text-3xl font-bold mb-4 text-[#1e293b]"'
    )
    
    # 6. Remove duplicate intro h3 (right after hr that follows the intro h2)
    # Pattern: hr then h3 with same text as the h2 above it
    content = re.sub(
        r'<hr class="my-8 border-gray-100" />\n\s*<h3 class="text-xl font-bold mb-4">[^<]+</h3>\n',
        '',
        content
    )
    
    # 7. Key points: add unique class to the list then wrap in key-points-card
    # Find the <ul class="space-y-4 mb-8"> that contains the diamond images (key points)
    # Replace with the wrapper
    content = re.sub(
        r'(<ul class="space-y-4 mb-8">\n\s*<li class="flex items-start gap-3">\n\s*<img alt="Bullet")',
        r'<div class="key-points-card">\n<ul class="space-y-4 mb-8 key-points-list">\n<li class="flex items-start gap-3 relative">\n<img alt="Bullet"',
        content
    )
    # Close the wrapper after the ul
    content = re.sub(
        r'(</ul>\n\s*</div>\s*\n\s*)(<div class="bg-\[#F8FAFC\])',
        r'</div>\n\1\2',
        content
    )
    # Fix unclosed key-points-card: look for </ul> followed by <div class="bg-[#F8FAFC] or <h3
    # Actually approach differently - find key-points-list ul and wrap it
    
    # 8. Pathway card: replace class
    content = content.replace(
        'class="bg-[#F8FAFC] border border-[#E2E8F0] rounded-3xl p-6 md:p-8 my-8 shadow-sm"',
        'class="pathway-card my-8"'
    )
    content = content.replace(
        'class="text-lg md:text-xl font-bold text-[#234394] mb-3"',
        'class="text-lg md:text-xl font-bold text-[#1e293b] mb-3 relative"'
    )
    content = content.replace(
        'class="text-sm md:text-base text-gray-600 leading-relaxed mb-0"',
        'class="text-sm md:text-base text-gray-600 leading-relaxed mb-0 relative"'
    )
    
    # 9. FAQ items: add faq-item class
    content = content.replace(
        'class="border-b border-[#E0E6F0] py-4"',
        'class="faq-item"'
    )
    # FAQ buttons: add more padding
    content = content.replace(
        'class="w-full text-left flex justify-between items-center focus:outline-none py-2 group"',
        'class="w-full text-left flex justify-between items-center focus:outline-none faq-btn"'
    )
    # FAQ toggle icon: replace img with svg
    content = content.replace(
        '<img src="data:image/svg+xml,%3csvg%20width=\'24\'%20height=\'24\'%20viewBox=\'0%200%2024%2024\'%20fill=\'none\'%20xmlns=\'http://www.w3.org/2000/svg\'%3e%3cpath%20d=\'M12%205V19M5%2012H19\'%20stroke=\'%23234394\'%20stroke-width=\'2\'%20stroke-linecap=\'round\'/%3e%3c/svg%3e" class="w-5 h-5 transition-transform duration-300 flex-shrink-0" alt="Toggle" />',
        '<svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="#234394" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>'
    )
    
    # 10. FAQ section heading
    content = content.replace(
        "<h3 class='text-xl font-bold mt-12 mb-6'>Frequently Asked Questions</h3>",
        "<h3 class='text-2xl font-bold mt-12 mb-6 text-[#1e293b]'>Frequently Asked Questions</h3>"
    )
    
    # 11. CTA section
    content = content.replace(
        'class="bg-gradient-to-r from-[#FFF5DC99] to-[#FFF8E445] border border-orange-100 rounded-3xl p-8 text-center my-12 shadow-sm"',
        'class="cta-card my-12"'
    )
    content = content.replace(
        'class="text-xl md:text-2xl font-bold text-gray-800 mb-2">Speak with a Specialist</h3>',
        'class="text-xl md:text-2xl font-bold text-gray-800 mb-3">Speak with a Specialist</h3>'
    )
    
    # Write if changed
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        files_updated += 1
        if files_updated <= 10 or files_updated % 100 == 0:
            print(f"  ✅ {fn}")
    else:
        files_skipped += 1

print(f"\n{'='*50}")
print(f"✅ Fixed: {files_updated} pages")
print(f"⏭️  Skipped: {files_skipped} pages")
if files_error:
    print(f"❌ Errors: {files_error}")
print(f"{'='*50}")
