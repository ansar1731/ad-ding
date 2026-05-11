/* ═══════════════════════════════════════════════════════
   services.js – Ad Ding Services Page
   Handles: FAQ accordion, scroll reveal, contact form,
            newsletter, footer accordions, counter animation
═══════════════════════════════════════════════════════ */

'use strict';

// ─── Utilities ────────────────────────────────────────
function qs(sel, ctx)  { return (ctx || document).querySelector(sel); }
function qsa(sel, ctx) { return (ctx || document).querySelectorAll(sel); }

// ─── Announcement Bar ────────────────────────────────
(function () {
  var bar   = qs('#ann-bar');
  var close = qs('#ann-close');
  if (!bar || !close) return;
  close.addEventListener('click', function () {
    bar.classList.add('hidden');
  });
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

// // ─── FAQ Accordion ────────────────────────────────────
// (function () {
//   var items = qsa('.faq-item');
//   if (!items.length) return;

//   items.forEach(function (item) {
//     var btn    = item.querySelector('.faq-q');
//     var answer = item.querySelector('.faq-a');
//     if (!btn || !answer) return;

//     btn.addEventListener('click', function () {
//       var isOpen = item.classList.contains('open');

//       // Close all
//       items.forEach(function (other) {
//         other.classList.remove('open');
//         var otherBtn = other.querySelector('.faq-q');
//         var otherAns = other.querySelector('.faq-a');
//         if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
//         if (otherAns) otherAns.style.maxHeight = '0';
//       });

//       // Open clicked (if it was closed)
//       if (!isOpen) {
//         item.classList.add('open');
//         btn.setAttribute('aria-expanded', 'true');
//         answer.style.maxHeight = answer.scrollHeight + 'px';
//       }
//     });
//   });
// })();

// ─── Footer Accordions (mobile) ──────────────────────
(function () {
  var headers = qsa('.accordion-header');
  headers.forEach(function (header) {
    header.addEventListener('click', function () {
      var expanded = header.getAttribute('aria-expanded') === 'true';
      var contentId = header.getAttribute('aria-controls');
      var content   = contentId ? qs('#' + contentId) : null;
      var icon      = header.querySelector('.icon');

      // Close all others
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

// ─── Scroll Reveal ────────────────────────────────────
(function () {
  // Add reveal class to key elements
  var targets = [
    '.svc-step',
    '.svc-card',
    '.svc-tier',
    '.svc-result-item',
    '.svc-testi-card',
    '.faq-item',
    '.svc-section-eyebrow',
    '.svc-section-title',
    '.svc-hero-stats',
    '.svc-compare-sub'
  ];

  targets.forEach(function (sel) {
    qsa(sel).forEach(function (el, i) {
      el.classList.add('reveal');
      // Stagger siblings
      var delayClass = 'reveal-delay-' + Math.min(i % 5 + 1, 5);
      el.classList.add(delayClass);
    });
  });

  // IntersectionObserver
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    qsa('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all
    qsa('.reveal').forEach(function (el) {
      el.classList.add('visible');
    });
  }
})();

// ─── Counter Animation ────────────────────────────────
(function () {
  var counters = qsa('.svc-result-num');
  if (!counters.length) return;

  function animateCounter(el) {
    var text = el.textContent || '';
    // Extract number and suffix
    var match = text.match(/^([\d.]+)(.*)$/);
    if (!match) return;
    var target  = parseFloat(match[1]);
    var suffix  = el.querySelector('.svc-result-plus') ? el.querySelector('.svc-result-plus').outerHTML : '';
    var isFloat = match[1].indexOf('.') !== -1;
    var duration = 1400;
    var start    = performance.now();

    function step(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      var current  = target * eased;
      var display  = isFloat ? current.toFixed(1) : Math.round(current);
      // Keep the plus/% element intact
      var plus = el.querySelector('.svc-result-plus');
      var plusText = plus ? plus.outerHTML : '';
      el.innerHTML = display + plusText;
      if (progress < 1) requestAnimationFrame(step);
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

// ─── Services Contact Form ────────────────────────────
(function () {
  var form   = qs('#contact-form-svc');
  var status = qs('#svc-cf-status');
  if (!form || !status) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name    = (form.querySelector('[name="name"]') || {}).value || '';
    var email   = (form.querySelector('[name="email"]') || {}).value || '';
    var message = (form.querySelector('[name="message"]') || {}).value || '';

    if (!name.trim() || !email.trim() || !message.trim()) {
      status.textContent = 'Please fill in all required fields.';
      status.style.color = '#e03030';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status.textContent = 'Please enter a valid email address.';
      status.style.color = '#e03030';
      return;
    }

    // Simulate send
    var btn = form.querySelector('.cf-submit');
    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
    status.textContent = '';

    setTimeout(function () {
      status.textContent = '✓ Message sent! We\'ll be in touch within 1 business day.';
      status.style.color = '#3a6d00';
      form.reset();
      if (btn) { btn.disabled = false; btn.textContent = 'Send Message →'; }
    }, 1200);
  });
})();

// ─── Newsletter Form ──────────────────────────────────
(function () {
  var form   = qs('#newsletter-form-svc');
  var status = qs('#nl-status-svc');
  if (!form || !status) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var input = form.querySelector('[name="email"]');
    var email = input ? input.value.trim() : '';
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status.textContent = 'Please enter a valid email.';
      status.style.color = '#e03030';
      return;
    }
    status.textContent = '✓ You\'re subscribed!';
    status.style.color = '#3a6d00';
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
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
        + ' ' + (labels[code] || 'En') + ' <span aria-hidden="true">▾</span>';
    }
    var mobileSelect = qs('.mobile-lang select');
    if (mobileSelect) mobileSelect.value = code;
    document.documentElement.lang = code;
    try { localStorage.setItem('ad-ding-lang', code); } catch(e) {}
  }

  qsa('.lang-menu button[data-lang]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyLang(btn.getAttribute('data-lang'));
    });
  });

  var mobileSelect = qs('.mobile-lang select');
  if (mobileSelect) {
    mobileSelect.addEventListener('change', function () { applyLang(this.value); });
  }

  var saved;
  try { saved = localStorage.getItem('ad-ding-lang'); } catch(e) {}
  if (saved) applyLang(saved);
})();