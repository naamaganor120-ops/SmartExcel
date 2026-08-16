/**
 * SmartExcel — Shared Navigation Module
 * Renders the navigation bar and footer into every page.
 * Self-executing on DOMContentLoaded.
 */
(function () {
  'use strict';

  /** Navigation links configuration */
  var NAV_LINKS = [
    { label: 'Home', i18nKey: 'nav.home', href: '/index.html' },
    { label: 'Compare', i18nKey: 'nav.compare', href: '/compare.html' },
    { label: 'Clean', i18nKey: 'nav.clean', href: '/clean.html' },
    { label: 'Dashboard', i18nKey: 'nav.dashboard', href: '/dashboard.html' },
    { label: 'About & Contact', i18nKey: 'nav.about', href: '/about.html' }
  ];

  /**
   * Get translated text if I18n is available, otherwise return default.
   * @param {string} key - i18n translation key
   * @param {string} fallback - default English text
   * @returns {string}
   */
  function tr(key, fallback) {
    if (typeof I18n !== 'undefined' && I18n.t) {
      return I18n.t(key);
    }
    return fallback;
  }

  /**
   * Determine which nav link is active based on current page path.
   * @param {string} linkHref - The href of the nav link
   * @returns {boolean}
   */
  function isActivePage(linkHref) {
    var pathname = window.location.pathname;
    // Normalize: strip trailing slash
    var normalizedPath = pathname.replace(/\/$/, '');

    // Handle root path — treat as index.html
    if (normalizedPath === '' || normalizedPath === '/' || normalizedPath.endsWith('/index.html')) {
      return linkHref === '/index.html';
    }

    // Extract just the filename from both paths for comparison
    var currentFile = normalizedPath.split('/').pop();
    var linkFile = linkHref.split('/').pop();

    return currentFile === linkFile;
  }

  /**
   * Render the navigation bar HTML into the existing <nav> element.
   */
  function renderNavbar() {
    var navEl = document.querySelector('header nav[aria-label="Main navigation"]');
    if (!navEl) return;

    // Add navbar class to the nav element
    navEl.classList.add('navbar');

    // Build navigation links HTML
    var linksHtml = NAV_LINKS.map(function (link) {
      var activeClass = isActivePage(link.href) ? ' navbar__link--active' : '';
      var ariaCurrent = isActivePage(link.href) ? ' aria-current="page"' : '';
      var linkText = tr(link.i18nKey, link.label);
      return '<li><a href="' + link.href + '" class="navbar__link' + activeClass + '"' + ariaCurrent + ' data-i18n="' + link.i18nKey + '">' + linkText + '</a></li>';
    }).join('\n            ');

    var langSwitchText = tr('lang.switch', '\u05e2\u05d1\u05e8\u05d9\u05ea');

    var navHtml = ''
      + '<div class="container">'
      + '  <a href="/index.html" class="navbar__brand">'
      + '    <span aria-hidden="true">📊</span>'
      + '    <span>SmartExcel</span>'
      + '  </a>'
      + '  <div class="lang-switcher">'
      + '    <button type="button" class="lang-switcher__btn" data-i18n-switch aria-label="Switch language" onclick="I18n.toggle()">' + langSwitchText + '</button>'
      + '  </div>'
      + '  <button class="navbar__toggle" aria-label="Toggle navigation menu" aria-expanded="false">'
      + '    <span></span>'
      + '    <span></span>'
      + '    <span></span>'
      + '  </button>'
      + '  <ul class="navbar__nav" role="list">'
      + '    ' + linksHtml
      + '  </ul>'
      + '</div>';

    navEl.innerHTML = navHtml;
  }

  /**
   * Render the footer HTML into the existing <footer> element.
   */
  function renderFooter() {
    var footerEl = document.querySelector('footer');
    if (!footerEl) return;

    // Add footer class
    footerEl.classList.add('footer');

    var currentYear = new Date().getFullYear();
    var copyrightText = tr('footer.copyright', '\u00a9 ' + currentYear + ' SmartExcel. All rights reserved.').replace('{year}', currentYear);

    var footerHtml = ''
      + '<div class="container">'
      + '  <div class="footer__content">'
      + '    <div class="footer__brand">'
      + '      <div class="footer__brand-name">📊 <span data-i18n="footer.brand">' + tr('footer.brand', 'SmartExcel') + '</span></div>'
      + '      <p class="footer__brand-desc" data-i18n="footer.desc">' + tr('footer.desc', 'Smart Excel file processing tools \u2014 compare, clean, and analyze your spreadsheets directly in the browser.') + '</p>'
      + '    </div>'
      + '    <nav class="footer__nav" aria-label="Footer navigation">'
      + '      <div class="footer__nav-group">'
      + '        <strong class="footer__nav-title" data-i18n="footer.services">' + tr('footer.services', 'Services') + '</strong>'
      + '        <ul>'
      + '          <li><a href="/compare.html" data-i18n="footer.compare">' + tr('footer.compare', 'Compare Files') + '</a></li>'
      + '          <li><a href="/clean.html" data-i18n="footer.clean">' + tr('footer.clean', 'Clean Data') + '</a></li>'
      + '          <li><a href="/dashboard.html" data-i18n="footer.dashboard">' + tr('footer.dashboard', 'Dashboard') + '</a></li>'
      + '        </ul>'
      + '      </div>'
      + '      <div class="footer__nav-group">'
      + '        <strong class="footer__nav-title" data-i18n="footer.info">' + tr('footer.info', 'Info') + '</strong>'
      + '        <ul>'
      + '          <li><a href="/about.html" data-i18n="footer.about">' + tr('footer.about', 'About') + '</a></li>'
      + '          <li><a href="/about.html#contact" data-i18n="footer.contact">' + tr('footer.contact', 'Contact') + '</a></li>'
      + '        </ul>'
      + '      </div>'
      + '    </nav>'
      + '  </div>'
      + '  <div class="footer__bottom">'
      + '    <p class="footer__copyright" data-i18n-copyright>' + copyrightText + '</p>'
      + '    <ul class="footer__bottom-links">'
      + '      <li><a href="/about.html" data-i18n="footer.about">' + tr('footer.about', 'About') + '</a></li>'
      + '      <li><a href="/about.html#contact" data-i18n="footer.contact">' + tr('footer.contact', 'Contact') + '</a></li>'
      + '    </ul>'
      + '  </div>'
      + '</div>';

    footerEl.innerHTML = footerHtml;
  }

  /**
   * Set up mobile menu toggle behavior.
   */
  function setupMobileMenu() {
    var toggleBtn = document.querySelector('.navbar__toggle');
    var navMenu = document.querySelector('.navbar__nav');
    if (!toggleBtn || !navMenu) return;

    // Toggle menu on button click
    toggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = navMenu.classList.toggle('navbar__nav--open');
      toggleBtn.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when a nav link is clicked
    navMenu.addEventListener('click', function (e) {
      if (e.target.classList.contains('navbar__link')) {
        navMenu.classList.remove('navbar__nav--open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (!navMenu.classList.contains('navbar__nav--open')) return;
      var navbar = document.querySelector('.navbar');
      if (navbar && !navbar.contains(e.target)) {
        navMenu.classList.remove('navbar__nav--open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /**
   * Initialize navigation on DOM ready.
   */
  function init() {
    renderNavbar();
    renderFooter();
    setupMobileMenu();
  }

  // Listen for language changes to re-render navigation
  document.addEventListener('languageChanged', function() {
    renderNavbar();
    renderFooter();
    setupMobileMenu();
  });

  // Run on DOMContentLoaded or immediately if DOM is already ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
