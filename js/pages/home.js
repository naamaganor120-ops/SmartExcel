/**
 * SmartExcel — Home Page Controller
 * Handles interactive behavior for the home/landing page.
 * The home page is mostly static content; this module adds
 * smooth scroll for anchor links and subtle entrance animations.
 */
(function () {
  'use strict';

  /**
   * Smooth-scroll any in-page anchor links (href starts with #).
   */
  function setupSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;

      var targetId = link.getAttribute('href').slice(1);
      var targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      e.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Move focus for accessibility
      targetEl.setAttribute('tabindex', '-1');
      targetEl.focus({ preventScroll: true });
    });
  }

  /**
   * Add a subtle fade-in animation to sections as they scroll into view.
   * Uses IntersectionObserver for performance.
   */
  function setupScrollAnimations() {
    if (!('IntersectionObserver' in window)) return;

    var sections = document.querySelectorAll('#main-content > .section');

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    sections.forEach(function (section) {
      section.style.opacity = '0';
      section.style.transform = 'translateY(20px)';
      section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(section);
    });
  }

  /**
   * Initialize home page interactions.
   */
  function init() {
    setupSmoothScroll();
    setupScrollAnimations();
  }

  // Run on DOMContentLoaded or immediately if DOM is already ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
