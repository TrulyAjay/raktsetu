// ── RaktSetu Global App JS ──
// Handles: page transitions, navbar scroll, mobile menu close on navigate

(function() {

  // ── Page Transition on link click ──
  function initPageTransitions() {
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href');
      // Skip: external, hash, mailto, tel, javascript, target=_blank
      if (!href || href.startsWith('http') || href.startsWith('#') ||
          href.startsWith('mailto') || href.startsWith('tel') ||
          href.startsWith('javascript') || link.target === '_blank' ||
          link.hasAttribute('data-no-transition')) return;
      // Skip Bootstrap toggles
      if (link.hasAttribute('data-bs-toggle') || link.hasAttribute('data-bs-dismiss')) return;

      e.preventDefault();
      document.body.style.opacity = '0';
      document.body.style.transform = 'translateY(-5px)';
      document.body.style.transition = 'opacity 0.18s ease, transform 0.18s ease';
      setTimeout(() => { window.location.href = href; }, 185);
    });
  }

  // ── Navbar shadow on scroll ──
  function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    function updateNavbar() {
      if (window.scrollY > 10) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    }
    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();
  }

  // ── Close mobile navbar on link click ──
  function initMobileNavClose() {
    const navCollapse = document.getElementById('navbarNav');
    if (!navCollapse) return;
    navCollapse.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) bsCollapse.hide();
      });
    });
  }

  // ── Smooth body entrance (remove stale transition) ──
  function initEntrance() {
    document.body.style.opacity = '';
    document.body.style.transform = '';
    document.body.style.transition = '';
  }

  // ── Run on DOM ready ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    initEntrance();
    initPageTransitions();
    initNavbarScroll();
    initMobileNavClose();
  }

})();
