/* ═══════════════════════════════════════════════════════
   about.js – Ad-Ding! About Page
   NOTE: Announcement bar, mobile menu, and modal are
         handled by script.js (loaded on all pages).
═══════════════════════════════════════════════════════ */
'use strict';

function qs(sel, ctx)  { return (ctx || document).querySelector(sel); }
function qsa(sel, ctx) { return (ctx || document).querySelectorAll(sel); }

// ─── Clients Marquee ─────────────────────────────────
(function () {
  var track = qs('#clients-track');
  if (!track) return;
  var logos = [
    { name: 'Apollo',             src: 'assets/clients_logo/Apollo Black logo.webp' },
    { name: 'Base 6',             src: 'assets/clients_logo/Base 6 black logo_.webp' },
    { name: 'Bliss Club',         src: 'assets/clients_logo/Bliss club black.webp' },
    { name: 'Midori',             src: 'assets/clients_logo/Midori black logo.webp' },
    { name: 'Native Forever',     src: 'assets/clients_logo/Native Forever black logo_.webp' },
    { name: 'Safeera',            src: 'assets/clients_logo/Safeera Black logo_.webp' },
    { name: 'Punjabi Saraf',      src: 'assets/clients_logo/Punjabi Saraf block logo.webp' },
    { name: 'Saaki',              src: 'assets/clients_logo/Saaki black logo.webp' },
    { name: 'Plan the Unplanned', src: 'assets/clients_logo/Plan the unplanned black.webp' },
    { name: 'TGL Company',        src: 'assets/clients_logo/TGL company black.webp' },
    { name: 'Vrede',              src: 'assets/clients_logo/Vrede Black logo (1).webp' },
  ];
  var frag = document.createDocumentFragment();
  logos.concat(logos).forEach(function (l) {
    var item = document.createElement('div');
    item.className = 'client-logo';
    var img = document.createElement('img');
    img.src = l.src; img.alt = l.name + ' logo';
    img.loading = 'lazy'; img.decoding = 'async'; img.height = 32;
    item.appendChild(img);
    frag.appendChild(item);
  });
  track.appendChild(frag);
})();

// ─── Scroll Reveal ────────────────────────────────────
(function () {
  if (!('IntersectionObserver' in window)) {
    qsa('.reveal').forEach(function (el) { el.classList.add('visible'); });
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.12 });
  qsa('.reveal').forEach(function (el) { observer.observe(el); });
})();

// ─── Counter Animation (origin stats – reserved for future use) ──────────────
// The origin story section is currently hidden; this function is ready if re-enabled.
(function () {
  var counters = qsa('.origin-stat-num');
  if (!counters.length) return;
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    if (!target) return;
    var duration = 1600, start = performance.now();
    function step(now) {
      var p = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(easeOutCubic(p) * target);
      if (p < 1) requestAnimationFrame(step); else el.textContent = target;
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

// ─── Footer Accordions (consistent: class-toggle approach) ──
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

// ─── Contact Form ─────────────────────────────────────
(function () {
  var form   = qs('#contact-form');
  var status = qs('#cf-status');
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
  var form   = qs('#newsletter-form');
  var status = qs('#nl-status');
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