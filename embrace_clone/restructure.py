#!/usr/bin/env python3
"""Move HTML files into cluster folders and update all internal links."""

import os, re, shutil

DIR = "/home/veer/Desktop/Office/embrace/embrace-html/embrace_clone"

FILE_MAP = {}
def add(fn, folder):
    if fn.endswith('.html'):
        FILE_MAP[fn] = folder

# --- ADHD ---
adhd = ["adhd.html","what-is-adhd.html","adhd-symptoms.html","attention-difficulties.html",
    "focus-and-concentration.html","impulse-control.html","hyperactivity.html",
    "adhd-in-children.html","adhd-in-teens.html","adult-adhd.html","adhd-in-women.html",
    "adhd-in-men.html","adhd-screening.html","adhd-assessment.html","conners-3-assessment.html",
    "adhd-testing.html","adhd-treatment.html","adhd-counselling.html","adhd-coaching.html",
    "executive-function-coaching.html","adhd-parent-support.html","adhd-teacher-support.html",
    "adhd-classroom-accommodations.html","adhd-workplace-accommodations.html",
    "adhd-time-management.html","adhd-study-skills.html","adhd-organization-skills.html",
    "adhd-and-anxiety.html","adhd-and-autism.html","adhd-and-depression.html",
    "adhd-at-work.html","adhd-and-school.html","adhd-and-college.html",
    "adhd-faq.html","adhd-resources.html"]
for f in adhd: add(f, "adhd")

# --- Autism ---
autism = ["autism.html","what-is-autism.html","autism-spectrum-disorder.html",
    "signs-of-autism.html","autism-symptoms.html","high-functioning-autism.html",
    "level-1-autism.html","level-2-autism.html","level-3-autism.html",
    "autism-in-toddlers.html","autism-in-preschoolers.html","autism-in-school-age-children.html",
    "autism-in-adolescents.html","autism-in-adults.html","autism-in-boys.html",
    "autism-in-girls.html","late-autism-diagnosis.html","restricted-repetitive-behaviours.html",
    "social-communication-deficits.html","autism-and-adhd.html","autism-and-anxiety.html",
    "autism-and-learning-disabilities.html","autism-and-emotional-regulation.html",
    "autism-and-sleep.html","autism-and-feeding.html","autism-screening.html",
    "autism-assessment.html","ados-2-assessment.html","autism-diagnostic-evaluation.html",
    "autism-testing.html","autism-treatment.html","autism-therapy.html",
    "autism-behaviour-therapy.html","autism-occupational-therapy.html",
    "autism-speech-therapy.html","autism-social-skills.html","autism-sensory-needs.html",
    "autism-parent-training.html","autism-school-support.html",
    "autism-inclusive-education.html","autism-transition-to-adulthood.html",
    "autism-workplace-support.html","autism-support-groups.html","autism-resources.html",
    "autism-faq.html"]
for f in autism: add(f, "autism")

# --- Learning Disabilities ---
ld = ["specific-learning-disability.html","learning-disabilities.html",
    "learning-difficulties.html","dyslexia.html","dysgraphia.html","dyscalculia.html",
    "reading-disorder.html","writing-disorder.html","math-learning-disorder.html",
    "learning-disability-assessment.html","psychoeducational-assessment.html",
    "school-readiness-assessment.html","wisc-v-testing.html","academic-intervention.html",
    "dyslexia-therapy.html","reading-intervention.html","writing-intervention.html",
    "study-skills-training.html","executive-function-training.html",
    "special-education-support.html","inclusive-education.html","iep-support.html",
    "school-accommodations.html","exam-accommodations.html",
    "learning-disability-support.html","school-performance-problems.html"]
for f in ld: add(f, "learning-disabilities")

# --- Speech & Language ---
speech = ["speech-therapy.html","speech-delay.html","speech-sound-disorders.html",
    "articulation-therapy.html","stuttering-therapy.html","language-delay.html",
    "expressive-language-disorder.html","receptive-language-disorder.html",
    "pragmatic-language-disorder.html","social-communication-disorder.html",
    "communication-skills-training.html","speech-assessment.html","language-assessment.html",
    "speech-therapy-for-autism.html","speech-therapy-for-adhd.html",
    "speech-therapy-for-children.html","speech-therapy-for-adults.html"]
for f in speech: add(f, "speech-therapy")

# --- Occupational Therapy ---
ot = ["occupational-therapy.html","occupational-therapy-assessment.html",
    "sensory-processing-disorder.html","sensory-integration-therapy.html",
    "sensory-seeking-behaviour.html","sensory-avoidance.html","sensory-regulation.html",
    "fine-motor-skills.html","gross-motor-skills.html","motor-planning.html",
    "handwriting-difficulties.html","daily-living-skills.html","self-care-training.html",
    "ot-for-autism.html","ot-for-adhd.html","ot-for-learning-disabilities.html"]
for f in ot: add(f, "occupational-therapy")

# --- Child Psychology ---
cp = ["child-psychologist.html","child-counselling.html","play-therapy.html",
    "expressive-arts-therapy.html","social-skills-training.html","child-anxiety.html",
    "child-depression.html","child-stress.html","child-behaviour-problems.html",
    "temper-tantrums.html","emotional-regulation.html","anger-management-for-children.html",
    "peer-relationship-problems.html","bullying-support.html","school-refusal.html",
    "academic-stress.html","low-self-esteem.html","confidence-building.html",
    "grief-counselling-for-children.html","trauma-support-for-children.html"]
for f in cp: add(f, "child-psychology")

# --- Teen Mental Health ---
teen = ["teen-counselling.html","teen-anxiety.html","teen-depression.html",
    "teen-stress.html","social-anxiety-in-teens.html","peer-pressure.html",
    "digital-addiction.html","gaming-addiction.html","career-stress.html",
    "exam-anxiety.html","college-transition-support.html","self-esteem-for-teens.html",
    "emotional-regulation-for-teens.html","anger-management-for-teens.html",
    "teen-relationship-issues.html"]
for f in teen: add(f, "teen-mental-health")

# --- Adult Mental Health ---
adult = ["adult-counselling.html","adult-anxiety.html","adult-depression.html",
    "stress-management.html","life-transitions.html","burnout-counselling.html",
    "premarital-counselling.html","relationship-counselling.html","couples-therapy.html",
    "marital-counselling.html","grief-counselling.html","trauma-therapy.html",
    "mindfulness-therapy.html","self-esteem-counselling.html","workplace-stress.html",
    "adult-autism-support.html","adult-adhd-support.html",
    "executive-function-coaching-for-adults.html"]
for f in adult: add(f, "adult-mental-health")

# --- Parent Hub ---
parent = ["parents.html","parent-counselling.html","parent-burnout.html",
    "caregiver-support.html","positive-parenting.html","new-parent-support.html",
    "parent-support-groups.html","raising-a-child-with-autism.html",
    "raising-a-child-with-adhd.html","siblings-of-neurodivergent-children.html",
    "managing-meltdowns.html","behaviour-management-at-home.html",
    "school-communication.html","iep-guide.html","inclusive-school-guide.html",
    "transition-planning-for-parents.html"]
for f in parent: add(f, "parent-hub")

# --- Schools Hub ---
schools = ["schools.html","school-partnerships.html","school-counselling.html",
    "school-screening-programs.html","school-wellness-programs.html",
    "school-mental-health-programs.html","inclusive-education-consulting.html",
    "autism-in-the-classroom.html","adhd-in-the-classroom.html",
    "learning-disabilities-in-school.html","special-education-consulting.html",
    "classroom-accommodations.html","teacher-training.html",
    "teacher-wellbeing-programs.html","manager-training.html"]
for f in schools: add(f, "schools-hub")

# --- Corporate Wellness ---
corp = ["corporates.html","corporate-wellness.html","employee-mental-health.html",
    "employee-assistance-programs.html","burnout-prevention.html",
    "workplace-anxiety.html","leadership-wellbeing.html","neurodiversity-at-work.html",
    "inclusive-hiring.html","workplace-adhd-support.html","workplace-autism-support.html",
    "workplace-accommodations.html"]
for f in corp: add(f, "corporate-wellness")

# Locations handled in get_target()

def get_target(fn):
    if fn in FILE_MAP:
        return FILE_MAP[fn]
    if "-in-" in fn:
        return "locations"
    return None

# --- Create directories ---
all_folders = sorted(set(FILE_MAP.values())) + ["locations"]
for folder in all_folders:
    os.makedirs(os.path.join(DIR, folder), exist_ok=True)

# --- Move files ---
moved = []
for fn in os.listdir(DIR):
    if not fn.endswith(".html"):
        continue
    target = get_target(fn)
    if not target:
        continue
    src = os.path.join(DIR, fn)
    dst = os.path.join(DIR, target, fn)
    if os.path.exists(dst):
        print(f"  ⚠️  {fn} already exists in {target}/")
        continue
    shutil.move(src, dst)
    moved.append((fn, target))
    print(f"  📦 {fn} -> {target}/")

print(f"\n✅ Moved {len(moved)} files\n")

# --- Update links in all HTML files ---
ROOT_DIRS = [""] + all_folders  # "" = root dir

def update_links_in_file(filepath, current_dir):
    """Update all internal links in a single HTML file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    original = content
    
    # Update asset references (only for files in subdirectories)
    if current_dir:
        content = re.sub(r'(href|src)="\./assets/', r'\1="../assets/', content)
        content = re.sub(r'(href|src)="\./components/', r'\1="../components/', content)
        content = re.sub(r'(href|src)="\./_external/', r'\1="../_external/', content)
        content = content.replace('href="./Favicon.png"', 'href="../Favicon.png"')
    
    # Update href="./something.html" links
    def fix_href(m):
        target_fn = m.group(1)
        if not target_fn.endswith('.html'):
            return m.group(0)
        
        target_folder = get_target(target_fn)
        
        if current_dir == "":  # root file linking somewhere
            if target_folder:
                return f'href="./{target_folder}/{target_fn}"'
            else:
                return m.group(0)  # stays in root
        else:  # subdirectory file linking somewhere
            if target_folder is None:
                # Target is in root
                return f'href="../{target_fn}"'
            elif target_folder == current_dir:
                # Target is in same folder
                return f'href="./{target_fn}"'
            else:
                # Target is in different folder
                return f'href="../{target_folder}/{target_fn}"'
    
    content = re.sub(r'href="\./([^"]+\.html)"', fix_href, content)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

link_updates = 0
for dir_entry in ROOT_DIRS:
    dirpath = os.path.join(DIR, dir_entry)
    if not os.path.isdir(dirpath):
        continue
    for fn in sorted(os.listdir(dirpath)):
        if not fn.endswith(".html"):
            continue
        filepath = os.path.join(dirpath, fn)
        if update_links_in_file(filepath, dir_entry):
            link_updates += 1
            loc = f"{dir_entry}/" if dir_entry else ""
            print(f"  🔗 Updated: {loc}{fn}")
        else:
            loc = f"{dir_entry}/" if dir_entry else ""
            # Only show if changed (not every file)
            pass

print(f"\n✅ Updated links in {link_updates} files")
print(f"\n{'='*50}")
print(f"Done! Files organized into {len(all_folders)} topic folders.")
print(f"{'='*50}")
