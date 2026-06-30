#!/usr/bin/env python3
"""Generate cluster HTML pages from JSON data files."""

import os, json, re

DIR = "/home/veer/Desktop/Office/embrace/embrace-html/embrace_clone"
BASE_URL = "https://embracelives.com"

STYLES = """
      .breadcrumbs a:hover { text-decoration: underline; }
      .article-content h2 { color: #234394; font-weight: 700; font-size: 1.5rem; margin-top: 2rem; margin-bottom: 1rem; border-left: 4px solid #234394; padding-left: 0.75rem; }
      .article-content h3 { color: #403D3D; font-weight: 600; font-size: 1.2rem; margin-top: 1.5rem; margin-bottom: 0.75rem; }
      .article-content p { color: #403D3D; line-height: 1.7; margin-bottom: 1.25rem; font-size: 1rem; }
      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
      ::-webkit-scrollbar-thumb { background: #c5b9e4; border-radius: 10px; }
      ::-webkit-scrollbar-thumb:hover { background: #a899d3; }
"""

SIDEBARS = {}
SIDEBARS["adhd.html"] = ("ADHD Information Hub", [
    ("Core Concepts", "#234394", ["adhd.html","what-is-adhd.html","adhd-symptoms.html","attention-difficulties.html","focus-and-concentration.html","impulse-control.html","hyperactivity.html"]),
    ("Life Stages", "#C499F6", ["adhd-in-children.html","adhd-in-teens.html","adult-adhd.html","adhd-in-women.html","adhd-in-men.html"]),
    ("Screening & Diagnosis", "#2EC4B6", ["adhd-screening.html","adhd-assessment.html","conners-3-assessment.html","adhd-testing.html"]),
    ("Treatment & Support", "#C499F6", ["adhd-treatment.html","adhd-counselling.html","adhd-coaching.html","executive-function-coaching.html","adhd-parent-support.html","adhd-teacher-support.html","adhd-classroom-accommodations.html","adhd-workplace-accommodations.html"]),
    ("Skills & Strategies", "#F2B81B", ["adhd-time-management.html","adhd-study-skills.html","adhd-organization-skills.html"]),
    ("Co-occurring Conditions", "#FF85A1", ["adhd-and-anxiety.html","adhd-and-autism.html","adhd-and-depression.html"]),
    ("Life Contexts", "#5499C7", ["adhd-at-work.html","adhd-and-school.html","adhd-and-college.html"]),
    ("FAQs & Resources", "#5499C7", ["adhd-faq.html","adhd-resources.html"]),
], "ADHD")

SIDEBARS["specific-learning-disability.html"] = ("Learning Disabilities Hub", [
    ("Core Concepts", "#234394", ["specific-learning-disability.html","learning-disabilities.html","learning-difficulties.html","dyslexia.html","dysgraphia.html","dyscalculia.html","reading-disorder.html","writing-disorder.html","math-learning-disorder.html"]),
    ("Assessment & Testing", "#2EC4B6", ["learning-disability-assessment.html","psychoeducational-assessment.html","school-readiness-assessment.html","wisc-v-testing.html"]),
    ("Intervention & Therapy", "#C499F6", ["academic-intervention.html","dyslexia-therapy.html","reading-intervention.html","writing-intervention.html","study-skills-training.html","executive-function-training.html"]),
    ("Educational Support", "#F2B81B", ["special-education-support.html","inclusive-education.html","iep-support.html","school-accommodations.html","exam-accommodations.html","learning-disability-support.html","school-performance-problems.html"]),
], "Learning Disabilities")

SIDEBARS["speech-therapy.html"] = ("Speech & Communication Hub", [
    ("Speech Disorders", "#234394", ["speech-therapy.html","speech-delay.html","speech-sound-disorders.html","articulation-therapy.html","stuttering-therapy.html"]),
    ("Language Disorders", "#C499F6", ["language-delay.html","expressive-language-disorder.html","receptive-language-disorder.html","pragmatic-language-disorder.html","social-communication-disorder.html","communication-skills-training.html"]),
    ("Assessment", "#2EC4B6", ["speech-assessment.html","language-assessment.html"]),
    ("Specialised Therapy", "#F39F9A", ["speech-therapy-for-autism.html","speech-therapy-for-adhd.html","speech-therapy-for-children.html","speech-therapy-for-adults.html"]),
], "Speech & Language")

SIDEBARS["occupational-therapy.html"] = ("Occupational Therapy Hub", [
    ("Sensory Processing", "#234394", ["occupational-therapy.html","sensory-processing-disorder.html","sensory-integration-therapy.html","sensory-seeking-behaviour.html","sensory-avoidance.html","sensory-regulation.html"]),
    ("Motor Skills", "#C499F6", ["fine-motor-skills.html","gross-motor-skills.html","motor-planning.html","handwriting-difficulties.html"]),
    ("Daily Living Skills", "#F2B81B", ["daily-living-skills.html","self-care-training.html"]),
    ("Assessment", "#2EC4B6", ["occupational-therapy-assessment.html"]),
    ("Specialised OT", "#FF85A1", ["ot-for-autism.html","ot-for-adhd.html","ot-for-learning-disabilities.html"]),
], "Occupational Therapy")

SIDEBARS["child-psychologist.html"] = ("Child Psychology Hub", [
    ("Therapy Services", "#234394", ["child-psychologist.html","child-counselling.html","play-therapy.html","expressive-arts-therapy.html","social-skills-training.html"]),
    ("Emotional & Behavioural", "#C499F6", ["child-anxiety.html","child-depression.html","child-stress.html","child-behaviour-problems.html","temper-tantrums.html","emotional-regulation.html","anger-management-for-children.html"]),
    ("Social & Peer Issues", "#F39F9A", ["peer-relationship-problems.html","bullying-support.html","school-refusal.html","academic-stress.html","low-self-esteem.html","confidence-building.html"]),
    ("Trauma & Grief", "#FF85A1", ["grief-counselling-for-children.html","trauma-support-for-children.html"]),
], "Child Psychology")

HUB_LABELS = {
    "adhd.html": "ADHD Hub",
    "specific-learning-disability.html": "Learning Disabilities Hub",
    "speech-therapy.html": "Speech & Language Hub",
    "occupational-therapy.html": "Occupational Therapy Hub",
    "child-psychologist.html": "Child Psychology Hub",
}

def make_sidebar(hub_file, current_file):
    if hub_file not in SIDEBARS:
        return "", ""
    title, sections, _ = SIDEBARS[hub_file]
    
    def render_section(group_name, color, files):
        items = []
        for f in files:
            label_raw = f.replace(".html", "").replace("-", " ").title()
            # pretty labels
            label_map = {
                "adhd.html": "ADHD Support & Resource Hub",
                "what-is-adhd.html": "What is ADHD?",
                "adhd-symptoms.html": "ADHD Symptoms & Characteristics",
                "attention-difficulties.html": "Attention Difficulties",
                "focus-and-concentration.html": "Focus & Concentration",
                "impulse-control.html": "Impulse Control",
                "hyperactivity.html": "Hyperactivity",
                "adhd-in-children.html": "ADHD in Children",
                "adhd-in-teens.html": "ADHD in Teens & Adolescents",
                "adult-adhd.html": "Adult ADHD",
                "adhd-in-women.html": "ADHD in Women & Girls",
                "adhd-in-men.html": "ADHD in Men",
                "adhd-screening.html": "ADHD Screening",
                "adhd-assessment.html": "Comprehensive ADHD Assessment",
                "conners-3-assessment.html": "Conners 3 Assessment",
                "adhd-testing.html": "ADHD Testing & Evaluation",
                "adhd-treatment.html": "ADHD Treatment & Management",
                "adhd-counselling.html": "ADHD Counselling",
                "adhd-coaching.html": "ADHD Coaching",
                "executive-function-coaching.html": "Executive Function Coaching",
                "adhd-parent-support.html": "ADHD Parent Support & Training",
                "adhd-teacher-support.html": "ADHD Teacher Support",
                "adhd-classroom-accommodations.html": "Classroom Accommodations",
                "adhd-workplace-accommodations.html": "Workplace Accommodations",
                "adhd-time-management.html": "Time Management",
                "adhd-study-skills.html": "Study Skills",
                "adhd-organization-skills.html": "Organisation Skills",
                "adhd-and-anxiety.html": "ADHD and Anxiety",
                "adhd-and-autism.html": "ADHD and Autism (AuDHD)",
                "adhd-and-depression.html": "ADHD and Depression",
                "adhd-at-work.html": "ADHD at Work",
                "adhd-and-school.html": "ADHD and School",
                "adhd-and-college.html": "ADHD and College",
                "adhd-faq.html": "ADHD FAQs",
                "adhd-resources.html": "ADHD Resources",
                "specific-learning-disability.html": "SLD Support Hub",
                "learning-disabilities.html": "Learning Disabilities Overview",
                "learning-difficulties.html": "Learning Difficulties vs Disabilities",
                "dyslexia.html": "Dyslexia",
                "dysgraphia.html": "Dysgraphia",
                "dyscalculia.html": "Dyscalculia",
                "reading-disorder.html": "Reading Disorder",
                "writing-disorder.html": "Writing Disorder",
                "math-learning-disorder.html": "Mathematics Learning Disorder",
                "learning-disability-assessment.html": "LD Assessment",
                "psychoeducational-assessment.html": "Psychoeducational Assessment",
                "school-readiness-assessment.html": "School Readiness Assessment",
                "wisc-v-testing.html": "WISC-V Testing",
                "academic-intervention.html": "Academic Intervention",
                "dyslexia-therapy.html": "Dyslexia Therapy",
                "reading-intervention.html": "Reading Intervention",
                "writing-intervention.html": "Writing Intervention",
                "study-skills-training.html": "Study Skills Training",
                "executive-function-training.html": "Executive Function Training",
                "special-education-support.html": "Special Education Support",
                "inclusive-education.html": "Inclusive Education",
                "iep-support.html": "IEP Support & Advocacy",
                "school-accommodations.html": "School Accommodations",
                "exam-accommodations.html": "Exam Accommodations",
                "learning-disability-support.html": "LD Support Services",
                "school-performance-problems.html": "School Performance Problems",
                "speech-therapy.html": "Speech & Language Therapy Hub",
                "speech-delay.html": "Speech Delay",
                "speech-sound-disorders.html": "Speech Sound Disorders",
                "articulation-therapy.html": "Articulation Therapy",
                "stuttering-therapy.html": "Stuttering Therapy",
                "language-delay.html": "Language Delay",
                "expressive-language-disorder.html": "Expressive Language Disorder",
                "receptive-language-disorder.html": "Receptive Language Disorder",
                "pragmatic-language-disorder.html": "Pragmatic Language Disorder",
                "social-communication-disorder.html": "Social Communication Disorder",
                "communication-skills-training.html": "Communication Skills Training",
                "speech-assessment.html": "Speech Assessment",
                "language-assessment.html": "Language Assessment",
                "speech-therapy-for-autism.html": "Speech Therapy for Autism",
                "speech-therapy-for-adhd.html": "Speech Therapy for ADHD",
                "speech-therapy-for-children.html": "Speech Therapy for Children",
                "speech-therapy-for-adults.html": "Speech Therapy for Adults",
                "occupational-therapy.html": "Occupational Therapy Hub",
                "sensory-processing-disorder.html": "Sensory Processing Disorder",
                "sensory-integration-therapy.html": "Sensory Integration Therapy",
                "sensory-seeking-behaviour.html": "Sensory Seeking Behaviour",
                "sensory-avoidance.html": "Sensory Avoidance",
                "sensory-regulation.html": "Sensory Regulation",
                "fine-motor-skills.html": "Fine Motor Skills",
                "gross-motor-skills.html": "Gross Motor Skills",
                "motor-planning.html": "Motor Planning & Dyspraxia",
                "handwriting-difficulties.html": "Handwriting Difficulties",
                "daily-living-skills.html": "Daily Living Skills",
                "self-care-training.html": "Self-Care Training",
                "occupational-therapy-assessment.html": "OT Assessment",
                "ot-for-autism.html": "OT for Autism",
                "ot-for-adhd.html": "OT for ADHD",
                "ot-for-learning-disabilities.html": "OT for Learning Disabilities",
                "child-psychologist.html": "Child Psychology Hub",
                "child-counselling.html": "Child Counselling",
                "play-therapy.html": "Play Therapy",
                "expressive-arts-therapy.html": "Expressive Arts Therapy",
                "social-skills-training.html": "Social Skills Training",
                "child-anxiety.html": "Child Anxiety",
                "child-depression.html": "Child Depression",
                "child-stress.html": "Child Stress & Coping",
                "child-behaviour-problems.html": "Child Behaviour Problems",
                "temper-tantrums.html": "Temper Tantrums",
                "emotional-regulation.html": "Emotional Regulation",
                "anger-management-for-children.html": "Anger Management",
                "peer-relationship-problems.html": "Peer Relationship Problems",
                "bullying-support.html": "Bullying Support",
                "school-refusal.html": "School Refusal",
                "academic-stress.html": "Academic Stress",
                "low-self-esteem.html": "Low Self-Esteem",
                "confidence-building.html": "Confidence Building",
                "grief-counselling-for-children.html": "Grief Counselling",
                "trauma-support-for-children.html": "Trauma Support",
            }
            label = label_map.get(f, label_raw)
            active = "bg-[#234394] text-white font-semibold" if f == current_file else "text-gray-600 hover:text-[#234394] hover:bg-white"
            items.append(f'      <li><a class="block px-3 py-1.5 text-xs rounded-xl transition-all duration-200 {active}" href="./{f}">{label}</a></li>\n')
        return "".join(items)
    
    sections_html = []
    for group_name, color, files in sections:
        items = render_section(group_name, color, files)
        if items:
            sections_html.append(f"""  <div class="mb-6">
    <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1"><span class="w-2 h-2 rounded-full" style="background-color: {color}"></span>{group_name}</h3>
    <ul class="space-y-1 ml-2">
{items}    </ul>
  </div>""")
    
    desktop = f"""<div class="w-full md:w-80 flex-shrink-0 bg-[#F9FBFF] border border-[#E0E6F0] rounded-3xl p-6 hidden md:block max-h-[85vh] overflow-y-auto sticky top-6 shadow-sm">
  <h2 class="text-xl font-bold text-[#234394] mb-6 border-b pb-3">{title}</h2>
{chr(10).join(sections_html)}</div>"""
    
    mobile_items = []
    for group_name, color, files in sections:
        items_m = []
        for f in files:
            label_raw = f.replace(".html", "").replace("-", " ").title()
            label = {
                "adhd.html": "ADHD Support & Resource Hub", "what-is-adhd.html": "What is ADHD?",
                "adhd-symptoms.html": "ADHD Symptoms & Characteristics",
                "specific-learning-disability.html": "SLD Support Hub",
                "speech-therapy.html": "Speech & Language Therapy Hub",
                "occupational-therapy.html": "Occupational Therapy Hub",
                "child-psychologist.html": "Child Psychology Hub",
            }.get(f, label_raw)
            active_m = 'text-[#234394] font-bold' if f == current_file else 'text-gray-600'
            items_m.append(f'          <li><a class="block py-1 text-xs {active_m}" href="./{f}">{label}</a></li>\n')
        if items_m:
            mobile_items.append(f"""      <div class="mb-4">
        <h4 class="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">{group_name}</h4>
        <ul class="space-y-1 ml-1">
{''.join(items_m)}        </ul>
      </div>""")
    
    mobile = f"""<div class="w-full md:hidden mb-6 bg-[#F9FBFF] border border-[#E0E6F0] rounded-2xl p-4 shadow-sm">
  <details class="group">
    <summary class="flex justify-between items-center cursor-pointer font-bold text-[#234394] text-sm">
      <span>Information Menu</span>
      <svg class="w-4 h-4 transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round"></path></svg>
    </summary>
    <div class="mt-4 pt-3 border-t border-gray-200 max-h-[60vh] overflow-y-auto">
{chr(10).join(mobile_items)}    </div>
  </details>
</div>"""
    
    return desktop, mobile


def make_breadcrumb(hub_file, text):
    hub_label = HUB_LABELS.get(hub_file, "Hub")
    if hub_file:
        return f"""      <div class="bg-gray-50 py-3 px-6 md:px-16 border-b border-gray-200 text-xs md:text-sm text-gray-500 breadcrumbs">
        <div class="max-w-7xl mx-auto flex items-center gap-2">
          <a class="hover:text-[#234394]" href="./index.html">Home</a>
          <span>/</span>
          <a class="hover:text-[#234394]" href="./{hub_file}">{hub_label}</a>
          <span>/</span>
          <span class="text-gray-800 font-medium">{text}</span>
        </div>
      </div>"""
    return ""


def make_faqs(faqs):
    if not faqs:
        return ""
    items = []
    for q, a in faqs:
        items.append(f"""        <div class="border-b border-[#E0E6F0] py-4">
          <button class="w-full text-left flex justify-between items-center focus:outline-none py-2 group">
            <span class="font-semibold text-base md:text-lg text-[#234394] group-hover:text-purple-600 transition-colors">{q}</span>
            <img src="data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M12%205V19M5%2012H19'%20stroke='%23234394'%20stroke-width='2'%20stroke-linecap='round'/%3e%3c/svg%3e" class="w-5 h-5 transition-transform duration-300 flex-shrink-0" alt="Toggle" />
          </button>
          <div class="transition-all duration-300 max-h-0 opacity-0 overflow-hidden">
            <p class="text-sm md:text-base text-gray-600 mt-2 pb-2 leading-relaxed">
              {a}
            </p>
          </div>
        </div>
""")
    return f"""            <h3 class='text-xl font-bold mt-12 mb-6'>Frequently Asked Questions</h3><div class='space-y-2 mb-8'>
{''.join(items)}        </div>"""


def make_key_points(points):
    if not points:
        return ""
    items = []
    for title_text, desc in points:
        items.append(f"""        <li class="flex items-start gap-3">
          <img alt="Bullet" class="w-4 h-4 flex-shrink-0 mt-1" src="./assets/Diamond-dGu0kMrR.svg" />
          <span class="text-sm md:text-base text-gray-700"><strong>{title_text}:</strong> {desc}</span>
        </li>
""")
    return "".join(items)


def make_pathway(title, text):
    if not title:
        return ""
    return f"""            <div class="bg-[#F8FAFC] border border-[#E2E8F0] rounded-3xl p-6 md:p-8 my-8 shadow-sm">
              <h3 class="text-lg md:text-xl font-bold text-[#234394] mb-3">{title}</h3>
              <p class="text-sm md:text-base text-gray-600 leading-relaxed mb-0">{text}</p>
            </div>"""


# Content data for all pages (compact format)
CONTENT = {
    "adhd.html": {
        "tag": "Resource Hub", "intro": "Core Aspects of ADHD",
        "points": [
            ("Neurodevelopmental Basis", "ADHD is a brain-based condition affecting attention, impulse control, and activity regulation that begins in childhood and often persists into adulthood."),
            ("Three Core Presentations", "Predominantly inattentive, predominantly hyperactive-impulsive, and combined presentation — each with unique characteristics and support needs."),
            ("Executive Function Challenges", "Difficulties with planning, organisation, time management, working memory, and self-monitoring are central to the ADHD experience."),
            ("Strengths and Talents", "Many individuals with ADHD possess creativity, hyperfocus ability, adaptability, energy, and innovative problem-solving skills."),
        ],
        "path_title": "ADHD Care Pathway at eMbrace",
        "path_text": "We provide a complete ADHD care pathway starting with comprehensive screening and assessment using gold-standard tools like Conners 3, followed by tailored interventions including parent training, classroom accommodations, executive function coaching, counselling, and skill-building programs.",
        "faqs": [
            ("What is eMbrace's approach to ADHD support?", "At eMbrace, we view ADHD as a neurodevelopmental variation rather than a deficit. Our approach combines evidence-based interventions with strength-based strategies."),
            ("Do you provide ADHD assessments for adults?", "Yes, we provide comprehensive ADHD assessments for adults including clinical interviews, rating scales, collateral information, and cognitive screening."),
            ("What therapy options are available for ADHD?", "We offer behavioural therapy, cognitive behavioural therapy (CBT), executive function coaching, parent training, and educational support."),
        ],
    },
    "specific-learning-disability.html": {
        "tag": "Resource Hub", "intro": "Core Aspects of Learning Disabilities",
        "points": [
            ("Neurological Basis", "Specific Learning Disabilities (SLD) are neurodevelopmental conditions that affect the brain's ability to process, store, and retrieve information related to reading, writing, and mathematics."),
            ("Not About Intelligence", "SLD occurs in individuals with average to above-average intelligence. These are specific processing differences, not global intellectual impairments."),
            ("Lifelong but Malleable", "While SLD is lifelong, intensive evidence-based intervention can significantly improve skills. The brain's plasticity allows for meaningful growth."),
            ("Co-occurring Conditions", "ADHD, anxiety, and language disorders commonly co-occur with SLD, requiring comprehensive assessment and integrated intervention."),
        ],
        "path_title": "SLD Care Pathway at eMbrace",
        "path_text": "We provide a complete SLD care pathway including comprehensive psychoeducational assessment (WISC-V, WIAT, etc.), evidence-based academic interventions, study skills coaching, and school advocacy.",
        "faqs": [
            ("What is eMbrace's approach to learning disabilities?", "We focus on identifying each child's unique learning profile — strengths and challenges — and providing targeted evidence-based interventions."),
            ("How do you assess for learning disabilities?", "We use comprehensive psychoeducational assessments including cognitive testing (WISC-V), academic achievement testing (WIAT), and processing skills evaluation."),
            ("What interventions do you offer for LD?", "We offer structured literacy programs (Orton-Gillingham based), multisensory maths instruction, writing interventions, study skills training, and executive function coaching."),
        ],
    },
    "speech-therapy.html": {
        "tag": "Resource Hub", "intro": "Core Aspects of Speech & Language Therapy",
        "points": [
            ("Speech vs Language", "Speech is the verbal production of sounds; language is the system of words and rules used to communicate. Speech therapy addresses both."),
            ("Early Intervention", "Early identification and intervention (before age 5) significantly improve communication outcomes. The brain is most plastic in early childhood."),
            ("Holistic Approach", "Effective speech therapy considers the whole person — communication needs, environment, family dynamics, and co-occurring conditions."),
            ("Multidisciplinary Care", "Speech therapists collaborate with occupational therapists, psychologists, and educators for comprehensive support."),
        ],
        "path_title": "Speech & Language Therapy at eMbrace",
        "path_text": "We provide comprehensive speech and language assessment and therapy for children and adults, addressing articulation, language, fluency, and social communication needs.",
        "faqs": [
            ("What is eMbrace's approach to speech therapy?", "We provide personalised, evidence-based speech therapy that respects individual communication styles and involves families in the therapeutic process."),
            ("When should my child start speech therapy?", "If you notice delays in babbling, first words, or combining words, consult a speech therapist. Intervention can start as early as 18 months."),
            ("Do you provide speech therapy for adults?", "Yes, we offer speech therapy for adults with communication disorders including aphasia, voice disorders, stuttering, and cognitive-communication challenges."),
        ],
    },
    "occupational-therapy.html": {
        "tag": "Resource Hub", "intro": "Core Aspects of Occupational Therapy",
        "points": [
            ("What is OT?", "Occupational therapy helps individuals develop the skills needed for daily living, learning, and playing. It addresses sensory, motor, and functional challenges."),
            ("Sensory Integration", "OT helps children process and respond to sensory information appropriately, improving regulation, attention, and participation in daily activities."),
            ("Motor Development", "Fine and gross motor skills are essential for writing, self-care, and physical activities. OT builds these foundational skills."),
            ("Daily Living Skills", "OT supports independence in self-care tasks like dressing, feeding, grooming, and toileting, building confidence and autonomy."),
        ],
        "path_title": "Occupational Therapy at eMbrace",
        "path_text": "We provide comprehensive occupational therapy assessment and intervention for children and adults, addressing sensory processing, motor skills, and daily living skills.",
        "faqs": [
            ("What is eMbrace's approach to OT?", "We provide child-centred, play-based occupational therapy that respects each child's unique sensory and motor profile."),
            ("How do I know if my child needs OT?", "Signs include sensory sensitivities, motor delays, handwriting difficulties, and challenges with daily living tasks beyond age expectations."),
            ("Do you provide OT for adults?", "Yes, we offer OT for adults with sensory processing challenges, motor coordination difficulties, and daily living skill needs."),
        ],
    },
    "child-psychologist.html": {
        "tag": "Resource Hub", "intro": "Core Aspects of Child Psychology",
        "points": [
            ("Evidence-Based Care", "Our child psychologists use evidence-based therapies including CBT, play therapy, and family therapy tailored to each child's developmental level."),
            ("Early Intervention", "Early identification and treatment of mental health concerns in children leads to better long-term outcomes across all areas of development."),
            ("Family Involvement", "We believe in working collaboratively with parents and families, providing guidance and support to create a nurturing home environment."),
            ("Holistic Approach", "We consider all aspects of a child's life — home, school, peers, and community — when developing treatment plans."),
        ],
        "path_title": "Child Psychology Services at eMbrace",
        "path_text": "Our child psychologists provide comprehensive mental health services including assessment, individual therapy, family counselling, and parent guidance for children facing emotional, behavioural, and developmental challenges.",
        "faqs": [
            ("What is eMbrace's approach to child therapy?", "We use evidence-based, play-informed approaches that meet children at their developmental level and involve families in the therapeutic process."),
            ("How do I know if my child needs therapy?", "Signs include persistent changes in mood, behaviour, sleep, appetite, academic performance, or social withdrawal that affect daily functioning."),
            ("What ages do you work with?", "Our child psychologists work with children from ages 2 through 18, using developmentally appropriate approaches for each age group."),
        ],
    },
}

# Fallback content generator for pages not in CONTENT dict
def make_fallback_content(intro, points):
    if points:
        pts = make_key_points(points)
        return f"""            <h2 class="text-2xl md:text-3xl font-bold mb-6 text-[#234394]">{intro}</h2>
            <ul class="space-y-4 mb-8">
{pts}            </ul>"""
    return ""


def generate_page(page_data, hub_file):
    fn = page_data["filename"]
    title = page_data["title"]
    desc = page_data["description"]
    h1 = page_data["h1"]
    subtitle = page_data["subtitle"]
    bc_text = page_data["breadcrumb_text"]
    
    canonical = "/" + fn.replace(".html", "")
    
    content_data = CONTENT.get(fn, None)
    if not content_data:
        # find by matching hub content
        content_data = CONTENT.get(hub_file, None)
    
    tag = content_data["tag"] if content_data and "tag" in content_data else ""
    intro = content_data["intro"] if content_data and "intro" in content_data else f"Understanding {h1}"
    points = content_data["points"] if content_data and "points" in content_data else []
    path_title = content_data["path_title"] if content_data and "path_title" in content_data else ""
    path_text = content_data["path_text"] if content_data and "path_text" in content_data else ""
    faqs = content_data["faqs"] if content_data and "faqs" in content_data else []
    
    desk_side, mob_side = make_sidebar(hub_file or fn, fn)
    breadcrumb = make_breadcrumb(hub_file or fn, bc_text)
    
    faq_section = make_faqs(faqs)
    key_pts = make_key_points(points) if points else ""
    pathway_section = make_pathway(path_title, path_text)
    
    article_content = ""
    if key_pts:
        article_content = f"""            <h2 class="text-2xl md:text-3xl font-bold mb-6 text-[#234394]">{intro}</h2>
            <p class="text-lg text-gray-700 leading-relaxed font-light mb-8">{subtitle}</p>
            <hr class="my-8 border-gray-100" />
            <h3 class="text-xl font-bold mb-4">{intro}</h3>
            <ul class="space-y-4 mb-8">
{key_pts}            </ul>
{pathway_section}
{faq_section}"""
    else:
        article_content = f"""            <h2 class="text-2xl md:text-3xl font-bold mb-6 text-[#234394]">{h1}</h2>
            <p class="text-lg text-gray-700 leading-relaxed font-light mb-8">{subtitle}</p>
            <hr class="my-8 border-gray-100" />
{pathway_section}
{faq_section}"""
    
    cta = f"""            <div class="bg-gradient-to-r from-[#FFF5DC99] to-[#FFF8E445] border border-orange-100 rounded-3xl p-8 text-center my-12 shadow-sm">
              <h3 class="text-xl md:text-2xl font-bold text-gray-800 mb-2">Speak with a Specialist</h3>
              <p class="text-sm md:text-base text-gray-600 mb-6 max-w-xl mx-auto">Get personalised guidance, professional assessment, and structured support at eMbrace Delhi.</p>
              <button class="bg-[#234394] text-white px-8 py-3 rounded-full hover:bg-blue-800 font-semibold cursor-pointer shadow">
                Schedule an Appointment
              </button>
            </div>"""
    
    html = f"""<!doctype html>
<html lang="en-IN">
  <head>
    <meta charset="utf-8" />
    <link href="./Favicon.png" rel="icon" type="image/svg+xml" />
    <meta content="width=device-width, initial-scale=1.0" name="viewport" />
    <meta content="{desc}" name="description" />
    <meta content="index, follow" name="robots" />
    <link href="{BASE_URL}{canonical}" rel="canonical" />
    <meta content="website" property="og:type" />
    <meta content="{BASE_URL}{canonical}" property="og:url" />
    <meta content="{title}" property="og:title" />
    <meta content="{desc}" property="og:description" />
    <meta content="https://embracelives.com/og-image.png" property="og:image" />
    <meta content="eMbrace Lives" property="og:site_name" />
    <meta content="en_IN" property="og:locale" />
    <meta content="summary_large_image" name="twitter:card" />
    <meta content="{title}" name="twitter:title" />
    <meta content="{desc}" name="twitter:description" />
    <meta content="https://embracelives.com/og-image.png" name="twitter:image" />
    <title>{title}</title>
    <link href="https://fonts.googleapis.com" rel="preconnect" />
    <link href="https://fonts.gstatic.com" rel="preconnect" />
    <link href="./_external/fonts.googleapis.com/css2_4d2f350a.css" rel="stylesheet" />
    <link href="./assets/index-B-kGA3UA.css" rel="stylesheet" />
    <style>{STYLES}
    </style>
  </head>
  <body style="overflow: auto">
    <div id="root">
      <div id="header-placeholder"></div>
      <div class="px-6 md:px-16 py-12 md:py-20 bg-gradient-to-b from-[#E7F7FF] to-white relative overflow-hidden flex items-center justify-center border-b border-[#E0E6F0]">
        <div class="absolute w-24 h-24 bg-purple-200/50 rounded-full -left-10 top-10 hidden md:block"></div>
        <div class="absolute w-32 h-32 bg-blue-100/60 rounded-full -right-12 bottom-5 hidden md:block"></div>
        <div class="w-full max-w-7xl mx-auto text-center">
          <span class="inline-block px-4 py-1 text-xs font-bold rounded-full bg-[#E7F7FF] text-[#234394] mb-4 tracking-wider uppercase">{tag}</span>
          <h1 class="text-3xl md:text-5xl font-extrabold text-[#234394] leading-tight mb-4">{h1}</h1>
          <p class="text-base md:text-lg text-gray-600 max-w-3xl mx-auto italic">{subtitle}</p>
          <div class="mt-8 flex justify-center">
            <button class="bg-[#234394] hover:bg-[#1e3a80] text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all transform hover:scale-105 cursor-pointer">
              Book a Consultation
            </button>
          </div>
        </div>
      </div>
{breadcrumb}
      <div class="px-6 md:px-16 py-12 bg-white">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 lg:gap-12">
{desk_side}
{mob_side}
          <div class="flex-grow max-w-4xl article-content">
{article_content}
{cta}
          </div>
        </div>
      </div>
      <div id="footer-placeholder"></div>
    </div>
    <script src="./assets/interactive.js"></script>
  </body>
</html>"""
    
    filepath = os.path.join(DIR, fn)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
    return fn


# Load page data
def load_json(path):
    with open(path, 'r') as f:
        return json.load(f)

ADHD_PAGES = load_json(os.path.join(DIR, "_gen", "adhd_pages.json"))
remaining = load_json(os.path.join(DIR, "_gen", "remaining_pages.json"))

all_clusters = [
    ("ADHD", ADHD_PAGES),
    ("Learning Disabilities", remaining["speech"]),
    ("Speech", remaining["speech"]),
    ("Occupational Therapy", remaining["ot"]),
    ("Child Psychology", remaining["child_psych"]),
]

# Actually let's organize correctly
CLUSTERS = [
    ("ADHD", ADHD_PAGES),
]

# Fix LD pages
ld_pages_raw = load_json(os.path.join(DIR, "_gen", "ld_pages.json"))
SPEECH_PAGES = remaining["speech"]
OT_PAGES = remaining["ot"]
CHILD_PSYCH_PAGES = remaining["child_psych"]

CLUSTERS = [
    ("ADHD", ADHD_PAGES),
    ("Learning Disabilities", ld_pages_raw),
    ("Speech & Communication", SPEECH_PAGES),
    ("Occupational Therapy", OT_PAGES),
    ("Child Psychology", CHILD_PSYCH_PAGES),
]

generated = []
failed = []

for cluster_name, pages in CLUSTERS:
    hub_file = None
    for p in pages:
        if p["category"] == "hub":
            hub_file = p["filename"]
            break
    if not hub_file and pages:
        hub_file = pages[0]["filename"]
    
    for p in pages:
        try:
            fn = generate_page(p, hub_file if p["category"] != "hub" else None)
            generated.append(fn)
            print(f"  ✅ {fn}")
        except Exception as e:
            failed.append((p["filename"], str(e)))
            print(f"  ❌ {p['filename']}: {e}")

print(f"\n✅ Generated {len(generated)} pages successfully")
if failed:
    print(f"❌ {len(failed)} pages failed:")
    for fn, err in failed:
        print(f"   - {fn}: {err}")
