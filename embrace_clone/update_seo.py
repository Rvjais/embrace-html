#!/usr/bin/env python3
"""
Update SEO metadata across all embrace_clone HTML pages.
- Unique title, meta description, canonical URL per page
- Unique Open Graph and Twitter Card tags per page
- Remove keywords meta tag (Google ignores it)
- Remove FAQ JSON-LD from non-FAQ pages
- Keep MedicalBusiness JSON-LD on all pages
"""

import re
import os
import sys

BASE_URL = "https://embracelives.com"

# Page-specific SEO data
SEO_DATA = {
    "index.html": {
        "title": "eMbrace Lives | Best Psychologist in Delhi – Clinical &amp; Child Psychology",
        "description": "eMbrace – Delhi's trusted psychology practice. Evidence-based therapy for anxiety, depression, ADHD, autism &amp; more. Consult top clinical &amp; child psychologists.",
        "canonical": "/",
        "keep_faq_jsonld": True,
    },
    "about.html": {
        "title": "About eMbrace | Our Story, Mission &amp; Leadership Team",
        "description": "Learn about eMbrace, Delhi's trusted psychology practice founded by Dr. Supriya Malik. Meet our leadership team of RCI-certified clinical psychologists.",
        "canonical": "/about",
        "keep_faq_jsonld": False,
    },
    "adolescents.html": {
        "title": "Adolescent Therapy &amp; Counselling in Delhi | eMbrace Lives",
        "description": "Evidence-based therapy for teens — anxiety, depression, ADHD, peer pressure, academic stress &amp; emotional regulation. Expert adolescent psychologists in Delhi.",
        "canonical": "/adolescents",
        "keep_faq_jsonld": False,
    },
    "adult.html": {
        "title": "Adult Therapy &amp; Mental Health Services in Delhi | eMbrace Lives",
        "description": "Professional therapy for adults — clinical psychology, counselling, couples therapy, ADHD &amp; autism assessments. Book with top psychologists in Delhi.",
        "canonical": "/adult",
        "keep_faq_jsonld": False,
    },
    "appointment.html": {
        "title": "Book an Appointment | eMbrace Lives",
        "description": "Schedule your therapy session with eMbrace. Book online or in-person appointments with our clinical psychologists, child therapists &amp; counsellors in Delhi.",
        "canonical": "/appointment",
        "keep_faq_jsonld": False,
    },
    "appointment__confirmation.html": {
        "title": "Appointment Confirmed | eMbrace Lives",
        "description": "Your therapy appointment with eMbrace has been confirmed. View your booking details and next steps for your upcoming session.",
        "canonical": "/appointment/confirmation",
        "keep_faq_jsonld": False,
    },
    "bookingandCancellation.html": {
        "title": "Booking &amp; Cancellation Policy | eMbrace Lives",
        "description": "Understand eMbrace booking, cancellation &amp; refund policies for therapy sessions. Learn about rescheduling, payment terms &amp; session guidelines.",
        "canonical": "/bookingandCancellation",
        "keep_faq_jsonld": False,
    },
    "careers.html": {
        "title": "Careers at eMbrace | Join Our Mental Health Team in Delhi",
        "description": "Join eMbrace as a clinical psychologist, child psychologist, speech therapist or occupational therapist. Explore open positions, internships &amp; fellowships.",
        "canonical": "/careers",
        "keep_faq_jsonld": False,
    },
    "children.html": {
        "title": "Child Therapy &amp; Developmental Assessments in Delhi | eMbrace Lives",
        "description": "Expert child psychology services — ADHD, autism, speech therapy, occupational therapy &amp; developmental assessments. Top child psychologists in Delhi.",
        "canonical": "/children",
        "keep_faq_jsonld": False,
    },
    "children_and_adolescents.html": {
        "title": "Services for Children &amp; Adolescents | eMbrace Lives",
        "description": "Multi-specialty support for children &amp; adolescents — therapy, assessments, speech therapy, occupational therapy &amp; neurodevelopmental care in Delhi.",
        "canonical": "/children_and_adolescents",
        "keep_faq_jsonld": False,
    },
    "contact-us.html": {
        "title": "Contact Us | eMbrace Lives – Get in Touch",
        "description": "Contact eMbrace — call, WhatsApp or email us for therapy inquiries. Reach our team at +91 9971576800 or info@embracelives.com. We respond within 24 hours.",
        "canonical": "/contact-us",
        "keep_faq_jsonld": False,
    },
    "corporate.html": {
        "title": "Corporate Wellness &amp; Mental Health Programs | eMbrace Lives",
        "description": "Employee wellness, neurodiversity training &amp; mental health workshops for corporates. Partner with eMbrace for workplace well-being programs in Delhi.",
        "canonical": "/corporate",
        "keep_faq_jsonld": False,
    },
    "couples.html": {
        "title": "Couples Therapy &amp; Relationship Counselling in Delhi | eMbrace Lives",
        "description": "Evidence-based couples therapy — communication issues, conflict resolution, pre-marital counselling &amp; relationship support. Expert therapists in Delhi.",
        "canonical": "/couples",
        "keep_faq_jsonld": False,
    },
    "faq.html": {
        "title": "Frequently Asked Questions | eMbrace Lives",
        "description": "Find answers to common questions about eMbrace therapy services, appointments, pricing, insurance &amp; more. Everything you need to know before your first session.",
        "canonical": "/faq",
        "keep_faq_jsonld": True,
    },
    "giftatherapy.html": {
        "title": "Gift a Therapy Session | eMbrace Lives",
        "description": "Give the gift of mental well-being. Purchase therapy gift vouchers from eMbrace — a thoughtful, meaningful gift for loved ones in Delhi &amp; across India.",
        "canonical": "/giftatherapy",
        "keep_faq_jsonld": False,
    },
    "hospitalAndHealthcare.html": {
        "title": "Hospital &amp; Healthcare Partnerships | eMbrace Lives",
        "description": "Mental health &amp; neurodevelopmental care partnerships for hospitals. eMbrace provides clinical psychology, speech therapy &amp; OT services for healthcare institutions.",
        "canonical": "/hospitalAndHealthcare",
        "keep_faq_jsonld": False,
    },
    "individuals.html": {
        "title": "Individual Therapy &amp; Counselling in Delhi | eMbrace Lives",
        "description": "Personalised therapy for individuals — anxiety, depression, OCD, trauma, ADHD &amp; more. Book confidential sessions with expert psychologists in Delhi.",
        "canonical": "/individuals",
        "keep_faq_jsonld": False,
    },
    "media.html": {
        "title": "Media &amp; News | eMbrace Lives in the Press",
        "description": "eMbrace in the news — media features, press coverage &amp; mental health awareness campaigns. See how we're shaping the conversation on neurodiversity.",
        "canonical": "/media",
        "keep_faq_jsonld": False,
    },
    "parent.html": {
        "title": "Support for Parents | Parenting Guidance &amp; Family Therapy | eMbrace Lives",
        "description": "Parenting guidance, caregiver support &amp; family therapy from expert psychologists. Navigate challenges of raising neurodivergent &amp; neurotypical children.",
        "canonical": "/parent",
        "keep_faq_jsonld": False,
    },
    "partners.html": {
        "title": "Partner With eMbrace | Business &amp; Institutional Partnerships",
        "description": "Submit your partnership inquiry — schools, universities, corporates &amp; healthcare institutions. Collaborate with eMbrace for mental health services.",
        "canonical": "/partners",
        "keep_faq_jsonld": False,
    },
    "practitioner.html": {
        "title": "Our Therapists &amp; Psychologists | eMbrace Lives",
        "description": "Meet our team of RCI-certified clinical psychologists, child psychologists, speech therapists &amp; occupational therapists. Find the right therapist for you.",
        "canonical": "/practitioner",
        "keep_faq_jsonld": False,
    },
    "privacypolicy.html": {
        "title": "Privacy Policy | eMbrace Lives – SMD Wellness",
        "description": "Read the eMbrace privacy policy. Learn how SMD Wellness collects, uses &amp; protects your personal data when using our therapy services &amp; platform.",
        "canonical": "/privacypolicy",
        "keep_faq_jsonld": False,
    },
    "schools.html": {
        "title": "School Mental Health Programs &amp; Assessments | eMbrace Lives",
        "description": "Comprehensive mental health support for schools — student assessments, teacher training, neurodiversity workshops &amp; school-based therapy programs in Delhi.",
        "canonical": "/schools",
        "keep_faq_jsonld": False,
    },
    "teacher.html": {
        "title": "Teacher Support &amp; Neurodiversity Training | eMbrace Lives",
        "description": "Neurodiversity workshops, inclusive classroom strategies &amp; mental health training for teachers. Empower educators to support all learners effectively.",
        "canonical": "/teacher",
        "keep_faq_jsonld": False,
    },
    "terms_and_conditions.html": {
        "title": "Terms &amp; Conditions | eMbrace Lives – SMD Wellness",
        "description": "Read the eMbrace terms &amp; conditions governing use of our mental health services, platform, bookings &amp; therapy sessions.",
        "canonical": "/terms_and_conditions",
        "keep_faq_jsonld": False,
    },
    "university.html": {
        "title": "University Counselling &amp; Campus Mental Health | eMbrace Lives",
        "description": "Mental health services for universities — student counselling, faculty training, internship programs &amp; campus well-being initiatives with eMbrace.",
        "canonical": "/university",
        "keep_faq_jsonld": False,
    },
    "userListing.html": {
        "title": "Find a Therapist – Our Expert Team | eMbrace Lives",
        "description": "Browse our team of expert therapists. Filter by specialty, condition treated, age group &amp; location. Find the right psychologist or therapist for your needs.",
        "canonical": "/userListing",
        "keep_faq_jsonld": False,
    },
}


def update_title(content, new_title):
    """Replace <title> tag content."""
    return re.sub(
        r'<title>.*?</title>',
        f'<title>{new_title}</title>',
        content,
        flags=re.DOTALL
    )


def update_meta_description(content, new_desc):
    """Replace meta description content."""
    # Match the meta description tag (may span multiple lines)
    pattern = r'(<meta\s[^>]*?content=")[^"]*("[^>]*?name="description"[^>]*/\s*>)'
    replacement = rf'\g<1>{new_desc}\2'
    result = re.sub(pattern, replacement, content, flags=re.DOTALL)
    if result == content:
        # Try reverse attribute order (content before name)
        pattern2 = r'(<meta\s[^>]*?name="description"[^>]*?content=")[^"]*("[^>]*/\s*>)'
        result = re.sub(pattern2, rf'\g<1>{new_desc}\2', content, flags=re.DOTALL)
    return result


def update_canonical(content, new_path):
    """Replace canonical URL."""
    new_url = BASE_URL + new_path if new_path != "/" else BASE_URL + "/"
    return re.sub(
        r'(<link\s[^>]*href=")[^"]*("[^>]*rel="canonical"[^>]*/\s*>)',
        rf'\g<1>{new_url}\2',
        content,
        flags=re.DOTALL
    )


def update_og_tags(content, title, desc, path):
    """Update Open Graph tags."""
    url = BASE_URL + path if path != "/" else BASE_URL + "/"
    
    # og:title
    content = re.sub(
        r'(<meta\s[^>]*content=")[^"]*("[^>]*property="og:title"[^>]*/\s*>)',
        rf'\g<1>{title}\2',
        content, flags=re.DOTALL
    )
    
    # og:description
    content = re.sub(
        r'(<meta\s[^>]*content=")[^"]*("[^>]*property="og:description"[^>]*/\s*>)',
        rf'\g<1>{desc}\2',
        content, flags=re.DOTALL
    )
    
    # og:url
    content = re.sub(
        r'(<meta\s[^>]*content=")[^"]*("[^>]*property="og:url"[^>]*/\s*>)',
        rf'\g<1>{url}\2',
        content, flags=re.DOTALL
    )
    
    return content


def update_twitter_tags(content, title, desc):
    """Update Twitter Card tags."""
    # twitter:title
    content = re.sub(
        r'(<meta\s[^>]*content=")[^"]*("[^>]*name="twitter:title"[^>]*/\s*>)',
        rf'\g<1>{title}\2',
        content, flags=re.DOTALL
    )
    
    # twitter:description
    content = re.sub(
        r'(<meta\s[^>]*content=")[^"]*("[^>]*name="twitter:description"[^>]*/\s*>)',
        rf'\g<1>{desc}\2',
        content, flags=re.DOTALL
    )
    
    return content


def remove_keywords_meta(content):
    """Remove the entire <meta name="keywords"> tag."""
    # The keywords tag spans multiple lines with the huge keyword list
    content = re.sub(
        r'\s*<meta\s[^>]*?name="keywords"[^>]*/\s*>\s*',
        '\n',
        content,
        flags=re.DOTALL
    )
    # Also try content-first variant
    content = re.sub(
        r'\s*<meta\s[^>]*?content="[^"]*"[^>]*?name="keywords"[^>]*/\s*>\s*',
        '\n',
        content,
        flags=re.DOTALL
    )
    return content


def remove_faq_jsonld(content):
    """Remove the FAQPage JSON-LD script block."""
    return re.sub(
        r'\s*<script\s+type="application/ld\+json">\s*\{[^}]*"@type":\s*"FAQPage".*?</script>\s*',
        '\n',
        content,
        flags=re.DOTALL
    )


def process_file(filepath, seo_data):
    """Process a single HTML file."""
    filename = os.path.basename(filepath)
    print(f"Processing: {filename}")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # 1. Update title
    content = update_title(content, seo_data['title'])
    
    # 2. Update meta description
    content = update_meta_description(content, seo_data['description'])
    
    # 3. Update canonical URL
    content = update_canonical(content, seo_data['canonical'])
    
    # 4. Update Open Graph tags
    content = update_og_tags(content, seo_data['title'], seo_data['description'], seo_data['canonical'])
    
    # 5. Update Twitter Card tags
    content = update_twitter_tags(content, seo_data['title'], seo_data['description'])
    
    # 6. Remove keywords meta tag
    content = remove_keywords_meta(content)
    
    # 7. Remove FAQ JSON-LD if not needed
    if not seo_data.get('keep_faq_jsonld', False):
        content = remove_faq_jsonld(content)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  ✅ Updated")
    else:
        print(f"  ⚠️  No changes detected")
    
    return content != original


def main():
    directory = os.path.dirname(os.path.abspath(__file__))
    
    success = 0
    skipped = 0
    
    for filename, seo_data in sorted(SEO_DATA.items()):
        filepath = os.path.join(directory, filename)
        if not os.path.exists(filepath):
            print(f"  ⚠️  File not found: {filename}")
            skipped += 1
            continue
        
        if process_file(filepath, seo_data):
            success += 1
        else:
            skipped += 1
    
    print(f"\n✅ Done! Updated {success} files, {skipped} unchanged/skipped.")


if __name__ == '__main__':
    main()
