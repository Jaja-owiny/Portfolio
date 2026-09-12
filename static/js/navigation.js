(() => {
  const header = document.getElementById('site-header');
  const hero = document.getElementById('hero');
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!header || !hero || !toggle || !menu) return;

  const freshToggle = toggle.cloneNode(true);
  toggle.replaceWith(freshToggle);
  const menuToggle = document.getElementById('menu-toggle');

  const setMenu = (open) => {
    menu.classList.toggle('open', open);
    header.classList.toggle('menu-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    menu.setAttribute('aria-hidden', String(!open));

    // Prevent body scroll when menu is open
    document.body.style.overflow = open ? 'hidden' : '';
  };

  menuToggle.addEventListener('click', (event) => {
    event.preventDefault();
    setMenu(!menu.classList.contains('open'));
  });
  menu.querySelectorAll('.mobile-nav-link').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });

  // Close menu when clicking outside
  document.addEventListener('click', (event) => {
    if (menu.classList.contains('open') && !menu.contains(event.target) && !menuToggle.contains(event.target)) {
      setMenu(false);
    }
  });

  const updateHeader = () => {
    const compact = window.scrollY > hero.offsetTop + hero.offsetHeight - 96;
    header.classList.toggle('scrolled', compact);
    if (!compact) setMenu(false);
  };
  window.addEventListener('scroll', updateHeader, { passive: true });
  window.addEventListener('resize', updateHeader);
  updateHeader();
})();