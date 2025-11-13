/* Shared site JS: small, dependency-free helpers */
(function(){
  'use strict';

  // Toggle mobile nav when hamburger present
  function toggleMenuBtn() {
    const btn = document.querySelector('.hamburger, .menu-toggle');
    const nav = document.getElementById('navLinks') || document.querySelector('.nav-links');
    if (!btn || !nav) return;
    if (btn.dataset.reactControlled === 'true' || nav.dataset.reactControlled === 'true') return;
    btn.addEventListener('click', () => {
      nav.classList.toggle('show');
      nav.classList.toggle('is-open');
      btn.classList.toggle('active');
    });
  }

  // Ensure external links have target/_blank and rel attributes
  function externalizeLinks() {
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      if (!/^https?:\/\//i.test(href) && href.indexOf('://') === -1) {
        if (href.indexOf('/') === -1 && href.indexOf('.') !== -1) {
          a.href = 'https://' + href;
        }
      }
      if (/^https?:\/\//i.test(a.href)) {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }
    });
  }

  // scroll-to-top button visibility
  function scrollTopVisibility() {
    const btn = document.querySelector('.scroll-to-top, .top-button');
    if (!btn) return;
    const update = () => {
      if (window.scrollY > 300) {
        btn.classList.add('visible');
        btn.style.display = '';
      } else {
        btn.classList.remove('visible');
        btn.style.display = 'none';
      }
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { toggleMenuBtn(); externalizeLinks(); scrollTopVisibility(); });
  } else {
    toggleMenuBtn(); externalizeLinks(); scrollTopVisibility();
  }

})();
