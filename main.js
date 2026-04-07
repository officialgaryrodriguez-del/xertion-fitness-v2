/* ============================================================
   XERTION FITNESS — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ─── Sticky Header ──────────────────────────────────────── */
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  /* ─── Mobile Menu ────────────────────────────────────────── */
  const burger = document.querySelector('.header__burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link');

  function toggleMenu(open) {
    burger?.classList.toggle('open', open);
    mobileMenu?.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  burger?.addEventListener('click', () => {
    const isOpen = mobileMenu?.classList.contains('open');
    toggleMenu(!isOpen);
  });

  mobileLinks.forEach(link => link.addEventListener('click', () => toggleMenu(false)));

  mobileMenu?.addEventListener('click', (e) => {
    if (e.target === mobileMenu) toggleMenu(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleMenu(false);
  });

  /* ─── Active Nav Link ────────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .mobile-menu__link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (
      href === currentPage ||
      (currentPage === '' && href === 'index.html') ||
      (currentPage === 'index.html' && href === 'index.html')
    ) {
      link.classList.add('active');
    }
  });

  /* ─── Scroll Reveal ──────────────────────────────────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    .forEach(el => revealObserver.observe(el));

  /* ─── Counter Animation ──────────────────────────────────── */
  function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = easeOutQuart(progress) * target;
      const display = Number.isInteger(target) ? Math.round(value) : value.toFixed(2);
      el.textContent = prefix + display + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-counter]')
    .forEach(el => counterObserver.observe(el));

  /* ─── Mobile CTA Bar ─────────────────────────────────────── */
  const mobileCta = document.querySelector('.mobile-cta-bar');
  if (mobileCta) {
    window.addEventListener('scroll', () => {
      mobileCta.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
  }

  /* ─── FAQ Accordion ──────────────────────────────────────── */
  document.querySelectorAll('.faq-item__question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ─── Gallery Lightbox ───────────────────────────────────── */
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox?.querySelector('.lightbox__img');
  const lightboxClose = lightbox?.querySelector('.lightbox__close');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (lightboxImg && img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

  function closeLightbox() {
    lightbox?.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ─── Contact Form ───────────────────────────────────────── */
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.querySelector('.form-success');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending...';

    const data = new FormData(contactForm);

    fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(data).toString() })
      .then(() => {
        contactForm.style.display = 'none';
        if (formSuccess) formSuccess.style.display = 'block';
      })
      .catch(() => {
        btn.disabled = false;
        btn.textContent = 'Send Message';
        alert('Something went wrong. Please try again or email us directly at xertionfitness1@gmail.com');
      });
  });

  /* ─── Training Application Form ──────────────────────────── */
  const trainingForm = document.getElementById('training-form');
  const trainingSuccess = document.querySelector('.training-success');

  trainingForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = trainingForm.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Submitting...';

    setTimeout(() => {
      trainingForm.style.display = 'none';
      if (trainingSuccess) trainingSuccess.style.display = 'block';
    }, 1000);
  });

})();
