<style>
  /* ---------------------------------------------------------------------
     Navigation.

     Eight top-level items: two plain links and six hubs, plus the booking
     button. The hubs open a panel whose columns are the sub-hubs, which keeps
     the whole structure two clicks deep without nested fly-out menus. The
     previous flat list of eleven items wrapped onto a second row and left no
     room for the button.
     --------------------------------------------------------------------- */
  .emb-nav__desktop { display: none; }
  .emb-nav__cta { display: none; }
  .emb-nav__burger { display: block; }
  @media (min-width: 1180px) {
    .emb-nav__desktop { display: flex; }
    .emb-nav__cta { display: block; }
    .emb-nav__burger, .emb-nav__panel { display: none !important; }
  }

  .emb-nav__item { position: relative; }
  .emb-nav__top {
    display: flex; align-items: center; gap: .3rem;
    padding: .55rem .7rem; border-radius: .6rem;
    font-size: .875rem; font-weight: 500; color: #403D3D;
    white-space: nowrap; cursor: pointer; transition: color .2s, background .2s;
  }
  .emb-nav__top:hover, .emb-nav__item:focus-within .emb-nav__top { color: #234394; background: rgba(35,67,148,.07); }
  .emb-nav__top--active { color: #234394; }
  .emb-nav__top svg { width: .7rem; height: .7rem; flex: none; transition: transform .25s ease; }
  .emb-nav__item:hover .emb-nav__top svg { transform: rotate(180deg); }

  /* Drop panel */
  .emb-nav__drop {
    position: absolute; left: 0; top: 100%; padding-top: .85rem; z-index: 60;
    opacity: 0; pointer-events: none; transition: opacity .22s ease;
  }
  .emb-nav__item:hover .emb-nav__drop,
  .emb-nav__item:focus-within .emb-nav__drop { opacity: 1; pointer-events: auto; }
  .emb-nav__drop--right { left: auto; right: 0; }
  /* Solid, not translucent: page content showing through a menu makes the
     links hard to read, and the glass effect is not worth that. */
  .emb-nav__card {
    background: #fff;
    border: 1px solid #e8ecf6; border-radius: 1.1rem;
    box-shadow: 0 20px 60px rgba(0,0,0,.14), 0 8px 20px rgba(0,0,0,.07);
    padding: 1.1rem; display: flex; gap: 1.5rem;
  }
  .emb-nav__col { min-width: 12rem; }
  .emb-nav__col + .emb-nav__col { border-left: 1px solid #eef1f8; padding-left: 1.5rem; }
  .emb-nav__coltitle {
    font-size: .68rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
    color: #94a3b8; margin: 0 0 .5rem .55rem;
  }
  .emb-nav__link {
    display: block; padding: .45rem .55rem; border-radius: .5rem;
    font-size: .84rem; color: #403D3D; white-space: nowrap; transition: background .18s, color .18s;
  }
  .emb-nav__link:hover { background: rgba(35,67,148,.09); color: #234394; }
  .emb-nav__link--lead { font-weight: 600; color: #234394; }
  .emb-nav__rule { height: 1px; background: #eef1f8; margin: .45rem .55rem; }

  /* Mobile panel */
  .emb-nav__panel {
    position: absolute; top: 100%; left: 0; right: 0;
    background: #fff;
    box-shadow: 0 18px 40px rgba(0,0,0,.12);
    padding: 1.1rem 1.5rem 1.75rem; max-height: 85vh; overflow-y: auto;
  }
  .emb-nav__panel a { display: block; padding: .5rem .25rem; font-size: .9rem; color: #403D3D; }
  .emb-nav__panel a:hover { color: #234394; }
  .emb-nav__panel summary {
    list-style: none; cursor: pointer; display: flex; align-items: center; justify-content: space-between;
    padding: .6rem .25rem; font-size: .95rem; font-weight: 600; color: #234394;
  }
  .emb-nav__panel summary::-webkit-details-marker { display: none; }
  .emb-nav__panel summary svg { width: .75rem; height: .75rem; transition: transform .25s ease; }
  .emb-nav__panel details[open] > summary svg { transform: rotate(180deg); }
  .emb-nav__panel .emb-nav__sub { margin-left: .75rem; padding-left: .75rem; border-left: 2px solid rgba(35,67,148,.18); }
  .emb-nav__panel .emb-nav__subtitle {
    font-size: .68rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
    color: #94a3b8; margin: .7rem 0 .1rem .25rem;
  }
</style>

<nav class="glass-nav px-5 md:px-10 py-3 flex items-center justify-between fixed top-0 left-0 right-0 z-100">
  <div class="flex items-center">
    <a data-discover="true" href="/"><img decoding="async" width="152" height="99"
        alt="eMbrace Lives - Psychologist in Delhi" class="h-13 w-auto drop-shadow-md"
        src="/assets/Logo-DrHvIBUF.svg" /></a>
  </div>

  <!-- ============================ desktop ============================ -->
  <div class="emb-nav__desktop items-center">
    <a class="emb-nav__top emb-nav__top--active" data-discover="true" href="/">Home</a>
    <a class="emb-nav__top" data-discover="true" href="/about">About</a>

    <!-- Child -->
    <div class="emb-nav__item">
      <a class="emb-nav__top" data-discover="true" href="/children_and_adolescents">Child
        <svg fill="none" stroke="currentColor" stroke-width="2" viewbox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round"></path></svg></a>
      <div class="emb-nav__drop">
        <div class="emb-nav__card">
          <div class="emb-nav__col">
            <p class="emb-nav__coltitle">Child &amp; Adolescence</p>
            <a class="emb-nav__link emb-nav__link--lead" href="/children_and_adolescents">Children &amp; Adolescents</a>
            <a class="emb-nav__link" href="/children">Children</a>
            <a class="emb-nav__link" href="/adolescents">Adolescents</a>
            <a class="emb-nav__link" href="/teacher">Teachers</a>
          </div>
          <div class="emb-nav__col">
            <p class="emb-nav__coltitle">Child Development</p>
            <a class="emb-nav__link emb-nav__link--lead" href="/child-development-centre">Child Development Centre</a>
            <a class="emb-nav__link" href="/adhd/adhd">ADHD</a>
            <a class="emb-nav__link" href="/autism/autism">Autism</a>
            <a class="emb-nav__link" href="/learning-disabilities/learning-disabilities">Learning Disabilities</a>
            <a class="emb-nav__link" href="/speech-therapy/speech-therapy">Speech Therapy</a>
            <a class="emb-nav__link" href="/occupational-therapy/occupational-therapy">Occupational Therapy</a>
            <a class="emb-nav__link" href="/child-psychology/child-counselling">Child Psychology</a>
            <a class="emb-nav__link" href="/teen-mental-health/teen-counselling">Teen Mental Health</a>
          </div>
          <div class="emb-nav__col">
            <p class="emb-nav__coltitle">Therapies &amp; Specialists</p>
            <a class="emb-nav__link" href="/developmental-delay-treatment">Developmental Delay</a>
            <a class="emb-nav__link" href="/intellectual-disability-treatment">Intellectual Disability</a>
            <a class="emb-nav__link" href="/down-syndrome-treatment">Down Syndrome</a>
            <a class="emb-nav__link" href="/oral-motor-therapy">Oral Motor &amp; Feeding</a>
            <a class="emb-nav__link" href="/aba-therapy">ABA Therapy</a>
            <a class="emb-nav__link" href="/physiotherapy">Physiotherapy</a>
            <div class="emb-nav__rule"></div>
            <a class="emb-nav__link" href="/pediatric-neurologist">Pediatric Neurologist</a>
            <a class="emb-nav__link" href="/developmental-pediatrician">Developmental Pediatrician</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Adults & Parents -->
    <div class="emb-nav__item">
      <a class="emb-nav__top" data-discover="true" href="/adult">Adults &amp; Parents
        <svg fill="none" stroke="currentColor" stroke-width="2" viewbox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round"></path></svg></a>
      <div class="emb-nav__drop">
        <div class="emb-nav__card">
          <div class="emb-nav__col">
            <p class="emb-nav__coltitle">Adults</p>
            <a class="emb-nav__link emb-nav__link--lead" href="/adult">For Adults</a>
            <a class="emb-nav__link" href="/individuals">Individuals</a>
            <a class="emb-nav__link" href="/couples">Couples &amp; Marriage Counselling</a>
            <a class="emb-nav__link" href="/adult-mental-health/adult-counselling">Adult Mental Health Hub</a>
          </div>
          <div class="emb-nav__col">
            <p class="emb-nav__coltitle">Parents</p>
            <a class="emb-nav__link emb-nav__link--lead" href="/parent-hub/parents">Parent Hub</a>
            <a class="emb-nav__link" href="/parent">For Parents</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Partners -->
    <div class="emb-nav__item">
      <a class="emb-nav__top" data-discover="true" href="/partners">Partners
        <svg fill="none" stroke="currentColor" stroke-width="2" viewbox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round"></path></svg></a>
      <div class="emb-nav__drop">
        <div class="emb-nav__card">
          <div class="emb-nav__col">
            <p class="emb-nav__coltitle">School</p>
            <a class="emb-nav__link emb-nav__link--lead" href="/schools-hub/schools">Schools Hub</a>
            <a class="emb-nav__link" href="/university">Universities</a>
          </div>
          <div class="emb-nav__col">
            <p class="emb-nav__coltitle">Business</p>
            <a class="emb-nav__link emb-nav__link--lead" href="/corporate">Corporates</a>
            <a class="emb-nav__link" href="/corporate-wellness/corporates">Corporate Wellness Hub</a>
            <a class="emb-nav__link" href="/hospitalAndHealthcare">Hospital &amp; Healthcare Partnerships</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Free Tools -->
    <div class="emb-nav__item">
      <a class="emb-nav__top" style="color:#234394;font-weight:600" data-discover="true" href="/resources">Free Tools
        <svg fill="none" stroke="currentColor" stroke-width="2" viewbox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round"></path></svg></a>
      <div class="emb-nav__drop">
        <div class="emb-nav__card">
          <div class="emb-nav__col">
            <a class="emb-nav__link" href="/resources/child-milestone-checker">Child Milestone Checker</a>
            <a class="emb-nav__link" href="/resources/adhd-autism-screener">ADHD &amp; Autism Screener</a>
            <a class="emb-nav__link" href="/resources/adult-stress-check">Adult Stress Check</a>
            <div class="emb-nav__rule"></div>
            <a class="emb-nav__link emb-nav__link--lead" href="/resources">All Free Tools</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Resources -->
    <div class="emb-nav__item">
      <a class="emb-nav__top" data-discover="true" href="/media">Resources
        <svg fill="none" stroke="currentColor" stroke-width="2" viewbox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round"></path></svg></a>
      <div class="emb-nav__drop emb-nav__drop--right">
        <div class="emb-nav__card">
          <div class="emb-nav__col">
            <a class="emb-nav__link" href="/gallery">Gallery</a>
            <a class="emb-nav__link" href="/media">Media &amp; News</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Locations -->
    <div class="emb-nav__item">
      <a class="emb-nav__top" data-discover="true" href="/locations">Locations
        <svg fill="none" stroke="currentColor" stroke-width="2" viewbox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round"></path></svg></a>
      <div class="emb-nav__drop emb-nav__drop--right">
        <div class="emb-nav__card">
          <div class="emb-nav__col">
            <p class="emb-nav__coltitle">Delhi</p>
            <a class="emb-nav__link emb-nav__link--lead" href="/contact-us">Vasant Kunj Centre</a>
            <a class="emb-nav__link" href="/locations/#saket">Saket</a>
            <a class="emb-nav__link" href="/locations/#hauz-khas">Hauz Khas</a>
            <a class="emb-nav__link" href="/locations/#greater-kailash">Greater Kailash</a>
            <a class="emb-nav__link" href="/locations/#defence-colony">Defence Colony</a>
            <a class="emb-nav__link" href="/locations/#south-delhi">South Delhi</a>
          </div>
          <div class="emb-nav__col">
            <p class="emb-nav__coltitle">Gurgaon &amp; NCR</p>
            <a class="emb-nav__link emb-nav__link--lead" href="/contact-us">Gurgaon Centre</a>
            <a class="emb-nav__link" href="/locations/#noida">Noida</a>
            <div class="emb-nav__rule"></div>
            <a class="emb-nav__link emb-nav__link--lead" href="/locations">All Locations</a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="emb-nav__cta">
    <a href="/appointment" class="glass-btn px-5 py-2.5 text-sm rounded-full cursor-pointer font-medium inline-block text-center">
      Book a Consultation
    </a>
  </div>

  <div class="emb-nav__burger z-30">
    <button aria-expanded="false" aria-label="Open menu" class="text-2xl focus:outline-none drop-shadow-sm">☰</button>
  </div>

  <!-- ============================= mobile ============================= -->
  <div id="mobile-menu" class="emb-nav__panel hidden">
    <a href="/">Home</a>
    <a href="/about">About</a>

    <details>
      <summary>Child <svg fill="none" stroke="currentColor" stroke-width="2" viewbox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round"></path></svg></summary>
      <div class="emb-nav__sub">
        <p class="emb-nav__subtitle">Child &amp; Adolescence</p>
        <a href="/children_and_adolescents">Children &amp; Adolescents</a>
        <a href="/children">Children</a>
        <a href="/adolescents">Adolescents</a>
        <a href="/teacher">Teachers</a>
        <p class="emb-nav__subtitle">Child Development</p>
        <a href="/child-development-centre">Child Development Centre</a>
        <a href="/adhd/adhd">ADHD</a>
        <a href="/autism/autism">Autism</a>
        <a href="/learning-disabilities/learning-disabilities">Learning Disabilities</a>
        <a href="/speech-therapy/speech-therapy">Speech Therapy</a>
        <a href="/occupational-therapy/occupational-therapy">Occupational Therapy</a>
        <a href="/child-psychology/child-counselling">Child Psychology</a>
        <a href="/teen-mental-health/teen-counselling">Teen Mental Health</a>
        <p class="emb-nav__subtitle">Therapies &amp; Specialists</p>
        <a href="/developmental-delay-treatment">Developmental Delay</a>
        <a href="/intellectual-disability-treatment">Intellectual Disability</a>
        <a href="/down-syndrome-treatment">Down Syndrome</a>
        <a href="/oral-motor-therapy">Oral Motor &amp; Feeding</a>
        <a href="/aba-therapy">ABA Therapy</a>
        <a href="/physiotherapy">Physiotherapy</a>
        <a href="/pediatric-neurologist">Pediatric Neurologist</a>
        <a href="/developmental-pediatrician">Developmental Pediatrician</a>
      </div>
    </details>

    <details>
      <summary>Adults &amp; Parents <svg fill="none" stroke="currentColor" stroke-width="2" viewbox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round"></path></svg></summary>
      <div class="emb-nav__sub">
        <p class="emb-nav__subtitle">Adults</p>
        <a href="/adult">For Adults</a>
        <a href="/individuals">Individuals</a>
        <a href="/couples">Couples &amp; Marriage Counselling</a>
        <a href="/adult-mental-health/adult-counselling">Adult Mental Health Hub</a>
        <p class="emb-nav__subtitle">Parents</p>
        <a href="/parent-hub/parents">Parent Hub</a>
        <a href="/parent">For Parents</a>
      </div>
    </details>

    <details>
      <summary>Partners <svg fill="none" stroke="currentColor" stroke-width="2" viewbox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round"></path></svg></summary>
      <div class="emb-nav__sub">
        <p class="emb-nav__subtitle">School</p>
        <a href="/schools-hub/schools">Schools Hub</a>
        <a href="/university">Universities</a>
        <p class="emb-nav__subtitle">Business</p>
        <a href="/corporate">Corporates</a>
        <a href="/corporate-wellness/corporates">Corporate Wellness Hub</a>
        <a href="/hospitalAndHealthcare">Hospital &amp; Healthcare Partnerships</a>
      </div>
    </details>

    <details>
      <summary>Free Tools <svg fill="none" stroke="currentColor" stroke-width="2" viewbox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round"></path></svg></summary>
      <div class="emb-nav__sub">
        <a href="/resources/child-milestone-checker">Child Milestone Checker</a>
        <a href="/resources/adhd-autism-screener">ADHD &amp; Autism Screener</a>
        <a href="/resources/adult-stress-check">Adult Stress Check</a>
        <a href="/resources">All Free Tools</a>
      </div>
    </details>

    <details>
      <summary>Resources <svg fill="none" stroke="currentColor" stroke-width="2" viewbox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round"></path></svg></summary>
      <div class="emb-nav__sub">
        <a href="/gallery">Gallery</a>
        <a href="/media">Media &amp; News</a>
      </div>
    </details>

    <details>
      <summary>Locations <svg fill="none" stroke="currentColor" stroke-width="2" viewbox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-linecap="round" stroke-linejoin="round"></path></svg></summary>
      <div class="emb-nav__sub">
        <p class="emb-nav__subtitle">Delhi</p>
        <a href="/contact-us">Vasant Kunj Centre</a>
        <a href="/locations/#saket">Saket</a>
        <a href="/locations/#hauz-khas">Hauz Khas</a>
        <a href="/locations/#greater-kailash">Greater Kailash</a>
        <a href="/locations/#defence-colony">Defence Colony</a>
        <a href="/locations/#south-delhi">South Delhi</a>
        <p class="emb-nav__subtitle">Gurgaon &amp; NCR</p>
        <a href="/contact-us">Gurgaon Centre</a>
        <a href="/locations/#noida">Noida</a>
        <a href="/locations">All Locations</a>
      </div>
    </details>

    <a href="/appointment" class="glass-btn px-5 py-2.5 rounded-full mt-3 w-full text-center font-medium block">Book a Consultation</a>
  </div>
</nav>
