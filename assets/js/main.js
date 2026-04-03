// Mobile nav toggle
document.addEventListener('DOMContentLoaded', function () {
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded',
        navLinks.classList.contains('open'));
    });
  }

  // Docs sidebar toggle (mobile)
  var sidebarToggle = document.querySelector('.sidebar-toggle');
  var sidebarNav = document.querySelector('.sidebar-nav');

  if (sidebarToggle && sidebarNav) {
    sidebarToggle.addEventListener('click', function () {
      sidebarNav.classList.toggle('open');
      sidebarToggle.setAttribute('aria-expanded',
        sidebarNav.classList.contains('open'));
    });
  }
});
