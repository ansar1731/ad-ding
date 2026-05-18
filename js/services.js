/* ═══════════════════════════════════════════════════════
   services.js – Ad-Ding! Services Page
   NOTE: Announcement bar, mobile menu, and modal are
         handled by script.js (loaded on all pages).
═══════════════════════════════════════════════════════ */
'use strict';

function qs(sel, ctx)  { return (ctx || document).querySelector(sel); }
function qsa(sel, ctx) { return (ctx || document).querySelectorAll(sel); }

// ─── FAQ Accordion ────────────────────────────────────
(function () {
  var items = qsa('.faq-item');
  if (!items.length) return;
  items.forEach(function (item) {
    var btn    = item.querySelector('.faq-q');
    var answer = item.querySelector('.faq-a');
    if (!btn || !answer) return;
    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      items.forEach(function (other) {
        other.classList.remove('open');
        var b = other.querySelector('.faq-q');
        var a = other.querySelector('.faq-a');
        if (b) b.setAttribute('aria-expanded', 'false');
        if (a) a.style.maxHeight = '0';
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
})();

// ─── Footer Accordions (consistent class-toggle) ──────
(function () {
  qsa('.footer-accordion').forEach(function (acc) {
    var header = acc.querySelector('.accordion-header');
    if (!header) return;
    header.addEventListener('click', function () {
      var open = acc.classList.toggle('active');
      header.setAttribute('aria-expanded', open);
    });
  });
})();

// ─── Scroll Reveal ────────────────────────────────────
(function () {
  var targets = [
    '.svc-step', '.svc-card', '.svc-tier', '.svc-result-item',
    '.svc-testi-card', '.faq-item', '.svc-section-eyebrow',
    '.svc-section-title', '.svc-hero-stats', '.svc-compare-sub',
  ];
  targets.forEach(function (sel) {
    qsa(sel).forEach(function (el, i) {
      el.classList.add('reveal');
      el.classList.add('reveal-delay-' + Math.min(i % 5 + 1, 5));
    });
  });
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    qsa('.reveal').forEach(function (el) { observer.observe(el); });
  } else {
    qsa('.reveal').forEach(function (el) { el.classList.add('visible'); });
  }
})();

// ─── Counter Animation ────────────────────────────────
(function () {
  var counters = qsa('.svc-result-num');
  if (!counters.length) return;
  function animateCounter(el) {
    var text  = el.textContent || '';
    var match = text.match(/^([\d.]+)(.*)$/);
    if (!match) return;
    var target = parseFloat(match[1]);
    var isFloat = match[1].indexOf('.') !== -1;
    var duration = 1400, start = performance.now();
    function step(now) {
      var p = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var current = target * eased;
      var plus = el.querySelector('.svc-result-plus');
      var plusHTML = plus ? plus.outerHTML : '';
      el.innerHTML = (isFloat ? current.toFixed(1) : Math.round(current)) + plusHTML;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { animateCounter(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { io.observe(el); });
  }
})();

// ─── Contact Form (real Formspree submission) ─────────
(function () {
  var form   = qs('#contact-form-svc');
  var status = qs('#svc-cf-status');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name    = (form.querySelector('[name="name"]')    || {}).value || '';
    var email   = (form.querySelector('[name="email"]')   || {}).value || '';
    var message = (form.querySelector('[name="message"]') || {}).value || '';

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus(status, 'Please fill in all required fields.', 'error'); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus(status, 'Please enter a valid email address.', 'error'); return;
    }

    var btn = form.querySelector('.cf-submit');
    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

    fetch('https://formspree.io/f/xykvgnwa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name: name, email: email, message: message }),
    })
    .then(function (res) {
      if (res.ok) {
        setStatus(status, "✓ Message sent! We'll be in touch within 1 business day.", 'success');
        form.reset();
      } else { throw new Error('failed'); }
    })
    .catch(function () {
      setStatus(status, 'Something went wrong. Please email hello@adding.marketing', 'error');
    })
    .finally(function () {
      if (btn) { btn.disabled = false; btn.textContent = 'Send Message →'; }
    });
  });

  function setStatus(el, msg, type) {
    if (!el) return;
    el.textContent = msg;
    el.className   = 'cf-status cf-status--' + type;
  }
})();

// ─── Newsletter Form ──────────────────────────────────
(function () {
  var form   = qs('#newsletter-form-svc');
  var status = qs('#nl-status-svc');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = (form.querySelector('[name="email"]') || {}).value || '';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      if (status) { status.textContent = 'Please enter a valid email.'; status.className = 'cf-status cf-status--error'; }
      return;
    }
    if (status) { status.textContent = "✓ You're subscribed!"; status.className = 'cf-status cf-status--success'; }
    form.reset();
  });
})();