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
        "canonical": "/index.html",
        "keep_faq_jsonld": False,
    },
    "about.html": {
        "title": "About eMbrace | Our Story, Mission &amp; Leadership Team",
        "description": "Learn about eMbrace, Delhi's trusted psychology practice founded by Dr. Supriya Malik. Meet our leadership team of RCI-certified clinical psychologists.",
        "canonical": "/about.html",
        "keep_faq_jsonld": False,
    },
    "adolescents.html": {
        "title": "Adolescent Therapy &amp; Counselling in Delhi | eMbrace Lives",
        "description": "Evidence-based therapy for teens — anxiety, depression, ADHD, peer pressure, academic stress &amp; emotional regulation. Expert adolescent psychologists in Delhi.",
        "canonical": "/adolescents.html",
        "keep_faq_jsonld": False,
    },
    "adult.html": {
        "title": "Adult Therapy &amp; Mental Health Services in Delhi | eMbrace Lives",
        "description": "Professional therapy for adults — clinical psychology, counselling, couples therapy, ADHD &amp; autism assessments. Book with top psychologists in Delhi.",
        "canonical": "/adult.html",
        "keep_faq_jsonld": False,
    },
    "appointment.html": {
        "title": "Book an Appointment | eMbrace Lives",
        "description": "Schedule your therapy session with eMbrace. Book online or in-person appointments with our clinical psychologists, child therapists &amp; counsellors in Delhi.",
        "canonical": "/appointment.html",
        "keep_faq_jsonld": False,
    },
    "appointment__confirmation.html": {
        "title": "Appointment Confirmed | eMbrace Lives",
        "description": "Your appointment with eMbrace is confirmed. We look forward to supporting you on your mental health journey.",
        "canonical": "/appointment__confirmation.html",
        "keep_faq_jsonld": False,
    },
    "blogs.html": {
        "title": "Psychology &amp; Mental Health Blog | eMbrace Lives",
        "description": "Expert insights on child psychology, teen mental health, ADHD, autism, learning disabilities, speech therapy, occupational therapy &amp; parenting. Evidence-based guidance from Delhi's top psychologists.",
        "canonical": "/blogs.html",
        "keep_faq_jsonld": False,
    },
    "book-download.html": {
        "title": "Free Mental Health Resources | eMbrace Lives",
        "description": "Download free mental health resources, guides &amp; e-books from eMbrace. Expert guidance on parenting, ADHD, autism, anxiety &amp; more.",
        "canonical": "/book-download.html",
        "keep_faq_jsonld": False,
    },
    "careers.html": {
        "title": "Careers in Psychology | eMbrace Lives",
        "description": "Join eMbrace — Delhi's leading psychology practice. We're hiring clinical psychologists, child therapists, counsellors &amp; special educators.",
        "canonical": "/careers.html",
        "keep_faq_jsonld": False,
    },
    "contact.html": {
        "title": "Contact eMbrace Lives | Get in Touch",
        "description": "Contact eMbrace Lives in Delhi. Call, email, or visit us to book appointments or learn more about our psychology services.",
        "canonical": "/contact.html",
        "keep_faq_jsonld": False,
    },
    "faq.html": {
        "title": "Frequently Asked Questions | eMbrace Lives",
        "description": "Find answers to common questions about eMbrace, our therapy services, insurance coverage, appointment process &amp; more.",
        "canonical": "/faq.html",
        "keep_faq_jsonld": False,
    },
    "missed-classes.html": {
        "title": "Missed Classes Anxiety in Children | eMbrace Lives",
        "description": "Help your child cope with missed classes anxiety. Learn strategies for managing academic catch-up stress and school re-entry fears.",
        "canonical": "/missed-classes.html",
        "keep_faq_jsonld": False,
    },
    "parent.html": {
        "title": "Parenting Tips &amp; Guidance | eMbrace Lives",
        "description": "Expert parenting advice for raising children with ADHD, autism &amp; learning differences. Build stronger parent-child relationships with eMbrace.",
        "canonical": "/parent.html",
        "keep_faq_jsonld": False,
    },
    "parents-corner.html": {
        "title": "Parents Corner | eMbrace Lives",
        "description": "A dedicated space for parents — practical tips, expert advice &amp; emotional support for raising confident, resilient children.",
        "canonical": "/parents-corner.html",
        "keep_faq_jsonld": False,
    },
    "resources-and-guides.html": {
        "title": "Mental Health Resources &amp; Guides | eMbrace Lives",
        "description": "Download free mental health resources, parenting guides, school advocacy tools &amp; self-help materials from eMbrace.",
        "canonical": "/resources-and-guides.html",
        "keep_faq_jsonld": False,
    },
    "services.html": {
        "title": "Psychology &amp; Counselling Services in Delhi | eMbrace Lives",
        "description": "Comprehensive psychology services in Delhi — child therapy, adult counselling, ADHD/autism assessment, speech therapy, occupational therapy &amp; more.",
        "canonical": "/services.html",
        "keep_faq_jsonld": False,
    },
    "schools.html": {
        "title": "School Partnership Programs | eMbrace",
        "description": "School partnership programs in Delhi. Mental health services, teacher training, inclusive education consulting, and counselling for schools.",
        "canonical": "/schools.html",
        "keep_faq_jsonld": True,
    },
    "adhd.html": {
        "title": "ADHD Treatment &amp; Counselling in Delhi | eMbrace Lives",
        "description": "Expert ADHD treatment in Delhi — assessment, therapy, coaching &amp; parent training. RCI-certified clinical psychologists for children, teens &amp; adults.",
        "canonical": "/adhd.html",
        "keep_faq_jsonld": False,
    },
    "what-is-adhd.html": {
        "title": "What is ADHD? Symptoms, Types &amp; Causes | eMbrace Lives",
        "description": "ADHD is a neurodevelopmental disorder affecting attention, impulse control &amp; activity. Learn about symptoms, types, causes &amp; evidence-based treatments.",
        "canonical": "/what-is-adhd.html",
        "keep_faq_jsonld": False,
    },
    "adhd-symptoms.html": {
        "title": "ADHD Symptoms &amp; Characteristics | eMbrace Lives",
        "description": "Comprehensive guide to ADHD symptoms across ages — inattention, hyperactivity, impulsivity. Learn how symptoms present in children, teens &amp; adults.",
        "canonical": "/adhd-symptoms.html",
        "keep_faq_jsonld": False,
    },
    "attention-difficulties.html": {
        "title": "Attention Difficulties in ADHD | eMbrace Lives",
        "description": "Attention difficulties in ADHD — distractibility, trouble focusing, task switching. Learn strategies for improving attention &amp; concentration.",
        "canonical": "/attention-difficulties.html",
        "keep_faq_jsonld": False,
    },
    "focus-and-concentration.html": {
        "title": "Focus &amp; Concentration Strategies for ADHD | eMbrace Lives",
        "description": "Improve focus &amp; concentration with ADHD — practical strategies, environmental modifications &amp; therapeutic interventions for better attention.",
        "canonical": "/focus-and-concentration.html",
        "keep_faq_jsonld": False,
    },
    "impulse-control.html": {
        "title": "Impulse Control in ADHD | eMbrace Lives",
        "description": "Impulse control challenges in ADHD — understanding impulsivity, its impact on daily life, and evidence-based strategies for improvement.",
        "canonical": "/impulse-control.html",
        "keep_faq_jsonld": False,
    },
    "hyperactivity.html": {
        "title": "Hyperactivity &amp; ADHD | eMbrace Lives",
        "description": "Understanding hyperactivity in ADHD — from physical restlessness to inner agitation. Learn management strategies for children, teens &amp; adults.",
        "canonical": "/hyperactivity.html",
        "keep_faq_jsonld": False,
    },
    "adhd-in-children.html": {
        "title": "ADHD in Children | eMbrace Lives",
        "description": "ADHD in children — early signs, diagnosis, and evidence-based interventions. Expert child psychologists for paediatric ADHD in Delhi.",
        "canonical": "/adhd-in-children.html",
        "keep_faq_jsonld": False,
    },
    "adhd-in-teens.html": {
        "title": "ADHD in Teens &amp; Adolescents | eMbrace Lives",
        "description": "ADHD in teenagers — unique challenges, academic impact, social dynamics &amp; treatment approaches. Expert adolescent ADHD support in Delhi.",
        "canonical": "/adhd-in-teens.html",
        "keep_faq_jsonld": False,
    },
    "adult-adhd.html": {
        "title": "Adult ADHD | eMbrace Lives",
        "description": "Adult ADHD — symptoms, diagnosis &amp; treatment. Many adults with undiagnosed ADHD struggle with work, relationships &amp; daily life.",
        "canonical": "/adult-adhd.html",
        "keep_faq_jsonld": False,
    },
    "adhd-in-women.html": {
        "title": "ADHD in Women &amp; Girls | eMbrace Lives",
        "description": "ADHD in women &amp; girls is often underdiagnosed. Learn about female-specific symptoms, hormonal influences &amp; tailored treatment approaches.",
        "canonical": "/adhd-in-women.html",
        "keep_faq_jsonld": False,
    },
    "adhd-in-men.html": {
        "title": "ADHD in Men | eMbrace Lives",
        "description": "ADHD in men — how symptoms present, impact on career &amp; relationships, and effective treatment strategies.",
        "canonical": "/adhd-in-men.html",
        "keep_faq_jsonld": False,
    },
    "adhd-screening.html": {
        "title": "ADHD Screening &amp; Early Detection | eMbrace Lives",
        "description": "ADHD screening — early detection through validated tools &amp; clinical evaluation. Learn about our screening process at eMbrace Delhi.",
        "canonical": "/adhd-screening.html",
        "keep_faq_jsonld": False,
    },
    "adhd-assessment.html": {
        "title": "Comprehensive ADHD Assessment | eMbrace Lives",
        "description": "Comprehensive ADHD assessment at eMbrace — Conners 3, clinical interviews, rating scales &amp; cognitive testing. RCI-certified psychologists.",
        "canonical": "/adhd-assessment.html",
        "keep_faq_jsonld": False,
    },
    "conners-3-assessment.html": {
        "title": "Conners 3 ADHD Assessment | eMbrace Lives",
        "description": "Conners 3 is a gold-standard ADHD assessment tool. Learn about this comprehensive evaluation for children, teens &amp; adults.",
        "canonical": "/conners-3-assessment.html",
        "keep_faq_jsonld": False,
    },
    "adhd-testing.html": {
        "title": "ADHD Testing &amp; Evaluation | eMbrace Lives",
        "description": "Professional ADHD testing &amp; evaluation at eMbrace Delhi. Evidence-based assessment for children, teens &amp; adults.",
        "canonical": "/adhd-testing.html",
        "keep_faq_jsonld": False,
    },
    "adhd-treatment.html": {
        "title": "ADHD Treatment &amp; Management | eMbrace Lives",
        "description": "ADHD treatment options — behavioural therapy, medication, coaching, educational support &amp; lifestyle interventions. Personalised care at eMbrace.",
        "canonical": "/adhd-treatment.html",
        "keep_faq_jsonld": False,
    },
    "adhd-counselling.html": {
        "title": "ADHD Counselling &amp; Therapy | eMbrace Lives",
        "description": "ADHD counselling in Delhi — individual therapy, CBT, parent training &amp; family support for managing ADHD across the lifespan.",
        "canonical": "/adhd-counselling.html",
        "keep_faq_jsonld": False,
    },
    "adhd-coaching.html": {
        "title": "ADHD Coaching | eMbrace Lives",
        "description": "ADHD coaching — practical, goal-oriented support for time management, organisation &amp; productivity. Build systems that work with your brain.",
        "canonical": "/adhd-coaching.html",
        "keep_faq_jsonld": False,
    },
    "executive-function-coaching.html": {
        "title": "Executive Function Coaching | eMbrace Lives",
        "description": "Executive function coaching for ADHD — improve planning, organisation &amp; self-regulation with personalised coaching strategies.",
        "canonical": "/executive-function-coaching.html",
        "keep_faq_jsonld": False,
    },
    "adhd-parent-support.html": {
        "title": "ADHD Parent Support &amp; Training | eMbrace Lives",
        "description": "ADHD parent training in Delhi — evidence-based strategies for behaviour management, school advocacy &amp; home routines.",
        "canonical": "/adhd-parent-support.html",
        "keep_faq_jsonld": False,
    },
    "adhd-teacher-support.html": {
        "title": "ADHD Teacher Support &amp; Training | eMbrace Lives",
        "description": "ADHD teacher training — practical classroom strategies for supporting students with attention &amp; executive function challenges.",
        "canonical": "/adhd-teacher-support.html",
        "keep_faq_jsonld": False,
    },
    "adhd-classroom-accommodations.html": {
        "title": "Classroom Accommodations for ADHD | eMbrace Lives",
        "description": "Classroom accommodations for ADHD students — seating, organisation, movement breaks &amp; assessment modifications for academic success.",
        "canonical": "/adhd-classroom-accommodations.html",
        "keep_faq_jsonld": False,
    },
    "adhd-workplace-accommodations.html": {
        "title": "Workplace Accommodations for ADHD | eMbrace Lives",
        "description": "Workplace accommodations for ADHD — flexible scheduling, task management, quiet spaces &amp; assistive technology for professional success.",
        "canonical": "/adhd-workplace-accommodations.html",
        "keep_faq_jsonld": False,
    },
    "adhd-time-management.html": {
        "title": "Time Management for ADHD | eMbrace Lives",
        "description": "Time management strategies for ADHD — practical tools &amp; techniques for better planning, prioritisation &amp; productivity.",
        "canonical": "/adhd-time-management.html",
        "keep_faq_jsonld": False,
    },
    "adhd-study-skills.html": {
        "title": "Study Skills for ADHD Students | eMbrace Lives",
        "description": "Study skills for ADHD students — evidence-based learning strategies, organisation tips &amp; focused study techniques.",
        "canonical": "/adhd-study-skills.html",
        "keep_faq_jsonld": False,
    },
    "adhd-organization-skills.html": {
        "title": "Organisation Skills for ADHD | eMbrace Lives",
        "description": "Organisation skills for ADHD — practical systems for decluttering, filing, planning &amp; maintaining order at home &amp; work.",
        "canonical": "/adhd-organization-skills.html",
        "keep_faq_jsonld": False,
    },
    "adhd-and-anxiety.html": {
        "title": "ADHD and Anxiety | eMbrace Lives",
        "description": "ADHD &amp; anxiety often co-occur. Learn about the relationship, overlapping symptoms &amp; integrated treatment approaches.",
        "canonical": "/adhd-and-anxiety.html",
        "keep_faq_jsonld": False,
    },
    "adhd-and-autism.html": {
        "title": "ADHD and Autism (AuDHD) | eMbrace Lives",
        "description": "ADHD &amp; autism often co-occur (AuDHD). Learn about the overlap, differences &amp; tailored support strategies.",
        "canonical": "/adhd-and-autism.html",
        "keep_faq_jsonld": False,
    },
    "adhd-and-depression.html": {
        "title": "ADHD and Depression | eMbrace Lives",
        "description": "ADHD &amp; depression frequently co-occur. Understand the connection, shared symptoms &amp; effective integrated treatment.",
        "canonical": "/adhd-and-depression.html",
        "keep_faq_jsonld": False,
    },
    "adhd-at-work.html": {
        "title": "ADHD at Work | eMbrace Lives",
        "description": "ADHD at work — challenges &amp; strengths. Learn strategies for professional success, workplace accommodations &amp; career growth.",
        "canonical": "/adhd-at-work.html",
        "keep_faq_jsonld": False,
    },
    "adhd-and-school.html": {
        "title": "ADHD and School | eMbrace Lives",
        "description": "ADHD &amp; school — supporting academic success through accommodations, behaviour plans &amp; teacher collaboration.",
        "canonical": "/adhd-and-school.html",
        "keep_faq_jsonld": False,
    },
    "adhd-and-college.html": {
        "title": "ADHD and College | eMbrace Lives",
        "description": "ADHD &amp; college — navigating higher education with ADHD. Study strategies, time management &amp; campus resources.",
        "canonical": "/adhd-and-college.html",
        "keep_faq_jsonld": False,
    },
    "adhd-faq.html": {
        "title": "ADHD FAQs | eMbrace Lives",
        "description": "Frequently asked questions about ADHD — symptoms, diagnosis, treatment, medication, therapy &amp; support resources.",
        "canonical": "/adhd-faq.html",
        "keep_faq_jsonld": True,
    },
    "adhd-resources.html": {
        "title": "ADHD Resources &amp; Support | eMbrace Lives",
        "description": "ADHD resources — books, websites, support groups, apps &amp; tools for individuals, parents &amp; educators.",
        "canonical": "/adhd-resources.html",
        "keep_faq_jsonld": False,
    },
    "specific-learning-disability.html": {
        "title": "Learning Disabilities Assessment &amp; Therapy | eMbrace Lives",
        "description": "Expert learning disability assessment &amp; therapy in Delhi. Dyslexia, dysgraphia, dyscalculia testing &amp; academic intervention.",
        "canonical": "/specific-learning-disability.html",
        "keep_faq_jsonld": False,
    },
    "learning-disabilities.html": {
        "title": "What are Learning Disabilities? | eMbrace Lives",
        "description": "Learning disabilities are neurologically-based processing disorders affecting reading, writing &amp; mathematics. Learn about types, causes &amp; support.",
        "canonical": "/learning-disabilities.html",
        "keep_faq_jsonld": False,
    },
    "learning-difficulties.html": {
        "title": "Learning Difficulties vs Learning Disabilities | eMbrace Lives",
        "description": "Learning difficulties vs learning disabilities — understand the difference, assessment process &amp; intervention approaches.",
        "canonical": "/learning-difficulties.html",
        "keep_faq_jsonld": False,
    },
    "dyslexia.html": {
        "title": "Dyslexia &amp; Reading Difficulties | eMbrace Lives",
        "description": "Dyslexia is a specific learning disability affecting reading, spelling &amp; decoding. Expert assessment &amp; evidence-based intervention in Delhi.",
        "canonical": "/dyslexia.html",
        "keep_faq_jsonld": False,
    },
    "dysgraphia.html": {
        "title": "Dysgraphia &amp; Writing Difficulties | eMbrace Lives",
        "description": "Dysgraphia affects handwriting, spelling &amp; written expression. Professional assessment &amp; therapy at eMbrace Delhi.",
        "canonical": "/dysgraphia.html",
        "keep_faq_jsonld": False,
    },
    "dyscalculia.html": {
        "title": "Dyscalculia &amp; Maths Difficulties | eMbrace Lives",
        "description": "Dyscalculia is a specific learning disability in mathematics. Learn about signs, assessment &amp; evidence-based interventions.",
        "canonical": "/dyscalculia.html",
        "keep_faq_jsonld": False,
    },
    "reading-disorder.html": {
        "title": "Reading Disorder &amp; Reading Difficulties | eMbrace Lives",
        "description": "Reading disorders affect decoding, fluency &amp; comprehension. Expert assessment &amp; structured literacy interventions in Delhi.",
        "canonical": "/reading-disorder.html",
        "keep_faq_jsonld": False,
    },
    "writing-disorder.html": {
        "title": "Writing Disorder &amp; Writing Difficulties | eMbrace Lives",
        "description": "Writing disorders affect spelling, grammar &amp; organisation of written work. Professional assessment &amp; intervention at eMbrace.",
        "canonical": "/writing-disorder.html",
        "keep_faq_jsonld": False,
    },
    "math-learning-disorder.html": {
        "title": "Mathematics Learning Disorder | eMbrace Lives",
        "description": "Mathematics learning disorder affects number sense, calculation &amp; problem-solving. Expert assessment &amp; intervention in Delhi.",
        "canonical": "/math-learning-disorder.html",
        "keep_faq_jsonld": False,
    },
    "learning-disability-assessment.html": {
        "title": "Learning Disability Assessment | eMbrace Lives",
        "description": "Comprehensive learning disability assessment in Delhi. WISC-V, WIAT &amp; other gold-standard tools for identifying SLD.",
        "canonical": "/learning-disability-assessment.html",
        "keep_faq_jsonld": False,
    },
    "psychoeducational-assessment.html": {
        "title": "Psychoeducational Assessment &amp; Evaluation | eMbrace Lives",
        "description": "Psychoeducational assessment evaluates cognitive abilities, academic achievement &amp; processing skills. Expert evaluations at eMbrace.",
        "canonical": "/psychoeducational-assessment.html",
        "keep_faq_jsonld": False,
    },
    "school-readiness-assessment.html": {
        "title": "School Readiness Assessment | eMbrace Lives",
        "description": "School readiness assessment evaluates cognitive, social, emotional &amp; motor readiness for formal schooling. Prepare your child for success.",
        "canonical": "/school-readiness-assessment.html",
        "keep_faq_jsonld": False,
    },
    "wisc-v-testing.html": {
        "title": "WISC-V Cognitive Assessment | eMbrace Lives",
        "description": "WISC-V is the gold-standard cognitive assessment for children. Learn about this comprehensive intelligence test &amp; what it measures.",
        "canonical": "/wisc-v-testing.html",
        "keep_faq_jsonld": False,
    },
    "academic-intervention.html": {
        "title": "Academic Intervention Program | eMbrace Lives",
        "description": "Academic intervention programs for learning disabilities — evidence-based instruction in reading, writing &amp; mathematics.",
        "canonical": "/academic-intervention.html",
        "keep_faq_jsonld": False,
    },
    "dyslexia-therapy.html": {
        "title": "Dyslexia Therapy &amp; Intervention | eMbrace Lives",
        "description": "Dyslexia therapy using Orton-Gillingham &amp; structured literacy approaches. Expert reading intervention at eMbrace Delhi.",
        "canonical": "/dyslexia-therapy.html",
        "keep_faq_jsonld": False,
    },
    "reading-intervention.html": {
        "title": "Reading Intervention Program | eMbrace Lives",
        "description": "Reading intervention for struggling readers — phonics, fluency, vocabulary &amp; comprehension. Evidence-based programs at eMbrace.",
        "canonical": "/reading-intervention.html",
        "keep_faq_jsonld": False,
    },
    "writing-intervention.html": {
        "title": "Writing Intervention Program | eMbrace Lives",
        "description": "Writing intervention for dysgraphia &amp; writing difficulties — handwriting, spelling &amp; written expression. Expert support at eMbrace.",
        "canonical": "/writing-intervention.html",
        "keep_faq_jsonld": False,
    },
    "study-skills-training.html": {
        "title": "Study Skills Training for Students | eMbrace Lives",
        "description": "Study skills training in Delhi — effective learning strategies, note-taking, time management &amp; exam preparation for all students.",
        "canonical": "/study-skills-training.html",
        "keep_faq_jsonld": False,
    },
    "executive-function-training.html": {
        "title": "Executive Function Training for Children | eMbrace Lives",
        "description": "Executive function training for children — improve planning, organisation &amp; self-regulation skills. Essential for academic success.",
        "canonical": "/executive-function-training.html",
        "keep_faq_jsonld": False,
    },
    "special-education-support.html": {
        "title": "Special Education Support Services | eMbrace Lives",
        "description": "Special education support in Delhi — remedial instruction, IEP implementation &amp; academic advocacy for children with learning differences.",
        "canonical": "/special-education-support.html",
        "keep_faq_jsonld": False,
    },
    "inclusive-education.html": {
        "title": "Inclusive Education Support | eMbrace Lives",
        "description": "Inclusive education ensures all children learn together with appropriate supports. Learn about benefits, strategies &amp; legal rights.",
        "canonical": "/inclusive-education.html",
        "keep_faq_jsonld": False,
    },
    "iep-support.html": {
        "title": "IEP Support &amp; Advocacy | eMbrace Lives",
        "description": "Individualised Education Plan (IEP) support — attend meetings, advocate for services &amp; ensure your child receives appropriate accommodations.",
        "canonical": "/iep-support.html",
        "keep_faq_jsonld": False,
    },
    "school-accommodations.html": {
        "title": "School Accommodations for Learning Disabilities | eMbrace Lives",
        "description": "School accommodations for learning disabilities — extra time, assistive technology, modified assessments &amp; more. Legal rights explained.",
        "canonical": "/school-accommodations.html",
        "keep_faq_jsonld": False,
    },
    "exam-accommodations.html": {
        "title": "Exam Accommodations for Learning Disabilities | eMbrace Lives",
        "description": "Exam accommodations for learning disabilities — CBSE, ICSE &amp; international board accommodations including scribe, extra time &amp; more.",
        "canonical": "/exam-accommodations.html",
        "keep_faq_jsonld": False,
    },
    "learning-disability-support.html": {
        "title": "Learning Disability Support Services | eMbrace Lives",
        "description": "Comprehensive learning disability support — assessment, intervention, school advocacy &amp; parent guidance at eMbrace Delhi.",
        "canonical": "/learning-disability-support.html",
        "keep_faq_jsonld": False,
    },
    "school-performance-problems.html": {
        "title": "School Performance Problems | eMbrace Lives",
        "description": "School performance problems may indicate learning disabilities, ADHD or emotional issues. Expert evaluation &amp; support at eMbrace.",
        "canonical": "/school-performance-problems.html",
        "keep_faq_jsonld": False,
    },
    "speech-therapy.html": {
        "title": "Speech &amp; Language Therapy | eMbrace Lives",
        "description": "Expert speech &amp; language therapy in Delhi for children &amp; adults. Articulation, language, fluency &amp; social communication therapy.",
        "canonical": "/speech-therapy.html",
        "keep_faq_jsonld": False,
    },
    "speech-delay.html": {
        "title": "Speech Delay in Children | eMbrace Lives",
        "description": "Speech delay in children — late talking, limited vocabulary &amp; articulation difficulties. Early intervention speech therapy at eMbrace.",
        "canonical": "/speech-delay.html",
        "keep_faq_jsonld": False,
    },
    "speech-sound-disorders.html": {
        "title": "Speech Sound Disorders | eMbrace Lives",
        "description": "Speech sound disorders affect pronunciation &amp; clarity. Articulation &amp; phonological therapy at eMbrace Delhi for children &amp; adults.",
        "canonical": "/speech-sound-disorders.html",
        "keep_faq_jsonld": False,
    },
    "articulation-therapy.html": {
        "title": "Articulation Therapy | eMbrace Lives",
        "description": "Articulation therapy helps correct speech sound errors. Expert speech therapy at eMbrace for children &amp; adults with unclear speech.",
        "canonical": "/articulation-therapy.html",
        "keep_faq_jsonld": False,
    },
    "stuttering-therapy.html": {
        "title": "Stuttering Therapy &amp; Treatment | eMbrace Lives",
        "description": "Stuttering therapy for children &amp; adults. Fluency shaping, stuttering modification &amp; supportive counselling at eMbrace Delhi.",
        "canonical": "/stuttering-therapy.html",
        "keep_faq_jsonld": False,
    },
    "language-delay.html": {
        "title": "Language Delay in Children | eMbrace Lives",
        "description": "Language delay — late development of expressive &amp; receptive language. Early intervention speech &amp; language therapy at eMbrace.",
        "canonical": "/language-delay.html",
        "keep_faq_jsonld": False,
    },
    "expressive-language-disorder.html": {
        "title": "Expressive Language Disorder | eMbrace Lives",
        "description": "Expressive language disorder affects verbal &amp; written expression. Speech therapy to improve vocabulary, grammar &amp; sentence structure.",
        "canonical": "/expressive-language-disorder.html",
        "keep_faq_jsonld": False,
    },
    "receptive-language-disorder.html": {
        "title": "Receptive Language Disorder | eMbrace Lives",
        "description": "Receptive language disorder affects understanding of spoken language. Speech therapy for improved comprehension &amp; processing.",
        "canonical": "/receptive-language-disorder.html",
        "keep_faq_jsonld": False,
    },
    "pragmatic-language-disorder.html": {
        "title": "Pragmatic Language Disorder | eMbrace Lives",
        "description": "Pragmatic language disorder affects social communication — using language appropriately in social contexts. Speech therapy at eMbrace.",
        "canonical": "/pragmatic-language-disorder.html",
        "keep_faq_jsonld": False,
    },
    "social-communication-disorder.html": {
        "title": "Social Communication Disorder | eMbrace Lives",
        "description": "Social communication disorder affects verbal &amp; non-verbal social interaction. Expert assessment &amp; therapy at eMbrace Delhi.",
        "canonical": "/social-communication-disorder.html",
        "keep_faq_jsonld": False,
    },
    "communication-skills-training.html": {
        "title": "Communication Skills Training | eMbrace Lives",
        "description": "Communication skills training for children &amp; adults — conversation skills, assertiveness, non-verbal communication &amp; social pragmatics.",
        "canonical": "/communication-skills-training.html",
        "keep_faq_jsonld": False,
    },
    "speech-assessment.html": {
        "title": "Speech Assessment &amp; Evaluation | eMbrace Lives",
        "description": "Comprehensive speech assessment evaluates articulation, phonology, fluency &amp; motor speech skills. Expert evaluation at eMbrace.",
        "canonical": "/speech-assessment.html",
        "keep_faq_jsonld": False,
    },
    "language-assessment.html": {
        "title": "Language Assessment &amp; Evaluation | eMbrace Lives",
        "description": "Comprehensive language assessment evaluates receptive &amp; expressive language skills. Identify delays &amp; plan effective therapy.",
        "canonical": "/language-assessment.html",
        "keep_faq_jsonld": False,
    },
    "speech-therapy-for-autism.html": {
        "title": "Speech Therapy for Autism | eMbrace Lives",
        "description": "Speech therapy for autistic children &amp; adults — communication support, AAC, social skills &amp; language development.",
        "canonical": "/speech-therapy-for-autism.html",
        "keep_faq_jsonld": False,
    },
    "speech-therapy-for-adhd.html": {
        "title": "Speech Therapy for ADHD | eMbrace Lives",
        "description": "Speech therapy for ADHD — addressing pragmatic language, organisation of thought &amp; conversational skills in attention challenges.",
        "canonical": "/speech-therapy-for-adhd.html",
        "keep_faq_jsonld": False,
    },
    "speech-therapy-for-children.html": {
        "title": "Speech Therapy for Children | eMbrace Lives",
        "description": "Speech therapy for children in Delhi — articulation, language, fluency &amp; social communication. Early intervention &amp; expert care.",
        "canonical": "/speech-therapy-for-children.html",
        "keep_faq_jsonld": False,
    },
    "speech-therapy-for-adults.html": {
        "title": "Speech Therapy for Adults | eMbrace Lives",
        "description": "Speech therapy for adults — aphasia, voice, stuttering, accent modification &amp; cognitive-communication therapy at eMbrace Delhi.",
        "canonical": "/speech-therapy-for-adults.html",
        "keep_faq_jsonld": False,
    },
    "occupational-therapy.html": {
        "title": "Occupational Therapy (OT) for Children | eMbrace Lives",
        "description": "Expert occupational therapy for children in Delhi — sensory integration, fine motor skills, handwriting &amp; daily living skills.",
        "canonical": "/occupational-therapy.html",
        "keep_faq_jsonld": False,
    },
    "sensory-processing-disorder.html": {
        "title": "Sensory Processing Disorder (SPD) | eMbrace Lives",
        "description": "Sensory processing disorder affects how the brain interprets sensory information. OT assessment &amp; sensory integration therapy at eMbrace.",
        "canonical": "/sensory-processing-disorder.html",
        "keep_faq_jsonld": False,
    },
    "sensory-integration-therapy.html": {
        "title": "Sensory Integration Therapy | eMbrace Lives",
        "description": "Sensory integration therapy helps children process &amp; respond to sensory information. Expert OT at eMbrace for sensory challenges.",
        "canonical": "/sensory-integration-therapy.html",
        "keep_faq_jsonld": False,
    },
    "sensory-seeking-behaviour.html": {
        "title": "Sensory Seeking Behaviour | eMbrace Lives",
        "description": "Sensory seeking behaviour in children — craving movement, touch, sound or visual input. Occupational therapy strategies &amp; support.",
        "canonical": "/sensory-seeking-behaviour.html",
        "keep_faq_jsonld": False,
    },
    "sensory-avoidance.html": {
        "title": "Sensory Avoidance &amp; Sensitivity | eMbrace Lives",
        "description": "Sensory avoidance — when children avoid certain textures, sounds, lights or movements. OT strategies for sensory sensitivities.",
        "canonical": "/sensory-avoidance.html",
        "keep_faq_jsonld": False,
    },
    "sensory-regulation.html": {
        "title": "Sensory Regulation Strategies | eMbrace Lives",
        "description": "Sensory regulation — helping children maintain an optimal arousal state for learning &amp; engagement. Occupational therapy at eMbrace.",
        "canonical": "/sensory-regulation.html",
        "keep_faq_jsonld": False,
    },
    "fine-motor-skills.html": {
        "title": "Fine Motor Skills Development | eMbrace Lives",
        "description": "Fine motor skills are essential for writing, buttoning &amp; self-care. Occupational therapy for fine motor delays at eMbrace Delhi.",
        "canonical": "/fine-motor-skills.html",
        "keep_faq_jsonld": False,
    },
    "gross-motor-skills.html": {
        "title": "Gross Motor Skills Development | eMbrace Lives",
        "description": "Gross motor skills involve large muscle movements — running, jumping, balance &amp; coordination. OT assessment &amp; intervention.",
        "canonical": "/gross-motor-skills.html",
        "keep_faq_jsonld": False,
    },
    "motor-planning.html": {
        "title": "Motor Planning &amp; Dyspraxia | eMbrace Lives",
        "description": "Motor planning (praxis) is the ability to plan &amp; execute movements. Dyspraxia affects coordination &amp; daily tasks. OT at eMbrace.",
        "canonical": "/motor-planning.html",
        "keep_faq_jsonld": False,
    },
    "handwriting-difficulties.html": {
        "title": "Handwriting Difficulties &amp; OT | eMbrace Lives",
        "description": "Handwriting difficulties — poor legibility, slow writing, grip issues. Occupational therapy for handwriting skills at eMbrace Delhi.",
        "canonical": "/handwriting-difficulties.html",
        "keep_faq_jsonld": False,
    },
    "daily-living-skills.html": {
        "title": "Daily Living Skills Training | eMbrace Lives",
        "description": "Daily living skills — dressing, feeding, grooming &amp; toileting independence. Occupational therapy to build self-care skills.",
        "canonical": "/daily-living-skills.html",
        "keep_faq_jsonld": False,
    },
    "self-care-training.html": {
        "title": "Self-Care Training (OT) | eMbrace Lives",
        "description": "Self-care training through occupational therapy — building independence in personal care tasks for children with developmental delays.",
        "canonical": "/self-care-training.html",
        "keep_faq_jsonld": False,
    },
    "occupational-therapy-assessment.html": {
        "title": "Occupational Therapy Assessment | eMbrace Lives",
        "description": "Comprehensive OT assessment — sensory processing, motor skills &amp; daily living skills. Expert evaluation at eMbrace Delhi.",
        "canonical": "/occupational-therapy-assessment.html",
        "keep_faq_jsonld": False,
    },
    "ot-for-autism.html": {
        "title": "Occupational Therapy for Autism | eMbrace Lives",
        "description": "Occupational therapy for autistic children — sensory integration, motor skills, self-care &amp; regulation strategies.",
        "canonical": "/ot-for-autism.html",
        "keep_faq_jsonld": False,
    },
    "ot-for-adhd.html": {
        "title": "Occupational Therapy for ADHD | eMbrace Lives",
        "description": "Occupational therapy for ADHD — sensory regulation, motor skills, organisational strategies &amp; focused attention support.",
        "canonical": "/ot-for-adhd.html",
        "keep_faq_jsonld": False,
    },
    "ot-for-learning-disabilities.html": {
        "title": "Occupational Therapy for Learning Disabilities | eMbrace Lives",
        "description": "Occupational therapy for learning disabilities — handwriting, motor skills, sensory processing &amp; learning readiness.",
        "canonical": "/ot-for-learning-disabilities.html",
        "keep_faq_jsonld": False,
    },
    "child-psychologist.html": {
        "title": "Child Psychologist in Delhi | eMbrace Lives",
        "description": "Expert child psychologist in Delhi — therapy for anxiety, depression, behaviour problems, school issues &amp; emotional regulation. RCI-certified.",
        "canonical": "/child-psychologist.html",
        "keep_faq_jsonld": False,
    },
    "child-counselling.html": {
        "title": "Child Counselling &amp; Therapy | eMbrace Lives",
        "description": "Child counselling in Delhi — play therapy, CBT &amp; family therapy for children facing emotional, behavioural &amp; social challenges.",
        "canonical": "/child-counselling.html",
        "keep_faq_jsonld": False,
    },
    "play-therapy.html": {
        "title": "Play Therapy for Children | eMbrace Lives",
        "description": "Play therapy helps children express feelings, process experiences &amp; develop coping skills through the natural language of play.",
        "canonical": "/play-therapy.html",
        "keep_faq_jsonld": False,
    },
    "expressive-arts-therapy.html": {
        "title": "Expressive Arts Therapy for Children | eMbrace Lives",
        "description": "Expressive arts therapy uses art, music, drama &amp; movement to help children express emotions &amp; heal from difficult experiences.",
        "canonical": "/expressive-arts-therapy.html",
        "keep_faq_jsonld": False,
    },
    "social-skills-training.html": {
        "title": "Social Skills Training for Children | eMbrace Lives",
        "description": "Social skills training for children — friendship skills, conversation, perspective-taking &amp; social problem-solving. Group &amp; individual programs.",
        "canonical": "/social-skills-training.html",
        "keep_faq_jsonld": False,
    },
    "child-anxiety.html": {
        "title": "Child Anxiety Treatment | eMbrace Lives",
        "description": "Child anxiety treatment in Delhi — CBT, play therapy &amp; parent guidance for separation anxiety, phobias, GAD &amp; social anxiety.",
        "canonical": "/child-anxiety.html",
        "keep_faq_jsonld": False,
    },
    "child-depression.html": {
        "title": "Child Depression Treatment | eMbrace Lives",
        "description": "Child depression treatment in Delhi — therapy for persistent sadness, irritability, withdrawal &amp; loss of interest. Expert child psychologists.",
        "canonical": "/child-depression.html",
        "keep_faq_jsonld": False,
    },
    "child-stress.html": {
        "title": "Child Stress &amp; Coping Strategies | eMbrace Lives",
        "description": "Child stress — academic pressure, social challenges &amp; family changes. Learn coping strategies &amp; therapeutic support at eMbrace.",
        "canonical": "/child-stress.html",
        "keep_faq_jsonld": False,
    },
    "child-behaviour-problems.html": {
        "title": "Child Behaviour Problems | eMbrace Lives",
        "description": "Child behaviour problems — aggression, defiance, tantrums &amp; self-regulation difficulties. Behaviour therapy &amp; parent training in Delhi.",
        "canonical": "/child-behaviour-problems.html",
        "keep_faq_jsonld": False,
    },
    "temper-tantrums.html": {
        "title": "Temper Tantrums in Children | eMbrace Lives",
        "description": "Temper tantrums — understanding triggers, prevention strategies &amp; positive discipline approaches. Expert parent guidance at eMbrace.",
        "canonical": "/temper-tantrums.html",
        "keep_faq_jsonld": False,
    },
    "emotional-regulation.html": {
        "title": "Emotional Regulation in Children | eMbrace Lives",
        "description": "Emotional regulation skills for children — identifying feelings, managing reactions &amp; developing coping strategies. Therapy at eMbrace.",
        "canonical": "/emotional-regulation.html",
        "keep_faq_jsonld": False,
    },
    "anger-management-for-children.html": {
        "title": "Anger Management for Children | eMbrace Lives",
        "description": "Anger management for children — understanding anger, calming strategies &amp; healthy expression. Child therapy at eMbrace Delhi.",
        "canonical": "/anger-management-for-children.html",
        "keep_faq_jsonld": False,
    },
    "peer-relationship-problems.html": {
        "title": "Peer Relationship Problems in Children | eMbrace Lives",
        "description": "Peer relationship problems — difficulty making friends, social exclusion &amp; conflict. Social skills therapy at eMbrace.",
        "canonical": "/peer-relationship-problems.html",
        "keep_faq_jsonld": False,
    },
    "bullying-support.html": {
        "title": "Bullying Support for Children | eMbrace Lives",
        "description": "Bullying support for children — coping with peer victimisation, building assertiveness &amp; developing resilience. Therapy at eMbrace Delhi.",
        "canonical": "/bullying-support.html",
        "keep_faq_jsonld": False,
    },
    "school-refusal.html": {
        "title": "School Refusal in Children | eMbrace Lives",
        "description": "School refusal — when children avoid or refuse school due to anxiety or distress. Learn about causes, assessment, and evidence-based interventions.",
        "canonical": "/school-refusal.html",
        "keep_faq_jsonld": False,
    },
    "academic-stress.html": {
        "title": "Academic Stress in Children | eMbrace Lives",
        "description": "Academic stress affects mental health and performance. Learn strategies for managing homework pressure, exam anxiety, and perfectionism.",
        "canonical": "/academic-stress.html",
        "keep_faq_jsonld": False,
    },
    "low-self-esteem.html": {
        "title": "Low Self-Esteem in Children | eMbrace Lives",
        "description": "Low self-esteem in children — signs, causes, and therapeutic approaches to build confidence, self-worth, and a positive self-image.",
        "canonical": "/low-self-esteem.html",
        "keep_faq_jsonld": False,
    },
    "confidence-building.html": {
        "title": "Confidence Building for Children | eMbrace Lives",
        "description": "Confidence building for children — fostering self-belief, resilience, and a growth mindset through therapy and supportive parenting.",
        "canonical": "/confidence-building.html",
        "keep_faq_jsonld": False,
    },
    "grief-counselling-for-children.html": {
        "title": "Grief Counselling for Children | eMbrace Lives",
        "description": "Grief counselling for children who have experienced loss. Play-based and talk therapy approaches to help children process grief and find healing.",
        "canonical": "/grief-counselling-for-children.html",
        "keep_faq_jsonld": False,
    },
    "trauma-support-for-children.html": {
        "title": "Trauma Support for Children | eMbrace Lives",
        "description": "Trauma-informed therapy for children — healing from abuse, accidents, medical trauma, or witnessing violence. Evidence-based trauma treatments like TF-CBT.",
        "canonical": "/trauma-support-for-children.html",
        "keep_faq_jsonld": False,
    },
    "teen-counselling.html": {
        "title": "Teen Counselling & Support | eMbrace",
        "description": "Professional teen counselling and therapy in Delhi for anxiety, depression, stress, and emotional wellbeing. Supportive adolescent mental health care.",
        "canonical": "/teen-counselling.html",
        "keep_faq_jsonld": False,
    },
    "teen-anxiety.html": {
        "title": "Teen Anxiety Therapy | eMbrace",
        "description": "Overcome teen anxiety with expert therapy in Delhi. CBT, exposure therapy, and family support for adolescent anxiety disorders.",
        "canonical": "/teen-anxiety.html",
        "keep_faq_jsonld": False,
    },
    "teen-depression.html": {
        "title": "Teen Depression Treatment | eMbrace",
        "description": "Expert teen depression treatment in Delhi. Evidence-based therapy for adolescent depression, mood disorders, and emotional wellbeing.",
        "canonical": "/teen-depression.html",
        "keep_faq_jsonld": False,
    },
    "teen-stress.html": {
        "title": "Teen Stress Management | eMbrace",
        "description": "Teen stress management and coping skills in Delhi. Help your adolescent manage academic, social, and personal stress effectively.",
        "canonical": "/teen-stress.html",
        "keep_faq_jsonld": False,
    },
    "social-anxiety-in-teens.html": {
        "title": "Social Anxiety in Teens | eMbrace",
        "description": "Expert treatment for social anxiety in teens in Delhi. CBT, social skills training, and graduated exposure therapy.",
        "canonical": "/social-anxiety-in-teens.html",
        "keep_faq_jsonld": False,
    },
    "peer-pressure.html": {
        "title": "Peer Pressure Counselling | eMbrace",
        "description": "Peer pressure counselling for teens in Delhi. Build assertiveness, decision-making skills, and confidence to navigate social influences.",
        "canonical": "/peer-pressure.html",
        "keep_faq_jsonld": False,
    },
    "digital-addiction.html": {
        "title": "Digital Addiction Therapy | eMbrace",
        "description": "Digital addiction therapy for teens in Delhi. Screen time management, gaming addiction treatment, and healthy tech habits.",
        "canonical": "/digital-addiction.html",
        "keep_faq_jsonld": False,
    },
    "gaming-addiction.html": {
        "title": "Gaming Addiction Treatment | eMbrace",
        "description": "Gaming addiction treatment for teens in Delhi. Evidence-based therapy for gaming disorder and problematic screen use.",
        "canonical": "/gaming-addiction.html",
        "keep_faq_jsonld": False,
    },
    "career-stress.html": {
        "title": "Teen Career Stress Counselling | eMbrace",
        "description": "Career stress counselling for teens in Delhi. Navigate academic pressure, career choices, and parental expectations with professional support.",
        "canonical": "/career-stress.html",
        "keep_faq_jsonld": False,
    },
    "exam-anxiety.html": {
        "title": "Exam Anxiety Therapy | eMbrace",
        "description": "Exam anxiety therapy for students in Delhi. Overcome test stress with CBT, relaxation techniques, and effective study strategies.",
        "canonical": "/exam-anxiety.html",
        "keep_faq_jsonld": False,
    },
    "college-transition-support.html": {
        "title": "College Transition Support | eMbrace",
        "description": "College transition support for students in Delhi. Pre-college counselling, adjustment support, and mental health care for new college students.",
        "canonical": "/college-transition-support.html",
        "keep_faq_jsonld": False,
    },
    "self-esteem-for-teens.html": {
        "title": "Self-Esteem for Teens | eMbrace",
        "description": "Build teen self-esteem with expert counselling in Delhi. Confidence building, self-compassion, and strengths-based therapy.",
        "canonical": "/self-esteem-for-teens.html",
        "keep_faq_jsonld": False,
    },
    "emotional-regulation-for-teens.html": {
        "title": "Emotional Regulation for Teens | eMbrace",
        "description": "Emotional regulation skills for teens in Delhi. DBT-informed therapy, mindfulness, and coping strategies for emotional wellbeing.",
        "canonical": "/emotional-regulation-for-teens.html",
        "keep_faq_jsonld": False,
    },
    "anger-management-for-teens.html": {
        "title": "Anger Management for Teens | eMbrace",
        "description": "Anger management therapy for teens in Delhi. Learn to understand, express, and channel anger constructively.",
        "canonical": "/anger-management-for-teens.html",
        "keep_faq_jsonld": False,
    },
    "teen-relationship-issues.html": {
        "title": "Teen Relationship Counselling | eMbrace",
        "description": "Teen relationship counselling in Delhi. Navigate dating, friendships, breakups, and social dynamics with professional support.",
        "canonical": "/teen-relationship-issues.html",
        "keep_faq_jsonld": False,
    },
    "adult-counselling.html": {
        "title": "Adult Counselling & Therapy | eMbrace",
        "description": "Professional adult counselling and therapy in Delhi for anxiety, depression, relationships, stress, and personal growth.",
        "canonical": "/adult-counselling.html",
        "keep_faq_jsonld": False,
    },
    "adult-anxiety.html": {
        "title": "Adult Anxiety Treatment | eMbrace",
        "description": "Adult anxiety treatment in Delhi. Evidence-based therapy for GAD, panic disorder, social anxiety, and health anxiety.",
        "canonical": "/adult-anxiety.html",
        "keep_faq_jsonld": False,
    },
    "adult-depression.html": {
        "title": "Adult Depression Treatment | eMbrace",
        "description": "Adult depression treatment in Delhi. CBT, behavioural activation, and collaborative care for lasting recovery.",
        "canonical": "/adult-depression.html",
        "keep_faq_jsonld": False,
    },
    "stress-management.html": {
        "title": "Stress Management Therapy | eMbrace",
        "description": "Stress management therapy in Delhi. Learn practical skills for managing workplace, relationship, and life stress.",
        "canonical": "/stress-management.html",
        "keep_faq_jsonld": False,
    },
    "life-transitions.html": {
        "title": "Life Transition Counselling | eMbrace",
        "description": "Life transition counselling in Delhi. Support for career changes, relocation, divorce, parenthood, and other major life shifts.",
        "canonical": "/life-transitions.html",
        "keep_faq_jsonld": False,
    },
    "burnout-counselling.html": {
        "title": "Burnout Counselling & Recovery | eMbrace",
        "description": "Burnout counselling and recovery in Delhi. Overcome exhaustion, cynicism, and reduced effectiveness with professional support.",
        "canonical": "/burnout-counselling.html",
        "keep_faq_jsonld": False,
    },
    "premarital-counselling.html": {
        "title": "Premarital Counselling | eMbrace",
        "description": "Premarital counselling in Delhi. Build a strong foundation for marriage with evidence-based relationship preparation.",
        "canonical": "/premarital-counselling.html",
        "keep_faq_jsonld": False,
    },
    "relationship-counselling.html": {
        "title": "Relationship Counselling | eMbrace",
        "description": "Relationship counselling in Delhi. Improve communication, resolve conflicts, and strengthen your relationships.",
        "canonical": "/relationship-counselling.html",
        "keep_faq_jsonld": False,
    },
    "couples-therapy.html": {
        "title": "Couples Therapy | eMbrace",
        "description": "Couples therapy in Delhi. Gottman Method, EFT, and evidence-based approaches for couples at any stage.",
        "canonical": "/couples-therapy.html",
        "keep_faq_jsonld": False,
    },
    "marital-counselling.html": {
        "title": "Marital Counselling | eMbrace",
        "description": "Marital counselling in Delhi. Culturally sensitive therapy for Indian couples facing communication, trust, and intimacy challenges.",
        "canonical": "/marital-counselling.html",
        "keep_faq_jsonld": False,
    },
    "grief-counselling.html": {
        "title": "Grief Counselling | eMbrace",
        "description": "Grief counselling in Delhi. Compassionate support for loss, bereavement, and complicated grief.",
        "canonical": "/grief-counselling.html",
        "keep_faq_jsonld": False,
    },
    "trauma-therapy.html": {
        "title": "Trauma Therapy | eMbrace",
        "description": "Trauma therapy in Delhi. EMDR, TF-CBT, and somatic approaches for PTSD and complex trauma.",
        "canonical": "/trauma-therapy.html",
        "keep_faq_jsonld": False,
    },
    "mindfulness-therapy.html": {
        "title": "Mindfulness Therapy | eMbrace",
        "description": "Mindfulness therapy in Delhi. MBCT, MBSR, and mindfulness-based approaches for anxiety, depression, and stress.",
        "canonical": "/mindfulness-therapy.html",
        "keep_faq_jsonld": False,
    },
    "self-esteem-counselling.html": {
        "title": "Self-Esteem Counselling | eMbrace",
        "description": "Self-esteem counselling in Delhi. Build authentic confidence and self-worth with evidence-based therapy.",
        "canonical": "/self-esteem-counselling.html",
        "keep_faq_jsonld": False,
    },
    "workplace-stress.html": {
        "title": "Workplace Stress Counselling | eMbrace",
        "description": "Workplace stress counselling in Delhi. Manage work pressure, improve work-life balance, and prevent burnout.",
        "canonical": "/workplace-stress.html",
        "keep_faq_jsonld": False,
    },
    "adult-autism-support.html": {
        "title": "Adult Autism Support | eMbrace",
        "description": "Adult autism support in Delhi. Assessment, post-diagnostic support, and neurodiversity-affirming therapy for autistic adults.",
        "canonical": "/adult-autism-support.html",
        "keep_faq_jsonld": False,
    },
    "adult-adhd-support.html": {
        "title": "Adult ADHD Support | eMbrace",
        "description": "Adult ADHD support in Delhi. Assessment, coaching, CBT, and workplace strategies for adults with ADHD.",
        "canonical": "/adult-adhd-support.html",
        "keep_faq_jsonld": False,
    },
    "executive-function-coaching-for-adults.html": {
        "title": "Executive Function Coaching for Adults | eMbrace",
        "description": "Executive function coaching for adults in Delhi. Time management, organisation, planning, and productivity support.",
        "canonical": "/executive-function-coaching-for-adults.html",
        "keep_faq_jsonld": False,
    },
    "parents.html": {
        "title": "Parent Support & Counselling | eMbrace",
        "description": "Parent support and counselling in Delhi. Parenting strategies, behaviour management, school advocacy, and emotional support for parents.",
        "canonical": "/parents.html",
        "keep_faq_jsonld": False,
    },
    "parent-counselling.html": {
        "title": "Parent Counselling | eMbrace",
        "description": "Parent counselling in Delhi. One-on-one and joint counselling for parenting challenges, stress, and family dynamics.",
        "canonical": "/parent-counselling.html",
        "keep_faq_jsonld": False,
    },
    "parent-burnout.html": {
        "title": "Parent Burnout Support | eMbrace",
        "description": "Parent burnout support in Delhi. Recover from exhaustion, rebuild your energy, and find joy in parenting again.",
        "canonical": "/parent-burnout.html",
        "keep_faq_jsonld": False,
    },
    "caregiver-support.html": {
        "title": "Caregiver Support Services | eMbrace",
        "description": "Caregiver support in Delhi. Counselling, respite planning, and practical support for parents and caregivers of special needs children.",
        "canonical": "/caregiver-support.html",
        "keep_faq_jsonld": False,
    },
    "positive-parenting.html": {
        "title": "Positive Parenting | eMbrace",
        "description": "Positive parenting programs in Delhi. Evidence-based strategies for building connection, cooperation, and emotional intelligence.",
        "canonical": "/positive-parenting.html",
        "keep_faq_jsonld": False,
    },
    "new-parent-support.html": {
        "title": "New Parent Support | eMbrace",
        "description": "New parent support in Delhi. Postpartum mental health, baby care guidance, and emotional support for new parents.",
        "canonical": "/new-parent-support.html",
        "keep_faq_jsonld": False,
    },
    "parent-support-groups.html": {
        "title": "Parent Support Groups | eMbrace",
        "description": "Parent support groups in Delhi. Connect with other parents, share experiences, and build your support network.",
        "canonical": "/parent-support-groups.html",
        "keep_faq_jsonld": False,
    },
    "raising-a-child-with-autism.html": {
        "title": "Raising a Child with Autism | eMbrace",
        "description": "Support for raising a child with autism in Delhi. Parent guidance, behaviour support, and advocacy for autistic children.",
        "canonical": "/raising-a-child-with-autism.html",
        "keep_faq_jsonld": False,
    },
    "raising-a-child-with-adhd.html": {
        "title": "Raising a Child with ADHD | eMbrace",
        "description": "Support for raising a child with ADHD in Delhi. Parent training, behaviour strategies, and school advocacy.",
        "canonical": "/raising-a-child-with-adhd.html",
        "keep_faq_jsonld": False,
    },
    "siblings-of-neurodivergent-children.html": {
        "title": "Supporting Siblings of Neurodivergent Children | eMbrace",
        "description": "Sibling support services in Delhi. Counselling and programs for siblings of children with autism, ADHD, and other neurodivergences.",
        "canonical": "/siblings-of-neurodivergent-children.html",
        "keep_faq_jsonld": False,
    },
    "managing-meltdowns.html": {
        "title": "Managing Meltdowns | eMbrace",
        "description": "Meltdown management strategies in Delhi. Understand, prevent, and respond effectively to autistic and ADHD meltdowns.",
        "canonical": "/managing-meltdowns.html",
        "keep_faq_jsonld": False,
    },
    "behaviour-management-at-home.html": {
        "title": "Behaviour Management at Home | eMbrace",
        "description": "Behaviour management strategies for parents in Delhi. Positive reinforcement, routines, and natural consequences.",
        "canonical": "/behaviour-management-at-home.html",
        "keep_faq_jsonld": False,
    },
    "school-communication.html": {
        "title": "Parent-School Communication | eMbrace",
        "description": "Parent-school communication coaching in Delhi. Advocate effectively for your child's educational needs.",
        "canonical": "/school-communication.html",
        "keep_faq_jsonld": False,
    },
    "iep-guide.html": {
        "title": "IEP Guide for Parents | eMbrace",
        "description": "IEP guide for parents in Delhi. Understand Individualised Education Plans, advocate for services, and support your child's learning.",
        "canonical": "/iep-guide.html",
        "keep_faq_jsonld": False,
    },
    "inclusive-school-guide.html": {
        "title": "Inclusive School Guide | eMbrace",
        "description": "Guide to inclusive schools in Delhi. Find, evaluate, and advocate for inclusive education placements.",
        "canonical": "/inclusive-school-guide.html",
        "keep_faq_jsonld": False,
    },
    "transition-planning-for-parents.html": {
        "title": "Transition Planning for Parents | eMbrace",
        "description": "Transition planning for parents in Delhi. Prepare your child for school changes, college, and life transitions.",
        "canonical": "/transition-planning-for-parents.html",
        "keep_faq_jsonld": False,
    },
    "school-partnerships.html": {
        "title": "School Partnerships | eMbrace",
        "description": "School partnerships with eMbrace in Delhi. Flexible partnership models for mental health support, counselling, and wellness programs.",
        "canonical": "/school-partnerships.html",
        "keep_faq_jsonld": False,
    },
    "school-counselling.html": {
        "title": "School Counselling Services | eMbrace",
        "description": "School counselling services in Delhi. On-site and off-site counselling, counsellor supervision, and program development.",
        "canonical": "/school-counselling.html",
        "keep_faq_jsonld": False,
    },
    "school-screening-programs.html": {
        "title": "School Screening Programs | eMbrace",
        "description": "School mental health screening programs in Delhi. Early identification of learning, developmental, and mental health concerns.",
        "canonical": "/school-screening-programs.html",
        "keep_faq_jsonld": False,
    },
    "school-wellness-programs.html": {
        "title": "School Wellness Programs | eMbrace",
        "description": "School wellness programs in Delhi. Mindfulness, yoga, mental health awareness, and holistic wellbeing for students.",
        "canonical": "/school-wellness-programs.html",
        "keep_faq_jsonld": False,
    },
    "school-mental-health-programs.html": {
        "title": "School Mental Health Programs | eMbrace",
        "description": "Comprehensive school mental health programs in Delhi. Tiered support systems, staff training, and parent engagement.",
        "canonical": "/school-mental-health-programs.html",
        "keep_faq_jsonld": False,
    },
    "inclusive-education-consulting.html": {
        "title": "Inclusive Education Consulting | eMbrace",
        "description": "Inclusive education consulting in Delhi. Help your school transition to inclusive practices with expert guidance.",
        "canonical": "/inclusive-education-consulting.html",
        "keep_faq_jsonld": False,
    },
    "autism-in-the-classroom.html": {
        "title": "Autism in the Classroom | eMbrace",
        "description": "Supporting autistic students in the classroom in Delhi. Teacher training, accommodations, and inclusive strategies.",
        "canonical": "/autism-in-the-classroom.html",
        "keep_faq_jsonld": False,
    },
    "adhd-in-the-classroom.html": {
        "title": "ADHD in the Classroom | eMbrace",
        "description": "Supporting ADHD students in the classroom in Delhi. Teacher training, accommodations, and behaviour support strategies.",
        "canonical": "/adhd-in-the-classroom.html",
        "keep_faq_jsonld": False,
    },
    "learning-disabilities-in-school.html": {
        "title": "Supporting Learning Disabilities in School | eMbrace",
        "description": "Support for learning disabilities in schools in Delhi. Identification, accommodations, and teacher training.",
        "canonical": "/learning-disabilities-in-school.html",
        "keep_faq_jsonld": False,
    },
    "special-education-consulting.html": {
        "title": "Special Education Consulting | eMbrace",
        "description": "Special education consulting in Delhi. Program development, staff training, and compliance support for schools.",
        "canonical": "/special-education-consulting.html",
        "keep_faq_jsonld": False,
    },
    "classroom-accommodations.html": {
        "title": "Classroom Accommodations Guide | eMbrace",
        "description": "Classroom accommodations guide for schools in Delhi. Legal requirements, implementation, and best practices.",
        "canonical": "/classroom-accommodations.html",
        "keep_faq_jsonld": False,
    },
    "teacher-training.html": {
        "title": "Teacher Training Programs | eMbrace",
        "description": "Teacher training programs in Delhi. Mental health literacy, inclusive practices, behaviour management, and teacher wellbeing.",
        "canonical": "/teacher-training.html",
        "keep_faq_jsonld": False,
    },
    "teacher-wellbeing-programs.html": {
        "title": "Teacher Wellbeing Programs | eMbrace",
        "description": "Teacher wellbeing programs in Delhi. Counselling, stress management, and support for educator mental health.",
        "canonical": "/teacher-wellbeing-programs.html",
        "keep_faq_jsonld": False,
    },
    "manager-training.html": {
        "title": "School Manager Training | eMbrace",
        "description": "School manager and leader training in Delhi. Mental health leadership, crisis management, and supportive school culture.",
        "canonical": "/manager-training.html",
        "keep_faq_jsonld": False,
    },
    "corporates.html": {
        "title": "Corporate Wellness Programs | eMbrace",
        "description": "Corporate wellness and employee mental health programs in Delhi. EAP, stress management, neurodiversity inclusion, and wellbeing consulting.",
        "canonical": "/corporates.html",
        "keep_faq_jsonld": False,
    },
    "corporate-wellness.html": {
        "title": "Corporate Wellness Solutions | eMbrace",
        "description": "Corporate wellness solutions in Delhi. Customised employee wellbeing programs, health initiatives, and mental health support.",
        "canonical": "/corporate-wellness.html",
        "keep_faq_jsonld": False,
    },
    "employee-mental-health.html": {
        "title": "Employee Mental Health Programs | eMbrace",
        "description": "Employee mental health programs in Delhi. Awareness, counselling access, manager training, and supportive workplace policies.",
        "canonical": "/employee-mental-health.html",
        "keep_faq_jsonld": False,
    },
    "employee-assistance-programs.html": {
        "title": "Employee Assistance Programs (EAP) | eMbrace",
        "description": "Employee Assistance Programs in Delhi. Confidential counselling, crisis support, and work-life resources for employees.",
        "canonical": "/employee-assistance-programs.html",
        "keep_faq_jsonld": False,
    },
    "burnout-prevention.html": {
        "title": "Burnout Prevention Programs | eMbrace",
        "description": "Burnout prevention programs for organisations in Delhi. Assessment, training, and systemic solutions for workplace wellbeing.",
        "canonical": "/burnout-prevention.html",
        "keep_faq_jsonld": False,
    },
    "workplace-anxiety.html": {
        "title": "Workplace Anxiety Support | eMbrace",
        "description": "Workplace anxiety support in Delhi. Individual counselling and organisational programs for anxiety at work.",
        "canonical": "/workplace-anxiety.html",
        "keep_faq_jsonld": False,
    },
    "leadership-wellbeing.html": {
        "title": "Leadership Wellbeing Programs | eMbrace",
        "description": "Leadership wellbeing and executive coaching in Delhi. Support for leaders facing unique pressures and responsibilities.",
        "canonical": "/leadership-wellbeing.html",
        "keep_faq_jsonld": False,
    },
    "neurodiversity-at-work.html": {
        "title": "Neurodiversity in the Workplace | eMbrace",
        "description": "Neurodiversity inclusion in the workplace in Delhi. Consulting, training, and support for hiring and retaining neurodivergent talent.",
        "canonical": "/neurodiversity-at-work.html",
        "keep_faq_jsonld": False,
    },
    "inclusive-hiring.html": {
        "title": "Inclusive Hiring Practices | eMbrace",
        "description": "Inclusive hiring practices in Delhi. Redesign recruitment to attract and assess neurodivergent candidates fairly.",
        "canonical": "/inclusive-hiring.html",
        "keep_faq_jsonld": False,
    },
    "workplace-adhd-support.html": {
        "title": "Workplace ADHD Support | eMbrace",
        "description": "Workplace ADHD support in Delhi. Coaching, accommodations, and manager training for ADHD employees.",
        "canonical": "/workplace-adhd-support.html",
        "keep_faq_jsonld": False,
    },
    "workplace-autism-support.html": {
        "title": "Workplace Autism Support | eMbrace",
        "description": "Workplace autism support in Delhi. Consulting, coaching, and accommodations for autistic employees.",
        "canonical": "/workplace-autism-support.html",
        "keep_faq_jsonld": False,
    },
    "workplace-accommodations.html": {
        "title": "Workplace Accommodations | eMbrace",
        "description": "Workplace accommodations for neurodivergent employees in Delhi. Implementation guidance and legal compliance.",
        "canonical": "/workplace-accommodations.html",
        "keep_faq_jsonld": False,
    },
    "autism-assessment-in-delhi.html": {
        "title": "Autism Assessment in Delhi | eMbrace",
        "description": "Professional autism assessment services in Delhi, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/autism-assessment-in-delhi.html",
        "keep_faq_jsonld": False,
    },
    "autism-assessment-in-saket.html": {
        "title": "Autism Assessment in Saket | eMbrace",
        "description": "Professional autism assessment services in Saket, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/autism-assessment-in-saket.html",
        "keep_faq_jsonld": False,
    },
    "autism-assessment-in-south-delhi.html": {
        "title": "Autism Assessment in South Delhi | eMbrace",
        "description": "Professional autism assessment services in South Delhi, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/autism-assessment-in-south-delhi.html",
        "keep_faq_jsonld": False,
    },
    "autism-assessment-in-greater-kailash.html": {
        "title": "Autism Assessment in Greater Kailash | eMbrace",
        "description": "Professional autism assessment services in Greater Kailash, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/autism-assessment-in-greater-kailash.html",
        "keep_faq_jsonld": False,
    },
    "autism-assessment-in-vasant-kunj.html": {
        "title": "Autism Assessment in Vasant Kunj | eMbrace",
        "description": "Professional autism assessment services in Vasant Kunj, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/autism-assessment-in-vasant-kunj.html",
        "keep_faq_jsonld": False,
    },
    "autism-assessment-in-defence-colony.html": {
        "title": "Autism Assessment in Defence Colony | eMbrace",
        "description": "Professional autism assessment services in Defence Colony, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/autism-assessment-in-defence-colony.html",
        "keep_faq_jsonld": False,
    },
    "autism-assessment-in-gurgaon.html": {
        "title": "Autism Assessment in Gurgaon | eMbrace",
        "description": "Professional autism assessment services in Gurgaon, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/autism-assessment-in-gurgaon.html",
        "keep_faq_jsonld": False,
    },
    "autism-assessment-in-green-park.html": {
        "title": "Autism Assessment in Green Park | eMbrace",
        "description": "Professional autism assessment services in Green Park, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/autism-assessment-in-green-park.html",
        "keep_faq_jsonld": False,
    },
    "autism-assessment-in-noida.html": {
        "title": "Autism Assessment in Noida | eMbrace",
        "description": "Professional autism assessment services in Noida, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/autism-assessment-in-noida.html",
        "keep_faq_jsonld": False,
    },
    "autism-assessment-in-hauz-khas.html": {
        "title": "Autism Assessment in Hauz Khas | eMbrace",
        "description": "Professional autism assessment services in Hauz Khas, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/autism-assessment-in-hauz-khas.html",
        "keep_faq_jsonld": False,
    },
    "adhd-assessment-in-delhi.html": {
        "title": "ADHD Assessment in Delhi | eMbrace",
        "description": "Professional adhd assessment services in Delhi, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/adhd-assessment-in-delhi.html",
        "keep_faq_jsonld": False,
    },
    "adhd-assessment-in-saket.html": {
        "title": "ADHD Assessment in Saket | eMbrace",
        "description": "Professional adhd assessment services in Saket, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/adhd-assessment-in-saket.html",
        "keep_faq_jsonld": False,
    },
    "adhd-assessment-in-south-delhi.html": {
        "title": "ADHD Assessment in South Delhi | eMbrace",
        "description": "Professional adhd assessment services in South Delhi, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/adhd-assessment-in-south-delhi.html",
        "keep_faq_jsonld": False,
    },
    "adhd-assessment-in-greater-kailash.html": {
        "title": "ADHD Assessment in Greater Kailash | eMbrace",
        "description": "Professional adhd assessment services in Greater Kailash, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/adhd-assessment-in-greater-kailash.html",
        "keep_faq_jsonld": False,
    },
    "adhd-assessment-in-vasant-kunj.html": {
        "title": "ADHD Assessment in Vasant Kunj | eMbrace",
        "description": "Professional adhd assessment services in Vasant Kunj, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/adhd-assessment-in-vasant-kunj.html",
        "keep_faq_jsonld": False,
    },
    "adhd-assessment-in-defence-colony.html": {
        "title": "ADHD Assessment in Defence Colony | eMbrace",
        "description": "Professional adhd assessment services in Defence Colony, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/adhd-assessment-in-defence-colony.html",
        "keep_faq_jsonld": False,
    },
    "adhd-assessment-in-gurgaon.html": {
        "title": "ADHD Assessment in Gurgaon | eMbrace",
        "description": "Professional adhd assessment services in Gurgaon, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/adhd-assessment-in-gurgaon.html",
        "keep_faq_jsonld": False,
    },
    "adhd-assessment-in-green-park.html": {
        "title": "ADHD Assessment in Green Park | eMbrace",
        "description": "Professional adhd assessment services in Green Park, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/adhd-assessment-in-green-park.html",
        "keep_faq_jsonld": False,
    },
    "adhd-assessment-in-noida.html": {
        "title": "ADHD Assessment in Noida | eMbrace",
        "description": "Professional adhd assessment services in Noida, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/adhd-assessment-in-noida.html",
        "keep_faq_jsonld": False,
    },
    "adhd-assessment-in-hauz-khas.html": {
        "title": "ADHD Assessment in Hauz Khas | eMbrace",
        "description": "Professional adhd assessment services in Hauz Khas, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/adhd-assessment-in-hauz-khas.html",
        "keep_faq_jsonld": False,
    },
    "speech-therapy-in-delhi.html": {
        "title": "Speech Therapy in Delhi | eMbrace",
        "description": "Professional speech therapy services in Delhi, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/speech-therapy-in-delhi.html",
        "keep_faq_jsonld": False,
    },
    "speech-therapy-in-saket.html": {
        "title": "Speech Therapy in Saket | eMbrace",
        "description": "Professional speech therapy services in Saket, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/speech-therapy-in-saket.html",
        "keep_faq_jsonld": False,
    },
    "speech-therapy-in-south-delhi.html": {
        "title": "Speech Therapy in South Delhi | eMbrace",
        "description": "Professional speech therapy services in South Delhi, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/speech-therapy-in-south-delhi.html",
        "keep_faq_jsonld": False,
    },
    "speech-therapy-in-greater-kailash.html": {
        "title": "Speech Therapy in Greater Kailash | eMbrace",
        "description": "Professional speech therapy services in Greater Kailash, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/speech-therapy-in-greater-kailash.html",
        "keep_faq_jsonld": False,
    },
    "speech-therapy-in-vasant-kunj.html": {
        "title": "Speech Therapy in Vasant Kunj | eMbrace",
        "description": "Professional speech therapy services in Vasant Kunj, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/speech-therapy-in-vasant-kunj.html",
        "keep_faq_jsonld": False,
    },
    "speech-therapy-in-defence-colony.html": {
        "title": "Speech Therapy in Defence Colony | eMbrace",
        "description": "Professional speech therapy services in Defence Colony, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/speech-therapy-in-defence-colony.html",
        "keep_faq_jsonld": False,
    },
    "speech-therapy-in-gurgaon.html": {
        "title": "Speech Therapy in Gurgaon | eMbrace",
        "description": "Professional speech therapy services in Gurgaon, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/speech-therapy-in-gurgaon.html",
        "keep_faq_jsonld": False,
    },
    "speech-therapy-in-green-park.html": {
        "title": "Speech Therapy in Green Park | eMbrace",
        "description": "Professional speech therapy services in Green Park, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/speech-therapy-in-green-park.html",
        "keep_faq_jsonld": False,
    },
    "speech-therapy-in-noida.html": {
        "title": "Speech Therapy in Noida | eMbrace",
        "description": "Professional speech therapy services in Noida, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/speech-therapy-in-noida.html",
        "keep_faq_jsonld": False,
    },
    "speech-therapy-in-hauz-khas.html": {
        "title": "Speech Therapy in Hauz Khas | eMbrace",
        "description": "Professional speech therapy services in Hauz Khas, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/speech-therapy-in-hauz-khas.html",
        "keep_faq_jsonld": False,
    },
    "occupational-therapy-in-delhi.html": {
        "title": "Occupational Therapy in Delhi | eMbrace",
        "description": "Professional occupational therapy services in Delhi, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/occupational-therapy-in-delhi.html",
        "keep_faq_jsonld": False,
    },
    "occupational-therapy-in-saket.html": {
        "title": "Occupational Therapy in Saket | eMbrace",
        "description": "Professional occupational therapy services in Saket, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/occupational-therapy-in-saket.html",
        "keep_faq_jsonld": False,
    },
    "occupational-therapy-in-south-delhi.html": {
        "title": "Occupational Therapy in South Delhi | eMbrace",
        "description": "Professional occupational therapy services in South Delhi, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/occupational-therapy-in-south-delhi.html",
        "keep_faq_jsonld": False,
    },
    "occupational-therapy-in-greater-kailash.html": {
        "title": "Occupational Therapy in Greater Kailash | eMbrace",
        "description": "Professional occupational therapy services in Greater Kailash, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/occupational-therapy-in-greater-kailash.html",
        "keep_faq_jsonld": False,
    },
    "occupational-therapy-in-vasant-kunj.html": {
        "title": "Occupational Therapy in Vasant Kunj | eMbrace",
        "description": "Professional occupational therapy services in Vasant Kunj, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/occupational-therapy-in-vasant-kunj.html",
        "keep_faq_jsonld": False,
    },
    "occupational-therapy-in-defence-colony.html": {
        "title": "Occupational Therapy in Defence Colony | eMbrace",
        "description": "Professional occupational therapy services in Defence Colony, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/occupational-therapy-in-defence-colony.html",
        "keep_faq_jsonld": False,
    },
    "occupational-therapy-in-gurgaon.html": {
        "title": "Occupational Therapy in Gurgaon | eMbrace",
        "description": "Professional occupational therapy services in Gurgaon, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/occupational-therapy-in-gurgaon.html",
        "keep_faq_jsonld": False,
    },
    "occupational-therapy-in-green-park.html": {
        "title": "Occupational Therapy in Green Park | eMbrace",
        "description": "Professional occupational therapy services in Green Park, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/occupational-therapy-in-green-park.html",
        "keep_faq_jsonld": False,
    },
    "occupational-therapy-in-noida.html": {
        "title": "Occupational Therapy in Noida | eMbrace",
        "description": "Professional occupational therapy services in Noida, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/occupational-therapy-in-noida.html",
        "keep_faq_jsonld": False,
    },
    "occupational-therapy-in-hauz-khas.html": {
        "title": "Occupational Therapy in Hauz Khas | eMbrace",
        "description": "Professional occupational therapy services in Hauz Khas, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/occupational-therapy-in-hauz-khas.html",
        "keep_faq_jsonld": False,
    },
    "child-psychologist-in-delhi.html": {
        "title": "Child Psychologist in Delhi | eMbrace",
        "description": "Professional child psychologist services in Delhi, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/child-psychologist-in-delhi.html",
        "keep_faq_jsonld": False,
    },
    "child-psychologist-in-saket.html": {
        "title": "Child Psychologist in Saket | eMbrace",
        "description": "Professional child psychologist services in Saket, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/child-psychologist-in-saket.html",
        "keep_faq_jsonld": False,
    },
    "child-psychologist-in-south-delhi.html": {
        "title": "Child Psychologist in South Delhi | eMbrace",
        "description": "Professional child psychologist services in South Delhi, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/child-psychologist-in-south-delhi.html",
        "keep_faq_jsonld": False,
    },
    "child-psychologist-in-greater-kailash.html": {
        "title": "Child Psychologist in Greater Kailash | eMbrace",
        "description": "Professional child psychologist services in Greater Kailash, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/child-psychologist-in-greater-kailash.html",
        "keep_faq_jsonld": False,
    },
    "child-psychologist-in-vasant-kunj.html": {
        "title": "Child Psychologist in Vasant Kunj | eMbrace",
        "description": "Professional child psychologist services in Vasant Kunj, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/child-psychologist-in-vasant-kunj.html",
        "keep_faq_jsonld": False,
    },
    "child-psychologist-in-defence-colony.html": {
        "title": "Child Psychologist in Defence Colony | eMbrace",
        "description": "Professional child psychologist services in Defence Colony, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/child-psychologist-in-defence-colony.html",
        "keep_faq_jsonld": False,
    },
    "child-psychologist-in-gurgaon.html": {
        "title": "Child Psychologist in Gurgaon | eMbrace",
        "description": "Professional child psychologist services in Gurgaon, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/child-psychologist-in-gurgaon.html",
        "keep_faq_jsonld": False,
    },
    "child-psychologist-in-green-park.html": {
        "title": "Child Psychologist in Green Park | eMbrace",
        "description": "Professional child psychologist services in Green Park, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/child-psychologist-in-green-park.html",
        "keep_faq_jsonld": False,
    },
    "child-psychologist-in-noida.html": {
        "title": "Child Psychologist in Noida | eMbrace",
        "description": "Professional child psychologist services in Noida, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/child-psychologist-in-noida.html",
        "keep_faq_jsonld": False,
    },
    "child-psychologist-in-hauz-khas.html": {
        "title": "Child Psychologist in Hauz Khas | eMbrace",
        "description": "Professional child psychologist services in Hauz Khas, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/child-psychologist-in-hauz-khas.html",
        "keep_faq_jsonld": False,
    },
    "child-counselling-in-delhi.html": {
        "title": "Child Counselling in Delhi | eMbrace",
        "description": "Professional child counselling services in Delhi, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/child-counselling-in-delhi.html",
        "keep_faq_jsonld": False,
    },
    "child-counselling-in-saket.html": {
        "title": "Child Counselling in Saket | eMbrace",
        "description": "Professional child counselling services in Saket, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/child-counselling-in-saket.html",
        "keep_faq_jsonld": False,
    },
    "child-counselling-in-south-delhi.html": {
        "title": "Child Counselling in South Delhi | eMbrace",
        "description": "Professional child counselling services in South Delhi, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/child-counselling-in-south-delhi.html",
        "keep_faq_jsonld": False,
    },
    "child-counselling-in-greater-kailash.html": {
        "title": "Child Counselling in Greater Kailash | eMbrace",
        "description": "Professional child counselling services in Greater Kailash, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/child-counselling-in-greater-kailash.html",
        "keep_faq_jsonld": False,
    },
    "child-counselling-in-vasant-kunj.html": {
        "title": "Child Counselling in Vasant Kunj | eMbrace",
        "description": "Professional child counselling services in Vasant Kunj, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/child-counselling-in-vasant-kunj.html",
        "keep_faq_jsonld": False,
    },
    "child-counselling-in-defence-colony.html": {
        "title": "Child Counselling in Defence Colony | eMbrace",
        "description": "Professional child counselling services in Defence Colony, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/child-counselling-in-defence-colony.html",
        "keep_faq_jsonld": False,
    },
    "child-counselling-in-gurgaon.html": {
        "title": "Child Counselling in Gurgaon | eMbrace",
        "description": "Professional child counselling services in Gurgaon, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/child-counselling-in-gurgaon.html",
        "keep_faq_jsonld": False,
    },
    "child-counselling-in-green-park.html": {
        "title": "Child Counselling in Green Park | eMbrace",
        "description": "Professional child counselling services in Green Park, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/child-counselling-in-green-park.html",
        "keep_faq_jsonld": False,
    },
    "child-counselling-in-noida.html": {
        "title": "Child Counselling in Noida | eMbrace",
        "description": "Professional child counselling services in Noida, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/child-counselling-in-noida.html",
        "keep_faq_jsonld": False,
    },
    "child-counselling-in-hauz-khas.html": {
        "title": "Child Counselling in Hauz Khas | eMbrace",
        "description": "Professional child counselling services in Hauz Khas, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/child-counselling-in-hauz-khas.html",
        "keep_faq_jsonld": False,
    },
    "autism-therapy-in-delhi.html": {
        "title": "Autism Therapy in Delhi | eMbrace",
        "description": "Professional autism therapy services in Delhi, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/autism-therapy-in-delhi.html",
        "keep_faq_jsonld": False,
    },
    "autism-therapy-in-saket.html": {
        "title": "Autism Therapy in Saket | eMbrace",
        "description": "Professional autism therapy services in Saket, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/autism-therapy-in-saket.html",
        "keep_faq_jsonld": False,
    },
    "autism-therapy-in-south-delhi.html": {
        "title": "Autism Therapy in South Delhi | eMbrace",
        "description": "Professional autism therapy services in South Delhi, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/autism-therapy-in-south-delhi.html",
        "keep_faq_jsonld": False,
    },
    "autism-therapy-in-greater-kailash.html": {
        "title": "Autism Therapy in Greater Kailash | eMbrace",
        "description": "Professional autism therapy services in Greater Kailash, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/autism-therapy-in-greater-kailash.html",
        "keep_faq_jsonld": False,
    },
    "autism-therapy-in-vasant-kunj.html": {
        "title": "Autism Therapy in Vasant Kunj | eMbrace",
        "description": "Professional autism therapy services in Vasant Kunj, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/autism-therapy-in-vasant-kunj.html",
        "keep_faq_jsonld": False,
    },
    "autism-therapy-in-defence-colony.html": {
        "title": "Autism Therapy in Defence Colony | eMbrace",
        "description": "Professional autism therapy services in Defence Colony, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/autism-therapy-in-defence-colony.html",
        "keep_faq_jsonld": False,
    },
    "autism-therapy-in-gurgaon.html": {
        "title": "Autism Therapy in Gurgaon | eMbrace",
        "description": "Professional autism therapy services in Gurgaon, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/autism-therapy-in-gurgaon.html",
        "keep_faq_jsonld": False,
    },
    "autism-therapy-in-green-park.html": {
        "title": "Autism Therapy in Green Park | eMbrace",
        "description": "Professional autism therapy services in Green Park, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/autism-therapy-in-green-park.html",
        "keep_faq_jsonld": False,
    },
    "autism-therapy-in-noida.html": {
        "title": "Autism Therapy in Noida | eMbrace",
        "description": "Professional autism therapy services in Noida, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/autism-therapy-in-noida.html",
        "keep_faq_jsonld": False,
    },
    "autism-therapy-in-hauz-khas.html": {
        "title": "Autism Therapy in Hauz Khas | eMbrace",
        "description": "Professional autism therapy services in Hauz Khas, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/autism-therapy-in-hauz-khas.html",
        "keep_faq_jsonld": False,
    },
    "special-education-in-delhi.html": {
        "title": "Special Education in Delhi | eMbrace",
        "description": "Professional special education services in Delhi, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/special-education-in-delhi.html",
        "keep_faq_jsonld": False,
    },
    "special-education-in-saket.html": {
        "title": "Special Education in Saket | eMbrace",
        "description": "Professional special education services in Saket, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/special-education-in-saket.html",
        "keep_faq_jsonld": False,
    },
    "special-education-in-south-delhi.html": {
        "title": "Special Education in South Delhi | eMbrace",
        "description": "Professional special education services in South Delhi, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/special-education-in-south-delhi.html",
        "keep_faq_jsonld": False,
    },
    "special-education-in-greater-kailash.html": {
        "title": "Special Education in Greater Kailash | eMbrace",
        "description": "Professional special education services in Greater Kailash, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/special-education-in-greater-kailash.html",
        "keep_faq_jsonld": False,
    },
    "special-education-in-vasant-kunj.html": {
        "title": "Special Education in Vasant Kunj | eMbrace",
        "description": "Professional special education services in Vasant Kunj, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/special-education-in-vasant-kunj.html",
        "keep_faq_jsonld": False,
    },
    "special-education-in-defence-colony.html": {
        "title": "Special Education in Defence Colony | eMbrace",
        "description": "Professional special education services in Defence Colony, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/special-education-in-defence-colony.html",
        "keep_faq_jsonld": False,
    },
    "special-education-in-gurgaon.html": {
        "title": "Special Education in Gurgaon | eMbrace",
        "description": "Professional special education services in Gurgaon, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/special-education-in-gurgaon.html",
        "keep_faq_jsonld": False,
    },
    "special-education-in-green-park.html": {
        "title": "Special Education in Green Park | eMbrace",
        "description": "Professional special education services in Green Park, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/special-education-in-green-park.html",
        "keep_faq_jsonld": False,
    },
    "special-education-in-noida.html": {
        "title": "Special Education in Noida | eMbrace",
        "description": "Professional special education services in Noida, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/special-education-in-noida.html",
        "keep_faq_jsonld": False,
    },
    "special-education-in-hauz-khas.html": {
        "title": "Special Education in Hauz Khas | eMbrace",
        "description": "Professional special education services in Hauz Khas, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/special-education-in-hauz-khas.html",
        "keep_faq_jsonld": False,
    },
    "learning-disability-assessment-in-delhi.html": {
        "title": "Learning Disability Assessment in Delhi | eMbrace",
        "description": "Professional learning disability assessment services in Delhi, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/learning-disability-assessment-in-delhi.html",
        "keep_faq_jsonld": False,
    },
    "learning-disability-assessment-in-saket.html": {
        "title": "Learning Disability Assessment in Saket | eMbrace",
        "description": "Professional learning disability assessment services in Saket, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/learning-disability-assessment-in-saket.html",
        "keep_faq_jsonld": False,
    },
    "learning-disability-assessment-in-south-delhi.html": {
        "title": "Learning Disability Assessment in South Delhi | eMbrace",
        "description": "Professional learning disability assessment services in South Delhi, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/learning-disability-assessment-in-south-delhi.html",
        "keep_faq_jsonld": False,
    },
    "learning-disability-assessment-in-greater-kailash.html": {
        "title": "Learning Disability Assessment in Greater Kailash | eMbrace",
        "description": "Professional learning disability assessment services in Greater Kailash, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/learning-disability-assessment-in-greater-kailash.html",
        "keep_faq_jsonld": False,
    },
    "learning-disability-assessment-in-vasant-kunj.html": {
        "title": "Learning Disability Assessment in Vasant Kunj | eMbrace",
        "description": "Professional learning disability assessment services in Vasant Kunj, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/learning-disability-assessment-in-vasant-kunj.html",
        "keep_faq_jsonld": False,
    },
    "learning-disability-assessment-in-defence-colony.html": {
        "title": "Learning Disability Assessment in Defence Colony | eMbrace",
        "description": "Professional learning disability assessment services in Defence Colony, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/learning-disability-assessment-in-defence-colony.html",
        "keep_faq_jsonld": False,
    },
    "learning-disability-assessment-in-gurgaon.html": {
        "title": "Learning Disability Assessment in Gurgaon | eMbrace",
        "description": "Professional learning disability assessment services in Gurgaon, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/learning-disability-assessment-in-gurgaon.html",
        "keep_faq_jsonld": False,
    },
    "learning-disability-assessment-in-green-park.html": {
        "title": "Learning Disability Assessment in Green Park | eMbrace",
        "description": "Professional learning disability assessment services in Green Park, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/learning-disability-assessment-in-green-park.html",
        "keep_faq_jsonld": False,
    },
    "learning-disability-assessment-in-noida.html": {
        "title": "Learning Disability Assessment in Noida | eMbrace",
        "description": "Professional learning disability assessment services in Noida, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/learning-disability-assessment-in-noida.html",
        "keep_faq_jsonld": False,
    },
    "learning-disability-assessment-in-hauz-khas.html": {
        "title": "Learning Disability Assessment in Hauz Khas | eMbrace",
        "description": "Professional learning disability assessment services in Hauz Khas, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/learning-disability-assessment-in-hauz-khas.html",
        "keep_faq_jsonld": False,
    },
    "teen-counselling-in-delhi.html": {
        "title": "Teen Counselling in Delhi | eMbrace",
        "description": "Professional teen counselling services in Delhi, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/teen-counselling-in-delhi.html",
        "keep_faq_jsonld": False,
    },
    "teen-counselling-in-saket.html": {
        "title": "Teen Counselling in Saket | eMbrace",
        "description": "Professional teen counselling services in Saket, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/teen-counselling-in-saket.html",
        "keep_faq_jsonld": False,
    },
    "teen-counselling-in-south-delhi.html": {
        "title": "Teen Counselling in South Delhi | eMbrace",
        "description": "Professional teen counselling services in South Delhi, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/teen-counselling-in-south-delhi.html",
        "keep_faq_jsonld": False,
    },
    "teen-counselling-in-greater-kailash.html": {
        "title": "Teen Counselling in Greater Kailash | eMbrace",
        "description": "Professional teen counselling services in Greater Kailash, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/teen-counselling-in-greater-kailash.html",
        "keep_faq_jsonld": False,
    },
    "teen-counselling-in-vasant-kunj.html": {
        "title": "Teen Counselling in Vasant Kunj | eMbrace",
        "description": "Professional teen counselling services in Vasant Kunj, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/teen-counselling-in-vasant-kunj.html",
        "keep_faq_jsonld": False,
    },
    "teen-counselling-in-defence-colony.html": {
        "title": "Teen Counselling in Defence Colony | eMbrace",
        "description": "Professional teen counselling services in Defence Colony, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/teen-counselling-in-defence-colony.html",
        "keep_faq_jsonld": False,
    },
    "teen-counselling-in-gurgaon.html": {
        "title": "Teen Counselling in Gurgaon | eMbrace",
        "description": "Professional teen counselling services in Gurgaon, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/teen-counselling-in-gurgaon.html",
        "keep_faq_jsonld": False,
    },
    "teen-counselling-in-green-park.html": {
        "title": "Teen Counselling in Green Park | eMbrace",
        "description": "Professional teen counselling services in Green Park, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/teen-counselling-in-green-park.html",
        "keep_faq_jsonld": False,
    },
    "teen-counselling-in-noida.html": {
        "title": "Teen Counselling in Noida | eMbrace",
        "description": "Professional teen counselling services in Noida, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/teen-counselling-in-noida.html",
        "keep_faq_jsonld": False,
    },
    "teen-counselling-in-hauz-khas.html": {
        "title": "Teen Counselling in Hauz Khas | eMbrace",
        "description": "Professional teen counselling services in Hauz Khas, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/teen-counselling-in-hauz-khas.html",
        "keep_faq_jsonld": False,
    },
    "adult-counselling-in-delhi.html": {
        "title": "Adult Counselling in Delhi | eMbrace",
        "description": "Professional adult counselling services in Delhi, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/adult-counselling-in-delhi.html",
        "keep_faq_jsonld": False,
    },
    "adult-counselling-in-saket.html": {
        "title": "Adult Counselling in Saket | eMbrace",
        "description": "Professional adult counselling services in Saket, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/adult-counselling-in-saket.html",
        "keep_faq_jsonld": False,
    },
    "adult-counselling-in-south-delhi.html": {
        "title": "Adult Counselling in South Delhi | eMbrace",
        "description": "Professional adult counselling services in South Delhi, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/adult-counselling-in-south-delhi.html",
        "keep_faq_jsonld": False,
    },
    "adult-counselling-in-greater-kailash.html": {
        "title": "Adult Counselling in Greater Kailash | eMbrace",
        "description": "Professional adult counselling services in Greater Kailash, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/adult-counselling-in-greater-kailash.html",
        "keep_faq_jsonld": False,
    },
    "adult-counselling-in-vasant-kunj.html": {
        "title": "Adult Counselling in Vasant Kunj | eMbrace",
        "description": "Professional adult counselling services in Vasant Kunj, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/adult-counselling-in-vasant-kunj.html",
        "keep_faq_jsonld": False,
    },
    "adult-counselling-in-defence-colony.html": {
        "title": "Adult Counselling in Defence Colony | eMbrace",
        "description": "Professional adult counselling services in Defence Colony, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/adult-counselling-in-defence-colony.html",
        "keep_faq_jsonld": False,
    },
    "adult-counselling-in-gurgaon.html": {
        "title": "Adult Counselling in Gurgaon | eMbrace",
        "description": "Professional adult counselling services in Gurgaon, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/adult-counselling-in-gurgaon.html",
        "keep_faq_jsonld": False,
    },
    "adult-counselling-in-green-park.html": {
        "title": "Adult Counselling in Green Park | eMbrace",
        "description": "Professional adult counselling services in Green Park, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/adult-counselling-in-green-park.html",
        "keep_faq_jsonld": False,
    },
    "adult-counselling-in-noida.html": {
        "title": "Adult Counselling in Noida | eMbrace",
        "description": "Professional adult counselling services in Noida, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/adult-counselling-in-noida.html",
        "keep_faq_jsonld": False,
    },
    "adult-counselling-in-hauz-khas.html": {
        "title": "Adult Counselling in Hauz Khas | eMbrace",
        "description": "Professional adult counselling services in Hauz Khas, Delhi. Expert care and support for children, teens, and adults. Book a consultation.",
        "canonical": "/adult-counselling-in-hauz-khas.html",
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
