# Location Pages Rewrite: Phase 1 Brief

Working state for the pages in `locations/`. Phase 1 (research and outline) is **done**.
Phase 2 (writing) is **complete**: all 128 pages in `locations/` written and built.

Built with the `seo-content-workflow` skill, which gates writing behind an approved outline.

Last updated: 19 August 2026.

---

## 1. Where this stopped

Phase 1 is closed. All four blocking decisions were taken by the client on 18 August 2026:

- **Option A**, rewrite all 110 in place. See section 6, and the measured result in section 10.
- **No RCI wording anywhere.** The clinician table carries no RCI registration for any of the
  eleven clinicians, so credentials are described as supplied. "RCI-Certified" was removed from
  `generate-location-meta.js` (title suffixes and three service descriptions), where it had been
  sitting on 110 live pages.
- **Partners named in prose.** Client confirms written consent for all twelve.
- **Dr Supriya Malik as page-level clinical authority**, with the clinicians who actually work at
  the serving centre named beneath her.

**All 128 location pages are written and built**: the 110-page service and locality grid, plus
the 18 two-city pages for the nine newer services. See section 10 for the measured result.

### Where the content now lives

Do not hand-edit page bodies. The idiom follows `service-pages-content.js`:

| File | Role |
|---|---|
| `location-pages-content.js` | Authored content: centres, clinicians, partners, 10 locality profiles, service profiles |
| `generate-location-body.js` | Writes the article body between `LOCATION-BODY` markers. `--dry`, `--service <slug>` |

Optional per-service fields worth knowing: `cadence` is the paragraph on what the travel
commitment actually is for that service, `cadenceByLocality` overrides it where a locality
needs different wording, and a locality flagged `onlineFirst` (currently only Noida) suppresses
copy that assumes a regular in-person journey.

Run order after any content change:

```
node generate-location-body.js --service <slug>
node generate-location-meta.js
node generate-schema.js
node build.js
```

`generate-location-meta.js` now skips body rewriting on any page carrying `LOCATION-BODY`
markers, since those rewrites existed to patch the old templated copy and would corrupt authored
prose. It still maintains titles, descriptions, Open Graph, Twitter and the hero line everywhere.

---

## 2. What the research found

### The pages are near-duplicates of each other

Measured as literal prose overlap using 6-word shingles across all 5,995 page pairs, after
stripping schema, scripts and markup:

| Comparison | Overlap |
|---|---|
| `autism-assessment-in-defence-colony` vs `autism-therapy-in-defence-colony` | 75.5% |
| `autism-assessment-in-delhi` vs `autism-assessment-in-south-delhi` | 76.0% |
| `adhd-assessment-in-noida` vs `adhd-assessment-in-gurgaon` | 71.9% |
| `child-psychologist-in-saket` vs `child-counselling-in-saket` | 67.8% |
| Average across every pair | 29.8% |

Median page carries 531 words, most of it navigation menus. The genuinely unique prose on
`child-psychologist-in-saket` is one sentence plus four FAQs that answer nothing specific
("Yes, we offer professional child psychologist services at our Saket location").

Re-run this measurement any time with the shingle comparison described above; it is the fastest
way to prove whether a rewrite actually differentiated the pages.

### Three centres, ten locality pages

Confirmed from `contact-us.php`: Vasant Kunj, Gurugram (Sector 24, DLF City Court), and
Malviya Nagar. The ten locality pages cover delhi, south-delhi, saket, hauz-khas, green-park,
greater-kailash, defence-colony, vasant-kunj, gurgaon, noida. Eight of those ten have no centre.

Google's spam policies name this pattern, pages targeted at different regions that funnel users
to one page, as doorway abuse. Its canonicalization system can also cluster near-duplicates and
show only one, with re-evaluation after a fix taking up to two weeks.

### The competition is beatable

The SERP for these terms is directories (Practo, Lybrate, Justdial, Sulekha) plus hospital
pages. The one independent clinic page ranking for "psychologist Saket",
mentalwellnesscentre.com/psychologist-saket, carries roughly 250 to 300 words of prose, no
Saket-specific detail at all, and lists a Gurugram address on a page about Saket.

### The angle

Nobody in this SERP tells a Saket parent where they physically go, how long it takes to get
there, and what happens when they arrive. That is real, verifiable, and genuinely different for
every locality. It is the non-commodity angle this rewrite is built on.

---

## 3. Decisions already locked

- **Indian English**, not the skill's US English default. The site already uses counselling,
  behaviour, paediatrician, personalised. Confirmed by the client as the specified variant.
- **Fees**: never a number. The line is "quoted upfront on your intake call".
- **Free 15-minute intake call** is real and can be promised in copy. Confirmed by the client.
- **Makkar Hospital** removed from the appointment form location options. Rainbow Children's
  Hospital stays and is a real service point.
- **No em dashes** anywhere in any deliverable, per the skill.

---

## 4. Phase 1 outline

Worked example is `locations/child-psychologist-in-saket.php`. Same structure for every page,
with the variable map in section 5.

### SEO details block

| Field | Value |
|---|---|
| Meta Title | Child Psychologist in Saket \| eMbrace Malviya Nagar (51 characters) |
| Meta Description | Saket families see our RCI-certified child psychologists at eMbrace Malviya Nagar, one metro stop away. Book a free 15-minute intake call before you commit. (156 characters) |
| H1 | Child Psychologist in Saket |
| Primary Keyword | child psychologist in Saket |
| Secondary Keywords | child psychologist near Saket, child counselling Saket, RCI-certified child psychologist South Delhi |
| Search Intent | Commercial investigation moving into transactional |
| Schema Type | MedicalBusiness, Service, FAQPage, BreadcrumbList (generate-schema.js already handles this) |
| Authorship Anchor | Dr. Supriya Malik, plus the named clinician who actually sees families from this locality |

Meta title 50 to 60 characters, meta description 150 to 160, counted before use.

### Sections

**H1: Child Psychologist in Saket**
Open with the complete answer in the first two sentences: who this is for, which centre they go
to, how far it is. No preamble.

**H2: Which eMbrace centre Saket families use**
The differentiator. Named centre, full address, distance and travel time, metro line and stop,
parking. States plainly that the centre is in Malviya Nagar, not Saket. The honesty is the trust
signal, and it is also what defuses the doorway problem.

**H2: When a child psychologist is the right call**
Signs that warrant a consultation and the ones that usually do not, from research, not invented.

**H2: What happens at your first appointment**
The four-step intake, how long each stage takes, what to bring, who is in the room.

**H2: What we see most often**
Service-specific. The main lever separating sibling pages, so assessment pages and therapy pages
must diverge substantively here.

**H2: Who you would see**
Named clinicians at the serving centre, RCI registration, actual specialisms. **PENDING:**
clinician table, see section 7.

**H2: Fees and timelines**
"Quoted upfront on your intake call", plus realistic timelines for assessment and therapy.

**H2: Frequently asked questions**
Five questions sourced from real search behaviour, replacing the current four self-answering
ones. Each answer 20 to 35 words.

**H2: Book, or check first**
Single CTA plus the free screener band already injected on these pages by
`inject-lead-magnets.js`.

---

## 5. What varies per page, and from what real source

| Variable | Source | Genuinely distinct? |
|---|---|---|
| Serving centre, address, travel time, metro | Verifiable fact | Yes, across 10 localities |
| Service substance and conditions covered | Clinical | Yes, across 11 services |
| Named clinicians | Client, pending | Yes, and strong. Some therapists sit at one centre only, which is useful |
| School and provider partnerships | Client, pending | Strongest available differentiator, subject to permission |

Anything that cannot be traced to one of these is commodity content and will not differentiate
the page.

---

## 6. BLOCKING DECISION: Option A or Option B

**Option A. Rewrite all 110 in place.** Every page gets the structure above. Honest risk:
11 services times 10 localities still produces heavy sibling overlap even done well, because
"ADHD assessment in Saket" and "autism assessment in Saket" share most of their substance.

**Option B, recommended. Consolidate, then rewrite.** One substantial page per locality (10),
covering all services from that catchment, plus the existing service hubs which already target
the service queries. Redirect the other 100 into them. Fewer, deeper, genuinely distinct pages,
and the doorway exposure goes away.

**The question that decides it:** do these 110 pages currently earn impressions or clicks in
Search Console? If yes, Option B trades real traffic for durability and needs discussion. If
close to nothing, which the thin content suggests, Option B costs nothing.

---

## 7. Inputs still needed from the client

**Clinicians**, one row each:

| Name | Qualification | RCI registration | Specialism | Centres | Languages | Age groups |
|---|---|---|---|---|---|---|

Centres are Vasant Kunj, Gurugram, Malviya Nagar, Rainbow, Online. Multiple allowed. RCI number
only if they are happy publishing it, otherwise yes or no.

**School and provider partnerships**, one row each:

| Institution | Locality | What eMbrace actually does | Scale, only if real | Named publicly? |
|---|---|---|---|---|

The last column is load-bearing. Naming a school as a mental health partner needs their written
consent, and some will permit a logo but not a description. Anything without clear permission
stays off the page. Logos are worth having as a trust strip, but the sentence does the SEO work.

---

## 8. Rules that apply to every page written

From the skill, plus what this project has settled:

- Indian English. No em dashes.
- No fabricated claims, statistics, testimonials, outcomes or credentials. If a detail is not
  available, write around it rather than inventing something plausible.
- No placeholder text in finished pages. PENDING flags are allowed in outlines only.
- Health content, so extra care: no diagnostic claims, no guaranteed outcomes, point to a
  qualified professional rather than positioning the page as a substitute for one.
- Primary keyword in the first 100 words, appearing naturally 2 to 4 times. No stuffing.
- FAQ answers 20 to 35 words, questions sourced from real search behaviour, never invented.
- Each page must be substantively different from its siblings in sections, angle and depth, not
  just swapped on a service or locality name.
- Length follows what the page needs, not a word target. Most standalone pages land between 500
  and 1,200 words.

---

## 9. How to resume

1. Read this file.
2. Pick the next service from the batch list in section 10.
3. Author its profile in `SERVICES` in `location-pages-content.js`, including a `seenMost` entry
   per locality and a `faqs` set per locality. The generator refuses to write a page whose
   service is missing rather than emitting a templated stand-in, so a half-written service cannot
   reach the site by accident.
4. Run the four commands in section 1, then re-run the duplication measurement in section 2.
5. Verify with a local server before committing.

---

## 10. Phase 2 progress and the measured result

### Batches

| # | Service | Pages | State |
|---|---|---|---|
| 1 | `child-psychologist` | 10 | **Written** |
| 2 | `child-counselling` | 10 | **Written** |
| 3 | `teen-counselling` | 10 | **Written** |
| 4 | `adult-counselling` | 10 | **Written** |
| 5 | `adhd-assessment` | 10 | **Written** |
| 6 | `autism-assessment` | 10 | **Written** |
| 7 | `autism-therapy` | 10 | **Written** |
| 8 | `learning-disability-assessment` | 10 | **Written** |
| 9 | `speech-therapy` | 10 | **Written** |
| 10 | `occupational-therapy` | 10 | **Written** |
| 11 | `special-education` | 10 | **Written** |

### There are two axes, and they behave completely differently

Batch 2 made this clear and it should shape everything that follows.

**Service axis** (same locality, different service). The brief's baseline pair,
`child-psychologist-in-saket` vs `child-counselling-in-saket`, was 67.8%.

| Pair | Result |
|---|---|
| `child-psychologist` vs `child-counselling` | **50.7%** |
| `child-counselling` vs `teen-counselling` | **45.1%** |
| `child-psychologist` vs `teen-counselling` | **43.4%** |
| `child-psychologist` vs `adult-counselling` | **34.8%** |
| `child-counselling` vs `adult-counselling` | **35.0%** |
| `teen-counselling` vs `adult-counselling` | **37.3%** |
| `adult-counselling` vs `adhd-assessment` | **36.2%** |
| `teen-counselling` vs `adhd-assessment` | **38.5%** |
| `child-counselling` vs `adhd-assessment` | **39.1%** |
| `child-psychologist` vs `adhd-assessment` | **39.7%** |
| `autism-assessment` vs `adult-counselling` | **31.3%** |
| `autism-assessment` vs `child-psychologist` | **34.5%** |
| `autism-assessment` vs `adhd-assessment` | **35.1%** (untouched pair was 44.0%) |
| Mean of all ten therapy and ADHD pairs | **40.5%** |
| Control: `autism-assessment` vs `autism-therapy`, untouched | 75.5% |
| Control: `speech-therapy` vs `occupational-therapy`, untouched | 54.8% |
| Control: `adhd-assessment` vs `autism-assessment`, untouched | 44.0% |

Read the controls carefully. Untouched cross-service pairs range from 44% to 75.5%, so any
single control proves nothing on its own. The like-for-like comparison is the one the brief
named: `child-psychologist` vs `child-counselling` was 67.8% and is now 50.7%.
`teen-counselling` lands lower still against both siblings, despite `child-counselling`
being its nearest neighbour, which is the result that mattered for batch 3.

The control reproduces the brief's 75.5% figure exactly, which confirms the measurement here
matches the one in section 2. So the service axis genuinely improved, by 17 points.

It worked because the two pages were written to answer different questions. The psychologist page
is about working out what is going on; the counselling page is about the therapy hour itself,
what a parent is and is not told, and how a course ends. Neither borrows the other's sections. A
`cadence` field carries the one honest travel distinction: counselling is a weekly commitment,
seeing a psychologist is three appointments over a few weeks, and that changes what the journey
means from the same address.

**Locality axis** (same service, ten localities) barely moves, and that is structural. Within one
service the shared block is the service content, the clinician biographies, Dr Malik, the parking
note and the CTA. Cutting it helps until it starts removing things a reader needs.

### What batch 4 added, and what it got wrong twice

Adult counselling is the first service where the person reading the page is the person who will be
in the room. No parent, no school, no consent negotiation. That drove three changes worth keeping:

- **`partnersOverride` on a service.** School partnerships carry no weight on an adult page and
  corporate ones carry a great deal, so adult pages show WTW, Atypical Advantage, Sukoon and The
  Medical Travel Company instead of the schools. The partner sentences themselves are unchanged
  and worded PAN India, so this is a choice about what is useful to show, not a claim about where
  a partnership operates.
- **Service-aware clinician role and biography.** Dr Malik was being introduced on adult pages as
  Head of the Child Development Centre with a child-focused biography. She is now Founder and CEO
  there, described across the lifespan, which her supplied record supports. Child pages are
  unchanged.
- **Mannat Kaur Arora mapped to adult work**, on the same basis as teen: her record states adult
  OPD and IPD experience. Without her, Gurugram had no named adult clinician at all.

Two mistakes, both caught by measurement rather than by reading:

1. `partnersOverride` was first written as one flat list, which gave all ten adult pages the
   same four partner paragraphs and pushed the locality axis to **68.6%**, worse than the untouched
   baseline. It is now keyed by locality.
2. The shared sections were written long again, exactly as in batch 2. Trimming brought it to
   64.5%.

**Check the locality-axis number before declaring a batch done.** Three batches out of four have
regressed on first write and needed a trim pass. Budget for it.

### Batch 5: the first assessment service

ADHD assessment is structurally unlike the four therapy batches, and that did the differentiating:
it is finite rather than weekly, the deliverable is a written report rather than a course of
sessions, and it needs a third party because teacher rating scales are part of the process.

The most valuable thing on these pages is the paragraph about **what the report is accepted for**.
A good report supports classroom accommodations and most schools act on it. Formal board
concessions are separate: requirements differ by board and frequently involve a designated
government centre. The page says so and promises to explain the route, and it deliberately does
NOT claim our report satisfies any particular board, because that is not ours to promise. No
competitor in this SERP addresses it at all.

**Taranpreet Kaur added to assessment work**, on her supplied record of comprehensive
psychological assessment across intelligence, personality, symptomology and neuropsychological
testing with ICD-10 and DSM-5 diagnosis. Without her the Malviya Nagar assessment roster was one
name.

**It regressed on first write too, to 69.2%, and did not fully recover.** At 66.6% it remains the
highest of the five rewritten services. Two causes, both mine: the `timelines` section ran to four
paragraphs, and the locality FAQ sets reused near-identical wording for cost, board concessions
and school involvement. Trimming and rewording recovered 2.6 points. The rest is the same
structural floor as everywhere else.

A section-level diagnostic on these pages puts the byte-identical shared text at 27% for
`adhd-assessment` against 24% for `child-psychologist`, so the gap is not coming from one
runaway section. It is spread through phrasing that repeats inside sections which nominally vary,
particularly the six localities that share the Malviya Nagar centre and therefore share its
address, its Rainbow sentence and much of its roster. That is the floor, and grinding at it past
this point starts to cost readability.

### Batch 6: autism assessment, and the best service-axis result so far

The sibling to beat was `adhd-assessment`, since both are assessments ending in a report. Four
things separate them, and all four are real rather than presentational:

- **Method.** ADHD assessment leans on rating scales from several informants. Autism assessment
  leans on watching the child directly, through ADOS-2.
- **Age.** This starts from around eighteen months. ADHD assessment rarely starts before six.
- **Team.** A proper autism assessment needs communication and sensory profiles, so Upasna
  (speech and language) and Dr Agrima Aggarwal (occupational therapy) join the roster. That makes
  the named clinicians genuinely different from the ADHD roster at every centre, which no amount
  of rewriting could have achieved on its own.
- **Paperwork.** The ADHD page answers a question about board concessions. This one answers a
  different question about disability certification under the RPwD Act.

Results: **35.1%** against `adhd-assessment`, where the untouched pair measured 44.0%, and
**45.6%** against `autism-therapy` against a brief baseline of 75.5%. The second figure will
improve again at batch 7, since `autism-therapy` is not yet rewritten.

**ADOS-2** appears on all ten pages on the client’s explicit confirmation of 19 August 2026. The
clinician table lists ISAA and CARS and does not mention ADOS-2, so it is recorded in the content
module as client-attested rather than derived from that table. The site already carries a
dedicated /autism/ados-2-assessment page, which is consistent with the confirmation.

**On certification**, the pages say a clinical diagnosis is not a disability certificate, that the
RPwD certificate is issued by a government medical board through a separate process, and that we
explain that route. They do not claim to issue or guarantee one, because that is not ours to give.

Locality axis landed at 67.0%, in the same band as `adhd-assessment`. Both assessment services
sit two to four points above the four therapy services, and the section diagnostic puts the
byte-identical shared text at 29% before trimming and roughly 25% after, so the residue is
distributed phrasing rather than one fixable section.

### Phase 2 complete: the final numbers

All 110 pages written, 1,102 to 1,560 words each, mean 1,296. Every page carries five FAQs into
schema, no em dashes, no RCI wording, 110 unique titles and descriptions.

**The four pairs section 2 named as the worst offenders:**

| Pair | Was | Now |
|---|---|---|
| `autism-assessment` vs `autism-therapy`, Defence Colony | 75.5% | **51.8%** |
| `autism-assessment`, Delhi vs South Delhi | 76.0% | **70.3%** |
| `adhd-assessment`, Noida vs Gurgaon | 71.9% | **60.2%** |
| `child-psychologist` vs `child-counselling`, Saket | 67.8% | **48.3%** |
| Average across every pair | 29.8% | **19.1%** |

**Service axis**, all 55 rewritten pairs: mean **36.1%**, best 30.2%, worst 51.3%.

**Locality axis**, per service, ranges from 59.3% (`special-education`) to 67.0%
(`autism-therapy` and `autism-assessment`). The three services written last, after the
short-shared-sections rule was properly internalised, are the three best on this axis.

The conclusion from batch 2 holds unchanged at the end. The service axis was fixable and is
fixed, roughly halved. The locality axis moved a few points at best and has a floor around 60%,
because ten locality stories cannot fill 110 pages. Option B would remove that floor by
construction. Option A was the client's decision and the work is done to it.

### The nine two-city services, and a factual error found late

The last 18 pages (nine services with Delhi and Gurgaon pages only) are now authored in the same
model. `generate-service-pages.js` was guarded so it skips any page carrying a
`LOCATION-BODY` marker, otherwise a future run of it would silently discard the authored
bodies. It still owns the nine hub pages, which never carry the marker.

**Two of those nine are medical roles with no doctor in the clinician table.**
`developmental-pediatrician` and `pediatric-neurologist` do not claim eMbrace employs
one. They explain what the role does, state plainly that we are a psychology and therapy practice,
set out what we assess and what we refer, and say we will tell you on the free intake call if a
doctor is what you actually need. **If eMbrace does have doctors in these roles, send their
details and both pages can name them.**

**A factual error found during the final review, present since batch 1.** The lede computed
whether the centre was in the locality by comparing `locality.centre` against the locality
slug, which is only ever true for Vasant Kunj. The result was that **51 pages told readers we had
no centre where we do**: all 20 Gurgaon pages said “we do not have a centre in Gurgaon”, and the
Delhi and South Delhi pages said the same of a city containing both our Delhi centres. Now handled
as three cases rather than two. Worth noting how it survived: every spot check happened to land on
Saket, Noida or Vasant Kunj, which were all correct. Check Gurgaon, Delhi and South Delhi
explicitly in future.

### Reviewing locally

```
node build.js
node <scratchpad>/serve.js "<repo>/dist" 4173
```

The review server maps extensionless clean URLs onto the built .html files, which a plain static
server would 404 on. All 129 pages under /locations return 200, and sampled pages carry around 200
internal links each with none broken.

### Coverage gaps, stated on the pages rather than hidden

Three services are not staffed at every centre. Rather than let the generator fall back to a
vague reassurance, a `coverage` map states the position plainly on the affected page:

- **No speech and language pathologist at Gurugram.** The Gurgaon speech therapy page says so and
  points to the Delhi centres or online.
- **No occupational therapist listed at Malviya Nagar**, though the partnership record says
  occupational therapy runs at Rainbow. Both are client-supplied and in tension. The page says
  the service runs there and that who you would see is confirmed on the intake call.
- **Special education is based at Vasant Kunj only.** The Malviya Nagar and Gurugram pages say so.

**These three need client input.** Supply the Malviya Nagar occupational therapist and special
educator, and the Gurugram speech and language pathologist if one exists, and the coverage notes
can be replaced with named rosters, which would strengthen the pages considerably.

### The rule batch 2 had to relearn

Batch 2 first came in at **68.0%**, worse than the 63.1% the untouched `child-counselling` pages
scored, for exactly the reason batch 1 first came in at 75.1%: the shared sections were written
too long. Trimming them to the batch 1 standard brought it to 64.3%.

**Write the shared sections short from the start.** Everything general goes to the hub with a
link. If a shared section runs past roughly 120 words, it is costing more in duplication than it
returns in usefulness. This is the single most repeatable lesson so far.

### The duplication measurement, re-run

Same method as section 2: 6-word shingles, markup and schema stripped. Same service across the
ten localities, which is the brief's 76.0% baseline pair.

| Set | Average | Worst pair |
|---|---|---|
| Untouched services (10 pages each) | 60.8% to 69.8% | 67.3% to 76.9% |
| `child-psychologist`, first attempt | 75.1% | 82.6% |
| `child-psychologist`, current | **62.8%** | **69.5%** |
| `child-counselling`, first attempt | 68.0% | 72.9% |
| `child-counselling`, current | **63.9%** | **69.8%** |
| `teen-counselling`, current | **63.0%** | **70.4%** |
| `adult-counselling`, first attempt | 68.6% | 74.6% |
| `adult-counselling`, current | **64.5%** | **71.2%** |
| `adhd-assessment`, first attempt | 69.2% | 76.2% |
| `adhd-assessment`, current | **66.6%** | **73.8%** |
| `autism-assessment`, current | **67.0%** | **73.1%** |

`child-psychologist` moved from 60.5% to 63.2% when the `cadence` paragraph was added. That is a
deliberate trade: it costs on the locality axis and buys considerably more on the service axis,
which is where the larger duplication problem sat.

Two things are true and both matter.

The rewrite works in the sense that `child-psychologist` is now the least duplicative service in
the set, and its worst pair is below the worst pair of every untouched service. The first attempt
was **worse than the thin content it replaced**, at 75.1%, because 1,550-word pages carrying only
~300 words of locality-specific prose are more duplicative than 531-word pages, not less. The fix
was structural: general clinical guidance moved to the service hub with a link, clinician
biographies shortened to a credential line with the full version on `/about`, and FAQs authored
per locality rather than shared. That took the shared share of each page from roughly 80% to
roughly 50%.

With two batches done the verdict is split, and it is more useful than the single number after
batch 1 suggested.

**The service axis is fixable and has been fixed**, 67.8% down to 50.7%. Writing each service to
answer a genuinely different question works, and it should keep working across the remaining nine
services, which differ from each other at least as much as counselling differs from psychology.

**The locality axis has a floor of roughly 60% and no amount of writing quality moves it.** Within
one service, ten pages share the service content, the clinician biographies, Dr Malik, the parking
note and the CTA. What differs is the centre, the catchment, the caseload and the FAQs. That
ratio is fixed by arithmetic: ten locality stories cannot fill 110 pages.

So Option A gets roughly half of what the rewrite was for. Option B removes the locality-axis
problem by construction, because ten deep locality pages have no siblings to overlap with. The
decision to continue with Option A is the client's and it stands; batches 3 to 11 will be written
the same way. Worth revisiting if Search Console shows these pages clustering.

### Fixed along the way

- The literal word `null` was rendering inside the "More eMbrace services near you" link list on
  **106 pages**, because `generate-location-links.js` joined an array containing nulls for pages
  that do not exist. Fixed with a filter in all three call sites.

### Resolved with the client, 19 August 2026

- **ADOS-2 stays.** It was queried because the clinician table lists ISAA and CARS and never
  mentions ADOS-2. The client confirmed ADOS-2 is in use and asked for the wording to be kept, so
  it is restored on the ten autism assessment pages alongside the RCI removal. It is recorded in
  `generate-location-meta.js` as a **client-attested claim**, not one derived from the clinician
  table. If that ever needs defending, the attestation is the source.
- **Parking and travel times stay generic.** No data was available. Every locality section now
  closes by pointing people at the intake call for parking, drop-off and current routing, rather
  than asserting minute-counts that would go stale. Verified transit facts are used instead.
- **Dr Mahima Sahi is mapped to Vasant Kunj** and appears on adult counselling pages from batch 4.

### Transit facts, verified rather than assumed

- **Yellow Line order confirmed** as Green Park, Hauz Khas, Malviya Nagar, Saket, Qutab Minar, so
  the stop counts on the Saket, Hauz Khas and Green Park pages are correct as written.
- **Gurugram was wrong and is corrected.** The nearest station to DLF City Court is **Guru
  Dronacharya**, roughly 700 m, not MG Road. "MG Road" in the address refers to Mehrauli-Gurgaon
  Road, the street, which is why the original copy conflated the two.
- **Vasant Kunj now names both** Munirka on the Magenta Line, nearest by distance, and Chhatarpur
  on the Yellow Line, the more commonly used access point, because sources disagree on which
  serves the sectors. No walking time is claimed.

### Still open

- **RCI wording remains on 55 pages outside `locations/`**, across `adhd/`, `autism/`,
  `resources/`, `occupational-therapy/`, `parent-hub/` and others, plus `index.php` and
  `about.php`. It is generated by `generate-page-meta.js` and hard-coded in two places in
  `service-pages-content.js`. `locations/` is now clean, and `generate-service-pages.js` strips
  the RCI suffixes for every service rather than only for doctors and physiotherapists. The
  remaining 55 are the same unverified claim in a different part of the site and need a decision:
  sweep them the same way, or supply per-clinician RCI numbers and reinstate everywhere.
- **Gurugram roster** is Dr Agrima Aggarwal and Mannat Kaur Arora only, per the table.
- The eighteen newer service hub pages (`aba-therapy`, `physiotherapy`, `pediatric-neurologist`
  and the rest) have no entry in `generate-location-meta.js`, so their titles and descriptions are
  unmanaged. Pre-existing, out of scope for this rewrite, worth a separate pass.
