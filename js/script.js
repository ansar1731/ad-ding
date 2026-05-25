/* ═══════════════════════════════════════════════════════
   script.js – Ad-Ding! Homepage
═══════════════════════════════════════════════════════ */

'use strict';

function qs(sel, ctx)  { return (ctx || document).querySelector(sel); }
function qsa(sel, ctx) { return (ctx || document).querySelectorAll(sel); }


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

// ─── Lead Capture Popup Modal ────────────────────────
(function () {
  var overlay = qs('#lead-modal-overlay');
  var closeBtn = qs('#lead-modal-close');

  function openLeadModal(source) {
    if (!overlay) return;
    var srcField = qs('#lm-source');
    if (srcField && source) srcField.value = source;
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var firstInput = overlay.querySelector('input');
    if (firstInput) setTimeout(function () { firstInput.focus(); }, 100);
  }
  function closeLeadModal() {
    if (!overlay) return;
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  window.openLeadModal  = openLeadModal;
  window.closeLeadModal = closeLeadModal;
  // Keep openModal as alias so any remaining references still work
  window.openModal  = openLeadModal;
  window.closeModal = closeLeadModal;

  if (closeBtn) closeBtn.addEventListener('click', closeLeadModal);
  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeLeadModal();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay && overlay.classList.contains('open')) closeLeadModal();
  });
})();


// ─── Lead Capture Popup Modal Form ───────────────────
(function () {
  var FORMSPREE = 'https://formspree.io/f/xykvgnwa';

  function handleLeadForm(formId, statusId, source) {
    var form   = qs('#' + formId);
    var status = qs('#' + statusId);
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name    = (form.elements['name']    || {}).value || '';
      var email   = (form.elements['email']   || {}).value || '';
      var phone   = (form.elements['phone']   || {}).value || '';
      var company = (form.elements['company'] || {}).value || '';
      var service = (form.elements['service'] || {}).value || '';
      var src     = (form.elements['source']  || {}).value || source;

      if (!name.trim() || !email.trim()) {
        setStatus(status, 'Please enter your name and email.', 'error'); return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setStatus(status, 'Please enter a valid email address.', 'error'); return;
      }

      var btn = form.querySelector('button[type="submit"]');
      var origText = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      setStatus(status, '', '');

      fetch(FORMSPREE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: name, email: email, phone: phone,
          company: company, service: service, source: src,
        }),
      })
      .then(function (res) {
        if (res.ok) {
          setStatus(status, "✓ Got it! We'll be in touch within 1 business day.", 'success');
          form.reset();
          // Close modal if this was the popup form
          if (formId === 'lead-modal-form' && typeof window.closeLeadModal === 'function') {
            setTimeout(window.closeLeadModal, 2000);
          }
        } else { throw new Error('failed'); }
      })
      .catch(function () {
        setStatus(status, 'Something went wrong. Please try again.', 'error');
      })
      .finally(function () {
        if (btn) { btn.disabled = false; btn.textContent = origText; }
      });
    });

    function setStatus(el, msg, type) {
      if (!el) return;
      el.textContent = msg;
      el.className   = type ? 'cf-status cf-status--' + type : 'cf-status';
    }
  }

  // Popup modal form
  handleLeadForm('lead-modal-form',   'lead-modal-status', 'Popup modal');
  // Lead section above clients
  handleLeadForm('lead-capture-form', 'lc-status',         'Lead section — above clients');
  // Footer lead form
  handleLeadForm('footer-lead-form',  'fl-status',         'Footer lead form');
})();

// ─── Hero Ad Carousel (vertical scroll columns) ──────
(function () {
  var wrap = qs('#carousel-wrap');
  if (!wrap) return;
  var imageFiles = [
    { src: 'assets/Hero Carousal 1.avif', h: 560 },
    { src: 'assets/Hero Carousal 2.avif', h: 480 },
    { src: 'assets/Hero Carousal 3.avif', h: 560 },
    { src: 'assets/Hero Carousal 4.avif', h: 480 },
  ];
  var colDirs = ['col-down', 'col-up', 'col-down', 'col-up'];
  var frag = document.createDocumentFragment();
  colDirs.forEach(function (dir, colIdx) {
    var col = document.createElement('div');
    col.className = 'carousel-col ' + dir;
    for (var set = 0; set < 3; set++) {
      for (var r = 0; r < 3; r++) {
        var idx = (colIdx * 3 + r + set * 4) % imageFiles.length;
        var img = document.createElement('img');
        img.src      = imageFiles[idx].src;
        img.alt      = '';
        img.loading  = 'lazy';
        img.decoding = 'async';
        img.style.height = imageFiles[idx].h + 'px';
        img.width    = 200;
        col.appendChild(img);
      }
    }
    frag.appendChild(col);
  });
  wrap.appendChild(frag);
})();

// ─── Client Logos Marquee (two rows, opposite directions) ──
(function () {
  var row1 = qs('#clients-row-1');
  var row2 = qs('#clients-row-2');
  if (!row1 && !row2) return;

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

  function buildRow(el, items) {
    if (!el) return;
    var doubled = items.concat(items);
    var frag = document.createDocumentFragment();
    doubled.forEach(function (c) {
      var item = document.createElement('div');
      item.className = 'client-logo';
      var img = document.createElement('img');
      img.src      = c.logo;
      img.alt      = c.name + ' logo';
      img.loading  = 'lazy';
      img.decoding = 'async';
      img.height   = 36;
      item.appendChild(img);
      frag.appendChild(item);
    });
    el.appendChild(frag);
  }

  // Row 1: first 11 logos (forward)
  buildRow(row1, clients);
  // Row 2: reversed order (reverse direction via CSS)
  buildRow(row2, clients.slice().reverse());
})();

// ─── Work Cards + Carousel ────────────────────────────
(function () {
  var isDesktop = function () { return window.innerWidth >= 992; };
  var cards     = qsa('[data-card]');
  var openCard  = null;

  function expand(card) {
    var exp = card.querySelector('.work_card_expanded');
    var img = card.querySelector('.work_card_image');
    if (exp) exp.style.transform = 'translateY(0%)';
    if (img) img.style.transform = 'translateY(-10%)';
  }
  function collapse(card) {
    var exp = card.querySelector('.work_card_expanded');
    var img = card.querySelector('.work_card_image');
    if (exp) exp.style.transform = 'translateY(80%)';
    if (img) img.style.transform = 'translateY(0)';
  }

  cards.forEach(function (card) {
    card.addEventListener('mouseenter', function () { if (isDesktop()) expand(card); });
    card.addEventListener('mouseleave', function () { if (isDesktop()) collapse(card); });
    card.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      if (isDesktop()) return;
      if (openCard && openCard !== card) { collapse(openCard); openCard = null; }
      if (openCard === card) { collapse(card); openCard = null; }
      else { expand(card); openCard = card; }
    });
    card.addEventListener('click', function () {
      if (isDesktop()) return;
      if (openCard && openCard !== card) { collapse(openCard); openCard = null; }
      if (openCard === card) { collapse(card); openCard = null; }
      else { expand(card); openCard = card; }
    });
  });

  var track      = qs('#carousel-track');
  var dotsEl     = qs('#carousel-dots');
  var mobileCta  = qs('#mobile-cta');
  var desktopCta = qs('#desktop-cta');

  function updateCta() {
    if (mobileCta)  mobileCta.style.display  = isDesktop() ? 'none' : 'flex';
    if (desktopCta) desktopCta.style.display = isDesktop() ? 'flex' : 'none';
  }
  updateCta();

  if (track) {
    var dragging = false, startX = 0, scrollStart = 0, didDrag = false;
    track.addEventListener('mousedown', function (e) {
      dragging = true; didDrag = false;
      startX = e.pageX; scrollStart = track.scrollLeft;
      track.classList.add('is-dragging'); e.preventDefault();
    });
    window.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      var dx = e.pageX - startX;
      if (Math.abs(dx) > 5) didDrag = true;
      track.scrollLeft = scrollStart - dx;
    });
    window.addEventListener('mouseup', function () {
      if (!dragging) return;
      dragging = false; track.classList.remove('is-dragging');
      if (didDrag) snapToNearest();
    });
    track.addEventListener('click', function (e) {
      if (didDrag) { e.stopPropagation(); e.preventDefault(); didDrag = false; }
    }, true);
    track.addEventListener('scroll', function () {
      var items = track.querySelectorAll('.work_item');
      if (!items.length) return;
      setActiveDot(Math.round(track.scrollLeft / (items[0].offsetWidth + 14)));
    }, { passive: true });
  }

  function snapToNearest() {
    if (!track) return;
    var items = track.querySelectorAll('.work_item');
    if (!items.length) return;
    var cardW = items[0].offsetWidth + 14;
    var idx   = Math.round(track.scrollLeft / cardW);
    track.scrollTo({ left: idx * cardW, behavior: 'smooth' });
    setActiveDot(idx);
  }

  function setActiveDot(idx) {
    if (!dotsEl) return;
    dotsEl.querySelectorAll('.dot').forEach(function (d, i) {
      d.classList.toggle('active', i === idx);
      d.setAttribute('aria-selected', i === idx ? 'true' : 'false');
    });
  }

  function buildDots() {
    if (!dotsEl || !track) return;
    dotsEl.innerHTML = '';
    track.querySelectorAll('.work_item').forEach(function (_, i) {
      var btn = document.createElement('button');
      btn.className = 'dot' + (i === 0 ? ' active' : '');
      btn.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      btn.setAttribute('role', 'tab');
      btn.addEventListener('click', function () {
        var items = track.querySelectorAll('.work_item');
        if (!items.length) return;
        track.scrollTo({ left: i * (items[0].offsetWidth + 14), behavior: 'smooth' });
        setActiveDot(i);
      });
      dotsEl.appendChild(btn);
    });
  }
  buildDots();

  window.addEventListener('resize', function () {
    cards.forEach(collapse); openCard = null;
    updateCta(); buildDots();
  });
})();

// ─── Fade-in on scroll (.svc-fade) ───────────────────
(function () {
  var faders = qsa('.svc-fade');
  if (!faders.length) return;
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('svc-fade--visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    faders.forEach(function (el) { obs.observe(el); });
  } else {
    faders.forEach(function (el) { el.classList.add('svc-fade--visible'); });
  }
})();

// ─── Stats Counter ────────────────────────────────────
(function () {
  var statEls = [qs('#stat-0'), qs('#stat-1'), qs('#stat-2'), qs('#stat-3'), qs('#stat-4')];
  var counted = false;
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function startCounters() {
    if (counted) return; counted = true;
    statEls.forEach(function (el) {
      if (!el) return;
      var target = parseInt(el.getAttribute('data-target'), 10);
      var start  = performance.now();
      (function step(now) {
        var p = Math.min((now - start) / 1600, 1);
        el.textContent = Math.round(easeOut(p) * target);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target;
      })(start);
    });
  }

  var statsCard = qs('.stats-main-card');
  if (statsCard && 'IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) { startCounters(); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(statsCard);
  } else if (statsCard) {
    startCounters();
  }
})();

// ─── Testimonials Slider ─────────────────────────────
(function () {
  var track    = qs('#tstTrack');
  var dotsWrap = qs('#tstDots');
  var prevBtn  = qs('#tstPrev');
  var nextBtn  = qs('#tstNext');
  if (!track) return;

  var slides  = track.querySelectorAll('.tst-slide');
  var total   = slides.length;
  var current = 0;
  var timer   = null;

  slides.forEach(function (_, i) {
    var btn = document.createElement('button');
    btn.className = 'tst-dot' + (i === 0 ? ' active' : '');
    btn.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    btn.addEventListener('click', function () { goTo(i); resetAuto(); });
    if (dotsWrap) dotsWrap.appendChild(btn);
  });

  function goTo(idx) {
    current = ((idx % total) + total) % total;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    if (dotsWrap) {
      dotsWrap.querySelectorAll('.tst-dot').forEach(function (d, i) {
        d.classList.toggle('active', i === current);
        d.setAttribute('aria-selected', i === current ? 'true' : 'false');
      });
    }
  }

  if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); resetAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); resetAuto(); });

  function startAuto() { timer = setInterval(function () { goTo(current + 1); }, 5000); }
  function stopAuto()  { clearInterval(timer); }
  function resetAuto() { stopAuto(); startAuto(); }

  var wrap = qs('.tst-slider-wrap');
  if (wrap) {
    wrap.addEventListener('mouseenter', stopAuto);
    wrap.addEventListener('mouseleave', startAuto);
  }

  var touchStartX = 0;
  track.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  track.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 40) { goTo(current + (dx < 0 ? 1 : -1)); resetAuto(); }
  }, { passive: true });

  qsa('.tst-slide-img').forEach(function (el) {
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
    });
  });
  startAuto();
})();

// ─── Testimonial Lightbox ─────────────────────────────
(function () {
  var lightbox = qs('#tst-lightbox');
  var lbIframe = qs('#tstLbIframe');
  var lbClose  = qs('#tstLbClose');
  if (!lightbox) return;

  qsa('.tst-slide-img').forEach(function (el) {
    el.addEventListener('click', function () {
      var url = el.getAttribute('data-video');
      if (!url || !lbIframe) return;
      lbIframe.src = url;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (lbClose) lbClose.focus();
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    if (lbIframe) lbIframe.src = '';
    document.body.style.overflow = '';
  }

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });
})();

// ─── FAQ Accordion ────────────────────────────────────
(function () {
  qsa('.faq-item').forEach(function (item) {
    var btn = item.querySelector('.faq-q');
    var ans = item.querySelector('.faq-a');
    if (!btn || !ans) return;
    btn.addEventListener('click', function () {
      var open = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
      ans.style.maxHeight = open ? ans.scrollHeight + 'px' : '0';
    });
  });
})();

// ─── Footer Accordion (mobile) ────────────────────────
(function () {
  qsa('.accordion-header').forEach(function (h) {
    h.addEventListener('click', function () {
      var acc = h.closest('.footer-accordion');
      if (!acc) return;
      var open = acc.classList.toggle('active');
      h.setAttribute('aria-expanded', open);
    });
  });
})();

// ─── Contact Form (Formspree) ─────────────────────────
// ⚠️  REPLACE 'YOUR_FORM_ID' below with your actual Formspree form ID.
// Get one free at https://formspree.io → New Form → copy the ID (e.g. 'xpwzabcd')
(function () {
  var FORMSPREE_ID = 'xykvgnwa'; // ← ⚠️ CHANGE THIS before going live

  var form     = qs('#contact-form');
  var statusEl = qs('#cf-status');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = {};
    ['name', 'email', 'company', 'service', 'message'].forEach(function (k) {
      data[k] = ((form.elements[k] || {}).value || '').trim();
    });

    if (!data.name || !data.email || !data.message) {
      setStatus(statusEl, 'Please fill in all required fields.', 'error'); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setStatus(statusEl, 'Please enter a valid email address.', 'error'); return;
    }

    var btn = form.querySelector('.cf-submit');
    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
    setStatus(statusEl, '', '');

    fetch('https://formspree.io/f/' + FORMSPREE_ID, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data),
    })
    .then(function (res) {
      if (res.ok) {
        setStatus(statusEl, '✓ Message sent! We\'ll get back to you within 1 business day.', 'success');
        form.reset();
      } else {
        return res.json().then(function (d) { throw new Error(d.error || 'Submission failed'); });
      }
    })
    .catch(function (err) {
      setStatus(statusEl, 'Something went wrong. Please email hello@adding.marketing', 'error');
      console.error('Form error:', err);
    })
    .finally(function () {
      if (btn) { btn.disabled = false; btn.textContent = 'Send Message →'; }
    });
  });

  function setStatus(el, msg, type) {
    if (!el) return;
    el.textContent = msg;
    el.className   = type ? 'cf-status cf-status--' + type : 'cf-status';
  }
})();

// ─── Newsletter Form ──────────────────────────────────
(function () {
  var form     = qs('#newsletter-form');
  var statusEl = qs('#nl-status');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = ((form.elements['email'] || {}).value || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (statusEl) {
        statusEl.textContent = 'Please enter a valid email.';
        statusEl.className   = 'cf-status cf-status--error';
      }
      return;
    }
    if (statusEl) {
      statusEl.textContent = '✓ You\'re subscribed!';
      statusEl.className   = 'cf-status cf-status--success';
    }
    form.reset();
  });
})();

// ─── Lazy-load Hero Video ─────────────────────────────
(function () {
  var video = qs('.hero-video-bg video');
  if (!video) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { video.remove(); return; }
  var conn = navigator.connection;
  if (conn && (conn.saveData || conn.effectiveType === '2g')) { video.remove(); return; }
  video.load();
})();