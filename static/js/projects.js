(() => {
  const modal = document.getElementById("project-modal"),
    image = document.getElementById("project-modal-image"),
    title = document.getElementById("project-modal-title"),
    cards = [...document.querySelectorAll(".project-card")];
  if (!modal || !image || !title) return;
  if (window.lucide) lucide.createIcons();
  
  const style = document.createElement("style");
  style.textContent =
    '.project-cards{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr));gap:1.25rem;overflow:visible}.project-card{display:block!important;min-width:0}.projects-controls{display:flex;align-items:center;justify-content:center;gap:.65rem;margin-top:1.75rem}.projects-counter{color:var(--muted);font:500 .62rem/1 "DM Mono",monospace}.projects-control{display:grid;place-items:center;width:2.65rem;height:2.65rem;border:1px solid var(--line);border-radius:50%;color:var(--maroon);background:transparent;transition:background .25s,color .25s,opacity .25s}.projects-control:hover:not(:disabled),.projects-control:focus-visible:not(:disabled){color:#fff;background:var(--maroon)}.projects-control:disabled{cursor:not-allowed;opacity:.35}.projects-control svg{width:1rem;height:1rem}@media (max-width:991px){.project-cards{grid-template-columns:repeat(2,minmax(0,1fr))}}@media (max-width:767px){.project-cards{grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}}@media (max-width:575px){.project-cards{grid-template-columns:1fr;gap:1.25rem}.project-card__media{aspect-ratio:16/10}.project-card__overlay{width:40%}.project-card__action{width:2.5rem;height:2.5rem;min-width:44px;min-height:44px}.project-card__details{padding-top:1rem;flex-direction:column;gap:.5rem}.project-card__details h3{font-size:clamp(1.4rem,4vw,2.1rem)}.project-card > p{font-size:.85rem;max-width:100%}.project-tags{display:flex;flex-wrap:wrap}.project-modal{padding:.5rem}.project-modal__close{width:44px;height:44px;top:-.5rem;right:0}.project-modal__content{max-width:100%;max-height:90vh}.project-modal__content img{max-height:80vh}}@media (max-width:480px){.project-cards{gap:1rem}.project-card__media{aspect-ratio:4/3}.project-card__overlay{width:45%}.project-card__action{width:2.25rem;height:2.25rem;min-width:44px;min-height:44px}.project-card__details h3{font-size:1.35rem}.project-card > p{font-size:.82rem}}';
  document.head.append(style);
  
  const cardsContainer = document.querySelector(".project-cards");
  if (cardsContainer && cards.length) {
    const controls = document.createElement("div");
    controls.className = "projects-controls";
    controls.innerHTML =
      '<span class="projects-counter" aria-live="polite">01 / ' +
      String(cards.length).padStart(2, "0") +
      '</span><button class="projects-control" type="button" aria-label="Previous project" disabled><i data-lucide="arrow-left"></i></button><button class="projects-control" type="button" aria-label="Next project" disabled><i data-lucide="arrow-right"></i></button>';
    cardsContainer.parentElement.append(controls);
    if (window.lucide) lucide.createIcons();
  }

  const filterButtons = [...document.querySelectorAll("[data-project-filter]")];
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.projectFilter;

      filterButtons.forEach((filterButton) => {
        const isActive = filterButton === button;
        filterButton.classList.toggle("is-active", isActive);
        filterButton.setAttribute("aria-pressed", String(isActive));
      });

      cards.forEach((card) => {
        const isVisible = filter === "all" || card.dataset.projectCategory === filter;
        card.classList.toggle("is-filtered-out", !isVisible);
      });
    });
  });
  
  const closeButton = modal.querySelector(".project-modal__close"),
    close = () => {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("project-modal-open");
      image.src = "";
      document.body.style.overflow = "";
    };
  
  document.querySelectorAll("[data-project-image]").forEach((button) =>
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      image.src = button.dataset.projectImage;
      image.alt = `Fullscreen view of ${button.dataset.projectTitle}`;
      title.textContent = button.dataset.projectTitle;
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("project-modal-open");
      document.body.style.overflow = "hidden";
      closeButton?.focus();
    }),
  );

  cards.forEach((card) => {
    const media = card.querySelector(".project-card__media");
    if (!media) return;

    media.addEventListener("click", (event) => {
      if (!matchMedia("(hover: none) and (pointer: coarse)").matches) return;
      if (event.target.closest(".project-card__action")) return;

      cards.forEach((otherCard) => {
        if (otherCard !== card) otherCard.classList.remove("is-tapped");
      });
      card.classList.toggle("is-tapped");
    });
  });
  
  modal
    .querySelectorAll("[data-project-modal-close]")
    .forEach((element) => element.addEventListener("click", close));
    
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) close();
  });
  
  // Close modal when clicking backdrop
  modal.querySelector(".project-modal__backdrop")?.addEventListener("click", close);
  
  // Touch swipe support for project cards carousel on mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  cardsContainer?.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  cardsContainer?.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  
  const handleSwipe = () => {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    const controls = document.querySelector(".projects-controls");
    if (!controls) return;
    
    const prevBtn = controls.querySelector('[aria-label="Previous project"]');
    const nextBtn = controls.querySelector('[aria-label="Next project"]');
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0 && !nextBtn.disabled) {
        nextBtn.click();
      } else if (diff < 0 && !prevBtn.disabled) {
        prevBtn.click();
      }
    }
  };
})();