/**
 * Content model for the location pages in locations/.
 *
 * Consumed by generate-location-body.js, which writes the article body of each
 * locations/<service>-in-<locality>.php between LOCATION-BODY markers.
 *
 * Phase 2 of the rewrite described in LOCATION-PAGES-BRIEF.md. Option A was
 * chosen: all 110 pages rewritten in place. The brief's honest risk with Option
 * A is that siblings still overlap, so differentiation here is deliberate and
 * comes from four independent axes, every one of them traceable to a real
 * source:
 *
 *   1. LOCALITIES  which centre actually serves the area, and how you get there
 *   2. SERVICES    the clinical substance, which genuinely differs per service
 *   3. CLINICIANS  matched to BOTH centre and service, so the named people change
 *   4. PARTNERS    school and institutional work, mapped to catchment
 *
 * Rules this content is written to (from the seo-content-workflow skill, plus
 * what LOCATION-PAGES-BRIEF.md section 8 settled):
 *   - Indian English. No em dashes.
 *   - Nothing fabricated. No statistics, no outcome claims, no invented
 *     testimonials, no credentials beyond what the client supplied.
 *   - NO RCI wording anywhere. The client's clinician table carries no RCI
 *     registration data, so clinicians are described by the qualifications they
 *     actually hold. See generate-location-meta.js, where the same removal is
 *     applied to titles and descriptions.
 *   - Fees are never a number. Always "quoted upfront on your intake call".
 *   - Health content, so no diagnostic claims and no guaranteed outcomes.
 *   - FAQ answers stay between 20 and 35 words.
 *   - Travel facts are limited to what is checkable: metro line, station, stop
 *     counts and road names. No invented minute-counts, no parking claims.
 */

/* ------------------------------------------------------------------ centres */

/**
 * Three physical centres. Note that contact-us.php labels the third one
 * "Rainbow Center" in the visible card and "eMbrace — Malviya Nagar Centre" in
 * the schema; they are the same address. Pages use both names so either one a
 * family has heard resolves to the same place.
 */
const CENTRES = {
  'vasant-kunj': {
    name: 'eMbrace Vasant Kunj',
    shortName: 'our Vasant Kunj centre',
    address: 'C-7, Sector C, Pocket 5, Basement, Grand Vasant Kunj, New Delhi 110070',
    phone: '+91 99715 76800',
    // Sources disagree on which station serves the Vasant Kunj sectors: Munirka
    // on the Magenta Line is nearest by distance, Chhatarpur on the Yellow Line
    // is the more commonly used access point. Both are named rather than
    // picking one, and no walking time is claimed.
    nearestMetro: 'Munirka on the Magenta Line is nearest, Chhatarpur on the Yellow Line is the usual access point for the Vasant Kunj sectors',
  },
  'malviya-nagar': {
    name: 'eMbrace at Rainbow, Malviya Nagar',
    shortName: 'our Malviya Nagar centre',
    address: 'FC-29, Plot No. 5, Geetanjali, near Malviya Nagar Metro Station Gate No. 1, New Delhi 110017',
    phone: '+91 99715 76800',
    nearestMetro: 'Malviya Nagar, Yellow Line, beside Gate No. 1',
  },
  'gurugram': {
    name: 'eMbrace Gurugram',
    shortName: 'our Gurugram centre',
    address: '710, DLF City Court, Mehrauli-Gurgaon Road, Nathupur, Sector 24, Gurugram, Haryana 122002',
    phone: '+91 99109 77626',
    // Guru Dronacharya, not MG Road, is the nearest station to DLF City Court
    // at roughly 700 m. Both are on the Yellow Line and the address is on
    // Mehrauli-Gurgaon Road, which is what "MG Road" refers to in the address.
    nearestMetro: 'Guru Dronacharya, Yellow Line, roughly 700 metres away',
  },
};

/* --------------------------------------------------------------- clinicians */

/**
 * Exactly as supplied by the client, condensed to what belongs on a public
 * page. `line` is the one-sentence description used in "Who you would see".
 * `services` lists the page slugs each clinician should appear on.
 *
 * No RCI field: none was supplied. Do not add one without written confirmation.
 */
const CLINICIANS = {
  'supriya-malik': {
    name: 'Dr Supriya Malik',
    role: 'Founder and CEO, and Head of the Child Development Centre at Rainbow',
    // `short` is what location pages carry. `line` is the full version, for the
    // team page. Keeping the location-page version brief matters: this block
    // repeats on all 110 pages and is the single largest shared text on the set.
    // Her role and biography are both service-aware. The Child Development
    // Centre framing is accurate on child pages and misleading on adult ones,
    // and her supplied record states she works across the lifespan.
    roleByService: {
      'adult-counselling': 'Founder and CEO',
    },
    short: {
      default:
        'PhD in Developmental Psychology from the University of Birmingham, where she was also a postdoctoral researcher, and a Chartered Psychologist with the British Psychological Society in the UK. She designed the assessment and therapy pathways every eMbrace centre runs.',
      'adult-counselling':
        'PhD in Developmental Psychology from the University of Birmingham, where she was also a postdoctoral researcher, and a Chartered Psychologist with the British Psychological Society in the UK. She works across the lifespan, including anxiety and depression in adults, and designed the pathways every eMbrace centre runs.',
    },
    line:
      'Dr Supriya Malik holds a PhD in Developmental Psychology from the University of Birmingham, where she also worked as a postdoctoral researcher, and is a Chartered Psychologist with the British Psychological Society in the UK. Her clinical focus is autism, ADHD and learning disorders, alongside anxiety and depression, and she designed the assessment and therapy pathways every eMbrace centre runs.',
    centres: ['vasant-kunj', 'malviya-nagar', 'gurugram'],
    languages: 'English, Hindi and Punjabi',
  },
  'mahima-sahi': {
    name: 'Dr Mahima Sahi',
    role: 'Clinical Director',
    line:
      'Dr Mahima Sahi holds a PhD in Psychology and leads clinical supervision and therapist training across the practice. She is trained in Gottman Method Couples Therapy to Levels 1 and 2 in the USA, and in trauma-informed somatic and memory reconsolidation work through NICABM. Her own caseload is adult: developmental trauma, attachment injuries and high-functioning burnout.',
    centres: ['vasant-kunj'],
    languages: 'English, Hindi and Punjabi',
    services: ['adult-counselling'],
  },
  'dhriti-dharana': {
    name: 'Dhriti Dharana',
    role: 'Clinical Lead',
    short:
      'MSc in Clinical Health Psychology and Well-being from Middlesex University, UK. Behavioural therapy with neurodivergent children and parent training, from a neurodiversity-affirming position. Works in fluent English and native Hindi.',
    line:
      'Dhriti Dharana holds an MSc in Clinical Health Psychology and Well-being from Middlesex University in the UK, an MA in Psychology from Banaras Hindu University and a BA in Psychology from the University of Delhi. She works in behavioural therapy with neurodivergent children and children with behavioural difficulties, and runs parent training. Her background covers school psychology and crisis response with the Delhi Government and Hans Foundation School Health Clinic, ASD, ADHD and IEP work, and special education and behavioural support in the UK. She practises from a neurodiversity-affirming position.',
    centres: ['vasant-kunj'],
    languages: 'fluent English, native Hindi, basic German and basic Indian Sign Language',
    services: ['child-psychologist', 'child-counselling', 'special-education', 'autism-therapy', 'teen-counselling', 'aba-therapy', 'intellectual-disability-treatment', 'child-development-centre'],
  },
  'shruti-ghosh': {
    name: 'Shruti Ghosh',
    role: 'Clinical Psychologist',
    short:
      'M.Phil in Clinical Psychology with distinction from Amity University, Noida, and UGC-NET qualified. CBT, DBT, ACT and Parent Management Training across neurodevelopmental, mood and obsessive-compulsive presentations. Works in Hindi, English and Bengali.',
    line:
      'Shruti Ghosh holds an M.Phil in Clinical Psychology from Amity University, Noida, awarded with distinction, along with an MA in Clinical Psychology and a BA in Applied Psychology from the same university, and qualified UGC-NET in 2023. She works across neurodevelopmental, mood, obsessive-compulsive, dissociative, somatoform and personality presentations, using CBT, DBT, ACT, behaviour therapy and Parent Management Training.',
    centres: ['vasant-kunj'],
    languages: 'Hindi, English and Bengali',
    services: ['child-psychologist', 'child-counselling', 'teen-counselling', 'adult-counselling', 'adhd-assessment'],
  },
  'taranpreet-kaur': {
    name: 'Taranpreet Kaur',
    role: 'Clinical Psychologist',
    short:
      'M.Phil in Clinical Psychology with distinction, plus a Post Graduate Diploma in School Counselling from Symbiosis. ACT and MBCT for anxiety, depression, OCD and trauma, and comprehensive psychological assessment. Works in English, Hindi and Punjabi.',
    line:
      'Taranpreet Kaur holds an M.Phil in Clinical Psychology from Shree Guru Gobind Singh Tricentenary University, awarded with distinction, an MA in Clinical Psychology, and a Post Graduate Diploma in School Counselling from Symbiosis. She works with anxiety, depression, OCD, trauma and relationship difficulties using ACT and MBCT, and carries out comprehensive psychological assessment across intelligence, personality, symptomology and neuropsychological testing. The school counselling background matters when the presenting problem is happening in a classroom.',
    centres: ['vasant-kunj', 'malviya-nagar'],
    languages: 'English, Hindi and Punjabi',
    services: ['child-psychologist', 'child-counselling', 'teen-counselling', 'adult-counselling', 'learning-disability-assessment', 'adhd-assessment', 'intellectual-disability-treatment'],
  },
  'mannat-kaur-arora': {
    name: 'Mannat Kaur Arora',
    role: 'Psychologist',
    short:
      'Professional Diploma in Clinical Psychology from Amity University Haryana and an MA in Psychology from the University of Delhi. Assessment across MISIC, WISC-IV, Conners 3, CBCL, ISAA, CARS and the NIMHANS SLD battery. Works in English and Hindi.',
    line:
      'Mannat Kaur Arora holds a Professional Diploma in Clinical Psychology from Amity University Haryana, an MA in Psychology with a Clinical Psychology specialisation from the University of Delhi, and a BA in Psychology from Kamala Nehru College. Her assessment work covers ADHD, autism and specific learning disorder using MISIC, WISC-IV, Conners 3, CBCL, ISAA, CARS, VSMS, DST and the NIMHANS SLD battery. She runs individual and group therapy using CBT, DBT, ACT, ERP and play-based work, with trainee experience across VIMHANS, Amity Clinic and RML Hospital.',
    centres: ['vasant-kunj', 'gurugram'],
    languages: 'English and Hindi',
    services: ['child-psychologist', 'adhd-assessment', 'autism-assessment', 'learning-disability-assessment', 'child-counselling', 'teen-counselling', 'adult-counselling', 'intellectual-disability-treatment', 'child-development-centre'],
  },
  'cheesha-kanwar': {
    name: 'Cheesha Kanwar',
    role: 'Psychologist',
    short:
      'Completing an MSc in Clinical Psychology at Christ (Deemed to be University), with a BA (Hons) in Applied Psychology from the University of Delhi. Behaviour therapy and assessment support using WISC-V, NEPSY-II, Conners-3 and BRIEF-2. Works in English and Hindi.',
    line:
      'Cheesha Kanwar is completing an MSc in Clinical Psychology at Christ (Deemed to be University) and holds a BA (Hons) in Applied Psychology from Sri Aurobindo College, University of Delhi. She provides behaviour therapy support for children with neurodevelopmental conditions and assessment support using WISC-V, WAIS-IV, NEPSY-II, Conners-3, BASC-3 and BRIEF-2, with early intervention exposure through the Early Start Denver Model.',
    centres: ['vasant-kunj', 'malviya-nagar'],
    languages: 'English and Hindi',
    services: ['child-psychologist', 'autism-assessment', 'autism-therapy', 'adhd-assessment', 'child-counselling', 'aba-therapy', 'developmental-delay-treatment', 'child-development-centre'],
  },
  'arshita-matta': {
    name: 'Arshita Matta',
    role: 'Psychologist',
    short:
      'Integrated BA and MA in Clinical Psychology from Amity University, Noida. Case history taking, mental state examination, psychoeducation and counselling with children and adolescents. Works in English and Hindi.',
    line:
      'Arshita Matta holds an integrated BA and MA in Clinical Psychology from Amity University, Noida. She works on case history taking, mental state examination, psychoeducation and counselling with children and adolescents, with assessment exposure across CBCL, ISAA, MISIC, WAPIS, BDI, BAI, HAM-A and HAM-D, and Y-BOCS.',
    centres: ['vasant-kunj'],
    languages: 'English and Hindi',
    services: ['child-psychologist', 'child-counselling', 'teen-counselling'],
  },
  'agrima-aggarwal': {
    name: 'Dr Agrima Aggarwal',
    role: 'Occupational Therapist',
    line:
      'Dr Agrima Aggarwal is a PhD scholar in Occupational Therapy at Mahatma Gandhi University of Medical Sciences and Technology. She holds an MOT in Neurology from SVNIRTAR, Utkal University, where she was gold medallist, and a BOT from PDUNIPPD, University of Delhi. She works in paediatric occupational therapy and early intervention, alongside neurorehabilitation and cognitive rehabilitation.',
    centres: ['vasant-kunj', 'gurugram'],
    languages: 'English and Hindi',
    services: ['occupational-therapy', 'autism-therapy', 'autism-assessment', 'child-development-centre', 'developmental-delay-treatment', 'down-syndrome-treatment'],
  },
  'upasna': {
    name: 'Upasna',
    role: 'Speech Language Pathologist',
    line:
      'Upasna holds a Master and a Bachelor in Speech Language Pathology from the Ali Yavar Jung National Institute for Speech and Hearing Disability in Kolkata. Her paediatric work covers spoken language disorders, misarticulation, late language emergence, developmental verbal dyspraxia, developmental stuttering and cluttering, cleft lip and palate, cochlear implant support, cerebral palsy and pragmatic language difficulty in autism.',
    centres: ['malviya-nagar', 'vasant-kunj'],
    languages: 'Hindi, English and Bengali',
    services: ['speech-therapy', 'autism-therapy', 'oral-motor-therapy', 'autism-assessment', 'developmental-delay-treatment', 'down-syndrome-treatment', 'child-development-centre'],
  },
  'abha-mattoo': {
    name: 'Abha Mattoo',
    role: 'Paediatric Physiotherapist',
    line:
      'Abha Mattoo holds an MPT in Neurological Sciences with a paediatrics elective from Sikkim Manipal University and a BPT from H.N.B. Garhwal University. She works in paediatric neurological and cardiothoracic rehabilitation, and previously ran early intervention rehabilitation for children with autism and ADHD at the Sangamitra Centre in Bengaluru.',
    centres: ['malviya-nagar'],
    languages: 'native Kashmiri, Hindi and English',
    services: ['physiotherapy', 'autism-therapy', 'developmental-delay-treatment', 'down-syndrome-treatment'],
  },
};

/* ----------------------------------------------------------------- partners */

/**
 * School and institutional partnerships, as supplied by the client, who
 * confirmed on 18 August 2026 that consent is in place to name each of these in
 * prose. Logos for most are already published on the homepage partner strip.
 *
 * `sentence` is written once per partner and reused, so a partner reads the
 * same way wherever it appears. `localities` controls which pages it lands on.
 */
const PARTNERS = {
  'british-school': {
    name: 'The British School',
    sentence:
      'We work with The British School in Chanakyapuri on psychoeducational, cognitive and risk assessments, therapy for children and adolescents, and workshops for teachers, parents and pupils.',
  },
  'american-embassy-school': {
    name: 'American Embassy School',
    sentence:
      'At the American Embassy School in Chanakyapuri we carry out psychoeducational, cognitive, comprehensive and brief assessments, including risk assessments, and provide therapy for children and adolescents.',
  },
  'pathways-gurgaon': {
    name: 'Pathways School Gurgaon',
    sentence:
      'We work with Pathways School Gurgaon on psychoeducational, cognitive and risk assessments, therapy for children and adolescents, and workshops for teachers, parents and pupils.',
  },
  'woodstock': {
    name: 'Woodstock School',
    sentence:
      'Since 2024 we have run screening camps, teacher training and on-site counsellor support at Woodstock School in Mussoorie, with a referral pathway into full psychoeducational and cognitive assessment.',
  },
  'doon': {
    name: 'The Doon School',
    sentence:
      'Since 2025 we have delivered digital wellbeing and cyber safety workshops, teacher training and on-site counsellor support at The Doon School in Dehradun, with a referral pathway into assessment.',
  },
  'lincoln': {
    name: 'Lincoln School',
    sentence:
      'Since 2024 Lincoln School in Kathmandu has referred pupils to us for psychoeducational, cognitive, comprehensive and brief assessments, including risk assessments.',
  },
  'ashoka': {
    name: 'Ashoka University',
    sentence:
      'Since 2025 Ashoka University in Sonepat has referred students to us for psychoeducational and cognitive assessment, and for neurodiversity assessment covering autism and ADHD.',
  },
  'rainbow': {
    name: "Rainbow Children's Hospital",
    sentence:
      "Our Malviya Nagar centre runs inside Rainbow Children's Hospital, New Delhi, which is why occupational therapy, physiotherapy, speech therapy, behaviour therapy and special education sit in the same building as assessment.",
  },
  'sukoon': {
    name: 'Sukoon',
    sentence:
      'Where a child or adult needs psychiatric input, we work with Sukoon across Delhi NCR for psychiatric assessment, consultation and medication management, so you are not left to find a psychiatrist yourself.',
  },
  'medical-travel-company': {
    name: 'The Medical Travel Company',
    sentence:
      'Through The Medical Travel Company we provide autism and ADHD assessment and therapy for families in the UK, across Africa and elsewhere in India, on hybrid, in-person and online programmes.',
  },
  'atypical-advantage': {
    name: 'Atypical Advantage',
    sentence:
      'Since 2025 we have delivered corporate workshops with Atypical Advantage on inclusivity and neurodiversity, autism awareness and mental health awareness.',
  },
  'wtw': {
    name: 'WTW',
    sentence:
      'We are a mental health partner for corporates working with WTW, providing therapy support, assessment and workshops.',
  },
};

/* --------------------------------------------------------------- localities */

/**
 * One authored profile per locality. `gettingThere` is the section the brief
 * calls the differentiator: it names the centre, states plainly that the centre
 * is not in the locality where that is the case, and gives directions a parent
 * can act on.
 *
 * Travel detail is restricted to metro line, station, stop count and road name,
 * all of which are checkable and stable. Minute-counts and parking are not
 * claimed anywhere, because the client has not supplied them.
 */
const LOCALITIES = {
  'saket': {
    name: 'Saket',
    centre: 'malviya-nagar',
    heading: 'Which eMbrace centre Saket families use',
    gettingThere: [
      'Our centre is not in Saket. It is in Malviya Nagar, one Yellow Line stop north of Saket metro station, at FC-29, Plot No. 5, Geetanjali, beside Malviya Nagar Metro Station Gate No. 1. By road it is a short run up Press Enclave Marg.',
      'It is worth saying that plainly, because a good many clinic pages that rank for Saket are describing a room somewhere else entirely. Ours is the closest eMbrace centre to Saket, and for most families in Saket, Sainik Farms and Pushp Vihar it is the nearest specialist child psychology service of any kind.',
      "The centre runs inside Rainbow Children's Hospital, which is the practical reason a child who turns out to need occupational therapy, speech therapy or physiotherapy after an assessment does not have to be referred out to a second address.",
    ],
    partners: ['rainbow', 'sukoon'],
    catchment: 'Saket, Sainik Farms, Pushp Vihar, Khirki Extension and Said-ul-Ajaib',
  },
  'hauz-khas': {
    name: 'Hauz Khas',
    centre: 'malviya-nagar',
    heading: 'Which eMbrace centre Hauz Khas families use',
    gettingThere: [
      'Our centre is in Malviya Nagar, one Yellow Line stop south of Hauz Khas metro station, at FC-29, Plot No. 5, Geetanjali, beside Malviya Nagar Metro Station Gate No. 1. There is no eMbrace centre in Hauz Khas itself.',
      'For families in Hauz Khas, SDA, Safdarjung Development Area and Gulmohar Park, the metro is usually faster than driving down Aurobindo Marg at school-run hours, and a single stop with no interchange is manageable even with a child who finds travel difficult.',
      "The centre sits inside Rainbow Children's Hospital, so if an assessment points towards speech therapy, occupational therapy or physiotherapy, those run in the same building rather than at a second address across the city.",
    ],
    partners: ['rainbow', 'sukoon'],
    catchment: 'Hauz Khas, SDA, Safdarjung Development Area, Gulmohar Park and Green Park Extension',
  },
  'green-park': {
    name: 'Green Park',
    centre: 'malviya-nagar',
    heading: 'Which eMbrace centre Green Park families use',
    gettingThere: [
      'Our nearest centre to Green Park is in Malviya Nagar, two Yellow Line stops south, at FC-29, Plot No. 5, Geetanjali, beside Malviya Nagar Metro Station Gate No. 1. We do not have a centre in Green Park.',
      'From Green Park, Yusuf Sarai, Sarvapriya Vihar and Hauz Khas Enclave the run down Aurobindo Marg is direct, and the metro covers it in two stops on one line with no change.',
      "Because the centre is inside Rainbow Children's Hospital, a child who needs speech and language therapy or occupational therapy after assessment continues in the same building with clinicians who already have the report.",
    ],
    partners: ['rainbow', 'sukoon'],
    catchment: 'Green Park, Yusuf Sarai, Sarvapriya Vihar, Hauz Khas Enclave and Sadhna Enclave',
  },
  'greater-kailash': {
    name: 'Greater Kailash',
    centre: 'malviya-nagar',
    heading: 'Which eMbrace centre Greater Kailash families use',
    gettingThere: [
      'Families from Greater Kailash come to our Malviya Nagar centre at FC-29, Plot No. 5, Geetanjali, beside Malviya Nagar Metro Station Gate No. 1. There is no eMbrace centre in GK itself, and the honest position is that this is a drive rather than a walk.',
      'From GK-1 and GK-2 the usual route is across Outer Ring Road to Press Enclave Marg. On the metro it means a Violet Line to Yellow Line change, so most GK families drive, and we schedule around the school run rather than pretending traffic does not exist.',
      "The centre runs inside Rainbow Children's Hospital, which matters most to GK families precisely because the journey is longer: assessment, therapy and any onward paediatric input happen at one address rather than three.",
    ],
    partners: ['rainbow', 'sukoon'],
    catchment: 'Greater Kailash I and II, Chittaranjan Park, Alaknanda and Kalkaji',
  },
  'defence-colony': {
    name: 'Defence Colony',
    centre: 'malviya-nagar',
    heading: 'Which eMbrace centre Defence Colony families use',
    gettingThere: [
      'Our closest centre to Defence Colony is in Malviya Nagar, at FC-29, Plot No. 5, Geetanjali, beside Malviya Nagar Metro Station Gate No. 1. We have no centre in Defence Colony, and it is a drive of some length, not a hop.',
      'From Defence Colony, Jangpura and Lajpat Nagar the road route runs via Ring Road and Press Enclave Marg. On the metro it is a Violet Line to Yellow Line change at Central Secretariat or Hauz Khas depending on where you start, so most families in this catchment drive.',
      'For families where the travel is the obstacle rather than the appointment, we run sessions online, and a good deal of child psychology work, particularly parent-facing sessions, does not lose anything in that format.',
    ],
    partners: ['rainbow', 'sukoon'],
    catchment: 'Defence Colony, Jangpura, Lajpat Nagar, Andrews Ganj and South Extension',
  },
  'vasant-kunj': {
    name: 'Vasant Kunj',
    centre: 'vasant-kunj',
    heading: 'Our Vasant Kunj centre',
    gettingThere: [
      'This is the one locality page where the centre really is in the locality. eMbrace Vasant Kunj is at C-7, Sector C, Pocket 5, in the basement of Grand Vasant Kunj, New Delhi 110070.',
      'It is our largest team, and the practical consequence is choice: if a clinician is not the right fit for your child, or you need a particular language, there is somebody else in the building rather than a wait for the one person who does that work.',
      'Families reach us here from across south-west Delhi, including Vasant Vihar, Munirka, R.K. Puram, Safdarjung Enclave, Anand Niketan, Shanti Niketan, West End Colony, Moti Bagh and Chanakyapuri.',
    ],
    partners: ['british-school', 'american-embassy-school', 'sukoon'],
    catchment: 'Vasant Kunj, Vasant Vihar, Munirka, R.K. Puram, Safdarjung Enclave, Anand Niketan, Shanti Niketan, West End Colony, Moti Bagh and Chanakyapuri',
  },
  'gurgaon': {
    name: 'Gurgaon',
    centre: 'gurugram',
    heading: 'Our Gurugram centre',
    gettingThere: [
      'eMbrace Gurugram is at 710, DLF City Court, Mehrauli-Gurgaon Road, Nathupur, Sector 24, Gurugram 122002. Guru Dronacharya on the Yellow Line is roughly 700 metres away, which makes this one of the few specialist child psychology services in Gurugram you can reach without a car.',
      'That matters for families coming from DLF Phases 1 to 4, Sushant Lok, Sector 54 and the sectors around it, and it matters again for teenagers who would rather come to a session independently than be dropped off by a parent.',
      'Delhi families sometimes choose Gurugram over our Delhi centres simply because the Mehrauli-Gurgaon Road run is easier from where they live than crossing south Delhi. Either centre is fine, and the same pathway runs at both.',
    ],
    partners: ['pathways-gurgaon', 'sukoon'],
    catchment: 'DLF Phases 1 to 4, Sushant Lok, Sectors 54, 55, 58, 59 and 60, Nathupur and South City',
  },
  'noida': {
    name: 'Noida',
    centre: 'malviya-nagar',
    // No centre within reach for a weekly appointment, so pages for this
    // locality are written online-first. The generator uses this to avoid
    // copy that assumes a regular in-person journey.
    onlineFirst: true,
    heading: 'How Noida families see us',
    gettingThere: [
      'We should be straight about this one: eMbrace has no centre in Noida. Our three centres are in Vasant Kunj, Malviya Nagar and Gurugram, and from most of Noida that is a genuine cross-city journey with a Blue Line to Yellow Line change at Rajiv Chowk.',
      'So for most Noida families the sensible answer is online. Consultation, parent sessions, feedback appointments and a good deal of therapy run perfectly well over video, and it removes the part of the process that most often causes families to drop out, which is the travel.',
      'Where an in-person appointment is genuinely necessary, and cognitive and psychoeducational assessment is the clearest case, we usually schedule it at Malviya Nagar and try to group the testing so you make the trip once rather than weekly. If your child is at school in south Delhi, that often works out easier than it sounds.',
    ],
    partners: ['sukoon'],
    catchment: 'Noida, Greater Noida, Indirapuram and the surrounding parts of Uttar Pradesh',
  },
  'delhi': {
    name: 'Delhi',
    centre: 'vasant-kunj',
    heading: 'Which of our Delhi centres you would use',
    gettingThere: [
      'We have two centres in Delhi, and which one you use is a question of geography rather than service, because the same pathway runs at both.',
      'eMbrace Vasant Kunj, at C-7, Sector C, Pocket 5, Grand Vasant Kunj, is the larger team and serves south-west Delhi: Vasant Vihar, Munirka, R.K. Puram, Safdarjung Enclave, Anand Niketan, Shanti Niketan, Moti Bagh and Chanakyapuri.',
      "eMbrace at Rainbow, Malviya Nagar, at FC-29, Plot No. 5, Geetanjali, beside Malviya Nagar Metro Station Gate No. 1, serves the Yellow Line corridor through Saket, Hauz Khas and Green Park, and the drive-in catchment of Greater Kailash and Defence Colony. It runs inside Rainbow Children's Hospital, so multidisciplinary therapy sits in the same building as assessment.",
      'If you are in north or west Delhi, either centre is a real journey, and we would usually suggest starting online and coming in only for the parts that have to happen in a room.',
    ],
    partners: ['rainbow', 'british-school', 'american-embassy-school', 'sukoon'],
    catchment: 'Delhi, with in-person appointments at Vasant Kunj and Malviya Nagar',
  },
  'south-delhi': {
    name: 'South Delhi',
    centre: 'malviya-nagar',
    heading: 'Which eMbrace centre South Delhi families use',
    gettingThere: [
      'Both our Delhi centres are in south Delhi, which makes this the one part of the city where you have a real choice rather than a nearest option.',
      'eMbrace at Rainbow, Malviya Nagar, at FC-29, Plot No. 5, Geetanjali, sits beside Malviya Nagar Metro Station Gate No. 1 on the Yellow Line. It is the closer centre from Saket, Hauz Khas, Green Park, Greater Kailash and Defence Colony, and because it runs inside Rainbow Children\'s Hospital, therapy across occupational therapy, speech therapy and physiotherapy is in the same building.',
      'eMbrace Vasant Kunj, at C-7, Sector C, Pocket 5, Grand Vasant Kunj, is the closer centre from Vasant Vihar, Munirka, R.K. Puram and Safdarjung Enclave, and carries the larger clinical team.',
      'If you are unsure which to pick, the free intake call sorts it out in a couple of minutes, and we would rather do that than have you drive to the wrong side of Aurobindo Marg.',
    ],
    partners: ['rainbow', 'british-school', 'american-embassy-school', 'sukoon'],
    catchment: 'Saket, Hauz Khas, Green Park, Greater Kailash, Defence Colony, Vasant Kunj, Vasant Vihar and R.K. Puram',
  },
};

/* ----------------------------------------------------------------- services */

/**
 * Authored per service. Batch 1 covers child-psychologist. Each subsequent
 * batch adds its service here; the generator refuses to write a page whose
 * service is missing rather than emitting a templated stand-in.
 *
 * `seenMost` is keyed by locality where the picture genuinely differs, with a
 * `default` for the rest. This is the section the brief flags as the main lever
 * separating sibling pages, so it is written per locality rather than swapped.
 */
const SERVICES = {
  'child-psychologist': {
    name: 'Child Psychologist',
    noun: 'child psychology',
    keyword: 'child psychologist',
    hub: '/child-psychology/child-psychologist',
    hubName: 'Child Psychology Hub',

    lede: locality =>
      `If you are looking for a child psychologist in ${locality.name}, this page tells you which of our centres you would actually come to, what happens at the first appointment and who you would see. ` +
      `${locality.leadCentreSentence} Nothing is booked until you have had a free 15-minute intake call, which is with a clinician rather than a receptionist.`,

    cadence:
      'Worth knowing before you plan the journey: seeing a child psychologist starts as a small number of appointments, not a standing weekly commitment. The consultation, the parent history and the feedback session are usually three visits over a few weeks. Whether anything follows, and how often, is decided at the feedback session with you rather than assumed at the start.',

    /**
     * Deliberately brief. The full version of both of these lives on the
     * service hub, where it is written once and can be as long as it needs to
     * be. Repeating 500 words of general clinical guidance across ten locality
     * pages is what made the original set near-duplicates of each other, and
     * writing ten variations of it would be padding rather than differentiation.
     */
    whenRight: {
      h2: 'When a child psychologist is the right call',
      paras: [
        'Most of what worries parents is developmentally ordinary and passes. What separates the two is not how bad the behaviour looks on its worst day, but whether it has persisted, whether it shows up in more than one setting, and whether it has started to get in the way of ordinary life.',
      ],
      list: [
        'The same difficulty at home and at school, rather than in only one place',
        'A change that has lasted more than a few weeks and is not shifting',
        'Anxiety that has started to shrink what your child will attempt',
        'Any talk of self-harm, at any age, which warrants an appointment the same week',
      ],
      after: [],
      hubLink: 'The longer version, including the signs that usually do not need a psychologist at all, is on our child psychology hub.',
    },

    firstAppointment: {
      h2: 'What happens at your first appointment',
      paras: [
        'The first appointment is a consultation, not a test. Nothing is diagnosed on day one. You start with the free 15-minute intake call, then a parent history session usually without your child present, then a session with your child pitched to their age, then a feedback session where you get the formulation in plain language, a written summary and a plan with a review point in it.',
        'Bring school reports and any previous assessment. If a class teacher or school counsellor knows your child well, their observations are often the single most useful thing you can bring.',
      ],
      list: [],
      after: [],
    },

    seenMost: {
      h2: 'What we see most often',
      default: [
        'Across our child psychology caseload the largest groups are anxiety presenting as avoidance, difficulties with emotional regulation and anger, low self-esteem and confidence, friendship and peer difficulties, and behaviour that has become entrenched at home. Underneath a fair proportion of these sits an unidentified neurodevelopmental difference, which is why the assessment and therapy sides of the practice are not kept apart.',
      ],
      'saket': [
        'From the Saket catchment the most common referral reasons are school-related: refusal, avoidance around specific subjects, exam anxiety in the senior years, and behaviour that teachers have flagged before parents did. Saket and Sainik Farms sit in a dense school belt, and a good number of our referrals arrive with a class teacher already involved, which is helpful, because it means we are not relying on a single account of what is happening.',
        'The second group is younger: parents of three to six year olds who have been told to wait and see for a year and are no longer comfortable waiting. That instinct is usually right, and an early consultation costs far less than the year.',
      ],
      'hauz-khas': [
        'From Hauz Khas, SDA and Gulmohar Park the pattern skews towards academic pressure and anxiety in older children, and towards attention difficulties that were absorbed by a small primary class and became visible when the workload rose. Parents in this catchment often arrive well informed and having already read a good deal, which shortens the first conversation considerably.',
        'We also see a steady stream of screen and sleep referrals, where the presenting complaint is device use and the underlying one is that a child is awake at midnight because they are anxious.',
      ],
      'green-park': [
        'From Green Park, Yusuf Sarai and Sarvapriya Vihar the common pattern is a younger child, often between four and nine, referred for anger, meltdowns after school, or a level of separation anxiety that has stopped shifting. The after-school meltdown is worth naming, because it is frequently the sign of a child holding themselves together all day at school and running out of capacity at the door.',
        'The other frequent route in is through a paediatrician who has ruled out a physical cause for stomach aches or headaches and suggested a psychological opinion.',
      ],
      'greater-kailash': [
        'From Greater Kailash, CR Park and Alaknanda the largest group is adolescents: low mood, exam stress, social anxiety, and conflict at home that has settled into a pattern neither side can get out of. Because GK families are travelling further, we tend to front-load the assessment work and then run therapy in a mix of in-person and online sessions.',
        'We also see a good deal of sibling and family work from this catchment, where the referral is nominally about one child and turns out to be about how the household is functioning.',
      ],
      'defence-colony': [
        'From Defence Colony, Jangpura and Lajpat Nagar the most common referral reasons are anxiety and low mood in secondary-age children, and behaviour difficulties in younger ones that have become entrenched over a year or more. Families in this catchment frequently come after trying a school counsellor first, which is a sensible order and means we are usually picking up where somebody else has already made a start.',
        'Given the journey, a fair number of Defence Colony families run the parent-facing sessions online and come in only for the sessions with the child.',
      ],
      'vasant-kunj': [
        'Vasant Kunj is our largest caseload and the broadest. It runs from three-year-olds referred for speech and social communication concerns, through primary-age children with attention and regulation difficulties, to teenagers with anxiety, low mood and school avoidance.',
        'The international school catchment shapes it too. We see a steady number of children who have moved country and school in the same year, where what looks like a behaviour problem is a transition that has not been given enough time or enough language support, and children referred by school learning support teams with a specific question already framed.',
      ],
      'gurgaon': [
        'The Gurugram caseload skews younger and more developmental than our Delhi centres. The commonest referrals are attention and regulation difficulties in primary-age children, social communication concerns in the early years, and behaviour that has become difficult to manage at home.',
        'The second pattern is adolescent anxiety, particularly around academic pressure, and here the metro connection does real work: teenagers who would refuse to be driven to a session by a parent will often come on the metro themselves, and a teenager who arrives under their own steam engages very differently.',
      ],
      'noida': [
        'Because Noida families see us mainly online, the caseload is weighted towards the work that suits that format well: anxiety, low mood, school refusal, parent coaching and behaviour plans, and follow-up therapy after an assessment done elsewhere.',
        'The commonest reason a Noida family travels in is cognitive or psychoeducational assessment, which cannot be done properly over video, and second opinions where a diagnosis has been given quickly and the parents want it examined more slowly.',
      ],
      'delhi': [
        'Across both Delhi centres the largest groups are anxiety showing up as avoidance, emotional regulation and anger difficulties, school refusal, friendship difficulties, and low confidence. A meaningful proportion of these turn out to have an unidentified neurodevelopmental difference underneath, most often attention difficulty or a specific learning difficulty that was masked by a bright child working twice as hard as their classmates.',
        'The other steady stream is school-referred: a learning support team or a class teacher who has noticed something and asked the family to seek an opinion, often with a specific question already attached.',
      ],
      'south-delhi': [
        'Across the south Delhi catchment the picture is dominated by school-related presentations, which is unsurprising given the density of schools between Vasant Kunj and Greater Kailash. Refusal, exam anxiety, subject-specific avoidance and attention difficulties that surfaced when the workload rose account for a large share of referrals.',
        'The second group is early years: parents of three to six year olds who have been told to wait and see, and who have decided not to. The third is adolescents, where low mood and social anxiety are the usual reasons and where the family conflict that arrives with them is often the more urgent thing to work on.',
      ],
    },

    timelines: {
      h2: 'Fees and timelines',
      paras: [
        'Fees are quoted upfront on your intake call, before anything is booked. We do not publish a number because it depends on which clinician you see and what the work involves, and a figure on a web page would be a guess at your situation rather than a price for it.',
        'A therapy course is reviewed formally at around session six, and we would expect you to be seeing some change by then. If you are not, that is a reason to change the plan rather than persist with it.',
      ],
    },

    /**
     * Written per locality rather than templated. The two questions every
     * catchment asks, cost and whether a diagnosis comes on day one, appear
     * everywhere because they are what people actually search, but the answers
     * are anchored to the centre that locality uses so the pages do not repeat
     * one another word for word.
     */
    faqs: {
      'saket': [
        {
          q: 'Is there an eMbrace centre in Saket?',
          a: 'No. Our nearest centre is in Malviya Nagar, one Yellow Line stop north of Saket metro station, at FC-29 Geetanjali beside Gate No. 1.',
        },
        {
          q: 'How do Saket families usually get to the Malviya Nagar centre?',
          a: 'Most drive up Press Enclave Marg, which is a short run. If you would rather not drive, it is one metro stop from Saket with no interchange.',
        },
        {
          q: 'Can therapy happen in the same place as the assessment?',
          a: "Yes. The Malviya Nagar centre runs inside Rainbow Children's Hospital, so occupational therapy, speech therapy and physiotherapy are in the same building rather than at a second address.",
        },
        {
          q: 'Will my child be given a diagnosis at the first appointment?',
          a: 'No. The first appointment is a consultation. Any diagnosis follows structured assessment across more than one session and more than one source of information.',
        },
        {
          q: 'How much does a child psychologist cost in Saket?',
          a: 'Fees are quoted on your free 15-minute intake call, before anything is booked. The figure depends on which clinician you see and what the work actually involves.',
        },
      ],
      'hauz-khas': [
        {
          q: 'Where is the nearest child psychologist to Hauz Khas?',
          a: 'Our Malviya Nagar centre, one Yellow Line stop south of Hauz Khas metro station, at FC-29 Geetanjali beside Gate No. 1. We have no centre in Hauz Khas itself.',
        },
        {
          q: 'Is it quicker to drive or take the metro from Hauz Khas?',
          a: 'At school-run hours the metro usually wins, since it is a single stop with no change. Outside those hours Aurobindo Marg is straightforward enough by car.',
        },
        {
          q: 'My child struggles with travel. Does that rule out in-person sessions?',
          a: 'Not usually. One stop with no interchange is manageable for most children, and we can also run parent-facing sessions online so the trips in are fewer.',
        },
        {
          q: 'Will my child be given a diagnosis at the first appointment?',
          a: 'No. Day one is a consultation. Any diagnosis follows structured assessment over more than one session, drawing on school information as well as what we see.',
        },
        {
          q: 'How much does a child psychologist cost in Hauz Khas?',
          a: 'Fees are quoted upfront on your free 15-minute intake call. We do not publish a figure because it depends on the clinician and the work involved.',
        },
      ],
      'green-park': [
        {
          q: 'Do you have a centre in Green Park?',
          a: 'No. The nearest is our Malviya Nagar centre, two Yellow Line stops south of Green Park, at FC-29 Geetanjali beside Malviya Nagar Metro Station Gate No. 1.',
        },
        {
          q: 'How do Green Park families get to the centre?',
          a: 'Straight down Aurobindo Marg by road, or two stops on the metro with no change. Both routes are direct, which is not true of every South Delhi catchment.',
        },
        {
          q: 'My paediatrician suggested a psychological opinion. Do I need a formal referral?',
          a: 'No, you can book directly. Bring whatever the paediatrician has written, because ruling out a physical cause is genuinely useful information for us to have.',
        },
        {
          q: 'My child melts down after school but is fine there. Is that worth an appointment?',
          a: 'Often yes. It commonly means a child is holding themselves together all day and running out of capacity at the door, which is worth understanding properly.',
        },
        {
          q: 'How much does a child psychologist cost in Green Park?',
          a: 'Fees are quoted on your free 15-minute intake call, before you book. The figure depends on which clinician you see and what the work involves.',
        },
      ],
      'greater-kailash': [
        {
          q: 'Is there an eMbrace centre in Greater Kailash?',
          a: 'No. GK families come to our Malviya Nagar centre at FC-29 Geetanjali. The honest position is that this is a drive rather than a walk.',
        },
        {
          q: 'What is the best route from GK-1 or GK-2?',
          a: 'Across Outer Ring Road onto Press Enclave Marg. The metro means a Violet to Yellow Line change, so most families from this catchment drive instead.',
        },
        {
          q: 'Can we do some of the work online to cut down the travel?',
          a: 'Yes, and many GK families do. We front-load the in-person assessment work and then run a mix of in-person and online therapy sessions.',
        },
        {
          q: 'We came about one child but things are difficult with the siblings too. Can you help?',
          a: 'Yes. A fair number of referrals from this catchment turn out to be as much about how the household is functioning as about the child named on the form.',
        },
        {
          q: 'How much does a child psychologist cost in Greater Kailash?',
          a: 'Fees are quoted upfront on your free 15-minute intake call. It depends on the clinician and the work, so we quote your situation rather than an average.',
        },
      ],
      'defence-colony': [
        {
          q: 'Where would we actually go from Defence Colony?',
          a: 'To our Malviya Nagar centre at FC-29 Geetanjali, beside Malviya Nagar Metro Station Gate No. 1. There is no eMbrace centre in Defence Colony.',
        },
        {
          q: 'How long is the journey, realistically?',
          a: 'It is a proper drive rather than a hop, via Ring Road and Press Enclave Marg. On the metro it needs a Violet to Yellow Line change, so most families drive.',
        },
        {
          q: 'We have already seen the school counsellor. Is that a problem?',
          a: 'No, it is a sensible order and it helps. Bring whatever they have written, because it usually means we are picking up where somebody has already made a start.',
        },
        {
          q: 'Can the parent sessions be online and only my child come in?',
          a: 'Yes. Given the journey, a number of Defence Colony families run parent-facing work online and come in only for the sessions with the child.',
        },
        {
          q: 'How much does a child psychologist cost in Defence Colony?',
          a: 'Fees are quoted on your free 15-minute intake call, before anything is booked, and they depend on which clinician you see and what the work involves.',
        },
      ],
      'vasant-kunj': [
        {
          q: 'Where exactly is your Vasant Kunj centre?',
          a: 'At C-7, Sector C, Pocket 5, in the basement of Grand Vasant Kunj, New Delhi 110070. This is one of the localities where the centre really is in the locality.',
        },
        {
          q: 'Why does it matter that this is your largest team?',
          a: 'Choice. If a clinician is not the right fit for your child, or you need a particular language, there is somebody else in the building rather than a wait.',
        },
        {
          q: 'We have just moved country and school. Is what we are seeing a behaviour problem?',
          a: 'Often it is a transition that has not been given enough time or enough language support. We see this pattern regularly in the international school catchment.',
        },
        {
          q: 'Our school learning support team has asked us to get an opinion. Can you write to them?',
          a: 'Yes, with your consent. Where a school has framed a specific question, a report written to answer that question is far more use than a general one.',
        },
        {
          q: 'How much does a child psychologist cost in Vasant Kunj?',
          a: 'Fees are quoted upfront on your free 15-minute intake call. The figure depends on which clinician you see and what the work actually involves.',
        },
      ],
      'delhi': [
        {
          q: 'Which of your Delhi centres should we go to?',
          a: 'Vasant Kunj if you are in south-west Delhi, Malviya Nagar if you are on the Yellow Line corridor through Saket, Hauz Khas and Green Park. The same pathway runs at both.',
        },
        {
          q: 'We live in north or west Delhi. Is it worth the journey?',
          a: 'Both centres are a real trip from there. We would usually suggest starting online and coming in only for the parts that have to happen in a room.',
        },
        {
          q: 'What is the difference between the two centres?',
          a: "Vasant Kunj carries the larger clinical team. Malviya Nagar runs inside Rainbow Children's Hospital, so multidisciplinary therapy sits in the same building as assessment.",
        },
        {
          q: 'Will my child be given a diagnosis at the first appointment?',
          a: 'No. The first appointment is a consultation. Any diagnosis follows structured assessment across more than one session and more than one source of information.',
        },
        {
          q: 'How much does a child psychologist cost in Delhi?',
          a: 'Fees are quoted on your free 15-minute intake call, before you book anything, and depend on which clinician you see and what the work involves.',
        },
      ],
      'south-delhi': [
        {
          q: 'Which South Delhi centre is closer to us?',
          a: 'Malviya Nagar from Saket, Hauz Khas, Green Park, Greater Kailash and Defence Colony. Vasant Kunj from Vasant Vihar, Munirka, R.K. Puram and Safdarjung Enclave.',
        },
        {
          q: 'Does it matter which one we pick?',
          a: 'Only for travel. The same pathway runs at both. The free intake call settles it in a couple of minutes, which beats driving to the wrong side of Aurobindo Marg.',
        },
        {
          q: 'Our child was fine at primary school and is struggling now. Why?',
          a: 'A very common pattern in this catchment. Attention or learning difficulties that a small primary class absorbed often become visible when the workload rises.',
        },
        {
          q: 'We were told to wait and see. Should we?',
          a: 'That advice is sometimes right and often not. If you are no longer comfortable waiting, an early consultation costs considerably less than the year does.',
        },
        {
          q: 'How much does a child psychologist cost in South Delhi?',
          a: 'Fees are quoted upfront on your free 15-minute intake call. We quote your situation rather than an average, so it depends on the clinician and the work.',
        },
      ],
      default: [
        {
          q: 'What age does a child need to be to see a child psychologist?',
          a: 'We see children from around two years old through to eighteen. For under-fives the work is largely with parents and play-based with the child, since young children show difficulty rather than describing it.',
        },
        {
          q: 'Do I need a referral from a paediatrician?',
          a: 'No. You can book directly. If a paediatrician, school counsellor or teacher has already written something, bring it, because it saves repeating history and often sharpens the question we are answering.',
        },
        {
          q: 'Will my child be given a diagnosis at the first appointment?',
          a: 'No. The first appointment is a consultation. A diagnosis, where one is appropriate at all, follows structured assessment across more than one session and more than one source of information.',
        },
        {
          q: 'How many sessions will my child need?',
          a: 'It depends on what we find. We review formally at around session six and tell you plainly whether the work is helping. Some children need a handful of sessions, others considerably longer.',
        },
        {
          q: 'How much does a child psychologist cost?',
          a: 'Fees are quoted upfront on your free 15-minute intake call, before you book anything. The figure depends on which clinician you see and what the work involves, so we quote your situation rather than an average.',
        },
      ],
      'noida': [
        {
          q: 'Is there an eMbrace child psychologist in Noida?',
          a: 'We have no centre in Noida. Noida families see us online, or travel to our Malviya Nagar centre in south Delhi for the parts of the work that have to happen in a room.',
        },
        {
          q: 'Is online child psychology as effective as in person?',
          a: 'For anxiety, low mood, school refusal and parent coaching, the evidence base for online delivery is good. Formal cognitive and psychoeducational testing is the clear exception and needs to be done in person.',
        },
        {
          q: 'Do I need a referral from a paediatrician?',
          a: 'No. You can book directly. If a paediatrician, school counsellor or teacher has already written something, bring it, because it saves repeating history and sharpens the question we are answering.',
        },
        {
          q: 'Will my child be given a diagnosis at the first appointment?',
          a: 'No. The first appointment is a consultation. A diagnosis, where one is appropriate at all, follows structured assessment across more than one session and more than one source of information.',
        },
        {
          q: 'How much does a child psychologist cost?',
          a: 'Fees are quoted upfront on your free 15-minute intake call, before you book anything. The figure depends on which clinician you see and what the work involves, so we quote your situation rather than an average.',
        },
      ],
      'gurgaon': [
        {
          q: 'Where exactly is your Gurugram centre?',
          a: 'At 710, DLF City Court, Mehrauli-Gurgaon Road, Nathupur, Sector 24, with Guru Dronacharya on the Yellow Line roughly 700 metres away, so it is reachable by metro rather than only by car.',
        },
        {
          q: 'What age does a child need to be to see a child psychologist?',
          a: 'We see children from around two years old through to eighteen. For under-fives the work is largely with parents and play-based with the child, since young children show difficulty rather than describing it.',
        },
        {
          q: 'Can my teenager come to a session on their own?',
          a: 'Yes, and many do, given the centre is on MG Road. We would still want at least one parent session, and for under-eighteens we agree the confidentiality boundaries with everyone at the start.',
        },
        {
          q: 'Will my child be given a diagnosis at the first appointment?',
          a: 'No. The first appointment is a consultation. A diagnosis, where one is appropriate at all, follows structured assessment across more than one session and more than one source of information.',
        },
        {
          q: 'How much does a child psychologist cost?',
          a: 'Fees are quoted upfront on your free 15-minute intake call, before you book anything. The figure depends on which clinician you see and what the work involves, so we quote your situation rather than an average.',
        },
      ],
    },
  },
};

/**
 * Batch 2. Written to diverge from child-psychologist on the service axis,
 * which is the harder of the two: a family in Saket looking at both pages sees
 * the same centre, the same clinicians and the same catchment, so everything
 * that differentiates has to come from the service itself.
 *
 * The split that makes it honest rather than cosmetic: the child psychologist
 * page is about working out what is going on, and this one is about the therapy
 * hour itself. So this page covers what happens in the room, what a parent is
 * and is not told, whether a child will actually talk, how a course runs and
 * how it ends. None of that appears on the psychologist page, and the intake
 * and assessment detail that page carries does not appear here.
 */
SERVICES['child-counselling'] = {
  name: 'Child Counselling',
  noun: 'child counselling',
  keyword: 'child counselling',
  hub: '/child-psychology/child-counselling',
  hubName: 'Child Counselling',

  lede: locality =>
    `Child counselling in ${locality.name} is the therapy itself: the weekly hour in which a child works on what is actually troubling them. ` +
    `${locality.leadCentreSentence} This page covers what happens in that room, what you will and will not be told about it, and how long a course usually runs.`,

  cadence:
    'Counselling is a weekly commitment rather than a single appointment, which changes how much the journey matters. A route that is fine once is a different proposition every week for three months, and travel is the commonest reason a family stops coming before the work is finished. Say so on the intake call and we will build the scheduling around your week, including running some sessions online.',

  whenRight: {
    h2: 'Counselling, or assessment first?',
    paras: [
      'Counselling is therapy: a child works on anxiety, anger, confidence, friendships, grief or a change at home. Assessment is diagnostic testing for something like ADHD, autism or a learning difficulty. Most children need the first, but some need the second before the first will work, because counselling a child for low confidence when the cause is an unidentified reading difficulty treats the symptom and leaves the cause.',
    ],
    list: [
      'Counselling suits a child whose difficulty is emotional or relational',
      'Assessment comes first where the difficulty is with learning, attention or communication',
      'Both at once is common, and the two clinicians talk to each other',
    ],
    after: [],
    hubLink: 'The full picture of how the therapy itself works is on our child counselling page.',
  },

  firstAppointment: {
    h2: 'What a counselling session actually looks like',
    paras: [
      'It depends almost entirely on age. Under about eight it is play-based and looks like playing, because that is how young children process what they cannot yet say. From eight to twelve it mixes talking, drawing and structured activities. With teenagers it looks much more like adult therapy, with the young person setting a good deal of the agenda. Sessions run weekly at the same time, because the predictability is part of what makes it work.',
      'On confidentiality, which is what parents ask about most: what your child says in the room is broadly theirs, and that privacy is what makes them willing to say anything at all. You get themes, progress and what to do at home, not a transcript. The exception, which we explain to your child at the start, is anything suggesting they are at risk.',
    ],
    list: [],
    after: [],
  },

  seenMost: {
    h2: 'What children work on in counselling here',
    default: [
      'The commonest themes are anxiety, anger and emotional regulation, confidence and self-esteem, friendship difficulties, and adjusting to a change at home such as a bereavement, a separation or a move.',
    ],
    'saket': [
      'From Saket the largest group by some way is school-related worry: exam pressure in the senior years, avoidance of a particular subject or teacher, and the aftermath of friendship groups shifting. Saket and Sainik Farms sit in a dense school belt, and a fair amount of the counselling work is about a child managing a highly competitive environment rather than about anything wrong with the child.',
      'The second theme is transitions, most often a child who has changed school and has not settled, where six sessions of focused work does more than a year of waiting for it to come right on its own.',
    ],
    'hauz-khas': [
      'From Hauz Khas and SDA the dominant theme in counselling is perfectionism and the anxiety that travels with it: children who are doing well by every external measure and are miserable about it. That work is largely about lowering the internal bar rather than raising performance.',
      'Sleep and screens come up constantly and are usually downstream of the same thing. A child awake at midnight on a phone is often a child who cannot switch off a worried mind, and counselling that treats the phone as the problem tends not to hold.',
    ],
    'green-park': [
      'From Green Park and Sarvapriya Vihar the counselling caseload skews young, roughly four to nine, and the work is mostly play-based. The recurring themes are anger and after-school meltdowns, separation anxiety that has not eased with time, and adjusting to a new sibling or a grandparent moving in.',
      'With this age group a good deal of the change comes from the parent sessions rather than the child sessions, because a four-year-old cannot restructure their own environment and a parent can.',
    ],
    'greater-kailash': [
      'From Greater Kailash and CR Park the counselling work is weighted towards adolescents: low mood, social anxiety, and conflict at home that both sides know is a pattern and neither can break. With teenagers the first two or three sessions are often spent simply establishing that this is their space and not an extension of a parental complaint.',
      'Family and sibling work is a recurring second thread from this catchment, where counselling nominally for one child turns out to be about how the whole household handles conflict.',
    ],
    'defence-colony': [
      'From Defence Colony and Jangpura the themes are anxiety and low mood in secondary-age children, and long-standing behaviour difficulties in younger ones where the pattern has had a year or more to set. Families here have often seen a school counsellor first, so the counselling we do tends to start further along than it otherwise would.',
      'Grief and bereavement work is a steadier thread from this catchment than from most, and it is work that specifically does not benefit from being rushed.',
    ],
    'vasant-kunj': [
      'Vasant Kunj brings the widest age range and the most international caseload. A distinctive theme here is the third-culture child: a family that has moved country, sometimes more than once, where a child is managing loss of friendships, a new language of instruction and a new set of social rules all at the same time.',
      'Alongside that, the ordinary run of counselling themes: anxiety, anger, confidence, friendships and adjusting to change at home. Being our largest team means the fit between a child and a counsellor can actually be chosen rather than assigned, which matters more in counselling than in any other work we do.',
    ],
    'gurgaon': [
      'The Gurugram counselling caseload splits in two. Younger children come for anger, emotional regulation and behaviour that has become hard to manage at home, and that work is play-based and heavily parent-supported.',
      'Adolescents come for anxiety, academic pressure and low mood, and here the metro connection does something genuinely useful: a teenager who will not be driven to a session by a parent will often travel to one alone, and a young person who arrives under their own steam engages with counselling in a completely different way from one who has been delivered to it.',
    ],
    'noida': [
      'Because Noida families work with us online, the counselling caseload leans towards what that format suits, and it suits a great deal of it. Anxiety, low mood, school refusal, confidence work and parent coaching all run well over video, and for some anxious children a session from their own room is easier than a waiting room ever was.',
      'Play-based work with very young children is the honest exception. Under about six, counselling over video asks more of a parent than most weeks allow, and we would usually say so rather than take the booking.',
    ],
    'delhi': [
      'Across both Delhi centres the counselling themes are anxiety, anger and emotional regulation, confidence, friendship difficulties, and adjusting to change at home. What varies is age: the Vasant Kunj caseload runs wider and more international, while Malviya Nagar sees more school-referred work from the Yellow Line corridor.',
      'The other steady thread across the city is grief and family change, including separation, which is work that needs a slower course than the six to eight sessions most other themes take.',
    ],
    'south-delhi': [
      'Across the south Delhi catchment counselling is dominated by school-related themes, which follows from the density of schools between Vasant Kunj and Greater Kailash: exam pressure, subject avoidance, and friendship groups reorganising themselves in the senior years.',
      'Underneath that sits a quieter and more common theme, which is children who are performing perfectly well and are unhappy. That work is rarely about school at all, and it is the reason we do not treat good marks as evidence that a child is fine.',
    ],
  },

  timelines: {
    h2: 'Fees, how long a course runs, and how it ends',
    paras: [
      'Fees are quoted upfront on your intake call, before anything is booked, and depend on which clinician your child works with.',
      'Most courses run eight to sixteen weekly sessions, formally reviewed at around session six. Grief, trauma and family change need longer. If a course is not working the answer is to change it, not to book more of it. Endings are planned over the last two or three sessions, because a child who has trusted an adult with difficult material should not simply stop seeing them one week.',
    ],
  },

  faqs: {
    'saket': [
      {
        q: 'Where is child counselling near Saket?',
        a: 'At our Malviya Nagar centre, one Yellow Line stop north of Saket metro station. Weekly sessions there are a short run up Press Enclave Marg from most of Saket.',
      },
      {
        q: 'My child says they do not want to come. Should I make them?',
        a: 'Bring them once. Most reluctance is fear of what counselling is rather than refusal of help, and it usually settles once a child has seen the room and met the person.',
      },
      {
        q: 'Will you tell me what my child says in the session?',
        a: 'You get themes, progress and what to do at home, not a transcript. Anything suggesting your child is at risk is always shared, and we tell your child that at the start.',
      },
      {
        q: 'How many sessions will it take?',
        a: 'Most courses run eight to sixteen weekly sessions, reviewed formally at around session six. Grief and family change usually need longer than anxiety or confidence work.',
      },
      {
        q: 'How much does child counselling cost in Saket?',
        a: 'Fees are quoted on your free 15-minute intake call, before anything is booked, and depend on which clinician your child works with.',
      },
    ],
    'hauz-khas': [
      {
        q: 'Is there child counselling in Hauz Khas?',
        a: 'Our nearest centre is Malviya Nagar, one Yellow Line stop south of Hauz Khas. For weekly sessions most families find the metro easier than Aurobindo Marg at peak times.',
      },
      {
        q: 'My child is doing well at school but seems unhappy. Is counselling appropriate?',
        a: 'Yes, and it is one of the commonest reasons children come to us from this area. Good marks are not evidence that a child is coping, and often disguise the opposite.',
      },
      {
        q: 'Is the problem really just screen time?',
        a: 'Usually not on its own. A child awake late on a phone is often a child who cannot switch off a worried mind, and treating the phone alone rarely holds.',
      },
      {
        q: 'Can I sit in on the sessions?',
        a: 'For very young children, sometimes. From about eight upwards, no, because the privacy is what makes a child willing to say anything. You are seen separately at intervals.',
      },
      {
        q: 'How much does child counselling cost in Hauz Khas?',
        a: 'Fees are quoted upfront on your free 15-minute intake call. The figure depends on the clinician and the work, so we quote your situation rather than an average.',
      },
    ],
    'green-park': [
      {
        q: 'How young is too young for counselling?',
        a: 'We work with children from around three. Under eight the sessions are play-based and look like playing, because that is how young children process what they cannot yet put into words.',
      },
      {
        q: 'Where would we go from Green Park?',
        a: 'Our Malviya Nagar centre, two Yellow Line stops south, or straight down Aurobindo Marg by road. Both routes are direct, which helps with a weekly appointment.',
      },
      {
        q: 'My child is fine at school and melts down at home. Why?',
        a: 'Commonly because they are holding themselves together all day and running out of capacity at the door. It is one of the more workable things counselling addresses.',
      },
      {
        q: 'Do I need to be involved, or do you just see my child?',
        a: 'With this age group a great deal of the change comes from the parent sessions. A young child cannot restructure their own environment and you can.',
      },
      {
        q: 'How much does child counselling cost in Green Park?',
        a: 'Fees are quoted on your free 15-minute intake call, before you book anything, and depend on which clinician your child works with and what the work involves.',
      },
    ],
    'greater-kailash': [
      {
        q: 'Is there an eMbrace counselling centre in Greater Kailash?',
        a: 'No. GK families come to our Malviya Nagar centre via Outer Ring Road and Press Enclave Marg. For a weekly appointment that journey is worth planning around.',
      },
      {
        q: 'Can we do some sessions online to make a weekly course workable?',
        a: 'Yes, and many GK families do exactly that. A mix of in-person and online sessions keeps a course running that would otherwise stop because of the travel.',
      },
      {
        q: 'My teenager refuses to talk to me. Will they talk to a counsellor?',
        a: 'Often, yes, and usually because a counsellor is not you. The first sessions establish that this is their space rather than an extension of a parental complaint.',
      },
      {
        q: 'The problem seems to be the whole family, not one child. Can you help with that?',
        a: 'Yes. A good number of referrals from this catchment start as one child and turn out to be about how the household handles conflict.',
      },
      {
        q: 'How much does child counselling cost in Greater Kailash?',
        a: 'Fees are quoted upfront on your free 15-minute intake call. It depends on the clinician and the work involved, so we quote your situation rather than an average.',
      },
    ],
    'defence-colony': [
      {
        q: 'Where would we go for counselling from Defence Colony?',
        a: 'Our Malviya Nagar centre, via Ring Road and Press Enclave Marg. It is a real drive, which matters more for weekly counselling than for a one-off appointment.',
      },
      {
        q: 'We have already seen the school counsellor. Is more counselling useful?',
        a: 'Usually yes, and it starts further along. Bring what they have written, because it means we are continuing work rather than beginning it from scratch.',
      },
      {
        q: 'Can counselling help a child after a bereavement?',
        a: 'Yes, and it is a steady part of our work from this catchment. Grief work generally needs a longer course than anxiety or confidence work, and should not be rushed.',
      },
      {
        q: 'Can my child be seen online so we are not driving every week?',
        a: 'From about eight upwards, yes, and many families here run a mix. Play-based work with under-sixes is the honest exception and works better in person.',
      },
      {
        q: 'How much does child counselling cost in Defence Colony?',
        a: 'Fees are quoted on your free 15-minute intake call, before anything is booked, and depend on which clinician your child works with.',
      },
    ],
    'vasant-kunj': [
      {
        q: 'Where is your Vasant Kunj counselling centre?',
        a: 'At C-7, Sector C, Pocket 5, in the basement of Grand Vasant Kunj. It is our largest team, which means the fit between child and counsellor can be chosen rather than assigned.',
      },
      {
        q: 'We have moved country and our child has not settled. Is that a counselling matter?',
        a: 'Very often. Losing friendships, a new language of instruction and new social rules at once is a great deal to manage, and it is a common theme here.',
      },
      {
        q: 'Can my child work with a counsellor in a specific language?',
        a: 'Usually. Across the team we work in English, Hindi, Punjabi and Bengali. Tell us on the intake call and we will match on it rather than on availability.',
      },
      {
        q: 'What if my child does not get on with their counsellor?',
        a: 'Tell us and we will change them. Fit matters more in counselling than in any other work we do, and a poor match is not something to persist with.',
      },
      {
        q: 'How much does child counselling cost in Vasant Kunj?',
        a: 'Fees are quoted upfront on your free 15-minute intake call. The figure depends on which clinician your child works with and what the work involves.',
      },
    ],
    'gurgaon': [
      {
        q: 'Where is child counselling in Gurgaon?',
        a: 'At 710, DLF City Court, Mehrauli-Gurgaon Road, Sector 24, with Guru Dronacharya on the Yellow Line roughly 700 metres away.',
      },
      {
        q: 'Can my teenager come to counselling on their own?',
        a: 'Yes, and many do, given the metro is close. A young person who arrives under their own steam usually engages with counselling very differently from one who is delivered to it.',
      },
      {
        q: 'My younger child is angry and hard to manage at home. Is counselling the answer?',
        a: 'Often partly. With younger children the work is play-based and heavily parent-supported, because what changes at home matters more than the therapy hour itself.',
      },
      {
        q: 'Will you tell me what my child says in the session?',
        a: 'You get themes, progress and what to do at home, not a transcript. Anything suggesting your child is at risk is always shared, and your child knows that from the start.',
      },
      {
        q: 'How much does child counselling cost in Gurgaon?',
        a: 'Fees are quoted on your free 15-minute intake call, before anything is booked, and depend on which clinician your child works with.',
      },
    ],
    'noida': [
      {
        q: 'Do you offer child counselling in Noida?',
        a: 'Online, yes, and that is how most Noida families work with us. We have no centre in Noida; the nearest is Malviya Nagar, which is a cross-city journey.',
      },
      {
        q: 'Does counselling actually work over video for a child?',
        a: 'From about eight upwards, well. For some anxious children a session from their own room is easier than a waiting room. Under six, play-based work is better in person.',
      },
      {
        q: 'My child refuses to sit in front of a camera. What then?',
        a: 'Tell us on the intake call. Sometimes a different format helps, sometimes it points to travelling in for the first few sessions to build the relationship first.',
      },
      {
        q: 'How many sessions will it take?',
        a: 'Most courses run eight to sixteen weekly sessions with a formal review at around session six. Grief and family change usually need longer than anxiety work.',
      },
      {
        q: 'How much does online child counselling cost?',
        a: 'Fees are quoted upfront on your free 15-minute intake call, before you book anything, and depend on which clinician your child works with.',
      },
    ],
    'delhi': [
      {
        q: 'Which Delhi centre would we go to for counselling?',
        a: 'Vasant Kunj if you are in south-west Delhi, Malviya Nagar if you are on the Yellow Line corridor. For a weekly appointment, pick on journey rather than on anything else.',
      },
      {
        q: 'What is the difference between counselling and seeing a child psychologist?',
        a: 'Counselling is the therapy itself. Seeing a psychologist usually starts with working out what is going on, which may or may not lead into counselling.',
      },
      {
        q: 'Will you tell me what my child says?',
        a: 'You get themes, progress and what to do at home, not a transcript. Anything suggesting your child is at risk is always shared, and your child is told that at the start.',
      },
      {
        q: 'Can counselling run alongside an assessment?',
        a: 'Yes, and it commonly does. A child can be in weekly counselling while an assessment runs in parallel, and the two clinicians talk to each other.',
      },
      {
        q: 'How much does child counselling cost in Delhi?',
        a: 'Fees are quoted on your free 15-minute intake call, before anything is booked, and depend on which clinician your child works with and what the work involves.',
      },
    ],
    'south-delhi': [
      {
        q: 'Which South Delhi centre is closer for weekly counselling?',
        a: 'Malviya Nagar from Saket, Hauz Khas, Green Park, Greater Kailash and Defence Colony. Vasant Kunj from Vasant Vihar, Munirka, R.K. Puram and Safdarjung Enclave.',
      },
      {
        q: 'My child does well at school. Is counselling still appropriate?',
        a: 'Yes. Children performing perfectly well and quietly unhappy are a large part of the South Delhi caseload, and good marks are not evidence that a child is coping.',
      },
      {
        q: 'My child does not want to come. Should I insist?',
        a: 'Bring them once. Most reluctance is fear of what counselling is rather than refusal of help, and it usually eases once they have seen the room.',
      },
      {
        q: 'How long does a course of counselling run?',
        a: 'Usually eight to sixteen weekly sessions, formally reviewed at around session six. Endings are planned over the last few sessions rather than being abrupt.',
      },
      {
        q: 'How much does child counselling cost in South Delhi?',
        a: 'Fees are quoted upfront on your free 15-minute intake call. We quote your situation rather than an average, so it depends on the clinician and the work.',
      },
    ],
    default: [
      {
        q: 'What happens in a child counselling session?',
        a: 'It depends on age. Under eight it is play-based, eight to twelve mixes talking and activities, and with teenagers it looks much more like adult therapy.',
      },
      {
        q: 'Will you tell me what my child says in the session?',
        a: 'You get themes, progress and what to do at home, not a transcript. Anything suggesting your child is at risk is always shared, and your child knows that.',
      },
      {
        q: 'My child says they do not want to come. Should I make them?',
        a: 'Bring them once. Most reluctance is fear of what counselling is rather than refusal of help, and it usually settles once they have met the person.',
      },
      {
        q: 'How many sessions will it take?',
        a: 'Most courses run eight to sixteen weekly sessions, reviewed formally at around session six. Grief and family change generally need longer than anxiety or confidence work.',
      },
      {
        q: 'How much does child counselling cost?',
        a: 'Fees are quoted upfront on your free 15-minute intake call, before you book anything, and depend on which clinician your child works with.',
      },
    ],
  },
};

/**
 * Batch 3. The sibling to guard against here is child-counselling, not
 * child-psychologist: both are talking therapy and both run weekly.
 *
 * What genuinely separates them is consent and privacy. With a younger child,
 * confidentiality is something we explain to a parent. With an adolescent it is
 * negotiated with the young person, and it decides whether they engage at all.
 * So this page is written to the teenager as much as to the parent paying for
 * it, which no other page in the set is.
 *
 * Shared sections are kept under roughly 120 words each from the start, per the
 * lesson batches 1 and 2 both had to learn the expensive way.
 */
SERVICES['teen-counselling'] = {
  name: 'Teen Counselling',
  noun: 'teen counselling',
  keyword: 'teen counselling',
  hub: '/teen-mental-health/teen-counselling',
  hubName: 'Teen Mental Health Hub',

  lede: locality =>
    `Teen counselling in ${locality.name} is confidential therapy for young people between roughly thirteen and eighteen. ` +
    `${locality.leadCentreSentence} If you are the teenager reading this rather than the parent, the section on what stays private is the one worth reading first.`,

  cadenceByLocality: {
    'noida':
      'Two practical things about adolescents seen online. The first is privacy: a young person needs somewhere they can speak without being overheard, and that is worth solving before the first session rather than during it. The second is timing. Their week is genuinely full, and an online slot late in the afternoon or in the evening is the one that survives school, coaching and boards.',
  },

  cadence:
    'Two practical things about adolescents specifically. They can usually travel to a session alone, and a young person who arrives under their own steam engages very differently from one who has been driven there by a parent. And their week is genuinely full: school, coaching, boards. We schedule around that rather than expecting a teenager to drop something, and late-afternoon and evening slots are the ones that hold.',

  whenRight: {
    h2: 'When teen counselling is the right call',
    paras: [
      'Adolescence is legitimately turbulent, and most of it does not need a therapist. What matters is duration, spread and function: whether something has persisted for weeks rather than days, whether it shows up in more than one part of their life, and whether it has started to shrink what they will do.',
    ],
    list: [
      'Low mood or anxiety that has lasted several weeks and is not lifting',
      'Withdrawal from friends, activities or school they previously managed',
      'Exam or performance pressure that has stopped being motivating and started being disabling',
      'Any self-harm, or any talk of not wanting to be here, which we see the same week',
    ],
    after: [],
    hubLink: 'Exam anxiety, social anxiety, low mood and digital and gaming difficulties each have their own page on our teen mental health hub.',
  },

  firstAppointment: {
    h2: 'What stays private, and what does not',
    paras: [
      'This is the part that decides whether counselling works for a teenager, so we settle it in the first session with the young person and the parent in the room together. What a young person says is theirs. A parent gets themes, progress and what would help at home. A parent does not get a transcript, and we will not pass on what was said because it was asked for.',
      'The limit is risk. If we believe a young person is at serious risk of harm, we share what we need to in order to keep them safe, and we tell them we are doing it rather than going behind them. Setting that out plainly at the start is what makes the privacy credible for the rest of the work.',
    ],
    list: [],
    after: [],
  },

  seenMost: {
    h2: 'What teenagers bring to counselling here',
    default: [
      'The commonest themes are anxiety, low mood, academic and exam pressure, social and friendship difficulty, self-esteem, conflict at home, and the tangle of sleep, screens and comparison that sits underneath a good deal of it.',
    ],
    'saket': [
      'From Saket the dominant theme is academic load. Board years, coaching on top of school, and a peer group in which everyone is visibly competing. A large share of the work is helping a young person separate their worth from a percentage, which is harder in this catchment than the phrase makes it sound.',
      'The second theme is friendship groups reorganising in the senior years, now largely conducted on phones, where a fallout is visible, permanent and witnessed by everyone. Teenagers rarely present that as the problem and it is often the actual one.',
    ],
    'hauz-khas': [
      'From Hauz Khas and SDA the recurring picture is the high-achieving and quietly miserable teenager: results that look excellent and a young person running on anxiety to produce them. That work is usually about lowering an internal standard rather than improving performance, and parents are sometimes surprised by how little it has to do with study technique.',
      'University applications are a distinct second theme from around sixteen, particularly where a young person and their family want different things and neither has said so directly.',
    ],
    'green-park': [
      'From Green Park the caseload skews to younger adolescents, roughly thirteen to fifteen, and the themes reflect that: the jump into senior school, friendship groups shifting, body image, and the first serious experience of academic pressure.',
      'This age also brings the beginning of the autonomy negotiation at home, where a young person is asking for privacy and independence faster than a parent is ready to give it. Some of the most useful work at this age is with the parents.',
    ],
    'greater-kailash': [
      'From Greater Kailash and CR Park the largest group is low mood and social anxiety in older adolescents, alongside conflict at home that both sides recognise as a pattern and neither can break alone.',
      'Because the journey is longer from this catchment, a fair number of families run a mix of in-person and online sessions. With teenagers that works well, provided the young person has somewhere at home they can actually speak freely.',
    ],
    'defence-colony': [
      'From Defence Colony and Jangpura the common presentations are anxiety and low mood in the senior school years, often reaching us after a school counsellor has been involved. That means the work usually starts further along than it otherwise would.',
      'Self-harm disclosures are a real part of adolescent practice and this catchment is no different. We see those the same week, we work with the young person on what is driving it rather than only on stopping it, and we are explicit with them about what has to be shared.',
    ],
    'vasant-kunj': [
      'Vasant Kunj brings the most international adolescent caseload we see. Distinctive themes: identity for a young person who has grown up across several countries and does not feel fully from any of them, the loss that comes with a parent posting ending, and applications to universities abroad.',
      'Alongside that, the ordinary run of adolescent work: anxiety, low mood, friendships, self-esteem and conflict at home. Being our largest team matters here because with teenagers the fit between young person and counsellor is not a nicety, it is the whole thing.',
    ],
    'gurgaon': [
      'The Gurugram adolescent caseload has one clear structural advantage: Guru Dronacharya is close enough that a young person can come to counselling on their own. That changes the work. A teenager who has chosen to be in the room is a different proposition from one who has been delivered to it, and we see more self-referred young people here than anywhere else.',
      'The themes themselves are academic pressure, anxiety, low mood, and gaming and screen use that has stopped being recreation. Households where both parents work long corporate hours are common in this catchment, and the loneliness that sits behind heavy gaming is often the thing worth working on.',
    ],
    'noida': [
      'Noida families work with us online, and with teenagers that raises something worth naming before you book: privacy at home. A young person cannot speak freely from a room where family are in earshot, and a session conducted in whispers is not a session.',
      'We work that out on the intake call, and the answer is sometimes headphones and a closed door, sometimes a different time of day, and sometimes travelling in to Malviya Nagar for the first few sessions to build the relationship before moving online. The themes themselves are the usual ones: exam stress, anxiety, low mood and school refusal.',
    ],
    'delhi': [
      'Across both Delhi centres adolescent work is dominated by academic pressure, anxiety and low mood, with friendship difficulty and conflict at home close behind. What varies is the flavour: Vasant Kunj sees more international school and third-culture work, Malviya Nagar more board-year pressure from the Yellow Line corridor.',
      'The city-wide constant is sleep. A very large proportion of adolescents we see are chronically short of it, and it makes every other presenting problem harder to shift.',
    ],
    'south-delhi': [
      'Across south Delhi the adolescent caseload is shaped by the density of schools and coaching centres between Vasant Kunj and Greater Kailash. Board pressure, subject-specific dread, and comparison with a peer group that is always visible account for a large share of referrals.',
      'The quieter and more common presentation is a teenager performing well and not enjoying anything. It rarely reaches us early, because nothing has gone visibly wrong, and it is some of the most worthwhile work we do.',
    ],
  },

  timelines: {
    h2: 'Fees, consent and how long it runs',
    paras: [
      'Fees are quoted upfront on your intake call, before anything is booked, and depend on which clinician the young person works with.',
      'Most courses run eight to sixteen weekly sessions with a formal review at around session six. On consent: a parent books and pays for a young person under eighteen, but the therapy only works if the teenager has agreed to it. We will not do useful work with someone who has been sent under protest, and we would rather spend the first session earning their agreement than pretend we have it.',
    ],
  },

  faqs: {
    'saket': [
      { q: 'Will you tell my parents what I say?', a: 'You get themes and progress, they do not get a transcript. The only thing we always share is serious risk of harm, and we tell you before we do it.' },
      { q: 'Where is teen counselling near Saket?', a: 'At our Malviya Nagar centre, one Yellow Line stop north of Saket metro station, close enough that most teenagers here travel to sessions on their own.' },
      { q: 'My child is in a board year. Is now a bad time to start?', a: 'Usually the opposite. Board pressure is the commonest reason teenagers come to us from Saket, and waiting until after the exams misses the point of the help.' },
      { q: 'My teenager refuses to go. What now?', a: 'Ask them to come once, with no commitment beyond that. Most refusal is about not knowing what it is, and it usually softens after one session.' },
      { q: 'How much does teen counselling cost in Saket?', a: 'Fees are quoted on your free 15-minute intake call, before anything is booked, and depend on which clinician the young person works with.' },
    ],
    'hauz-khas': [
      { q: 'Will you tell my parents what I say?', a: 'They get themes and progress, not a transcript. The exception is serious risk of harm, which we always share, and we tell you before we do it.' },
      { q: 'My teenager is doing well academically. Is counselling still appropriate?', a: 'Yes, and it is the commonest picture we see from this area. Good results produced by anxiety are not evidence that a young person is coping.' },
      { q: 'Can counselling help with university application stress?', a: 'Yes. It is a distinct theme here from about sixteen, particularly where a young person and their family want different things and nobody has said so directly.' },
      { q: 'Where would we go from Hauz Khas?', a: 'Our Malviya Nagar centre, one Yellow Line stop south. For a weekly appointment around school and coaching, most families find the metro more reliable than driving.' },
      { q: 'How much does teen counselling cost in Hauz Khas?', a: 'Fees are quoted upfront on your free 15-minute intake call. The figure depends on the clinician and the work involved.' },
    ],
    'green-park': [
      { q: 'Is thirteen too young for teen counselling?', a: 'No. Thirteen to fifteen is the bulk of our adolescent work from Green Park, and the themes at that age are senior school, friendships and body image.' },
      { q: 'Will you tell my parents what I say?', a: 'They get themes and progress, not a transcript. The only thing we always pass on is serious risk of harm, and we tell you first.' },
      { q: 'We argue constantly about independence. Is that a counselling matter?', a: 'Often yes, and some of the most useful work at this age is with the parents rather than only with the young person.' },
      { q: 'Where would we go from Green Park?', a: 'Our Malviya Nagar centre, two Yellow Line stops south, or straight down Aurobindo Marg by road. Both routes are direct, which helps for a weekly appointment.' },
      { q: 'How much does teen counselling cost in Green Park?', a: 'Fees are quoted on your free 15-minute intake call, before you book anything, and depend on which clinician the young person works with.' },
    ],
    'greater-kailash': [
      { q: 'Will you tell my parents what I say?', a: 'They get themes and progress, not a transcript. Serious risk of harm is the one thing we always share, and we tell you before we do.' },
      { q: 'Can some sessions be online so we are not driving weekly from GK?', a: 'Yes, and many families here do. With teenagers it works well, provided the young person has somewhere at home they can genuinely speak freely.' },
      { q: 'The arguments at home are the real problem. Can you work on that?', a: 'Yes. Conflict that both sides recognise as a pattern and neither can break alone is one of the commonest reasons families come to us from this catchment.' },
      { q: 'My teenager will not talk to me. Will they talk to you?', a: 'Frequently, and largely because we are not you. The first sessions establish that this is their space, not an extension of a parental complaint.' },
      { q: 'How much does teen counselling cost in Greater Kailash?', a: 'Fees are quoted upfront on your free 15-minute intake call, and depend on which clinician the young person works with and what the work involves.' },
    ],
    'defence-colony': [
      { q: 'My teenager is self-harming. How quickly can you see them?', a: 'The same week. Say so on the intake call and we prioritise it. The work focuses on what is driving it, not only on stopping the behaviour.' },
      { q: 'Will you tell my parents what I say?', a: 'They get themes and progress, not a transcript. Serious risk of harm is always shared, and we tell you we are doing it rather than going behind you.' },
      { q: 'We have already seen the school counsellor. Is more counselling useful?', a: 'Usually yes, and it starts further along. Bring anything they have written, because it means we are continuing work rather than starting over.' },
      { q: 'Where would we go from Defence Colony?', a: 'Our Malviya Nagar centre, via Ring Road and Press Enclave Marg. It is a real drive, which matters more for weekly counselling than for a single appointment.' },
      { q: 'How much does teen counselling cost in Defence Colony?', a: 'Fees are quoted on your free 15-minute intake call, before anything is booked, and depend on which clinician the young person works with.' },
    ],
    'vasant-kunj': [
      { q: 'Will you tell my parents what I say?', a: 'They get themes and progress, not a transcript. The only thing we always share is serious risk of harm, and we tell you before we do it.' },
      { q: 'My teenager has grown up in several countries and feels from nowhere. Do you work with that?', a: 'Yes, and it is a distinctive theme at this centre, alongside the loss that comes when a parent posting ends and everything changes again.' },
      { q: 'Can we choose the counsellor?', a: 'Within the team, largely yes. With teenagers the fit is not a nicety, it is the whole thing, so tell us on the intake call what would suit.' },
      { q: 'Can counselling help with applying to universities abroad?', a: 'Yes, where the stress of it has become the problem. It is a recurring theme here from about sixteen, particularly where family expectations and the young person diverge.' },
      { q: 'How much does teen counselling cost in Vasant Kunj?', a: 'Fees are quoted upfront on your free 15-minute intake call, and depend on which clinician the young person works with and what the work involves.' },
    ],
    'gurgaon': [
      { q: 'Can my teenager come to counselling on their own?', a: 'Yes, and many here do. Guru Dronacharya is roughly 700 metres from the centre, and a young person who chooses to come engages very differently.' },
      { q: 'Will you tell my parents what I say?', a: 'They get themes and progress, not a transcript. Serious risk of harm is the one thing we always share, and we tell you first.' },
      { q: 'Is heavy gaming something counselling can help with?', a: 'Often, though rarely by treating the gaming itself. In this catchment it frequently sits on top of loneliness in a household where everyone works long hours.' },
      { q: 'Do parents have to attend?', a: 'At least once, at the start, to agree the confidentiality boundaries with everyone in the room. After that the young person is usually seen on their own.' },
      { q: 'How much does teen counselling cost in Gurgaon?', a: 'Fees are quoted on your free 15-minute intake call, before anything is booked, and depend on which clinician the young person works with.' },
    ],
    'noida': [
      { q: 'Does online teen counselling actually work?', a: 'It works well, with one condition: the young person needs somewhere they can speak without being overheard. A session conducted in whispers is not a session.' },
      { q: 'We do not have a private room at home. What then?', a: 'Say so on the intake call. Sometimes headphones and a different time of day solve it, sometimes it means travelling in for the first few sessions.' },
      { q: 'Will you tell my parents what I say?', a: 'They get themes and progress, not a transcript. Serious risk of harm is always shared, and we tell you before we do it.' },
      { q: 'Is there an eMbrace centre in Noida?', a: 'No. The nearest is Malviya Nagar in south Delhi, which is a cross-city journey, so most Noida families work with us online instead.' },
      { q: 'How much does online teen counselling cost?', a: 'Fees are quoted upfront on your free 15-minute intake call, before you book anything, and depend on which clinician the young person works with.' },
    ],
    'delhi': [
      { q: 'Will you tell my parents what I say?', a: 'They get themes and progress, not a transcript. The only thing we always share is serious risk of harm, and we tell you before we do it.' },
      { q: 'Which Delhi centre would we use?', a: 'Vasant Kunj for south-west Delhi, Malviya Nagar for the Yellow Line corridor. For a weekly appointment around school, choose on journey rather than anything else.' },
      { q: 'My teenager sleeps badly. Is that connected?', a: 'Very often. A large proportion of the adolescents we see across the city are chronically short of sleep, and it makes every other difficulty harder to shift.' },
      { q: 'Does my teenager have to agree to come?', a: 'In practice, yes. We will not do useful work with someone sent under protest, and we would rather spend the first session earning their agreement.' },
      { q: 'How much does teen counselling cost in Delhi?', a: 'Fees are quoted on your free 15-minute intake call, before anything is booked, and depend on which clinician the young person works with.' },
    ],
    'south-delhi': [
      { q: 'Will you tell my parents what I say?', a: 'They get themes and progress, not a transcript. Serious risk of harm is the one thing we always share, and we tell you before we do it.' },
      { q: 'Which South Delhi centre is closer?', a: 'Malviya Nagar from Saket, Hauz Khas, Green Park, Greater Kailash and Defence Colony. Vasant Kunj from Vasant Vihar, Munirka, R.K. Puram and Safdarjung Enclave.' },
      { q: 'My teenager does well but enjoys nothing. Is that worth an appointment?', a: 'Yes. It rarely reaches us early because nothing has visibly gone wrong, and it is some of the most worthwhile work we do.' },
      { q: 'Can sessions work around coaching classes?', a: 'That is what late-afternoon and evening slots exist for. A teenager asked to drop coaching for therapy will usually drop the therapy.' },
      { q: 'How much does teen counselling cost in South Delhi?', a: 'Fees are quoted upfront on your free 15-minute intake call. We quote your situation rather than an average.' },
    ],
    default: [
      { q: 'Will you tell my parents what I say?', a: 'They get themes and progress, not a transcript. The only thing we always share is serious risk of harm, and we tell you before we do it.' },
      { q: 'What age is teen counselling for?', a: 'Roughly thirteen to eighteen. Below that we would usually suggest child counselling, which is structured differently and involves parents more directly.' },
      { q: 'My teenager refuses to go. What now?', a: 'Ask them to come once, with no commitment beyond that. Most refusal is about not knowing what counselling is, and it usually softens after one session.' },
      { q: 'How many sessions will it take?', a: 'Most courses run eight to sixteen weekly sessions with a formal review at around session six, where we tell you plainly whether it is helping.' },
      { q: 'How much does teen counselling cost?', a: 'Fees are quoted upfront on your free 15-minute intake call, before you book anything, and depend on which clinician the young person works with.' },
    ],
  },
};

/**
 * Batch 4. The first service in the set where the person reading the page is
 * the person who will be in the room. Every earlier batch was written to a
 * parent about a child; this one has no gatekeeper, no school, no consent
 * negotiation and no third party to report progress to.
 *
 * That single fact drives the differentiation. What matters to an adult
 * deciding whether to book is discretion, whether it fits round a working week,
 * and whether the person they get is any good. So this page covers those, and
 * carries the corporate and psychiatric partnerships instead of the school ones,
 * which are irrelevant here.
 */
SERVICES['adult-counselling'] = {
  name: 'Adult Counselling',
  noun: 'adult counselling',
  keyword: 'adult counselling',
  hub: '/adult-mental-health/adult-counselling',
  hubName: 'Adult Mental Health Hub',

  partnersOverride: {
    'vasant-kunj': ['medical-travel-company', 'wtw', 'sukoon'],
    'gurgaon': ['wtw', 'atypical-advantage', 'sukoon'],
    'delhi': ['wtw', 'atypical-advantage', 'sukoon'],
    'south-delhi': ['wtw', 'sukoon'],
    'saket': ['atypical-advantage', 'sukoon'],
    'hauz-khas': ['wtw', 'sukoon'],
    'green-park': ['sukoon'],
    'greater-kailash': ['wtw', 'sukoon'],
    'defence-colony': ['medical-travel-company', 'sukoon'],
    'noida': ['medical-travel-company', 'sukoon'],
    default: ['sukoon'],
  },
  partnerIntro: locality =>
    `Some of the adult work we do around ${locality.name} runs through employers and partner services rather than through this website, which is often how someone first reaches us.`,

  lede: locality =>
    `Adult counselling in ${locality.name} is therapy for you, booked by you, with nobody else in the loop. ` +
    `${locality.leadCentreSentence} Most people who contact us have been thinking about it for a year or more, so if you are only at the point of reading a page about it, that is a normal place to start.`,

  cadence:
    'The obstacle for most adults is not the fee, it is the working week. Sessions run weekly, and the slots that survive are early morning, late evening and weekends rather than the middle of a working day. Tell us what your week looks like and we will say honestly whether we can fit it, rather than booking you into something you start cancelling by week four.',

  whenRight: {
    h2: 'When counselling is worth starting',
    paras: [
      'There is no threshold you have to cross to deserve therapy, and the commonest reason people give for not starting sooner is that other people have it worse. That is true of almost everyone and it is not a useful test. A more useful one is whether something has been going on long enough that you have stopped expecting it to lift on its own.',
    ],
    list: [
      'Low mood, anxiety or irritability that has become the normal setting rather than a bad patch',
      'Burnout: still functioning at work, running on empty, and no longer recovering at weekends',
      'A bereavement, separation, diagnosis or move that has not settled the way you assumed it would',
      'The same pattern repeating across relationships, jobs or friendships',
      'Drinking, working or scrolling noticeably more in order to not think about something',
    ],
    after: [],
    hubLink: 'Anxiety, depression, burnout, grief, workplace stress, trauma and relationship difficulties each have their own page on our adult mental health hub.',
  },

  firstAppointment: {
    h2: 'What the first session is like, and who knows about it',
    paras: [
      'The first session is a conversation, not an assessment. By the end you should have a plain-language account of what seems to be going on and a suggested way of working. You are not obliged to continue and you will not be sold a package.',
      'On discretion, which people ask about far more than method: what you say stays between you and your therapist. Nothing reaches your employer, family or doctor without your written consent, including where an employer is paying. The only limit is serious risk.',
    ],
    list: [],
    after: [],
  },

  timelines: {
    h2: 'Fees, how long it runs, and couples work',
    paras: [
      'Fees are quoted upfront on your intake call, before anything is booked. Where an employer or partner service is funding the work, we tell you how many sessions that covers before you start rather than when it runs out.',
      'Focused work on a specific difficulty often runs eight to twelve sessions. Long-standing patterns and trauma work run considerably longer, and we say which we think applies rather than leaving you to find out. Couples work is a separate strand, starting with a joint session and an individual session with each partner.',
    ],
  },

  seenMost: {
    h2: 'What adults come to us with here',
    default: [
      'The largest groups are anxiety, low mood, burnout, grief, relationship difficulty and the aftermath of a major life change. A good deal of it arrives years later than it could have.',
    ],
    'saket': [
      'From Saket the two commonest presentations are burnout in people in their thirties and forties who are still performing at work, and anxiety in parents of school-age children who arrived here through their own child being seen and recognised something of themselves in it.',
      'The second route is more common than people expect. A meaningful number of adults in this catchment first contact us as a parent and end up booking for themselves, which is not a detour and often the more useful piece of work.',
    ],
    'hauz-khas': [
      'From Hauz Khas, SDA and Gulmohar Park a distinctive group is academic and research staff and postgraduates: isolation, imposter feelings, stalled work and the particular strain of a career where the deadlines are self-imposed and never finish.',
      'Alongside that, the usual pattern of high-functioning anxiety in people whose lives look entirely fine from outside, which is the presentation most likely to be dismissed by the person carrying it.',
    ],
    'green-park': [
      'From Green Park, Yusuf Sarai and Sarvapriya Vihar we see a good deal of life-transition work: retirement, adult children leaving, caring for an ageing parent, and the reordering of a life that had been organised around other people for a long time.',
      'Grief is the other steady thread from this catchment, including grief that arrives years after the loss, which is far more common than most people are told.',
    ],
    'greater-kailash': [
      'From Greater Kailash, CR Park and Alaknanda the largest single group is relationship and marital work, both individual and couples, followed by anxiety and low mood in people in their forties and fifties.',
      'Family and intergenerational conflict is a distinctive second theme, particularly in households where three generations share an address and the difficulty is structural rather than anybody behaving badly.',
    ],
    'defence-colony': [
      'From Defence Colony, Jangpura and Lajpat Nagar we see a mix of long-standing anxiety and depression, often in people who have tried therapy once before and stopped, and grief work following bereavement.',
      'Second-opinion work is a recurring reason people come to us from this catchment: someone has a diagnosis they were given quickly, or medication they were started on without much discussion, and they want it looked at more slowly.',
    ],
    'vasant-kunj': [
      'Vasant Kunj carries the broadest adult caseload and the most international. Distinctive themes: relocation and the loss that comes with it, the strain on a trailing partner who gave up work to move, and the isolation of living in a city where your entire social world is other people who will also leave.',
      'This is also where couples and marital work is concentrated, and where most of our trauma-focused adult work runs, because the clinicians who do that work sit at this centre.',
    ],
    'gurgaon': [
      'The Gurugram adult caseload is dominated by work: burnout, workplace stress, anxiety about performance and job security, and the particular exhaustion of long commutes stacked on long hours. A good proportion arrives through employers rather than privately.',
      'The second theme is younger adults living away from family for the first time, where the presenting difficulty is anxiety or low mood and the thing underneath it is loneliness in a city organised around offices and cars.',
    ],
    'noida': [
      'Noida adults work with us online, which for this age group is less a compromise than a preference. Anxiety, low mood, burnout, grief and relationship difficulty all run perfectly well over video, and for a working adult the hour saved on travel is frequently what makes weekly therapy possible at all.',
      'The commonest reason someone from Noida asks to come in person is couples work, where being in the same room genuinely helps, and we schedule that at Malviya Nagar.',
    ],
    'delhi': [
      'Across both Delhi centres the adult caseload runs on anxiety, low mood, burnout, grief, relationship difficulty and life transitions. Vasant Kunj carries more of the couples, trauma and international relocation work; Malviya Nagar sees more people who reached us through a child already being seen.',
      'The city-wide pattern is delay. Most adults contact us long after the point at which the work would have been easier, which is worth naming only because it is so nearly universal that it should not put anyone off starting now.',
    ],
    'south-delhi': [
      'Across south Delhi the adult work divides fairly cleanly. In the thirties and forties it is burnout, work stress and relationship difficulty, frequently in people holding a demanding job and a young family at the same time.',
      'From the fifties onwards it shifts to life transitions, caring for ageing parents, grief, and the question of what a life is organised around once it is no longer organised around children. Both groups tend to arrive later than they needed to.',
    ],
  },

  faqs: {
    'saket': [
      { q: 'Where is adult counselling near Saket?', a: 'At our Malviya Nagar centre, one Yellow Line stop north of Saket metro station, at FC-29 Geetanjali beside Gate No. 1.' },
      { q: 'Will anyone find out I am having therapy?', a: 'No. Nothing goes to your employer, family or doctor without your written consent. The only limit is serious risk, which we would discuss with you first.' },
      { q: 'Can I get an appointment outside working hours?', a: 'Early morning, late evening and weekend slots are what most working adults use. Tell us what your week looks like and we will say honestly whether we can fit it.' },
      { q: 'I came here about my child. Can I book for myself?', a: 'Yes, and a good number of people in this catchment do. You would see a different clinician from the one seeing your child.' },
      { q: 'How much does adult counselling cost in Saket?', a: 'Fees are quoted on your free 15-minute intake call, before anything is booked, and depend on which clinician you see.' },
    ],
    'hauz-khas': [
      { q: 'Where would I go from Hauz Khas?', a: 'Our Malviya Nagar centre, one Yellow Line stop south of Hauz Khas metro station. For an early or late appointment the metro is usually the more predictable option.' },
      { q: 'My life looks fine from outside. Is that a reason not to come?', a: 'No, and it is the commonest reason people delay. High-functioning anxiety is the presentation most likely to be dismissed by the person carrying it.' },
      { q: 'Do you work with academics and postgraduate researchers?', a: 'Yes, and it is a distinctive group from this catchment: isolation, stalled work and the strain of deadlines that are self-imposed and never actually finish.' },
      { q: 'Will anyone find out I am having therapy?', a: 'No. Nothing goes to your employer, family or doctor without your written consent. The only limit is serious risk, which we would discuss with you first.' },
      { q: 'How much does adult counselling cost in Hauz Khas?', a: 'Fees are quoted upfront on your free 15-minute intake call, and depend on which clinician you see and what the work involves.' },
    ],
    'green-park': [
      { q: 'Where would I go from Green Park?', a: 'Our Malviya Nagar centre, two Yellow Line stops south, or straight down Aurobindo Marg by road. Both routes are direct.' },
      { q: 'Is there an age at which counselling stops being worthwhile?', a: 'No. Retirement, adult children leaving and caring for an ageing parent are among the commonest reasons adults come to us from this area.' },
      { q: 'My bereavement was years ago. Is it too late for grief counselling?', a: 'No. Grief arriving years after a loss is far more common than most people are told, and it is regular work for us rather than unusual.' },
      { q: 'Will anyone find out I am having therapy?', a: 'No. Nothing goes to your employer, family or doctor without your written consent. The only limit is serious risk, which we would discuss with you first.' },
      { q: 'How much does adult counselling cost in Green Park?', a: 'Fees are quoted on your free 15-minute intake call, before you book anything, and depend on which clinician you see.' },
    ],
    'greater-kailash': [
      { q: 'Do you offer couples counselling near Greater Kailash?', a: 'Yes. Couples work usually starts with a joint session, then an individual session with each partner, before the work proper begins. It runs from our Delhi centres.' },
      { q: 'Can I come on my own if my partner will not?', a: 'Yes, and it is often how this work starts. Individual therapy about a relationship is worthwhile in its own right, not a lesser substitute.' },
      { q: 'Where would I go from GK?', a: 'Our Malviya Nagar centre, via Outer Ring Road and Press Enclave Marg. Most people from this catchment drive rather than take the metro.' },
      { q: 'Three generations live in our house and that is the problem. Can therapy help?', a: 'Often yes. Intergenerational strain is a distinctive theme from this catchment and is usually structural rather than anybody behaving badly.' },
      { q: 'How much does adult counselling cost in Greater Kailash?', a: 'Fees are quoted upfront on your free 15-minute intake call, and depend on which clinician you see and what the work involves.' },
    ],
    'defence-colony': [
      { q: 'Where would I go from Defence Colony?', a: 'Our Malviya Nagar centre, via Ring Road and Press Enclave Marg. Many people from this catchment run some sessions online to keep a weekly rhythm.' },
      { q: 'I tried therapy once and stopped. Is it worth trying again?', a: 'Frequently yes. A poor fit with one therapist says very little about whether the work would help, and it is a common reason people come to us.' },
      { q: 'Can I get a second opinion on a diagnosis or medication?', a: 'Yes, and it is a recurring reason people come to us from this area. Where psychiatric input is needed we work with Sukoon across Delhi NCR.' },
      { q: 'Will anyone find out I am having therapy?', a: 'No. Nothing goes to your employer, family or doctor without your written consent. The only limit is serious risk, which we would discuss with you first.' },
      { q: 'How much does adult counselling cost in Defence Colony?', a: 'Fees are quoted on your free 15-minute intake call, before anything is booked, and depend on which clinician you see.' },
    ],
    'vasant-kunj': [
      { q: 'Where is your Vasant Kunj centre?', a: 'At C-7, Sector C, Pocket 5, in the basement of Grand Vasant Kunj. It carries our largest adult team, including the couples and trauma-focused work.' },
      { q: 'Do you offer couples therapy?', a: 'Yes, including Gottman-informed work adapted for the Indian context. It usually starts with a joint session and an individual session with each partner.' },
      { q: 'We have just relocated and I gave up my job to move. Is that a therapy matter?', a: 'It is one of the commonest reasons people come to us here. The strain on a trailing partner is real and routinely underestimated by everyone including the person carrying it.' },
      { q: 'Can I choose my therapist?', a: 'Largely, yes. This is our biggest team, so tell us on the intake call what would suit, including language, and we will match on that rather than on availability.' },
      { q: 'How much does adult counselling cost in Vasant Kunj?', a: 'Fees are quoted upfront on your free 15-minute intake call, and depend on which clinician you see and what the work involves.' },
    ],
    'gurgaon': [
      { q: 'Where is adult counselling in Gurgaon?', a: 'At 710, DLF City Court, Mehrauli-Gurgaon Road, Sector 24, with Guru Dronacharya on the Yellow Line roughly 700 metres away.' },
      { q: 'My employer is paying. Will they see my notes?', a: 'No. Nothing goes to an employer without your written consent, including where they are funding it. They are told you attended, not what you said.' },
      { q: 'Can I have sessions before or after work?', a: 'Early morning, late evening and weekend slots are what most people in this catchment use. A midday appointment is the one that gets cancelled.' },
      { q: 'Is burnout actually something therapy helps with?', a: 'Yes, and it is the single commonest reason adults come to us in Gurugram. Still functioning, running on empty and no longer recovering at weekends is the usual picture.' },
      { q: 'How much does adult counselling cost in Gurgaon?', a: 'Fees are quoted on your free 15-minute intake call, before anything is booked, and depend on which clinician you see.' },
    ],
    'noida': [
      { q: 'Do you offer adult counselling in Noida?', a: 'Online, and for working adults that is usually the better option anyway. We have no centre in Noida; the nearest is Malviya Nagar in south Delhi.' },
      { q: 'Is online therapy as good for adults?', a: 'For anxiety, low mood, burnout, grief and relationship work the evidence is good. For most working adults the hour saved on travel is what makes weekly therapy sustainable.' },
      { q: 'Can we do couples counselling online?', a: 'It works, though being in the same room genuinely helps. Couples who want in-person sessions usually come to Malviya Nagar for those.' },
      { q: 'Will anyone find out I am having therapy?', a: 'No. Nothing goes to your employer, family or doctor without your written consent. The only limit is serious risk, which we would discuss with you first.' },
      { q: 'How much does online adult counselling cost?', a: 'Fees are quoted upfront on your free 15-minute intake call, before you book anything, and depend on which clinician you see.' },
    ],
    'delhi': [
      { q: 'Which Delhi centre would I use?', a: 'Vasant Kunj for south-west Delhi and for couples or trauma-focused work. Malviya Nagar for the Yellow Line corridor. The same pathway runs at both.' },
      { q: 'Will anyone find out I am having therapy?', a: 'No. Nothing goes to your employer, family or doctor without your written consent. The only limit is serious risk, which we would discuss with you first.' },
      { q: 'I have been putting this off for years. Is it too late?', a: 'No, and delay is very nearly universal. Most adults reach us long after the point at which the work would have been easier, and it still helps.' },
      { q: 'How long does adult counselling take?', a: 'Focused work on a specific difficulty often runs eight to twelve sessions. Long-standing patterns and trauma work run longer, and we tell you which we think you are looking at.' },
      { q: 'How much does adult counselling cost in Delhi?', a: 'Fees are quoted on your free 15-minute intake call, before anything is booked, and depend on which clinician you see.' },
    ],
    'south-delhi': [
      { q: 'Which South Delhi centre is closer?', a: 'Malviya Nagar from Saket, Hauz Khas, Green Park, Greater Kailash and Defence Colony. Vasant Kunj from Vasant Vihar, Munirka, R.K. Puram and Safdarjung Enclave.' },
      { q: 'Can I get an appointment outside working hours?', a: 'Early morning, late evening and weekend slots are what most working adults use. Tell us what your week looks like and we will say honestly whether we can fit it.' },
      { q: 'I am holding down a demanding job and a young family. Is that just normal stress?', a: 'Sometimes. It stops being ordinary when you are no longer recovering at weekends, and that is the point most people in this catchment reach us.' },
      { q: 'Will anyone find out I am having therapy?', a: 'No. Nothing goes to your employer, family or doctor without your written consent. The only limit is serious risk, which we would discuss with you first.' },
      { q: 'How much does adult counselling cost in South Delhi?', a: 'Fees are quoted upfront on your free 15-minute intake call. We quote your situation rather than an average.' },
    ],
    default: [
      { q: 'Will anyone find out I am having therapy?', a: 'No. Nothing goes to your employer, family or doctor without your written consent. The only limit is serious risk, which we would discuss with you first.' },
      { q: 'Do I need a referral?', a: 'No. You book directly, for yourself. If a doctor has written anything relevant, bring it, but nothing is required to make an appointment.' },
      { q: 'Can I get an appointment outside working hours?', a: 'Early morning, late evening and weekend slots are what most working adults use. Tell us what your week looks like and we will say whether we can fit it.' },
      { q: 'How long does adult counselling take?', a: 'Focused work on a specific difficulty often runs eight to twelve sessions. Long-standing patterns and trauma work run longer, and we tell you which we think applies.' },
      { q: 'How much does adult counselling cost?', a: 'Fees are quoted upfront on your free 15-minute intake call, before you book anything, and depend on which clinician you see.' },
    ],
  },
};

/**
 * Batch 5. The first assessment service, and structurally unlike the four
 * therapy batches in three ways that do the differentiating:
 *
 *   1. It is finite. A small number of appointments and then it ends, rather
 *      than a weekly commitment. That changes the travel calculation entirely,
 *      which matters most for Noida and the drive-in catchments.
 *   2. The deliverable is a written report, not a course of sessions. What that
 *      report is and is not accepted for is the single most useful thing this
 *      page can tell an Indian parent, and nobody in this SERP says it.
 *   3. It needs someone other than the parent. Teacher rating scales are part
 *      of the process, so school is involved whether or not school raised it.
 *
 * On board concessions: requirements vary by board and frequently involve a
 * designated government centre. This page says that plainly and says we will
 * tell you what your board requires. It does NOT claim our report satisfies any
 * particular board, because that is not ours to promise.
 */
SERVICES['adhd-assessment'] = {
  name: 'ADHD Assessment',
  noun: 'ADHD assessment',
  keyword: 'ADHD assessment',
  hub: '/adhd/adhd-assessment',
  hubName: 'ADHD Hub',

  partnersOverride: {
    'vasant-kunj': ['british-school', 'american-embassy-school', 'medical-travel-company', 'sukoon'],
    'gurgaon': ['pathways-gurgaon', 'ashoka', 'sukoon'],
    'delhi': ['ashoka', 'british-school', 'rainbow', 'sukoon'],
    'south-delhi': ['ashoka', 'american-embassy-school', 'sukoon'],
    'saket': ['rainbow', 'ashoka', 'sukoon'],
    'hauz-khas': ['rainbow', 'ashoka', 'sukoon'],
    'green-park': ['rainbow', 'sukoon'],
    'greater-kailash': ['rainbow', 'ashoka', 'sukoon'],
    'defence-colony': ['rainbow', 'sukoon'],
    'noida': ['medical-travel-company', 'ashoka', 'sukoon'],
    default: ['sukoon'],
  },
  partnerIntro: locality =>
    `A good deal of our assessment work around ${locality.name} reaches us through institutions rather than directly, and the referral routes are worth knowing about.`,

  lede: locality =>
    `An ADHD assessment in ${locality.name} is a finite piece of work with a written report at the end of it, not an open-ended course of therapy. ` +
    `${locality.leadCentreSentence} This page sets out what the assessment involves, what the report is and is not accepted for, and who would carry it out.`,

  cadence:
    'Unlike therapy this has a defined end: two or three appointments over a few weeks plus report writing, so it is a handful of trips rather than a weekly commitment, and we group the testing where the journey is long. One part cannot happen at our end at all. Teacher rating scales need filling in by someone who sees your child in a classroom, and how quickly school returns them usually decides the timeline.',

  whenRight: {
    h2: 'When an ADHD assessment is worth doing',
    paras: [
      'Assessment is worth doing when the answer would change something. If a diagnosis would unlock accommodations at school or work, settle a long-running disagreement about whether a child is careless or struggling, or open the door to medication, it earns its place. If nothing would be done differently afterwards, it is worth saying so before you spend the money.',
    ],
    list: [
      'Difficulties present before age twelve and showing up in more than one setting, not only at home or only at school',
      'Attention, organisation or impulsivity problems that are out of step with the person\u2019s ability',
      'A bright child working far harder than classmates for the same result',
      'An adult who recognises the pattern in themselves, often after a child has been assessed',
    ],
    after: [],
    hubLink: 'Symptoms, treatment, classroom accommodations, ADHD at work and ADHD in adults each have their own page on our ADHD hub.',
  },

  firstAppointment: {
    h2: 'What the assessment actually involves',
    paras: [
      'ADHD cannot be diagnosed from a single questionnaire, and anywhere offering that is not doing an assessment. Ours combines a detailed developmental and clinical history, standardised rating scales completed by more than one person, and direct testing of attention, memory and executive function, drawing on instruments such as Conners 3, CBCL, BASC-3, BRIEF-2, NEPSY-II and the Wechsler scales.',
      'The multi-informant part is not optional. A scale filled in only by a parent describes home, and ADHD is defined partly by showing up in more than one place. Where school has not noticed, that is useful information rather than a problem.',
    ],
    list: [],
    after: [],
  },

  seenMost: {
    h2: 'What brings people to ADHD assessment here',
    default: [
      'The commonest referral routes are a school raising attention or organisation concerns, a parent who has run out of explanations for the gap between effort and result, and adults recognising the pattern in themselves.',
    ],
    'saket': [
      'From Saket most ADHD referrals arrive through school, which is what you would expect from a catchment this dense with them. The typical picture is a child whose marks have dropped in the senior years as the volume of self-directed work rose, having coped adequately when the structure came from outside.',
      'The second, quieter route is the child who is not disruptive at all. Inattentive presentations are routinely missed for years in well-behaved children, and a fair number of our Saket assessments are of teenagers whose difficulty was read as laziness for most of a decade.',
    ],
    'hauz-khas': [
      'From Hauz Khas and SDA the distinctive group is high-ability children and young adults whose ADHD has been masked by ability. They compensate successfully until the workload outgrows the compensation, usually somewhere between senior school and university.',
      'Adult self-referrals are more common here than in most of our catchments, frequently from academics and postgraduates who have spent years attributing chronic disorganisation to character rather than to anything assessable.',
    ],
    'green-park': [
      'From Green Park the referrals skew younger, often six to ten, and typically come after a teacher has flagged difficulty sitting still, finishing work or waiting a turn. At this age the assessment question is frequently whether we are looking at ADHD, at a language difficulty, at anxiety, or at a child who is simply young for their class year.',
      'That last possibility matters more than people expect. Relative age within a school year is a real confound in ADHD referrals, and it is one of the first things we check rather than one of the last.',
    ],
    'greater-kailash': [
      'From Greater Kailash and CR Park a large share of assessments are second opinions. Someone has already been given a diagnosis quickly, or started on medication without much discussion, and the family wants the question examined more slowly and with proper testing behind it.',
      'The other steady group is adolescents in board years, where the cost of an unidentified attention difficulty rises sharply and the family wants to know whether accommodations are worth pursuing.',
    ],
    'defence-colony': [
      'From Defence Colony and Jangpura assessments are often prompted by a school counsellor who has already done some groundwork, which makes the process faster because the classroom picture is partly documented before we start.',
      'We also see a distinct group of adults from this catchment, usually in their thirties and forties, who reach us after their own child has been assessed and have recognised most of the history in themselves.',
    ],
    'vasant-kunj': [
      'Vasant Kunj brings the most internationally-schooled ADHD caseload we see, and with it a specific complication: a child who has changed country, curriculum and language of instruction may look inattentive for reasons that have nothing to do with ADHD. Untangling that is a large part of the assessment work here.',
      'The second distinctive group is families who need a report that will travel, because they expect to move again. That changes how the report is written rather than how the assessment is done.',
    ],
    'gurgaon': [
      'The Gurugram assessment caseload divides between primary-age children referred by schools for attention and organisation difficulties, and adults referred by nobody at all.',
      'The adult group is the one that stands out. Working adults in this catchment increasingly reach us having recognised the pattern in themselves, usually after years of managing it with long hours rather than with strategy, and they arrive better informed than almost any other group we assess.',
    ],
    'noida': [
      'Noida families come to us for ADHD assessment more often than for anything else, and it is the one service where the journey is unavoidable: the direct testing has to happen in a room, however well the rest of the process works over video.',
      'What we do about that is compress it. History-taking and feedback run online, the testing is grouped so you travel in once or at most twice, and the teacher rating scales are handled by email with the school. The commonest picture is a child whose school has raised attention concerns and a family who want the question settled properly rather than managed indefinitely.',
    ],
    'delhi': [
      'Across both Delhi centres the referral routes are school-raised attention concerns, parents who have run out of explanations for the gap between effort and result, second opinions on a diagnosis given quickly, and adults recognising themselves in a assessment done for their child.',
      'The city-wide pattern is late identification of inattentive presentations. Children who are quiet and compliant are rarely referred early, and a meaningful share of our assessments are of teenagers whose difficulty was read as attitude for years.',
    ],
    'south-delhi': [
      'Across south Delhi the assessment caseload is shaped by school density and by the point in the curriculum where self-directed work takes over. A large share of referrals cluster around the transition into the senior years, when external structure falls away and a compensating child stops coping.',
      'Board years are the other cluster, where families want to know whether accommodations are available and what they would need to obtain them. That is a question about certification requirements as much as about diagnosis, and we would rather answer both.',
    ],
  },

  timelines: {
    h2: 'Fees, the report, and what it is accepted for',
    paras: [
      'Fees are quoted upfront on your intake call. Assessment is priced as a piece of work covering testing, report and feedback, not per session. The report names the instruments used, gives the scores, states the conclusion plainly and sets out specific recommendations. Ask any provider for that standard before you pay.',
      'On what it is accepted for, which is where families are most often misled: a good report supports classroom accommodations, and most schools act on it. Formal board concessions are separate. Requirements differ by board and frequently involve a designated government centre, so we tell you what yours needs rather than leaving you to find out afterwards. Medication is a prescribing decision, and we work with Sukoon across Delhi NCR where it is being considered.',
    ],
  },

  faqs: {
    'saket': [
      { q: 'Where would we go for an ADHD assessment near Saket?', a: 'Our Malviya Nagar centre, one Yellow Line stop north of Saket metro station. It is normally two or three visits rather than a weekly commitment.' },
      { q: 'Will the report get my child board exam concessions?', a: 'Not on its own. Board requirements differ and often involve a designated government centre. We tell you what your board needs on the intake call.' },
      { q: 'My child is well behaved but drifting. Is that still ADHD?', a: 'Possibly. Inattentive presentations without disruption are missed for years in quiet children, and they are a large part of what we assess from this catchment.' },
      { q: 'Does school have to be involved?', a: 'Yes. Teacher rating scales are part of the process, because ADHD is defined partly by difficulties appearing in more than one setting.' },
      { q: 'How much does an ADHD assessment cost in Saket?', a: 'Quoted upfront on your free 15-minute intake call. It is priced as one piece of work covering testing, report and feedback, not per session.' },
    ],
    'hauz-khas': [
      { q: 'Can a bright child still have ADHD?', a: 'Yes, and ability often masks it until the workload outgrows the compensation. That pattern is the commonest thing we assess from Hauz Khas and SDA.' },
      { q: 'Do you assess adults for ADHD?', a: 'Yes. Adult self-referrals are more common in this catchment than most, frequently from academics and postgraduates who have assumed disorganisation was character.' },
      { q: 'Where would we go from Hauz Khas?', a: 'Our Malviya Nagar centre, one Yellow Line stop south. Assessment is two or three visits over a few weeks, not an ongoing appointment.' },
      { q: 'What tests do you actually use?', a: 'Depending on presentation, instruments such as Conners 3, CBCL, BASC-3, BRIEF-2, NEPSY-II and the Wechsler scales, alongside a detailed clinical history.' },
      { q: 'How much does an ADHD assessment cost in Hauz Khas?', a: 'You get the figure on the free 15-minute intake call before booking. Assessment is a single quoted piece of work, with no per-session meter running.' },
    ],
    'green-park': [
      { q: 'My child is one of the youngest in the class. Could that explain it?', a: 'It genuinely might. Relative age within a school year is a real confound in ADHD referrals, and it is one of the first things we check.' },
      { q: 'How young can a child be assessed?', a: 'We assess from around six. Below that the picture is usually too unsettled for a reliable answer, and we would say so rather than take the booking.' },
      { q: 'Could this be something other than ADHD?', a: 'Frequently. At this age the real question is often whether we are looking at ADHD, a language difficulty, anxiety, or ordinary developmental variation.' },
      { q: 'Where would we go from Green Park?', a: 'Our Malviya Nagar centre, two Yellow Line stops south or straight down Aurobindo Marg. It is two or three visits in total.' },
      { q: 'How much does an ADHD assessment cost in Green Park?', a: 'The figure comes on your free 15-minute intake call. One quote covers the testing, the written report and the feedback appointment, with nothing added later.' },
    ],
    'greater-kailash': [
      { q: 'We already have a diagnosis. Is a second opinion worth it?', a: 'Often, and it is a common reason families come to us from GK, particularly where a diagnosis was given quickly or medication started without much discussion.' },
      { q: 'Will the report get board concessions?', a: 'Not by itself. Boards set their own certification route, frequently running through a designated government centre. We map yours out before you commit.' },
      { q: 'How many trips is this from Greater Kailash?', a: 'Usually two or three, and we group the testing where the journey is long. Unlike therapy it has a defined end rather than running weekly.' },
      { q: 'Do you prescribe medication?', a: 'No, that is a prescribing decision. We work with Sukoon across Delhi NCR for psychiatric assessment and medication management where it is being considered.' },
      { q: 'How much does an ADHD assessment cost in Greater Kailash?', a: 'Quoted on the free 15-minute intake call before you commit. A second opinion is priced the same way as a first assessment, as one piece of work.' },
    ],
    'defence-colony': [
      { q: 'Our school counsellor has already flagged it. Does that speed things up?', a: 'Usually yes. Where the classroom picture is partly documented before we start, the process runs faster because that groundwork is already done.' },
      { q: 'Can adults be assessed?', a: 'Yes, and a distinct group from this catchment are adults in their thirties and forties who recognised the history in themselves after a child was assessed.' },
      { q: 'Where would we go from Defence Colony?', a: 'Our Malviya Nagar centre via Ring Road and Press Enclave Marg. It is a handful of visits rather than a weekly commitment, which makes the drive easier to justify.' },
      { q: 'Will the report get board concessions?', a: 'Not on its own. Board requirements differ and often involve a designated government centre, and we tell you what yours needs on the intake call.' },
      { q: 'How much does an ADHD assessment cost in Defence Colony?', a: 'You are told the figure on the free 15-minute intake call. It is one quote for the whole assessment rather than a running per-session charge.' },
    ],
    'vasant-kunj': [
      { q: 'We have moved country and curriculum. Could that look like ADHD?', a: 'It can, and untangling the two is a large part of the assessment work here. A change of language of instruction alone can produce apparent inattention.' },
      { q: 'Will the report be accepted if we move abroad?', a: 'We write reports for families who expect to move, naming instruments and scores so they can be interpreted elsewhere. Acceptance is always the receiving system\u2019s decision.' },
      { q: 'Where is your Vasant Kunj centre?', a: 'C-7, Sector C, Pocket 5, in the basement of Grand Vasant Kunj. It carries the largest assessment team, so scheduling is usually quicker here.' },
      { q: 'What tests do you use?', a: 'Depending on presentation, instruments such as Conners 3, CBCL, BASC-3, BRIEF-2, NEPSY-II and the Wechsler scales, alongside a detailed developmental history.' },
      { q: 'How much does an ADHD assessment cost in Vasant Kunj?', a: 'Quoted on your free 15-minute intake call. One figure covers testing, report and feedback, including where the report is written to travel with you.' },
    ],
    'gurgaon': [
      { q: 'Do you assess adults for ADHD in Gurgaon?', a: 'Yes, and it is a growing share of the caseload here. Working adults reach us having recognised the pattern after years of managing it with long hours.' },
      { q: 'Where is the Gurugram centre?', a: '710, DLF City Court, Mehrauli-Gurgaon Road, Sector 24, with Guru Dronacharya on the Yellow Line roughly 700 metres away.' },
      { q: 'Can my employer be told, or kept out of it?', a: 'Kept out of it. Nothing reaches an employer without your written consent, including where they are funding the assessment.' },
      { q: 'Does school have to be involved for a child?', a: 'Yes. Someone who sees your child in a classroom has to complete rating scales, since a picture drawn only from home cannot answer the question.' },
      { q: 'How much does an ADHD assessment cost in Gurgaon?', a: 'Quoted on the free 15-minute intake call before booking. Where an employer funds an adult assessment, we confirm what they cover before you start.' },
    ],
    'noida': [
      { q: 'Can an ADHD assessment be done entirely online?', a: 'No. History-taking and feedback work well over video, but the direct testing has to happen in a room. This is the service where a journey is unavoidable.' },
      { q: 'How many times would we have to travel from Noida?', a: 'Usually once, at most twice. We group the testing deliberately for families travelling from Noida rather than spreading it over several appointments.' },
      { q: 'How do you handle the school part from a distance?', a: 'Teacher rating scales are sent to and returned from the school by email. How quickly school responds is usually what decides the overall timeline.' },
      { q: 'Is there an eMbrace centre in Noida?', a: 'No. Assessment appointments are at our Malviya Nagar centre in south Delhi, which is a Blue to Yellow Line change or a drive.' },
      { q: 'How much does an ADHD assessment cost?', a: 'Quoted upfront on your free 15-minute intake call, priced as a piece of work covering testing, report and feedback rather than per session.' },
    ],
    'delhi': [
      { q: 'Which Delhi centre would we use?', a: 'Vasant Kunj for south-west Delhi and the larger assessment team, Malviya Nagar for the Yellow Line corridor. The same process runs at both.' },
      { q: 'Will the report get board exam concessions?', a: 'Not on its own. Requirements differ between boards and often involve a designated government centre, and we tell you what yours needs on the intake call.' },
      { q: 'My child is quiet and compliant. Would ADHD have been spotted?', a: 'Often not. Late identification of inattentive presentations is the clearest city-wide pattern we see, frequently in teenagers whose difficulty was read as attitude.' },
      { q: 'How long does the whole process take?', a: 'Two or three appointments over a few weeks plus report writing. The school rating scales are usually what determines the overall timeline.' },
      { q: 'How much does an ADHD assessment cost in Delhi?', a: 'You get the figure on your free 15-minute intake call. It is one quote for the whole assessment rather than a charge per appointment.' },
    ],
    'south-delhi': [
      { q: 'Which South Delhi centre is closer?', a: 'Malviya Nagar from Saket, Hauz Khas, Green Park, Greater Kailash and Defence Colony. Vasant Kunj from Vasant Vihar, Munirka, R.K. Puram and Safdarjung Enclave.' },
      { q: 'My child coped until senior school. What changed?', a: 'Usually the amount of self-directed work. A child compensating on external structure stops coping when that structure falls away, which is the commonest pattern here.' },
      { q: 'What do we need for board concessions?', a: 'That depends on the board, and requirements frequently involve a designated government centre. We will tell you what applies before you book anything.' },
      { q: 'Does school have to be involved?', a: 'Yes. Teacher rating scales are part of the assessment, because ADHD is defined partly by difficulties showing up in more than one setting.' },
      { q: 'How much does an ADHD assessment cost in South Delhi?', a: 'Quoted upfront on the free 15-minute intake call, as a single figure for the whole assessment rather than per session.' },
    ],
    default: [
      { q: 'How long does an ADHD assessment take?', a: 'Two or three appointments over a few weeks plus report writing. How quickly school returns the teacher rating scales usually decides the overall timeline.' },
      { q: 'Can ADHD be diagnosed from a questionnaire?', a: 'No. A single questionnaire is not an assessment. Ours combines clinical history, standardised scales from more than one informant, and direct testing.' },
      { q: 'Will the report get board exam concessions?', a: 'Not on its own. Requirements differ between boards and often involve a designated government centre, and we tell you what yours needs before you book.' },
      { q: 'Do you prescribe medication?', a: 'No, that is a prescribing decision. We work with Sukoon across Delhi NCR for psychiatric assessment and medication management where it is being considered.' },
      { q: 'How much does an ADHD assessment cost?', a: 'Quoted upfront on your free 15-minute intake call, priced as a piece of work covering testing, report and feedback rather than per session.' },
    ],
  },
};

/**
 * Batch 6. The sibling to beat here is adhd-assessment, since both are
 * assessments ending in a report. Four things genuinely separate them:
 *
 *   1. Method. ADHD assessment leans on rating scales from several informants.
 *      Autism assessment leans on direct structured observation, ADOS-2, where
 *      a clinician sets up situations and watches what the child does.
 *   2. Age. This starts far younger, from around eighteen months, where ADHD
 *      assessment rarely starts before six.
 *   3. Team. A proper autism assessment draws on speech and language and
 *      occupational therapy alongside psychology, so the named roster genuinely
 *      differs from the ADHD one at every centre.
 *   4. Paperwork. The ADHD page answers a question about board concessions.
 *      This one answers a different question about disability certification
 *      under the RPwD Act, which is a separate process with a separate route.
 *
 * ADOS-2 is used here on the client's explicit confirmation of 19 August 2026.
 * The clinician table lists ISAA and CARS and does not mention ADOS-2, so this
 * is client-attested rather than derived from that table. The site already
 * carries a dedicated /autism/ados-2-assessment page.
 */
SERVICES['autism-assessment'] = {
  name: 'Autism Assessment',
  noun: 'autism assessment',
  keyword: 'autism assessment',
  hub: '/autism/autism-assessment',
  hubName: 'Autism Hub',

  partnersOverride: {
    'vasant-kunj': ['american-embassy-school', 'british-school', 'medical-travel-company'],
    'gurgaon': ['pathways-gurgaon', 'medical-travel-company', 'ashoka'],
    'delhi': ['rainbow', 'ashoka', 'medical-travel-company'],
    'south-delhi': ['rainbow', 'american-embassy-school', 'ashoka'],
    'saket': ['rainbow', 'ashoka'],
    'hauz-khas': ['rainbow', 'medical-travel-company'],
    'green-park': ['rainbow'],
    'greater-kailash': ['rainbow', 'ashoka'],
    'defence-colony': ['rainbow', 'medical-travel-company'],
    'noida': ['medical-travel-company', 'rainbow'],
    default: ['rainbow'],
  },
  partnerIntro: locality =>
    `Families around ${locality.name} reach our autism assessment service through several routes, and the institutional ones are worth knowing about.`,

  lede: locality =>
    `An autism assessment in ${locality.name} is a structured diagnostic process built around watching your child directly, not around filling in forms about them. ` +
    `${locality.leadCentreSentence} This page covers what the assessment involves, how young we can start, and what a diagnosis does and does not give you on paper.`,

  cadence:
    'This is a defined piece of work rather than a weekly commitment: normally two or three appointments plus report writing. It also starts younger than most services here, from around eighteen months, and with very young children we would rather see you sooner and say the picture is not yet clear than have you wait a year for certainty. Where a child has lost skills they previously had, at any age, say so when you call and we will bring the appointment forward.',

  whenRight: {
    h2: 'When an autism assessment is worth doing',
    paras: [
      'The question is rarely whether a child is unusual. It is whether the pattern of social communication, interaction and behaviour is consistent enough to be recognisable, and whether naming it would change what your child is offered. Early identification matters more here than in any other assessment we do, because what follows it is time-sensitive.',
    ],
    list: [
      'Limited eye contact, response to name or shared attention in the second year',
      'Speech that is late, absent, or present but not used to connect with other people',
      'Strong preference for routine, with distress out of proportion when it changes',
      'Loss of words, gestures or social skills a child previously had, at any age',
    ],
    after: [],
    hubLink: 'Diagnostic evaluation, ADOS-2, sleep, feeding and emotional regulation each have their own page on our autism hub.',
  },

  firstAppointment: {
    h2: 'What the assessment actually involves',
    paras: [
      'The core of it is direct observation. ADOS-2 is a semi-structured session in which a clinician sets up ordinary social situations, play, conversation, small frustrations, and records how your child responds. To a watching parent it looks like someone playing with your child, and it is the closest thing there is to a standardised way of seeing social communication rather than asking about it.',
      'Around that sits a developmental history from you, structured tools such as ISAA and CARS, and input on communication and on sensory and motor profiles from our speech and language and occupational therapy colleagues. That part is not decoration. It separates a diagnosis from a description, and it is why this team is larger than for other assessments.',
    ],
    list: [],
    after: [],
  },

  timelines: {
    h2: 'Fees, the report, and the certification question',
    paras: [
      'Fees are quoted upfront on your intake call, as one piece of work covering observation, history, report and feedback. The report names the instruments used, states the conclusion plainly, and sets out what your child needs next in specific terms.',
      'On paperwork, where families are most often confused: what we give you is a clinical diagnosis, and schools and therapy services act on it. A disability certificate under the Rights of Persons with Disabilities Act is a different document, issued by a government medical board through its own process. We explain that route on the intake call rather than leaving you to discover afterwards that you needed something else.',
    ],
  },

  seenMost: {
    h2: 'What brings families to autism assessment here',
    default: [
      'The commonest routes are a paediatrician or nursery raising concerns about speech and social interaction in the early years, and older children referred once the social demands of school outgrow what they can manage.',
    ],
    'saket': [
      'From Saket the two routes are quite distinct. The early one is a two to three year old whose speech has not arrived on schedule and who is not using what speech there is to connect, usually flagged by a paediatrician or a nursery.',
      'The later one is a school-age child, often already doing academically well, referred once the social side of school became harder than the academic side. In a catchment this dense with schools, that second group reaches us more often than most people would expect.',
    ],
    'hauz-khas': [
      'From Hauz Khas and SDA a distinctive group is older children and young adults assessed late, having compensated through ability and rule-learning for years. Assessment at that age is less about whether anything has changed and more about explaining a lifetime of finding things harder than peers seemed to.',
      'Adults self-referring for autism assessment are a real and growing part of the caseload here, frequently after a sibling or a child has been diagnosed.',
    ],
    'green-park': [
      'From Green Park the referrals are the youngest we see, often between eighteen months and four years, and usually arrive through a paediatrician who has noticed limited response to name or shared attention.',
      'At this age families are often told to wait and see. Sometimes that is right. But regression, meaning a loss of words or gestures a child previously had, is never a wait-and-see situation, and we would rather see a child early and tell you the picture is unclear than hold the appointment for a year.',
    ],
    'greater-kailash': [
      'From Greater Kailash and CR Park a substantial share of our autism assessments are second opinions, where a diagnosis was given quickly, or ruled out quickly, and the family wants the question examined with structured observation behind it.',
      'The other group is girls and young women, who are diagnosed later and less often than boys because the presentation is frequently quieter and better camouflaged. It is a recurring reason families in this catchment come to us having been turned away elsewhere.',
    ],
    'defence-colony': [
      'From Defence Colony and Jangpura assessments often follow a period of school-based support that has plateaued: the accommodations are in place, everyone is trying, and progress has stalled because the underlying question was never settled.',
      'We also see families seeking clarity about paperwork specifically, wanting to understand what a clinical diagnosis will and will not do for them before they commit to anything.',
    ],
    'vasant-kunj': [
      'Vasant Kunj carries the widest age range for autism assessment and the largest multidisciplinary team, which matters more here than for any other service: speech and language and occupational therapy input sits in the same building as the psychology.',
      'The internationally-schooled caseload brings a specific complication. A child managing a third language of instruction may present as socially withdrawn for reasons that are linguistic rather than diagnostic, and separating those two is a substantial part of the work here.',
    ],
    'gurgaon': [
      'The Gurugram autism caseload skews early. Most referrals are children under five, usually reaching us through a paediatrician or a preschool that has raised concerns about speech and social interaction, and the urgency is real because what follows assessment is time-sensitive at that age.',
      'The second group is school-age children whose academic performance is fine and whose social and sensory difficulties have become the limiting factor. Because our occupational therapy colleague sits at this centre, the sensory side of that picture can be assessed here rather than referred onward.',
    ],
    'noida': [
      'Noida families come to us for autism assessment knowing it will mean travelling, and it does. ADOS-2 is direct observation in a room, and there is no version of it that works over video.',
      'What we do about that is front-load: the developmental history and the feedback session run online, and the observation and any speech and language or occupational therapy input are grouped into a single visit to Malviya Nagar wherever the child can manage it in one sitting.',
    ],
    'delhi': [
      'Across both Delhi centres the routes in are early referrals from paediatricians and nurseries for speech and social communication concerns, later referrals from schools once social demands rise, second opinions, and a growing number of adults and older girls assessed late.',
      'The city-wide pattern is a gap between the age at which families first worry and the age at which anyone assesses. Closing that gap is worth more than almost anything else we could do on this pathway.',
    ],
    'south-delhi': [
      'Across south Delhi the caseload divides by age rather than by locality. Under-fives arrive through paediatricians with speech and social interaction concerns. School-age children arrive through schools once the social side of the day becomes the hard part.',
      'The third and growing group is late diagnosis: girls, and adults, whose presentation was quieter and better camouflaged and who were told for years that nothing was wrong.',
    ],
  },

  faqs: {
    'saket': [
      { q: 'How young can a child be assessed for autism?', a: 'From around eighteen months. With very young children we would rather see you early and say the picture is not yet clear than have you wait a year.' },
      { q: 'What is ADOS-2?', a: 'A semi-structured session where a clinician sets up ordinary social situations and records how your child responds. To a watching parent it looks like someone playing with your child.' },
      { q: 'Where would we go from Saket?', a: 'Our Malviya Nagar centre, one Yellow Line stop north of Saket metro. Speech and language input sits in the same building, which matters for this assessment.' },
      { q: 'Does a diagnosis get us a disability certificate?', a: 'Not directly. Ours is a clinical diagnosis. A certificate under the RPwD Act comes from a government medical board through its own process, which we explain on the call.' },
      { q: 'How much does an autism assessment cost in Saket?', a: 'Quoted upfront on your free 15-minute intake call, as one figure covering observation, history, report and feedback.' },
    ],
    'hauz-khas': [
      { q: 'Can an adult be assessed for autism?', a: 'Yes, and adult self-referrals are a growing part of the caseload here, often following a sibling or a child being diagnosed.' },
      { q: 'My child has coped well for years. Could it still be autism?', a: 'Yes. Compensating through ability and rule-learning is common and delays identification, which is the commonest late-diagnosis picture we see from this area.' },
      { q: 'What does the assessment actually consist of?', a: 'Direct structured observation using ADOS-2, a detailed developmental history, structured tools including ISAA and CARS, and input on communication and sensory profiles.' },
      { q: 'Where would we go from Hauz Khas?', a: 'Our Malviya Nagar centre, one Yellow Line stop south. It is two or three appointments rather than an ongoing commitment.' },
      { q: 'How much does an autism assessment cost in Hauz Khas?', a: 'You get the figure on the free 15-minute intake call, priced as one piece of work rather than per appointment.' },
    ],
    'green-park': [
      { q: 'My child is two and not speaking. Is it too early to assess?', a: 'No. We assess from around eighteen months, and this catchment sends us the youngest referrals we see. Early is better than certain.' },
      { q: 'We were told to wait and see. Should we?', a: 'Sometimes that is right. But loss of words or gestures a child previously had is never wait-and-see, and warrants an appointment quickly.' },
      { q: 'Will my child be upset by the assessment?', a: 'Rarely. ADOS-2 is play-based and paced to the child. Most young children experience it as an adult playing with them for a while.' },
      { q: 'Where would we go from Green Park?', a: 'Our Malviya Nagar centre, two Yellow Line stops south or straight down Aurobindo Marg, where speech and language input is in the same building.' },
      { q: 'How much does an autism assessment cost in Green Park?', a: 'The figure comes on your free 15-minute intake call and covers the whole assessment, with nothing added afterwards.' },
    ],
    'greater-kailash': [
      { q: 'We have already been told it is not autism. Is a second opinion reasonable?', a: 'Very. Second opinions are a large share of what we assess from GK, particularly where the first answer came quickly and without structured observation.' },
      { q: 'Are girls diagnosed differently?', a: 'Later and less often, because the presentation is frequently quieter and better camouflaged. It is a recurring reason families reach us having been turned away elsewhere.' },
      { q: 'How many visits is this from Greater Kailash?', a: 'Usually two or three plus report writing. Unlike therapy it has a defined end, which makes the drive easier to justify.' },
      { q: 'Does the report get us a disability certificate?', a: 'Not directly. Ours is a clinical diagnosis. The RPwD certificate is issued by a government medical board through a separate process we will walk you through.' },
      { q: 'How much does an autism assessment cost in Greater Kailash?', a: 'Quoted on the free 15-minute intake call before you commit, and a second opinion is priced the same as a first assessment.' },
    ],
    'defence-colony': [
      { q: 'School support has plateaued. Would an assessment help?', a: 'Often. Where accommodations are in place and progress has stalled, it usually means the underlying question was never actually settled.' },
      { q: 'What paperwork does a diagnosis give us?', a: 'A clinical diagnosis that schools and therapy services act on. It is not a disability certificate, which comes from a government medical board separately.' },
      { q: 'Where would we go from Defence Colony?', a: 'Our Malviya Nagar centre via Ring Road and Press Enclave Marg. It is a handful of visits rather than a weekly journey.' },
      { q: 'How long does the whole thing take?', a: 'Two or three appointments plus report writing, usually across a few weeks. We tell you the expected timeline on the intake call.' },
      { q: 'How much does an autism assessment cost in Defence Colony?', a: 'You are told the figure on the free 15-minute intake call, as one quote for the whole assessment.' },
    ],
    'vasant-kunj': [
      { q: 'Why is the team larger for this assessment?', a: 'Because a diagnosis needs communication and sensory profiles as well as observation. Speech and language and occupational therapy input sits alongside psychology here.' },
      { q: 'My child is managing a third language at school. Could that look like autism?', a: 'It can, and separating the linguistic from the diagnostic is a substantial part of the work at this centre given the schools it serves.' },
      { q: 'Will the report be usable if we move abroad?', a: 'We name the instruments and give the scores so it can be interpreted elsewhere. Whether a receiving system accepts it is always their decision.' },
      { q: 'What is ADOS-2?', a: 'A semi-structured observation session where a clinician sets up ordinary social situations and records the response. It is the core of the assessment rather than an add-on.' },
      { q: 'How much does an autism assessment cost in Vasant Kunj?', a: 'Quoted on your free 15-minute intake call as one figure covering observation, history, report and feedback.' },
    ],
    'gurgaon': [
      { q: 'My child is three and not speaking much. Should we wait?', a: 'No. Most of our Gurugram referrals are under five precisely because what follows an assessment at that age is time-sensitive.' },
      { q: 'Can sensory difficulties be assessed here too?', a: 'Yes. Our occupational therapist works from this centre, so the sensory and motor side is assessed here rather than referred onward.' },
      { q: 'Where is the Gurugram centre?', a: '710, DLF City Court, Mehrauli-Gurgaon Road, Sector 24, with Guru Dronacharya on the Yellow Line roughly 700 metres away.' },
      { q: 'Does a diagnosis get us a disability certificate?', a: 'Not directly. Ours is a clinical diagnosis. The RPwD certificate is issued by a government medical board through its own separate process.' },
      { q: 'How much does an autism assessment cost in Gurgaon?', a: 'Quoted on the free 15-minute intake call before booking, as a single figure for the whole assessment.' },
    ],
    'noida': [
      { q: 'Can an autism assessment be done online?', a: 'No. ADOS-2 is direct observation in a room and there is no version of it that works over video. This assessment requires travelling in.' },
      { q: 'How many trips would that be from Noida?', a: 'We aim for one. History and feedback run online, and the observation plus any speech or occupational therapy input are grouped into a single visit where the child can manage it.' },
      { q: 'Is there an eMbrace centre in Noida?', a: 'No. Assessment appointments are at our Malviya Nagar centre in south Delhi, which means a Blue to Yellow Line change or a drive.' },
      { q: 'How young can a child be assessed?', a: 'From around eighteen months. With very young children we would rather see you early and say the picture is unclear than have you wait.' },
      { q: 'How much does an autism assessment cost?', a: 'Quoted on your free 15-minute intake call. The online parts and the in-person observation are one piece of work, not billed separately.' },
    ],
    'delhi': [
      { q: 'Which Delhi centre would we use?', a: 'Vasant Kunj for the largest multidisciplinary team, Malviya Nagar for the Yellow Line corridor where speech and language input is in the same building.' },
      { q: 'How is this different from an ADHD assessment?', a: 'ADHD assessment leans on rating scales from several people. Autism assessment leans on watching your child directly, through structured observation using ADOS-2.' },
      { q: 'We first worried two years ago. Is it too late?', a: 'No, though the gap between first worrying and being assessed is the clearest city-wide pattern we see, and closing it is worth a great deal.' },
      { q: 'Does the diagnosis get us a disability certificate?', a: 'Not directly. Ours is a clinical diagnosis that schools and therapy services act on. The RPwD certificate comes from a government medical board.' },
      { q: 'How much does an autism assessment cost in Delhi?', a: 'You get the figure on your free 15-minute intake call, as one quote for the whole assessment rather than per appointment.' },
    ],
    'south-delhi': [
      { q: 'Which South Delhi centre is closer?', a: 'Malviya Nagar from Saket, Hauz Khas, Green Park, Greater Kailash and Defence Colony. Vasant Kunj from Vasant Vihar, Munirka, R.K. Puram and Safdarjung Enclave.' },
      { q: 'My daughter was told she is just shy. Could it be autism?', a: 'Possibly. Girls are diagnosed later and less often because the presentation is frequently quieter, and late diagnosis is a growing part of this caseload.' },
      { q: 'What tools do you use?', a: 'Direct structured observation with ADOS-2, a detailed developmental history, structured tools including ISAA and CARS, plus communication and sensory input.' },
      { q: 'How long does the process take?', a: 'Two or three appointments plus report writing, usually across a few weeks. The expected timeline is given on the intake call.' },
      { q: 'How much does an autism assessment cost in South Delhi?', a: 'Quoted upfront on the free 15-minute intake call, as a single figure for the whole assessment.' },
    ],
    default: [
      { q: 'How young can a child be assessed for autism?', a: 'From around eighteen months. With very young children we would rather see you early and say the picture is not yet clear than have you wait a year.' },
      { q: 'What is ADOS-2?', a: 'A semi-structured session where a clinician sets up ordinary social situations and records how your child responds. It is the core of the assessment.' },
      { q: 'How is this different from an ADHD assessment?', a: 'ADHD assessment leans on rating scales from several informants. Autism assessment leans on watching your child directly through structured observation.' },
      { q: 'Does a diagnosis get us a disability certificate?', a: 'Not directly. Ours is a clinical diagnosis that schools and therapy services act on. The RPwD certificate is issued by a government medical board.' },
      { q: 'How much does an autism assessment cost?', a: 'Quoted upfront on your free 15-minute intake call, as one figure covering observation, history, report and feedback.' },
    ],
  },
};

/**
 * Batch 7. Autism therapy is what happens after the assessment, and the two
 * pages are written so that neither repeats the other: the assessment page is
 * about arriving at an answer, this one is about what is actually done.
 *
 * The honest position matters more here than on any other page in the set.
 * Autism therapy is a field with a long history of overclaiming, so these pages
 * state plainly that the goal is communication, participation and less distress,
 * not making a child indistinguishable from their peers. That is also the
 * position our clinical lead practises from, so it is descriptive rather than
 * marketing.
 */
SERVICES['autism-therapy'] = {
  name: 'Autism Therapy',
  noun: 'autism therapy',
  keyword: 'autism therapy',
  hub: '/autism/autism',
  hubName: 'Autism Hub',

  partnersOverride: {
    'vasant-kunj': ['american-embassy-school', 'british-school', 'atypical-advantage'],
    'gurgaon': ['pathways-gurgaon', 'medical-travel-company', 'atypical-advantage'],
    'delhi': ['rainbow', 'medical-travel-company', 'atypical-advantage'],
    'south-delhi': ['rainbow', 'american-embassy-school', 'atypical-advantage'],
    'saket': ['rainbow', 'atypical-advantage'],
    'hauz-khas': ['rainbow', 'atypical-advantage'],
    'green-park': ['rainbow'],
    'greater-kailash': ['rainbow', 'atypical-advantage'],
    'defence-colony': ['rainbow', 'medical-travel-company'],
    'noida': ['medical-travel-company', 'rainbow'],
    default: ['rainbow'],
  },
  partnerIntro: locality =>
    `Autism support around ${locality.name} does not stop at our door, and the organisations we work with shape what we can offer.`,

  lede: locality =>
    `Autism therapy in ${locality.name} is not one thing. It is a programme assembled from several disciplines around what a particular child actually needs, which is why the first honest question is not how many hours but which hours. ` +
    `${locality.leadCentreSentence} This page sets out what the programme can contain, what it is aiming at, and what it is not promising.`,

  cadence:
    'This is the heaviest commitment we offer: potentially two or three appointments a week across different disciplines, sustained over months, so the journey is not a detail. Be blunt on the intake call about what your week can carry. A smaller programme that runs for a year beats an ambitious one abandoned in six.',

  whenRight: {
    h2: 'What the therapy is aiming at',
    paras: [
      'The goal is a child who can communicate what they need, take part in what matters to them, and spend less of the day distressed. It is not making an autistic child indistinguishable from a non-autistic one. That distinction changes which goals go in the plan, so it is worth asking any provider where they stand before you commit.',
    ],
    list: [
      'Communication, whether spoken, signed or through a device, so a child can get needs and ideas across',
      'Regulation and sensory strategies, so the day contains fewer overwhelming moments',
      'Participation at home and at school, measured in what a child can join in with',
      'Parent and sibling support, because the programme runs at home far more hours than it runs with us',
    ],
    after: [],
    hubLink: 'Behaviour therapy, sleep, feeding, emotional regulation and autism with ADHD each have their own page on our autism hub.',
  },

  firstAppointment: {
    h2: 'What a programme is made of',
    paras: [
      'A programme draws on behaviour therapy and parent training, speech and language therapy, occupational therapy, special education for school access, and physiotherapy where movement is affected. For the youngest children it is organised around naturalistic early intervention, embedded in play and daily routines rather than delivered at a table.',
      'What we will not do is put every child on the same package. The plan starts from a written baseline, names a few goals in terms you could check yourself, and is reviewed on a set date. If a goal is not moving, the plan changes.',
    ],
    list: [],
    after: [],
  },

  timelines: {
    h2: 'Fees, hours, and how progress is judged',
    paras: [
      'Fees are quoted upfront on your intake call and depend on which disciplines the programme uses and how often. Because it is assembled rather than sold as a package, you get the shape and the cost together before anything starts.',
      'We review formally on a date set in advance, against the goals written at the start. Beware anyone promising a timeline or an outcome for autism therapy, because nobody can honestly give you one.',
    ],
  },

  seenMost: {
    h2: 'What programmes tend to look like here',
    default: [
      'Most programmes here combine communication work with regulation and sensory strategies, alongside parent training, and are adjusted as a child moves through school.',
    ],
    'saket': [
      'From Saket most programmes are built around school. The child is placed, often in a mainstream school, and the therapy question is what would let them access the day: communication support, regulation strategies, and a plan the class teacher can actually run.',
      'That means a good deal of our Saket work happens in writing, in the form of practical notes to school, rather than only in the room.',
    ],
    'hauz-khas': [
      'From Hauz Khas and SDA the programmes skew towards older children and young people, where the focus shifts from early communication to self-advocacy, managing sensory load independently, and navigating a social world that has become more implicit and harder to read.',
      'Families here often arrive well informed and with clear views about approach, which shortens the design conversation considerably.',
    ],
    'green-park': [
      'From Green Park programmes are usually early. For under-fives the work is naturalistic, embedded in play and daily routines, and heavily parent-delivered, because a two-year-old learns in the hours between sessions rather than during them.',
      'That makes parent coaching the load-bearing part of the programme at this age, which some families find surprising and most find a relief.',
    ],
    'greater-kailash': [
      'From Greater Kailash the journey shapes the programme. Rather than spreading three disciplines across three days, we cluster appointments so a family travels once and sees more than one clinician, and push what can be parent-delivered into the home programme.',
      'The work itself tends to centre on communication and regulation, with school liaison running alongside it.',
    ],
    'defence-colony': [
      'From Defence Colony and Jangpura programmes frequently start after a period of fragmented support, where a family has been seeing separate providers who have never spoken to each other. Consolidating that into one plan with one review date is often the most useful thing we do first.',
      'Sensory and regulation work features heavily in this catchment, alongside parent training.',
    ],
    'vasant-kunj': [
      'Vasant Kunj runs the fullest programmes we offer, because behaviour therapy, speech and language therapy and occupational therapy all sit in the same building and the clinicians can talk to each other between sessions rather than by email.',
      'The international school catchment shapes the goals: a great deal of the work is about access to a mainstream curriculum, and about writing something a school in any system can actually act on.',
    ],
    'gurgaon': [
      'Gurugram programmes lean early and lean towards occupational therapy and sensory work, because our occupational therapist is based here and because the referrals skew young.',
      'Speech and language input for Gurugram families runs from our Delhi centres or online, which we say plainly when we design the programme rather than after you have committed to it.',
    ],
    'noida': [
      'Noida families run the largest online component of any catchment, and for autism therapy that works better than people expect: parent coaching, which is the part that carries most of the change, is well suited to video, and a therapist watching your actual living room is more useful than one imagining it.',
      'What does not work remotely is hands-on occupational therapy and physiotherapy. Where a programme needs those we say so and we plan the travel around them rather than pretending.',
    ],
    'delhi': [
      'Across both Delhi centres programmes combine communication work, regulation and sensory strategies, parent training and school liaison, with the mix set by age. Under-fives get naturalistic early intervention; school-age children get access-focused work.',
      'The Malviya Nagar centre runs inside Rainbow, which is why a child needing three disciplines can often get them at one address rather than three.',
    ],
    'south-delhi': [
      'Across south Delhi the dominant programme shape is school-facing: a child in a mainstream school, and a plan aimed at letting them access the day. The single most useful output is often a short, practical note the class teacher can act on.',
      'The second pattern is consolidation, where a family has accumulated several providers over years and nobody has ever written one plan.',
    ],
  },

  faqs: {
    'saket': [
      { q: 'How many hours of therapy does my child need?', a: 'There is no single right number. We start from what your week can actually sustain, because a smaller programme that runs for a year beats an ambitious one abandoned in six weeks.' },
      { q: 'Will therapy make my child no longer autistic?', a: 'No, and anyone suggesting otherwise is overclaiming. The goal is communication, participation and less distress, not making your child indistinguishable from peers.' },
      { q: 'Can you work with my child\u2019s school?', a: 'Yes, and from Saket that is often the most useful part. A short practical note a class teacher can act on frequently changes more than an extra session.' },
      { q: 'Where would we go from Saket?', a: 'Our Malviya Nagar centre, one Yellow Line stop north of Saket metro. It runs inside Rainbow, so several disciplines sit at one address.' },
      { q: 'How much does autism therapy cost in Saket?', a: 'Quoted upfront on your free 15-minute intake call, once we know which disciplines the programme uses and how often.' },
    ],
    'hauz-khas': [
      { q: 'My child is older. Is therapy still worth starting?', a: 'Yes. With older children the focus shifts to self-advocacy, managing sensory load independently and navigating a social world that has become harder to read.' },
      { q: 'We have strong views on approach. Will you work with that?', a: 'Yes, and families here usually do. Tell us on the intake call and it shortens the design conversation considerably.' },
      { q: 'What disciplines might be involved?', a: 'Behaviour therapy and parent training, speech and language therapy, occupational therapy, special education, and physiotherapy where movement is affected.' },
      { q: 'Where would we go from Hauz Khas?', a: 'Our Malviya Nagar centre, one Yellow Line stop south, where several disciplines run in the same building.' },
      { q: 'How much does autism therapy cost in Hauz Khas?', a: 'You get the figure on the free 15-minute intake call, once the shape of the programme is agreed.' },
    ],
    'green-park': [
      { q: 'My child is two. What does therapy look like at that age?', a: 'Naturalistic and play-based, embedded in daily routines rather than delivered at a table, and largely parent-delivered because that is where the hours are.' },
      { q: 'Why is so much of it aimed at me rather than my child?', a: 'Because a two-year-old learns in the hours between sessions. Parent coaching is the load-bearing part of an early programme, not an add-on to it.' },
      { q: 'Will therapy make my child no longer autistic?', a: 'No. The goal is communication, participation and less distress. Anyone promising more than that is overclaiming.' },
      { q: 'Where would we go from Green Park?', a: 'Our Malviya Nagar centre, two Yellow Line stops south or straight down Aurobindo Marg, where several disciplines run at one address.' },
      { q: 'How much does autism therapy cost in Green Park?', a: 'The figure comes on your free 15-minute intake call, once we know which disciplines are involved and how often.' },
    ],
    'greater-kailash': [
      { q: 'Can appointments be clustered so we travel less?', a: 'Yes, and from GK we do that deliberately: several disciplines on one day rather than spread across the week, with more pushed into the home programme.' },
      { q: 'How long will my child need therapy?', a: 'Nobody can honestly give you a timeline for autism therapy. We review formally on a date set in advance and tell you plainly what has moved and what has not.' },
      { q: 'Will therapy make my child no longer autistic?', a: 'No, and that is not what it is for. The goals are communication, participation and less distress, written so you can check them.' },
      { q: 'Where would we go from Greater Kailash?', a: 'Our Malviya Nagar centre via Outer Ring Road and Press Enclave Marg, where several disciplines sit in one building.' },
      { q: 'How much does autism therapy cost in Greater Kailash?', a: 'Quoted on the free 15-minute intake call before you commit, once the programme shape is agreed.' },
    ],
    'defence-colony': [
      { q: 'We already see three different providers. Can you consolidate that?', a: 'Usually, and it is often the most useful first step. One plan, one baseline and one review date beats three providers who have never spoken to each other.' },
      { q: 'What does a plan actually contain?', a: 'A written baseline, a small number of goals stated so you could check them yourself, and a set review date rather than a vague promise to reassess.' },
      { q: 'Where would we go from Defence Colony?', a: 'Our Malviya Nagar centre via Ring Road and Press Enclave Marg, where several disciplines run at one address.' },
      { q: 'Will therapy make my child no longer autistic?', a: 'No. The aim is communication, participation and less distress. Be wary of anyone offering more than that.' },
      { q: 'How much does autism therapy cost in Defence Colony?', a: 'You are told the figure on the free 15-minute intake call, once we know which disciplines the programme uses.' },
    ],
    'vasant-kunj': [
      { q: 'Why are programmes fuller at this centre?', a: 'Because behaviour therapy, speech and language therapy and occupational therapy all sit in the same building, so clinicians talk to each other between sessions rather than by email.' },
      { q: 'Can you write something our international school will act on?', a: 'Yes. Much of the work here is curriculum access, and reports are written so a school in any system can use them.' },
      { q: 'Will therapy make my child no longer autistic?', a: 'No. The goal is communication, participation and less distress, not making an autistic child indistinguishable from a non-autistic one.' },
      { q: 'Where is your Vasant Kunj centre?', a: 'C-7, Sector C, Pocket 5, in the basement of Grand Vasant Kunj, which carries the largest multidisciplinary team.' },
      { q: 'How much does autism therapy cost in Vasant Kunj?', a: 'Quoted on your free 15-minute intake call, once we know which disciplines the programme uses and how often.' },
    ],
    'gurgaon': [
      { q: 'Is speech and language therapy available in Gurgaon?', a: 'Not from a pathologist based at this centre. Gurugram families access it from our Delhi centres or online, and we say so when designing the programme.' },
      { q: 'What is available at the Gurugram centre?', a: 'Occupational therapy and sensory work in particular, since our occupational therapist is based here, alongside psychology and parent training.' },
      { q: 'My child is three. Is that too early?', a: 'No, it is close to ideal. Gurugram referrals skew young, and early programmes are naturalistic, play-based and largely parent-delivered.' },
      { q: 'Where is the Gurugram centre?', a: '710, DLF City Court, Mehrauli-Gurgaon Road, Sector 24, with Guru Dronacharya on the Yellow Line roughly 700 metres away.' },
      { q: 'How much does autism therapy cost in Gurgaon?', a: 'Quoted on the free 15-minute intake call before booking, once the shape of the programme is agreed.' },
    ],
    'noida': [
      { q: 'Can autism therapy work online?', a: 'Parent coaching does, and it carries most of the change. A therapist watching your actual living room is more useful than one imagining it.' },
      { q: 'What cannot be done remotely?', a: 'Hands-on occupational therapy and physiotherapy. Where a programme needs those we say so and plan the travel around them rather than pretending otherwise.' },
      { q: 'Is there an eMbrace centre in Noida?', a: 'No. In-person sessions run at our Malviya Nagar centre in south Delhi, which is a Blue to Yellow Line change or a drive.' },
      { q: 'How many hours does my child need?', a: 'There is no single right number. We start from what your week can sustain, because a smaller programme that lasts beats an ambitious one abandoned early.' },
      { q: 'How much does autism therapy cost?', a: 'Quoted on your free 15-minute intake call. Online and in-person parts are designed as one programme, not billed as separate services.' },
    ],
    'delhi': [
      { q: 'Which Delhi centre would we use?', a: 'Vasant Kunj for the fullest multidisciplinary programmes, Malviya Nagar because it runs inside Rainbow so several disciplines sit at one address.' },
      { q: 'What is the difference between this and autism assessment?', a: 'Assessment arrives at an answer. Therapy is what is actually done afterwards, assembled from several disciplines around what your child needs.' },
      { q: 'Will therapy make my child no longer autistic?', a: 'No, and anyone suggesting otherwise is overclaiming. The goal is communication, participation and less distress.' },
      { q: 'How is progress judged?', a: 'Against goals written at the start, reviewed on a date set in advance. If a goal is not moving, the plan changes rather than continuing.' },
      { q: 'How much does autism therapy cost in Delhi?', a: 'You get the figure on your free 15-minute intake call, once we know which disciplines the programme uses and how often.' },
    ],
    'south-delhi': [
      { q: 'Which South Delhi centre is closer?', a: 'Malviya Nagar from Saket, Hauz Khas, Green Park, Greater Kailash and Defence Colony. Vasant Kunj from Vasant Vihar, Munirka, R.K. Puram and Safdarjung Enclave.' },
      { q: 'My child is in a mainstream school. What would therapy target?', a: 'Access to the day: communication support, regulation strategies, and a short practical note the class teacher can actually run with.' },
      { q: 'We have collected several providers over the years. Is that a problem?', a: 'It usually means nobody has written one plan. Consolidating into a single baseline with one review date is often the most useful first step.' },
      { q: 'How long will therapy be needed?', a: 'Nobody can honestly promise a timeline for autism therapy. We review on a set date and tell you plainly what has moved and what has not.' },
      { q: 'How much does autism therapy cost in South Delhi?', a: 'Quoted upfront on the free 15-minute intake call, once the programme shape is agreed.' },
    ],
    default: [
      { q: 'Will therapy make my child no longer autistic?', a: 'No, and anyone suggesting otherwise is overclaiming. The goal is communication, participation and less distress, not making a child indistinguishable from peers.' },
      { q: 'How many hours of therapy does my child need?', a: 'There is no single right number. We start from what your week can sustain, because a smaller programme that lasts beats an ambitious one abandoned early.' },
      { q: 'What disciplines might be involved?', a: 'Behaviour therapy and parent training, speech and language therapy, occupational therapy, special education, and physiotherapy where movement is affected.' },
      { q: 'How is progress judged?', a: 'Against goals written at the start, reviewed on a date set in advance. If a goal is not moving, the plan changes rather than continuing unchanged.' },
      { q: 'How much does autism therapy cost?', a: 'Quoted upfront on your free 15-minute intake call, once we know which disciplines the programme uses and how often.' },
    ],
  },
};

/**
 * Batch 8. Nearest sibling is adhd-assessment. What separates them:
 * ADHD assessment asks whether attention and impulsivity are out of step across
 * settings. This asks a narrower and more testable question about specific
 * academic skills against overall ability, and it answers to a much more
 * concrete piece of machinery: exam accommodations.
 *
 * The genuinely useful thing these pages say, which no competitor does, is
 * about timing. Boards set their own deadlines for accommodation applications
 * and they fall well before the exam. Leaving it to the final year is the
 * commonest and most costly mistake families make. No specific deadline is
 * quoted here, because those vary and change.
 */
SERVICES['learning-disability-assessment'] = {
  name: 'Learning Disability Assessment',
  noun: 'learning disability assessment',
  keyword: 'learning disability assessment',
  hub: '/learning-disabilities/specific-learning-disability',
  hubName: 'Learning Disabilities Hub',

  partnersOverride: {
    'vasant-kunj': ['british-school', 'american-embassy-school', 'ashoka'],
    'gurgaon': ['pathways-gurgaon', 'ashoka'],
    'delhi': ['ashoka', 'british-school', 'woodstock'],
    'south-delhi': ['ashoka', 'american-embassy-school', 'doon'],
    'saket': ['ashoka', 'doon'],
    'hauz-khas': ['ashoka', 'woodstock'],
    'green-park': ['rainbow'],
    'greater-kailash': ['ashoka', 'doon'],
    'defence-colony': ['woodstock', 'lincoln'],
    'noida': ['ashoka', 'medical-travel-company'],
    default: ['ashoka'],
  },
  partnerIntro: locality =>
    `Around ${locality.name} a good deal of this work reaches us through schools and universities rather than directly, and those routes are worth knowing.`,

  lede: locality =>
    `A learning disability assessment in ${locality.name} answers a narrow, testable question: is a specific academic skill out of step with everything else this person can do? ` +
    `${locality.leadCentreSentence} It matters when you start, because exam boards set their own deadlines for accommodations and they fall well before the exam.`,

  cadence:
    'Two or three appointments, with the testing itself longer than for other assessments because reading, writing and mathematics each have to be measured properly. Timing is the thing to get right. If accommodations are the reason you are doing this, start at least a full academic year before the exam that matters, because board processes are slower than families expect and the deadline is rarely the one you assume.',

  whenRight: {
    h2: 'When an assessment is worth doing',
    paras: [
      'The pattern that warrants testing is unexpected underachievement: a child who understands the material in conversation, works as hard as their classmates or harder, and whose written output does not reflect either. What we are looking for is a specific gap, not general difficulty, and a large part of the work is ruling out the ordinary explanations first.',
    ],
    list: [
      'Reading that is slow, effortful or inaccurate well past the age when it should have become automatic',
      'Spelling and written work far below the quality of the same child\u2019s spoken answers',
      'Mathematics difficulty confined to number, where reasoning elsewhere is fine',
      'Vision, hearing, attendance, language of instruction and teaching quality all considered and excluded first',
    ],
    after: [],
    hubLink: 'Dyslexia, dysgraphia, dyscalculia, exam accommodations and academic intervention each have their own page on our learning disabilities hub.',
  },

  firstAppointment: {
    h2: 'What the testing actually measures',
    paras: [
      'Two things, held against each other. First, general cognitive ability, so we know what this person is capable of. Second, the specific academic skills, reading accuracy and speed, comprehension, spelling, written expression and number, measured individually rather than inferred from school marks. In India that commonly draws on the NIMHANS battery for specific learning disability alongside the Wechsler scales.',
      'School evidence goes in too: exercise books, report cards and the observations of whoever teaches the subject. A report written without them is weaker, and boards notice.',
    ],
    list: [],
    after: [],
  },

  timelines: {
    h2: 'Fees, the report, and exam accommodations',
    paras: [
      'Fees are quoted upfront on your intake call as one piece of work covering testing, report and feedback. The report names the instruments, gives the scores, and states what accommodations the findings support in specific terms, because a vague recommendation is of no use to a school or a board.',
      'On accommodations, which is why most families are here: schools will generally act on a good report for internal exams. Board accommodations, whether extra time, a scribe, a calculator or a language exemption, run through the board\u2019s own certification process, which frequently involves a designated government centre and has a deadline. We tell you what your board requires and by when, on the intake call, before you spend anything.',
    ],
  },

  seenMost: {
    h2: 'What brings families here',
    default: [
      'Most referrals follow years of extra tuition that has not closed the gap, or a school flagging that written work does not match what a child clearly understands.',
    ],
    'saket': [
      'From Saket the dominant driver is board accommodations, and the commonest problem is timing: families arrive in the final year, when the board deadline has often already passed. Starting a year earlier changes what is available.',
      'The second pattern is the child who has had tuition for three years without the gap closing, which is usually the clearest sign that more of the same teaching is not the answer.',
    ],
    'hauz-khas': [
      'From Hauz Khas and SDA a distinctive group is high-ability students whose specific difficulty has been buried under strong general reasoning for years, surfacing only when volume and time pressure rise.',
      'University students are the second group, often reaching us after a first year that went badly for reasons nobody had identified in fourteen years of school.',
    ],
    'green-park': [
      'From Green Park the referrals are younger, often eight to eleven, usually flagged by a class teacher who has noticed that reading has stayed effortful long after it should have become automatic.',
      'At this age the most useful part of the assessment is often what it rules out. Vision, hearing, attendance and the language of instruction account for a fair share of apparent reading difficulty, and checking them is not a formality.',
    ],
    'greater-kailash': [
      'From Greater Kailash a large share are second opinions or repeat assessments, where an earlier report was too vague for a board to act on, or is now out of date because certification has a shelf life.',
      'The other group is families weighing whether to pursue accommodations at all, who want the diagnostic question answered before deciding.',
    ],
    'defence-colony': [
      'From Defence Colony and Jangpura assessments often follow a period of school-based remedial support that has plateaued, where everyone has been working hard and the underlying question was never actually tested.',
      'Boarding school families are a distinct group here, where the school is elsewhere and the assessment has to be coordinated with a learning support team we will never meet in person.',
    ],
    'vasant-kunj': [
      'Vasant Kunj brings the most curriculum-varied caseload: IB, IGCSE, CBSE and American systems, each with its own accommodations machinery and its own paperwork. Knowing which system a report has to satisfy changes how it is written.',
      'The other distinctive pattern is students who have changed curriculum mid-school, where a genuine learning difficulty and an ordinary transition problem look very similar for the first year.',
    ],
    'gurgaon': [
      'From Gurugram most referrals come through schools that already have learning support teams, so the classroom evidence tends to be well documented before we start. That makes the assessment faster and the report stronger.',
      'Adults are a growing second group, usually people who suspected something through school, were never tested, and now need it named for a workplace or a professional exam.',
    ],
    'noida': [
      'Noida families face the one part of this that cannot be compressed: the academic testing has to be done in person, individually, and it takes time. There is no online version of measuring reading accuracy properly.',
      'What we do is run the history and the feedback online and group the testing into as few visits as the student can manage in a sitting. Most Noida referrals are driven by board accommodations, which makes the timing conversation the first one we have.',
    ],
    'delhi': [
      'Across both Delhi centres the drivers are board accommodations, tuition that has not closed the gap, and schools flagging a mismatch between spoken understanding and written output.',
      'The city-wide pattern is lateness. Families arrive in the final year, and by then the board deadline has often gone. Nothing else on this page would improve outcomes as much as starting a year earlier.',
    ],
    'south-delhi': [
      'Across south Delhi the caseload is dominated by board-year students and by the year immediately before, which is where it should be. The schools in this catchment tend to raise the question earlier than average.',
      'The second cluster is students in the transition to senior school, where the volume of written work rises sharply and a difficulty that was manageable stops being so.',
    ],
  },

  faqs: {
    'saket': [
      { q: 'When should we start if we want board accommodations?', a: 'At least a full academic year before the exam. Families from Saket most often arrive in the final year, by which point the board deadline has frequently passed.' },
      { q: 'We have had tuition for three years. Why has it not worked?', a: 'Because more of the same teaching rarely closes a specific gap. That pattern is usually the clearest sign an assessment is warranted.' },
      { q: 'Will your report get the accommodations?', a: 'It supports them. Boards run their own certification process, often through a designated government centre, and we tell you what yours requires and by when.' },
      { q: 'Where would we go from Saket?', a: 'Our Malviya Nagar centre, one Yellow Line stop north of Saket metro. Testing is longer than other assessments, so allow proper time.' },
      { q: 'How much does a learning disability assessment cost in Saket?', a: 'Quoted upfront on your free 15-minute intake call as one figure covering testing, report and feedback.' },
    ],
    'hauz-khas': [
      { q: 'My child is bright. Can they still have a learning disability?', a: 'Yes, and strong general reasoning often buries a specific difficulty for years, surfacing only when volume and time pressure rise.' },
      { q: 'Do you assess university students?', a: 'Yes. It is a distinct group from this catchment, often after a first year that went badly for reasons nobody identified in fourteen years of school.' },
      { q: 'What does the testing involve?', a: 'General cognitive ability measured against specific academic skills: reading accuracy and speed, comprehension, spelling, written expression and number, each tested individually.' },
      { q: 'Where would we go from Hauz Khas?', a: 'Our Malviya Nagar centre, one Yellow Line stop south. Allow a longer appointment than for other assessments.' },
      { q: 'How much does it cost in Hauz Khas?', a: 'You get the figure on the free 15-minute intake call, priced as one piece of work rather than per appointment.' },
    ],
    'green-park': [
      { q: 'How old does a child need to be?', a: 'Usually around eight. Below that there is rarely enough schooling behind them to distinguish a specific difficulty from ordinary variation in pace.' },
      { q: 'Could it be something other than dyslexia?', a: 'Frequently. Vision, hearing, attendance and the language of instruction account for a fair share of apparent reading difficulty, and we check those first.' },
      { q: 'My child reads, just very slowly. Is that a concern?', a: 'It can be. Reading that stays effortful long after it should have become automatic is the commonest reason teachers refer children from this area.' },
      { q: 'Where would we go from Green Park?', a: 'Our Malviya Nagar centre, two Yellow Line stops south or straight down Aurobindo Marg.' },
      { q: 'How much does it cost in Green Park?', a: 'The figure comes on your free 15-minute intake call and covers testing, report and feedback together.' },
    ],
    'greater-kailash': [
      { q: 'We have a report already but the school says it is not enough. Why?', a: 'Usually because it does not name specific accommodations, or because certification has a shelf life and it is now out of date.' },
      { q: 'Is a repeat assessment worth doing?', a: 'Often, and it is a large share of what we see from GK. A report that a board cannot act on is not a saving.' },
      { q: 'What does the report actually say?', a: 'The instruments used, the scores obtained, and what accommodations the findings support in specific terms rather than general recommendations.' },
      { q: 'Where would we go from Greater Kailash?', a: 'Our Malviya Nagar centre via Outer Ring Road and Press Enclave Marg. Two or three appointments in total.' },
      { q: 'How much does it cost in Greater Kailash?', a: 'Quoted on the free 15-minute intake call before you commit, including where this is a second opinion.' },
    ],
    'defence-colony': [
      { q: 'Remedial support has plateaued. What now?', a: 'That pattern usually means the underlying question was never tested. Assessment tells you what the support should have been targeting.' },
      { q: 'Our child is at boarding school. Can you still assess?', a: 'Yes, and it is common from this catchment. We coordinate with the school learning support team by email and schedule testing around the holidays.' },
      { q: 'When should we start for board accommodations?', a: 'At least a full academic year before the exam. Board processes are slower than families expect and the deadline is rarely the one you assume.' },
      { q: 'Where would we go from Defence Colony?', a: 'Our Malviya Nagar centre via Ring Road and Press Enclave Marg, for two or three appointments.' },
      { q: 'How much does it cost in Defence Colony?', a: 'You are told the figure on the free 15-minute intake call, as one quote for the whole assessment.' },
    ],
    'vasant-kunj': [
      { q: 'Our school follows the IB. Does that change the report?', a: 'It changes how it is written. IB, IGCSE, CBSE and American systems each have their own accommodations machinery, and a report has to satisfy the one you are in.' },
      { q: 'We changed curriculum two years ago. Could that explain it?', a: 'It might. A genuine learning difficulty and an ordinary curriculum transition look very similar for the first year, and separating them is part of the work here.' },
      { q: 'Where is your Vasant Kunj centre?', a: 'C-7, Sector C, Pocket 5, in the basement of Grand Vasant Kunj. Allow a longer appointment than for other assessments.' },
      { q: 'What is actually measured?', a: 'General cognitive ability against specific academic skills: reading accuracy and speed, comprehension, spelling, written expression and number, each tested individually.' },
      { q: 'How much does it cost in Vasant Kunj?', a: 'Quoted on your free 15-minute intake call as one figure covering testing, report and feedback.' },
    ],
    'gurgaon': [
      { q: 'Our school has a learning support team. Does that help?', a: 'Considerably. Where classroom evidence is already documented the assessment is faster and the report is stronger, which is common from Gurugram schools.' },
      { q: 'Can adults be assessed?', a: 'Yes, and it is a growing group here: people who suspected something at school, were never tested, and now need it named for work or a professional exam.' },
      { q: 'Where is the Gurugram centre?', a: '710, DLF City Court, Mehrauli-Gurgaon Road, Sector 24, with Guru Dronacharya on the Yellow Line roughly 700 metres away.' },
      { q: 'When should we start for board accommodations?', a: 'At least a full academic year before the exam, because board processes take longer than families expect and deadlines fall early.' },
      { q: 'How much does it cost in Gurgaon?', a: 'Quoted on the free 15-minute intake call before booking, as a single figure for the whole assessment.' },
    ],
    'noida': [
      { q: 'Can any of this be done online?', a: 'The history and the feedback, yes. The academic testing has to be in person and individual, because there is no online way to measure reading accuracy properly.' },
      { q: 'How many trips from Noida?', a: 'We group the testing into as few sittings as the student can manage, usually one or two, rather than spreading it across several appointments.' },
      { q: 'When should we start for board accommodations?', a: 'At least a full academic year before the exam. It is the first conversation we have with most Noida families, because it decides what is still possible.' },
      { q: 'Is there an eMbrace centre in Noida?', a: 'No. Testing is at our Malviya Nagar centre in south Delhi, which is a Blue to Yellow Line change or a drive.' },
      { q: 'How much does it cost?', a: 'Quoted on your free 15-minute intake call. Online and in-person parts are one piece of work, not billed separately.' },
    ],
    'delhi': [
      { q: 'When should we start if we want board accommodations?', a: 'At least a full academic year before the exam. Lateness is the clearest city-wide pattern we see, and starting earlier changes what is available.' },
      { q: 'How is this different from an ADHD assessment?', a: 'ADHD assessment asks whether attention is out of step across settings. This asks whether a specific academic skill is out of step with overall ability.' },
      { q: 'Which Delhi centre would we use?', a: 'Vasant Kunj for south-west Delhi, Malviya Nagar for the Yellow Line corridor. The same testing runs at both.' },
      { q: 'Will the report get accommodations?', a: 'It supports them. Boards run their own certification, frequently through a designated government centre, and we tell you what yours requires and by when.' },
      { q: 'How much does it cost in Delhi?', a: 'You get the figure on your free 15-minute intake call, as one quote for the whole assessment.' },
    ],
    'south-delhi': [
      { q: 'Which South Delhi centre is closer?', a: 'Malviya Nagar from Saket, Hauz Khas, Green Park, Greater Kailash and Defence Colony. Vasant Kunj from Vasant Vihar, Munirka, R.K. Puram and Safdarjung Enclave.' },
      { q: 'Written work does not match what my child clearly knows. Is that the sign?', a: 'It is the classic one. Unexpected underachievement, where understanding is evident in conversation but not on paper, is what this assessment tests for.' },
      { q: 'My child is entering senior school and struggling. Is that normal?', a: 'The volume of written work rises sharply at that point, and a difficulty that was manageable stops being so. It is a common referral cluster here.' },
      { q: 'When should we start for accommodations?', a: 'At least a full academic year before the exam. Schools in this catchment tend to raise it earlier than average, which helps.' },
      { q: 'How much does it cost in South Delhi?', a: 'Quoted upfront on the free 15-minute intake call, as a single figure for testing, report and feedback.' },
    ],
    default: [
      { q: 'When should we start if we want exam accommodations?', a: 'At least a full academic year before the exam. Board processes are slower than families expect and the deadline is rarely the one you assume.' },
      { q: 'How old does a child need to be?', a: 'Usually around eight, because below that there is rarely enough schooling behind them to distinguish a specific difficulty from ordinary variation in pace.' },
      { q: 'What does the testing measure?', a: 'General cognitive ability against specific academic skills: reading accuracy and speed, comprehension, spelling, written expression and number, each tested individually.' },
      { q: 'Will the report get the accommodations?', a: 'It supports them. Boards run their own certification process, frequently through a designated government centre, and we tell you what yours requires.' },
      { q: 'How much does a learning disability assessment cost?', a: 'Quoted upfront on your free 15-minute intake call, as one figure covering testing, report and feedback.' },
    ],
  },
};

/**
 * Batch 9. Speech therapy is the only service in the set that runs the whole
 * lifespan, from a toddler with no words to an adult relearning speech after a
 * stroke. That range is the differentiator, and it is drawn straight from the
 * clinician record rather than invented.
 *
 * It also carries the set's most important honest disclosure: there is no
 * speech and language pathologist based at the Gurugram centre. The `coverage`
 * map below says so on that page rather than letting the generator fall back to
 * a vague reassurance.
 */
SERVICES['speech-therapy'] = {
  name: 'Speech Therapy',
  noun: 'speech and language therapy',
  keyword: 'speech therapy',
  hub: '/speech-therapy/speech-therapy',
  hubName: 'Speech and Language Hub',

  coverage: {
    'gurugram':
      'We do not have a speech and language pathologist based at our Gurugram centre, and it is better to say so than to have you discover it after booking. Gurugram families see Upasna at either of our Delhi centres, or work online, which suits a good deal of speech and language therapy well. We will sort out which on the intake call.',
  },

  partnersOverride: {
    'vasant-kunj': ['british-school', 'american-embassy-school', 'rainbow'],
    'gurgaon': ['pathways-gurgaon', 'medical-travel-company'],
    'delhi': ['rainbow', 'medical-travel-company'],
    'south-delhi': ['rainbow', 'american-embassy-school'],
    'saket': ['rainbow'],
    'hauz-khas': ['rainbow'],
    'green-park': ['rainbow'],
    'greater-kailash': ['rainbow'],
    'defence-colony': ['rainbow', 'medical-travel-company'],
    'noida': ['medical-travel-company', 'rainbow'],
    default: ['rainbow'],
  },
  partnerIntro: locality =>
    `Referrals around ${locality.name} reach this service through several routes, and the institutional ones are worth knowing about.`,

  lede: locality =>
    `Speech and language therapy in ${locality.name} covers a wider span than any other service we run: a toddler with no words, a child who stammers, and an adult relearning speech or swallowing after a stroke are all speech and language work. ` +
    `${locality.leadCentreSentence} This page sets out what we treat, how often, and the part that actually decides whether it works.`,

  cadence:
    'Sessions are weekly, and here is the part providers underplay: the session matters less than the ten minutes a day at home. This is skill practice, built by repetition in ordinary settings rather than in a clinic room once a week. If ten minutes daily is not realistic right now, say so and we will build a smaller programme that is.',

  whenRight: {
    h2: 'What we treat',
    paras: [
      'The two ends of the range look nothing alike. For children: late talking, unclear speech, language that is not developing, stammering, feeding and oral motor difficulty, cleft lip and palate, cochlear implant support, verbal dyspraxia, and the social use of language in autism. For adults, mostly after neurological illness: aphasia, dysarthria, voice and difficulty swallowing safely.',
    ],
    list: [
      'A child with fewer than around fifty words at two, or not putting words together by two and a half',
      'Speech that people outside the family cannot understand by around four',
      'Stammering that has lasted more than six months, or that the child has become aware of',
      'Coughing or distress when eating or drinking, at any age, which should be looked at promptly',
      'Adults with speech, voice or swallowing difficulty after a stroke or with a progressive condition',
    ],
    after: [],
    hubLink: 'Each of these has its own page on our speech and language hub.',
  },

  firstAppointment: {
    h2: 'What the first appointment involves',
    paras: [
      'An assessment first, because difficulties that look identical can have quite different causes. We take a history, analyse speech and language directly, and check the mechanics where feeding or oral motor control are involved. Hearing is always considered, being the commonest missed explanation for a language delay.',
      'You leave with a baseline, targets in plain terms, and specific things to do at home. With young children the parent session matters as much as the child session, since you run the practice.',
    ],
    list: [],
    after: [],
  },

  timelines: {
    h2: 'Fees and how long it takes',
    paras: [
      'Fees are quoted upfront on your intake call and depend on the clinician and the frequency. Courses are typically blocks of eight to twelve weekly sessions followed by a review, rather than an open-ended commitment.',
      'How long depends on what is being treated. An articulation difficulty often resolves in a block or two. Language disorder, verbal dyspraxia and post-stroke aphasia are longer, and we say which you are looking at rather than letting you assume the shorter one.',
    ],
  },

  seenMost: {
    h2: 'What we see most of here',
    default: [
      'Late talking and unclear speech in the early years account for most of the caseload, with stammering, feeding difficulty and adult neurological work making up the rest.',
    ],
    'saket': [
      'From Saket the bulk is early years: two and three year olds with fewer words than expected, and four to six year olds whose speech is still hard for people outside the family to follow.',
      'School-age referrals here are more often about the social use of language than about pronunciation, which is a different piece of work and one that schools in this catchment are increasingly good at spotting.',
    ],
    'hauz-khas': [
      'From Hauz Khas and SDA we see proportionally more stammering than elsewhere, in school-age children and in adults who have managed it privately for years and want to work on it properly.',
      'The other distinctive group is adults after neurological illness, reaching us from the hospitals in this part of the city for aphasia, dysarthria and swallowing work.',
    ],
    'green-park': [
      'From Green Park the referrals are the youngest and the most straightforward: late talking, first flagged at a two-year check or by a nursery, where the main question is whether this is a delay that will close or a disorder that will not.',
      'Feeding and oral motor difficulty is the second cluster, and it is the one we ask families not to sit on, because coughing or distress when eating warrants prompt attention at any age.',
    ],
    'greater-kailash': [
      'From Greater Kailash the mix is broad, and the practical constraint is the journey. For families here we lean harder on the home programme and use online sessions between in-person reviews, which speech and language work tolerates better than most therapies.',
      'Adult work, particularly post-stroke, is a steady thread from this catchment.',
    ],
    'defence-colony': [
      'From Defence Colony and Jangpura we see a mix of early years work and adult neurological rehabilitation, the latter often following discharge from one of the hospitals nearby.',
      'Swallowing assessment is a recurring reason adults are referred here, and it is the part of the caseload where delay carries the most risk.',
    ],
    'vasant-kunj': [
      'Vasant Kunj brings a multilingual caseload, and that changes the first question. A child growing up with three languages is not delayed for being multilingual, and distinguishing an ordinary bilingual pattern from a genuine language disorder is a substantial part of the work here.',
      'The second group is children on autism programmes, where speech and language input runs alongside behaviour and occupational therapy in the same building.',
    ],
    'gurgaon': [
      'Gurugram families reach this service differently from every other one on the site, because there is no speech and language pathologist based at that centre. Most work online, and a good deal of speech and language therapy suits that well, particularly language work and parent-delivered practice.',
      'Where hands-on assessment is needed, particularly for feeding, swallowing or oral motor difficulty, families travel to one of our Delhi centres, and we say which is closer on the intake call rather than after you have booked.',
    ],
    'noida': [
      'Noida families run this service almost entirely online, and speech and language therapy is one of the better fits for that. Language work, parent coaching and much of articulation practice transfer well to video, and being in the child\u2019s own home is an advantage rather than a compromise.',
      'The exception is anything involving feeding, swallowing or oral motor control, which needs hands-on assessment and a trip to Malviya Nagar.',
    ],
    'delhi': [
      'Across both Delhi centres the caseload runs the full span: early language delay, unclear speech, stammering, feeding and oral motor work, autism-related communication, and adult neurological rehabilitation after stroke or with progressive conditions.',
      'The city-wide pattern is late referral for early language delay, usually after a year of wait-and-see. The advice to wait is sometimes right, and it is worth having someone qualified decide which case you are in.',
    ],
    'south-delhi': [
      'Across south Delhi early years work dominates: late talking, unclear speech, and the question of whether a delay is closing or not. Schools and paediatricians in this catchment refer earlier than average, which helps.',
      'Adult neurological rehabilitation is the second strand, reaching us from the hospitals across this part of the city for aphasia, dysarthria and swallowing difficulty.',
    ],
  },

  faqs: {
    'saket': [
      { q: 'My two year old has very few words. Should we wait?', a: 'Fewer than around fifty words at two is worth a conversation now. Waiting is sometimes right, but it should be a decision someone qualified makes.' },
      { q: 'How much of this depends on us?', a: 'A great deal. Ten minutes of daily practice at home outperforms the weekly session, because speech and language work is skill practice built by repetition.' },
      { q: 'Where would we go from Saket?', a: 'Our Malviya Nagar centre, one Yellow Line stop north of Saket metro, which runs inside Rainbow alongside the other therapies.' },
      { q: 'Is it about pronunciation or something else?', a: 'Both exist. School-age referrals from Saket are more often about the social use of language than pronunciation, and that is a different piece of work.' },
      { q: 'How much does speech therapy cost in Saket?', a: 'Quoted upfront on your free 15-minute intake call, and depends on the clinician and how often sessions run.' },
    ],
    'hauz-khas': [
      { q: 'My child stammers. Will it pass on its own?', a: 'Many early stammers do. One lasting more than six months, or that the child has become aware of, is worth assessing rather than waiting out.' },
      { q: 'Do you work with adults after a stroke?', a: 'Yes. Aphasia, dysarthria, voice and swallowing work after neurological illness is a steady part of the caseload from this catchment.' },
      { q: 'Can adults be treated for stammering?', a: 'Yes, and several people reach us having managed it privately for years and decided to work on it properly.' },
      { q: 'Where would we go from Hauz Khas?', a: 'Our Malviya Nagar centre, one Yellow Line stop south of Hauz Khas metro station.' },
      { q: 'How much does speech therapy cost in Hauz Khas?', a: 'You get the figure on the free 15-minute intake call, and it depends on the clinician and the frequency of sessions.' },
    ],
    'green-park': [
      { q: 'How late is too late to wait on late talking?', a: 'Fewer than around fifty words at two, or no word combinations by two and a half, is the point to get an opinion rather than wait longer.' },
      { q: 'My child coughs when drinking. Is that urgent?', a: 'It warrants prompt attention at any age. Feeding and swallowing difficulty is the part of this caseload where delay carries the most risk.' },
      { q: 'Is it a delay or a disorder?', a: 'That is exactly what the assessment answers. A delay closes with time and support; a disorder does not, and the two look similar early on.' },
      { q: 'Where would we go from Green Park?', a: 'Our Malviya Nagar centre, two Yellow Line stops south or straight down Aurobindo Marg.' },
      { q: 'How much does speech therapy cost in Green Park?', a: 'The figure comes on your free 15-minute intake call and depends on the clinician and how often sessions run.' },
    ],
    'greater-kailash': [
      { q: 'Can sessions be online to cut the travel?', a: 'Yes, and speech and language work tolerates that better than most therapies. We typically alternate online sessions with in-person reviews.' },
      { q: 'How much depends on practice at home?', a: 'Most of it. Ten minutes daily beats the weekly session, and for families travelling from GK we lean harder on the home programme by design.' },
      { q: 'Do you work with adults after a stroke?', a: 'Yes. Aphasia, dysarthria, voice and swallowing work is a steady thread from this catchment.' },
      { q: 'Where would we go from Greater Kailash?', a: 'Our Malviya Nagar centre via Outer Ring Road and Press Enclave Marg.' },
      { q: 'How much does speech therapy cost in Greater Kailash?', a: 'Quoted on the free 15-minute intake call before you commit, depending on clinician and frequency.' },
    ],
    'defence-colony': [
      { q: 'Do you take adult referrals after hospital discharge?', a: 'Yes, and it is a regular route from this catchment: aphasia, dysarthria and swallowing work following discharge from the hospitals nearby.' },
      { q: 'Is swallowing difficulty something you assess?', a: 'Yes, and promptly. It is the part of the caseload where delay carries the most risk, so say so when you call.' },
      { q: 'Where would we go from Defence Colony?', a: 'Our Malviya Nagar centre via Ring Road and Press Enclave Marg, where the other therapies also run.' },
      { q: 'How long is a course?', a: 'Typically blocks of eight to twelve weekly sessions followed by a review, rather than an open-ended commitment.' },
      { q: 'How much does speech therapy cost in Defence Colony?', a: 'You are told the figure on the free 15-minute intake call, depending on clinician and frequency.' },
    ],
    'vasant-kunj': [
      { q: 'My child is growing up with three languages. Is that causing the delay?', a: 'Multilingualism does not cause language disorder. Distinguishing an ordinary bilingual pattern from a genuine disorder is a substantial part of the work at this centre.' },
      { q: 'Can speech therapy run alongside other therapies?', a: 'Yes, and here it usually does. Speech and language input sits alongside behaviour and occupational therapy in the same building, so the clinicians coordinate directly.' },
      { q: 'Where is your Vasant Kunj centre?', a: 'C-7, Sector C, Pocket 5, in the basement of Grand Vasant Kunj, where the largest multidisciplinary team is based.' },
      { q: 'How much depends on practice at home?', a: 'Most of it. Ten minutes of daily practice outperforms the weekly session, because this is skill work built by repetition in ordinary settings.' },
      { q: 'How much does speech therapy cost in Vasant Kunj?', a: 'Quoted on your free 15-minute intake call, depending on the clinician and how often sessions run.' },
    ],
    'gurgaon': [
      { q: 'Is there a speech therapist at your Gurgaon centre?', a: 'No, and we would rather say so than have you find out after booking. Gurugram families work online or travel to one of our Delhi centres.' },
      { q: 'Does online speech therapy actually work?', a: 'For language work, parent coaching and much of articulation practice, yes, and being in your own home is an advantage rather than a compromise.' },
      { q: 'What needs to be done in person?', a: 'Anything involving feeding, swallowing or oral motor control needs hands-on assessment, and for that you would travel to a Delhi centre.' },
      { q: 'Which Delhi centre is closer from Gurgaon?', a: 'Usually Vasant Kunj. We confirm which on the intake call rather than leaving you to work it out.' },
      { q: 'How much does speech therapy cost?', a: 'Quoted on the free 15-minute intake call, depending on the clinician and whether sessions run online or in person.' },
    ],
    'noida': [
      { q: 'Can speech therapy be done online?', a: 'Most of it, yes, and it is one of the better fits for video. Language work, parent coaching and much of articulation practice transfer well.' },
      { q: 'What would we need to travel for?', a: 'Feeding, swallowing and oral motor difficulty, which need hands-on assessment. That means a trip to our Malviya Nagar centre.' },
      { q: 'Is there an eMbrace centre in Noida?', a: 'No. Online sessions run from wherever you are; in-person work is at Malviya Nagar in south Delhi.' },
      { q: 'How much depends on us at home?', a: 'A great deal. Ten minutes daily beats the weekly session, and online delivery makes that easier because the practice happens where you already are.' },
      { q: 'How much does online speech therapy cost?', a: 'Quoted upfront on your free 15-minute intake call, depending on the clinician and how often sessions run.' },
    ],
    'delhi': [
      { q: 'What ages do you work with?', a: 'The full span. A toddler with no words and an adult relearning speech after a stroke are both speech and language work, and both run at our Delhi centres.' },
      { q: 'My child is a late talker. Should we wait a year?', a: 'That advice is sometimes right. Late referral after a year of waiting is the clearest city-wide pattern we see, and it is worth having someone qualified decide.' },
      { q: 'Which Delhi centre would we use?', a: 'Vasant Kunj for south-west Delhi, Malviya Nagar for the Yellow Line corridor, where it runs inside Rainbow alongside the other therapies.' },
      { q: 'How long does a course run?', a: 'Typically blocks of eight to twelve weekly sessions followed by a review. Articulation work is often shorter; language disorder and aphasia are longer.' },
      { q: 'How much does speech therapy cost in Delhi?', a: 'You get the figure on your free 15-minute intake call, depending on the clinician and the frequency of sessions.' },
    ],
    'south-delhi': [
      { q: 'Which South Delhi centre is closer?', a: 'Malviya Nagar from Saket, Hauz Khas, Green Park, Greater Kailash and Defence Colony. Vasant Kunj from Vasant Vihar, Munirka, R.K. Puram and Safdarjung Enclave.' },
      { q: 'Do you treat adults as well as children?', a: 'Yes. Adult neurological rehabilitation after stroke or with progressive conditions is the second strand of this service across south Delhi.' },
      { q: 'My four year old is hard to understand. Is that normal?', a: 'By around four most children are intelligible to people outside the family. If yours is not, it is worth an assessment rather than more time.' },
      { q: 'How much depends on practice at home?', a: 'Most of it. Ten minutes of daily practice outperforms the weekly session, because skills are built by repetition in ordinary settings.' },
      { q: 'How much does speech therapy cost in South Delhi?', a: 'Quoted upfront on the free 15-minute intake call, depending on the clinician and how often sessions run.' },
    ],
    default: [
      { q: 'When should I be concerned about late talking?', a: 'Fewer than around fifty words at two, or no word combinations by two and a half, is the point to get an opinion rather than wait longer.' },
      { q: 'How much of the progress depends on practice at home?', a: 'Most of it. Ten minutes of daily practice outperforms the weekly session, because speech and language work is skill practice built by repetition.' },
      { q: 'Do you work with adults?', a: 'Yes. Aphasia, dysarthria, voice, fluency and swallowing difficulty after stroke or with progressive conditions are all part of this service.' },
      { q: 'Can sessions run online?', a: 'Much of it works well online. Anything involving feeding, swallowing or oral motor control needs hands-on assessment in person.' },
      { q: 'How much does speech therapy cost?', a: 'Quoted upfront on your free 15-minute intake call, depending on the clinician and how often sessions run.' },
    ],
  },
};

/**
 * Batch 10. Occupational therapy is the service families understand least
 * before they arrive, so these pages spend their opening on what it actually
 * is rather than on why to choose us. That framing alone separates it from
 * every other page in the set.
 *
 * COVERAGE NOTE FOR THE CLIENT: the clinician table lists one occupational
 * therapist, Dr Agrima Aggarwal, based at Vasant Kunj and Gurugram. The
 * partnership record separately states that occupational therapy is offered at
 * Rainbow, Malviya Nagar. Both are client-supplied and they are in tension. The
 * `coverage` entry below handles it honestly: it says OT runs at Malviya Nagar
 * and that the named therapist works from the other two centres, and points to
 * the intake call. Supply the Malviya Nagar occupational therapist's details
 * and this can be replaced with a named roster.
 */
SERVICES['occupational-therapy'] = {
  name: 'Occupational Therapy',
  noun: 'occupational therapy',
  keyword: 'occupational therapy',
  hub: '/occupational-therapy/occupational-therapy',
  hubName: 'Occupational Therapy Hub',

  coverage: {
    'malviya-nagar':
      'Occupational therapy runs at our Malviya Nagar centre inside Rainbow. The occupational therapist named on this site, Dr Agrima Aggarwal, works from our Vasant Kunj and Gurugram centres, so who you would see at Malviya Nagar is confirmed on the intake call rather than assumed here. If seeing a specific therapist matters to you, say so when you call and we will tell you which centre to book.',
  },

  partnersOverride: {
    'vasant-kunj': ['british-school', 'american-embassy-school', 'rainbow'],
    'gurgaon': ['pathways-gurgaon', 'medical-travel-company'],
    'delhi': ['rainbow', 'medical-travel-company'],
    'south-delhi': ['rainbow', 'american-embassy-school'],
    'saket': ['rainbow'],
    'hauz-khas': ['rainbow'],
    'green-park': ['rainbow'],
    'greater-kailash': ['rainbow'],
    'defence-colony': ['rainbow'],
    'noida': ['rainbow', 'medical-travel-company'],
    default: ['rainbow'],
  },
  partnerIntro: locality =>
    `Occupational therapy around ${locality.name} is usually part of something larger, and these are the settings it connects to.`,

  lede: locality =>
    `Occupational therapy in ${locality.name} is the least well understood service we offer, so it is worth starting with what it is: helping someone do the ordinary things a day is made of. Dressing, handwriting, eating, sitting still enough to learn, tolerating noise and touch. ` +
    `${locality.leadCentreSentence} It is not physiotherapy, and it is not tuition.`,

  cadence:
    'Weekly to begin with, often reducing as a home and school programme takes over. Occupational therapy is unusual in how much of it is environmental: changing a chair, a pencil grip, a routine or a classroom seat can matter more than another session. That means the useful measure of progress is not what happens in the gym here, it is whether mornings at home got easier.',

  whenRight: {
    h2: 'What occupational therapy actually addresses',
    paras: [
      'Broadly three things: fine motor and hand skills, sensory processing, and the practical independence that both feed into. A child may come because handwriting is illegible and leave with work on shoulder stability and pencil grip. Another comes because they cannot tolerate a school assembly and the work is about regulation and sensory strategy.',
    ],
    list: [
      'Handwriting that is slow, effortful, painful or illegible despite practice',
      'Strong reactions to noise, texture, clothing, food or touch that shrink daily life',
      'Difficulty with buttons, laces, cutlery, or self-care well past the usual age',
      'A child described as clumsy, who avoids playgrounds, bikes or ball games',
      'Difficulty settling to a task, where the underlying problem is regulation rather than attention',
    ],
    after: [],
    hubLink: 'Sensory processing, handwriting, fine motor skills and daily living each have their own page on our occupational therapy hub.',
  },

  firstAppointment: {
    h2: 'What the first appointment involves',
    paras: [
      'An assessment through observation and structured tasks rather than questionnaires: watching how a child moves, grips, balances, organises themselves and responds to sensory input, alongside a history from you about which parts of the day are hardest.',
      'You leave with a small number of goals framed as daily tasks rather than as abstractions, so the target is fastening a shirt or writing a paragraph without pain, not improving fine motor skills in general. Most of the plan is things to change at home and school.',
    ],
    list: [],
    after: [],
  },

  timelines: {
    h2: 'Fees and how long it runs',
    paras: [
      'Fees are quoted upfront on your intake call. Courses usually run in blocks of eight to twelve weekly sessions with a review at the end, and frequency often reduces once the home and school programme is doing the work.',
      'Progress is judged against the daily tasks written at the start. If a child is doing better in the therapy room and no better at home, that is a signal the plan needs to change rather than continue.',
    ],
  },

  seenMost: {
    h2: 'What we see most of here',
    default: [
      'Handwriting difficulty and sensory processing account for most referrals, with self-care independence and coordination making up the rest.',
    ],
    'saket': [
      'From Saket handwriting dominates, and it usually arrives as a school complaint about neatness or speed in the middle primary years. The underlying cause is rarely effort, and pressing a child to try harder at something mechanically difficult tends to make it worse.',
      'The second cluster is sensory, typically children who cannot manage assemblies, corridors or the noise of a large school day.',
    ],
    'hauz-khas': [
      'From Hauz Khas and SDA referrals skew older, where handwriting speed rather than legibility is the problem and exams are the pressure. That work overlaps with the accommodations question, and we say plainly when a report rather than more therapy is what is needed.',
      'Sensory work with older children and teenagers is the second strand, focused on independent strategy rather than adult-managed accommodation.',
    ],
    'green-park': [
      'From Green Park the referrals are the youngest, often four to seven, for coordination, self-care independence and early handwriting readiness. At this age a great deal is achieved by changing the task rather than drilling the child.',
      'Feeding and food texture difficulty is a recurring second reason, and it sits at the boundary with speech and language work, so the two are often assessed together.',
    ],
    'greater-kailash': [
      'From Greater Kailash the caseload is broad, and the journey shapes the plan: we front-load assessment, write a heavier home and school programme, and space the in-person sessions further apart than we would for a family living nearby.',
      'Sensory processing and handwriting are the two dominant reasons for referral.',
    ],
    'defence-colony': [
      'From Defence Colony and Jangpura we see a mix of school-referred handwriting work and sensory referrals that have come through a paediatrician or an existing therapy team.',
      'Consolidation is a recurring theme here, where a family already has several therapists and nobody has agreed what the priority actually is.',
    ],
    'vasant-kunj': [
      'Vasant Kunj is where our occupational therapist is based, and the caseload reflects the breadth: sensory processing, handwriting, fine motor work, daily living skills and early intervention, alongside occupational therapy input into autism programmes running in the same building.',
      'The international school catchment brings a particular version of the handwriting question, since expectations about script, speed and when cursive is introduced differ sharply between curricula.',
    ],
    'gurgaon': [
      'Gurugram is our other centre with an occupational therapist based on site, and the referrals skew young: sensory processing and regulation in preschool and early primary children, frequently as part of an autism programme.',
      'The second group is handwriting in primary-age children, usually flagged by schools with established learning support teams, which means the classroom picture is documented before we start.',
    ],
    'noida': [
      'Occupational therapy is the hardest of our services to deliver at distance, because it is hands-on and observational. Noida families should expect to travel for the assessment and for periodic reviews.',
      'What works between those is a written home programme with online coaching, and in occupational therapy the home programme carries more of the change than the sessions do, so this arrangement holds up better than it sounds.',
    ],
    'delhi': [
      'Across our Delhi centres the reasons for referral are handwriting, sensory processing, coordination and self-care independence, with occupational therapy input into autism and developmental programmes running alongside.',
      'The city-wide pattern is late referral for handwriting: children are told to practise more for two or three years before anyone asks why it is mechanically hard, by which point the child has usually decided they are bad at writing.',
    ],
    'south-delhi': [
      'Across south Delhi handwriting is the single commonest reason for referral, usually raised by schools in the middle primary years, with sensory processing close behind.',
      'The other pattern is older students where handwriting speed rather than legibility is the issue and exams are the pressure, which is as much an accommodations question as a therapy one.',
    ],
  },

  faqs: {
    'saket': [
      { q: 'What is the difference between occupational therapy and physiotherapy?', a: 'Physiotherapy works on movement and strength. Occupational therapy works on doing the ordinary tasks a day is made of: dressing, handwriting, eating, tolerating a noisy classroom.' },
      { q: 'School says my child should practise handwriting more. Is that right?', a: 'Rarely, if it is mechanically hard. Pressing a child to try harder at something physically difficult usually makes it worse rather than better.' },
      { q: 'Where would we go from Saket?', a: 'Our Malviya Nagar centre inside Rainbow, one Yellow Line stop north of Saket metro, where the other therapies also run.' },
      { q: 'How long does it take?', a: 'Usually blocks of eight to twelve weekly sessions with a review, and frequency often reduces once the home and school programme is doing the work.' },
      { q: 'How much does occupational therapy cost in Saket?', a: 'Quoted upfront on your free 15-minute intake call, depending on the therapist and how often sessions run.' },
    ],
    'hauz-khas': [
      { q: 'My child writes legibly but far too slowly for exams. Can you help?', a: 'Yes, and it is the commonest older-child referral here. Sometimes the answer is therapy and sometimes it is an accommodations report, and we say which.' },
      { q: 'Is occupational therapy only for young children?', a: 'No. Referrals from this catchment skew older, and work with teenagers focuses on independent strategy rather than adult-managed accommodation.' },
      { q: 'What does the assessment involve?', a: 'Observation and structured tasks rather than questionnaires: how a child moves, grips, balances and responds to sensory input, plus a history of which parts of the day are hardest.' },
      { q: 'Where would we go from Hauz Khas?', a: 'Our Malviya Nagar centre, one Yellow Line stop south of Hauz Khas metro station.' },
      { q: 'How much does it cost in Hauz Khas?', a: 'You get the figure on the free 15-minute intake call, depending on the therapist and the frequency of sessions.' },
    ],
    'green-park': [
      { q: 'My four year old cannot manage buttons or cutlery. Is that a concern?', a: 'It can be, and self-care independence is one of the commonest reasons children this age are referred from Green Park.' },
      { q: 'My child refuses most food textures. Whose job is that?', a: 'It sits at the boundary between occupational therapy and speech and language work, so we usually assess it jointly rather than sending you between two services.' },
      { q: 'Will you drill my child on the skill?', a: 'Usually not. At this age far more is achieved by changing the task, the tool or the routine than by repetition of something a child cannot yet do.' },
      { q: 'Where would we go from Green Park?', a: 'Our Malviya Nagar centre, two Yellow Line stops south or straight down Aurobindo Marg.' },
      { q: 'How much does it cost in Green Park?', a: 'The figure comes on your free 15-minute intake call, depending on the therapist and how often sessions run.' },
    ],
    'greater-kailash': [
      { q: 'Can we space sessions out given the journey?', a: 'Yes, and from GK we plan it that way: front-loaded assessment, a heavier home and school programme, and in-person sessions further apart.' },
      { q: 'Does a heavier home programme work as well?', a: 'In occupational therapy it often works better, because the change you are aiming for happens at home and school rather than in a therapy room.' },
      { q: 'What is the difference from physiotherapy?', a: 'Physiotherapy works on movement and strength. Occupational therapy works on doing the ordinary tasks a day is made of.' },
      { q: 'Where would we go from Greater Kailash?', a: 'Our Malviya Nagar centre via Outer Ring Road and Press Enclave Marg.' },
      { q: 'How much does it cost in Greater Kailash?', a: 'Quoted on the free 15-minute intake call before you commit, depending on therapist and frequency.' },
    ],
    'defence-colony': [
      { q: 'We already have several therapists. Do we need another?', a: 'Possibly not. Where a family has accumulated providers, agreeing what the priority actually is often does more than adding a service.' },
      { q: 'How is progress measured?', a: 'Against daily tasks written at the start. If a child improves in the therapy room and not at home, the plan changes rather than continues.' },
      { q: 'Where would we go from Defence Colony?', a: 'Our Malviya Nagar centre via Ring Road and Press Enclave Marg, where the other therapies also run.' },
      { q: 'What does occupational therapy actually address?', a: 'Fine motor and hand skills, sensory processing, and the practical independence both feed into: dressing, handwriting, eating, tolerating a noisy day.' },
      { q: 'How much does it cost in Defence Colony?', a: 'You are told the figure on the free 15-minute intake call, depending on therapist and frequency.' },
    ],
    'vasant-kunj': [
      { q: 'Is your occupational therapist based here?', a: 'Yes. Dr Agrima Aggarwal works from Vasant Kunj and Gurugram, and this centre carries the broadest occupational therapy caseload.' },
      { q: 'Our school uses a different script and expects cursive earlier. Does that matter?', a: 'It does. Expectations about script, speed and when cursive is introduced differ sharply between curricula, and the plan is written for the system you are in.' },
      { q: 'Can occupational therapy run alongside other therapies?', a: 'Yes, and here it usually does. Occupational therapy input into autism and developmental programmes runs in the same building as the rest.' },
      { q: 'Where is your Vasant Kunj centre?', a: 'C-7, Sector C, Pocket 5, in the basement of Grand Vasant Kunj.' },
      { q: 'How much does it cost in Vasant Kunj?', a: 'Quoted on your free 15-minute intake call, depending on the therapist and how often sessions run.' },
    ],
    'gurgaon': [
      { q: 'Is there an occupational therapist at the Gurgaon centre?', a: 'Yes. Dr Agrima Aggarwal works from Gurugram as well as Vasant Kunj, which is why sensory and regulation work is well established here.' },
      { q: 'My preschooler cannot cope with noise or crowds. Is that occupational therapy?', a: 'Often yes. Sensory processing and regulation in preschool and early primary children is the commonest referral to this centre.' },
      { q: 'Where is the Gurugram centre?', a: '710, DLF City Court, Mehrauli-Gurgaon Road, Sector 24, with Guru Dronacharya on the Yellow Line roughly 700 metres away.' },
      { q: 'Our school has flagged handwriting. What happens next?', a: 'An assessment through observation and structured tasks. Where a school has documented the classroom picture already, that makes the assessment faster.' },
      { q: 'How much does it cost in Gurgaon?', a: 'Quoted on the free 15-minute intake call before booking, depending on therapist and frequency.' },
    ],
    'noida': [
      { q: 'Can occupational therapy be done online?', a: 'Partly. The assessment and periodic reviews need to be hands-on and in person. Between those, a written home programme with online coaching works well.' },
      { q: 'Is a home programme really enough?', a: 'In occupational therapy it carries more of the change than the sessions do, because the goals are daily tasks at home and school rather than exercises in a clinic.' },
      { q: 'Is there an eMbrace centre in Noida?', a: 'No. In-person occupational therapy runs at our Malviya Nagar centre in south Delhi.' },
      { q: 'How often would we travel?', a: 'For the assessment and then for periodic reviews rather than weekly, which is why this arrangement holds up better than families expect.' },
      { q: 'How much does it cost?', a: 'Quoted upfront on your free 15-minute intake call, depending on the therapist and the mix of in-person and online sessions.' },
    ],
    'delhi': [
      { q: 'Which Delhi centre would we use?', a: 'Vasant Kunj, where our occupational therapist is based, or Malviya Nagar inside Rainbow where occupational therapy runs alongside the other therapies.' },
      { q: 'How is occupational therapy different from physiotherapy?', a: 'Physiotherapy works on movement and strength. Occupational therapy works on doing the ordinary tasks a day is made of, from dressing to handwriting.' },
      { q: 'School has said practise more for two years. Should we have come sooner?', a: 'Probably. Late referral for handwriting is the clearest city-wide pattern we see, and by then a child has usually decided they are bad at writing.' },
      { q: 'How is progress judged?', a: 'Against daily tasks written at the start. Improvement in the therapy room with none at home is a signal to change the plan.' },
      { q: 'How much does it cost in Delhi?', a: 'You get the figure on your free 15-minute intake call, depending on the therapist and how often sessions run.' },
    ],
    'south-delhi': [
      { q: 'Which South Delhi centre is closer?', a: 'Malviya Nagar from Saket, Hauz Khas, Green Park, Greater Kailash and Defence Colony. Vasant Kunj from Vasant Vihar, Munirka, R.K. Puram and Safdarjung Enclave.' },
      { q: 'Handwriting is the school\u2019s complaint. Is that an occupational therapy matter?', a: 'Usually yes, and it is the single commonest referral across south Delhi, generally raised in the middle primary years.' },
      { q: 'My teenager writes legibly but too slowly for exams. What then?', a: 'Sometimes therapy helps and sometimes an accommodations report is what is actually needed. We tell you which rather than selling you sessions.' },
      { q: 'What does the assessment involve?', a: 'Observation and structured tasks: how a child moves, grips, balances and responds to sensory input, plus a history of which parts of the day are hardest.' },
      { q: 'How much does it cost in South Delhi?', a: 'Quoted upfront on the free 15-minute intake call, depending on the therapist and frequency of sessions.' },
    ],
    default: [
      { q: 'What is the difference between occupational therapy and physiotherapy?', a: 'Physiotherapy works on movement and strength. Occupational therapy works on doing the ordinary tasks a day is made of: dressing, handwriting, eating, tolerating a noisy classroom.' },
      { q: 'What does it actually address?', a: 'Fine motor and hand skills, sensory processing, and the practical independence both feed into, with goals written as daily tasks rather than abstractions.' },
      { q: 'Will more handwriting practice fix it?', a: 'Rarely, if it is mechanically hard. Pressing a child to try harder at something physically difficult usually makes it worse rather than better.' },
      { q: 'How long does it take?', a: 'Usually blocks of eight to twelve weekly sessions with a review, and frequency often reduces once the home and school programme is doing the work.' },
      { q: 'How much does occupational therapy cost?', a: 'Quoted upfront on your free 15-minute intake call, depending on the therapist and how often sessions run.' },
    ],
  },
};

/**
 * Batch 11, the last. Special education is the only service in the set that is
 * education rather than therapy, and the page is built on the distinction
 * families most often get wrong: this is not tuition. Tuition re-teaches the
 * same material the same way, more slowly. Special education changes how it is
 * taught. That single contrast carries most of the differentiation.
 *
 * It is also the service where the school partnerships genuinely belong, since
 * the work is largely done in liaison with a school, so every locality here
 * carries school partners rather than clinical ones.
 *
 * COVERAGE NOTE FOR THE CLIENT: the clinician table lists one clinician doing
 * special education, Dhriti Dharana, at Vasant Kunj. The partnership record
 * separately states special education is offered at Rainbow, Malviya Nagar.
 * Handled honestly in `coverage` below. Supply the Malviya Nagar and Gurugram
 * special educators and these notes can be replaced with named rosters.
 */
SERVICES['special-education'] = {
  name: 'Special Education',
  noun: 'special education',
  keyword: 'special education',
  hub: '/schools-hub/schools',
  hubName: 'Schools Partnership Hub',

  coverage: {
    'malviya-nagar':
      'Special education runs at our Malviya Nagar centre inside Rainbow. The special educator named on this site, Dhriti Dharana, is based at Vasant Kunj, so who you would work with at Malviya Nagar is confirmed on the intake call rather than assumed here. Ask when you call and we will tell you before you book.',
    'gurugram':
      'Our special education work is based at the Delhi centres rather than at Gurugram. Gurugram families either travel to Vasant Kunj, which is a straight run up the Mehrauli-Gurgaon Road, or work with us online and through liaison with their school, which for this service carries more of the value than the room does.',
  },

  partnersOverride: {
    'vasant-kunj': ['british-school', 'american-embassy-school', 'ashoka'],
    'gurgaon': ['pathways-gurgaon', 'ashoka'],
    'delhi': ['british-school', 'woodstock', 'doon', 'rainbow'],
    'south-delhi': ['american-embassy-school', 'british-school', 'doon'],
    'saket': ['doon', 'rainbow'],
    'hauz-khas': ['woodstock', 'rainbow'],
    'green-park': ['rainbow', 'woodstock'],
    'greater-kailash': ['doon', 'lincoln'],
    'defence-colony': ['woodstock', 'lincoln'],
    'noida': ['ashoka', 'lincoln'],
    default: ['rainbow'],
  },
  partnerIntro: locality =>
    `This is the service where the schools we work with matter most, because most of the work happens in partnership with one. Around ${locality.name} those include:`,

  lede: locality =>
    `Special education in ${locality.name} is teaching, not therapy, and it is not tuition either. Tuition re-teaches the same material the same way, more slowly. Special education changes how it is taught, so that a child who cannot learn it one way can learn it another. ` +
    `${locality.leadCentreSentence} Most of the work is done alongside a school rather than instead of one.`,

  cadence:
    'Sessions run weekly or twice weekly, and unlike our therapy services a good deal of the value sits outside them, in what a school agrees to do differently. That means the liaison work matters as much as the teaching hours, and it is worth telling us on the intake call how willing your child\u2019s school is to adapt, because it changes what we aim at.',

  whenRight: {
    h2: 'When special education is the right answer',
    paras: [
      'It is the right answer when a child has the ability to learn the material and cannot access it the way it is being delivered. It is the wrong answer when the underlying issue has not been identified yet, which is why a good deal of this work follows an assessment rather than preceding one.',
    ],
    list: [
      'Years of extra tuition that has not closed the gap',
      'An assessment identifying dyslexia, dysgraphia, dyscalculia or an intellectual disability, with nobody teaching to it',
      'A child falling further behind each year despite understanding the ideas when they are explained aloud',
      'A school willing to adapt but unsure what to actually change',
    ],
    after: [],
    hubLink: 'How we work with schools directly is set out on our schools partnership hub.',
  },

  firstAppointment: {
    h2: 'How the work is planned',
    paras: [
      'It starts with a written baseline of what a child can currently do, taken from testing and from their actual schoolwork rather than from marks. From that we write an individualised education plan: a small number of targets, the methods that will be used, and a date on which it is reviewed.',
      'The teaching itself is structured and multisensory, particularly for literacy and number, which means material is presented through more than one channel and built in a deliberate sequence rather than assumed. Progress is measured against the plan, not against the class.',
    ],
    list: [],
    after: [],
  },

  timelines: {
    h2: 'Fees, review, and working with the school',
    paras: [
      'Fees are quoted upfront on your intake call and depend on frequency and on whether school liaison is part of the arrangement.',
      'Plans are reviewed on a set date, usually each term, against the targets written at the start. Special education is slower than families hope: it is skill building, and skills accumulate rather than arrive. We would rather set that expectation at the beginning than have you judge the first term against a hope nobody stated out loud.',
    ],
  },

  seenMost: {
    h2: 'What the work looks like here',
    default: [
      'Most of the work is structured literacy and numeracy teaching for children with an identified learning difficulty, alongside liaison with the school that teaches them the rest of the week.',
    ],
    'saket': [
      'From Saket the commonest starting point is a child with a recent assessment and a school willing to help but unclear what to change. A large part of the first term is translating a report into things a class teacher can actually do on a Tuesday.',
      'The second pattern is families arriving after years of tuition, where the useful message is that more hours of the same teaching was never going to work.',
    ],
    'hauz-khas': [
      'From Hauz Khas and SDA the work skews older, towards students who have compensated for years and hit a ceiling. At that age the teaching shifts towards strategy, study method and self-management rather than foundational literacy.',
      'Exam technique features heavily, and it overlaps with the accommodations question, so the two are usually planned together.',
    ],
    'green-park': [
      'From Green Park the referrals are the youngest, and the work is early structured literacy: phonics taught in a deliberate sequence, multisensory, at a pace set by mastery rather than by a syllabus.',
      'At this age the gap is small and closing it is realistic, which is the argument for not waiting until a child has decided they are bad at reading.',
    ],
    'greater-kailash': [
      'From Greater Kailash a fair share of the work is remote or blended, because the journey is long and special education tolerates that reasonably well when the school is actively involved.',
      'The other pattern is families seeking a second view on an existing school-based support plan that has not moved anything in a year.',
    ],
    'defence-colony': [
      'From Defence Colony and Jangpura a distinctive strand is boarding school students, where the teaching happens in the holidays and the term-time work is liaison with a learning support team we may never meet in person.',
      'Day school referrals here typically follow an assessment and centre on structured literacy.',
    ],
    'vasant-kunj': [
      'Vasant Kunj is where our special education work is based, and the caseload is the broadest: structured literacy and numeracy, individualised education plans, school liaison, and support for children on wider developmental programmes running in the same building.',
      'The international school catchment brings a specific version of the problem, where a child has moved between curricula and nobody is sure which gaps are difficulty and which are simply content never covered.',
    ],
    'gurgaon': [
      'Gurugram families work with us on this service from the Delhi centres or online, and for special education the online arrangement holds up better than it does for the hands-on therapies.',
      'What we see most from this catchment is children in schools that already have learning support teams, where our role is often less about teaching hours and more about writing a plan the school can run for the other four days.',
    ],
    'noida': [
      'Noida families run this service largely online and it is one of the better fits for that: structured literacy teaching works well over video, and the liaison with school happens by email regardless of where anyone is sitting.',
      'The commonest referral is a child with an identified difficulty whose school is willing but unsure what to change, which is a problem that can be solved substantially in writing.',
    ],
    'delhi': [
      'Across our Delhi centres the work is structured literacy and numeracy teaching, individualised education plans and school liaison, usually following an assessment that identified a specific difficulty.',
      'The city-wide pattern is years of tuition preceding the referral. It is worth saying plainly: if three years of extra teaching has not closed a gap, the problem is not the amount of teaching.',
    ],
    'south-delhi': [
      'Across south Delhi most referrals arrive with an assessment already done and a school that is willing to adapt, which is the best starting position this service can have.',
      'The work then divides between direct teaching, usually structured literacy, and the liaison that turns a report into specific classroom changes. The second half is the part families underestimate and schools value most.',
    ],
  },

  faqs: {
    'saket': [
      { q: 'How is this different from tuition?', a: 'Tuition re-teaches the same material the same way, more slowly. Special education changes how it is taught, so a child who cannot learn it one way can learn it another.' },
      { q: 'Our school wants to help but does not know what to change. Can you help with that?', a: 'That is much of the first term: translating a report into things a class teacher can actually do on a Tuesday.' },
      { q: 'We have had tuition for three years. Why has it not worked?', a: 'If three years of extra teaching has not closed the gap, the problem is not the amount of teaching. It is the method.' },
      { q: 'Where would we go from Saket?', a: 'Our Malviya Nagar centre inside Rainbow, one Yellow Line stop north of Saket metro. Who you work with is confirmed on the intake call.' },
      { q: 'How much does special education cost in Saket?', a: 'Quoted upfront on your free 15-minute intake call, depending on frequency and whether school liaison is included.' },
    ],
    'hauz-khas': [
      { q: 'My child is older and has coped until now. Is this still useful?', a: 'Yes. With older students the teaching shifts to strategy, study method and self-management rather than foundational literacy.' },
      { q: 'Does this connect to exam accommodations?', a: 'Closely, and from this catchment the two are usually planned together rather than pursued separately.' },
      { q: 'What is an individualised education plan?', a: 'A written baseline, a small number of targets, the methods being used and a set review date. Progress is measured against it, not against the class.' },
      { q: 'Where would we go from Hauz Khas?', a: 'Our Malviya Nagar centre, one Yellow Line stop south, or Vasant Kunj where the special education work is based.' },
      { q: 'How much does it cost in Hauz Khas?', a: 'You get the figure on the free 15-minute intake call, depending on frequency and whether school liaison is part of it.' },
    ],
    'green-park': [
      { q: 'My child is seven and reading is not coming. Is it too early for this?', a: 'No, it is close to the best time. The gap is still small, and closing it before a child decides they are bad at reading is realistic.' },
      { q: 'What does the teaching actually look like?', a: 'Structured and multisensory: phonics taught in a deliberate sequence, material presented through more than one channel, paced by mastery rather than by a syllabus.' },
      { q: 'Do we need an assessment first?', a: 'Usually. Teaching to an unidentified difficulty is guesswork, which is why a good deal of this work follows an assessment rather than preceding one.' },
      { q: 'Where would we go from Green Park?', a: 'Our Malviya Nagar centre, two Yellow Line stops south, or Vasant Kunj where this work is based.' },
      { q: 'How much does it cost in Green Park?', a: 'The figure comes on your free 15-minute intake call, depending on frequency and whether school liaison is included.' },
    ],
    'greater-kailash': [
      { q: 'Can this be done remotely given the journey?', a: 'Largely yes. Special education tolerates blended delivery reasonably well, particularly where the school is actively involved.' },
      { q: 'Our school already has a support plan that is not working. What now?', a: 'A second view on it is a common reason families come to us from GK. A plan that has moved nothing in a year usually needs different methods, not more hours.' },
      { q: 'How quickly should we expect progress?', a: 'Slower than most families hope. It is skill building, and skills accumulate rather than arrive, so plans are reviewed each term against written targets.' },
      { q: 'Where would we go from Greater Kailash?', a: 'Our Malviya Nagar centre via Outer Ring Road and Press Enclave Marg, or Vasant Kunj where the work is based.' },
      { q: 'How much does it cost in Greater Kailash?', a: 'Quoted on the free 15-minute intake call before you commit, depending on frequency and liaison.' },
    ],
    'defence-colony': [
      { q: 'Our child is at boarding school. Can this work?', a: 'Yes, and it is a distinctive strand here: teaching in the holidays, and liaison with the school learning support team during term.' },
      { q: 'How is this different from tuition?', a: 'Tuition re-teaches the same material the same way, more slowly. Special education changes how it is taught, and is planned against a written baseline.' },
      { q: 'Do we need an assessment first?', a: 'Usually, because teaching to an unidentified difficulty is guesswork. Most of this work follows an assessment rather than preceding one.' },
      { q: 'Where would we go from Defence Colony?', a: 'Our Malviya Nagar centre via Ring Road and Press Enclave Marg, or Vasant Kunj where this work is based.' },
      { q: 'How much does it cost in Defence Colony?', a: 'You are told the figure on the free 15-minute intake call, depending on frequency and whether liaison is included.' },
    ],
    'vasant-kunj': [
      { q: 'Is your special educator based here?', a: 'Yes. Dhriti Dharana is based at Vasant Kunj, and this centre carries the broadest special education caseload.' },
      { q: 'We have moved between curricula. Is the gap difficulty or missed content?', a: 'That is exactly the question we start with here, and separating the two changes the plan completely.' },
      { q: 'Can this run alongside other support?', a: 'Yes. Special education sits alongside the wider developmental programmes running in the same building, so the plans are written to fit together.' },
      { q: 'Where is your Vasant Kunj centre?', a: 'C-7, Sector C, Pocket 5, in the basement of Grand Vasant Kunj.' },
      { q: 'How much does it cost in Vasant Kunj?', a: 'Quoted on your free 15-minute intake call, depending on frequency and whether school liaison is part of the arrangement.' },
    ],
    'gurgaon': [
      { q: 'Is special education available at the Gurgaon centre?', a: 'Our special education work is based at the Delhi centres. Gurugram families travel to Vasant Kunj or work with us online and through school liaison.' },
      { q: 'Does online special education work?', a: 'For this service it holds up better than for the hands-on therapies. Structured teaching works over video and school liaison happens by email regardless.' },
      { q: 'Our school has a learning support team already. What would you add?', a: 'Often less teaching and more planning: writing something the school can run for the other four days rather than duplicating what they do.' },
      { q: 'Which Delhi centre is closer from Gurgaon?', a: 'Usually Vasant Kunj, a straight run up the Mehrauli-Gurgaon Road, and it is where this work is based.' },
      { q: 'How much does it cost?', a: 'Quoted on the free 15-minute intake call, depending on frequency and the balance of teaching and liaison.' },
    ],
    'noida': [
      { q: 'Can special education be done online?', a: 'Yes, and it is one of the better fits. Structured literacy teaching works well over video, and liaison with school happens by email regardless of location.' },
      { q: 'Is there an eMbrace centre in Noida?', a: 'No. In-person work runs at our Delhi centres, but for this service most Noida families work online throughout.' },
      { q: 'Our school is willing but unsure what to change. Can you help remotely?', a: 'Yes. That problem can be solved substantially in writing, which is why distance matters less here than for the hands-on therapies.' },
      { q: 'Do we need an assessment first?', a: 'Usually, because teaching to an unidentified difficulty is guesswork. Assessment testing does need to happen in person.' },
      { q: 'How much does it cost?', a: 'Quoted upfront on your free 15-minute intake call, depending on frequency and whether school liaison is included.' },
    ],
    'delhi': [
      { q: 'How is special education different from tuition?', a: 'Tuition re-teaches the same material the same way, more slowly. Special education changes how it is taught, planned against a written baseline and reviewed on a set date.' },
      { q: 'We have had years of tuition. Why has nothing changed?', a: 'If three years of extra teaching has not closed a gap, the problem is not the amount of teaching. That is the clearest city-wide pattern we see.' },
      { q: 'Which Delhi centre would we use?', a: 'Vasant Kunj, where this work is based, or Malviya Nagar inside Rainbow. Who you would work with is confirmed on the intake call.' },
      { q: 'Do you work with the school directly?', a: 'Yes, and it is often the more valuable half. Turning a report into specific classroom changes usually does more than the teaching hours alone.' },
      { q: 'How much does special education cost in Delhi?', a: 'You get the figure on your free 15-minute intake call, depending on frequency and whether liaison is part of it.' },
    ],
    'south-delhi': [
      { q: 'Which South Delhi centre is closer?', a: 'Malviya Nagar from Saket, Hauz Khas, Green Park, Greater Kailash and Defence Colony. Vasant Kunj, where this work is based, from Vasant Vihar, Munirka and R.K. Puram.' },
      { q: 'We already have an assessment. Is that enough to start?', a: 'It is the best starting position this service can have. The plan is written from the report plus your child\u2019s actual schoolwork.' },
      { q: 'Do you work with the school as well as the child?', a: 'Yes, and the liaison half is the part families underestimate and schools value most. It turns a report into specific classroom changes.' },
      { q: 'How quickly should we expect results?', a: 'Slower than most families hope. Skills accumulate rather than arrive, and plans are reviewed each term against written targets.' },
      { q: 'How much does it cost in South Delhi?', a: 'Quoted upfront on the free 15-minute intake call, depending on frequency and whether school liaison is included.' },
    ],
    default: [
      { q: 'How is special education different from tuition?', a: 'Tuition re-teaches the same material the same way, more slowly. Special education changes how it is taught, so a child who cannot learn it one way can learn it another.' },
      { q: 'Do we need an assessment first?', a: 'Usually. Teaching to an unidentified difficulty is guesswork, which is why most of this work follows an assessment rather than preceding one.' },
      { q: 'What is an individualised education plan?', a: 'A written baseline, a small number of targets, the methods being used and a set review date. Progress is measured against it, not against the class.' },
      { q: 'Do you work with my child\u2019s school?', a: 'Yes, and it is often the more valuable half of the work. Turning a report into specific classroom changes usually does more than teaching hours alone.' },
      { q: 'How much does special education cost?', a: 'Quoted upfront on your free 15-minute intake call, depending on frequency and whether school liaison is part of the arrangement.' },
    ],
  },
};

/* ------------------------------------------------------------------------- *
 * The nine two-city services: Delhi and Gurgaon pages only. The locality axis
 * matters less here (two pages, not ten); the service axis is what counts.
 * No `default` seenMost or faqs sets, because only two localities exist.
 *
 * Several are honest about coverage. Where the clinician table carries nobody
 * for a service at a centre, the page says so rather than implying a team that
 * is not documented.
 * ------------------------------------------------------------------------- */

SERVICES['physiotherapy'] = {
  name: 'Paediatric Physiotherapy',
  noun: 'paediatric physiotherapy', keyword: 'physiotherapy',
  hub: '/physiotherapy', hubName: 'physiotherapy',
  coverage: { 'gurugram': 'Our paediatric physiotherapist is based at Malviya Nagar inside Rainbow, not at Gurugram. Gurugram families travel in for assessment and review and run the home programme in between, which for physiotherapy carries most of the change anyway.' },
  partnersOverride: { 'delhi': ['rainbow', 'medical-travel-company'], 'gurgaon': ['rainbow'] },
  partnerIntro: locality => `Physiotherapy around ${locality.name} usually sits inside something larger, and these are the settings it connects to.`,
  lede: locality => `Paediatric physiotherapy in ${locality.name} is about movement: how a child holds themselves, gets around, and does the physical parts of an ordinary day. ${locality.leadCentreSentence} It is not occupational therapy, which works on tasks rather than on movement itself.`,
  cadence: 'Blocks of weekly sessions with a home programme between them, and the home programme is what moves things. Muscles respond to what happens most days, not to what happens on a Thursday, so we would rather set five minutes daily that you will actually do than twenty you will not.',
  whenRight: {
    h2: 'When physiotherapy is the right call',
    paras: ['Physiotherapy is for movement itself: tone, strength, balance, coordination and how a child gets from one position to another. Where the difficulty is with a task rather than with movement, occupational therapy is the better fit, and we say so on the intake call rather than take the booking.'],
    list: [
      'Not sitting, crawling or walking within the expected range, or a marked difference between the two sides of the body',
      'Low or high muscle tone affecting posture, feeding position or endurance',
      'Cerebral palsy, neurological conditions, or physical recovery after illness or surgery',
      'A child who tires far faster than peers in physical activity',
    ], after: [],
    hubLink: 'The clinical detail sits on our physiotherapy page.',
  },
  firstAppointment: {
    h2: 'What the first appointment involves',
    paras: ['A physical assessment of tone, range of movement, strength, posture, balance and how your child moves between positions, alongside a history of pregnancy, birth and milestones. You leave with a baseline and a home programme, and goals stated as things your child will be able to do rather than as measurements.'],
    list: [], after: [],
  },
  seenMost: {
    h2: 'What we see most of',
    'delhi': ['At Malviya Nagar, which runs inside Rainbow, physiotherapy sits alongside occupational therapy, speech therapy and paediatric care, so a child needing more than one is not sent on a fresh search for each. The commonest referrals are motor delay in the first two years and neurological conditions including cerebral palsy.'],
    'gurgaon': ['Gurugram families reach this service at Malviya Nagar, and the pattern is usually early motor delay picked up at a paediatric check, or a diagnosed neurological condition needing an ongoing programme. Because the journey is real, we weight the plan towards home exercises and space the reviews.'],
  },
  timelines: {
    h2: 'Fees and how long it runs',
    paras: ['Fees are quoted upfront on your intake call and depend on frequency. Courses run in blocks with a review at the end rather than open-ended.', 'How long depends on what is being treated. Recovery after an illness is finite. A neurological condition is a long-term programme that changes as a child grows, and we say that plainly at the start.'],
  },
  faqs: {
    'delhi': [
      { q: 'How is physiotherapy different from occupational therapy?', a: 'Physiotherapy works on movement itself: tone, strength, balance and coordination. Occupational therapy works on tasks, such as dressing, handwriting or tolerating a noisy room.' },
      { q: 'Where would we go in Delhi?', a: 'Our Malviya Nagar centre inside Rainbow, at FC-29 Geetanjali beside Malviya Nagar Metro Station Gate No. 1, where the other therapies also run.' },
      { q: 'My baby is not sitting yet. Is it too early to ask?', a: 'No. Motor delay in the first two years is the commonest reason children are referred to us, and early is better than certain.' },
      { q: 'How much of it depends on us?', a: 'Most of it. Muscles respond to what happens most days, so the home programme moves more than the weekly session does.' },
      { q: 'How much does physiotherapy cost in Delhi?', a: 'Quoted upfront on your free 15-minute intake call, depending on how often sessions run.' },
    ],
    'gurgaon': [
      { q: 'Is there a physiotherapist at the Gurgaon centre?', a: 'No. Our paediatric physiotherapist is based at Malviya Nagar inside Rainbow, so Gurugram families travel in for assessment and reviews.' },
      { q: 'Can we manage with fewer visits?', a: 'Usually yes. We weight the plan towards a home programme and space the reviews, which suits physiotherapy better than it would most therapies.' },
      { q: 'How is this different from occupational therapy?', a: 'Physiotherapy works on movement itself. Occupational therapy works on tasks. Our occupational therapist is based at Gurugram; our physiotherapist is not.' },
      { q: 'What happens at the first appointment?', a: 'A physical assessment of tone, range, strength, posture and balance, plus a history of pregnancy, birth and milestones, ending with a baseline and a home programme.' },
      { q: 'How much does physiotherapy cost?', a: 'Quoted upfront on your free 15-minute intake call, depending on how often sessions run.' },
    ],
  },
};

SERVICES['oral-motor-therapy'] = {
  name: 'Oral Motor Therapy', noun: 'oral motor therapy', keyword: 'oral motor therapy',
  hub: '/oral-motor-therapy', hubName: 'oral motor therapy',
  coverage: { 'gurugram': 'Oral motor and feeding work needs hands-on assessment and our speech and language pathologist is based at the Delhi centres, not at Gurugram. Gurugram families travel to Malviya Nagar or Vasant Kunj for this, and we will tell you which is closer on the intake call.' },
  partnersOverride: { 'delhi': ['rainbow'], 'gurgaon': ['rainbow'] },
  partnerIntro: locality => `Feeding and oral motor work around ${locality.name} usually runs alongside other services, and these are the settings involved.`,
  lede: locality => `Oral motor therapy in ${locality.name} works on the muscles and coordination used for eating, drinking and speaking. ${locality.leadCentreSentence} If your child coughs, gags or distresses when eating, that is worth an appointment promptly rather than eventually.`,
  cadence: 'Weekly to start, often reducing quickly once a home routine is established. Feeding work is unusual in that progress is measured at your own table rather than in our room, and mealtimes happen several times a day, which is where the repetition comes from.',
  whenRight: {
    h2: 'When oral motor therapy helps',
    paras: ['This sits between speech and feeding, because the same muscles do both. It is worth an assessment when eating, drinking or speech sounds are affected by how the mouth is working rather than by what a child understands or intends.'],
    list: [
      'Coughing, gagging or distress during meals, which warrants prompt attention at any age',
      'A very narrow range of accepted foods or textures, beyond ordinary fussiness',
      'Drooling well past the usual age, or an open mouth posture',
      'Speech sounds that are unclear because of tongue, lip or jaw movement rather than language',
      'Feeding difficulty after cleft repair, or with cerebral palsy or low tone',
    ], after: [],
    hubLink: 'The clinical detail sits on our oral motor therapy page.',
  },
  firstAppointment: {
    h2: 'What the first appointment involves',
    paras: ['An assessment of the structures and their movement, and wherever possible watching your child actually eat or drink, because that shows things a clinic task will not. We take a feeding history and check what has already been tried. You leave with a plan aimed at mealtimes, not at exercises for their own sake.'],
    list: [], after: [],
  },
  seenMost: {
    h2: 'What we see most of',
    'delhi': ['At Malviya Nagar the commonest referrals are restricted food ranges in toddlers, feeding difficulty in children with cerebral palsy or low tone, and support after cleft lip and palate repair. Because it runs inside Rainbow, a child needing paediatric input as well is not sent to a second address.'],
    'gurgaon': ['Gurugram families reach this at our Delhi centres, and the commonest reason is a toddler with a very narrow range of accepted foods where ordinary fussiness has been ruled out, or unclear speech traced to tongue and jaw movement rather than to language.'],
  },
  timelines: {
    h2: 'Fees and how long it runs',
    paras: ['Fees are quoted upfront on your intake call. Blocks are usually shorter than for other therapies, because once a home routine is working the frequency drops quickly.', 'Feeding work tied to a structural or neurological cause runs longer, and we say which of those you are looking at rather than letting you assume the shorter one.'],
  },
  faqs: {
    'delhi': [
      { q: 'My child coughs when drinking. How urgent is that?', a: 'Promptly rather than eventually. Coughing, gagging or distress during meals warrants attention at any age, so say so when you call.' },
      { q: 'Is this fussy eating or something more?', a: 'That is what the assessment answers. A very narrow range of accepted textures, as opposed to disliked foods, points to the mechanics rather than to preference.' },
      { q: 'Where would we go in Delhi?', a: 'Our Malviya Nagar centre inside Rainbow, or Vasant Kunj. Both have a speech and language pathologist, and we will say which suits you.' },
      { q: 'Do you watch my child eat?', a: 'Wherever possible, yes. Watching an actual meal shows things a clinic task never will, so bring food your child normally eats.' },
      { q: 'How much does oral motor therapy cost in Delhi?', a: 'Quoted upfront on your free 15-minute intake call, depending on the clinician and how often sessions run.' },
    ],
    'gurgaon': [
      { q: 'Is oral motor therapy available at the Gurgaon centre?', a: 'No. It needs hands-on assessment and our speech and language pathologist is based at the Delhi centres, so this is one you would travel for.' },
      { q: 'Which Delhi centre is closer from Gurgaon?', a: 'Usually Vasant Kunj. We confirm on the intake call rather than leaving you to work it out.' },
      { q: 'Can any of it be done online?', a: 'Review and coaching between visits, yes. The assessment itself needs to be in person, because feeding is watched rather than described.' },
      { q: 'Is this fussy eating or something more?', a: 'The assessment answers that. A very narrow range of accepted textures, rather than disliked foods, points to the mechanics rather than to preference.' },
      { q: 'How much does oral motor therapy cost?', a: 'Quoted upfront on your free 15-minute intake call, depending on the clinician and how often sessions run.' },
    ],
  },
};

SERVICES['aba-therapy'] = {
  name: 'Behaviour Therapy', noun: 'behaviour therapy', keyword: 'ABA therapy',
  hub: '/aba-therapy', hubName: 'behaviour therapy',
  coverage: { 'gurugram': 'Our behaviour therapy team is based at the Delhi centres. Gurugram families work with us there, or run a parent-delivered programme with online coaching, which for behaviour work is not a lesser option: most of the change happens at home regardless of where the sessions are.' },
  partnersOverride: { 'delhi': ['rainbow', 'atypical-advantage'], 'gurgaon': ['medical-travel-company', 'atypical-advantage'] },
  partnerIntro: locality => `Behaviour work around ${locality.name} usually forms part of a wider programme, and these are the settings it connects to.`,
  lede: locality => `Behaviour therapy in ${locality.name} starts from a question rather than a technique: what is this behaviour achieving for the child? ${locality.leadCentreSentence} Behaviour that looks baffling is almost always doing a job, and the useful work is finding a better way for that job to get done.`,
  cadence: 'Sessions are weekly or twice weekly, with parent training running alongside from the start rather than added later. Behaviour changes where it happens, which is at home and at school, so a programme nobody can run between sessions will not work however well designed it is.',
  whenRight: {
    h2: 'When behaviour therapy is the right approach',
    paras: ['It suits behaviour that is frequent, entrenched and getting in the way of learning, safety or family life. It is the wrong starting point when nobody has yet asked why the behaviour is happening, which is why our work begins with observation rather than with a plan.'],
    list: [
      'Behaviour that has not shifted with ordinary parenting approaches over months',
      'Aggression or self-injury, which we would see promptly',
      'Difficulty with transitions, routines or waiting that limits what a family can do',
      'Skills a child could learn but has not, where teaching needs to be broken down',
    ], after: [],
    hubLink: 'The clinical detail sits on our behaviour therapy page.',
  },
  firstAppointment: {
    h2: 'How a programme is built',
    paras: ['Observation first, then a written account of what typically comes before the behaviour, what the behaviour is, and what follows it. From that we agree a small number of targets, the strategies to be used, and how progress will be recorded so it is judged on data rather than on impression.', 'Parent training runs alongside, because you are the person who will be there when it happens.'],
    list: [], after: [],
  },
  seenMost: {
    h2: 'What we see most of',
    'delhi': ['At our Delhi centres behaviour therapy usually forms part of a wider autism or developmental programme rather than standing alone, which is why it sits alongside speech and language and occupational therapy in the same building. The commonest targets are communication as an alternative to distressed behaviour, transitions, and self-care routines.'],
    'gurgaon': ['Gurugram families most often reach us for behaviour work through an autism programme, and the arrangement is usually a parent-delivered plan with online coaching plus periodic visits to Delhi. Behaviour that is difficult at home responds to what happens at home, which is why this works better than the distance suggests.'],
  },
  timelines: {
    h2: 'Fees, review, and what we will not promise',
    paras: ['Fees are quoted upfront on your intake call and depend on frequency and on whether parent training runs separately.', 'Progress is reviewed against recorded data on a set date. We will not promise a number of hours or an outcome, and we would be cautious about anyone who does. Where a behaviour is serving a purpose, the honest goal is a better route to that purpose, not simple suppression of it.'],
  },
  faqs: {
    'delhi': [
      { q: 'Is this ABA?', a: 'It draws on applied behaviour analysis principles, delivered as part of a wider programme rather than as an intensive standalone package, and always alongside parent training.' },
      { q: 'Why does the first session involve watching rather than doing?', a: 'Because behaviour that looks baffling is almost always achieving something. A plan written before anyone knows what it is achieving tends not to hold.' },
      { q: 'How many hours will my child need?', a: 'We will not give you a number before we have seen your child, and we would be cautious about anyone who does. It depends entirely on the targets.' },
      { q: 'Where would we go in Delhi?', a: 'Vasant Kunj, or Malviya Nagar inside Rainbow, where behaviour therapy sits alongside speech and language and occupational therapy.' },
      { q: 'How much does behaviour therapy cost in Delhi?', a: 'Quoted upfront on your free 15-minute intake call, depending on frequency and whether parent training runs separately.' },
    ],
    'gurgaon': [
      { q: 'Is behaviour therapy available at the Gurgaon centre?', a: 'Our behaviour therapy team is based at the Delhi centres. Gurugram families travel in, or run a parent-delivered programme with online coaching.' },
      { q: 'Does a parent-delivered programme work as well?', a: 'For behaviour work it often works better, because behaviour changes where it happens. Most of the change occurs at home regardless of where sessions are held.' },
      { q: 'My child is aggressive at home. How quickly can we be seen?', a: 'Aggression and self-injury we would see promptly. Say so on the intake call and we will prioritise it.' },
      { q: 'How is progress measured?', a: 'Against recorded data on a set review date, so it is judged on what was actually counted rather than on anyone\u2019s impression of a good week.' },
      { q: 'How much does behaviour therapy cost?', a: 'Quoted upfront on your free 15-minute intake call, depending on frequency and whether parent training runs separately.' },
    ],
  },
};

SERVICES['child-development-centre'] = {
  name: 'Child Development Centre', noun: 'child development services', keyword: 'child development centre',
  hub: '/child-development-centre', hubName: 'child development centre',
  partnersOverride: { 'delhi': ['rainbow', 'british-school', 'american-embassy-school', 'sukoon'], 'gurgaon': ['pathways-gurgaon', 'medical-travel-company', 'sukoon'] },
  partnerIntro: locality => `A child development centre is only as good as what it connects to, and around ${locality.name} that includes:`,
  lede: locality => `A child development centre in ${locality.name} is not a service so much as an address: the place where assessment and every therapy a child might need after it sit under one roof, so a family is not sent on a fresh search each time something new is identified. ${locality.leadCentreSentence}`,
  cadence: 'The point of a centre rather than a list of separate providers is that appointments can be grouped. A child needing three disciplines can often be seen on one day rather than three, and the clinicians can speak to each other about your child without you having to carry messages between them.',
  whenRight: {
    h2: 'What a development centre is for',
    paras: ['Children rarely have difficulty in only one area. A child referred for late speech often turns out to have sensory difficulties too; a child referred for behaviour often has an unidentified learning difficulty underneath. A centre exists so that the second and third question can be answered by the same team that answered the first.'],
    list: [
      'Developmental assessment across communication, motor, cognitive, social and self-care skills',
      'Speech and language therapy, occupational therapy and physiotherapy',
      'Behaviour therapy, parent training and special education',
      'Psychological assessment for autism, ADHD and learning difficulties',
    ], after: [],
    hubLink: 'What each service involves is set out on our child development centre page.',
  },
  firstAppointment: {
    h2: 'How it starts',
    paras: ['With a free 15-minute intake call, then a developmental assessment that maps your child across all areas rather than only the one that prompted the call. That produces a written baseline you can measure against, and a plan naming which disciplines are involved, in what order, and when it will be reviewed.', 'Where nothing further is needed we say so. A centre that finds work for every child who walks in is not a centre worth trusting.'],
    list: [], after: [],
  },
  seenMost: {
    h2: 'What the centre does most of',
    'delhi': ['Our Malviya Nagar centre runs inside Rainbow Children\u2019s Hospital, which is the fullest version of this: assessment, occupational therapy, physiotherapy, speech therapy, behaviour therapy and special education at one address, with paediatric care in the same building. Vasant Kunj carries the largest psychology and therapy team.', 'The commonest route in is a paediatrician or a nursery raising a concern about speech or milestones in the first three years.'],
    'gurgaon': ['Our Gurugram centre carries psychology, assessment and occupational therapy on site, with speech and language therapy, physiotherapy and special education running from the Delhi centres or online. We map that out on the intake call rather than after you have committed, so you know from the start which parts involve a journey.', 'Referrals here skew young, most often from paediatricians and preschools.'],
  },
  timelines: {
    h2: 'Fees and how it is reviewed',
    paras: ['Fees are quoted upfront on your intake call, itemised by what the plan actually contains rather than as a bundle.', 'Plans are reviewed on a set date against the written baseline. The measure that matters is not how many disciplines are involved but whether the specific things you came about have changed.'],
  },
  faqs: {
    'delhi': [
      { q: 'What is a child development centre?', a: 'An address where assessment and the therapies that follow it sit under one roof, so a family is not sent on a fresh search each time something new is identified.' },
      { q: 'Which Delhi centre has the most services?', a: 'Malviya Nagar, which runs inside Rainbow Children\u2019s Hospital, so paediatric care sits alongside the therapies. Vasant Kunj carries the largest psychology and therapy team.' },
      { q: 'Do we have to use every service?', a: 'No. Where nothing further is needed we say so. A centre that finds work for every child who walks in is not one worth trusting.' },
      { q: 'Can appointments be on the same day?', a: 'Usually, and that is much of the point. A child needing three disciplines can often be seen on one day rather than across three.' },
      { q: 'How much does it cost?', a: 'Quoted upfront on your free 15-minute intake call, itemised by what the plan actually contains rather than as a bundle.' },
    ],
    'gurgaon': [
      { q: 'What is available at the Gurgaon centre?', a: 'Psychology, assessment and occupational therapy on site. Speech and language therapy, physiotherapy and special education run from our Delhi centres or online.' },
      { q: 'Will we be told upfront what involves travelling?', a: 'Yes. We map that out on the intake call rather than after you have committed, so you know from the start which parts mean a journey.' },
      { q: 'Where is the Gurugram centre?', a: '710, DLF City Court, Mehrauli-Gurgaon Road, Sector 24, with Guru Dronacharya on the Yellow Line roughly 700 metres away.' },
      { q: 'My child is two and not talking. Where do we start?', a: 'With a developmental assessment that maps all areas rather than only speech, because late talking frequently has company that nobody has looked for.' },
      { q: 'How much does it cost?', a: 'Quoted upfront on your free 15-minute intake call, itemised by what the plan contains rather than as a package.' },
    ],
  },
};

SERVICES['developmental-delay-treatment'] = {
  name: 'Developmental Delay Treatment', noun: 'developmental delay treatment', keyword: 'developmental delay treatment',
  hub: '/developmental-delay-treatment', hubName: 'developmental delay treatment',
  partnersOverride: { 'delhi': ['rainbow', 'medical-travel-company'], 'gurgaon': ['medical-travel-company', 'pathways-gurgaon'] },
  partnerIntro: locality => `Early intervention around ${locality.name} depends on the routes families arrive by, which include:`,
  lede: locality => `Developmental delay treatment in ${locality.name} begins with a question the word delay does not answer: delayed by what? ${locality.leadCentreSentence} Delay is a description of where a child is now, not a diagnosis and not a prediction, and the useful work is finding out what is making learning harder.`,
  cadence: 'Early intervention is time-sensitive in a way that little else we do is. The first three years carry more change than any period after them, so where there is doubt we would rather see a child early and tell you the picture is not yet clear than hold the appointment for a year to be sure.',
  whenRight: {
    h2: 'What counts as a delay worth acting on',
    paras: ['Milestone ranges are wide and children do not develop in straight lines. What matters is the size of the gap, whether it is widening or closing, and whether it affects everyday life. One area behind is a specific delay; two or more is usually described as global.'],
    list: [
      'No babbling, pointing or waving by twelve months',
      'Fewer than around six clear words by eighteen months, or no two-word phrases by two years',
      'Not walking independently by eighteen months, or a marked difference between the two sides',
      'Loss of a skill your child previously had, at any age, which always warrants a same-month appointment',
    ], after: [],
    hubLink: 'The full picture is on our developmental delay treatment page.',
  },
  firstAppointment: {
    h2: 'How treatment is decided',
    paras: ['With a developmental assessment across all five areas, because the answer changes the plan completely. Hearing loss, a language disorder, autism, an intellectual disability, a neurological condition and prematurity all present as delay in the early years and none of them want the same programme.', 'From there therapy is targeted rather than general, and parent coaching is part of the plan rather than an extra, because most of what changes happens in the hours we are not there.'],
    list: [], after: [],
  },
  seenMost: {
    h2: 'What we see most of',
    'delhi': ['At Malviya Nagar, inside Rainbow, the full early intervention team sits in one building, which matters here more than for any other service because delayed children frequently need two or three disciplines at once. Most referrals come from paediatricians in the first two years, usually about speech and motor milestones together.'],
    'gurgaon': ['Gurugram referrals skew very young and often arrive through preschools rather than paediatricians. Assessment, psychology and occupational therapy run on site; speech and language therapy and physiotherapy run from the Delhi centres or online, and we set that out before you commit rather than after.'],
  },
  timelines: {
    h2: 'Fees and how progress is judged',
    paras: ['Fees are quoted upfront on your intake call and depend on which disciplines the plan uses.', 'Progress is measured against the written baseline from the assessment, not against a milestone chart, because the question is whether your child is moving rather than whether they have caught up with an average. Reviews happen on a set date.'],
  },
  faqs: {
    'delhi': [
      { q: 'Is developmental delay a diagnosis?', a: 'No. It describes where a child is now, not why. The useful work is finding out what is making learning harder, because that changes the plan completely.' },
      { q: 'My child has lost words they used to say. What should we do?', a: 'Contact us this month. Regression at any age always warrants a prompt appointment rather than a period of watching.' },
      { q: 'Where would we go in Delhi?', a: 'Malviya Nagar inside Rainbow carries the full early intervention team in one building, which matters when a child needs two or three disciplines at once.' },
      { q: 'Will my child catch up?', a: 'Sometimes fully, sometimes partly, and nobody can tell you which at the outset. We measure against your child\u2019s own baseline rather than against an average.' },
      { q: 'How much does treatment cost in Delhi?', a: 'Quoted upfront on your free 15-minute intake call, depending on which disciplines the plan uses.' },
    ],
    'gurgaon': [
      { q: 'What runs at the Gurgaon centre?', a: 'Assessment, psychology and occupational therapy on site. Speech and language therapy and physiotherapy run from our Delhi centres or online.' },
      { q: 'My child is eighteen months and not walking. Too early to worry?', a: 'It is the point to ask rather than the point to worry. Early intervention is time-sensitive, and we would rather see you now and say the picture is unclear.' },
      { q: 'Is this the same as autism assessment?', a: 'No. Delay is the observation; autism is one of several possible explanations. The developmental assessment works out which explanation fits.' },
      { q: 'How much of the work falls to us?', a: 'A great deal, particularly at this age. Parent coaching is part of the plan rather than an extra, because most change happens in the hours we are not there.' },
      { q: 'How much does treatment cost?', a: 'Quoted upfront on your free 15-minute intake call, depending on which disciplines the plan uses.' },
    ],
  },
};

SERVICES['down-syndrome-treatment'] = {
  name: 'Down Syndrome Support', noun: 'Down syndrome support', keyword: 'Down syndrome treatment',
  hub: '/down-syndrome-treatment', hubName: 'Down syndrome support',
  partnersOverride: { 'delhi': ['rainbow', 'atypical-advantage'], 'gurgaon': ['medical-travel-company', 'atypical-advantage'] },
  partnerIntro: locality => `Support around ${locality.name} extends well past therapy hours, and these are the organisations involved.`,
  lede: locality => `Down syndrome support in ${locality.name} is a long relationship rather than a course of treatment, and the honest framing matters: nothing here treats Down syndrome. What therapy does is build skills, and children with Down syndrome build a great many of them. ${locality.leadCentreSentence}`,
  cadence: 'The pattern over years is intensive early, lighter later, with periodic returns at transition points: starting school, changing school, adolescence, and the move towards adult independence. Families often stop and restart with us, which is normal and expected rather than a failure of anything.',
  whenRight: {
    h2: 'What support usually covers',
    paras: ['Priorities shift with age. In the early years the work is motor development, feeding and first communication. In the school years it becomes literacy, numeracy and classroom access. In adolescence it turns towards independence, self-care and what comes after school.'],
    list: [
      'Physiotherapy for low muscle tone, motor milestones and posture',
      'Speech and language therapy, often including signing alongside speech in the early years',
      'Occupational therapy for fine motor, feeding and daily living skills',
      'Special education, including reading, which children with Down syndrome frequently learn well',
    ], after: [],
    hubLink: 'The detail sits on our Down syndrome support page.',
  },
  firstAppointment: {
    h2: 'How we start',
    paras: ['With an assessment across all areas and a conversation about what you actually want next, which is a different question from what a textbook would prioritise. Goals are written as things your child will do rather than as scores, and reviewed as they grow.', 'We will not offer a prognosis. The range of outcomes is wide, and confident predictions in either direction have done a great deal of harm to families.'],
    list: [], after: [],
  },
  seenMost: {
    h2: 'What we work on most',
    'delhi': ['At Malviya Nagar, inside Rainbow, physiotherapy, speech therapy, occupational therapy and special education sit alongside paediatric care, which matters here because children with Down syndrome commonly need several of those at once and have medical follow-up running in parallel.', 'The commonest early referrals are for feeding and motor development in the first year.'],
    'gurgaon': ['Gurugram families use assessment, psychology and occupational therapy on site, with physiotherapy, speech and language therapy and special education from our Delhi centres. Because this is a long relationship, we plan the geography once rather than renegotiating it every term.'],
  },
  timelines: {
    h2: 'Fees and the long view',
    paras: ['Fees are quoted upfront on your intake call and depend on which disciplines are involved and how often.', 'Over years the cost is not steady. Early intervention is the most intensive period; later years are frequently a review a term plus school liaison. We would rather set that expectation now than have you plan for a decade of weekly appointments that will not be needed.'],
  },
  faqs: {
    'delhi': [
      { q: 'Can therapy treat Down syndrome?', a: 'No, and we would be wary of anyone implying it can. What therapy does is build skills, and children with Down syndrome build a great many of them.' },
      { q: 'When should support start?', a: 'The first months, focused on feeding, motor development and early communication. Early intervention is where the most change is available.' },
      { q: 'Should we use signing as well as speech?', a: 'Often yes in the early years. It supports rather than replaces speech, and it gives a child a way to communicate while speech is still developing.' },
      { q: 'Where would we go in Delhi?', a: 'Malviya Nagar inside Rainbow, where physiotherapy, speech therapy, occupational therapy and special education sit alongside paediatric care.' },
      { q: 'How much does support cost in Delhi?', a: 'Quoted upfront on your free 15-minute intake call, depending on which disciplines are involved and how often.' },
    ],
    'gurgaon': [
      { q: 'What is available at the Gurgaon centre?', a: 'Assessment, psychology and occupational therapy on site. Physiotherapy, speech and language therapy and special education run from our Delhi centres.' },
      { q: 'Will my child learn to read?', a: 'Many children with Down syndrome do, and reading is often a relative strength. We would rather teach towards it than assume against it.' },
      { q: 'Do we need therapy every week forever?', a: 'No. The pattern is intensive early, lighter later, with returns at transition points. Planning for a decade of weekly appointments is planning for the wrong thing.' },
      { q: 'Can you give us a prognosis?', a: 'No. The range of outcomes is wide, and confident predictions in either direction have done a great deal of harm to families.' },
      { q: 'How much does support cost?', a: 'Quoted upfront on your free 15-minute intake call, depending on which disciplines are involved and how often.' },
    ],
  },
};

SERVICES['intellectual-disability-treatment'] = {
  name: 'Intellectual Disability Support', noun: 'intellectual disability support', keyword: 'intellectual disability treatment',
  hub: '/intellectual-disability-treatment', hubName: 'intellectual disability support',
  partnersOverride: { 'delhi': ['rainbow', 'atypical-advantage', 'sukoon'], 'gurgaon': ['atypical-advantage', 'sukoon'] },
  partnerIntro: locality => `Support around ${locality.name} reaches past the therapy room, particularly towards work and independence, through:`,
  lede: locality => `Intellectual disability support in ${locality.name} is about function rather than about a number. An IQ score sets a context; what actually decides a life is how much someone can do for themselves and how much the world around them adapts. ${locality.leadCentreSentence}`,
  cadence: 'This is measured in years and transitions rather than in courses. The heaviest periods are early childhood, the move into school, and adolescence into adulthood, and families commonly work with us in blocks around those rather than continuously.',
  whenRight: {
    h2: 'What support covers',
    paras: ['Two strands run together. One is assessment: establishing the profile properly, which matters because support and entitlements both depend on it being documented accurately. The other is teaching and adaptation, aimed at the specific things that would make daily life work better.'],
    list: [
      'Cognitive and adaptive assessment, covering daily living skills as well as reasoning',
      'Special education and functional academics aimed at use rather than at curriculum coverage',
      'Communication support, and occupational therapy for self-care and independence',
      'Family support, and guidance on school placement and what documentation is needed',
    ], after: [],
    hubLink: 'The detail sits on our intellectual disability support page.',
  },
  firstAppointment: {
    h2: 'Assessment first, and why it matters',
    paras: ['A proper assessment covers cognitive ability and adaptive functioning together, because the second predicts daily life far better than the first does. Two people with similar scores can live very differently depending on what they have been taught and what has been adapted around them.', 'On paperwork: what we provide is a clinical assessment. A disability certificate under the Rights of Persons with Disabilities Act is issued by a government medical board through its own process, and we explain that route rather than leaving you to discover it later.'],
    list: [], after: [],
  },
  seenMost: {
    h2: 'What we work on most',
    'delhi': ['At our Delhi centres the commonest work is assessment for school placement and documentation, followed by functional academics and daily living skills. Malviya Nagar runs inside Rainbow, so where a medical or genetic question sits alongside the developmental one, both are in the same building.'],
    'gurgaon': ['Gurugram families use assessment and psychology on site, with special education running from our Delhi centres or online. The commonest reason for contact is a school asking for documentation, or a family wanting the profile established properly before a placement decision.'],
  },
  timelines: {
    h2: 'Fees and how progress is judged',
    paras: ['Fees are quoted upfront on your intake call. Assessment is priced as one piece of work; ongoing support depends on frequency.', 'Progress is judged on daily function rather than on scores: whether someone can do more for themselves this year than last. That is the measure that changes a life, and it is the one we write goals against.'],
  },
  faqs: {
    'delhi': [
      { q: 'Does an IQ score decide what my child can do?', a: 'No. Adaptive functioning, meaning daily living skills, predicts real life far better. Two people with similar scores can live very differently.' },
      { q: 'Do we get a disability certificate from you?', a: 'No. Ours is a clinical assessment. The RPwD certificate is issued by a government medical board through its own process, which we explain on the call.' },
      { q: 'The school wants documentation. Can you provide it?', a: 'We can provide a clinical assessment naming the instruments, scores and specific recommendations, which is what most schools act on for placement and support.' },
      { q: 'Where would we go in Delhi?', a: 'Vasant Kunj or Malviya Nagar. Malviya Nagar runs inside Rainbow, which helps where a medical question sits alongside the developmental one.' },
      { q: 'How much does assessment cost in Delhi?', a: 'Quoted upfront on your free 15-minute intake call, priced as one piece of work covering testing, report and feedback.' },
    ],
    'gurgaon': [
      { q: 'What runs at the Gurgaon centre?', a: 'Assessment and psychology on site. Special education runs from our Delhi centres or online, and we say which before you book rather than after.' },
      { q: 'What is functional academics?', a: 'Teaching aimed at use rather than at covering a curriculum: money, time, reading for daily life, and the skills that make independence more likely.' },
      { q: 'How is progress measured?', a: 'On daily function rather than on scores. Whether someone can do more for themselves this year than last is the measure that changes a life.' },
      { q: 'Do we need this before a school placement decision?', a: 'It usually helps considerably. Establishing the profile properly first tends to produce better placement decisions than making them and assessing afterwards.' },
      { q: 'How much does assessment cost?', a: 'Quoted upfront on your free 15-minute intake call, priced as one piece of work covering testing, report and feedback.' },
    ],
  },
};

/**
 * The two medical services. The client's clinician table contains no doctors,
 * so neither page claims eMbrace employs a developmental paediatrician or a
 * paediatric neurologist. They explain what the role does, what our own team
 * can and cannot provide, and where the medical opinion actually comes from.
 *
 * FOR THE CLIENT: if eMbrace does have doctors in these roles, send their
 * details and both pages can name them, which would strengthen them a great
 * deal. Until then this is the honest version.
 */
SERVICES['developmental-pediatrician'] = {
  name: 'Developmental Paediatrics', noun: 'developmental paediatric care', keyword: 'developmental pediatrician',
  hub: '/developmental-pediatrician', hubName: 'developmental paediatrics',
  coverage: {
    'vasant-kunj': 'We should be straight about what we are. eMbrace is a psychology and therapy practice, and a developmental paediatrician is a doctor. Our team carries out the developmental and psychological assessment side of this work. Where a medical opinion, investigation or prescription is needed, that comes from a paediatrician rather than from us, and our Malviya Nagar centre runs inside Rainbow, which is the practical reason that referral is usually short.',
    'gurugram': 'eMbrace is a psychology and therapy practice rather than a medical one, and a developmental paediatrician is a doctor. We carry out the developmental and psychological assessment; a medical opinion or prescription comes from a paediatrician. For Gurugram families that usually means we assess and then refer, and we say so on the intake call rather than after you have booked.',
  },
  partnersOverride: { 'delhi': ['rainbow', 'sukoon'], 'gurgaon': ['sukoon', 'medical-travel-company'] },
  partnerIntro: locality => `Because this work spans medical and developmental care, who we connect to around ${locality.name} matters:`,
  lede: locality => `Developmental paediatrics in ${locality.name} sits where medicine and development meet: milestones, growth, and the medical questions that can sit underneath a developmental difficulty. ${locality.leadCentreSentence} This page is clear about which parts of that we do ourselves and which need a doctor.`,
  cadence: 'Developmental assessment with us is a small number of appointments rather than an ongoing commitment. Where a medical review is needed alongside it, that runs on its own schedule, and we would rather coordinate the two than have you manage two unconnected processes.',
  whenRight: {
    h2: 'What this work covers',
    paras: ['The developmental question is whether a child is progressing as expected across communication, motor, cognitive, social and self-care skills, and if not, why. Some of the answers are developmental, which is our work. Some are medical, which is not.'],
    list: [
      'Milestones delayed in one area or several, where the cause has not been established',
      'Regression, meaning loss of skills previously held, which needs prompt medical as well as developmental review',
      'Developmental concerns alongside prematurity, a genetic condition or a birth complication',
      'A developmental difficulty where a medical explanation has not yet been excluded',
    ], after: [],
    hubLink: 'The clinical detail sits on our developmental paediatrics page.',
  },
  firstAppointment: {
    h2: 'What we do, and what we refer',
    paras: ['We do the developmental assessment: mapping a child across all areas, producing a written baseline, and identifying which therapies would help. That is the majority of what most families need and it does not require a doctor.', 'We do not prescribe, investigate or diagnose medical conditions. Where the picture suggests one, we say so and point you to the right medical service rather than working around it.'],
    list: [], after: [],
  },
  seenMost: {
    h2: 'What we see most of',
    'delhi': ['Most Delhi referrals are about early milestones, particularly speech and motor together, in the first three years. Because our Malviya Nagar centre runs inside Rainbow, families needing both the developmental assessment and a paediatric opinion can usually get them at one address rather than two.'],
    'gurgaon': ['Gurugram referrals typically arrive from paediatricians who have already raised a developmental concern and want it assessed properly. Our part is the assessment and the therapy plan that follows; medical follow-up stays with the referring doctor, which works better than duplicating it.'],
  },
  timelines: {
    h2: 'Fees and what to expect',
    paras: ['Fees are quoted upfront on your intake call and cover the developmental assessment, report and feedback. Any medical care sits outside that and is not ours to quote.', 'If what you need is a doctor rather than a psychologist, we will tell you on the free intake call, and you will not have paid us anything to find out.'],
  },
  faqs: {
    'delhi': [
      { q: 'Do you have a developmental paediatrician on your team?', a: 'We are a psychology and therapy practice. We do the developmental and psychological assessment; a medical opinion or prescription comes from a paediatrician.' },
      { q: 'So what can you actually do?', a: 'Map your child across all developmental areas, produce a written baseline, and identify which therapies would help. That is most of what families need and needs no doctor.' },
      { q: 'How do we get the medical side?', a: 'Our Malviya Nagar centre runs inside Rainbow, which is the practical reason that referral is usually short rather than a fresh search.' },
      { q: 'My child has lost skills they used to have. What should we do?', a: 'Seek medical review promptly as well as developmental assessment. Regression at any age needs both, and quickly.' },
      { q: 'How much does the developmental assessment cost?', a: 'Quoted upfront on your free 15-minute intake call. It covers assessment, report and feedback; medical care sits outside it.' },
    ],
    'gurgaon': [
      { q: 'Is there a developmental paediatrician at the Gurgaon centre?', a: 'No. eMbrace is a psychology and therapy practice. We assess and plan therapy; medical opinion and prescription come from a paediatrician.' },
      { q: 'Will you tell us if we need a doctor instead?', a: 'Yes, on the free intake call, before you have paid us anything. We would rather say so than take a booking we cannot fully answer.' },
      { q: 'Our paediatrician referred us. What happens next?', a: 'We do the developmental assessment and the therapy plan; medical follow-up stays with your referring doctor, which works better than duplicating it.' },
      { q: 'What does the assessment cover?', a: 'Communication, motor, cognitive, social and self-care skills, producing a written baseline and a plan naming which therapies would help.' },
      { q: 'How much does it cost?', a: 'Quoted upfront on your free 15-minute intake call, covering assessment, report and feedback.' },
    ],
  },
};

SERVICES['pediatric-neurologist'] = {
  name: 'Paediatric Neurology Support', noun: 'paediatric neurology support', keyword: 'pediatric neurologist',
  hub: '/pediatric-neurologist', hubName: 'paediatric neurology support',
  coverage: {
    'vasant-kunj': 'To be clear about what this page is: a paediatric neurologist is a doctor, and eMbrace is a psychology and therapy practice. We do not employ one. What we do is the neurodevelopmental and psychological assessment that sits alongside neurological care, and the therapy that follows it. Our Malviya Nagar centre runs inside Rainbow, which is why families needing both are not making two separate searches. If it is a neurologist you need, say so on the intake call and we will tell you straight.',
    'gurugram': 'A paediatric neurologist is a doctor and eMbrace is a psychology and therapy practice, so we do not employ one. What we provide is neurodevelopmental and psychological assessment and the therapy that follows, alongside whichever neurologist is treating your child. If a neurologist is what you actually need, we will say so on the free intake call.',
  },
  partnersOverride: { 'delhi': ['rainbow', 'sukoon'], 'gurgaon': ['sukoon', 'medical-travel-company'] },
  partnerIntro: locality => `Neurological care and developmental care have to talk to each other, and around ${locality.name} that happens through:`,
  lede: locality => `If you are searching for a paediatric neurologist in ${locality.name}, the honest answer first: we are not one. ${locality.leadCentreSentence} What we provide is the neurodevelopmental assessment and therapy that runs alongside neurological care, and this page explains where the line sits.`,
  cadence: 'Where a child is under neurological care, our work runs in parallel rather than in sequence: assessment to establish a developmental baseline, then therapy that adjusts as the medical picture changes. Coordination matters more than frequency, and we would rather write to your neurologist than have you carry information between us.',
  whenRight: {
    h2: 'Where we fit alongside neurological care',
    paras: ['Neurological conditions in childhood frequently carry developmental, learning and behavioural consequences, and those are not medical questions. A child with epilepsy may have attention or memory difficulties; a child with cerebral palsy needs physiotherapy, communication support and school access. That is the work we do.'],
    list: [
      'Developmental and cognitive assessment where a neurological condition has been diagnosed',
      'Physiotherapy, occupational therapy and speech and language therapy for cerebral palsy and related conditions',
      'Learning and attention assessment where seizures or medication may be affecting school',
      'Family support, and help getting a school to understand what a diagnosis means day to day',
    ], after: [],
    hubLink: 'What each part involves is set out on our paediatric neurology support page.',
  },
  firstAppointment: {
    h2: 'What we assess, and what we do not',
    paras: ['We assess development, cognition, learning, attention and behaviour, and build a written baseline a neurologist can read alongside their own findings. We do not order scans, interpret EEGs, prescribe or manage medication.', 'If your child has not yet seen a neurologist and the picture suggests one is needed, we will say so plainly rather than starting a therapy programme around an unanswered medical question.'],
    list: [], after: [],
  },
  seenMost: {
    h2: 'What we see most of',
    'delhi': ['Most of this work in Delhi involves children already under neurological care: cerebral palsy, epilepsy and related conditions, referred for the developmental and therapy side. Because Malviya Nagar runs inside Rainbow, physiotherapy, occupational therapy and speech therapy sit close to the medical care rather than across the city from it.'],
    'gurgaon': ['Gurugram families usually come with a neurological diagnosis already made elsewhere and a question about what it means for learning and daily life. Assessment and occupational therapy run on site; physiotherapy and speech and language therapy run from our Delhi centres, which we set out before you commit.'],
  },
  timelines: {
    h2: 'Fees and coordination',
    paras: ['Fees are quoted upfront on your intake call and cover assessment and therapy. Neurological care is separate and not ours to quote.', 'With your consent we write to the doctor treating your child, because a developmental baseline is considerably more useful to a neurologist than a description of how the last few months have felt.'],
  },
  faqs: {
    'delhi': [
      { q: 'Do you have a paediatric neurologist?', a: 'No. A paediatric neurologist is a doctor and we are a psychology and therapy practice. We provide neurodevelopmental assessment and therapy alongside neurological care.' },
      { q: 'What can you do for a child with epilepsy?', a: 'Assess learning, attention and memory, which seizures or medication can affect, and support the school in understanding what it means day to day.' },
      { q: 'What about cerebral palsy?', a: 'Physiotherapy, occupational therapy, speech and language therapy and school access work, which at Malviya Nagar sit inside Rainbow alongside the medical care.' },
      { q: 'Will you talk to our neurologist?', a: 'With your consent, yes. A written developmental baseline is far more useful to a doctor than a description of how the last few months have felt.' },
      { q: 'How much does assessment cost in Delhi?', a: 'Quoted upfront on your free 15-minute intake call, covering assessment and feedback. Neurological care is separate and not ours to quote.' },
    ],
    'gurgaon': [
      { q: 'Is there a paediatric neurologist at the Gurgaon centre?', a: 'No, and we do not employ one anywhere. We provide neurodevelopmental assessment and therapy alongside whichever neurologist is treating your child.' },
      { q: 'We have a diagnosis. What would you add?', a: 'What it means for learning and daily life, which is usually the question a diagnosis leaves unanswered, plus the therapy that follows from it.' },
      { q: 'What runs at the Gurgaon centre?', a: 'Assessment and occupational therapy on site. Physiotherapy and speech and language therapy run from our Delhi centres, and we set that out before you commit.' },
      { q: 'We have not seen a neurologist yet. Should we?', a: 'If the picture suggests one is needed we will say so plainly, rather than starting a therapy programme around an unanswered medical question.' },
      { q: 'How much does assessment cost?', a: 'Quoted upfront on your free 15-minute intake call, covering assessment and feedback. Medical care sits outside it.' },
    ],
  },
};

module.exports = { CENTRES, CLINICIANS, PARTNERS, LOCALITIES, SERVICES };
