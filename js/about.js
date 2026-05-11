/* ═══════════════════════════════════════════════════════
   about.js – Ad Ding About Page
   Handles: scroll reveal, counter animation, clients marquee,
            FAQ accordion, footer accordions, contact form,
            newsletter form, language switcher
═══════════════════════════════════════════════════════ */

'use strict';

function qs(sel, ctx)  { return (ctx || document).querySelector(sel); }
function qsa(sel, ctx) { return (ctx || document).querySelectorAll(sel); }

// ─── Announcement Bar ────────────────────────────────
(function () {
  var bar   = qs('#ann-bar');
  var close = qs('#ann-close');
  if (!bar || !close) return;
  close.addEventListener('click', function () { bar.classList.add('hidden'); });
})();

// ─── Mobile Menu ─────────────────────────────────────
(function () {
  var btn  = qs('#hamburger');
  var menu = qs('#mobile-menu');
  if (!btn || !menu) return;
  btn.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    menu.setAttribute('aria-hidden', !open);
  });
  document.addEventListener('click', function (e) {
    if (!menu.contains(e.target) && !btn.contains(e.target)) {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
    }
  });
})();

// ─── Demo Modal ──────────────────────────────────────
var modalOverlay = qs('#modal-overlay');
var modalIframe  = qs('#modal-iframe');
var DEMO_URL     = 'https://calendly.com/adding-marketing/growth-audit';

function openModal() {
  if (!modalOverlay || !modalIframe) return;
  modalIframe.src = DEMO_URL;
  modalOverlay.classList.add('open');
  modalOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  if (!modalOverlay || !modalIframe) return;
  modalOverlay.classList.remove('open');
  modalOverlay.setAttribute('aria-hidden', 'true');
  modalIframe.src = '';
  document.body.style.overflow = '';
}
window.openModal  = openModal;
window.closeModal = closeModal;

if (modalOverlay) {
  modalOverlay.addEventListener('click', function (e) {
    if (e.target === modalOverlay) closeModal();
  });
}
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeModal();
});

// ─── Clients Marquee ─────────────────────────────────
(function () {
  var track = qs('#clients-track');
  if (!track) return;

  var logos = [
    { name: 'Apollo',           src: 'assets/clients_logo/Apollo Black logo.webp' },
    { name: 'Base 6',           src: 'assets/clients_logo/Base 6 black logo_.webp' },
    { name: 'Bliss Club',       src: 'assets/clients_logo/Bliss club black.webp' },
    { name: 'Midori',           src: 'assets/clients_logo/Midori black logo.webp' },
    { name: 'Native Forever',   src: 'assets/clients_logo/Native Forever black logo_.webp' },
    { name: 'Safeera',          src: 'assets/clients_logo/Safeera Black logo_.webp' },
    { name: 'Punjabi Saraf',    src: 'assets/clients_logo/Punjabi Saraf block logo.webp' },
    { name: 'Saaki',            src: 'assets/clients_logo/Saaki black logo.webp' },
    { name: 'Plan the Unplanned', src: 'assets/clients_logo/Plan the unplanned black.webp' },
    { name: 'TGL Company',      src: 'assets/clients_logo/TGL company black.webp' },
    { name: 'Vrede',            src: 'assets/clients_logo/Vrede Black logo (1).webp' },
  ];

  // Duplicate for seamless loop
  var all = logos.concat(logos);
  var html = all.map(function (l) {
    return '<div class="client-logo"><img src="' + l.src + '" alt="' + l.name + ' logo" loading="lazy" height="32"/></div>';
  }).join('');
  track.innerHTML = html;
})();

// ─── Scroll Reveal ────────────────────────────────────
(function () {
  if (!('IntersectionObserver' in window)) {
    qsa('.reveal').forEach(function (el) { el.classList.add('visible'); });
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  qsa('.reveal').forEach(function (el) { observer.observe(el); });
})();

// ─── Counter Animation ────────────────────────────────
(function () {
  var counters = qsa('.origin-stat-num');
  if (!counters.length) return;

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el) {
    var target   = parseInt(el.getAttribute('data-target'), 10);
    if (!target) return;
    var duration = 1600;
    var start    = performance.now();

    function step(now) {
      var progress = Math.min((now - start) / duration, 1);
      var current  = Math.round(easeOutCubic(progress) * target);
      el.textContent = current;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { io.observe(el); });
  }
})();

// ─── Footer Accordions (mobile) ──────────────────────
(function () {
  var headers = qsa('.accordion-header');
  headers.forEach(function (header) {
    header.addEventListener('click', function () {
      var expanded  = header.getAttribute('aria-expanded') === 'true';
      var contentId = header.getAttribute('aria-controls');
      var content   = contentId ? qs('#' + contentId) : null;
      var icon      = header.querySelector('.icon');

      qsa('.accordion-header').forEach(function (h) {
        h.setAttribute('aria-expanded', 'false');
        var cId = h.getAttribute('aria-controls');
        if (cId) { var c = qs('#' + cId); if (c) c.style.maxHeight = '0'; }
        var ic = h.querySelector('.icon');
        if (ic) ic.textContent = '+';
      });

      if (!expanded) {
        header.setAttribute('aria-expanded', 'true');
        if (content) content.style.maxHeight = content.scrollHeight + 'px';
        if (icon) icon.textContent = '−';
      }
    });
  });
})();

// ─── Contact Form ─────────────────────────────────────
(function () {
  var form   = qs('#contact-form');
  var status = qs('#cf-status');
  if (!form || !status) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name    = (form.querySelector('[name="name"]') || {}).value || '';
    var email   = (form.querySelector('[name="email"]') || {}).value || '';
    var message = (form.querySelector('[name="message"]') || {}).value || '';

    if (!name.trim() || !email.trim() || !message.trim()) {
      status.textContent = 'Please fill in all required fields.';
      status.style.color = '#e03030'; return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status.textContent = 'Please enter a valid email address.';
      status.style.color = '#e03030'; return;
    }

    var btn = form.querySelector('.cf-submit');
    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
    status.textContent = '';

    setTimeout(function () {
      status.textContent = '✓ Message sent! We\'ll be in touch within 1 business day.';
      status.style.color = '#86efac';
      form.reset();
      if (btn) { btn.disabled = false; btn.textContent = 'Send Message →'; }
    }, 1200);
  });
})();

// ─── Newsletter Form ──────────────────────────────────
(function () {
  var form   = qs('#newsletter-form');
  var status = qs('#nl-status');
  if (!form || !status) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var input = form.querySelector('[name="email"]');
    var email = input ? input.value.trim() : '';
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status.textContent = 'Please enter a valid email.';
      status.style.color = '#fca5a5'; return;
    }
    status.textContent = '✓ You\'re subscribed!';
    status.style.color = '#86efac';
    form.reset();
  });
})();

// ─── Language Switcher ────────────────────────────────
(function () {
  function applyLang(code) {
    var labels = { en: '🇺🇸 En', fr: '🇫🇷 Fr', es: '🇪🇸 Es', tr: '🇹🇷 Tr' };
    var langBtn = qs('.lang-btn');
    if (langBtn) {
      langBtn.innerHTML =
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
        + ' ' + (labels[code] || 'En') + ' <span>▾</span>';
    }
    document.documentElement.lang = code;
    try { localStorage.setItem('ad-ding-lang', code); } catch(e) {}
  }

  qsa('.lang-menu button[data-lang]').forEach(function (btn) {
    btn.addEventListener('click', function () { applyLang(btn.getAttribute('data-lang')); });
  });

  var saved;
  try { saved = localStorage.getItem('ad-ding-lang'); } catch(e) {}
  if (saved) applyLang(saved);
})();