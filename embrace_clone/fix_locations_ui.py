import os
from bs4 import BeautifulSoup

DIR = "/home/veer/Desktop/Office/embrace/embrace-html/embrace_clone"
LOCATIONS_DIR = os.path.join(DIR, "locations")

PREFIX_MAPPING = {
    'adhd': ('adhd', 'what-is-adhd.html'),
    'adult': ('adult-mental-health', 'adult-counselling.html'),
    'autism': ('autism', 'autism-therapy.html'),
    'child': ('child-psychology', 'child-counselling.html'),
    'learning': ('learning-disabilities', 'learning-disabilities.html'),
    'occupational': ('occupational-therapy', 'occupational-therapy.html'),
    'special': ('schools-hub', 'schools.html'),
    'speech': ('speech-therapy', 'speech-therapy.html'),
    'teen': ('teen-mental-health', 'teen-counselling.html')
}

def get_template_data(category_dir, template_file):
    template_path = os.path.join(DIR, category_dir, template_file)
    with open(template_path, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')

    # Extract Breadcrumb
    breadcrumb = soup.find('div', class_=lambda c: c and 'breadcrumbs' in c)
    if not breadcrumb:
        print(f"Warning: No breadcrumb found in {template_path}")
    
    # Extract sidebars
    desktop_sidebar = soup.find('div', class_=lambda c: c and 'hidden md:block' in c and 'flex-shrink-0' in c)
    mobile_sidebar = soup.find('div', class_=lambda c: c and 'md:hidden' in c and 'mb-6' in c and 'bg-[#F9FBFF]' in c)

    return breadcrumb, desktop_sidebar, mobile_sidebar

def fix_location_file(filepath, filename, category_dir, template_data):
    breadcrumb_template, desktop_sidebar_template, mobile_sidebar_template = template_data
    
    with open(filepath, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
        
    article_content = soup.find('div', class_=lambda c: c and 'article-content' in c)
    if not article_content:
        print(f"Skipping {filename} - no article-content found")
        return False
        
    # Check if already fixed
    parent = article_content.parent
    if parent and 'flex' in parent.get('class', []) and 'gap-8' in parent.get('class', []):
        print(f"Already fixed: {filename}")
        return False
        
    # Update article content classes
    article_content['class'] = ['flex-grow', 'max-w-4xl', 'article-content']
    
    # Update parent classes
    if parent:
        parent['class'] = ['max-w-7xl', 'mx-auto', 'flex', 'flex-col', 'md:flex-row', 'gap-8', 'lg:gap-12']
        
    # Prepare clones of sidebars
    import copy
    
    if desktop_sidebar_template:
        desktop_sidebar = copy.copy(desktop_sidebar_template)
        # Update hrefs to point to the correct category dir
        for a in desktop_sidebar.find_all('a'):
            href = a.get('href', '')
            if href.startswith('./'):
                a['href'] = href.replace('./', f'../{category_dir}/')
        # Insert before article content
        article_content.insert_before(desktop_sidebar)
        
    if mobile_sidebar_template:
        mobile_sidebar = copy.copy(mobile_sidebar_template)
        # Update hrefs
        for a in mobile_sidebar.find_all('a'):
            href = a.get('href', '')
            if href.startswith('./'):
                a['href'] = href.replace('./', f'../{category_dir}/')
        # Insert before article content
        article_content.insert_before(mobile_sidebar)
        
    if breadcrumb_template:
        breadcrumb = copy.copy(breadcrumb_template)
        # Update hrefs
        for a in breadcrumb.find_all('a'):
            href = a.get('href', '')
            if href.startswith('./'):
                a['href'] = href.replace('./', f'../{category_dir}/')
        
        # Update current page text
        spans = breadcrumb.find_all('span')
        # The last span is usually the current page text
        for span in reversed(spans):
            if 'text-gray-800' in span.get('class', []):
                # We can use the filename to make a readable title
                title = filename.replace('.html', '').replace('-', ' ').title()
                span.string = title
                break
                
        # Insert breadcrumb before the wrapper
        wrapper = parent.parent
        wrapper.insert_before(breadcrumb)
        
    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(str(soup))
        
    print(f"Fixed: {filename}")
    return True

def main():
    # Cache template data
    templates = {}
    for prefix, (cat_dir, temp_file) in PREFIX_MAPPING.items():
        templates[prefix] = get_template_data(cat_dir, temp_file)
        
    count = 0
    for filename in os.listdir(LOCATIONS_DIR):
        if not filename.endswith('.html'):
            continue
            
        filepath = os.path.join(LOCATIONS_DIR, filename)
        prefix = filename.split('-')[0]
        
        if prefix in PREFIX_MAPPING:
            cat_dir = PREFIX_MAPPING[prefix][0]
            if fix_location_file(filepath, filename, cat_dir, templates[prefix]):
                count += 1
        else:
            print(f"Unknown prefix for {filename}")
            
    print(f"Successfully updated {count} files.")

if __name__ == "__main__":
    main()
