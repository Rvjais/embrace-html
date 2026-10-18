/* The secret key belongs in Formester's spam-protection settings, never here. */
(function (window, document) {
  'use strict';

  var SITE_KEY = '6Ld9k-MtAAAAAOWDLl3Vq6sW9_upqoHLMLA4UzM3';
  var widgets = new WeakMap();
  var loading;

  /**
   * The reCAPTCHA site key is domain-restricted in Google's console to the
   * live site, so it always fails with "not in the list of supported
   * domains" when testing against a local PHP dev server. This check only
   * ever matches an exact localhost-style hostname — never a real domain,
   * and never anything an outside request could spoof, since the bypass
   * only runs in the visitor's own browser against window.location, which a
   * remote attacker cannot set. A fake token from here would still be
   * rejected server-side by Formester's secret-key check on any real host.
   */
  function isLocalDev() {
    var h = window.location.hostname;
    return h === 'localhost' || h === '127.0.0.1' || h === '::1' || h === '0.0.0.0';
  }

  function loadApi() {
    if (window.grecaptcha && window.grecaptcha.render) return Promise.resolve();
    if (loading) return loading;
    loading = new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      var timer = window.setTimeout(function () { fail(); }, 15000);
      function fail() {
        window.clearTimeout(timer);
        script.remove();
        loading = null;
        reject(new Error('CAPTCHA could not load. Check your connection and try again.'));
      }
      window.embraceRecaptchaLoaded = function () {
        window.clearTimeout(timer);
        resolve();
      };
      script.src = 'https://www.google.com/recaptcha/api.js?onload=embraceRecaptchaLoaded&render=explicit';
      script.async = true;
      script.defer = true;
      script.onerror = fail;
      document.head.appendChild(script);
    });
    return loading;
  }

  function mount(container) {
    if (widgets.has(container)) return Promise.resolve();
    if (isLocalDev()) {
      container.textContent = '';
      var note = document.createElement('p');
      note.style.cssText = 'margin:0;font-size:13px;color:#8a6100;background:#fff3d9;' +
        'border-radius:8px;padding:.6rem .8rem';
      note.textContent = 'CAPTCHA skipped — local dev only (' + window.location.hostname + ').';
      container.appendChild(note);
      widgets.set(container, { local: true });
      return Promise.resolve();
    }
    container.textContent = 'Loading CAPTCHA…';
    return loadApi().then(function () {
      if (widgets.has(container) || !container.isConnected) return;
      container.textContent = '';
      var target = document.createElement('div');
      var status = document.createElement('p');
      status.setAttribute('role', 'alert');
      status.style.cssText = 'margin:8px 0 0;font-size:14px;color:#b91c1c';
      container.appendChild(target);
      container.appendChild(status);
      var id = window.grecaptcha.render(target, {
        sitekey: SITE_KEY,
        size: container.clientWidth < 304 ? 'compact' : 'normal',
        callback: function () { status.textContent = ''; },
        'expired-callback': function () {
          status.textContent = 'CAPTCHA expired. Please verify again before submitting.';
        },
        'error-callback': function () {
          status.textContent = 'CAPTCHA could not connect. Check your connection and try again.';
        },
      });
      widgets.set(container, { id: id, status: status });
    }).catch(function (error) {
      container.textContent = error.message;
      throw error;
    });
  }

  function token(container) {
    var widget = widgets.get(container);
    if (widget && widget.local) return 'local-dev-bypass';
    var response = widget && window.grecaptcha.getResponse(widget.id);
    if (!response) {
      var message = 'Please complete the “I’m not a robot” CAPTCHA before submitting.';
      if (widget) widget.status.textContent = message;
      throw new Error(message);
    }
    return response;
  }

  window.EmbraceCaptcha = {
    mount: mount,
    token: token,
    reset: function (container) {
      var widget = widgets.get(container);
      if (widget && !widget.local) window.grecaptcha.reset(widget.id);
    },
  };

  function bindForms() {
    document.querySelectorAll('form[data-recaptcha]').forEach(function (form) {
      var container = form.querySelector('[data-captcha-widget]');
      mount(container).catch(function () {});
      form.addEventListener('submit', function (event) {
        try {
          token(container);
        } catch (error) {
          event.preventDefault();
          mount(container).catch(function () {});
          container.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bindForms);
  else bindForms();
})(window, document);
