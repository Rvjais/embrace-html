/**
 * Content model for the nine services that had target keywords but no page.
 *
 * Consumed by generate-service-pages.js, which emits one hub page per service
 * plus a Delhi and a Gurgaon page for each.
 *
 * Rules this content is written to (from the seo-content-workflow skill):
 *   - Indian English. No em dashes.
 *   - Nothing fabricated: no statistics, no outcome claims, no named clinicians,
 *     no invented testimonials. Fees are always "quoted upfront on your intake
 *     call", never a number.
 *   - Health content, so no diagnostic claims and no guaranteed outcomes.
 *   - Every service gets its own sections, its own key points and its own FAQs.
 *     Nothing here is a word-swap of its neighbour.
 *   - FAQ answers stay between 20 and 35 words.
 */

module.exports = [
  {
    slug: 'developmental-delay-treatment',
    metaBlurb: 'assessment, therapy and a written baseline you can measure',
    folder: 'developmental-delay',
    hubName: 'Developmental Delay Treatment',
    keyword: 'Developmental Delay Treatment',
    shortName: 'developmental delay treatment',
    hubMenu: 'Developmental Delay Hub',
    intent: 'commercial investigation',
    breadcrumb: 'Developmental Delay',
    lede:
      'Developmental delay means a child is reaching milestones noticeably later than expected for their age, in one area or several. It is a description of where a child is now, not a prediction of where they will end up, and it is the point at which support does the most good.',
    sections: [
      {
        h2: 'What developmental delay actually means',
        paras: [
          'Children develop across five broad areas: speech and language, gross motor, fine motor, cognitive and problem-solving, and social and emotional skills. A delay in one of these is called a specific delay. Significant delay across two or more is usually described as global developmental delay.',
          'A delay is not a diagnosis in itself. It is a signal that something is making learning harder, and the useful question is what. Hearing loss, a language disorder, autism, an intellectual disability, a neurological condition, prematurity and, in some cases, simple late blooming all present as delay in the early years.',
        ],
      },
      {
        h2: 'Signs that are worth acting on',
        paras: [
          'Milestone ranges are wide, and children do not develop on a straight line. What matters clinically is the size of the gap, whether it is widening or closing, and whether it affects everyday life at home and at nursery or school.',
        ],
        list: [
          'No babbling or gestures such as pointing and waving by 12 months',
          'Fewer than six clear words by 18 months, or no two-word phrases by two years',
          'Not walking independently by 18 months, or a marked difference between the two sides of the body',
          'Little interest in other children, or no pretend play by three years',
          'Loss of a skill your child previously had, at any age. Regression always warrants a same-month appointment',
        ],
      },
      {
        h2: 'How treatment works at eMbrace',
        paras: [
          'Treatment starts with working out what is driving the delay, because the answer changes the plan completely. A developmental assessment maps your child across all five areas and establishes a baseline you can measure progress against.',
          'From there, therapy is targeted rather than general. A child with a language delay and good motor skills does not need the same programme as a child with low muscle tone and feeding difficulty. Because our speech and language therapists, occupational therapists, physiotherapists, special educators, psychologists and developmental paediatrician work in the same team, a child who needs two or three of them is not sent on a fresh search each time.',
          'Parent coaching is part of the plan, not an add-on. A therapy hour a week matters far less than what happens in the other hundred and sixty-seven, and most of the gains families see come from what changes at home.',
        ],
      },
      {
        h2: 'Why the early years carry the most weight',
        paras: [
          'The brain is at its most adaptable in the first years of life, which is why early intervention is the consistent recommendation across developmental paediatrics. The same difficulty usually takes fewer sessions to shift at three than at eight, and a child who gets support before school entry arrives with skills already in place rather than a gap to close.',
          'Waiting has a cost that is easy to miss, because nothing dramatic happens on the day you decide to wait. If you are unsure whether what you are seeing is a delay, the free 15-minute intake call is the cheapest way to find out.',
        ],
      },
    ],
    keyPoints: [
      'Assessment across all five developmental areas, not just the one you noticed',
      'Speech, occupational therapy, physiotherapy and special education in one team',
      'A written baseline so progress is measured rather than guessed at',
      'Parent coaching built into the plan from the first session',
    ],
    faqs: [
      {
        q: 'Will my child grow out of a developmental delay?',
        a: 'Some children do catch up without help, particularly with mild speech delays. Others do not, and there is no reliable way to tell which is which without an assessment. Waiting costs more than checking.',
      },
      {
        q: 'What is the difference between developmental delay and autism?',
        a: 'Delay describes timing: skills arriving later than expected. Autism describes a pattern in social communication, interests and sensory response. A child can have either, both, or a delay from an entirely different cause.',
      },
      {
        q: 'How early can my child be assessed?',
        a: 'From around 12 months, and earlier where there are clear concerns such as feeding difficulty, very low muscle tone, or loss of a skill. There is no age at which it is too early to ask.',
      },
      {
        q: 'How long does treatment take?',
        a: 'It depends entirely on what is driving the delay and how much support is in place at home. We review progress against the baseline regularly, and we will tell you plainly when therapy is no longer needed.',
      },
      {
        q: 'Do we need a doctor referral to book?',
        a: 'No. You can book directly with us. If a medical opinion is needed, our developmental paediatrician and paediatric neurologist are part of the same team.',
      },
    ],
    related: ['speech-therapy', 'occupational-therapy', 'autism', 'child-development-centre', 'developmental-pediatrician'],
  },

  {
    slug: 'intellectual-disability-treatment',
    metaBlurb: 'cognitive and adaptive assessment, life skills and school reports',
    folder: 'intellectual-disability',
    hubName: 'Intellectual Disability Treatment',
    keyword: 'Intellectual Disability Treatment',
    shortName: 'intellectual disability support',
    hubMenu: 'Intellectual Disability Hub',
    intent: 'commercial investigation',
    breadcrumb: 'Intellectual Disability',
    lede:
      'Intellectual disability affects two things together: intellectual functioning, meaning reasoning, learning and problem solving, and adaptive functioning, meaning the practical and social skills daily life runs on. Support is about building independence in both, at whatever pace suits the person.',
    sections: [
      {
        h2: 'How intellectual disability is identified',
        paras: [
          'A diagnosis is never made from a single number. It requires a standardised cognitive assessment, a structured measure of adaptive functioning such as the Vineland, a developmental history, and evidence that the difficulties began during the developmental period rather than after an injury or illness in adulthood.',
          'Adaptive functioning is the part families most often find is missed elsewhere, and it is usually the more useful of the two. It measures what a person actually does day to day: communication, self-care, home living, social skills, safety and community use. Two people with similar cognitive scores can live very differently depending on it.',
        ],
      },
      {
        h2: 'What support looks like',
        paras: [
          'There is no treatment that changes intellectual functioning itself, and anyone claiming otherwise should be treated with caution. What genuinely changes outcomes is teaching skills systematically, adapting the environment, and supporting the family around the person.',
        ],
        list: [
          'Special education with an individual education plan, reviewed and updated as skills build',
          'Functional life skills: dressing, money, travel, kitchen safety, personal care',
          'Speech and language therapy for communication, including alternative and augmentative communication where speech is limited',
          'Occupational therapy for daily living skills, motor planning and sensory needs',
          'Behaviour support where frustration or communication difficulty is showing up as challenging behaviour',
          'Family counselling and sibling support, which is consistently under-used',
        ],
      },
      {
        h2: 'Assessment reports, school and certification',
        paras: [
          'A properly written assessment report does practical work. Schools use it to put accommodations in place and to apply for examination concessions. Where appropriate, it also supports an application for a UDID card, which is what unlocks statutory benefits and reservations in India.',
          'Our reports are written by RCI-certified clinical psychologists, name the tools used and the scores obtained, and set out specific recommendations rather than general advice. Ask any provider for that standard before you pay, because a report that does not meet it will need to be done again.',
        ],
      },
      {
        h2: 'Planning beyond school',
        paras: [
          'The questions that matter most to families are rarely about childhood. They are about what happens at eighteen, at thirty, and after parents are gone. Transition planning starts long before school ends: vocational skills, supported employment, travel training, and building the practical independence that makes adult life possible.',
          'We work with families on this alongside the therapy, because a plan made at sixteen has options that a plan made at twenty-five does not.',
        ],
      },
    ],
    keyPoints: [
      'Cognitive and adaptive assessment together, never a number in isolation',
      'Reports written to the standard schools, boards and UDID applications require',
      'Life skills and vocational planning, not only classroom academics',
      'Family and sibling support included in the plan',
    ],
    faqs: [
      {
        q: 'Can intellectual disability be cured?',
        a: 'No, and any provider promising otherwise is not being honest with you. What changes substantially is independence, communication and quality of life, through systematic skill teaching and the right support.',
      },
      {
        q: 'What is the difference between intellectual disability and learning disability?',
        a: 'In India, learning disability usually means a specific difficulty such as dyslexia alongside typical overall ability. Intellectual disability affects general intellectual and adaptive functioning together, across most areas of life.',
      },
      {
        q: 'What age can an assessment be done?',
        a: 'Formal cognitive assessment is generally reliable from around five or six. Younger children are assessed developmentally instead, which gives a working baseline and a therapy plan without a premature label.',
      },
      {
        q: 'Will the report help with a UDID card?',
        a: 'A clinical psychology assessment report is one part of that application. Our reports are written in the format the process expects, and we will explain what else you will need.',
      },
      {
        q: 'Can my child attend a mainstream school?',
        a: 'Many children can, with the right accommodations in place and a school that will implement them. The assessment sets out exactly what those accommodations should be.',
      },
    ],
    related: ['learning-disabilities', 'special-education', 'developmental-delay-treatment', 'occupational-therapy', 'child-development-centre'],
  },

  {
    slug: 'down-syndrome-treatment',
    metaBlurb: 'physiotherapy, speech, occupational therapy and special education',
    folder: 'down-syndrome',
    hubName: 'Down Syndrome Treatment & Therapy',
    keyword: 'Down Syndrome Treatment',
    shortName: 'Down syndrome therapy',
    hubMenu: 'Down Syndrome Hub',
    intent: 'commercial investigation',
    breadcrumb: 'Down Syndrome',
    lede:
      'Down syndrome is a genetic condition, not an illness, and it is not something therapy sets out to cure. What therapy does, and does well, is build communication, movement, independence and confidence, starting as early as families are ready.',
    sections: [
      {
        h2: 'What early intervention covers',
        paras: [
          'The first six years carry the most therapeutic weight, and a coordinated programme in that window makes a visible difference to what a child can do at school age. Most children with Down syndrome benefit from several therapies running together rather than one at a time.',
        ],
        list: [
          'Physiotherapy for low muscle tone, sitting, walking, balance and stamina',
          'Speech and language therapy, often starting with feeding and oral motor work before words',
          'Occupational therapy for fine motor skills, self-care and sensory regulation',
          'Special education for early learning, reading and number concepts',
          'Parent coaching so the work continues between sessions',
        ],
      },
      {
        h2: 'Communication, and why it starts before speech',
        paras: [
          'Children with Down syndrome frequently understand considerably more than they can say. That gap is the single biggest source of frustration for a young child, and it is why we do not wait for speech to emerge before building communication.',
          'Gestures, signs and picture systems are introduced early where they help. They do not delay speech, which is the most common worry families arrive with, and they give a child a way to be understood while spoken language develops. Low muscle tone in the mouth and jaw is addressed directly through oral motor work, which supports both feeding and clarity of speech.',
        ],
      },
      {
        h2: 'Working with your medical team',
        paras: [
          'Down syndrome is associated with specific health considerations, including hearing, vision, thyroid function and heart conditions, and these are managed by your paediatrician or specialists. This matters for therapy for one practical reason: undetected hearing loss, which is common with glue ear, slows speech progress no matter how good the therapy is.',
          'We work alongside your medical team rather than around it, and our developmental paediatrician and paediatric neurologist are part of the same practice where a coordinated opinion is useful.',
        ],
      },
      {
        h2: 'School, and the years after it',
        paras: [
          'Many children with Down syndrome do well in mainstream schools with proper accommodations, a school that will implement them, and a plan that is reviewed as needs change. We write reports schools can act on, and we speak to teachers directly when that helps.',
          'Beyond school, the work shifts towards independence: self-care, travel, money, work skills and social relationships. Starting that early makes adult life broader.',
        ],
      },
    ],
    keyPoints: [
      'Physiotherapy, speech, occupational therapy and special education in one coordinated plan',
      'Communication built from the start, including signs and pictures where they help',
      'Oral motor and feeding work alongside speech',
      'School reports and teacher liaison, then transition planning beyond school',
    ],
    faqs: [
      {
        q: 'When should therapy start?',
        a: 'As early as you are ready, often within the first months. Early physiotherapy and feeding support are usually first, with speech and occupational therapy following as your child develops.',
      },
      {
        q: 'Will using signs stop my child from speaking?',
        a: 'No. Signs and picture systems give a child a way to communicate while speech develops, and research does not support the fear that they delay speech.',
      },
      {
        q: 'How many therapies does my child need at once?',
        a: 'That depends on age and current priorities, and more is not automatically better. We recommend a realistic plan your family can actually sustain week after week.',
      },
      {
        q: 'Can my child go to a mainstream school?',
        a: 'Many children do, with accommodations in place and a willing school. Our assessment sets out precisely what support is needed for that to work.',
      },
      {
        q: 'Do you support adults with Down syndrome?',
        a: 'Yes. Work with adults focuses on independence, communication, employment skills and wellbeing, alongside family and carer support.',
      },
    ],
    related: ['speech-therapy', 'occupational-therapy', 'physiotherapy', 'special-education', 'child-development-centre'],
  },

  {
    slug: 'oral-motor-therapy',
    metaBlurb: 'feeding and speech clarity work by speech and language therapists',
    folder: 'oral-motor-therapy',
    hubName: 'Oral Motor Delay Treatment',
    keyword: 'Oral Motor Delay Treatment',
    shortName: 'oral motor therapy',
    hubMenu: 'Oral Motor & Feeding Hub',
    intent: 'commercial investigation',
    breadcrumb: 'Oral Motor Therapy',
    lede:
      'Oral motor skills are the strength, coordination and awareness of the lips, tongue, jaw and cheeks. They sit underneath two things that matter enormously in early childhood: eating safely and speaking clearly. When they are delayed, both are affected, and the connection is often missed.',
    sections: [
      {
        h2: 'What an oral motor delay looks like',
        paras: [
          'Families rarely arrive saying their child has an oral motor delay. They arrive because mealtimes are a battle, or because nobody outside the family can understand their child. These are frequently the same underlying problem.',
        ],
        list: [
          'Persistent drooling well beyond the toddler years',
          'Difficulty chewing, holding food in the cheeks, or swallowing food whole',
          'A very restricted diet, particularly avoiding textures that need real chewing',
          'Speech that stays unclear to people outside the family past the age it should be',
          'Difficulty with straws, cups or blowing, or an open mouth posture at rest',
          'Gagging, coughing or distress at mealtimes',
        ],
      },
      {
        h2: 'What causes it',
        paras: [
          'Oral motor difficulty is a symptom, not a diagnosis, and finding the cause changes the treatment. Low muscle tone, prematurity, tongue tie, cerebral palsy, Down syndrome, autism and childhood apraxia of speech all produce it, and so does a simple lack of experience with textures in a child who was kept on soft food for a long time.',
          'This is why assessment comes before exercises. A programme built for low tone looks different from one built for a sensory-driven feeding aversion, and using the wrong one wastes months.',
        ],
      },
      {
        h2: 'How therapy works',
        paras: [
          'Assessment is carried out by a speech and language therapist and looks at structure, movement, strength, coordination and how your child actually manages food and drink. Where feeding is the main concern, our occupational therapists work alongside on the sensory side, because appetite and texture aversion are frequently sensory rather than muscular.',
          'Therapy itself is short, frequent and playful. Sessions build the specific movements your child needs, and you leave with exercises that take a few minutes a day rather than a programme nobody can sustain. Progress in this area is usually visible to parents at mealtimes before it is visible in speech.',
        ],
      },
      {
        h2: 'When speech is the main worry',
        paras: [
          'If your concern is clarity rather than eating, oral motor work is one part of a broader speech and language plan, not the whole of it. Speech sound difficulties can be motor, phonological, or related to hearing, and treating the wrong one produces slow progress and frustrated children.',
          'A hearing check is worth doing before or alongside therapy in every case where speech is unclear. It is cheap, quick, and it changes the plan when it finds something.',
        ],
      },
    ],
    keyPoints: [
      'Assessment first: strength, movement, coordination and real mealtime observation',
      'Speech therapists and occupational therapists working the muscular and sensory sides together',
      'Home exercises measured in minutes a day, not hours',
      'Hearing ruled out early wherever speech clarity is the concern',
    ],
    faqs: [
      {
        q: 'Is oral motor delay the same as a speech delay?',
        a: 'No. Oral motor delay concerns the movement and strength of the mouth. It can cause unclear speech, but many speech delays have nothing to do with oral motor skills at all.',
      },
      {
        q: 'My child eats only soft food. Is that oral motor?',
        a: 'It might be, or it might be sensory aversion, and the two are treated differently. An assessment separates them, which is why we look at both together.',
      },
      {
        q: 'Does tongue tie need to be released?',
        a: 'Sometimes, but not always, and the decision is medical rather than ours alone. We assess function, then work with your paediatrician or ENT if a release is being considered.',
      },
      {
        q: 'How long before we see a change?',
        a: 'Families often notice mealtime changes within a few weeks when exercises are done consistently. Speech clarity typically takes longer, because it depends on more than muscle strength.',
      },
      {
        q: 'What age can therapy start?',
        a: 'Feeding and oral motor support can begin in infancy where there are difficulties. There is no minimum age for a feeding assessment if your child is struggling.',
      },
    ],
    related: ['speech-therapy', 'occupational-therapy', 'down-syndrome-treatment', 'developmental-delay-treatment', 'child-development-centre'],
  },

  {
    slug: 'aba-therapy',
    metaBlurb: 'play-based, goals set with parents and reviewed against the data',
    folder: 'aba-therapy',
    hubName: 'ABA Therapy',
    keyword: 'ABA Therapy',
    shortName: 'ABA therapy',
    hubMenu: 'ABA & Behaviour Hub',
    intent: 'commercial investigation',
    breadcrumb: 'ABA Therapy',
    lede:
      'Applied Behaviour Analysis is a structured, data-led approach to teaching skills and reducing behaviours that get in a child\'s way. Its reputation is mixed, much of that history is deserved, and how a programme is run matters more than the label on it.',
    sections: [
      {
        h2: 'What ABA does',
        paras: [
          'ABA breaks a skill into teachable steps, teaches them deliberately, measures whether the teaching worked, and adjusts when it does not. That measurement is the real point of it: progress is recorded rather than assumed, so a programme that is not working gets changed instead of continuing for a year.',
          'It is most often used with autistic children, and it is applied to communication, daily living skills, play, social skills, and behaviours that are unsafe or that block learning.',
        ],
      },
      {
        h2: 'Our position on how it should be run',
        paras: [
          'Families researching ABA will find strong criticism of it, much of it from autistic adults describing older, compliance-driven programmes. We think that criticism is largely fair, and it shapes how we work.',
        ],
        list: [
          'Goals are built around the child\'s quality of life, not around making a child look less autistic',
          'Naturalistic, play-based teaching in real situations wherever possible, rather than long drill blocks at a table',
          'Communication comes first, including alternative and augmentative communication where speech is limited',
          'Stimming is not a target unless it is genuinely harmful. It usually serves a purpose worth understanding',
          'Distress is a signal to stop and rethink, never something to work through',
          'Parents see the data, and can change or end goals at any point',
        ],
      },
      {
        h2: 'Behaviour is communication',
        paras: [
          'Before any programme starts, we look at what a behaviour is achieving for the child. Behaviour that looks like defiance is very often a request, an escape from something overwhelming, or the only available way to say that something hurts.',
          'Once the function is clear, the work is usually to teach a better way of achieving the same thing, rather than simply removing the behaviour. Suppressing a behaviour without replacing its function tends to produce a different behaviour, and a more frustrated child.',
        ],
      },
      {
        h2: 'How intensive should it be?',
        paras: [
          'You may read that ABA requires 30 or 40 hours a week. We do not start there. We build a plan around what your child can tolerate, what your family can genuinely sustain, and what the goals actually require, then review it against the data.',
          'For many children a smaller, well-targeted programme alongside speech and occupational therapy achieves more than a large one that exhausts everybody by month three.',
        ],
      },
    ],
    keyPoints: [
      'Goals set around quality of life, chosen with parents and reviewed openly',
      'Naturalistic, play-based teaching rather than long table-top drilling',
      'Function of behaviour understood before any plan is written',
      'Hours matched to what the child and family can sustain, not a fixed number',
    ],
    faqs: [
      {
        q: 'Is ABA harmful?',
        a: 'Older compliance-focused programmes drew serious and legitimate criticism. Modern practice looks different, and how a programme is run matters far more than the label. Ask any provider exactly how they work.',
      },
      {
        q: 'Is ABA only for autistic children?',
        a: 'It is most commonly used with autistic children, but the principles apply to skill teaching and behaviour support more broadly, including developmental delay and intellectual disability.',
      },
      {
        q: 'How many hours a week does my child need?',
        a: 'It depends on goals, age and what your family can sustain. We build a realistic plan and review it against recorded progress rather than starting from a fixed number.',
      },
      {
        q: 'Will ABA stop my child stimming?',
        a: 'Not unless the stimming is genuinely harmful. Stimming usually serves a real purpose, and removing it without understanding that purpose is not something we do.',
      },
      {
        q: 'Can we combine ABA with speech and occupational therapy?',
        a: 'Yes, and most children do better that way. Because all three sit in the same team here, the goals are coordinated rather than pulling in different directions.',
      },
    ],
    related: ['autism', 'developmental-delay-treatment', 'occupational-therapy', 'speech-therapy', 'child-development-centre'],
  },

  {
    slug: 'physiotherapy',
    noRci: true,  // physiotherapists register with state councils, not the RCI
    metaBlurb: 'paediatric movement, tone, balance and coordination, plus adults',
    folder: 'physiotherapy',
    hubName: 'Physiotherapy Clinic',
    keyword: 'Physiotherapy Clinic',
    shortName: 'physiotherapy',
    hubMenu: 'Physiotherapy Hub',
    intent: 'commercial investigation',
    breadcrumb: 'Physiotherapy',
    lede:
      'Physiotherapy at eMbrace is mainly paediatric: movement, muscle tone, balance, posture and the physical foundations that sitting, walking and playing are built on. Where a child needs it alongside speech, occupational therapy or special education, all of that sits in one team.',
    sections: [
      {
        h2: 'What paediatric physiotherapy treats',
        paras: [
          'Movement difficulties in children rarely arrive alone. A child with low muscle tone often tires quickly at school, avoids playground equipment, and struggles with handwriting, and each of those looks like a separate problem until someone connects them.',
        ],
        list: [
          'Low muscle tone and delayed motor milestones such as sitting, crawling and walking',
          'Cerebral palsy, across the range of presentations',
          'Torticollis and plagiocephaly in infants',
          'Coordination and balance difficulties, including developmental coordination disorder',
          'Gait and posture concerns, toe walking, in-toeing',
          'Motor difficulties associated with Down syndrome, developmental delay and neuromuscular conditions',
        ],
      },
      {
        h2: 'How assessment and treatment run',
        paras: [
          'Assessment looks at movement rather than at a checklist: how your child moves, what compensations they have developed, what limits them and what motivates them. That last one decides whether a programme actually gets done.',
          'Treatment is play-based for younger children, because a two-year-old will not complete a set of exercises but will climb, push, pull and chase. Sessions build the strength and control your child is missing, and you leave with a short home programme that fits into ordinary daily routines.',
        ],
      },
      {
        h2: 'Working with the rest of the team',
        paras: [
          'Physiotherapy and occupational therapy overlap, and families often ask which one they need. Broadly, physiotherapy works on gross motor skills, strength, tone and mobility, while occupational therapy works on fine motor skills, sensory processing and daily living tasks. Many children need both, and here they can be planned together rather than separately.',
          'Where a medical opinion is relevant, our paediatric neurologist and developmental paediatrician are part of the same practice.',
        ],
      },
      {
        h2: 'Adults',
        paras: [
          'We also see adults for musculoskeletal and postural difficulties, including the neck, shoulder and back problems that desk work produces, and for rehabilitation alongside psychological support where pain and stress are feeding each other.',
        ],
      },
    ],
    keyPoints: [
      'Paediatric specialism, from infants with torticollis to school-age coordination difficulties',
      'Play-based sessions, because a home programme only works if it gets done',
      'Planned alongside occupational therapy rather than competing with it',
      'Medical input available in the same team where it is needed',
    ],
    faqs: [
      {
        q: 'What is the difference between physiotherapy and occupational therapy?',
        a: 'Physiotherapy focuses on gross motor skills, strength, tone and mobility. Occupational therapy focuses on fine motor skills, sensory processing and daily living tasks. Many children benefit from both.',
      },
      {
        q: 'My child walks on their toes. Does that need treatment?',
        a: 'Sometimes. Occasional toe walking in young children is common, but persistent toe walking, tight calf muscles or a one-sided pattern is worth assessing properly.',
      },
      {
        q: 'How soon should treatment start for torticollis?',
        a: 'Early. Infant torticollis responds well to prompt physiotherapy and positioning advice, and delaying makes head shape and neck movement harder to correct.',
      },
      {
        q: 'Do you provide a home programme?',
        a: 'Yes, and we keep it short deliberately. A few minutes built into daily routines is done consistently; a long programme is abandoned within a fortnight.',
      },
      {
        q: 'Do you see adults?',
        a: 'Yes, for musculoskeletal and postural difficulties, including work-related neck, shoulder and back problems, alongside psychological support where that is relevant.',
      },
    ],
    related: ['occupational-therapy', 'down-syndrome-treatment', 'developmental-delay-treatment', 'pediatric-neurologist', 'child-development-centre'],
  },

  {
    slug: 'pediatric-neurologist',
    medical: true,  // a doctor, not an RCI-registered psychologist
    metaBlurb: 'seizures, regression, headaches, tone and movement concerns',
    folder: 'pediatric-neurology',
    hubName: 'Pediatric Neurologist',
    keyword: 'Pediatric Neurologist',
    shortName: 'paediatric neurology',
    hubMenu: 'Paediatric Neurology Hub',
    intent: 'commercial investigation',
    breadcrumb: 'Pediatric Neurology',
    lede:
      'A paediatric neurologist is a medical doctor who diagnoses and treats conditions affecting a child\'s brain, spinal cord, nerves and muscles. Where a developmental or behavioural concern may have a medical cause underneath it, this is the specialist who can say.',
    sections: [
      {
        h2: 'When to see a paediatric neurologist',
        paras: [
          'Many developmental concerns are best assessed by a psychologist or therapist first. Others need a medical opinion before anything else, and the difference matters.',
        ],
        list: [
          'Seizures, staring episodes, or unexplained loss of awareness',
          'Loss of skills a child previously had, at any age',
          'Persistent or worsening headaches, particularly with vomiting or waking a child at night',
          'Marked differences in strength, tone or movement between the two sides of the body',
          'Very low or very high muscle tone, or unexplained weakness',
          'An unusually large or small head, or a change in head growth',
          'Tics, abnormal movements, or unsteadiness that is getting worse',
        ],
      },
      {
        h2: 'What the consultation involves',
        paras: [
          'A first consultation is mostly history and examination. Expect detailed questions about pregnancy, birth, milestones, family history and exactly what you have observed, followed by a neurological examination of tone, strength, reflexes, coordination and cranial nerves.',
          'Investigations are ordered only where they will change what happens next. That may include an EEG where seizures are suspected, imaging in specific circumstances, or blood tests. A good consultation frequently ends with reassurance and no test at all, and that is a real result rather than a wasted visit.',
        ],
      },
      {
        h2: 'Working alongside developmental care',
        paras: [
          'Neurological and developmental concerns overlap constantly. Regression, delayed milestones, unusual movements and difficult behaviour can each be medical, developmental, or both, and families are too often sent back and forth between specialists who never speak to each other.',
          'Because our paediatric neurologist works in the same practice as our developmental paediatrician, psychologists, speech and language therapists, occupational therapists and physiotherapists, a child who needs a medical opinion and a therapy plan gets both without starting again.',
        ],
      },
      {
        h2: 'A note on urgency',
        paras: [
          'Some things should not wait for an appointment. A first seizure, a seizure lasting more than five minutes, sudden weakness, a severe sudden headache, a head injury with drowsiness or vomiting, or a rapid loss of skills all need emergency medical care. Go to your nearest emergency department or call 112.',
        ],
      },
    ],
    keyPoints: [
      'Medical assessment for seizures, regression, headaches, tone and movement concerns',
      'Investigations ordered only where they change the plan',
      'Same team as our developmental paediatrician and therapy services',
      'Clear guidance on what is urgent and what can wait',
    ],
    faqs: [
      {
        q: 'When should I see a neurologist rather than a psychologist?',
        a: 'See a neurologist first for seizures, regression, persistent headaches, or clear differences in strength or tone. Behaviour, attention and learning concerns usually start with a psychologist.',
      },
      {
        q: 'Will my child need an EEG or a scan?',
        a: 'Only if it will change management. Many consultations end without investigations, and we will explain why a test is or is not needed before ordering anything.',
      },
      {
        q: 'What should I bring to the appointment?',
        a: 'Previous reports, discharge summaries, immunisation and growth records, a list of medicines, and a phone video of anything unusual you have seen. Video is genuinely valuable.',
      },
      {
        q: 'Is a referral required?',
        a: 'No. You can book directly. If your paediatrician has already sent notes or investigations, bring them so nothing is repeated unnecessarily.',
      },
      {
        q: 'Do you treat epilepsy long term?',
        a: 'Yes, including medication management and review. We coordinate with your paediatrician and, where needed, with the school so staff know what to do.',
      },
    ],
    related: ['developmental-pediatrician', 'developmental-delay-treatment', 'physiotherapy', 'autism', 'child-development-centre'],
  },

  {
    slug: 'developmental-pediatrician',
    medical: true,  // a doctor, not an RCI-registered psychologist
    metaBlurb: 'medical diagnosis of autism, ADHD and delay, with one written plan',
    folder: 'developmental-pediatrics',
    hubName: 'Developmental Pediatrician',
    keyword: 'Developmental Pediatrician',
    shortName: 'developmental paediatrics',
    hubMenu: 'Developmental Paediatrics Hub',
    intent: 'commercial investigation',
    breadcrumb: 'Developmental Pediatrics',
    lede:
      'A developmental paediatrician is a doctor who specialises in how children develop, learn and behave. They are the specialist who takes the whole picture, medical, developmental and behavioural, and turns it into one plan instead of five opinions.',
    sections: [
      {
        h2: 'What a developmental paediatrician does',
        paras: [
          'Where a general paediatrician manages health and growth, a developmental paediatrician looks at the developmental and behavioural picture in depth. That means milestones, learning, attention, social communication, sleep, feeding and behaviour, considered together and against a child\'s medical history.',
        ],
        list: [
          'Assessment and medical diagnosis of autism, ADHD and developmental delay',
          'Investigating medical contributors: hearing, vision, sleep, nutrition, thyroid, genetic conditions',
          'Medication review where it is appropriate, including for ADHD, with honest discussion of benefits and limits',
          'Coordinating therapy across speech, occupational therapy, physiotherapy and special education',
          'School reports, accommodations and disability certification support',
        ],
      },
      {
        h2: 'Why the medical picture matters',
        paras: [
          'A striking share of developmental concerns have a medical component that is easy to miss. Undetected hearing loss presents as speech delay and inattention. Poor sleep, including sleep apnoea, presents as hyperactivity in children rather than tiredness. Iron deficiency, thyroid problems and vitamin deficiencies all affect attention and mood.',
          'Checking those before concluding anything is not being thorough for its own sake. It changes the plan, it is quick, and it occasionally makes further intervention unnecessary.',
        ],
      },
      {
        h2: 'How this fits with psychological assessment',
        paras: [
          'Families frequently ask whether they need a developmental paediatrician or a clinical psychologist. For autism and ADHD, the strongest assessments involve both: standardised psychological tools such as ADOS-2, Conners and cognitive testing, alongside a medical assessment that rules out or accounts for physical contributors.',
          'At eMbrace both sit in the same team, so you get one integrated opinion and one plan rather than two reports that have to be reconciled by the parent.',
        ],
      },
      {
        h2: 'What happens after the diagnosis',
        paras: [
          'A diagnosis is only useful if something follows it. The consultation ends with a written plan: which therapies, at what intensity, in what order, what the school needs to do, what to watch for, and when to come back.',
          'That plan is reviewed as your child changes. Fees are quoted upfront on your intake call so you know what you are committing to before you start.',
        ],
      },
    ],
    keyPoints: [
      'Medical diagnosis of autism, ADHD and developmental delay, with the physical causes checked',
      'Works alongside our psychologists rather than duplicating them',
      'One written plan covering therapy, school and review, not a list of referrals',
      'Medication discussed honestly, including when it is not needed',
    ],
    faqs: [
      {
        q: 'What is the difference from a general paediatrician?',
        a: 'A general paediatrician manages health and growth. A developmental paediatrician specialises in development, learning and behaviour, and assesses those in far greater depth.',
      },
      {
        q: 'Do I need a psychologist as well?',
        a: 'For autism and ADHD, the strongest assessments combine both: standardised psychological testing plus a medical assessment. Here they happen in one team rather than two appointments elsewhere.',
      },
      {
        q: 'At what age can autism or ADHD be diagnosed?',
        a: 'Autism can often be identified from around 18 to 24 months. ADHD is usually diagnosed from about six, since younger behaviour overlaps heavily with normal preschool development.',
      },
      {
        q: 'Will my child be put on medication?',
        a: 'Not automatically. Medication is one option among several, discussed with you honestly, and many children we see are supported entirely through therapy and school accommodations.',
      },
      {
        q: 'What should I bring to the first appointment?',
        a: 'Growth and immunisation records, previous reports, school observations in writing, and a list of your specific concerns. Teacher input carries real diagnostic weight.',
      },
    ],
    related: ['pediatric-neurologist', 'autism', 'adhd', 'developmental-delay-treatment', 'child-development-centre'],
  },

  {
    slug: 'child-development-centre',
    metaBlurb: 'assessment and every relevant therapy in one team, one plan',
    folder: 'child-development-centre',
    hubName: 'Child Development Centre',
    keyword: 'Child Development Centre',
    shortName: 'child development centre',
    hubMenu: 'Child Development Centre',
    intent: 'navigational',
    breadcrumb: 'Child Development Centre',
    lede:
      'A child development centre brings assessment and every relevant therapy into one place, under one plan, with one team that talks to itself. For families, the practical difference is that a child who needs three services does not join three waiting lists at three addresses.',
    sections: [
      {
        h2: 'What sits under one roof',
        paras: [
          'eMbrace was built as a multidisciplinary practice rather than a single-therapy clinic, because most developmental concerns do not respect professional boundaries. A child referred for speech delay frequently needs feeding support, and a child referred for handwriting frequently turns out to have attention or coordination difficulties underneath it.',
        ],
        list: [
          'RCI-certified clinical psychologists and child psychologists',
          'Developmental paediatrician and paediatric neurologist',
          'Speech and language therapists, including feeding and oral motor specialists',
          'Occupational therapists, including sensory integration',
          'Physiotherapists',
          'Special educators and remedial teachers',
          'Expressive arts therapists and behaviour support',
        ],
      },
      {
        h2: 'How a first visit works',
        paras: [
          'It starts with a free 15-minute intake call, which exists to work out what you actually need. A meaningful number of those calls end with home strategies and a re-check in three months rather than an appointment, and we would rather tell you that than book you in.',
          'Where an assessment is warranted, you get a developmental history session, direct assessment with your child using standardised tools appropriate to their age, input from school where relevant, and then a feedback session in plain language with a written report you can act on.',
        ],
      },
      {
        h2: 'One plan, reviewed',
        paras: [
          'The output is a single plan: which therapies, how often, in what order, what happens at home, and what the school is being asked to do. Where several therapists are involved, they coordinate around shared goals rather than pulling a child in different directions.',
          'Progress is measured against the baseline set at assessment and reviewed openly with you. When therapy is no longer needed, we say so.',
        ],
      },
      {
        h2: 'Where we are',
        paras: [
          'eMbrace runs three centres across Delhi NCR: Vasant Kunj in South West Delhi, Malviya Nagar in South Delhi, and Gurugram on MG Road in Sector 24. We also see families online across India and abroad, and history-taking, feedback and much of therapy work well remotely. Direct assessment components, particularly ADOS-2, are done in person.',
        ],
      },
    ],
    keyPoints: [
      'Assessment, medical opinion and every relevant therapy in one team',
      'A free 15-minute intake call that can honestly end in "not yet"',
      'One written plan covering therapy, home and school, reviewed against a baseline',
      'Three centres across Delhi NCR plus online sessions',
    ],
    faqs: [
      {
        q: 'What is a child development centre?',
        a: 'A practice bringing developmental assessment and therapies together under one team and one plan, rather than treating each difficulty separately at separate clinics.',
      },
      {
        q: 'What age range do you work with?',
        a: 'From infancy through adolescence for developmental services, and adults for psychology, counselling and physiotherapy. Early intervention work often starts in the first year.',
      },
      {
        q: 'Do we need a diagnosis before coming?',
        a: 'No. Many families arrive with a concern rather than a diagnosis, and working out whether there is anything to diagnose is part of what we do.',
      },
      {
        q: 'How much does it cost?',
        a: 'Fees depend on the service and are quoted upfront on your intake call, in writing, before you commit to anything. There are no surprise charges later.',
      },
      {
        q: 'Can everything be done online?',
        a: 'History-taking, feedback and much of therapy work well online. Direct assessment components, particularly ADOS-2 for autism, need to be done in person.',
      },
    ],
    related: ['developmental-delay-treatment', 'developmental-pediatrician', 'pediatric-neurologist', 'speech-therapy', 'occupational-therapy'],
  },
];
