/* ═══════════════════════════════════════════════════════
   script.js – Ad Ding Homepage
   Cleaned, optimised, accessible
═══════════════════════════════════════════════════════ */

'use strict';

// ─── Utilities ───────────────────────────────────────
function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
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

// ─── Hamburger / Mobile Menu ─────────────────────────
(function () {
  var btn  = qs('#hamburger');
  var menu = qs('#mobile-menu');
  if (!btn || !menu) return;
  btn.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    menu.setAttribute('aria-hidden', !open);
  });
  // Close on outside click
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
var DEMO_URL     = 'https://calendly.com/adding-marketing/growth-audit'; // ← replace with your Calendly / demo URL

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

// Expose to inline onclick handlers
window.openModal  = openModal;
window.closeModal = closeModal;

if (modalOverlay) {
  // Close on backdrop click
  modalOverlay.addEventListener('click', function (e) {
    if (e.target === modalOverlay) closeModal();
  });
}
// Close on Escape
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeModal();
});

// ─── Hero Ad Carousel ────────────────────────────────
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

  colDirs.forEach(function (dir, colIdx) {
    var col = document.createElement('div');
    col.className = 'carousel-col ' + dir;
    for (var set = 0; set < 3; set++) {
      for (var r = 0; r < 3; r++) {
        var idx = (colIdx * 3 + r + set * 4) % imageFiles.length;
        var img = document.createElement('img');
        img.src    = imageFiles[idx].src;
        img.alt    = '';
        img.loading = 'lazy';
        img.style.height = imageFiles[idx].h + 'px';
        img.width  = 200;
        col.appendChild(img);
      }
    }
    wrap.appendChild(col);
  });
})();

// ─── Client Logos Marquee ────────────────────────────
(function () {
  var track = qs('#clients-track');
  if (!track) return;

  var clients = [
    { name: 'Apollo',           logo: 'assets/clients_logo/Apollo Black logo.webp' },
    { name: 'Base 6',           logo: 'assets/clients_logo/Base 6 black logo_.webp' },
    { name: 'Bliss Club',       logo: 'assets/clients_logo/Bliss club black.webp' },
    { name: 'Midori',           logo: 'assets/clients_logo/Midori black logo.webp' },
    { name: 'Native Forever',   logo: 'assets/clients_logo/Native Forever black logo_.webp' },
    { name: 'Safeera',          logo: 'assets/clients_logo/Safeera Black logo_.webp' },
    { name: 'Punjabi Saraf',    logo: 'assets/clients_logo/Punjabi Saraf block logo.webp' },
    { name: 'Saaki',            logo: 'assets/clients_logo/Saaki black logo.webp' },
    { name: 'Plan the Unplanned', logo: 'assets/clients_logo/Plan the unplanned black.webp' },
    { name: 'TGL Company',      logo: 'assets/clients_logo/TGL company black.webp' },
    { name: 'Vrede',            logo: 'assets/clients_logo/Vrede Black logo (1).webp' },
  ];

  // Double for seamless loop
  var doubled = clients.concat(clients);
  var frag = document.createDocumentFragment();
  doubled.forEach(function (c) {
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

// ─── Work Cards (hover / touch expand) ───────────────
(function () {
  var isDesktop = function () { return window.innerWidth >= 992; };
  var isMobile  = function () { return window.innerWidth < 768; };
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
    // Keyboard support
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (isDesktop()) return;
        if (openCard && openCard !== card) { collapse(openCard); openCard = null; }
        if (openCard === card) { collapse(card); openCard = null; }
        else { expand(card); openCard = card; }
      }
    });
    card.addEventListener('click', function () {
      if (isDesktop()) return;
      if (openCard && openCard !== card) { collapse(openCard); openCard = null; }
      if (openCard === card) { collapse(card); openCard = null; }
      else { expand(card); openCard = card; }
    });
  });

  window.addEventListener('resize', function () {
    cards.forEach(collapse);
    openCard = null;
    updateCta();
    buildDots();
  });

  // CTA visibility
  var mobileCta  = qs('#mobile-cta');
  var desktopCta = qs('#desktop-cta');
  function updateCta() {
    if (mobileCta)  mobileCta.style.display  = isDesktop() ? 'none' : 'flex';
    if (desktopCta) desktopCta.style.display = isDesktop() ? 'flex' : 'none';
  }
  updateCta();

  // Drag-to-scroll
  var track     = qs('#carousel-track');
  var dragging  = false;
  var startX    = 0;
  var scrollStart = 0;
  var didDrag   = false;

  if (track && !isMobile()) {
    track.addEventListener('mousedown', function (e) {
      dragging    = true;
      didDrag     = false;
      startX      = e.pageX;
      scrollStart = track.scrollLeft;
      track.classList.add('is-dragging');
      e.preventDefault();
    });
    window.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      var dx = e.pageX - startX;
      if (Math.abs(dx) > 5) didDrag = true;
      track.scrollLeft = scrollStart - dx;
    });
    window.addEventListener('mouseup', function () {
      if (!dragging) return;
      dragging = false;
      track.classList.remove('is-dragging');
      if (didDrag) snapToNearest();
    });
    track.addEventListener('click', function (e) {
      if (didDrag) { e.stopPropagation(); e.preventDefault(); didDrag = false; }
    }, true);
  }

  function snapToNearest() {
    var items = track ? track.querySelectorAll('.work_item') : [];
    if (!items.length) return;
    var cardW = items[0].offsetWidth + 14;
    var idx   = Math.round(track.scrollLeft / cardW);
    track.scrollTo({ left: idx * cardW, behavior: 'smooth' });
    setActiveDot(idx);
  }

  // Dots
  var dotsEl = qs('#carousel-dots');
  function buildDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    if (isMobile() || !track) return;
    var items = track.querySelectorAll('.work_item');
    items.forEach(function (_, i) {
      var btn = document.createElement('button');
      btn.className = 'dot' + (i === 0 ? ' active' : '');
      btn.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      btn.setAttribute('role', 'tab');
      btn.addEventListener('click', function () {
        var cardW = items[0].offsetWidth + 14;
        track.scrollTo({ left: i * cardW, behavior: 'smooth' });
        setActiveDot(i);
      });
      dotsEl.appendChild(btn);
    });
  }
  function setActiveDot(idx) {
    if (!dotsEl) return;
    dotsEl.querySelectorAll('.dot').forEach(function (d, i) {
      d.classList.toggle('active', i === idx);
      d.setAttribute('aria-selected', i === idx ? 'true' : 'false');
    });
  }
  if (track) {
    track.addEventListener('scroll', function () {
      var items = track.querySelectorAll('.work_item');
      if (!items.length) return;
      var cardW = items[0].offsetWidth + 14;
      setActiveDot(Math.round(track.scrollLeft / cardW));
    }, { passive: true });
  }
  buildDots();
})();

// ─── Fade-in on scroll (Services + Impact) ───────────
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
    // Fallback for old browsers
    faders.forEach(function (el) { el.classList.add('svc-fade--visible'); });
  }
})();

// ─── Stats counter ───────────────────────────────────
(function () {
  var statEls = [
    qs('#stat-0'), qs('#stat-1'), qs('#stat-2'),
    qs('#stat-3'), qs('#stat-4'),
  ];
  var counted = false;

  function startCounters() {
    if (counted) return;
    counted = true;
    statEls.forEach(function (el) {
      if (!el) return;
      var target  = parseInt(el.getAttribute('data-target'), 10);
      var current = 0;
      var inc     = target / 60;
      function step() {
        current += inc;
        if (current < target) {
          el.textContent = Math.floor(current);
          requestAnimationFrame(step);
        } else {
          el.textContent = target;
        }
      }
      step();
    });
  }

  var statsCard = qs('.stats-main-card');
  if (statsCard && 'IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { startCounters(); obs.disconnect(); }
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

  var slides   = track.querySelectorAll('.tst-slide');
  var total    = slides.length;
  var current  = 0;
  var timer    = null;
  var DELAY    = 5000;

  // Build dots
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

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  if (prevBtn) prevBtn.addEventListener('click', function () { prev(); resetAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { next(); resetAuto(); });

  function startAuto() { timer = setInterval(next, DELAY); }
  function stopAuto()  { clearInterval(timer); }
  function resetAuto() { stopAuto(); startAuto(); }

  var wrap = qs('.tst-slider-wrap');
  if (wrap) {
    wrap.addEventListener('mouseenter', stopAuto);
    wrap.addEventListener('mouseleave', startAuto);
  }

  // Touch swipe
  var touchStartX = 0;
  track.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  track.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); resetAuto(); }
  }, { passive: true });

  // Keyboard (video play via enter/space)
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
      if (!url) return;
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
    lbIframe.src = '';
    document.body.style.overflow = '';
  }

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });
})();

// ─── FAQ Accordion ────────────────────────────────────
(function () {
  var items = qsa('.faq-item');
  items.forEach(function (item) {
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
  var headers = qsa('.accordion-header');
  headers.forEach(function (h) {
    h.addEventListener('click', function () {
      var acc  = h.closest('.footer-accordion');
      var open = acc.classList.toggle('active');
      h.setAttribute('aria-expanded', open);
    });
  });
})();

// ─── Contact Form ─────────────────────────────────────
(function () {
  var form     = qs('#contact-form');
  var statusEl = qs('#cf-status');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = {
      name:    form.elements['name'].value.trim(),
      email:   form.elements['email'].value.trim(),
      company: form.elements['company'].value.trim(),
      service: form.elements['service'].value,
      message: form.elements['message'].value.trim(),
    };

    // Basic validation
    if (!data.name || !data.email || !data.message) {
      showStatus(statusEl, 'Please fill in all required fields.', 'error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      showStatus(statusEl, 'Please enter a valid email address.', 'error');
      return;
    }

    var submitBtn = form.querySelector('.cf-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    // ── Option A: Formspree (recommended – no backend needed) ──
    // Replace YOUR_FORM_ID with your Formspree endpoint
    fetch('https://formspree.io/f/YOUR_FORM_ID', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data),
    })
    .then(function (res) {
      if (res.ok) {
        showStatus(statusEl, '✓ Message sent! We\'ll get back to you within 1 business day.', 'success');
        form.reset();
      } else {
        return res.json().then(function (d) {
          throw new Error(d.error || 'Submission failed');
        });
      }
    })
    .catch(function (err) {
      showStatus(statusEl, 'Something went wrong. Please email us at hello@adding.marketing', 'error');
      console.error('Form error:', err);
    })
    .finally(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message →';
    });
  });

  function showStatus(el, msg, type) {
    if (!el) return;
    el.textContent = msg;
    el.className   = 'cf-status cf-status--' + type;
  }
})();

// ─── Newsletter Form ──────────────────────────────────
(function () {
  var form     = qs('#newsletter-form');
  var statusEl = qs('#nl-status');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = form.elements['email'].value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (statusEl) { statusEl.textContent = 'Please enter a valid email.'; statusEl.className = 'cf-status cf-status--error'; }
      return;
    }
    // Replace with your newsletter provider endpoint (Mailchimp, ConvertKit, etc.)
    // For now, just show success
    if (statusEl) { statusEl.textContent = '✓ You\'re subscribed!'; statusEl.className = 'cf-status cf-status--success'; }
    form.reset();
  });
})();

// ─── Lazy-load video bg (performance) ────────────────
(function () {
  var video = qs('.hero-video-bg video');
  if (!video) return;
  // Only load video if not on a slow connection
  if (navigator.connection && (navigator.connection.saveData || navigator.connection.effectiveType === '2g')) {
    video.remove();
    return;
  }
  video.load();
})();

// ─── Language Switcher ────────────────────────────────
(function () {

  // ── Translation strings ──────────────────────────────
  var TRANSLATIONS = {
    en: {
      // Nav
      'nav-home':     'Homepage',
      'nav-work':     'Work',
      'nav-services': 'Services',
      'nav-about':    'About',
      'nav-demo-btn': 'Book a demo',
      // Announcement bar
      'ann-text':     'Your next winning ad? We\'ll build it. Work with us',
      'ann-cta':      '\u00a0Book it →',
      // Hero
      'hero-tagline':   'The Right Growth Systems.',
      'hero-headline':  'Performance Marketing That Actually <span class="neon">Improves</span> Every Month',
      'hero-para':      'From tracking to <span class="neon">creatives to CRO</span> — we fix what\'s leaking and scale what\'s working (without distorting unit economics).',
      'hero-btn-demo':  'Book a Growth Audit',
      'hero-btn-exp':   'Explore our services →',
      'hero-stats':     '<span class="neon">30M+</span> Ads Created For <span class="neon">23,560+</span> Happy Customers',
      // Clients
      'clients-title':  'Clients We Have Supported:',
      // Contact
      'contact-title':  'Let\'s Talk <em>Growth.</em>',
      'contact-sub':    'Tell us about your brand and what you\'re trying to fix. We\'ll respond within 1 business day.',
      'contact-submit': 'Send Message →',
      // Footer
      'footer-nl-title': 'Sign up for our newsletter<span class="dot">.</span>',
      'footer-nl-sub':   'No spam. Just sharp insights on performance + growth marketing.',
      'footer-nl-btn':   'Subscribe',
    },
    fr: {
      'nav-home':     'Accueil',
      'nav-work':     'Travaux',
      'nav-services': 'Services',
      'nav-about':    'À propos',
      'nav-demo-btn': 'Réserver une démo',
      'ann-text':     'Votre prochaine pub gagnante ? On la crée. Travaillez avec nous',
      'ann-cta':      '\u00a0Découvrir →',
      'hero-tagline':   'Les bons systèmes de croissance.',
      'hero-headline':  'Marketing de performance qui <span class="neon">s\'améliore</span> chaque mois',
      'hero-para':      'Du tracking aux <span class="neon">créatifs et au CRO</span> — on corrige les fuites et on amplifie ce qui marche.',
      'hero-btn-demo':  'Audit de croissance gratuit',
      'hero-btn-exp':   'Explorer nos services →',
      'hero-stats':     '<span class="neon">30M+</span> pubs créées pour <span class="neon">23 560+</span> clients satisfaits',
      'clients-title':  'Clients que nous avons accompagnés :',
      'contact-title':  'Parlons <em>croissance.</em>',
      'contact-sub':    'Parlez-nous de votre marque. Nous répondons en 1 jour ouvré.',
      'contact-submit': 'Envoyer →',
      'footer-nl-title':'Inscrivez-vous à notre newsletter<span class="dot">.</span>',
      'footer-nl-sub':  'Pas de spam. Des insights sur la performance marketing.',
      'footer-nl-btn':  'S\'abonner',
    },
    es: {
      'nav-home':     'Inicio',
      'nav-work':     'Trabajos',
      'nav-services': 'Servicios',
      'nav-about':    'Nosotros',
      'nav-demo-btn': 'Reservar demo',
      'ann-text':     '¿Tu próximo anuncio ganador? Lo creamos. Trabaja con nosotros',
      'ann-cta':      '\u00a0Ver más →',
      'hero-tagline':   'Los sistemas de crecimiento correctos.',
      'hero-headline':  'Marketing de rendimiento que <span class="neon">mejora</span> cada mes',
      'hero-para':      'Desde el tracking hasta <span class="neon">creativos y CRO</span> — corregimos las fugas y escalamos lo que funciona.',
      'hero-btn-demo':  'Auditoría de crecimiento gratuita',
      'hero-btn-exp':   'Explorar servicios →',
      'hero-stats':     '<span class="neon">30M+</span> anuncios creados para <span class="neon">23.560+</span> clientes felices',
      'clients-title':  'Clientes que hemos apoyado:',
      'contact-title':  'Hablemos de <em>crecimiento.</em>',
      'contact-sub':    'Cuéntanos sobre tu marca. Respondemos en 1 día hábil.',
      'contact-submit': 'Enviar mensaje →',
      'footer-nl-title':'Suscríbete a nuestro boletín<span class="dot">.</span>',
      'footer-nl-sub':  'Sin spam. Solo insights sobre marketing de rendimiento.',
      'footer-nl-btn':  'Suscribirse',
    },
    tr: {
      'nav-home':     'Ana Sayfa',
      'nav-work':     'Çalışmalar',
      'nav-services': 'Hizmetler',
      'nav-about':    'Hakkımızda',
      'nav-demo-btn': 'Demo rezervasyonu',
      'ann-text':     'Bir sonraki kazanan reklamın? Biz yaparız. Bizimle çalış',
      'ann-cta':      '\u00a0Keşfet →',
      'hero-tagline':   'Doğru büyüme sistemleri.',
      'hero-headline':  'Her ay gerçekten <span class="neon">gelişen</span> performans pazarlaması',
      'hero-para':      'Takipten <span class="neon">kreatife ve CRO\'ya</span> kadar — sızıntıları düzeltir, işe yarayanı büyütürüz.',
      'hero-btn-demo':  'Ücretsiz büyüme denetimi',
      'hero-btn-exp':   'Hizmetleri keşfet →',
      'hero-stats':     '<span class="neon">23.560+</span> mutlu müşteri için <span class="neon">30M+</span> reklam',
      'clients-title':  'Desteklediğimiz müşteriler:',
      'contact-title':  '<em>Büyüme</em> hakkında konuşalım.',
      'contact-sub':    'Markanızı anlatın. 1 iş günü içinde yanıt veririz.',
      'contact-submit': 'Mesaj gönder →',
      'footer-nl-title':'Bültenimize kaydolun<span class="dot">.</span>',
      'footer-nl-sub':  'Spam yok. Sadece performans pazarlaması içgörüleri.',
      'footer-nl-btn':  'Abone ol',
    }
  };

  // ── DOM targets (key → selector + property) ──────────
  // Each entry: [selector, 'innerHTML'|'textContent']
  var TARGETS = [
    ['[data-i18n="nav-home"]',      'textContent'],
    ['[data-i18n="nav-work"]',      'textContent'],
    ['[data-i18n="nav-services"]',  'textContent'],
    ['[data-i18n="nav-about"]',     'textContent'],
    ['[data-i18n="nav-demo-btn"]',  'textContent'],
    ['[data-i18n="ann-text"]',      'textContent'],
    ['[data-i18n="ann-cta"]',       'innerHTML'],
    ['[data-i18n="hero-tagline"]',  'textContent'],
    ['[data-i18n="hero-headline"]', 'innerHTML'],
    ['[data-i18n="hero-para"]',     'innerHTML'],
    ['[data-i18n="hero-btn-demo"]', 'textContent'],
    ['[data-i18n="hero-btn-exp"]',  'textContent'],
    ['[data-i18n="hero-stats"]',    'innerHTML'],
    ['[data-i18n="clients-title"]', 'textContent'],
    ['[data-i18n="contact-title"]', 'innerHTML'],
    ['[data-i18n="contact-sub"]',   'textContent'],
    ['[data-i18n="contact-submit"]','textContent'],
    ['[data-i18n="footer-nl-title"]','innerHTML'],
    ['[data-i18n="footer-nl-sub"]', 'textContent'],
    ['[data-i18n="footer-nl-btn"]', 'textContent'],
  ];

  // ── Apply language ────────────────────────────────────
  function applyLang(code) {
    var t = TRANSLATIONS[code];
    if (!t) return;

    TARGETS.forEach(function (pair) {
      var nodes = document.querySelectorAll(pair[0]);
      nodes.forEach(function (el) {
        var key = el.getAttribute('data-i18n');
        if (t[key] !== undefined) el[pair[1]] = t[key];
      });
    });

    // Update desktop button label
    var langBtn = document.querySelector('.lang-btn');
    if (langBtn) {
      var labels = { en: '🇺🇸 En', fr: '🇫🇷 Fr', es: '🇪🇸 Es', tr: '🇹🇷 Tr' };
      langBtn.innerHTML =
        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
        + ' ' + (labels[code] || 'En') + ' <span aria-hidden="true">▾</span>';
    }

    // Update mobile select
    var mobileSelect = document.querySelector('.mobile-lang select');
    if (mobileSelect) mobileSelect.value = code;

    // Update <html lang> attribute
    document.documentElement.lang = code;

    // Persist
    try { localStorage.setItem('ad-ding-lang', code); } catch(e) {}
  }

  // ── Wire up desktop buttons ───────────────────────────
  var langBtns = document.querySelectorAll('.lang-menu button[data-lang]');
  langBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyLang(btn.getAttribute('data-lang'));
      // Close the dropdown
      var menu = document.querySelector('.lang-menu');
      if (menu) { menu.style.opacity = '0'; menu.style.visibility = 'hidden'; }
      setTimeout(function () {
        if (menu) { menu.style.opacity = ''; menu.style.visibility = ''; }
      }, 300);
    });
  });

  // ── Wire up mobile select ─────────────────────────────
  var mobileSelect = document.querySelector('.mobile-lang select');
  if (mobileSelect) {
    mobileSelect.addEventListener('change', function () {
      applyLang(this.value);
    });
  }

  // ── Restore saved preference ──────────────────────────
  var saved;
  try { saved = localStorage.getItem('ad-ding-lang'); } catch(e) {}
  if (saved && TRANSLATIONS[saved]) applyLang(saved);

})();