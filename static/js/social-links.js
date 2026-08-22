(() => {
  const contactDetails = document.querySelector('.contact-details');
  if (!contactDetails || contactDetails.querySelector('.social-links')) return;

  const links = [
    ['https://github.com/Jaja-owiny', 'GitHub', 'fa-github'],
    ['https://wa.me/+254113036374', 'WhatsApp', 'fa-whatsapp'],
    ['https://www.tiktok.com/@bigmanjay01?_r=1&_t=ZS-996Ic6WFAlr', 'TikTok', 'fa-tiktok'],
    ['https://www.instagram.com/jaja_bigman?igsi=MzNlNGNkZWQ4Mg==', 'Instagram', 'fa-instagram'],
    ['https://www.facebook.com/', 'Facebook', 'fa-facebook-f']
  ];

  const socialLinks = document.createElement('div');
  socialLinks.className = 'social-links';
  socialLinks.setAttribute('aria-label', 'Social links');

  links.forEach(([url, label, icon]) => {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', label);
    link.title = label;
    link.innerHTML = `<i class="fa-brands ${icon}" aria-hidden="true"></i>`;
    socialLinks.appendChild(link);
  });

  contactDetails.appendChild(socialLinks);
})();
