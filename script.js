/* ============================================================
   G EVENTS TIRUPATI — SCRIPT.JS
   Premium Luxury Event Planner Website
============================================================ */

'use strict';

/* ============================================================
   1. DOM READY
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initCustomCursor();
  initNavbar();
  initHeroSlideshow();
  initPetals();
  initScrollReveal();
  initStatsCounter();
  initGalleryFilter();
  initLightbox();
  initTestimonialsSlider();
  initBookingForm();
  initThemeEnquiry();
  initBackToTop();
  initFooterYear();
  initSlideDots();
  initActiveNavLinks();
  initMobileNavOverlay();
});

/* ============================================================
   2. PRELOADER
============================================================ */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  document.body.classList.add('loading');

  const hidePreloader = () => {
    preloader.classList.add('hidden');
    document.body.classList.remove('loading');
  };

  window.addEventListener('load', () => {
    setTimeout(hidePreloader, 2000);
  });

  // Fallback: always remove after 4s
  setTimeout(hidePreloader, 4000);
}

/* ============================================================
   3. CUSTOM CURSOR (desktop only)
============================================================ */
function initCustomCursor() {
  const dot     = document.getElementById('cursorDot');
  const outline = document.getElementById('cursorOutline');
  if (!dot || !outline) return;

  // Only on non-touch devices
  if (window.matchMedia('(hover: none)').matches) return;

  let mouseX = 0, mouseY = 0;
  let outlineX = 0, outlineY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Smooth outline follow
  function animateOutline() {
    outlineX += (mouseX - outlineX) * 0.12;
    outlineY += (mouseY - outlineY) * 0.12;
    outline.style.left = outlineX + 'px';
    outline.style.top  = outlineY + 'px';
    requestAnimationFrame(animateOutline);
  }
  animateOutline();

  // Hover effect on interactive elements
  const hoverTargets = document.querySelectorAll(
    'a, button, .service-card, .gallery-item, .theme-card, .filter-btn, input, select, textarea'
  );

  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => outline.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => outline.classList.remove('cursor-hover'));
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity     = '0';
    outline.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    dot.style.opacity     = '1';
    outline.style.opacity = '1';
  });
}

/* ============================================================
   4. NAVBAR — SCROLL + HAMBURGER
============================================================ */
function initNavbar() {
  const header    = document.getElementById('mainHeader');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!header) return;

  // Add scrolled class
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      // FIX: only lock body scroll when sidebar is open
      document.body.style.overflow = isOpen ? 'hidden' : '';

      const overlay = document.querySelector('.nav-overlay');
      if (overlay) overlay.classList.toggle('visible', isOpen);
    });

    // Close nav when a link is clicked
    navLinks.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
      link.addEventListener('click', closeNav);
    });
  }
}

/* Global closeNav — used across multiple functions */
function closeNav() {
  const navLinks  = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  const overlay   = document.querySelector('.nav-overlay');

  if (navLinks)  navLinks.classList.remove('open');
  if (hamburger) {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  }
  if (overlay) overlay.classList.remove('visible');
  document.body.style.overflow = '';
}

/* ============================================================
   5. MOBILE NAV OVERLAY
   FIX: overlay created dynamically and properly layered
============================================================ */
function initMobileNavOverlay() {
  // Check if overlay already exists (safety guard)
  if (document.querySelector('.nav-overlay')) {
    document.querySelector('.nav-overlay').addEventListener('click', closeNav);
    return;
  }

  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);
  overlay.addEventListener('click', closeNav);
}

/* ============================================================
   6. ACTIVE NAV LINKS (Intersection Observer)
============================================================ */
function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id], div[id]');
  const links    = document.querySelectorAll('.nav-link');
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        links.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, {
    rootMargin: '-40% 0px -55% 0px',
    threshold: 0
  });

  sections.forEach(section => observer.observe(section));
}

/* ============================================================
   7. HERO SLIDESHOW
============================================================ */
function initHeroSlideshow() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.slide-dots .dot');
  if (!slides.length) return;

  let current = 0;
  let timer;

  function goToSlide(index) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');

    current = (index + slides.length) % slides.length;

    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function nextSlide()  { goToSlide(current + 1); }
  function startTimer() { timer = setInterval(nextSlide, 5000); }
  function resetTimer() { clearInterval(timer); startTimer(); }

  startTimer();

  // Dot click navigation
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goToSlide(i); resetTimer(); });
  });

  // Pause on hero hover (desktop only)
  const hero = document.querySelector('.hero-section');
  if (hero) {
    hero.addEventListener('mouseenter', () => clearInterval(timer));
    hero.addEventListener('mouseleave', startTimer);
  }
}

/* ============================================================
   8. SLIDE DOTS — hook (handled inside initHeroSlideshow)
============================================================ */
function initSlideDots() {
  // Handled inside initHeroSlideshow
}

/* ============================================================
   9. FLOATING PETALS
============================================================ */
function initPetals() {
  const container = document.getElementById('petalsContainer');
  if (!container) return;

  const petalSymbols = ['🌸', '🌺', '✿', '❀', '🌼', '✦'];
  const totalPetals  = window.innerWidth < 768 ? 8 : 20;

  for (let i = 0; i < totalPetals; i++) {
    createPetal(container, petalSymbols);
  }
}

function createPetal(container, symbols) {
  const petal    = document.createElement('span');
  petal.className = 'petal';
  petal.textContent = symbols[Math.floor(Math.random() * symbols.length)];

  const size     = Math.random() * 12 + 10;
  const leftPos  = Math.random() * 100;
  const duration = Math.random() * 10 + 8;
  const delay    = Math.random() * 10;
  const opacity  = Math.random() * 0.4 + 0.2;

  petal.style.cssText = `
    font-size: ${size}px;
    left: ${leftPos}%;
    animation-duration: ${duration}s;
    animation-delay: ${delay}s;
    opacity: ${opacity};
  `;

  container.appendChild(petal);
}

/* ============================================================
   10. SCROLL REVEAL (Intersection Observer)
============================================================ */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => observer.observe(el));
}

/* ============================================================
   11. STATS COUNTER ANIMATION
============================================================ */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');
  if (!statNumbers.length) return;

  let hasRun = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasRun) {
        hasRun = true;
        statNumbers.forEach(el => animateCounter(el));
        observer.disconnect();
      }
    });
  }, { threshold: 0.4 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) observer.observe(statsSection);
}

function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-count'), 10);
  const duration = 2200;
  const start    = performance.now();

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.round(eased * target);
    el.textContent = current.toLocaleString('en-IN');

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target.toLocaleString('en-IN');
    }
  }

  requestAnimationFrame(update);
}

/* ============================================================
   12. GALLERY FILTER
============================================================ */
function initGalleryFilter() {
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach((item, index) => {
        const category = item.getAttribute('data-category');
        const show     = filter === 'all' || category === filter;

        if (show) {
          item.classList.remove('hidden');
          item.style.opacity   = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            item.style.opacity    = '1';
            item.style.transform  = 'scale(1)';
          }, index * 60);
        } else {
          item.classList.add('hidden');
          item.style.opacity   = '';
          item.style.transform = '';
        }
      });
    });
  });
}

/* ============================================================
   13. LIGHTBOX
============================================================ */
function initLightbox() {
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCap = document.getElementById('lightboxCaption');
  const closeBtn    = document.getElementById('lightboxClose');
  const prevBtn     = document.getElementById('lightboxPrev');
  const nextBtn     = document.getElementById('lightboxNext');
  const zoomBtns    = document.querySelectorAll('.gallery-zoom');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!lightbox || !lightboxImg) return;

  let currentIndex  = 0;
  let visibleItems  = [];

  function getVisibleItems() {
    return Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
  }

  function openLightbox(index) {
    visibleItems = getVisibleItems();
    currentIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightboxImage() {
    if (!visibleItems[currentIndex]) return;
    const img     = visibleItems[currentIndex].querySelector('img');
    const caption = visibleItems[currentIndex].querySelector('.gallery-item-overlay span');

    if (img) {
      lightboxImg.style.opacity   = '0';
      lightboxImg.style.transform = 'scale(0.96)';
      setTimeout(() => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxImg.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        lightboxImg.style.opacity    = '1';
        lightboxImg.style.transform  = 'scale(1)';
      }, 150);
    }

    if (lightboxCap && caption) {
      lightboxCap.textContent = caption.textContent;
    }
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    updateLightboxImage();
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % visibleItems.length;
    updateLightboxImage();
  }

  // Zoom button click
  zoomBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      visibleItems = getVisibleItems();
      const item  = btn.closest('.gallery-item');
      const index = visibleItems.indexOf(item);
      openLightbox(index >= 0 ? index : 0);
    });
  });

  // Item click opens lightbox
  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      visibleItems = getVisibleItems();
      const index  = visibleItems.indexOf(item);
      openLightbox(index >= 0 ? index : 0);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn)  prevBtn.addEventListener('click', showPrev);
  if (nextBtn)  nextBtn.addEventListener('click', showNext);

  // Close on backdrop click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  showPrev();
    if (e.key === 'ArrowRight') showNext();
  });

  // Touch swipe support
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) showNext();
      else          showPrev();
    }
  }, { passive: true });
}

/* ============================================================
   14. TESTIMONIALS SLIDER
============================================================ */
function initTestimonialsSlider() {
  const slides  = document.querySelectorAll('.testimonial-slide');
  const dots    = document.querySelectorAll('.t-dot');
  const prevBtn = document.getElementById('tPrev');
  const nextBtn = document.getElementById('tNext');
  if (!slides.length) return;

  let current = 0;
  let timer;

  function goTo(index) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');

    current = (index + slides.length) % slides.length;

    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAutoPlay() { timer = setInterval(next, 5000); }
  function resetAutoPlay() { clearInterval(timer); startAutoPlay(); }

  startAutoPlay();

  if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetAutoPlay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAutoPlay(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); resetAutoPlay(); });
  });

  // Touch swipe support
  const slider = document.getElementById('testimonialsSlider');
  if (slider) {
    let touchStartX = 0;
    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) { next(); resetAutoPlay(); }
        else          { prev(); resetAutoPlay(); }
      }
    }, { passive: true });
  }
}

/* ============================================================
   15. BOOKING FORM → WHATSAPP
============================================================ */
function initBookingForm() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  // Real-time validation feedback
  const requiredFields = form.querySelectorAll('[required]');
  requiredFields.forEach(field => {
    field.addEventListener('blur',  () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) validateField(field);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    requiredFields.forEach(field => {
      if (!validateField(field)) isValid = false;
    });

    if (!isValid) {
      showFormError('Please fill in all required fields correctly.');
      return;
    }

    const name       = getValue('clientName');
    const phone      = getValue('clientPhone');
    const eventType  = getValue('eventType');
    const eventTheme = getValue('eventTheme');
    const eventDate  = getValue('eventDate');
    const guestCount = getValue('guestCount');
    const message    = getValue('eventMessage');

    // Format date nicely
    let formattedDate = eventDate;
    if (eventDate) {
      try {
        const d = new Date(eventDate);
        formattedDate = d.toLocaleDateString('en-IN', {
          day: 'numeric', month: 'long', year: 'numeric'
        });
      } catch (err) { /* use raw */ }
    }

    const waMessage = buildWhatsAppMessage({
      name, phone, eventType, eventTheme,
      eventDate: formattedDate, guestCount, message
    });

    const waURL = `https://wa.me/919642474334?text=${encodeURIComponent(waMessage)}`;

    showFormSuccess();
    setTimeout(() => {
      window.open(waURL, '_blank', 'noopener,noreferrer');
    }, 800);
  });
}

function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function validateField(field) {
  const value = field.value.trim();
  let isValid = true;

  if (field.type === 'tel') {
    isValid = /^[6-9]\d{9}$/.test(value);
  } else if (field.type === 'date') {
    isValid = value !== '';
    if (isValid) {
      const selected = new Date(value);
      const today    = new Date();
      today.setHours(0, 0, 0, 0);
      isValid = selected >= today;
    }
  } else if (field.tagName === 'SELECT') {
    isValid = value !== '';
  } else {
    isValid = value.length > 0;
  }

  field.classList.toggle('error', !isValid);
  field.classList.toggle('valid',  isValid);
  return isValid;
}

function buildWhatsAppMessage({ name, phone, eventType, eventTheme, eventDate, guestCount, message }) {
  let msg = `🎉 *New Event Enquiry — G Events Tirupati*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  msg += `👤 *Name:* ${name}\n`;
  msg += `📞 *Phone:* ${phone}\n`;
  msg += `🎊 *Event Type:* ${eventType}\n`;

  if (eventTheme) msg += `🎨 *Preferred Theme:* ${eventTheme}\n`;
  if (eventDate)  msg += `📅 *Event Date:* ${eventDate}\n`;
  if (guestCount) msg += `👥 *Guest Count:* ${guestCount}\n`;
  if (message)    msg += `\n💬 *Additional Details:*\n${message}\n`;

  msg += `\n━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `_Sent from G Events Tirupati Website_`;

  return msg;
}

function showFormSuccess() {
  const btn = document.querySelector('.btn-submit');
  if (!btn) return;

  const originalHTML = btn.innerHTML;
  btn.innerHTML      = '<i class="fa-brands fa-whatsapp"></i> Redirecting to WhatsApp...';
  btn.style.background = 'linear-gradient(135deg, #25d366, #128c7e)';
  btn.style.color      = '#fff';
  btn.disabled         = true;

  setTimeout(() => {
    btn.innerHTML        = originalHTML;
    btn.style.background = '';
    btn.style.color      = '';
    btn.disabled         = false;
  }, 4000);
}

function showFormError(msg) {
  const existing = document.querySelector('.form-error-msg');
  if (existing) existing.remove();

  const errEl       = document.createElement('p');
  errEl.className   = 'form-error-msg';
  errEl.textContent = msg;
  errEl.style.cssText = `
    color: #ff6b6b;
    font-size: 12.5px;
    text-align: center;
    margin-top: -8px;
    margin-bottom: 10px;
    animation: fadeUp 0.3s ease;
  `;

  const submitBtn = document.querySelector('.btn-submit');
  if (submitBtn) {
    submitBtn.parentNode.insertBefore(errEl, submitBtn);
    setTimeout(() => errEl.remove(), 4000);
  }
}

/* ============================================================
   16. THEME ENQUIRY BUTTONS → WHATSAPP
============================================================ */
function initThemeEnquiry() {
  const enquireBtns = document.querySelectorAll('.theme-enquire-btn');

  enquireBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme') || 'a theme';
      const msg   = `Hello G Events Tirupati! 🎉\n\nI'm interested in the *${theme}*.\n\nCould you please share more details about this theme, pricing and availability?\n\nThank you!`;
      const url   = `https://wa.me/919642474334?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  });
}

/* ============================================================
   17. BACK TO TOP BUTTON
============================================================ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   18. FOOTER YEAR
============================================================ */
function initFooterYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}

/* ============================================================
   19. SMOOTH SCROLL FOR ANCHOR LINKS
============================================================ */
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;

  const targetId = link.getAttribute('href').slice(1);
  if (!targetId) return;

  const target = document.getElementById(targetId);
  if (!target) return;

  e.preventDefault();
  closeNav();

  const headerH = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--header-h') || '80',
    10
  );

  const top = target.getBoundingClientRect().top + window.scrollY - headerH;
  window.scrollTo({ top, behavior: 'smooth' });
});

/* ============================================================
   20. HERO PARALLAX (desktop only)
   FIX: completely disabled on mobile to prevent zoom-scroll feel
============================================================ */
(function initParallax() {
  // FIX: skip entirely on mobile/tablet
  if (window.matchMedia('(max-width: 768px)').matches) return;
  if (window.matchMedia('(hover: none)').matches) return;

  const slides = document.querySelectorAll('.hero-slide');
  if (!slides.length) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      const offset = scrollY * 0.25;
      slides.forEach(slide => {
        slide.style.transform = `translateY(${offset}px)`;
      });
    }
  }, { passive: true });
})();

/* ============================================================
   21. LAZY IMAGE LOADING ENHANCEMENT
============================================================ */
(function initLazyImages() {
  // Native lazy load is widely supported — use as fallback only
  if ('loading' in HTMLImageElement.prototype) return;

  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  if (!lazyImages.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) img.src = img.dataset.src;
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  lazyImages.forEach(img => observer.observe(img));
})();

/* ============================================================
   22. WINDOW RESIZE HANDLER
============================================================ */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Close mobile nav when resized to desktop
    if (window.innerWidth > 768) closeNav();
  }, 250);
});

/* ============================================================
   23. PAGE VISIBILITY — PAUSE ANIMATIONS WHEN TAB HIDDEN
============================================================ */
document.addEventListener('visibilitychange', () => {
  const marquee = document.querySelector('.marquee-inner');
  if (!marquee) return;
  marquee.style.animationPlayState = document.hidden ? 'paused' : 'running';
});

/* ============================================================
   24. TOUCH SWIPE — HERO SLIDESHOW
============================================================ */
(function initHeroSwipe() {
  const hero = document.querySelector('.hero-section');
  if (!hero) return;

  let touchStartX = 0;
  let touchStartY = 0;

  hero.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
  }, { passive: true });

  hero.addEventListener('touchend', (e) => {
    const diffX = touchStartX - e.changedTouches[0].clientX;
    const diffY = touchStartY - e.changedTouches[0].clientY;

    // FIX: only trigger swipe if horizontal movement > vertical (avoids conflict with scroll)
    if (Math.abs(diffX) < 50) return;
    if (Math.abs(diffY) > Math.abs(diffX)) return;

    const dots      = document.querySelectorAll('.slide-dots .dot');
    const activeDot = document.querySelector('.slide-dots .dot.active');
    if (!activeDot || !dots.length) return;

    const currentIndex = Array.from(dots).indexOf(activeDot);
    const total        = dots.length;
    const nextIndex    = diffX > 0
      ? (currentIndex + 1) % total
      : (currentIndex - 1 + total) % total;

    dots[nextIndex].click();
  }, { passive: true });
})();

/* ============================================================
   25. FORM DATE — SET MIN DATE TO TODAY
============================================================ */
(function setMinDate() {
  const dateInput = document.getElementById('eventDate');
  if (!dateInput) return;
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
})();

/* ============================================================
   26. FIX: Prevent body scroll restore issue on iOS
   When nav closes, ensure scroll is always restored correctly
============================================================ */
(function fixiOSScrollLock() {
  let scrollY = 0;

  const lockScroll = () => {
    scrollY = window.scrollY;
    document.body.style.position   = 'fixed';
    document.body.style.top        = `-${scrollY}px`;
    document.body.style.width      = '100%';
    document.body.style.overflowY  = 'scroll';
  };

  const unlockScroll = () => {
    document.body.style.position  = '';
    document.body.style.top       = '';
    document.body.style.width     = '';
    document.body.style.overflowY = '';
    window.scrollTo(0, scrollY);
  };

  // Only apply on mobile/touch
  if (!window.matchMedia('(max-width: 768px)').matches) return;

  const hamburger = document.getElementById('hamburger');
  if (!hamburger) return;

  hamburger.addEventListener('click', () => {
    const navLinks = document.getElementById('navLinks');
    if (!navLinks) return;
    // Small delay to let the toggle happen first
    setTimeout(() => {
      if (navLinks.classList.contains('open')) {
        lockScroll();
      } else {
        unlockScroll();
      }
    }, 10);
  });

  // Also unlock on nav close (overlay click / link click)
  document.addEventListener('navClosed', unlockScroll);
})();

/* ============================================================
   27. SECTION GLOW (optional luxury effect)
============================================================ */
(function initSectionGlow() {
  const sections = document.querySelectorAll('.section-padding');
  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transition = 'opacity 0.6s ease';
      }
    });
  }, { threshold: 0.05 });

  sections.forEach(s => observer.observe(s));
})();

/* ============================================================
   28. CONSOLE BRANDING
============================================================ */
console.log(
  '%c G EVENTS TIRUPATI %c\n%c Premium Event Planners | Tirupati, AP\n📞 +91 96424 74334',
  'background: linear-gradient(135deg, #c9a84c, #e8c96a); color: #0d0d0d; font-size: 18px; font-weight: bold; padding: 8px 16px; border-radius: 4px;',
  '',
  'color: #c9a84c; font-size: 13px;'
);
