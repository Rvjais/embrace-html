#!/usr/bin/env python3
"""Generate remaining cluster pages — teen, adult, parent, schools, corporate, locations."""

import os, json

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

SIDEBARS["teen-counselling.html"] = ("Teen Mental Health Hub", [
    ("Common Concerns", "#234394", ["teen-counselling.html","teen-anxiety.html","teen-depression.html","teen-stress.html","social-anxiety-in-teens.html","peer-pressure.html"]),
    ("Digital & Lifestyle", "#C499F6", ["digital-addiction.html","gaming-addiction.html","career-stress.html","exam-anxiety.html","college-transition-support.html"]),
    ("Emotional Wellbeing", "#2EC4B6", ["self-esteem-for-teens.html","emotional-regulation-for-teens.html","anger-management-for-teens.html","teen-relationship-issues.html"]),
], "Teen Mental Health")

SIDEBARS["adult-counselling.html"] = ("Adult Mental Health Hub", [
    ("Common Concerns", "#234394", ["adult-counselling.html","adult-anxiety.html","adult-depression.html","stress-management.html","life-transitions.html","burnout-counselling.html"]),
    ("Relationships", "#C499F6", ["premarital-counselling.html","relationship-counselling.html","couples-therapy.html","marital-counselling.html"]),
    ("Therapy & Support", "#2EC4B6", ["grief-counselling.html","trauma-therapy.html","mindfulness-therapy.html","self-esteem-counselling.html","workplace-stress.html"]),
    ("Neurodivergent Adults", "#F2B81B", ["adult-autism-support.html","adult-adhd-support.html","executive-function-coaching-for-adults.html"]),
], "Adult Mental Health")

SIDEBARS["parents.html"] = ("Parent Support Hub", [
    ("Parenting Challenges", "#234394", ["parents.html","parent-counselling.html","parent-burnout.html","caregiver-support.html","positive-parenting.html","new-parent-support.html","parent-support-groups.html"]),
    ("Neurodivergent Children", "#C499F6", ["raising-a-child-with-autism.html","raising-a-child-with-adhd.html","siblings-of-neurodivergent-children.html","managing-meltdowns.html","behaviour-management-at-home.html"]),
    ("Education & Advocacy", "#2EC4B6", ["school-communication.html","iep-guide.html","inclusive-school-guide.html","transition-planning-for-parents.html"]),
], "Parents")

SIDEBARS["schools.html"] = ("Schools Partnership Hub", [
    ("School Services", "#234394", ["schools.html","school-partnerships.html","school-counselling.html","school-screening-programs.html","school-wellness-programs.html","school-mental-health-programs.html"]),
    ("Inclusive Education", "#C499F6", ["inclusive-education-consulting.html","autism-in-the-classroom.html","adhd-in-the-classroom.html","learning-disabilities-in-school.html","special-education-consulting.html","classroom-accommodations.html"]),
    ("Staff Development", "#2EC4B6", ["teacher-training.html","teacher-wellbeing-programs.html","manager-training.html"]),
], "Schools")

SIDEBARS["corporates.html"] = ("Corporate Wellness Hub", [
    ("Workplace Mental Health", "#234394", ["corporates.html","corporate-wellness.html","employee-mental-health.html","employee-assistance-programs.html","workplace-stress.html","workplace-anxiety.html","burnout-prevention.html"]),
    ("Neurodiversity & Inclusion", "#C499F6", ["neurodiversity-at-work.html","inclusive-hiring.html","workplace-adhd-support.html","workplace-autism-support.html","workplace-accommodations.html"]),
    ("Leadership & Training", "#2EC4B6", ["leadership-wellbeing.html","manager-training.html"]),
], "Corporate")

HUB_LABELS = {
    "teen-counselling.html": "Teen Mental Health Hub",
    "adult-counselling.html": "Adult Mental Health Hub",
    "parents.html": "Parent Support Hub",
    "schools.html": "Schools Partnership Hub",
    "corporates.html": "Corporate Wellness Hub",
}

def make_sidebar(hub_file, current_file):
    if hub_file not in SIDEBARS:
        return "", ""
    title, sections, _ = SIDEBARS[hub_file]

    label_map = {}
    for _, _, files in sections:
        for f in files:
            raw = f.replace(".html", "").replace("-", " ").title()
            label_map[f] = raw
    pretty = {
        "teen-counselling.html": "Teen Counselling & Support Hub",
        "teen-anxiety.html": "Teen Anxiety",
        "teen-depression.html": "Teen Depression",
        "teen-stress.html": "Teen Stress & Coping",
        "social-anxiety-in-teens.html": "Social Anxiety in Teens",
        "peer-pressure.html": "Peer Pressure",
        "digital-addiction.html": "Digital Addiction",
        "gaming-addiction.html": "Gaming Addiction",
        "career-stress.html": "Career Stress",
        "exam-anxiety.html": "Exam Anxiety",
        "college-transition-support.html": "College Transition Support",
        "self-esteem-for-teens.html": "Self-Esteem for Teens",
        "emotional-regulation-for-teens.html": "Emotional Regulation for Teens",
        "anger-management-for-teens.html": "Anger Management for Teens",
        "teen-relationship-issues.html": "Teen Relationship Issues",
        "adult-counselling.html": "Adult Counselling & Support Hub",
        "adult-anxiety.html": "Adult Anxiety",
        "adult-depression.html": "Adult Depression",
        "stress-management.html": "Stress Management",
        "life-transitions.html": "Life Transitions",
        "burnout-counselling.html": "Burnout Counselling",
        "premarital-counselling.html": "Premarital Counselling",
        "relationship-counselling.html": "Relationship Counselling",
        "couples-therapy.html": "Couples Therapy",
        "marital-counselling.html": "Marital Counselling",
        "grief-counselling.html": "Grief Counselling",
        "trauma-therapy.html": "Trauma Therapy",
        "mindfulness-therapy.html": "Mindfulness Therapy",
        "self-esteem-counselling.html": "Self-Esteem Counselling",
        "workplace-stress.html": "Workplace Stress",
        "adult-autism-support.html": "Adult Autism Support",
        "adult-adhd-support.html": "Adult ADHD Support",
        "executive-function-coaching-for-adults.html": "Executive Function Coaching for Adults",
        "parents.html": "Parent Support & Resource Hub",
        "parent-counselling.html": "Parent Counselling",
        "parent-burnout.html": "Parent Burnout",
        "caregiver-support.html": "Caregiver Support",
        "positive-parenting.html": "Positive Parenting",
        "new-parent-support.html": "New Parent Support",
        "parent-support-groups.html": "Parent Support Groups",
        "raising-a-child-with-autism.html": "Raising a Child with Autism",
        "raising-a-child-with-adhd.html": "Raising a Child with ADHD",
        "siblings-of-neurodivergent-children.html": "Siblings of Neurodivergent Children",
        "managing-meltdowns.html": "Managing Meltdowns",
        "behaviour-management-at-home.html": "Behaviour Management at Home",
        "school-communication.html": "School Communication",
        "iep-guide.html": "IEP Guide",
        "inclusive-school-guide.html": "Inclusive School Guide",
        "transition-planning-for-parents.html": "Transition Planning for Parents",
        "schools.html": "Schools Partnership Hub",
        "school-partnerships.html": "School Partnerships",
        "school-counselling.html": "School Counselling",
        "school-screening-programs.html": "School Screening Programs",
        "school-wellness-programs.html": "School Wellness Programs",
        "school-mental-health-programs.html": "School Mental Health Programs",
        "inclusive-education-consulting.html": "Inclusive Education Consulting",
        "autism-in-the-classroom.html": "Autism in the Classroom",
        "adhd-in-the-classroom.html": "ADHD in the Classroom",
        "learning-disabilities-in-school.html": "Learning Disabilities in School",
        "special-education-consulting.html": "Special Education Consulting",
        "classroom-accommodations.html": "Classroom Accommodations",
        "teacher-training.html": "Teacher Training",
        "teacher-wellbeing-programs.html": "Teacher Wellbeing Programs",
        "manager-training.html": "Manager Training",
        "corporates.html": "Corporate Wellness Hub",
        "corporate-wellness.html": "Corporate Wellness Programs",
        "employee-mental-health.html": "Employee Mental Health",
        "employee-assistance-programs.html": "Employee Assistance Programs",
        "workplace-anxiety.html": "Workplace Anxiety",
        "burnout-prevention.html": "Burnout Prevention",
        "neurodiversity-at-work.html": "Neurodiversity at Work",
        "inclusive-hiring.html": "Inclusive Hiring",
        "workplace-adhd-support.html": "Workplace ADHD Support",
        "workplace-autism-support.html": "Workplace Autism Support",
        "workplace-accommodations.html": "Workplace Accommodations",
        "leadership-wellbeing.html": "Leadership Wellbeing",
    }
    label_map.update(pretty)

    def render_section(group_name, color, files):
        items = []
        for f in files:
            label = label_map.get(f, f.replace(".html","").replace("-"," ").title())
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
            label = label_map.get(f, f.replace(".html","").replace("-"," ").title())
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

# ============ CONTENT DATA ============

CONTENT = {}

CONTENT["teen-counselling.html"] = {
    "tag": "Resource Hub", "intro": "Core Aspects of Teen Mental Health",
    "points": [
        ("Unique Developmental Stage", "Adolescence brings significant brain development, identity formation, and social changes that create both opportunities and challenges for mental health."),
        ("Early Intervention Matters", "Addressing mental health concerns early in adolescence prevents escalation and builds lifelong coping skills."),
        ("Holistic Approach", "Effective teen mental health support addresses emotional, social, academic, and family dimensions simultaneously."),
        ("Strength-Based Focus", "We emphasise teens' resilience, creativity, and capacity for growth rather than focusing solely on problems."),
    ],
    "path_title": "Teen Mental Health Pathway at eMbrace",
    "path_text": "We provide comprehensive teen mental health services including individual counselling, family therapy, group programs, and school collaboration — all delivered by experienced adolescent psychologists.",
    "faqs": [
        ("What age range does eMbrace cover for teen counselling?", "We work with adolescents aged 12-19, using developmentally appropriate approaches for early, middle, and late adolescence."),
        ("How is teen counselling different from adult therapy?", "Teen counselling uses more engaging, activity-based methods, involves family when appropriate, and addresses developmental tasks like identity and independence."),
        ("Do you involve parents in the process?", "We typically start with a parent consultation, then balance individual teen sessions with periodic family check-ins based on the teen's needs and preferences."),
    ],
}

CONTENT["teen-anxiety.html"] = {
    "tag": "Common Concern", "intro": "Understanding Teen Anxiety",
    "points": [
        ("Prevalence", "Anxiety is the most common mental health concern among adolescents, affecting approximately 1 in 3 teens by age 18."),
        ("Multiple Forms", "Teen anxiety can manifest as generalised anxiety, social anxiety, panic attacks, specific phobias, or school-related anxiety."),
        ("Physical Symptoms", "Teens often experience headaches, stomachaches, fatigue, muscle tension, and sleep difficulties alongside worry."),
        ("Impact on Functioning", "Anxiety can significantly affect academic performance, social relationships, and family dynamics."),
    ],
    "path_title": "Teen Anxiety Support at eMbrace",
    "path_text": "Our adolescent psychologists provide evidence-based treatment for teen anxiety including CBT, exposure therapy, mindfulness, and family support strategies.",
    "faqs": [
        ("How do I know if my teen has anxiety vs normal worry?", "When worry is persistent, excessive, and interferes with daily life — such as avoiding school, friends, or activities — it may be an anxiety disorder."),
        ("Can teen anxiety resolve without treatment?", "While some mild anxiety improves, moderate to severe anxiety typically requires intervention for full recovery."),
        ("What therapy works best for teen anxiety?", "Cognitive Behavioural Therapy (CBT) has the strongest evidence base for adolescent anxiety disorders."),
    ],
}

CONTENT["teen-depression.html"] = {
    "tag": "Common Concern", "intro": "Understanding Teen Depression",
    "points": [
        ("Beyond Moodiness", "Teen depression is more than typical adolescent mood swings — it's a persistent condition affecting thoughts, feelings, and daily functioning."),
        ("Recognising Signs", "Look for persistent sadness, loss of interest in activities, social withdrawal, changes in sleep/appetite, irritability, and declining grades."),
        ("Serious Risk", "Depression is a major risk factor for self-harm and suicide in adolescents, making early intervention critical."),
        ("Highly Treatable", "With appropriate treatment, most teens recover from depression and develop resilience for the future."),
    ],
    "path_title": "Teen Depression Support at eMbrace",
    "path_text": "Our team provides comprehensive assessment and evidence-based treatment for teen depression including CBT, interpersonal therapy, and family-based approaches.",
    "faqs": [
        ("How is teen depression different from adult depression?", "Teens often show more irritability than sadness, may have more physical complaints, and are strongly influenced by peer relationships."),
        ("What are the warning signs of suicide risk?", "Talk of death or suicide, giving away possessions, withdrawal, sudden calmness after depression, and self-harm behaviours require immediate attention."),
        ("Does medication help teen depression?", "For moderate to severe depression, a combination of therapy and medication (under psychiatric supervision) is often most effective."),
    ],
}

CONTENT["teen-stress.html"] = {
    "tag": "Common Concern", "intro": "Understanding Teen Stress",
    "points": [
        ("Academic Pressure", "Exams, grades, college admissions, and parental expectations create significant stress for today's adolescents."),
        ("Social Stressors", "Peer relationships, social media pressure, bullying, and the need for belonging are major sources of teen stress."),
        ("Physical Effects", "Chronic stress in teens leads to headaches, sleep problems, weakened immunity, and digestive issues."),
        ("Coping Skills Gap", "Many teens lack effective stress management skills and may turn to unhealthy coping mechanisms."),
    ],
    "path_title": "Teen Stress Management at eMbrace",
    "path_text": "We teach practical stress management techniques including relaxation skills, time management, cognitive restructuring, and healthy lifestyle habits.",
    "faqs": [
        ("How much stress is normal for a teen?", "Some stress is normal and can even be motivating, but when stress interferes with sleep, eating, school, or relationships, it's time to seek help."),
        ("Can stress cause physical symptoms in teens?", "Absolutely — stress commonly causes headaches, stomachaches, muscle tension, fatigue, and changes in appetite or sleep patterns."),
    ],
}

CONTENT["social-anxiety-in-teens.html"] = {
    "tag": "Common Concern", "intro": "Understanding Social Anxiety in Teens",
    "points": [
        ("Intense Fear of Judgment", "Social anxiety involves an intense fear of being judged, embarrassed, or rejected in social situations."),
        ("Avoidance Patterns", "Teens with social anxiety often avoid social events, speaking in class, or interacting with peers."),
        ("Academic Impact", "Social anxiety can lead to school refusal, reluctance to participate in class, and difficulty with group projects."),
        ("Treatable Condition", "With CBT and gradual exposure therapy, most teens overcome social anxiety and build social confidence."),
    ],
    "path_title": "Social Anxiety Support at eMbrace",
    "path_text": "Our adolescent therapists specialise in evidence-based treatment for social anxiety, using CBT, social skills training, and graduated exposure.",
    "faqs": [
        ("Is social anxiety just shyness?", "No — social anxiety is more severe, causes significant distress, and interferes with daily life in ways that ordinary shyness does not."),
        ("How does social anxiety affect school?", "Teens may avoid speaking in class, skip presentations, avoid group work, eat lunch alone, or refuse school entirely."),
    ],
}

CONTENT["peer-pressure.html"] = {
    "tag": "Common Concern", "intro": "Understanding Peer Pressure",
    "points": [
        ("Types of Peer Pressure", "Peer pressure can be direct (explicit requests) or indirect (perceived social norms), positive or negative."),
        ("Vulnerability Period", "Early to mid-adolescence (ages 12-16) is when peer influence is strongest and identity formation is most active."),
        ("Digital Dimension", "Social media amplifies peer pressure through curated images, FOMO, and online social comparison."),
        ("Building Resistance", "Teens can learn assertiveness skills, critical thinking, and strategies to maintain personal values while fitting in."),
    ],
    "path_title": "Peer Pressure Support at eMbrace",
    "path_text": "Our counsellors help teens develop assertiveness, decision-making skills, and confidence to navigate peer influences positively.",
    "faqs": [
        ("How can I tell if my teen is experiencing negative peer pressure?", "Watch for sudden changes in behaviour, language, clothing, interests, or reluctance to introduce friends to family."),
        ("Can peer pressure be positive?", "Yes — positive peer groups can encourage healthy habits, academic effort, and prosocial behaviour."),
    ],
}


CONTENT["digital-addiction.html"] = {
    "tag": "Digital Wellbeing", "intro": "Understanding Digital Addiction",
    "points": [
        ("Screen Time Reality", "Indian teens average 4-6 hours of recreational screen time daily, with many experiencing difficulty disconnecting."),
        ("Brain Chemistry", "Digital platforms are designed to trigger dopamine release, creating reward cycles similar to behavioural addictions."),
        ("Warning Signs", "Loss of control over usage, withdrawal symptoms, neglect of responsibilities, and continued use despite negative consequences."),
        ("Functional Impact", "Digital addiction affects sleep quality, academic performance, physical activity, and real-world social connections."),
    ],
    "path_title": "Digital Addiction Support at eMbrace",
    "path_text": "We offer comprehensive assessment and intervention for digital addiction including digital detox planning, behavioural strategies, family agreements, and alternative activity development.",
    "faqs": [
        ("Is digital addiction a recognised condition?", "Internet Gaming Disorder is recognised in the DSM-5 as a condition requiring further study, and problematic digital use is increasingly treated clinically."),
        ("How do I know if my teen has digital addiction vs normal use?", "When usage is uncontrollable, causes significant impairment, and withdrawal leads to distress — it goes beyond typical use."),
    ],
}

CONTENT["gaming-addiction.html"] = {
    "tag": "Digital Wellbeing", "intro": "Understanding Gaming Addiction",
    "points": [
        ("Gaming Disorder", "WHO recognises Gaming Disorder as a pattern of gaming behaviour characterised by impaired control and increasing priority over other activities."),
        ("Attractive Design", "Games use variable rewards, progression systems, and social features that make them particularly engaging for developing brains."),
        ("Escapism Function", "Many teens use gaming as an escape from academic stress, social anxiety, or family difficulties."),
        ("Physical Health Impact", "Excessive gaming affects posture, eye health, sleep patterns, physical fitness, and can contribute to obesity."),
    ],
    "path_title": "Gaming Addiction Support at eMbrace",
    "path_text": "Our therapists help teens develop healthy gaming habits through motivational interviewing, behavioural contracts, alternative activity planning, and addressing underlying emotional needs.",
    "faqs": [
        ("How much gaming is too much?", "When gaming interferes with school, sleep, physical health, or real-world relationships for more than 3 months, it may be problematic."),
        ("Can gaming ever be positive?", "Yes — moderate gaming can improve problem-solving, hand-eye coordination, and social connection when balanced with other activities."),
    ],
}

CONTENT["career-stress.html"] = {
    "tag": "Academic & Career", "intro": "Understanding Career Stress in Teens",
    "points": [
        ("Pressure to Choose", "Indian teens face intense pressure to choose career paths early, often with limited exposure to available options."),
        ("Parental Expectations", "Conflicts between personal interests and family expectations create significant distress for many adolescents."),
        ("Comparison Culture", "Peer achievements, rank lists, and competitive exam results fuel unhealthy comparison and self-doubt."),
        ("Identity Connection", "Career decisions feel identity-defining for teens, making the stakes feel extraordinarily high."),
    ],
    "path_title": "Career Stress Support at eMbrace",
    "path_text": "We provide career counselling that helps teens explore interests, strengths, and values while managing family expectations and making informed decisions.",
    "faqs": [
        ("At what age should career counselling start?", "Career exploration can begin as early as class 9, with more focused guidance during classes 11-12."),
        ("How can parents support without adding pressure?", "Listen more than advise, expose teens to diverse options, and separate your aspirations from their choices."),
    ],
}

CONTENT["exam-anxiety.html"] = {
    "tag": "Academic & Career", "intro": "Understanding Exam Anxiety",
    "points": [
        ("Distinct from Poor Preparation", "Exam anxiety is a performance-based condition where intense fear interferes with recalling and applying learned material."),
        ("Physical Symptoms", "Racing heart, sweating, nausea, blanking out, shaking, and difficulty breathing during exams are common."),
        ("Cognitive Impact", "Negative self-talk, catastrophic thinking, and comparison with peers worsen anxiety and impair performance."),
        ("Indian Context", "High-stakes board exams and competitive entrance tests create unique pressure for Indian students."),
    ],
    "path_title": "Exam Anxiety Support at eMbrace",
    "path_text": "We help students manage exam anxiety through CBT, relaxation techniques, effective study strategies, and building a healthy perspective on academic performance.",
    "faqs": [
        ("Is exam anxiety a recognised condition?", "While not a separate diagnosis, exam anxiety can meet criteria for generalised anxiety disorder, social anxiety, or performance anxiety."),
        ("Can exam anxiety affect good students?", "Yes — high-achieving students are often most affected because of perfectionism and pressure to maintain performance."),
    ],
}

CONTENT["college-transition-support.html"] = {
    "tag": "Academic & Career", "intro": "Understanding College Transition Support",
    "points": [
        ("Major Life Transition", "Moving from school to college involves changes in environment, routine, social network, and level of independence."),
        ("Common Challenges", "Homesickness, academic adjustment, social integration, time management, and identity exploration are typical transition issues."),
        ("Mental Health Risk", "The college transition period is a peak time for onset of mental health conditions including depression and anxiety."),
        ("Preparation Helps", "Pre-transition counselling and support significantly improves adjustment outcomes."),
    ],
    "path_title": "College Transition Support at eMbrace",
    "path_text": "We provide pre-college counselling, transition planning, and ongoing support to help students navigate the move to college life successfully.",
    "faqs": [
        ("When should transition support begin?", "Ideally 3-6 months before the move to college, continuing through the first semester of adjustment."),
        ("What topics does transition counselling cover?", "Practical skills (budgeting, cooking, laundry), social strategies, academic expectations, emotional preparation, and crisis planning."),
    ],
}

CONTENT["self-esteem-for-teens.html"] = {
    "tag": "Emotional Wellbeing", "intro": "Understanding Self-Esteem in Teens",
    "points": [
        ("Developmental Stage", "Adolescence is a critical period for self-esteem development as teens form their identity and compare themselves to others."),
        ("Social Media Impact", "Curated social media feeds create unrealistic standards and constant social comparison that damages self-worth."),
        ("Roots of Low Self-Esteem", "Academic pressure, appearance concerns, peer rejection, family dynamics, and past failures contribute to poor self-esteem."),
        ("Self-Esteem vs Self-Compassion", "Rather than pursuing high self-esteem, we teach teens self-compassion — accepting themselves while striving for growth."),
    ],
    "path_title": "Self-Esteem Support for Teens at eMbrace",
    "path_text": "Our counsellors help teens build authentic self-worth through strengths-based work, cognitive restructuring, assertiveness training, and self-compassion practices.",
    "faqs": [
        ("Is low self-esteem a mental health condition?", "Low self-esteem itself isn't a diagnosis but is a core feature of depression, anxiety, and eating disorders."),
        ("Can self-esteem improve with therapy?", "Yes — with consistent therapeutic support, teens can develop more realistic, stable, and positive self-perception."),
    ],
}

CONTENT["emotional-regulation-for-teens.html"] = {
    "tag": "Emotional Wellbeing", "intro": "Understanding Emotional Regulation for Teens",
    "points": [
        ("Developing Brain", "The prefrontal cortex — responsible for emotional regulation — is still developing throughout adolescence."),
        ("Emotional Intensity", "Teens experience emotions more intensely than adults due to heightened amygdala reactivity and hormonal changes."),
        ("Regulation Skills", "Identifying emotions, tolerating distress, and choosing responses rather than reacting impulsively are learned skills."),
        ("Long-Term Benefits", "Strong emotional regulation skills predict better mental health, relationship quality, and academic success."),
    ],
    "path_title": "Emotional Regulation Support at eMbrace",
    "path_text": "We teach teens concrete emotional regulation skills including emotion identification, distress tolerance, mindfulness, and cognitive reappraisal.",
    "faqs": [
        ("Is emotional dysregulation normal in teens?", "Some volatility is normal, but persistent difficulty managing emotions that causes impairment requires support."),
        ("What causes poor emotional regulation?", "Genetics, trauma, ADHD, anxiety, autism, and insufficient modelling of regulation skills at home can all contribute."),
    ],
}

CONTENT["anger-management-for-teens.html"] = {
    "tag": "Emotional Wellbeing", "intro": "Understanding Anger Management for Teens",
    "points": [
        ("Anger as Secondary Emotion", "Anger often masks underlying feelings of hurt, fear, shame, frustration, or feeling misunderstood."),
        ("Triggers for Teens", "Perceived injustice, criticism, peer rejection, feeling controlled, and academic frustration commonly trigger anger."),
        ("Consequences", "Uncontrolled anger damages relationships, leads to disciplinary issues, and can escalate to aggression."),
        ("Manageable With Support", "Teens can learn to recognise anger cues, pause before reacting, and express anger constructively."),
    ],
    "path_title": "Anger Management for Teens at eMbrace",
    "path_text": "Our therapists help teens understand their anger patterns, develop self-calming strategies, improve communication, and find healthier ways to express frustration.",
    "faqs": [
        ("Is teen anger a sign of a deeper problem?", "Yes — persistent anger may indicate depression, anxiety, trauma, ADHD, or family conflict requiring comprehensive assessment."),
        ("Can anger management really help?", "Yes — skills-based anger management programs have strong evidence for reducing aggressive behaviour and improving relationships."),
    ],
}

CONTENT["teen-relationship-issues.html"] = {
    "tag": "Emotional Wellbeing", "intro": "Understanding Teen Relationship Issues",
    "points": [
        ("First Relationships", "Romantic relationships in adolescence are important for identity formation and learning interpersonal skills."),
        ("Common Challenges", "Jealousy, communication problems, breakups, peer influence, and balancing relationship with other priorities are typical issues."),
        ("Digital Dynamics", "Social media and texting create new relationship challenges including digital jealousy, miscommunication, and pressure."),
        ("Breakup Impact", "Teen breakups can trigger depression, anxiety, and self-esteem issues, requiring sensitive support."),
    ],
    "path_title": "Teen Relationship Support at eMbrace",
    "path_text": "We provide a safe space for teens to explore relationship concerns, develop healthy communication skills, and navigate romantic experiences with guidance.",
    "faqs": [
        ("At what age do teens start dating?", "In the Indian context, romantic interest typically begins around ages 13-15, with dating becoming more common in late adolescence."),
        ("How can parents support teen relationships?", "Open non-judgmental communication, clear boundaries, and respect for privacy while maintaining safety awareness."),
    ],
}

CONTENT["adult-counselling.html"] = {
    "tag": "Resource Hub", "intro": "Core Aspects of Adult Mental Health",
    "points": [
        ("Lifelong Growth", "Mental health care is valuable at every life stage, supporting adaptation, resilience, and wellbeing throughout adulthood."),
        ("Multiple Life Domains", "Adult mental health concerns span relationships, career, family, identity, and health — requiring holistic approaches."),
        ("Evidence-Based Care", "Adult therapy uses well-researched modalities including CBT, psychodynamic therapy, ACT, and mindfulness-based approaches."),
        ("Prevention Matters", "Regular mental health check-ins and early intervention prevent escalation of concerns into crises."),
    ],
    "path_title": "Adult Counselling at eMbrace",
    "path_text": "We provide comprehensive adult counselling services addressing anxiety, depression, relationships, life transitions, stress, and personal growth — delivered by experienced therapists.",
    "faqs": [
        ("What can I expect in my first counselling session?", "An initial assessment exploring your concerns, history, goals, and preferences to develop a personalised treatment plan."),
        ("How long does adult counselling typically last?", "Duration varies from brief (6-12 sessions) for focused issues to longer-term for complex or longstanding concerns."),
    ],
}

CONTENT["adult-anxiety.html"] = {
    "tag": "Common Concern", "intro": "Understanding Adult Anxiety",
    "points": [
        ("Prevalence", "Anxiety disorders affect approximately 1 in 5 adults annually, making them the most common mental health condition."),
        ("Forms of Anxiety", "Generalised anxiety, panic disorder, social anxiety, health anxiety, and specific phobias each have distinct features."),
        ("Physical Toll", "Chronic anxiety affects cardiovascular health, digestion, immune function, and sleep quality."),
        ("Highly Treatable", "CBT, medication, and mindfulness are effective treatments, with most adults experiencing significant improvement."),
    ],
    "path_title": "Adult Anxiety Treatment at eMbrace",
    "path_text": "Our therapists provide evidence-based anxiety treatment including CBT, exposure therapy, relaxation training, and mindfulness approaches.",
    "faqs": [
        ("Can anxiety go away without treatment?", "Some anxiety may fluctuate, but chronic anxiety disorders typically persist or worsen without intervention."),
        ("What is the most effective treatment for adult anxiety?", "CBT is the gold-standard psychological treatment, often combined with medication for moderate to severe cases."),
    ],
}

CONTENT["adult-depression.html"] = {
    "tag": "Common Concern", "intro": "Understanding Adult Depression",
    "points": [
        ("Beyond Sadness", "Depression involves persistent low mood, loss of interest, changes in sleep/appetite, low energy, poor concentration, and sometimes thoughts of death."),
        ("Global Impact", "Depression is the leading cause of disability worldwide and affects all aspects of life functioning."),
        ("Types of Depression", "Major depressive disorder, persistent depressive disorder, seasonal affective disorder, and postpartum depression vary in duration and pattern."),
        ("Recovery is Possible", "With appropriate treatment, 70-80% of adults with depression experience significant improvement."),
    ],
    "path_title": "Adult Depression Treatment at eMbrace",
    "path_text": "We provide comprehensive depression treatment including CBT, interpersonal therapy, behavioural activation, and collaborative care with psychiatrists when medication is needed.",
    "faqs": [
        ("How is depression diagnosed?", "Through clinical interview assessing symptoms, duration, impairment, and ruling out medical causes."),
        ("Is therapy or medication better for depression?", "For mild depression, therapy alone is effective. For moderate to severe, combination treatment is typically recommended."),
    ],
}

CONTENT["stress-management.html"] = {
    "tag": "Common Concern", "intro": "Understanding Stress Management",
    "points": [
        ("Stress Response", "The fight-or-flight response is designed for acute threats, but modern life keeps it chronically activated."),
        ("Sources of Adult Stress", "Work demands, financial pressure, relationship challenges, health concerns, and caregiving responsibilities are common stressors."),
        ("Health Consequences", "Chronic stress contributes to hypertension, heart disease, diabetes, depression, and accelerated ageing."),
        ("Manageable With Skills", "Stress management skills including relaxation, time management, cognitive reframing, and lifestyle changes are highly effective."),
    ],
    "path_title": "Stress Management at eMbrace",
    "path_text": "We teach practical stress management techniques tailored to your lifestyle, including relaxation skills, boundary-setting, prioritisation, and resilience building.",
    "faqs": [
        ("What is the difference between stress and burnout?", "Stress involves excessive demands, while burnout is characterised by exhaustion, cynicism, and reduced effectiveness."),
        ("Can stress management really make a difference?", "Yes — research shows stress management programs significantly reduce symptoms and improve quality of life."),
    ],
}

CONTENT["life-transitions.html"] = {
    "tag": "Common Concern", "intro": "Understanding Life Transitions",
    "points": [
        ("Types of Transitions", "Career changes, relocation, marriage, divorce, parenthood, retirement, and health changes are major life transitions."),
        ("Transition Stress", "Even positive transitions involve loss of familiar routines, uncertainty, and adaptation demands."),
        ("Opportunity for Growth", "Transitions are periods of heightened plasticity when positive change is most possible."),
        ("Support is Valuable", "Counselling during transitions reduces distress and improves adaptation outcomes."),
    ],
    "path_title": "Life Transition Support at eMbrace",
    "path_text": "We provide supportive counselling during life transitions, helping you navigate change with clarity, resilience, and self-compassion.",
    "faqs": [
        ("When should I seek counselling for a life transition?", "When you feel stuck, overwhelmed, or unable to adapt despite reasonable efforts, counselling can help."),
        ("How long does transition counselling last?", "Typically 6-12 sessions focused on processing the change, developing coping strategies, and planning forward."),
    ],
}

CONTENT["burnout-counselling.html"] = {
    "tag": "Workplace & Lifestyle", "intro": "Understanding Burnout",
    "points": [
        ("Burnout Defined", "Burnout is a state of emotional, physical, and mental exhaustion caused by excessive and prolonged stress."),
        ("Three Dimensions", "Exhaustion (energy depletion), cynicism (depersonalisation), and reduced professional efficacy characterise burnout."),
        ("Risk Factors", "Perfectionism, poor boundaries, unsupportive workplace, lack of control, and inadequate self-care increase burnout risk."),
        ("Recovery Path", "Overcoming burnout requires systemic changes, not just individual coping — including rest, boundary-setting, and often workplace adjustments."),
    ],
    "path_title": "Burnout Recovery at eMbrace",
    "path_text": "We help professionals recover from burnout through individual therapy, lifestyle changes, boundary-setting, and workplace advocacy.",
    "faqs": [
        ("How is burnout different from depression?", "Burnout is work/situation-specific, while depression affects all areas of life. However, burnout can lead to depression if untreated."),
        ("Can burnout be cured?", "Yes — with appropriate rest, support, lifestyle changes, and often therapeutic intervention, full recovery is possible."),
    ],
}


CONTENT["premarital-counselling.html"] = {
    "tag": "Relationships", "intro": "Understanding Premarital Counselling",
    "points": [
        ("Purpose", "Premarital counselling helps couples build a strong foundation for marriage by addressing key topics before they become problems."),
        ("Key Topics", "Communication styles, conflict resolution, finances, family expectations, intimacy, values, and life goals are core discussion areas."),
        ("Benefits", "Research shows premarital counselling reduces divorce rates and increases marital satisfaction."),
        ("Not Just for Problems", "Premarital counselling strengthens already healthy relationships by deepening understanding and alignment."),
    ],
    "path_title": "Premarital Counselling at eMbrace",
    "path_text": "Our relationship specialists provide structured premarital counselling programs using evidence-based frameworks to prepare couples for marriage.",
    "faqs": [
        ("When should we start premarital counselling?", "Ideally 3-6 months before the wedding, allowing time to process and implement insights."),
        ("Is premarital counselling only for engaged couples?", "No — seriously dating couples exploring marriage can also benefit from premarital counselling."),
    ],
}

CONTENT["self-esteem-counselling.html"] = {
    "tag": "Common Concern", "intro": "Understanding Self-Esteem Counselling",
    "points": [
        ("Self-Esteem Defined", "Self-esteem is your overall subjective sense of personal worth or value."),
        ("Roots of Low Self-Esteem", "Critical parenting, bullying, trauma, social comparison, perfectionism, and cultural messages contribute to poor self-esteem."),
        ("Life Impact", "Low self-esteem affects career progression, relationship quality, mental health, and willingness to pursue opportunities."),
        ("Change is Possible", "With consistent therapeutic work, adults can develop stable, realistic self-worth independent of external validation."),
    ],
    "path_title": "Self-Esteem Counselling at eMbrace",
    "path_text": "We help adults build authentic self-esteem through cognitive restructuring, strengths identification, assertiveness training, and self-compassion practices.",
    "faqs": [
        ("How long does it take to improve self-esteem?", "Significant improvement typically takes 3-6 months of consistent therapeutic work, with ongoing growth thereafter."),
        ("Can self-esteem be too high?", "What appears as high self-esteem is sometimes narcissism. Healthy self-esteem is realistic, stable, and doesn't require putting others down."),
    ],
}

CONTENT["grief-counselling.html"] = {
    "tag": "Therapy & Support", "intro": "Understanding Grief Counselling",
    "points": [
        ("Grief is Personal", "Grief is a natural response to loss, but its expression, duration, and intensity vary widely between individuals and cultures."),
        ("Many Types of Loss", "Death, divorce, job loss, health loss, miscarriage, and estrangement all trigger grief responses."),
        ("Complicated Grief", "When grief remains intense and impairing beyond 12 months, it may be complicated grief requiring specialised support."),
        ("Support is Helpful", "Grief counselling provides a safe space to process loss, find meaning, and adapt to a changed life."),
    ],
    "path_title": "Grief Counselling at eMbrace",
    "path_text": "Our compassionate therapists provide grief counselling supporting adults through the grieving process at their own pace.",
    "faqs": [
        ("How long does grief last?", "There is no set timeline. Grief may come in waves, and triggers can evoke grief years after a loss."),
        ("Is grief counselling only for death of a loved one?", "No — we support grief related to any significant loss including divorce, job loss, miscarriage, and health changes."),
    ],
}

CONTENT["trauma-therapy.html"] = {
    "tag": "Therapy & Support", "intro": "Understanding Trauma Therapy",
    "points": [
        ("Trauma Defined", "Trauma results from events that overwhelm your capacity to cope, leaving you feeling helpless and unsafe."),
        ("Types of Trauma", "Single-incident trauma (accident, assault), developmental trauma (childhood abuse/neglect), and complex trauma (prolonged exposure) require different approaches."),
        ("PTSD Symptoms", "Intrusive memories, avoidance, negative mood changes, and hyperarousal characterise post-traumatic stress disorder."),
        ("Effective Treatments", "Trauma-focused CBT, EMDR, and somatic approaches have strong evidence for treating PTSD."),
    ],
    "path_title": "Trauma Therapy at eMbrace",
    "path_text": "Our trauma-trained therapists provide evidence-based trauma treatment in a safe, supportive environment using approaches like TF-CBT, EMDR, and somatic experiencing.",
    "faqs": [
        ("Do I need to talk about the trauma in detail?", "No — we work at your pace and use approaches that don't require detailed retelling if you prefer not to."),
        ("How long does trauma therapy take?", "For single-incident trauma, 8-12 sessions may suffice. Complex trauma typically requires longer-term work."),
    ],
}

CONTENT["mindfulness-therapy.html"] = {
    "tag": "Therapy & Support", "intro": "Understanding Mindfulness Therapy",
    "points": [
        ("Mindfulness Defined", "Mindfulness is paying attention to the present moment intentionally and without judgment."),
        ("Evidence Base", "Mindfulness-based interventions are effective for anxiety, depression, stress, chronic pain, and preventing relapse."),
        ("Key Approaches", "MBCT (Mindfulness-Based Cognitive Therapy) and MBSR (Mindfulness-Based Stress Reduction) are structured programs."),
        ("Daily Practice", "Mindfulness is a skill developed through regular practice, not just a technique applied during sessions."),
    ],
    "path_title": "Mindfulness Therapy at eMbrace",
    "path_text": "We offer mindfulness-based therapy including MBCT and MBSR, as well as integrating mindfulness skills into individual therapy.",
    "faqs": [
        ("Do I need to meditate to benefit from mindfulness therapy?", "Formal meditation is one path, but we also teach informal mindfulness practices that fit into daily life."),
        ("How is mindfulness different from relaxation?", "Relaxation aims to reduce arousal, while mindfulness aims to change your relationship with experience — including difficult experiences."),
    ],
}

CONTENT["relationship-counselling.html"] = {
    "tag": "Relationships", "intro": "Understanding Relationship Counselling",
    "points": [
        ("For All Relationships", "Relationship counselling addresses romantic partnerships, friendships, family relationships, and professional relationships."),
        ("Common Issues", "Communication problems, trust issues, conflict patterns, intimacy concerns, and life transitions strain relationships."),
        ("Skills Focus", "Active listening, assertive communication, conflict resolution, and empathy building are core skills."),
        ("Individual + Joint", "Effective relationship counselling typically involves both individual and joint sessions."),
    ],
    "path_title": "Relationship Counselling at eMbrace",
    "path_text": "Our relationship therapists help couples and individuals improve communication, resolve conflicts, and build stronger, more satisfying relationships.",
    "faqs": [
        ("When should we seek relationship counselling?", "Don't wait for a crisis — early intervention when communication breaks down is most effective."),
        ("Will counselling help if only one partner wants to come?", "Yes — individual work on relationship patterns can create positive changes even when only one partner participates."),
    ],
}

CONTENT["couples-therapy.html"] = {
    "tag": "Relationships", "intro": "Understanding Couples Therapy",
    "points": [
        ("Systemic Approach", "Couples therapy views the relationship — not the individual — as the client, focusing on patterns between partners."),
        ("Evidence-Based Models", "Gottman Method, Emotionally Focused Therapy (EFT), and Imago therapy are evidence-based couples therapy approaches."),
        ("Improving Communication", "Most couples issues stem from communication breakdowns. Learning to communicate effectively transforms relationships."),
        ("Rebuilding Trust", "After infidelity or betrayal, structured approaches help couples rebuild trust and decide whether to continue together."),
    ],
    "path_title": "Couples Therapy at eMbrace",
    "path_text": "Our trained couples therapists provide evidence-based couples therapy using approaches like Gottman Method and EFT to strengthen your partnership.",
    "faqs": [
        ("How long does couples therapy take?", "A typical course is 12-20 sessions, though some couples see improvement in 6-8 sessions focused on specific issues."),
        ("What if my partner doesn't want to come?", "An initial session with just you can help, and we may suggest your partner join for a single session to understand the process."),
    ],
}

CONTENT["marital-counselling.html"] = {
    "tag": "Relationships", "intro": "Understanding Marital Counselling",
    "points": [
        ("Marriage as System", "Every marriage develops patterns of interaction, communication, and conflict resolution that can be identified and improved."),
        ("Common Challenges", "Financial stress, parenting differences, in-law relationships, intimacy issues, and life stage transitions challenge marriages."),
        ("Investment in Health", "Regular 'check-ups' for your marriage — even when things are going well — strengthen the relationship."),
        ("Crisis Support", "Infidelity, separation threats, and major disagreements benefit from structured therapeutic intervention."),
    ],
    "path_title": "Marital Counselling at eMbrace",
    "path_text": "We provide marital counselling that respects the unique cultural context of Indian marriages while using evidence-based therapeutic approaches.",
    "faqs": [
        ("Is marital counselling confidential?", "Yes — everything shared in sessions is confidential within legal and ethical bounds, including safety concerns."),
        ("Can marital counselling work if one spouse is not committed?", "Progress can still be made, though willingness from both partners significantly improves outcomes."),
    ],
}

CONTENT["adult-autism-support.html"] = {
    "tag": "Neurodivergent Adults", "intro": "Understanding Adult Autism Support",
    "points": [
        ("Late Diagnosis", "Many autistic adults were not diagnosed in childhood, especially those who learned to mask their traits."),
        ("Unique Strengths", "Autistic adults often bring attention to detail, pattern recognition, honesty, deep focus, and unique perspectives."),
        ("Common Challenges", "Sensory sensitivities, social communication differences, executive function difficulties, and burnout are common."),
        ("Support Goals", "Support focuses on self-understanding, advocacy, accommodation, and building a life aligned with autistic identity."),
    ],
    "path_title": "Adult Autism Support at eMbrace",
    "path_text": "We provide adult autism assessment, post-diagnostic support, and tailored therapy that respects neurodiversity and builds on individual strengths.",
    "faqs": [
        ("Can adults be diagnosed with autism?", "Yes — many adults receive a first autism diagnosis later in life, which often brings relief and self-understanding."),
        ("What support do autistic adults need?", "Support varies but may include executive function coaching, social navigation skills, sensory management, and mental health support."),
    ],
}

CONTENT["adult-adhd-support.html"] = {
    "tag": "Neurodivergent Adults", "intro": "Understanding Adult ADHD Support",
    "points": [
        ("Adult ADHD", "ADHD persists into adulthood for most individuals, though symptoms may present differently than in childhood."),
        ("Executive Function", "Time management, organisation, prioritisation, and emotional regulation are common challenges for adults with ADHD."),
        ("Career Impact", "Adults with ADHD may struggle with sustained focus, deadlines, meetings, and administrative tasks in the workplace."),
        ("Strengths", "Creativity, adaptability, hyperfocus, energy, and innovative thinking are ADHD strengths."),
    ],
    "path_title": "Adult ADHD Support at eMbrace",
    "path_text": "We provide comprehensive adult ADHD services including assessment, coaching, CBT, and workplace accommodations guidance.",
    "faqs": [
        ("Can adult ADHD be treated without medication?", "Yes — CBT, coaching, lifestyle changes, and organisational strategies are effective for managing ADHD symptoms."),
        ("How does ADHD affect relationships?", "Forgetfulness, time blindness, emotional reactivity, and difficulty with household tasks can strain relationships."),
    ],
}

CONTENT["executive-function-coaching-for-adults.html"] = {
    "tag": "Neurodivergent Adults", "intro": "Understanding Executive Function Coaching for Adults",
    "points": [
        ("Executive Functions", "These are cognitive processes including planning, organisation, time management, working memory, and self-control."),
        ("Common Difficulties", "Adults with ADHD, autism, anxiety, or brain injuries often struggle with executive function in daily life."),
        ("Coaching Approach", "Coaching is practical, goal-oriented, and builds systems and strategies rather than just discussing problems."),
        ("Life Impact", "Improved executive function enhances career performance, financial management, household organisation, and personal wellbeing."),
    ],
    "path_title": "Executive Function Coaching at eMbrace",
    "path_text": "We provide one-on-one executive function coaching to help adults develop personalised systems for time management, organisation, and productivity.",
    "faqs": [
        ("How is coaching different from therapy?", "Coaching is action-oriented and focuses on building practical skills and systems, while therapy explores deeper emotional patterns."),
        ("Who needs executive function coaching?", "Anyone who consistently struggles with planning, prioritisation, deadlines, or organisation despite wanting to improve."),
    ],
}

CONTENT["parents.html"] = {
    "tag": "Resource Hub", "intro": "Core Aspects of Parenting Support",
    "points": [
        ("Parenting is Hard", "All parents face challenges. Seeking support is a sign of strength, not failure."),
        ("Every Child is Unique", "Effective parenting strategies are tailored to each child's temperament, needs, and developmental stage."),
        ("Parent Wellbeing Matters", "Supporting your child starts with supporting yourself — parent mental health directly affects children."),
        ("Evidence-Based Guidance", "Our recommendations are grounded in developmental psychology and evidence-based parenting research."),
    ],
    "path_title": "Parent Support at eMbrace",
    "path_text": "We provide comprehensive parent support including counselling, coaching, guidance programs, and support groups for parents at every stage.",
    "faqs": [
        ("What parenting topics does eMbrace cover?", "We cover behaviour management, school advocacy, emotional regulation support, sibling dynamics, IEP guidance, and parent self-care."),
        ("Do you offer support for parents of neurodivergent children?", "Yes — we have specialised programs for parents of children with autism, ADHD, learning disabilities, and other neurodivergences."),
    ],
}

CONTENT["parent-counselling.html"] = {
    "tag": "Parenting Challenges", "intro": "Understanding Parent Counselling",
    "points": [
        ("Unique Pressures", "Modern parents face unprecedented demands including work-life balance, academic competition, and digital parenting challenges."),
        ("Common Issues", "Parenting stress, guilt, conflict with children, co-parenting differences, and balancing multiple children's needs are frequent concerns."),
        ("Safe Space", "Parent counselling provides a non-judgmental space to explore parenting challenges without fear of being labelled a bad parent."),
        ("Skills Building", "Parents learn practical strategies for communication, boundary-setting, discipline, and emotional connection."),
    ],
    "path_title": "Parent Counselling at eMbrace",
    "path_text": "Our parent counsellors provide individual and joint counselling to help parents navigate challenges with confidence and compassion.",
    "faqs": [
        ("How is parent counselling different from family therapy?", "Parent counselling focuses specifically on the parent's experience and parenting skills, while family therapy involves the whole family system."),
        ("Do I need to bring my child to sessions?", "Usually not — parent counselling focuses on you as a parent, though we may suggest occasional joint sessions."),
    ],
}

CONTENT["parent-burnout.html"] = {
    "tag": "Parenting Challenges", "intro": "Understanding Parent Burnout",
    "points": [
        ("Parent Burnout", "Parent burnout is a state of physical, emotional, and mental exhaustion related to the demands of parenting."),
        ("Signs", "Overwhelming fatigue, emotional distancing from children, loss of parental enjoyment, and feeling ineffective as a parent."),
        ("Risk Factors", "Lack of support, perfectionism, work demands, special needs children, and single parenting increase burnout risk."),
        ("Not Your Fault", "Parent burnout is a systemic issue reflecting inadequate support structures, not individual failure."),
    ],
    "path_title": "Parent Burnout Support at eMbrace",
    "path_text": "We help parents recover from burnout through individual therapy, stress management, setting realistic expectations, and building support networks.",
    "faqs": [
        ("How is parent burnout different from depression?", "Burnout is specific to the parenting role, while depression affects all areas of life. However, burnout can lead to depression."),
        ("Can parent burnout affect children?", "Yes — burnt-out parents may be less patient, responsive, and emotionally available, affecting children's wellbeing."),
    ],
}

CONTENT["caregiver-support.html"] = {
    "tag": "Parenting Challenges", "intro": "Understanding Caregiver Support",
    "points": [
        ("Caregiver Role", "Caregiving for a child with special needs is a demanding role that requires significant physical, emotional, and practical resources."),
        ("Hidden Toll", "Caregivers often neglect their own needs, leading to health problems, social isolation, and mental health difficulties."),
        ("Respite Importance", "Regular breaks from caregiving are essential for sustainability and prevent caregiver burnout."),
        ("Community Matters", "Connecting with other caregivers reduces isolation and provides practical and emotional support."),
    ],
    "path_title": "Caregiver Support at eMbrace",
    "path_text": "We provide caregiver support including individual counselling, respite planning, support group referrals, and practical caregiving strategies.",
    "faqs": [
        ("What support is available for new caregivers?", "We help new caregivers navigate the diagnosis, build a support team, and develop sustainable care routines."),
        ("Is caregiver support only for parents?", "We support all caregivers including parents, grandparents, and other family members providing care."),
    ],
}

CONTENT["positive-parenting.html"] = {
    "tag": "Parenting Challenges", "intro": "Understanding Positive Parenting",
    "points": [
        ("Core Principles", "Positive parenting emphasises respect, empathy, warmth, and guidance rather than punishment and control."),
        ("Connection First", "A strong parent-child relationship is the foundation for effective discipline and cooperation."),
        ("Natural Consequences", "Rather than punishment, positive parenting uses logical consequences, problem-solving, and teaching moments."),
        ("Adaptable Approach", "Positive parenting can be adapted for children of all temperaments and neurotypes, including neurodivergent children."),
    ],
    "path_title": "Positive Parenting at eMbrace",
    "path_text": "We teach positive parenting strategies that build connection, encourage cooperation, and develop your child's emotional and social skills.",
    "faqs": [
        ("Does positive parenting mean no discipline?", "No — positive parenting has clear boundaries and expectations, but enforces them through teaching rather than punishment."),
        ("Is positive parenting effective for strong-willed children?", "Yes — positive parenting is especially effective for strong-willed children as it reduces power struggles while maintaining boundaries."),
    ],
}

CONTENT["new-parent-support.html"] = {
    "tag": "Parenting Challenges", "intro": "Understanding New Parent Support",
    "points": [
        ("Major Transition", "Becoming a parent involves profound changes in identity, relationship, routine, and priorities."),
        ("Common Challenges", "Sleep deprivation, feeding difficulties, postpartum mood changes, marital strain, and conflicting advice are typical concerns."),
        ("Postpartum Mental Health", "Baby blues, postpartum depression, anxiety, and in rare cases psychosis require awareness and timely support."),
        ("Support is Essential", "New parents benefit greatly from practical help, emotional support, and normalising the challenges."),
    ],
    "path_title": "New Parent Support at eMbrace",
    "path_text": "We support new parents through pregnancy, birth, and the early parenting years with counselling, parent coaching, and emotional support.",
    "faqs": [
        ("When should a new parent seek counselling?", "If you feel persistently sad, anxious, overwhelmed, or disconnected from your baby for more than 2 weeks."),
        ("Can fathers get postpartum depression?", "Yes — about 10% of fathers experience postpartum depression, often manifesting as irritability and withdrawal."),
    ],
}

CONTENT["parent-support-groups.html"] = {
    "tag": "Parenting Challenges", "intro": "Understanding Parent Support Groups",
    "points": [
        ("Shared Experience", "Support groups connect parents facing similar challenges, reducing isolation and normalising experiences."),
        ("Practical Wisdom", "Parents learn from each other's real-world strategies and resources that professionals may not know."),
        ("Emotional Support", "Being understood by others who truly 'get it' is deeply validating and healing."),
        ("Complementing Therapy", "Support groups work alongside individual therapy, offering peer support while therapy addresses deeper issues."),
    ],
    "path_title": "Parent Support Groups at eMbrace",
    "path_text": "We facilitate parent support groups for various needs including autism parenting, ADHD parenting, special needs caregiving, and general parenting.",
    "faqs": [
        ("Are support groups confidential?", "Yes — all groups follow confidentiality guidelines to create a safe sharing environment."),
        ("Do I need to speak in the group?", "No — you can listen and benefit without sharing until you are comfortable."),
    ],
}


CONTENT["raising-a-child-with-autism.html"] = {
    "tag": "Neurodivergent Children", "intro": "Raising a Child with Autism",
    "points": [
        ("Understanding Autism", "Autism is a neurodevelopmental condition characterised by differences in social communication, sensory processing, and behavioural patterns."),
        ("Strengths-Based View", "Autistic children have unique strengths including attention to detail, honesty, deep interests, pattern recognition, and visual thinking."),
        ("Support Needs", "Support varies widely — some children need speech therapy, OT, and social support while others need primarily environmental accommodations."),
        ("Parent Role", "Parents are the most important advocates and supporters — understanding your child's needs is the foundation of effective support."),
    ],
    "path_title": "Autism Parenting Support at eMbrace",
    "path_text": "We provide comprehensive support for parents of autistic children including guidance programs, behaviour support, and parent counselling.",
    "faqs": [
        ("How do I get an autism diagnosis for my child?", "We offer comprehensive autism assessments using ADOS-2, ADI-R, and developmental evaluations."),
        ("What therapies help autistic children?", "Speech therapy, occupational therapy, social skills training, and behavioural support are commonly beneficial."),
    ],
}

CONTENT["raising-a-child-with-adhd.html"] = {
    "tag": "Neurodivergent Children", "intro": "Raising a Child with ADHD",
    "points": [
        ("Understanding ADHD", "ADHD affects attention, impulse control, and activity regulation. It's a brain-based condition, not a discipline problem."),
        ("Common Challenges", "Homework battles, forgetfulness, emotional intensity, organisation difficulties, and peer relationship issues are common."),
        ("Effective Strategies", "Structure, visual schedules, clear expectations, positive reinforcement, and regular movement breaks help ADHD children thrive."),
        ("Parent Advocacy", "Parents need to advocate at school for accommodations and help teachers understand ADHD as a disability, not laziness."),
    ],
    "path_title": "ADHD Parenting Support at eMbrace",
    "path_text": "We support parents of ADHD children through parent training, behaviour management strategies, school advocacy, and emotional support.",
    "faqs": [
        ("Should I medicate my child for ADHD?", "This is a personal decision. Medication is one effective tool, and we help families make informed choices."),
        ("Can diet affect ADHD symptoms?", "Some children are sensitive to certain foods, but dietary changes alone are rarely sufficient for managing ADHD."),
    ],
}

CONTENT["siblings-of-neurodivergent-children.html"] = {
    "tag": "Neurodivergent Children", "intro": "Supporting Siblings of Neurodivergent Children",
    "points": [
        ("Unique Challenges", "Siblings may receive less attention, feel pressure to be 'perfect', experience embarrassment, or feel responsible for their sibling."),
        ("Emotional Impact", "Mixed feelings of love, resentment, guilt, protectiveness, and worry are common and normal."),
        ("Need for Support", "Siblings benefit from their own space to express feelings, receive individual attention, and connect with peers in similar situations."),
        ("Building Understanding", "Age-appropriate education about their sibling's condition reduces confusion and builds empathy."),
    ],
    "path_title": "Sibling Support at eMbrace",
    "path_text": "We offer sibling support including individual counselling, sibling workshops, and family sessions to address sibling needs.",
    "faqs": [
        ("What age is appropriate to explain autism/ADHD to siblings?", "From age 4-5, simple explanations can begin, with more detailed conversations as the child matures."),
        ("How can I ensure my neurotypical child doesn't feel neglected?", "Set aside dedicated one-on-one time, acknowledge their feelings, and involve them in family decisions."),
    ],
}

CONTENT["managing-meltdowns.html"] = {
    "tag": "Neurodivergent Children", "intro": "Managing Meltdowns",
    "points": [
        ("Meltdown vs Tantrum", "Meltdowns are neurological responses to overwhelm, not behavioural choices. They require different responses than tantrums."),
        ("Triggers", "Sensory overload, communication breakdown, routine changes, hunger, fatigue, and emotional overwhelm trigger meltdowns."),
        ("During a Meltdown", "Stay calm, reduce demands, minimise sensory input, ensure safety, and wait without trying to reason."),
        ("After a Meltdown", "Once regulated, reconnect gently. This is not a time for lectures or consequences."),
    ],
    "path_title": "Meltdown Management Support at eMbrace",
    "path_text": "We teach parents to understand meltdowns, identify triggers, respond effectively during episodes, and develop prevention strategies.",
    "faqs": [
        ("How do I know if it's a meltdown or a tantrum?", "Tantrums are goal-oriented and stop when the goal is met. Meltdowns are involuntary stress responses that must run their course."),
        ("Can meltdowns be prevented?", "Identifying patterns and triggers allows you to make environmental and routine adjustments that reduce meltdown frequency."),
    ],
}

CONTENT["behaviour-management-at-home.html"] = {
    "tag": "Neurodivergent Children", "intro": "Behaviour Management at Home",
    "points": [
        ("Understanding Behaviour", "All behaviour is communication. Challenging behaviour often indicates unmet needs, overwhelm, or skill deficits."),
        ("Positive Reinforcement", "Focusing on and rewarding desired behaviour is more effective than punishing unwanted behaviour."),
        ("Consistent Routines", "Predictable routines reduce anxiety and behavioural challenges, especially for neurodivergent children."),
        ("Natural Consequences", "Allowing children to experience the natural results of their choices teaches responsibility without punishment."),
    ],
    "path_title": "Behaviour Management Support at eMbrace",
    "path_text": "We provide parent training in evidence-based behaviour management strategies tailored to your child's needs and your family context.",
    "faqs": [
        ("What should I do when my child refuses to follow instructions?", "Stay calm, use simple language, offer choices, provide warnings before transitions, and follow through consistently."),
        ("How do I handle hitting or aggression?", "Ensure safety first, understand the trigger, teach replacement behaviours, and seek professional support if persistent."),
    ],
}

CONTENT["school-communication.html"] = {
    "tag": "Education & Advocacy", "intro": "School Communication for Parents",
    "points": [
        ("Importance", "Effective parent-school communication is essential for ensuring your child receives appropriate support and accommodations."),
        ("Communication Channels", "Parent-teacher meetings, emails, school apps, and formal review meetings are all opportunities to advocate for your child."),
        ("Preparation", "Prepare for meetings by documenting concerns, reviewing your child's rights, and prioritising key discussion points."),
        ("Collaboration Mindset", "Approaching school staff as partners rather than adversaries leads to better outcomes for your child."),
    ],
    "path_title": "School Communication Support at eMbrace",
    "path_text": "We coach parents on effective school communication, meeting preparation, rights advocacy, and collaborative problem-solving with schools.",
    "faqs": [
        ("How do I request a meeting with my child's school?", "Write a professional email requesting a meeting, specifying your concerns and requesting relevant staff attend."),
        ("What if the school is not cooperative?", "We help parents escalate concerns through proper channels, understand their legal rights, and access advocacy support."),
    ],
}

CONTENT["iep-guide.html"] = {
    "tag": "Education & Advocacy", "intro": "IEP Guide for Parents",
    "points": [
        ("What is an IEP?", "An Individualised Education Plan (IEP) is a legal document outlining special education services and accommodations for a child with disabilities."),
        ("Eligibility", "Children with diagnosed disabilities that affect educational performance are eligible for IEP services."),
        ("Components", "An IEP includes present levels, annual goals, special education services, accommodations, and progress measurement."),
        ("Parent Role", "Parents are equal members of the IEP team and have the right to request evaluations, disagree with decisions, and due process."),
    ],
    "path_title": "IEP Support at eMbrace",
    "path_text": "We help parents understand IEPs, prepare for meetings, advocate for appropriate services, and monitor implementation.",
    "faqs": [
        ("What's the difference between an IEP and a 504 Plan?", "An IEP provides specialised instruction and services, while a 504 Plan provides accommodations without changing instruction."),
        ("Can the school deny my request for an IEP evaluation?", "Schools must evaluate if there is reason to suspect a disability. If denied, parents have appeal rights."),
    ],
}

CONTENT["inclusive-school-guide.html"] = {
    "tag": "Education & Advocacy", "intro": "Inclusive School Guide for Parents",
    "points": [
        ("Inclusive Education", "Inclusive education means all children — regardless of ability — learn together in mainstream classrooms with appropriate supports."),
        ("Benefits", "Inclusion benefits all students by promoting empathy, reducing prejudice, and preparing students for diverse workplaces."),
        ("What to Look For", "Inclusive schools have trained teachers, accessible facilities, support staff, flexible curriculum, and positive behaviour support."),
        ("Parent Role", "Parents can advocate for inclusion by requesting accommodations, educating school staff, and supporting inclusive policies."),
    ],
    "path_title": "Inclusive Education Support at eMbrace",
    "path_text": "We guide parents in finding, evaluating, and advocating for inclusive school placements for their children.",
    "faqs": [
        ("Does India have inclusive education laws?", "The Rights of Persons with Disabilities Act 2016 mandates inclusive education. RTE Act also supports inclusive practices."),
        ("What if my school says they can't accommodate my child?", "Schools have legal obligations. We help parents understand their rights and advocate for necessary accommodations."),
    ],
}

CONTENT["transition-planning-for-parents.html"] = {
    "tag": "Education & Advocacy", "intro": "Transition Planning for Parents",
    "points": [
        ("Why Transition Planning Matters", "Major transitions (preschool to school, primary to secondary, school to college/work) are stressful for neurodivergent children."),
        ("Gradual Approach", "Effective transition involves preparation, familiarisation, gradual exposure, and ongoing support during the change."),
        ("Social Stories", "Social stories explaining what to expect help neurodivergent children prepare for transitions."),
        ("Collaboration", "Involving both sending and receiving schools in transition planning ensures continuity of support."),
    ],
    "path_title": "Transition Planning at eMbrace",
    "path_text": "We help parents create comprehensive transition plans for their children, including school transitions, college preparation, and life stage changes.",
    "faqs": [
        ("When should we start transition planning?", "For major transitions, start planning 6-12 months in advance to allow adequate preparation time."),
        ("What should a transition plan include?", "Current supports, anticipated challenges, new environment details, accommodation needs, communication plans, and timeline."),
    ],
}

CONTENT["schools.html"] = {
    "tag": "Resource Hub", "intro": "Core Aspects of School Partnership",
    "points": [
        ("Whole-School Approach", "Effective school mental health programs involve students, teachers, parents, and leadership in creating a supportive environment."),
        ("Early Identification", "School-based screening and early intervention programs identify concerns before they become crises."),
        ("Teacher Training", "Equipping teachers with mental health literacy and classroom management skills benefits all students."),
        ("Evidence-Based Programs", "School mental health programs should be grounded in research and adapted to the Indian school context."),
    ],
    "path_title": "School Partnership Services at eMbrace",
    "path_text": "We partner with schools to provide mental health services, teacher training, screening programs, and inclusive education consulting.",
    "faqs": [
        ("What services does eMbrace offer to schools?", "We offer counselling services, teacher training, mental health screening, wellness programs, inclusive education consulting, and crisis support."),
        ("How can schools refer students for assessment?", "Schools can contact us for referral pathways, we provide comprehensive assessments and share recommendations with parent consent."),
    ],
}

CONTENT["school-partnerships.html"] = {
    "tag": "School Services", "intro": "School Partnerships with eMbrace",
    "points": [
        ("Partnership Models", "We offer tiered partnership models from basic counselling access to comprehensive whole-school mental health programs."),
        ("Benefits for Schools", "Partner schools gain access to expert mental health support, reducing staff burden and improving student outcomes."),
        ("Customised Programs", "Partnerships are tailored to each school's specific needs, culture, and student population."),
        ("Quality Assurance", "All services are delivered by qualified professionals using evidence-based approaches."),
    ],
    "path_title": "School Partnerships at eMbrace",
    "path_text": "We provide flexible partnership options for schools including on-site counselling, referral pathways, and comprehensive mental health programs.",
    "faqs": [
        ("What is the process for establishing a school partnership?", "We start with a needs assessment meeting, propose a customised partnership plan, and implement with ongoing evaluation."),
        ("Do you work with international schools in Delhi?", "Yes — we work with all types of schools including international, private, government-aided, and special schools in Delhi NCR."),
    ],
}

CONTENT["autism-in-the-classroom.html"] = {
    "tag": "Inclusive Education", "intro": "Autism in the Classroom",
    "points": [
        ("Understanding Autistic Students", "Autistic students have unique learning styles, sensory needs, communication preferences, and support requirements."),
        ("Sensory Environment", "Classroom lighting, noise levels, visual clutter, and seating arrangements significantly affect autistic students' ability to learn."),
        ("Communication Support", "Visual supports, clear instructions, processing time, and alternative communication methods help autistic students participate."),
        ("Social Inclusion", "Structured social opportunities, peer buddy systems, and explicit social instruction promote inclusion."),
    ],
    "path_title": "Autism Classroom Support at eMbrace",
    "path_text": "We train teachers in autism-inclusive practices and help schools create supportive environments for autistic students.",
    "faqs": [
        ("How can teachers support an autistic student in a mainstream classroom?", "Provide visual schedules, reduce sensory overload, give clear instructions, allow processing time, and use special interests positively."),
        ("What accommodations help autistic students academically?", "Extended time, quiet workspace, written instructions, reduced handwriting requirements, and alternative assessment methods."),
    ],
}

CONTENT["adhd-in-the-classroom.html"] = {
    "tag": "Inclusive Education", "intro": "ADHD in the Classroom",
    "points": [
        ("Understanding ADHD Students", "ADHD affects attention, impulse control, and activity regulation — not intelligence or motivation."),
        ("Classroom Challenges", "Students with ADHD struggle with sustained attention, following instructions, organisation, impulse control, and sitting still."),
        ("Effective Strategies", "Strategic seating, task chunking, movement breaks, positive reinforcement, and clear routines support ADHD students."),
        ("Teacher Attitude", "Patience, understanding, and viewing ADHD as a disability rather than defiance transforms classroom experience."),
    ],
    "path_title": "ADHD Classroom Support at eMbrace",
    "path_text": "We train teachers in ADHD-friendly classroom strategies and help schools implement effective support systems.",
    "faqs": [
        ("What classroom accommodations help ADHD students?", "Preferential seating, extended time, reduced assignments, movement breaks, fidget tools, and written instructions are effective accommodations."),
        ("How can teachers reduce ADHD-related disruptions?", "Clear expectations, positive reinforcement for on-task behaviour, non-verbal redirection, and structured routines reduce disruptions."),
    ],
}

CONTENT["learning-disabilities-in-school.html"] = {
    "tag": "Inclusive Education", "intro": "Learning Disabilities in School",
    "points": [
        ("Impact on Learning", "Specific learning disabilities affect reading (dyslexia), writing (dysgraphia), and mathematics (dyscalculia) despite average intelligence."),
        ("Early Signs", "Difficulty with letter recognition, phonics, spelling, written expression, or number concepts despite adequate instruction."),
        ("Accommodations", "Extra time, audiobooks, speech-to-text, calculator use, and modified assessment formats support students with LD."),
        ("Teacher Role", "Teachers play a crucial role in identifying potential LD and referring for assessment."),
    ],
    "path_title": "Learning Disability Support in Schools at eMbrace",
    "path_text": "We provide LD assessment, teacher training, and classroom strategies to support students with specific learning disabilities.",
    "faqs": [
        ("How are learning disabilities identified in school?", "Through psychoeducational assessment including cognitive testing (WISC-V) and academic achievement testing (WIAT)."),
        ("What accommodations are available for board exams?", "CBSE and ICSE allow accommodations including scribe, extra time, exemption from second language, and amanuensis."),
    ],
}

CONTENT["special-education-consulting.html"] = {
    "tag": "Inclusive Education", "intro": "Special Education Consulting",
    "points": [
        ("Purpose", "Special education consulting helps schools develop, implement, and improve their special education programs."),
        ("Areas of Support", "Curriculum adaptation, behaviour support plans, staff training, program evaluation, and compliance with disability laws."),
        ("Inclusive Framework", "We promote inclusive practices where students with disabilities learn alongside peers with appropriate supports."),
        ("Parent Collaboration", "Effective consulting includes building strong home-school partnerships for students with special needs."),
    ],
    "path_title": "Special Education Consulting at eMbrace",
    "path_text": "Our special education consultants work with schools to build capacity, improve programs, and ensure inclusive practices.",
    "faqs": [
        ("How can eMbrace help improve our school's special education program?", "We conduct program audits, provide staff training, develop IEP templates, and offer ongoing consultation."),
        ("Do you help with school compliance under RPD Act?", "Yes — we guide schools in understanding and implementing their obligations under the Rights of Persons with Disabilities Act."),
    ],
}

CONTENT["teacher-training.html"] = {
    "tag": "Staff Development", "intro": "Teacher Training Programs",
    "points": [
        ("Why Training Matters", "Teachers are the front line of student mental health but often lack training in identifying and supporting diverse needs."),
        ("Training Topics", "Topics include mental health literacy, classroom management, inclusive teaching strategies, behaviour support, and trauma-informed practice."),
        ("Ongoing Support", "One-time training is insufficient — ongoing coaching, mentoring, and refresher sessions ensure skill development."),
        ("Whole-School Impact", "When all staff receive training, the entire school culture becomes more supportive and inclusive."),
    ],
    "path_title": "Teacher Training at eMbrace",
    "path_text": "We provide customised teacher training programs delivered by experienced psychologists and special educators.",
    "faqs": [
        ("How long are your teacher training programs?", "We offer flexible formats from half-day workshops to year-long professional development programs."),
        ("What topics do you cover in teacher training?", "Mental health awareness, inclusive practices, ADHD/autism/LD support, behaviour management, and teacher wellbeing."),
    ],
}

CONTENT["school-counselling.html"] = {
    "tag": "School Services", "intro": "School Counselling Services",
    "points": [
        ("Role of School Counsellors", "School counsellors support students' academic, career, and social-emotional development through individual and group programs."),
        ("Common Issues", "Academic stress, peer relationships, family changes, mental health concerns, and career guidance are common counselling topics."),
        ("Counselling Models", "Effective school counselling uses a tiered model: universal support for all, targeted support for at-risk, and intensive support for those with high needs."),
        ("Outsourced Support", "Many schools partner with external providers like eMbrace to supplement their counselling services."),
    ],
    "path_title": "School Counselling at eMbrace",
    "path_text": "We provide on-site and off-site school counselling services, supervision for school counsellors, and program development support.",
    "faqs": [
        ("What are the signs a student needs counselling?", "Academic decline, social withdrawal, behaviour changes, physical complaints, emotional distress, or mentions of self-harm."),
        ("How are counselling referrals handled in partner schools?", "Schools refer students with parent consent, we provide assessment and counselling, and share progress updates with the school."),
    ],
}

CONTENT["school-screening-programs.html"] = {
    "tag": "School Services", "intro": "School Screening Programs",
    "points": [
        ("Purpose", "School-wide screening identifies students at risk for mental health, learning, or developmental concerns early."),
        ("Screening Tools", "Validated screening tools assess emotional wellbeing, behaviour, learning readiness, and social functioning."),
        ("Ethical Framework", "Screening requires parent consent, data privacy, and clear pathways for follow-up support."),
        ("Benefits", "Early identification leads to early intervention, better outcomes, and reduces the need for crisis intervention."),
    ],
    "path_title": "School Screening at eMbrace",
    "path_text": "We provide comprehensive school screening programs including mental health, developmental, and academic readiness screening.",
    "faqs": [
        ("What screening tools does eMbrace use?", "We use standardised tools like SDQ (Strengths and Difficulties Questionnaire), Conners Rating Scales, and academic screening instruments."),
        ("How are screening results shared with parents?", "Results are shared in a confidential meeting with parents along with recommendations and support options."),
    ],
}

CONTENT["school-wellness-programs.html"] = {
    "tag": "School Services", "intro": "School Wellness Programs",
    "points": [
        ("Holistic Approach", "School wellness programs address physical, emotional, social, and mental health in an integrated manner."),
        ("Components", "Wellness programs include mindfulness, yoga, physical activity, nutrition education, and mental health awareness."),
        ("Student Engagement", "Programs designed with student input are more engaging and effective."),
        ("Long-Term Impact", "Wellness programs build lifelong healthy habits and protective factors for mental health."),
    ],
    "path_title": "School Wellness Programs at eMbrace",
    "path_text": "We design and implement customised school wellness programs incorporating evidence-based practices for student wellbeing.",
    "faqs": [
        ("What does a typical school wellness program include?", "Mindfulness sessions, emotional literacy classes, peer support programs, physical wellness activities, and parent workshops."),
        ("How do you measure the effectiveness of wellness programs?", "We use pre-post surveys, wellbeing screeners, feedback forms, and behavioural indicators to evaluate impact."),
    ],
}

CONTENT["school-mental-health-programs.html"] = {
    "tag": "School Services", "intro": "School Mental Health Programs",
    "points": [
        ("Comprehensive Approach", "School mental health programs integrate prevention, early intervention, and support services within the school setting."),
        ("Tiered System", "Tier 1: universal mental health promotion. Tier 2: targeted support for at-risk students. Tier 3: intensive individualised intervention."),
        ("Evidence Base", "Research shows comprehensive school mental health programs improve academic performance and reduce behavioural issues."),
        ("Sustainability", "Effective programs include staff training, parent engagement, and ongoing evaluation for long-term sustainability."),
    ],
    "path_title": "School Mental Health Programs at eMbrace",
    "path_text": "We partner with schools to develop comprehensive mental health programs tailored to the Indian school context.",
    "faqs": [
        ("How do we start a mental health program in our school?", "Start with a needs assessment, build staff capacity, implement tiered support, and evaluate outcomes systematically."),
        ("What is the role of parents in school mental health programs?", "Parent involvement through workshops, awareness sessions, and collaborative support planning is essential for effectiveness."),
    ],
}

CONTENT["inclusive-education-consulting.html"] = {
    "tag": "Inclusive Education", "intro": "Inclusive Education Consulting",
    "points": [
        ("Vision", "Inclusive education means all students learn together in mainstream classrooms with appropriate supports and accommodations."),
        ("Framework", "Universal Design for Learning (UDL), Differentiated Instruction, and Response to Intervention (RTI) are key frameworks."),
        ("Barriers to Inclusion", "Attitudinal barriers, lack of training, inadequate resources, and rigid curriculum are common obstacles."),
        ("Consulting Process", "We assess current practices, identify gaps, develop action plans, and provide ongoing support."),
    ],
    "path_title": "Inclusive Education Consulting at eMbrace",
    "path_text": "Our consultants help schools transition to inclusive models through assessment, planning, training, and implementation support.",
    "faqs": [
        ("What is the first step in making my school more inclusive?", "Conduct an inclusive education audit to identify current strengths and gaps in policy, practice, and culture."),
        ("How long does it take to become an inclusive school?", "Inclusion is a journey — visible improvements within 6-12 months, with full transformation taking 2-3 years."),
    ],
}

CONTENT["classroom-accommodations.html"] = {
    "tag": "Inclusive Education", "intro": "Classroom Accommodations",
    "points": [
        ("Purpose", "Classroom accommodations remove barriers to learning without changing academic expectations or content."),
        ("Types of Accommodations", "Presentation accommodations (audiobooks, large print), response accommodations (scribe, speech-to-text), setting accommodations (quiet space), timing accommodations (extended time)."),
        ("Legal Right", "Students with diagnosed disabilities have a legal right to reasonable accommodations in school."),
        ("Implementation", "Accommodations should be documented in an IEP or 504 Plan and communicated to all teachers."),
    ],
    "path_title": "Classroom Accommodations at eMbrace",
    "path_text": "We help schools and parents identify, implement, and monitor appropriate classroom accommodations for students with disabilities.",
    "faqs": [
        ("What's the difference between accommodations and modifications?", "Accommodations change how students learn (e.g., extra time), while modifications change what students learn (e.g., simpler curriculum)."),
        ("Can accommodations be provided without a formal diagnosis?", "Some informal accommodations can be made, but formal diagnosis ensures legal protection and documentation."),
    ],
}

CONTENT["teacher-wellbeing-programs.html"] = {
    "tag": "Staff Development", "intro": "Teacher Wellbeing Programs",
    "points": [
        ("Teacher Stress", "Teaching is one of the most stressful professions, with high rates of burnout, anxiety, and compassion fatigue."),
        ("Impact on Students", "Teacher wellbeing directly affects classroom quality, student engagement, and student mental health."),
        ("Program Components", "Wellbeing programs include stress management, peer support, counselling access, work-life balance strategies, and resilience training."),
        ("Institutional Responsibility", "Schools must create supportive work environments, not just provide individual coping resources."),
    ],
    "path_title": "Teacher Wellbeing at eMbrace",
    "path_text": "We provide teacher wellbeing programs including individual counselling, group support, stress management workshops, and organisational consulting.",
    "faqs": [
        ("How can schools support teacher wellbeing?", "Reduce administrative burden, provide planning time, create supportive culture, offer counselling access, and recognise teacher efforts."),
        ("What are signs of teacher burnout?", "Exhaustion, cynicism, reduced effectiveness, irritability, withdrawal, and physical symptoms like headaches and sleep problems."),
    ],
}

CONTENT["manager-training.html"] = {
    "tag": "Staff Development", "intro": "Manager Training Programs",
    "points": [
        ("Purpose", "Manager training equips school leaders with skills to support staff wellbeing, handle sensitive situations, and create positive school culture."),
        ("Key Skills", "Emotional intelligence, communication skills, conflict resolution, mental health first aid, and supportive leadership practices."),
        ("Crisis Management", "School leaders need training in crisis response including suicide prevention, grief support, and trauma-informed leadership."),
        ("Creating Culture", "Leaders set the tone for school culture and play a crucial role in destigmatising mental health support."),
    ],
    "path_title": "Manager Training at eMbrace",
    "path_text": "We provide training programs for school leaders covering mental health leadership, crisis management, and supportive school culture development.",
    "faqs": [
        ("What topics are covered in manager training?", "Mental health awareness, supportive communication, staff wellbeing promotion, crisis response, and inclusive leadership."),
        ("How is manager training delivered?", "Through interactive workshops, case-based learning, ongoing coaching, and access to mental health resources."),
    ],
}


CONTENT["corporates.html"] = {
    "tag": "Resource Hub", "intro": "Core Aspects of Corporate Wellness",
    "points": [
        ("Business Case", "Investing in employee mental health improves productivity, reduces absenteeism, and increases retention."),
        ("Holistic Approach", "Effective corporate wellness addresses physical health, mental health, social connection, and financial wellbeing."),
        ("Culture Matters", "Wellness programs are most effective in organisations that genuinely value employee wellbeing."),
        ("Measurable Impact", "ROI of corporate wellness programs ranges from 2:1 to 5:1 through reduced healthcare costs and improved performance."),
    ],
    "path_title": "Corporate Wellness at eMbrace",
    "path_text": "We provide comprehensive corporate wellness services including EAP, mental health training, wellbeing programs, and neurodiversity consulting.",
    "faqs": [
        ("What corporate wellness services does eMbrace offer?", "Employee Assistance Programs, stress management workshops, mental health awareness training, manager training, and neurodiversity consulting."),
        ("How do we measure the effectiveness of wellness programs?", "Through employee surveys, utilisation rates, absenteeism data, productivity metrics, and engagement scores."),
    ],
}

CONTENT["corporate-wellness.html"] = {
    "tag": "Workplace Mental Health", "intro": "Corporate Wellness Programs",
    "points": [
        ("Definition", "Corporate wellness includes initiatives promoting employee physical health, mental health, and overall wellbeing in the workplace."),
        ("Components", "Wellness programs include health screenings, fitness challenges, mental health support, nutritional guidance, stress management, and work-life balance initiatives."),
        ("Customisation", "Effective wellness programs are tailored to the organisation's culture, employee demographics, and specific needs."),
        ("Leadership Buy-In", "Programs succeed when leadership genuinely supports and participates in wellness initiatives."),
    ],
    "path_title": "Corporate Wellness Programs at eMbrace",
    "path_text": "We design and implement customised corporate wellness programs that address the unique needs of your organisation.",
    "faqs": [
        ("How do we start a corporate wellness program?", "Begin with an employee needs assessment, define clear goals, design a program, implement with communication, and evaluate regularly."),
        ("What is the best format for wellness programs?", "A blended approach combining digital resources, in-person workshops, individual support, and organisational policy changes is most effective."),
    ],
}

CONTENT["employee-mental-health.html"] = {
    "tag": "Workplace Mental Health", "intro": "Employee Mental Health in the Workplace",
    "points": [
        ("Prevalence", "1 in 5 employees experience a mental health condition annually, but most hide it due to stigma."),
        ("Workplace Impact", "Mental health conditions cost Indian employers billions annually in lost productivity, absenteeism, and turnover."),
        ("Risk Factors", "High workload, low control, poor management, job insecurity, and toxic workplace culture increase mental health risks."),
        ("Protective Factors", "Supportive management, autonomy, positive culture, work-life balance, and access to mental health support protect employee wellbeing."),
    ],
    "path_title": "Employee Mental Health at eMbrace",
    "path_text": "We help organisations support employee mental health through awareness programs, counselling access, manager training, and policy development.",
    "faqs": [
        ("How can managers support employee mental health?", "Regular check-ins, reasonable workload, flexible work, reducing stigma, and knowing how to refer to professional support."),
        ("Should employees disclose mental health conditions at work?", "Disclosure is personal. A supportive culture makes disclosure safer, but no employee should feel pressured."),
    ],
}

CONTENT["employee-assistance-programs.html"] = {
    "tag": "Workplace Mental Health", "intro": "Employee Assistance Programs (EAP)",
    "points": [
        ("What is an EAP?", "An Employee Assistance Program is a confidential counselling and support service provided by employers to employees."),
        ("Services", "EAPs typically offer short-term counselling, crisis support, legal/financial guidance, and work-life resources."),
        ("Confidentiality", "EAPs are completely confidential — employers only receive aggregate utilisation data, not individual details."),
        ("ROI", "EAPs show strong return on investment through reduced absenteeism, presenteeism, and healthcare costs."),
    ],
    "path_title": "EAP Services at eMbrace",
    "path_text": "We provide comprehensive Employee Assistance Programs including confidential counselling, manager consultation, and organisational support.",
    "faqs": [
        ("How is confidentiality maintained in an EAP?", "All services are confidential within legal and ethical limits. Employers receive only anonymous aggregate reports."),
        ("How many sessions do employees get through EAP?", "Typically 4-8 sessions per issue per year, with referral pathways for longer-term support if needed."),
    ],
}

CONTENT["burnout-prevention.html"] = {
    "tag": "Workplace Mental Health", "intro": "Burnout Prevention at Work",
    "points": [
        ("Understanding Burnout", "Burnout is a state of exhaustion, cynicism, and reduced professional efficacy caused by chronic workplace stress."),
        ("Organisational Causes", "Excessive workload, insufficient control, lack of recognition, poor relationships, unfair treatment, and value conflicts drive burnout."),
        ("Prevention Strategies", "Workload management, autonomy, recognition, supportive management, work-life boundaries, and wellbeing resources prevent burnout."),
        ("Culture Change", "Burnout prevention requires systemic changes, not just individual coping strategies."),
    ],
    "path_title": "Burnout Prevention at eMbrace",
    "path_text": "We help organisations prevent burnout through organisational assessment, manager training, individual support, and culture change initiatives.",
    "faqs": [
        ("Can burnout be prevented entirely?", "While some stress is inevitable, organisations can significantly reduce burnout risk through systemic changes."),
        ("How do I know if my team is at risk of burnout?", "Warning signs include increased absenteeism, reduced engagement, irritability, mistakes, and staff turnover."),
    ],
}

CONTENT["workplace-anxiety.html"] = {
    "tag": "Workplace Mental Health", "intro": "Workplace Anxiety",
    "points": [
        ("Common Experience", "Workplace anxiety affects employees at all levels and can be triggered by presentations, meetings, performance reviews, and deadlines."),
        ("Impact on Performance", "Anxiety reduces concentration, decision-making, creativity, and willingness to take on challenges."),
        ("Supportive Environment", "Managers can reduce workplace anxiety by providing clear expectations, regular feedback, and psychological safety."),
        ("Individual Support", "CBT, mindfulness, and relaxation techniques effectively treat workplace anxiety."),
    ],
    "path_title": "Workplace Anxiety Support at eMbrace",
    "path_text": "We provide individual counselling and organisational programs to address workplace anxiety.",
    "faqs": [
        ("How can organisations reduce workplace anxiety?", "Clear communication, manageable workloads, supportive management, recognition, and mental health resources reduce anxiety."),
        ("What is the best treatment for workplace anxiety?", "CBT is highly effective, often combined with workplace accommodations and stress management techniques."),
    ],
}

CONTENT["leadership-wellbeing.html"] = {
    "tag": "Leadership & Training", "intro": "Leadership Wellbeing",
    "points": [
        ("Unique Pressures", "Leaders face unique stressors including isolation, responsibility for others, decision fatigue, and constant visibility."),
        ("Role Modelling", "Leaders who prioritise their own wellbeing set a powerful example and create permission for others to do the same."),
        ("Emotional Intelligence", "Self-awareness, empathy, and relationship management are crucial skills for effective and sustainable leadership."),
        ("Support for Leaders", "Executive coaching, peer support groups, and confidential counselling help leaders manage their own wellbeing."),
    ],
    "path_title": "Leadership Wellbeing at eMbrace",
    "path_text": "We provide executive coaching, leadership wellbeing programs, and confidential support services for organisational leaders.",
    "faqs": [
        ("How is executive coaching different from therapy?", "Coaching focuses on professional goals and performance, while therapy addresses mental health concerns."),
        ("What are signs of leader burnout?", "Irritability, withdrawal from team, reduced decision quality, cynicism, and physical symptoms like insomnia or headaches."),
    ],
}

CONTENT["workplace-stress.html"] = {
    "tag": "Workplace Mental Health", "intro": "Workplace Stress Management",
    "points": [
        ("Common Issue", "Over 60% of Indian employees report high workplace stress, affecting health, performance, and engagement."),
        ("Sources", "Unrealistic deadlines, poor management, lack of control, office politics, and work-life imbalance are key stressors."),
        ("Individual Strategies", "Time management, boundary-setting, relaxation techniques, and cognitive restructuring help manage stress."),
        ("Organisational Strategies", "Workload review, management training, flexible work, and wellness programs address systemic stress sources."),
    ],
    "path_title": "Workplace Stress Support at eMbrace",
    "path_text": "We provide workplace stress management through individual counselling, group workshops, and organisational consulting.",
    "faqs": [
        ("How can organisations measure workplace stress?", "Through employee surveys, turnover analysis, absenteeism data, health insurance claims, and focus groups."),
        ("What is the most effective stress management technique?", "No single technique works for everyone. A combination of organisational changes and individual skills is most effective."),
    ],
}

CONTENT["neurodiversity-at-work.html"] = {
    "tag": "Neurodiversity & Inclusion", "intro": "Neurodiversity in the Workplace",
    "points": [
        ("What is Neurodiversity?", "Neurodiversity recognises that neurological differences (autism, ADHD, dyslexia, etc.) are natural variations in human brains."),
        ("Workplace Strengths", "Neurodivergent employees bring unique strengths including innovation, attention to detail, pattern recognition, and creative problem-solving."),
        ("Inclusive Practices", "Flexible work arrangements, clear communication, sensory-friendly environments, and strengths-based role design support neurodivergent employees."),
        ("Competitive Advantage", "Companies that embrace neurodiversity outperform competitors in innovation, productivity, and retention."),
    ],
    "path_title": "Neurodiversity at Work at eMbrace",
    "path_text": "We help organisations build neurodiversity-inclusive workplaces through consulting, training, and employee support services.",
    "faqs": [
        ("How can organisations attract neurodivergent talent?", "Inclusive job descriptions, alternative interview processes, clear communication about accommodations, and visible neurodiversity commitment."),
        ("What accommodations help neurodivergent employees?", "Quiet workspaces, written instructions, flexible hours, noise-cancelling headphones, and regular feedback are common accommodations."),
    ],
}

CONTENT["inclusive-hiring.html"] = {
    "tag": "Neurodiversity & Inclusion", "intro": "Inclusive Hiring Practices",
    "points": [
        ("Why Inclusive Hiring?", "Traditional hiring processes often screen out neurodivergent candidates despite their potential to excel in the role."),
        ("Barriers", "Vague interview questions, unstructured formats, group exercises, and emphasis on eye contact/small talk disadvantage neurodivergent candidates."),
        ("Inclusive Practices", "Clear job descriptions, skills-based assessments, work samples, structured interviews, and accommodation provision improve inclusivity."),
        ("Legal Framework", "The Rights of Persons with Disabilities Act 2016 mandates equal opportunity and reasonable accommodations in employment."),
    ],
    "path_title": "Inclusive Hiring Support at eMbrace",
    "path_text": "We help organisations redesign hiring processes to attract and fairly assess neurodivergent and disabled candidates.",
    "faqs": [
        ("What changes make interviews more inclusive?", "Share questions in advance, allow written responses, focus on skills not social performance, and offer alternative formats."),
        ("How do we find neurodivergent candidates?", "Partner with disability organisations, post inclusive job ads, attend neurodiversity career fairs, and train recruiters."),
    ],
}

CONTENT["workplace-adhd-support.html"] = {
    "tag": "Neurodiversity & Inclusion", "intro": "Workplace ADHD Support",
    "points": [
        ("ADHD at Work", "ADHD affects approximately 3-5% of adults and significantly impacts work performance and career progression."),
        ("Common Challenges", "Time management, organisation, meeting focus, email management, procrastination, and deadline pressure are common ADHD challenges."),
        ("Workplace Strengths", "Creativity, crisis handling, hyperfocus, energy, innovative thinking, and adaptability are ADHD strengths."),
        ("Accommodations", "Flexible scheduling, written instructions, task management tools, regular feedback, and quiet workspace help ADHD employees thrive."),
    ],
    "path_title": "Workplace ADHD Support at eMbrace",
    "path_text": "We provide ADHD coaching, workplace accommodations guidance, and manager training to support ADHD employees.",
    "faqs": [
        ("Can ADHD be a workplace advantage?", "Yes — many ADHD traits like creativity, energy, and hyperfocus are valuable in the right roles with appropriate support."),
        ("What should managers know about ADHD?", "ADHD is a disability, not laziness. Employees with accommodations often outperform their peers."),
    ],
}

CONTENT["workplace-autism-support.html"] = {
    "tag": "Neurodiversity & Inclusion", "intro": "Workplace Autism Support",
    "points": [
        ("Autism at Work", "Many autistic adults are unemployed or underemployed despite having valuable skills and qualifications."),
        ("Workplace Strengths", "Attention to detail, reliability, honesty, deep focus, pattern recognition, and technical expertise are common autistic strengths."),
        ("Support Needs", "Clear communication, predictable routines, sensory accommodations, and explicit expectations help autistic employees succeed."),
        ("Inclusive Culture", "Autistic employees thrive in cultures that value direct communication, respect routines, and provide reasonable accommodations."),
    ],
    "path_title": "Workplace Autism Support at eMbrace",
    "path_text": "We support organisations in hiring, retaining, and supporting autistic employees through consulting, coaching, and training.",
    "faqs": [
        ("How can managers support autistic employees?", "Provide clear written instructions, give advance notice of changes, respect sensory needs, and offer regular structured feedback."),
        ("What reasonable accommodations help autistic employees?", "Quiet workspace, written communication, flexible hours, predictable schedules, and clear role expectations."),
    ],
}

CONTENT["workplace-accommodations.html"] = {
    "tag": "Neurodiversity & Inclusion", "intro": "Workplace Accommodations for Neurodivergent Employees",
    "points": [
        ("Legal Framework", "Under the Rights of Persons with Disabilities Act 2016, employers must provide reasonable accommodations."),
        ("Types of Accommodations", "Flexible hours, remote work options, quiet spaces, assistive technology, written instructions, and regular breaks."),
        ("Business Benefits", "Accommodations are typically low-cost and improve productivity, retention, and employee satisfaction."),
        ("Process", "Accommodations should be determined through interactive discussion with the employee about their specific needs."),
    ],
    "path_title": "Workplace Accommodations at eMbrace",
    "path_text": "We guide organisations in implementing effective workplace accommodations for neurodivergent employees.",
    "faqs": [
        ("How much do workplace accommodations cost?", "Most accommodations cost little or nothing. Even expensive ones are offset by reduced turnover and increased productivity."),
        ("How do we determine appropriate accommodations?", "Through confidential discussion with the employee, understanding their specific needs and collaboratively identifying solutions."),
    ],
}


# ============ PAGE DATA ============

"""
For each cluster we define:
  - hub_file: the hub page filename
  - pages: list of (filename, title, description, h1, subtitle, breadcrumb_text, is_hub)
"""

def page_data():
    # --- Teen Mental Health ---
    teen_hub = "teen-counselling.html"
    teen_pages = [
        (teen_hub, "Teen Counselling & Therapy | eMbrace", "Professional teen counselling and therapy in Delhi for anxiety, depression, stress, and emotional wellbeing. Supportive adolescent mental health care.", "Teen Counselling & Therapy", "Professional support for adolescents navigating the challenges of growing up.", "Teen Counselling", True),
        ("teen-anxiety.html", "Teen Anxiety Therapy | eMbrace", "Overcome teen anxiety with expert therapy in Delhi. CBT, exposure therapy, and family support for adolescent anxiety disorders.", "Teen Anxiety Therapy", "Helping teens manage worry, fear, and anxiety with proven therapeutic approaches.", "Teen Anxiety", False),
        ("teen-depression.html", "Teen Depression Treatment | eMbrace", "Expert teen depression treatment in Delhi. Evidence-based therapy for adolescent depression, mood disorders, and emotional wellbeing.", "Teen Depression Treatment", "Compassionate care for teens experiencing depression and low mood.", "Teen Depression", False),
        ("teen-stress.html", "Teen Stress Management | eMbrace", "Teen stress management and coping skills in Delhi. Help your adolescent manage academic, social, and personal stress effectively.", "Teen Stress Management", "Building resilience and healthy coping strategies for stressed teens.", "Teen Stress", False),
        ("social-anxiety-in-teens.html", "Social Anxiety in Teens | eMbrace", "Expert treatment for social anxiety in teens in Delhi. CBT, social skills training, and graduated exposure therapy.", "Social Anxiety in Teens", "Overcoming social fear and building confidence in teenage years.", "Social Anxiety in Teens", False),
        ("peer-pressure.html", "Peer Pressure Counselling | eMbrace", "Peer pressure counselling for teens in Delhi. Build assertiveness, decision-making skills, and confidence to navigate social influences.", "Peer Pressure Counselling", "Empowering teens to make confident choices in the face of peer influence.", "Peer Pressure", False),
        ("digital-addiction.html", "Digital Addiction Therapy | eMbrace", "Digital addiction therapy for teens in Delhi. Screen time management, gaming addiction treatment, and healthy tech habits.", "Digital Addiction Therapy", "Helping teens build a healthy relationship with technology and screens.", "Digital Addiction", False),
        ("gaming-addiction.html", "Gaming Addiction Treatment | eMbrace", "Gaming addiction treatment for teens in Delhi. Evidence-based therapy for gaming disorder and problematic screen use.", "Gaming Addiction Treatment", "Support for teens struggling with gaming and screen overuse.", "Gaming Addiction", False),
        ("career-stress.html", "Teen Career Stress Counselling | eMbrace", "Career stress counselling for teens in Delhi. Navigate academic pressure, career choices, and parental expectations with professional support.", "Teen Career Stress Counselling", "Supporting teens through academic and career decision-making pressure.", "Career Stress", False),
        ("exam-anxiety.html", "Exam Anxiety Therapy | eMbrace", "Exam anxiety therapy for students in Delhi. Overcome test stress with CBT, relaxation techniques, and effective study strategies.", "Exam Anxiety Therapy", "Helping students perform their best without the burden of exam stress.", "Exam Anxiety", False),
        ("college-transition-support.html", "College Transition Support | eMbrace", "College transition support for students in Delhi. Pre-college counselling, adjustment support, and mental health care for new college students.", "College Transition Support", "Preparing and supporting students through the move to college life.", "College Transition", False),
        ("self-esteem-for-teens.html", "Self-Esteem for Teens | eMbrace", "Build teen self-esteem with expert counselling in Delhi. Confidence building, self-compassion, and strengths-based therapy.", "Self-Esteem for Teens", "Helping teens develop authentic confidence and self-worth.", "Self-Esteem for Teens", False),
        ("emotional-regulation-for-teens.html", "Emotional Regulation for Teens | eMbrace", "Emotional regulation skills for teens in Delhi. DBT-informed therapy, mindfulness, and coping strategies for emotional wellbeing.", "Emotional Regulation for Teens", "Teaching teens to understand and manage their emotions effectively.", "Emotional Regulation for Teens", False),
        ("anger-management-for-teens.html", "Anger Management for Teens | eMbrace", "Anger management therapy for teens in Delhi. Learn to understand, express, and channel anger constructively.", "Anger Management for Teens", "Helping teens transform anger into assertive communication and self-understanding.", "Anger Management for Teens", False),
        ("teen-relationship-issues.html", "Teen Relationship Counselling | eMbrace", "Teen relationship counselling in Delhi. Navigate dating, friendships, breakups, and social dynamics with professional support.", "Teen Relationship Counselling", "Supporting teens in building healthy relationships and navigating social challenges.", "Teen Relationship Issues", False),
    ]

    # --- Adult Mental Health ---
    adult_hub = "adult-counselling.html"
    adult_pages = [
        (adult_hub, "Adult Counselling & Therapy | eMbrace", "Professional adult counselling and therapy in Delhi for anxiety, depression, relationships, stress, and personal growth.", "Adult Counselling & Therapy", "Expert mental health support for adults navigating life's challenges.", "Adult Counselling", True),
        ("adult-anxiety.html", "Adult Anxiety Treatment | eMbrace", "Adult anxiety treatment in Delhi. Evidence-based therapy for GAD, panic disorder, social anxiety, and health anxiety.", "Adult Anxiety Treatment", "Overcoming worry and fear with proven therapeutic approaches.", "Adult Anxiety", False),
        ("adult-depression.html", "Adult Depression Treatment | eMbrace", "Adult depression treatment in Delhi. CBT, behavioural activation, and collaborative care for lasting recovery.", "Adult Depression Treatment", "Finding your way back to joy, energy, and meaning.", "Adult Depression", False),
        ("stress-management.html", "Stress Management Therapy | eMbrace", "Stress management therapy in Delhi. Learn practical skills for managing workplace, relationship, and life stress.", "Stress Management Therapy", "Building resilience and balance in a demanding world.", "Stress Management", False),
        ("life-transitions.html", "Life Transition Counselling | eMbrace", "Life transition counselling in Delhi. Support for career changes, relocation, divorce, parenthood, and other major life shifts.", "Life Transition Counselling", "Navigating life's changes with clarity and confidence.", "Life Transitions", False),
        ("burnout-counselling.html", "Burnout Counselling & Recovery | eMbrace", "Burnout counselling and recovery in Delhi. Overcome exhaustion, cynicism, and reduced effectiveness with professional support.", "Burnout Counselling & Recovery", "Recovering from burnout and building sustainable wellbeing.", "Burnout Counselling", False),
        ("premarital-counselling.html", "Premarital Counselling | eMbrace", "Premarital counselling in Delhi. Build a strong foundation for marriage with evidence-based relationship preparation.", "Premarital Counselling", "Preparing for a strong, lasting marriage.", "Premarital Counselling", False),
        ("relationship-counselling.html", "Relationship Counselling | eMbrace", "Relationship counselling in Delhi. Improve communication, resolve conflicts, and strengthen your relationships.", "Relationship Counselling", "Building stronger, more satisfying relationships.", "Relationship Counselling", False),
        ("couples-therapy.html", "Couples Therapy | eMbrace", "Couples therapy in Delhi. Gottman Method, EFT, and evidence-based approaches for couples at any stage.", "Couples Therapy", "Strengthening your partnership through expert guidance.", "Couples Therapy", False),
        ("marital-counselling.html", "Marital Counselling | eMbrace", "Marital counselling in Delhi. Culturally sensitive therapy for Indian couples facing communication, trust, and intimacy challenges.", "Marital Counselling", "Restoring connection and communication in your marriage.", "Marital Counselling", False),
        ("grief-counselling.html", "Grief Counselling | eMbrace", "Grief counselling in Delhi. Compassionate support for loss, bereavement, and complicated grief.", "Grief Counselling", "Finding your way through loss with compassionate support.", "Grief Counselling", False),
        ("trauma-therapy.html", "Trauma Therapy | eMbrace", "Trauma therapy in Delhi. EMDR, TF-CBT, and somatic approaches for PTSD and complex trauma.", "Trauma Therapy", "Healing from trauma in a safe, supportive environment.", "Trauma Therapy", False),
        ("mindfulness-therapy.html", "Mindfulness Therapy | eMbrace", "Mindfulness therapy in Delhi. MBCT, MBSR, and mindfulness-based approaches for anxiety, depression, and stress.", "Mindfulness Therapy", "Cultivating present-moment awareness for lasting wellbeing.", "Mindfulness Therapy", False),
        ("self-esteem-counselling.html", "Self-Esteem Counselling | eMbrace", "Self-esteem counselling in Delhi. Build authentic confidence and self-worth with evidence-based therapy.", "Self-Esteem Counselling", "Developing stable, realistic self-worth.", "Self-Esteem Counselling", False),
        ("workplace-stress.html", "Workplace Stress Counselling | eMbrace", "Workplace stress counselling in Delhi. Manage work pressure, improve work-life balance, and prevent burnout.", "Workplace Stress Counselling", "Thriving at work without sacrificing your wellbeing.", "Workplace Stress", False),
        ("adult-autism-support.html", "Adult Autism Support | eMbrace", "Adult autism support in Delhi. Assessment, post-diagnostic support, and neurodiversity-affirming therapy for autistic adults.", "Adult Autism Support", "Understanding and embracing your autistic identity in adulthood.", "Adult Autism Support", False),
        ("adult-adhd-support.html", "Adult ADHD Support | eMbrace", "Adult ADHD support in Delhi. Assessment, coaching, CBT, and workplace strategies for adults with ADHD.", "Adult ADHD Support", "Harnessing your ADHD strengths and managing challenges.", "Adult ADHD Support", False),
        ("executive-function-coaching-for-adults.html", "Executive Function Coaching for Adults | eMbrace", "Executive function coaching for adults in Delhi. Time management, organisation, planning, and productivity support.", "Executive Function Coaching for Adults", "Building systems and strategies for executive function success.", "Executive Function Coaching", False),
    ]

    # --- Parent Hub ---
    parent_hub = "parents.html"
    parent_pages = [
        (parent_hub, "Parent Support & Counselling | eMbrace", "Parent support and counselling in Delhi. Parenting strategies, behaviour management, school advocacy, and emotional support for parents.", "Parent Support & Counselling", "Supporting you in raising happy, resilient children.", "Parent Support Hub", True),
        ("parent-counselling.html", "Parent Counselling | eMbrace", "Parent counselling in Delhi. One-on-one and joint counselling for parenting challenges, stress, and family dynamics.", "Parent Counselling", "Expert guidance for the most important job in the world.", "Parent Counselling", False),
        ("parent-burnout.html", "Parent Burnout Support | eMbrace", "Parent burnout support in Delhi. Recover from exhaustion, rebuild your energy, and find joy in parenting again.", "Parent Burnout Support", "Restoring your energy and wellbeing as a parent.", "Parent Burnout", False),
        ("caregiver-support.html", "Caregiver Support Services | eMbrace", "Caregiver support in Delhi. Counselling, respite planning, and practical support for parents and caregivers of special needs children.", "Caregiver Support Services", "Supporting those who give so much to others.", "Caregiver Support", False),
        ("positive-parenting.html", "Positive Parenting | eMbrace", "Positive parenting programs in Delhi. Evidence-based strategies for building connection, cooperation, and emotional intelligence.", "Positive Parenting", "Raising confident children with respect and connection.", "Positive Parenting", False),
        ("new-parent-support.html", "New Parent Support | eMbrace", "New parent support in Delhi. Postpartum mental health, baby care guidance, and emotional support for new parents.", "New Parent Support", "Supporting you through the journey of early parenthood.", "New Parent Support", False),
        ("parent-support-groups.html", "Parent Support Groups | eMbrace", "Parent support groups in Delhi. Connect with other parents, share experiences, and build your support network.", "Parent Support Groups", "Finding strength and understanding in community.", "Parent Support Groups", False),
        ("raising-a-child-with-autism.html", "Raising a Child with Autism | eMbrace", "Support for raising a child with autism in Delhi. Parent guidance, behaviour support, and advocacy for autistic children.", "Raising a Child with Autism", "Navigating the autism journey with knowledge and confidence.", "Raising a Child with Autism", False),
        ("raising-a-child-with-adhd.html", "Raising a Child with ADHD | eMbrace", "Support for raising a child with ADHD in Delhi. Parent training, behaviour strategies, and school advocacy.", "Raising a Child with ADHD", "Helping your ADHD child thrive at home and school.", "Raising a Child with ADHD", False),
        ("siblings-of-neurodivergent-children.html", "Supporting Siblings of Neurodivergent Children | eMbrace", "Sibling support services in Delhi. Counselling and programs for siblings of children with autism, ADHD, and other neurodivergences.", "Supporting Siblings of Neurodivergent Children", "Supporting every child in the family.", "Sibling Support", False),
        ("managing-meltdowns.html", "Managing Meltdowns | eMbrace", "Meltdown management strategies in Delhi. Understand, prevent, and respond effectively to autistic and ADHD meltdowns.", "Managing Meltdowns", "Understanding and responding to overwhelm with confidence.", "Managing Meltdowns", False),
        ("behaviour-management-at-home.html", "Behaviour Management at Home | eMbrace", "Behaviour management strategies for parents in Delhi. Positive reinforcement, routines, and natural consequences.", "Behaviour Management at Home", "Creating a calm, cooperative home environment.", "Behaviour Management at Home", False),
        ("school-communication.html", "Parent-School Communication | eMbrace", "Parent-school communication coaching in Delhi. Advocate effectively for your child's educational needs.", "Parent-School Communication", "Partnering with schools for your child's success.", "School Communication", False),
        ("iep-guide.html", "IEP Guide for Parents | eMbrace", "IEP guide for parents in Delhi. Understand Individualised Education Plans, advocate for services, and support your child's learning.", "IEP Guide for Parents", "Navigating special education plans with confidence.", "IEP Guide", False),
        ("inclusive-school-guide.html", "Inclusive School Guide | eMbrace", "Guide to inclusive schools in Delhi. Find, evaluate, and advocate for inclusive education placements.", "Inclusive School Guide", "Finding the right inclusive school for your child.", "Inclusive School Guide", False),
        ("transition-planning-for-parents.html", "Transition Planning for Parents | eMbrace", "Transition planning for parents in Delhi. Prepare your child for school changes, college, and life transitions.", "Transition Planning for Parents", "Supporting your child through life's important transitions.", "Transition Planning", False),
    ]

    # --- Schools Hub ---
    schools_hub = "schools.html"
    schools_pages = [
        (schools_hub, "School Partnership Programs | eMbrace", "School partnership programs in Delhi. Mental health services, teacher training, inclusive education consulting, and counselling for schools.", "School Partnership Programs", "Partnering with schools to support student and staff wellbeing.", "Schools Partnership Hub", True),
        ("school-partnerships.html", "School Partnerships | eMbrace", "School partnerships with eMbrace in Delhi. Flexible partnership models for mental health support, counselling, and wellness programs.", "School Partnerships", "Customised mental health partnerships for your school.", "School Partnerships", False),
        ("school-counselling.html", "School Counselling Services | eMbrace", "School counselling services in Delhi. On-site and off-site counselling, counsellor supervision, and program development.", "School Counselling Services", "Professional counselling support for your students.", "School Counselling", False),
        ("school-screening-programs.html", "School Screening Programs | eMbrace", "School mental health screening programs in Delhi. Early identification of learning, developmental, and mental health concerns.", "School Screening Programs", "Early identification for early intervention.", "School Screening Programs", False),
        ("school-wellness-programs.html", "School Wellness Programs | eMbrace", "School wellness programs in Delhi. Mindfulness, yoga, mental health awareness, and holistic wellbeing for students.", "School Wellness Programs", "Building lifelong wellbeing habits in students.", "School Wellness Programs", False),
        ("school-mental-health-programs.html", "School Mental Health Programs | eMbrace", "Comprehensive school mental health programs in Delhi. Tiered support systems, staff training, and parent engagement.", "School Mental Health Programs", "Whole-school approaches to mental health and wellbeing.", "School Mental Health Programs", False),
        ("inclusive-education-consulting.html", "Inclusive Education Consulting | eMbrace", "Inclusive education consulting in Delhi. Help your school transition to inclusive practices with expert guidance.", "Inclusive Education Consulting", "Making every classroom truly inclusive.", "Inclusive Education Consulting", False),
        ("autism-in-the-classroom.html", "Autism in the Classroom | eMbrace", "Supporting autistic students in the classroom in Delhi. Teacher training, accommodations, and inclusive strategies.", "Autism in the Classroom", "Creating classroom environments where autistic students thrive.", "Autism in the Classroom", False),
        ("adhd-in-the-classroom.html", "ADHD in the Classroom | eMbrace", "Supporting ADHD students in the classroom in Delhi. Teacher training, accommodations, and behaviour support strategies.", "ADHD in the Classroom", "Helping students with ADHD succeed in school.", "ADHD in the Classroom", False),
        ("learning-disabilities-in-school.html", "Supporting Learning Disabilities in School | eMbrace", "Support for learning disabilities in schools in Delhi. Identification, accommodations, and teacher training.", "Supporting Learning Disabilities in School", "Ensuring every student with learning disabilities can succeed.", "Learning Disabilities in School", False),
        ("special-education-consulting.html", "Special Education Consulting | eMbrace", "Special education consulting in Delhi. Program development, staff training, and compliance support for schools.", "Special Education Consulting", "Building excellent special education programs.", "Special Education Consulting", False),
        ("classroom-accommodations.html", "Classroom Accommodations Guide | eMbrace", "Classroom accommodations guide for schools in Delhi. Legal requirements, implementation, and best practices.", "Classroom Accommodations Guide", "Removing barriers to learning for every student.", "Classroom Accommodations", False),
        ("teacher-training.html", "Teacher Training Programs | eMbrace", "Teacher training programs in Delhi. Mental health literacy, inclusive practices, behaviour management, and teacher wellbeing.", "Teacher Training Programs", "Equipping teachers with skills for inclusive classrooms.", "Teacher Training", False),
        ("teacher-wellbeing-programs.html", "Teacher Wellbeing Programs | eMbrace", "Teacher wellbeing programs in Delhi. Counselling, stress management, and support for educator mental health.", "Teacher Wellbeing Programs", "Supporting the wellbeing of those who support our children.", "Teacher Wellbeing", False),
        ("manager-training.html", "School Manager Training | eMbrace", "School manager and leader training in Delhi. Mental health leadership, crisis management, and supportive school culture.", "School Manager Training", "Building leadership skills for mentally healthy schools.", "Manager Training", False),
    ]

    # --- Corporate Hub ---
    corp_hub = "corporates.html"
    corp_pages = [
        (corp_hub, "Corporate Wellness Programs | eMbrace", "Corporate wellness and employee mental health programs in Delhi. EAP, stress management, neurodiversity inclusion, and wellbeing consulting.", "Corporate Wellness Programs", "Building mentally healthy, high-performing workplaces.", "Corporate Wellness Hub", True),
        ("corporate-wellness.html", "Corporate Wellness Solutions | eMbrace", "Corporate wellness solutions in Delhi. Customised employee wellbeing programs, health initiatives, and mental health support.", "Corporate Wellness Solutions", "Tailored wellness programs for your organisation.", "Corporate Wellness", False),
        ("employee-mental-health.html", "Employee Mental Health Programs | eMbrace", "Employee mental health programs in Delhi. Awareness, counselling access, manager training, and supportive workplace policies.", "Employee Mental Health Programs", "Prioritising mental health in the workplace.", "Employee Mental Health", False),
        ("employee-assistance-programs.html", "Employee Assistance Programs (EAP) | eMbrace", "Employee Assistance Programs in Delhi. Confidential counselling, crisis support, and work-life resources for employees.", "Employee Assistance Programs (EAP)", "Confidential support for your most valuable asset — your people.", "EAP Services", False),
        ("burnout-prevention.html", "Burnout Prevention Programs | eMbrace", "Burnout prevention programs for organisations in Delhi. Assessment, training, and systemic solutions for workplace wellbeing.", "Burnout Prevention Programs", "Preventing burnout through organisational change.", "Burnout Prevention", False),
        ("workplace-anxiety.html", "Workplace Anxiety Support | eMbrace", "Workplace anxiety support in Delhi. Individual counselling and organisational programs for anxiety at work.", "Workplace Anxiety Support", "Creating calm, productive work environments.", "Workplace Anxiety", False),
        ("leadership-wellbeing.html", "Leadership Wellbeing Programs | eMbrace", "Leadership wellbeing and executive coaching in Delhi. Support for leaders facing unique pressures and responsibilities.", "Leadership Wellbeing Programs", "Supporting those who lead our organisations.", "Leadership Wellbeing", False),
        ("neurodiversity-at-work.html", "Neurodiversity in the Workplace | eMbrace", "Neurodiversity inclusion in the workplace in Delhi. Consulting, training, and support for hiring and retaining neurodivergent talent.", "Neurodiversity in the Workplace", "Harnessing the power of neurodiverse talent.", "Neurodiversity at Work", False),
        ("inclusive-hiring.html", "Inclusive Hiring Practices | eMbrace", "Inclusive hiring practices in Delhi. Redesign recruitment to attract and assess neurodivergent candidates fairly.", "Inclusive Hiring Practices", "Building diverse teams through inclusive recruitment.", "Inclusive Hiring", False),
        ("workplace-adhd-support.html", "Workplace ADHD Support | eMbrace", "Workplace ADHD support in Delhi. Coaching, accommodations, and manager training for ADHD employees.", "Workplace ADHD Support", "Supporting ADHD employees to thrive at work.", "Workplace ADHD Support", False),
        ("workplace-autism-support.html", "Workplace Autism Support | eMbrace", "Workplace autism support in Delhi. Consulting, coaching, and accommodations for autistic employees.", "Workplace Autism Support", "Creating work environments where autistic employees succeed.", "Workplace Autism Support", False),
        ("workplace-accommodations.html", "Workplace Accommodations | eMbrace", "Workplace accommodations for neurodivergent employees in Delhi. Implementation guidance and legal compliance.", "Workplace Accommodations", "Reasonable accommodations for a diverse workforce.", "Workplace Accommodations", False),
    ]

    # --- Location Pages ---
    services = [
        ("autism-assessment", "Autism Assessment"),
        ("adhd-assessment", "ADHD Assessment"),
        ("speech-therapy", "Speech Therapy"),
        ("occupational-therapy", "Occupational Therapy"),
        ("child-psychologist", "Child Psychologist"),
        ("child-counselling", "Child Counselling"),
        ("autism-therapy", "Autism Therapy"),
        ("special-education", "Special Education"),
        ("learning-disability-assessment", "Learning Disability Assessment"),
        ("teen-counselling", "Teen Counselling"),
        ("adult-counselling", "Adult Counselling"),
    ]
    locations = [
        ("delhi", "Delhi"),
        ("saket", "Saket"),
        ("south-delhi", "South Delhi"),
        ("greater-kailash", "Greater Kailash"),
        ("vasant-kunj", "Vasant Kunj"),
        ("defence-colony", "Defence Colony"),
        ("gurgaon", "Gurgaon"),
        ("green-park", "Green Park"),
        ("noida", "Noida"),
        ("hauz-khas", "Hauz Khas"),
    ]
    loc_pages = []
    for srv_slug, srv_name in services:
        for loc_slug, loc_name in locations:
            fn = f"{srv_slug}-in-{loc_slug}.html"
            title = f"{srv_name} in {loc_name} | eMbrace"
            desc = f"Professional {srv_name.lower()} services in {loc_name}, Delhi. Expert care and support for children, teens, and adults. Book a consultation."
            h1 = f"{srv_name} in {loc_name}"
            subtitle = f"Professional {srv_name.lower()} services conveniently located in {loc_name}, Delhi."
            loc_pages.append((fn, title, desc, h1, subtitle, f"{srv_name} in {loc_name}", False))

    return {
        "teen": (teen_hub, teen_pages),
        "adult": (adult_hub, adult_pages),
        "parents": (parent_hub, parent_pages),
        "schools": (schools_hub, schools_pages),
        "corporate": (corp_hub, corp_pages),
        "locations": (None, loc_pages),
    }

# ============ GENERATE PAGE FUNCTION ============

def generate_page(filename, title, desc, h1, subtitle, bc_text, hub_file, is_hub):
    def get_content(filename):
        c = CONTENT.get(filename, None)
        if c is None:
            c = CONTENT.get(hub_file, None) if hub_file else None
        return c or {"tag": "", "intro": f"Understanding {h1}", "points": [], "path_title": "", "path_text": "", "faqs": []}

    c = get_content(filename)
    canonical = "/" + filename.replace(".html", "")

    points = c.get("points", [])
    path_title = c.get("path_title", "")
    path_text = c.get("path_text", "")
    faqs_list = c.get("faqs", [])
    tag = c.get("tag", "")
    intro = c.get("intro", f"Understanding {h1}")

    # Sidebar
    if hub_file and not is_hub:
        desk_side, mob_side = make_sidebar(hub_file, filename)
    else:
        desk_side, mob_side = make_sidebar(filename, filename)

    breadcrumb = make_breadcrumb(hub_file if hub_file else (filename if is_hub else None), bc_text)

    # Key points
    key_pts = make_key_points(points) if points else ""

    # Pathway
    pathway_section = make_pathway(path_title, path_text)

    # FAQs
    faq_section = make_faqs(faqs_list)

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

    filepath = os.path.join(DIR, filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
    return filename


# ============ LOCATION PAGE GENERATOR ============

def make_location_faqs(service_name_full, loc_name):
    return make_faqs([
        (f"Does eMbrace offer {service_name_full.lower()} in {loc_name}?", f"Yes, we offer professional {service_name_full.lower()} services at our {loc_name} location and online. Our team of experienced professionals provides personalised care."),
        (f"How do I book {service_name_full.lower()} in {loc_name}?", f"You can book a consultation by calling us or using our online booking system. We offer flexible appointment times including evenings and weekends at our {loc_name} centre."),
        (f"What are the qualifications of your {service_name_full.lower()} professionals in {loc_name}?", f"All our professionals are qualified, experienced, and registered with their respective professional bodies. We maintain the highest standards of care."),
        (f"Do you offer online {service_name_full.lower()} for {loc_name} residents?", f"Yes, we offer online {service_name_full.lower()} services for residents of {loc_name} who prefer remote consultations or have mobility concerns."),
    ])


def generate_location_page(filename, title, desc, h1, subtitle, bc_text, service_name_full, loc_name):
    canonical = "/" + filename.replace(".html", "")

    faq_section = make_location_faqs(service_name_full, loc_name)

    key_points = make_key_points([
        ("Expert Professionals", f"Our {service_name_full.lower()} team in {loc_name} consists of qualified, experienced professionals dedicated to providing exceptional care."),
        ("Convenient Location", f"Our {loc_name} centre is easily accessible with flexible appointment scheduling to suit your busy lifestyle."),
        ("Personalised Care", f"Every {service_name_full.lower()} plan is tailored to your unique needs, goals, and circumstances."),
        ("Comprehensive Support", f"From initial assessment to ongoing care, we provide complete {service_name_full.lower()} support for you and your family."),
    ])

    cta = f"""            <div class="bg-gradient-to-r from-[#FFF5DC99] to-[#FFF8E445] border border-orange-100 rounded-3xl p-8 text-center my-12 shadow-sm">
              <h3 class="text-xl md:text-2xl font-bold text-gray-800 mb-2">Book Your Appointment in {loc_name}</h3>
              <p class="text-sm md:text-base text-gray-600 mb-6 max-w-xl mx-auto">Contact us today to schedule your {service_name_full.lower()} consultation at our {loc_name} centre.</p>
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
          <span class="inline-block px-4 py-1 text-xs font-bold rounded-full bg-[#E7F7FF] text-[#234394] mb-4 tracking-wider uppercase">Location Services</span>
          <h1 class="text-3xl md:text-5xl font-extrabold text-[#234394] leading-tight mb-4">{h1}</h1>
          <p class="text-base md:text-lg text-gray-600 max-w-3xl mx-auto italic">{subtitle}</p>
          <div class="mt-8 flex justify-center">
            <button class="bg-[#234394] hover:bg-[#1e3a80] text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-all transform hover:scale-105 cursor-pointer">
              Book a Consultation
            </button>
          </div>
        </div>
      </div>
      <div class="px-6 md:px-16 py-12 bg-white">
        <div class="max-w-7xl mx-auto">
          <div class="flex-grow max-w-5xl mx-auto article-content">
            <h2 class="text-2xl md:text-3xl font-bold mb-6 text-[#234394]">{service_name_full} Services in {loc_name}</h2>
            <p class="text-lg text-gray-700 leading-relaxed font-light mb-8">{subtitle}</p>
            <hr class="my-8 border-gray-100" />
            <ul class="space-y-4 mb-8">
{key_points}            </ul>
{faq_section}
{cta}
          </div>
        </div>
      </div>
      <div id="footer-placeholder"></div>
    </div>
    <script src="./assets/interactive.js"></script>
  </body>
</html>"""

    filepath = os.path.join(DIR, filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)
    return filename


# ============ MAIN ============

if __name__ == "__main__":
    data = page_data()
    generated = []
    failed = []

    # Define which pages belong to which hub (for sidebar)
    cluster_map = {
        "teen": ("teen-counselling.html", data["teen"][1]),
        "adult": ("adult-counselling.html", data["adult"][1]),
        "parents": ("parents.html", data["parents"][1]),
        "schools": ("schools.html", data["schools"][1]),
        "corporate": ("corporates.html", data["corporate"][1]),
    }

    for cluster_name, (hub_file, pages) in cluster_map.items():
        print(f"\n=== {cluster_name.upper()} CLUSTER ===")
        for (fn, title, desc, h1, subtitle, bc_text, is_hub) in pages:
            try:
                if is_hub:
                    generate_page(fn, title, desc, h1, subtitle, bc_text, None, True)
                else:
                    generate_page(fn, title, desc, h1, subtitle, bc_text, hub_file, False)
                generated.append(fn)
                print(f"  ✅ {fn}")
            except Exception as e:
                failed.append((fn, str(e)))
                print(f"  ❌ {fn}: {e}")

    print(f"\n=== LOCATION PAGES ===")
    services = [
        ("autism-assessment", "Autism Assessment"),
        ("adhd-assessment", "ADHD Assessment"),
        ("speech-therapy", "Speech Therapy"),
        ("occupational-therapy", "Occupational Therapy"),
        ("child-psychologist", "Child Psychologist"),
        ("child-counselling", "Child Counselling"),
        ("autism-therapy", "Autism Therapy"),
        ("special-education", "Special Education"),
        ("learning-disability-assessment", "Learning Disability Assessment"),
        ("teen-counselling", "Teen Counselling"),
        ("adult-counselling", "Adult Counselling"),
    ]
    locations = [
        ("delhi", "Delhi"),
        ("saket", "Saket"),
        ("south-delhi", "South Delhi"),
        ("greater-kailash", "Greater Kailash"),
        ("vasant-kunj", "Vasant Kunj"),
        ("defence-colony", "Defence Colony"),
        ("gurgaon", "Gurgaon"),
        ("green-park", "Green Park"),
        ("noida", "Noida"),
        ("hauz-khas", "Hauz Khas"),
    ]
    for srv_slug, srv_name in services:
        for loc_slug, loc_name in locations:
            fn = f"{srv_slug}-in-{loc_slug}.html"
            title = f"{srv_name} in {loc_name} | eMbrace"
            desc = f"Professional {srv_name.lower()} services in {loc_name}, Delhi. Expert care and support for children, teens, and adults. Book a consultation."
            h1 = f"{srv_name} in {loc_name}"
            subtitle = f"Professional {srv_name.lower()} services conveniently located in {loc_name}, Delhi."
            bc = f"{srv_name} in {loc_name}"
            try:
                generate_location_page(fn, title, desc, h1, subtitle, bc, srv_name, loc_name)
                generated.append(fn)
                print(f"  ✅ {fn}")
            except Exception as e:
                failed.append((fn, str(e)))
                print(f"  ❌ {fn}: {e}")

    print(f"\n{'='*50}")
    print(f"✅ Generated {len(generated)} pages successfully")
    if failed:
        print(f"❌ {len(failed)} pages failed:")
        for fn, err in failed:
            print(f"  - {fn}: {err}")
    print(f"{'='*50}")
