# eMbrace — Lead Magnet Strategy & Daily Lead Engine

Everything in this document refers to what is now live in this repo. Section 1–4 explain the
build, sections 5–9 are the operating system for turning it into daily leads.

Last updated: 10 August 2026.

---

## 1. Why these three magnets

eMbrace sells three economically different things: **assessments** (high value, high
consideration), **child therapy blocks** (recurring, high LTV) and **adult therapy**
(lower ticket, faster decision). A single generic "download our brochure" magnet serves none of
them. Each tool below is built to intercept a specific worry at the exact moment it is being
searched, and to hand that person to the service that matches.

| # | Lead magnet | URL | Audience | Feeds | Guide delivered |
|---|---|---|---|---|---|
| 1 | Child Development Milestone Checker (0–12) | `/resources/child-milestone-checker` | Parents, worried but not yet convinced | Child assessment, speech, OT, early intervention | The Delhi Parent's Milestone & Early-Support Guide |
| 2 | ADHD & Autism Early-Signs Screener | `/resources/adhd-autism-screener` | Parents already suspecting something, or told to "get tested" by a school | ADOS-2 / ADHD assessments — the highest-ticket service | The Parent's ADHD & Autism Assessment Guide (+ school accommodation letter template) |
| 3 | Adult Stress, Anxiety & Burnout Self-Check | `/resources/adult-stress-check` | Working adults, students, caregivers | Individual therapy, couples, corporate EAP | The 7-Day Reset Plan |

**Why an interactive tool rather than a PDF download.** A PDF asks for an email in exchange for
something the visitor cannot evaluate yet. A screener gives the answer first, which earns the
email — and, more importantly, it produces *qualification data*: which domain is affected, how
severe, how much daily life is impacted, and the child's age. That data is what lets the intake
team call the right person first (see §4).

**Deliberate design choices worth defending to a clinician:**

- Results are **never gated**. The visitor sees the full result before any form appears. This
  raises completion, and it is the honest thing to do with health-adjacent content.
- Every tool can return **"you are fine"** and says so plainly. Screeners that always find a
  problem convert better for a week and destroy referral trust for years.
- The adult check carries a **safety item**. Any endorsement surfaces Tele-MANAS (14416), AASRA
  and eMbrace numbers *above* the result, and flags the lead as high priority.
- Every result and guide carries a non-diagnosis disclaimer, and the guides are `noindex`
  (see `robots.txt`) so the email step is not bypassable.

---

## 2. What was built

**Tool pages** (indexable, SEO-optimised, FAQ content, internal links)
- `resources/index.php` — the free-tools hub
- `resources/child-milestone-checker.php`
- `resources/adhd-autism-screener.php`
- `resources/adult-stress-check.php`

**Gated deliverables** (printable, `noindex`, "Save as PDF" button)
- `resources/guides/child-milestone-guide.php`
- `resources/guides/adhd-autism-next-steps.php`
- `resources/guides/7-day-reset-plan.php`

**Shared engine**
- `assets/lead-magnets.js` — quiz engine, scoring, result rendering, lead capture, tracking
- `assets/lead-magnets.css` — all styling (self-contained; the site's Tailwind build is purged
  and does not see these files)

**Placements**
- `index.php` — a blue "free & instant" strip directly under the hero, and a full three-card
  section immediately above the closing CTA banner (`#free-tools`)
- `components/lead-magnet-popup.php` — exit-intent (desktop) / 55%-scroll (mobile) prompt, shown
  once per visitor per 7 days, on the home page and the 16 main hub pages. Deliberately **not**
  site-wide: a popup on 350+ pages reads as pushy on a mental health site and the same visitor
  would meet it repeatedly
- `components/lead-magnet-cta.php` — closing band on every resource page
- `components/lead-magnet-band-{child,neuro,adult}.php` — contextual bands placed above the footer
  on all 358 location and hub pages by `inject-lead-magnets.js`. That script is idempotent and
  re-runnable: `node inject-lead-magnets.js --dry` reports, without `--dry` applies. Run it after
  adding new content pages so they pick the band up too
- Header nav: a "Free Tools" dropdown (desktop + mobile); Footer: "Free Tools & Screeners"

**Plumbing**
- `build.js` now inlines *any* `components/<name>.php` include at any directory depth, and
  resolves the footer's copyright year (it was previously shipping `<?php echo date('Y'); ?>`
  literally into `dist/`)
- `generate-sitemap.js` — tools added as priority hub pages, guides excluded
- `robots.txt` — `Disallow: /resources/guides/`

---

## 3. The funnel

```
Traffic (SEO · GBP · ads · WhatsApp · school & clinic partners)
        ↓
Tool page  ──► 55–70% start the quiz  (it is above the fold and costs nothing)
        ↓
Quiz completion  ──► 70–80% of starters finish  (one question per screen, auto-advance)
        ↓
Result on screen  ──► 25–40% submit the form for the report + guide   ← THE LEAD
        ↓
Nurture (email + WhatsApp, §7)  +  intake call offer
        ↓
Free 15-min intake call  ──► 30–40% of red-band leads, 10–15% of amber
        ↓
Assessment / therapy booking  ──► 40–60% of intake calls
```

Ranges are planning assumptions for a well-built health screener, not measured figures — replace
them with your own numbers after four weeks of GA4 data.

**Worked example.** 3,000 monthly sessions on the tool pages → ~1,800 quiz starts → ~1,350
completions → ~400 leads/month (~13/day). Roughly 30% land in the red band → ~120 high-priority
leads → ~40 intake calls → ~18 bookings. At an average first-transaction value of ₹8,000–₹25,000
depending on service mix, that is the difference between a good month and a flat one.

**The tools do not create demand — they capture demand you are already paying for.** Every
existing visitor who reads a location page, bounces, and never calls is the population this
funnel converts.

---

## 4. Lead data, routing and the call SOP

All three tools post to the **same Formester endpoint as `appointment.php`**
(`https://app.formester.com/forms/6rj1mkdNE/submissions`). This is deliberate — one inbox, one
process, no second dashboard to check.

Fields posted:

| Group | Fields |
|---|---|
| Contact | `name`, `parent_name`, `email`, `phone` |
| Appointment-form fields, auto-filled | `specialty`, `condition` — mapped to the same select values the appointment form uses, so a lead arrives pre-categorised (e.g. the ADHD/autism screener sends `condition=autism_asd` when the autism cluster outscores the ADHD cluster) |
| Result | `magnet_id`, `magnet_name`, `result_band`, `result_label`, `result_score`, `result_summary`, `priority`, `answers` |
| Attribution | `form_type=lead_magnet`, `lead_source=website_free_tool`, `source_page`, `referrer`, `utm_source`, `utm_medium`, `utm_campaign`, `submitted_at` |
| Digest | `message` |

**`message` carries a complete plain-text digest** — tool name, band, score, priority, summary,
source, and the full question → answer transcript. That redundancy is intentional: the Formester
form was defined for appointment fields, and a form builder may drop field names it does not
recognise. Even in the worst case, everything the intake team needs is in `message`, which that
form definitely has. **Do not remove it.**

**Priority is derived automatically** from the result band: red → `high`, amber → `medium`,
green → `low`.

### Call SOP

| Priority | Who | When | Opening line |
|---|---|---|---|
| **High** (red band) | Senior intake coordinator | Within 2 working hours, and always same day | "You did our screener and it flagged a few areas. I'm calling to help you work out whether an assessment is actually needed — no obligation." |
| **High + safety item endorsed** (adult check) | Clinical psychologist, not admin | Within 1 hour, in working hours | Clinical protocol call. Never an admin script. |
| **Medium** (amber) | Intake coordinator | Within 24 hours | "You'll have got the guide — I wanted to check whether the areas it flagged match what you're seeing at home." |
| **Low** (green) | No call | Email nurture only | Re-engage at the 3-month re-check prompt. |

**Rules that protect the brand:**
1. The call is a clinical conversation, not a sales call. "You probably don't need us yet" is an
   allowed and encouraged outcome — it is what makes the referral engine work.
2. Never quote a price without explaining what is included.
3. Log the outcome against `magnet_id` so you can see which tool produces bookings, not just leads.
4. Do not call a green-band lead unprompted. It reads as fishing, and it is.

---

## 5. The daily lead engine

The tools are an asset. Leads come from putting them in front of people every single day. This is
a 45-minute daily routine plus weekly and monthly blocks.

### Every working day (≈45 min)

| Time | Action | Owner |
|---|---|---|
| 09:30 | Work the overnight lead queue: high priority first, then medium. Log outcomes. | Intake |
| 10:00 | **One social post** promoting a screener — a single milestone, a single myth, one line from a guide, always ending in the tool link. Instagram + Facebook + LinkedIn (LinkedIn for the adult/corporate tool). | Marketing |
| 10:15 | **One Google Business Profile post** on each of the three centre listings. GBP posts have a 7-day half-life and drive local, high-intent clicks for free. | Marketing |
| 10:30 | Answer one real parent question in a community — a school WhatsApp group, a Delhi parenting Facebook group, Quora, Reddit r/india / r/delhi — with a genuinely useful answer and the tool link only where it fits. Two per week per platform, never more. | Clinician + marketing |
| 17:00 | WhatsApp broadcast/status to the opted-in list, alternating tools. | Marketing |

### Every week

- **Monday** — review the funnel dashboard (§8). One number decides the week's focus: the weakest
  step in the funnel, not the total.
- **Tuesday** — publish one blog/hub article targeting a screener keyword, with the tool embedded
  in the first screen and in the conclusion.
- **Wednesday** — email the list: one educational email, one tool link (§7 sequences).
- **Thursday** — partner outreach: 5 schools, 5 paediatricians, 3 corporate HR contacts. Offer the
  screener as a free resource *for their community*, co-branded on request. This is the highest
  leverage activity in this document and the most consistently skipped.
- **Friday** — review the week's leads by `magnet_id` and `result_band`; reallocate ad spend.

### Every month

- Refresh one guide with new content and re-email the list ("updated for 2026").
- Run a school screening day or a parent webinar; the screener is the registration mechanism.
- Publish an anonymised aggregate insight ("of 600 Delhi parents who used our milestone checker,
  38% flagged speech"). This is genuinely newsworthy, it earns press links, and it costs nothing.
- Re-check the ad creative — screener ads fatigue in 3–4 weeks.

---

## 6. Channel playbooks

### 6.1 SEO — the compounding channel
- The tool pages target genuinely searched, low-competition intent: *"is my child speech delayed"*,
  *"child not talking at 2 years"*, *"adhd test for child India"*, *"am I burnt out quiz"*.
- **Done:** a contextual CTA band now sits above the footer on all 358 SEO content pages — the 111
  location pages plus every condition and audience hub. Those pages already rank and already
  receive traffic whose only conversion path was "book an appointment", which is a big ask for a
  first-time visitor. A screener is a small ask. The band matches the page: ADHD/autism/school
  pages get the screener, adult and workplace pages get the stress check, everything else gets the
  milestone checker.
- Submit `/resources/*` in Search Console after deploy; request indexing on all four pages.

### 6.2 Google Business Profile — free local demand
- Daily post rotation across all three centre listings.
- Add the screener as a **GBP link/offer** on each profile.
- Answer GBP Q&A with the tool link where it genuinely answers the question.

### 6.3 Meta ads (the volume lever)
- Start at ₹800–₹1,200/day split across two campaigns:
  - **Parents 28–45, Delhi NCR + Gurugram + Noida**, interests: parenting, special education,
    schools → milestone checker and ADHD/autism screener.
  - **Adults 25–45, Delhi NCR, job titles/interests: corporate, startup, consulting** → stress check.
- Creative that works for screeners: a single question on a plain background ("Does your 2-year-old
  point at things to show you?"), the "wait and watch is advice, not a plan" angle, and a
  clinician-to-camera 20-second video.
- Optimise for the `generate_lead` event, not link clicks.
- Retarget quiz-starters who did not submit — they are the cheapest conversion you will ever buy.

### 6.4 Google Ads
- Search campaigns on the assessment terms already ranking organically are expensive; instead run
  a small **screener-intent** campaign: "child development test", "adhd test for kids", "burnout
  test", where CPCs are a fraction of "child psychologist Delhi".
- Bid on your own brand + "review"/"fees" to control that SERP.

### 6.5 WhatsApp (India's highest-converting channel)
- Add "Take a free 3-minute check" to the WhatsApp Business greeting message and catalogue.
- The result page's WhatsApp button carries the tool name and band into the chat, so whoever picks
  it up already knows the context.
- Build the broadcast list from every lead who consented (consent is captured explicitly on the form).

### 6.6 Partnerships — the compounding offline channel
- **Schools** — offer the screener as a free tool for their parent newsletter, co-branded on
  request. Schools will not promote a clinic; they will promote a resource. Follow with an offer of
  a free teacher-training session.
- **Paediatricians and GPs** — a printed A5 card with a QR code to the milestone checker. Doctors
  send parents somewhere; make it your page.
- **Corporates** — the adult check is already positioned as part of a wellness programme. Offer HR
  an anonymised, aggregate wellbeing snapshot of their team as the entry point to an EAP contract.
- **Housing societies and preschools** in Vasant Kunj, Gurugram and Malviya Nagar — a free
  screening morning, screener as the sign-up.

### 6.7 Email list
- Every lead enters the sequence in §7 automatically.
- Monthly newsletter to the whole list; a screener link belongs in every issue, always as a
  secondary CTA.

---

## 7. Nurture sequences (copy ready to load)

Set these up in your email tool with the `magnet_id` field as the branch condition. Keep sending
times at 10:00 or 19:00 IST.

### 7.1 Milestone checker — parents

**Day 0, immediately — "Your milestone report + guide"**
> Hi {name}, your report and the Milestone Guide are attached / linked below.
> Two things worth knowing before you read it. First, uneven development is normal — what matters
> is whether a gap is widening, not whether it exists today. Second, the single most useful thing
> you can do this week is ten minutes a day of floor-time play where you follow your child's lead
> entirely. It sounds too simple. It is the highest-yield thing parents do at home.
> If you would like a clinician to look at your result, reply "call" and we will arrange a free
> 15-minute conversation.

**Day 2 — "The three words that change how a child talks"**
Narrate, wait, add one. One home strategy, no pitch, tool link at the bottom.

**Day 4 — "What actually happens in an assessment"**
Demystify: the four steps, the tools, the cost conversation. Reduces the biggest booking blocker,
which is fear of an unknown, open-ended process.

**Day 7 — "Nisha's son wasn't speaking at 2½"** *(a real, consented client story)*
Story → outcome → soft CTA.

**Day 14 — "Should you wait and watch?"**
The honest answer, including when waiting genuinely is correct. Offer the free call.

**Day 30 — "Time to re-check"**
Re-take link. Re-engagement of the whole cohort, and it produces a second, better-qualified lead.

### 7.2 ADHD & autism screener — parents

Day 0 report + guide → Day 2 "What ADOS-2 actually involves" → Day 4 "How to get your school to
act" (the letter template) → Day 7 "ADHD or anxiety? They look identical" → Day 10 client story →
Day 14 "The cost of waiting a year" (evidence-led, not fear-led) → Day 30 re-check.

### 7.3 Adult stress check

Day 0 report + 7-Day Reset Plan → Day 2 "The sleep window" → Day 4 "Burnout is not the same as
depression" → Day 7 "Six sessions is often the whole intervention" (kills the "therapy is forever"
objection) → Day 12 "Does your employer already pay for this?" (corporate cross-sell) → Day 21
re-check.

### 7.4 WhatsApp micro-sequence (all magnets)

- **+2 hours:** "Hi {name}, this is {coordinator} from eMbrace. Your guide is in your inbox —
  did it arrive? Happy to answer anything."
- **+2 days:** one useful tip, no ask.
- **+5 days:** "Would a free 15-minute call with one of our psychologists help? No obligation."

Three messages. Then stop unless they reply. Sequence discipline is what keeps you off the block
list.

---

## 8. Tracking

The engine already pushes to `dataLayer` and `gtag` if present:

| Event | Fires when | Key params |
|---|---|---|
| `lead_magnet_click` | Any CTA with `data-lm-cta` is clicked | `magnet_id`, `placement` |
| `lead_magnet_popup_view` | The popup opens | `trigger` (exit_intent / scroll_depth) |
| `lead_magnet_start` | First question rendered | `magnet_id`, `magnet_name` |
| `lead_magnet_complete` | Result screen shown | `magnet_id`, `result_band`, `result_score` |
| `generate_lead` | Form submitted | `magnet_id`, `result_band`, `value`, `currency` |

**GA4 is not currently installed on the site.** Add GA4 (or GTM) and these events start reporting
with no further code. Mark `generate_lead` as a key event, and import it into Google Ads and Meta
as the optimisation target.

### Dashboard — five numbers, reviewed every Monday

1. Tool page sessions (by source)
2. Start rate — `lead_magnet_start` ÷ sessions **(target > 55%)**
3. Completion rate — `lead_magnet_complete` ÷ starts **(target > 70%)**
4. Lead rate — `generate_lead` ÷ completions **(target > 25%)**
5. Lead → intake call → booking, split by `magnet_id` and `result_band`

Fix the weakest step. A low start rate is a placement or headline problem; a low completion rate is
a question-count problem; a low lead rate is an offer problem.

---

## 9. Compliance and clinical safety

- Every result and guide states that it is not a diagnosis, and names who can diagnose.
- Consent to be contacted is explicit, unticked by default, and required — aligned with DPDP
  expectations. Consent text and the privacy policy link are on the form.
- The suicidality item in the adult check surfaces crisis resources immediately and prioritises the
  lead. Whoever calls that lead must be clinically qualified.
- Answers stay in the browser until the visitor submits; nothing is transmitted before that.
- Guides are `noindex` and disallowed in `robots.txt`.
- No condition-specific retargeting audiences in ad platforms — targeting people by inferred health
  status is both a policy violation and a bad idea. Retarget on page visit only.

---

## 10. Setup checklist before this earns money

**Decided:** leads post to the existing appointment Formester form. No new form, no swap needed.

- [ ] **Submit one live test lead from each of the three tools** (do this first — it answers
      everything else). In the Formester submission, check whether `result_band`, `priority`,
      `magnet_id` and `answers` appear as their own fields.
      - If they do → nothing more to do; use them for routing and filtering.
      - If Formester shows only its declared appointment fields → the same information is in
        `message`, so nothing is lost. Optionally add the custom fields to the form definition so
        they become filterable columns.
- [ ] **Wire the delivery email.** Until this exists, the success screen's promise that "we have
      emailed a copy" is not being kept. Two options, in order of effort:
      1. **Formester auto-responder** (fastest). One template, triggered on submission, containing
         all three guide links and a line saying "open the one you asked for". Takes 15 minutes.
      2. **Pabbly Connect** (better). Formester webhook → filter `form_type = lead_magnet` → route
         on `magnet_id` → send the matching guide → append to a Google Sheet → WhatsApp/SMS alert
         to the intake coordinator when `priority = high`. The routing table is just:
         `child-milestone-checker` → `/resources/guides/child-milestone-guide`,
         `adhd-autism-screener` → `/resources/guides/adhd-autism-next-steps`,
         `adult-stress-check` → `/resources/guides/7-day-reset-plan`.
- [ ] **Route high-priority leads** to a phone/WhatsApp alert for the intake coordinator, and make
      sure a clinically qualified person — not admin — handles any adult lead where the safety item
      was endorsed.
- [ ] **Install GA4/GTM** and mark `generate_lead` as a key event. *(Deferred by the client;
      the events already fire into `dataLayer`, so this is a paste-the-tag job whenever you get to
      it — no code changes needed.)*
- [ ] Add the screener link to all three GBP profiles and the WhatsApp Business greeting.
- [ ] Brief the intake team on the call SOP in §4.
- [ ] Deploy, then request indexing for the four `/resources` URLs in Search Console.

### Optimisation backlog (in priority order)

1. A/B the home-page section headline: "Start with a free 3-minute check" vs "Is your child on track? Find out in 2 minutes".
2. Test making the phone field optional on the adult check only — B2C adult leads convert worse on
   phone-first forms; parents do not.
3. Add a fourth magnet for schools ("Classroom Neurodiversity Readiness Audit") once the first
   three are producing steady volume — it opens institutional contracts, not individual sessions.
4. Turn each guide into a properly designed PDF once the content is validated by real usage.
