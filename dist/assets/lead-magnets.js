/* ------------------------------------------------------------------
   eMbrace lead-magnet toolkit — shared quiz engine + popup + tracking.

   One engine drives all three screeners under /resources/. A page supplies
   the questions and an interpret() function; everything else (progress,
   keyboard control, result rendering, lead capture, delivery) lives here.

   Lead capture posts to the SAME Formester endpoint as appointment.php — this
   is deliberate, so every enquiry lands in one inbox. Because that form was
   defined for appointment fields, a form builder may drop field names it does
   not recognise; everything the intake team needs is therefore ALSO packed into
   `message`, which the appointment form already has. Do not remove that.
   ------------------------------------------------------------------ */
(function (window, document) {
  'use strict';

  var LM = {
    FORM_ACTION: 'https://app.formester.com/forms/6rj1mkdNE/submissions',
    PHONE: '+919971576800',
    LEAD_KEY: 'embrace_lead',
  };

  /* ------------------------------------------------------------ helpers */

  function el(tag, className, html) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (html != null) node.innerHTML = html;
    return node;
  }

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function store(key, value) {
    try {
      if (value === undefined) return window.localStorage.getItem(key);
      window.localStorage.setItem(key, value);
    } catch (e) { /* private mode — degrade quietly */ }
    return null;
  }

  function params() {
    var out = {};
    try {
      new window.URLSearchParams(window.location.search).forEach(function (v, k) { out[k] = v; });
    } catch (e) { /* older browser */ }
    return out;
  }

  /** GA4 / GTM if present, plus a console-free no-op otherwise. */
  function track(name, payload) {
    var data = payload || {};
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: name }, data));
    if (typeof window.gtag === 'function') window.gtag('event', name, data);
  }
  LM.track = track;

  /**
   * The PHP host serves pages as /page.php; the static build (build.js + Vercel
   * cleanUrls) serves /page and has no .php file at all. Links written in markup
   * are rewritten at build time, but links this script generates are not — so
   * strip the extension at runtime whenever the current page is itself running
   * without one. Covers guide links, booking CTAs and anything a page config
   * puts into an action string.
   */
  function fixLinks(root) {
    if (/\.php$/.test(window.location.pathname)) return;
    var links = root.querySelectorAll ? root.querySelectorAll('a[href$=".php"]') : [];
    Array.prototype.forEach.call(links, function (a) {
      a.setAttribute('href', a.getAttribute('href').replace(/\.php$/, ''));
    });
  }
  LM.fixLinks = fixLinks;

  function whatsappHref(message) {
    return 'https://wa.me/' + LM.PHONE.replace(/[^0-9]/g, '') +
      '?text=' + encodeURIComponent(message);
  }
  LM.whatsappHref = whatsappHref;

  /* ------------------------------------------------------------- engine */

  function Quiz(config) {
    this.cfg = config;
    this.mount = document.querySelector(config.mount);
    this.state = { answers: {}, index: 0 };
    this.started = false;
    if (this.mount) this.render();
  }

  Quiz.prototype.steps = function () {
    return this.cfg.buildSteps ? this.cfg.buildSteps(this.state) : this.cfg.steps;
  };

  Quiz.prototype.render = function () {
    this.mount.innerHTML = '';
    this.shell = el('div', 'lm-quiz');
    this.bar = el('div', 'lm-quiz__bar', '<span></span>');
    this.body = el('div', 'lm-quiz__body');
    this.shell.appendChild(this.bar);
    this.shell.appendChild(this.body);
    this.mount.appendChild(this.shell);
    this.paint();
  };

  Quiz.prototype.progress = function (pct) {
    this.bar.firstChild.style.width = Math.max(4, Math.min(100, pct)) + '%';
  };

  Quiz.prototype.paint = function () {
    var self = this;
    var steps = this.steps();
    var step = steps[this.state.index];

    if (!step) { this.showResult(); return; }

    // Branching quizzes only know their real length once the branch is chosen,
    // so fall back to the configured estimate until then.
    var total = Math.max(steps.length, this.cfg.estimatedSteps || 0);
    this.progress((this.state.index / total) * 100);
    this.body.innerHTML = '';

    var head = el('p', 'lm-quiz__step',
      'Question ' + (this.state.index + 1) + ' of ' + total +
      (step.domain ? ' &nbsp;·&nbsp; <span class="lm-quiz__domain">' + esc(step.domain) + '</span>' : ''));
    this.body.appendChild(head);
    this.body.appendChild(el('h3', 'lm-quiz__q', esc(step.text)));
    if (step.help) this.body.appendChild(el('p', 'lm-quiz__help', esc(step.help)));

    var opts = el('div', 'lm-opts');
    step.options.forEach(function (option, i) {
      var btn = el('button', 'lm-opt');
      btn.type = 'button';
      btn.innerHTML = '<span class="lm-opt__key">' + esc(option.key || (i + 1)) + '</span>' +
        '<span>' + esc(option.label) + '</span>';
      if (self.state.answers[step.id] &&
          self.state.answers[step.id].value === option.value) btn.classList.add('is-selected');
      btn.addEventListener('click', function () { self.answer(step, option); });
      opts.appendChild(btn);
    });
    this.body.appendChild(opts);

    var nav = el('div', 'lm-quiz__nav');
    if (this.state.index > 0) {
      var back = el('button', 'lm-link', '&larr; Back');
      back.type = 'button';
      back.addEventListener('click', function () {
        self.state.index = Math.max(0, self.state.index - 1);
        self.paint();
      });
      nav.appendChild(back);
    } else {
      nav.appendChild(el('span', 'lm-quiz__note', 'Takes about ' + esc(this.cfg.minutes || 2) + ' minutes'));
    }
    nav.appendChild(el('span', 'lm-quiz__note', 'Private — nothing is stored until you ask for the report'));
    this.body.appendChild(nav);

    if (!this.started) {
      this.started = true;
      track('lead_magnet_start', { magnet_id: this.cfg.id, magnet_name: this.cfg.name });
    }
    if (this.state.index > 0) this.shell.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  Quiz.prototype.answer = function (step, option) {
    var self = this;
    this.state.answers[step.id] = {
      value: option.value, label: option.label, domain: step.domain, text: step.text,
    };
    if (step.resets) {
      // Changing the age band invalidates every milestone answer below it.
      Object.keys(this.state.answers).forEach(function (key) {
        if (key !== step.id) delete self.state.answers[key];
      });
    }
    this.state.index += 1;
    window.setTimeout(function () { self.paint(); }, 140);
  };

  Quiz.prototype.showResult = function () {
    var self = this;
    var result = this.cfg.interpret(this.state);
    this.result = result;
    this.progress(100);
    this.body.innerHTML = '';

    if (result.alert) {
      var alertBox = el('div', 'lm-guide__box lm-guide__box--warn', result.alert);
      alertBox.style.marginTop = '0';
      this.body.appendChild(alertBox);
    }

    var band = el('span', 'lm-result__band lm-band--' + result.band, esc(result.bandLabel));
    this.body.appendChild(band);
    this.body.appendChild(el('h3', 'lm-result__title', esc(result.title)));
    this.body.appendChild(el('p', 'lm-result__summary', result.summary));

    if (result.meters && result.meters.length) {
      var meters = el('div', 'lm-meters');
      result.meters.forEach(function (m) {
        var box = el('div', 'lm-meter');
        box.innerHTML =
          '<div class="lm-meter__head">' +
            '<span class="lm-meter__label">' + esc(m.label) + '</span>' +
            '<span class="lm-meter__level lm-meter__level--' + m.level + '">' + esc(m.levelLabel) + '</span>' +
          '</div>' +
          '<div class="lm-meter__track"><div class="lm-meter__fill lm-meter__fill--' + m.level +
            '" style="width:' + Math.round(m.pct) + '%"></div></div>' +
          (m.note ? '<p class="lm-meter__note">' + esc(m.note) + '</p>' : '');
        meters.appendChild(box);
      });
      this.body.appendChild(meters);
    }

    if (result.actions && result.actions.length) {
      var actions = el('div', 'lm-actions');
      actions.innerHTML = '<h4>' + esc(result.actionsTitle || 'What we suggest next') + '</h4><ol>' +
        result.actions.map(function (a) { return '<li>' + a + '</li>'; }).join('') + '</ol>';
      this.body.appendChild(actions);
    }

    this.body.appendChild(el('p', 'lm-disclaimer', this.cfg.disclaimer ||
      'This is an educational screening tool, not a diagnosis. Only a qualified clinician can ' +
      'diagnose after a full assessment. If you are worried about immediate safety, call our team ' +
      'on <a href="tel:+919971576800">+91 99715 76800</a>.'));

    this.body.appendChild(this.captureBlock());

    var retake = el('button', 'lm-link', 'Start again');
    retake.type = 'button';
    retake.style.marginTop = '1.25rem';
    retake.addEventListener('click', function () {
      self.state = { answers: {}, index: 0 };
      self.paint();
    });
    this.body.appendChild(retake);

    fixLinks(this.body);
    this.shell.scrollIntoView({ behavior: 'smooth', block: 'start' });
    track('lead_magnet_complete', {
      magnet_id: this.cfg.id, magnet_name: this.cfg.name,
      result_band: result.band, result_score: result.score,
    });
  };

  /* ------------------------------------------------------- lead capture */

  Quiz.prototype.captureBlock = function () {
    var self = this;
    var cfg = this.cfg;
    var wrap = el('div', 'lm-capture');
    var saved = {};
    try { saved = JSON.parse(store(LM.LEAD_KEY) || '{}'); } catch (e) { saved = {}; }

    wrap.innerHTML =
      '<h3 class="lm-capture__title">' + esc(cfg.offer.title) + '</h3>' +
      '<p class="lm-capture__sub">' + cfg.offer.subtitle + '</p>' +
      '<ul class="lm-capture__bullets">' +
        cfg.offer.bullets.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') +
      '</ul>' +
      '<form novalidate>' +
        '<div class="lm-fields lm-fields--2">' +
          '<div class="lm-field"><label for="lm-name">Your name</label>' +
            '<input id="lm-name" name="name" type="text" autocomplete="name" placeholder="First and last name" value="' + esc(saved.name || '') + '"></div>' +
          '<div class="lm-field"><label for="lm-email">Email</label>' +
            '<input id="lm-email" name="email" type="email" autocomplete="email" placeholder="you@example.com" value="' + esc(saved.email || '') + '"></div>' +
        '</div>' +
        '<div class="lm-fields">' +
          '<div class="lm-field"><label for="lm-phone">Mobile number (we send the report on WhatsApp too)</label>' +
            '<input id="lm-phone" name="phone" type="tel" autocomplete="tel" placeholder="10-digit mobile number" value="' + esc(saved.phone || '') + '"></div>' +
        '</div>' +
        '<label class="lm-consent"><input type="checkbox" name="consent_check">' +
          '<span>I agree that eMbrace may contact me about my results by email, phone or WhatsApp, ' +
          'and I have read the <a href="/privacypolicy" target="_blank" rel="noopener">privacy policy</a>.</span></label>' +
        '<p class="lm-error" hidden></p>' +
        '<button type="submit" class="lm-btn lm-btn--gold lm-btn--wide" style="margin-top:1.15rem">' +
          esc(cfg.offer.button) + '</button>' +
        '<p class="lm-fineprint">No spam. One report, a short follow-up, and you can unsubscribe in a click. ' +
        'Your answers are never shared outside eMbrace\'s clinical team.</p>' +
      '</form>';

    var form = wrap.querySelector('form');
    var error = wrap.querySelector('.lm-error');

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var name = form.elements.name.value.trim();
      var email = form.elements.email.value.trim();
      var phone = form.elements.phone.value.trim();
      var digits = phone.replace(/[^0-9]/g, '');
      var problems = [];

      [form.elements.name, form.elements.email, form.elements.phone]
        .forEach(function (f) { f.classList.remove('is-error'); });

      if (name.length < 2) { problems.push('your name'); form.elements.name.classList.add('is-error'); }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { problems.push('a valid email'); form.elements.email.classList.add('is-error'); }
      if (digits.length < 10 || digits.length > 13) { problems.push('a valid mobile number'); form.elements.phone.classList.add('is-error'); }
      if (!form.elements.consent_check.checked) problems.push('your consent to be contacted');

      if (problems.length) {
        error.hidden = false;
        error.textContent = 'Please add ' + problems.join(', ') + '.';
        return;
      }
      error.hidden = true;
      form.querySelector('button[type="submit"]').disabled = true;
      form.querySelector('button[type="submit"]').textContent = 'Sending your report…';

      store(LM.LEAD_KEY, JSON.stringify({ name: name, email: email, phone: phone }));
      self.send({ name: name, email: email, phone: phone }, wrap);
    });

    return wrap;
  };

  /**
   * Posts to Formester through a hidden iframe so the result page survives.
   * The iframe's load event confirms the round trip; a timer covers the case
   * where a cross-origin redirect never fires a readable load.
   */
  Quiz.prototype.send = function (lead, wrap) {
    var self = this;
    var result = this.result;
    var query = params();
    var sink = el('iframe');
    sink.name = 'lm-sink-' + this.cfg.id;
    sink.style.display = 'none';
    document.body.appendChild(sink);

    var form = el('form');
    form.method = 'POST';
    form.action = this.cfg.formAction || LM.FORM_ACTION;
    form.target = sink.name;
    form.acceptCharset = 'UTF-8';
    form.style.display = 'none';

    var answers = Object.keys(this.state.answers).map(function (key) {
      var a = self.state.answers[key];
      return a.text + ' => ' + a.label;
    }).join(' | ');

    var priority = result.band === 'red' ? 'high' : (result.band === 'amber' ? 'medium' : 'low');
    var utm = ['utm_source', 'utm_medium', 'utm_campaign']
      .filter(function (k) { return query[k]; })
      .map(function (k) { return k.replace('utm_', '') + '=' + query[k]; }).join(', ');

    // Everything the intake team needs, in one field the appointment form
    // definitely has — a form builder that ignores unknown field names cannot
    // silently swallow the result.
    var digest = [
      'FREE TOOL LEAD — ' + this.cfg.name,
      'Result: ' + result.bandLabel + ' (score ' + result.score + '/100)',
      'Priority: ' + priority.toUpperCase(),
      'Summary: ' + (result.plain || result.title),
      'Page: ' + window.location.pathname,
      'Source: ' + (utm || document.referrer || 'direct'),
      '',
      'ANSWERS',
      Object.keys(this.state.answers).map(function (key) {
        var a = self.state.answers[key];
        return '- ' + a.text + '  ->  ' + a.label;
      }).join('\n'),
      '',
      'Screening tool only — not a diagnosis.',
    ].join('\n');

    var fields = {
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      form_type: 'lead_magnet',
      lead_source: 'website_free_tool',
      magnet_id: this.cfg.id,
      magnet_name: this.cfg.name,
      result_band: result.band,
      result_label: result.bandLabel,
      result_score: String(result.score == null ? '' : result.score),
      result_summary: result.plain || result.title,
      answers: answers,
      priority: priority,
      source_page: window.location.pathname,
      referrer: document.referrer || 'direct',
      utm_source: query.utm_source || '',
      utm_medium: query.utm_medium || '',
      utm_campaign: query.utm_campaign || '',
      submitted_at: new Date().toISOString(),
      // Appointment-form fields, so the entry reads correctly in the shared inbox.
      parent_name: lead.name,
      condition: result.conditionTag || this.cfg.conditionTag || '',
      specialty: this.cfg.specialtyTag || '',
      message: digest,
    };

    Object.keys(fields).forEach(function (key) {
      var input = el('input');
      input.type = 'hidden';
      input.name = key;
      input.value = fields[key];
      form.appendChild(input);
    });

    document.body.appendChild(form);

    var done = false;
    function finish() {
      if (done) return;
      done = true;
      self.showSuccess(wrap, lead);
    }
    sink.addEventListener('load', finish);
    window.setTimeout(finish, 2500);
    form.submit();

    track('generate_lead', {
      magnet_id: this.cfg.id, magnet_name: this.cfg.name,
      result_band: result.band, value: 1, currency: 'INR',
    });
  };

  Quiz.prototype.showSuccess = function (wrap, lead) {
    var cfg = this.cfg;
    var result = this.result;
    var box = el('div', 'lm-success');
    var msg = 'Hi eMbrace, I just completed the ' + cfg.name + ' on your website (' +
      result.bandLabel + '). I would like to talk to someone about the next step.';

    box.innerHTML =
      '<div class="lm-success__tick">✓</div>' +
      '<h3>' + esc(lead.name.split(' ')[0]) + ', your report is on its way.</h3>' +
      '<p>We have emailed a copy to <strong>' + esc(lead.email) + '</strong>. ' +
      'You can open your guide right now — it is yours to keep and print.</p>' +
      '<div class="lm-success__cta">' +
        '<a class="lm-btn lm-btn--primary" href="' + esc(cfg.guide.url) + '" target="_blank" rel="noopener">' +
          'Open ' + esc(cfg.guide.title) + '</a>' +
        '<a class="lm-btn lm-btn--ghost" href="/appointment">Book a consultation</a>' +
        '<a class="lm-btn lm-btn--ghost" href="' + esc(whatsappHref(msg)) + '" target="_blank" rel="noopener">' +
          'Ask a question on WhatsApp</a>' +
      '</div>';

    wrap.parentNode.replaceChild(box, wrap);
    fixLinks(box);
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
    store('embrace_lm_' + cfg.id, 'done');
  };

  LM.init = function (config) { return new Quiz(config); };

  /* -------------------------------------------------------------- popup */

  /**
   * Shows a single, gentle prompt for the home page's headline tool.
   * Triggers on exit intent (desktop) or 55% scroll depth (mobile), once,
   * and stays quiet for 7 days after a dismissal or a click-through.
   */
  LM.popup = function (options) {
    var node = document.getElementById(options.id || 'lm-popup');
    if (!node) return;
    var key = 'embrace_popup_seen';
    var last = Number(store(key) || 0);
    if (Date.now() - last < 7 * 24 * 60 * 60 * 1000) return;

    var opened = false;
    function open(reason) {
      if (opened) return;
      opened = true;
      node.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      store(key, String(Date.now()));
      track('lead_magnet_popup_view', { trigger: reason });
    }
    function close() {
      node.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    node.addEventListener('click', function (event) {
      if (event.target === node || event.target.hasAttribute('data-lm-close')) close();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') close();
    });

    document.addEventListener('mouseout', function (event) {
      if (!event.relatedTarget && event.clientY <= 6) open('exit_intent');
    });

    var scrollFired = false;
    window.addEventListener('scroll', function () {
      if (scrollFired) return;
      var height = document.body.scrollHeight - window.innerHeight;
      if (height > 0 && window.scrollY / height > 0.55) {
        scrollFired = true;
        open('scroll_depth');
      }
    }, { passive: true });
  };

  /* --------------------------------------------------- outbound tracking */

  document.addEventListener('click', function (event) {
    var link = event.target.closest ? event.target.closest('[data-lm-cta]') : null;
    if (link) track('lead_magnet_click', { magnet_id: link.getAttribute('data-lm-cta'), placement: link.getAttribute('data-lm-placement') || 'unknown' });
  });

  window.EmbraceLM = LM;
})(window, document);
