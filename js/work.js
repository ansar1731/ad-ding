/* ═══════════════════════════════════════════════════════
   work.js – Ad-Ding! Work / Case Studies Page
   Handles: scroll reveal, filter, result counters,
            clients marquee, forms, footer accordions
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
  var clients = [
    { name: 'Apollo',             logo: 'assets/clients_logo/Apollo Black logo.webp' },
    { name: 'Base 6',             logo: 'assets/clients_logo/Base 6 black logo_.webp' },
    { name: 'Bliss Club',         logo: 'assets/clients_logo/Bliss club black.webp' },
    { name: 'Midori',             logo: 'assets/clients_logo/Midori black logo.webp' },
    { name: 'Native Forever',     logo: 'assets/clients_logo/Native Forever black logo_.webp' },
    { name: 'Safeera',            logo: 'assets/clients_logo/Safeera Black logo_.webp' },
    { name: 'Punjabi Saraf',      logo: 'assets/clients_logo/Punjabi Saraf block logo.webp' },
    { name: 'Saaki',              logo: 'assets/clients_logo/Saaki black logo.webp' },
    { name: 'Plan the Unplanned', logo: 'assets/clients_logo/Plan the unplanned black.webp' },
    { name: 'TGL Company',        logo: 'assets/clients_logo/TGL company black.webp' },
    { name: 'Vrede',              logo: 'assets/clients_logo/Vrede Black logo (1).webp' },
  ];
  var frag = document.createDocumentFragment();
  clients.concat(clients).forEach(function (c) {
    var item = document.createElement('div');
    item.className = 'client-logo';
    var img = document.createElement('img');
    img.src     = c.logo;
    img.alt     = c.name;
    img.loading = 'lazy';
    img.width   = 80;
    img.height  = 32;
    item.appendChild(img);
    frag.appendChild(item);
  });
  track.appendChild(frag);
})();

// ─── Scroll Reveal ────────────────────────────────────
(function () {
  if (!('IntersectionObserver' in window)) {
    qsa('.wk-reveal').forEach(function (el) { el.classList.add('visible'); });
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  qsa('.wk-reveal').forEach(function (el) { observer.observe(el); });
})();

// ─── Case Study Filter ────────────────────────────────
(function () {
  var pills      = qsa('.wf-pill');
  var cards      = qsa('.wk-card');
  var noResults  = qs('#work-no-results');
  var activeFilter = 'all';

  function applyFilter(filter) {
    activeFilter = filter;
    var visible  = 0;
    cards.forEach(function (card) {
      var cats = (card.getAttribute('data-category') || '').split(' ');
      var show = filter === 'all' || cats.indexOf(filter) !== -1;
      card.classList.toggle('wk-card--filtered-out', !show);
      if (show) visible++;
    });
    if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
  }

  pills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      pills.forEach(function (p) { p.classList.remove('active'); });
      pill.classList.add('active');
      applyFilter(pill.getAttribute('data-filter'));
    });
  });

  window.resetFilter = function () {
    pills.forEach(function (p) { p.classList.remove('active'); });
    var allPill = qs('.wf-pill[data-filter="all"]');
    if (allPill) allPill.classList.add('active');
    applyFilter('all');
  };
})();

// ─── Result Number Counters (reserved for future case study expansion) ───────
// No .wk-result-num elements currently in the DOM; this is ready if added.
(function () {
  var counters = qsa('.wk-result-num');
  if (!counters.length) return;

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el) {
    var target   = parseFloat(el.getAttribute('data-target'));
    var isFloat  = String(target).indexOf('.') !== -1;
    var duration = 1400;
    var start    = performance.now();

    function step(now) {
      var progress = Math.min((now - start) / duration, 1);
      var current  = easeOutCubic(progress) * target;
      el.textContent = isFloat ? current.toFixed(1) : Math.round(current);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = isFloat ? target.toFixed(1) : target;
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
    }, { threshold: 0.6 });
    counters.forEach(function (el) { io.observe(el); });
  }
})();

// ─── Footer Accordions (mobile) ──────────────────────
(function () {
  qsa('.accordion-header').forEach(function (h) {
    h.addEventListener('click', function () {
      var acc  = h.closest('.footer-accordion');
      var open = acc.classList.toggle('active');
      h.setAttribute('aria-expanded', open);
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
    var name    = form.elements['name'].value.trim();
    var email   = form.elements['email'].value.trim();
    var message = form.elements['message'].value.trim();

    if (!name || !email || !message) {
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
        setStatus(status, '✓ Message sent! We\'ll be in touch within 1 business day.', 'success');
        form.reset();
      } else {
        throw new Error('Submission failed');
      }
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
    var email = form.elements['email'].value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (status) {
        status.textContent = 'Please enter a valid email.';
        status.className   = 'cf-status cf-status--error';
      }
      return;
    }
    if (status) {
      status.textContent = '✓ You\'re subscribed!';
      status.className   = 'cf-status cf-status--success';
    }
    form.reset();
  });
})();