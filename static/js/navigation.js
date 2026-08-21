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
    menu.setAttribute('aria-hidden', String(!open));
  };

  menuToggle.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu.querySelectorAll('.mobile-nav-link').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
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
