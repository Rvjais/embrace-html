# Location Pages Rewrite: Phase 1 Brief

Working state for the 111 pages in `locations/`. Phase 1 (research and outline) is **done**.
Phase 2 (writing) has **not started** and is blocked on two decisions listed at the bottom.

Built with the `seo-content-workflow` skill, which gates writing behind an approved outline.

Last updated: 11 August 2026.

---

## 1. Where this stopped

The outline below was presented and is awaiting approval, along with one structural decision
(Option A or B in section 6). Nothing has been written. No location page content has been
changed.

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
2. Get Option A or B, and the two tables in section 7.
3. Write the first batch, apply section 8, then re-run the duplication measurement in section 2
   to prove the rewrite actually differentiated the pages.
4. Rebuild with `node build.js`, then verify with a local server before committing.
