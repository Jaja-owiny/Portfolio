(() => {
  const contact = document.getElementById("contact");
  if (!contact || document.getElementById("blog")) return;

  const blog = document.createElement("section");
  blog.id = "blog";
  blog.className = "content-section content-section--cream";
  blog.innerHTML = `<div class="container-xxl px-4 px-xl-5"><div class="content-section__heading"><div><p class="eyebrow"><span></span> Notes from the studio</p><h2 class="section-title">Ideas worth <em>sharing.</em></h2></div></div><div class="content-slider"><div class="content-track" data-slider="blog"><article class="content-card"><img class="content-card__image" src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=85" alt="Code editor on a laptop" loading="lazy"><div class="content-card__body"><span class="content-card__meta">Craft / 01</span><h3>Designing for the pause</h3><p>Why thoughtful interfaces give people room to understand before they ask for action.</p></div></article><article class="content-card"><img class="content-card__image" src="https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=900&q=85" alt="Designer sketching an interface" loading="lazy"><div class="content-card__body"><span class="content-card__meta">Interface / 02</span><h3>Motion with a reason</h3><p>A practical look at using movement to clarify hierarchy, feedback, and place.</p></div></article><article class="content-card"><img class="content-card__image" src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85" alt="Person working at a desk" loading="lazy"><div class="content-card__body"><span class="content-card__meta">Systems / 03</span><h3>Small systems, big leverage</h3><p>The habits that keep a growing product coherent long after its first launch.</p></div></article><article class="content-card"><img class="content-card__image" src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=85" alt="Developer working with code" loading="lazy"><div class="content-card__body"><span class="content-card__meta">Engineering / 04</span><h3>Making complexity legible</h3><p>How architecture and language can make sophisticated products feel calm.</p></div></article><article class="content-card"><img class="content-card__image" src="https://images.unsplash.com/photo-1523726491678-bf852e717f6a?auto=format&fit=crop&w=900&q=85" alt="Creative workspace with sketches" loading="lazy"><div class="content-card__body"><span class="content-card__meta">Practice / 05</span><h3>The work behind the work</h3><p>A note on curiosity, iteration, and staying close to the people using what we build.</p></div></article></div><div class="slider-controls"><button class="slider-button" data-slider-action="prev" data-slider-target="blog" aria-label="Previous blog post"><i data-lucide="arrow-left"></i></button><button class="slider-button" data-slider-action="next" data-slider-target="blog" aria-label="Next blog post"><i data-lucide="arrow-right"></i></button></div></div></div>`;

  const testimonials = document.createElement("section");
  testimonials.id = "testimonials";
  testimonials.className = "content-section content-section--white";
  testimonials.innerHTML = `<div class="container-xxl px-4 px-xl-5"><div class="content-section__heading"><div><p class="eyebrow"><span></span> Words from collaborators</p><h2 class="section-title">Good work leaves a <em>trace.</em></h2></div></div><div class="content-slider"><div class="content-track testimonial-track" data-slider="testimonials"><article class="testimonial-card"><blockquote>Jason brought structure to a difficult product without sanding away its character.</blockquote><cite>Product lead / London</cite></article><article class="testimonial-card"><blockquote>The rare engineer who can make a technical decision feel like a design decision.</blockquote><cite>Creative director / Nairobi</cite></article><article class="testimonial-card"><blockquote>Every interaction had a purpose, and every handoff made the next step clearer.</blockquote><cite>Founder / New York</cite></article><article class="testimonial-card"><blockquote>Calm, precise, and unusually attentive to the details users actually notice.</blockquote><cite>Engineering lead / Remote</cite></article><article class="testimonial-card"><blockquote>He made a complex system feel simple enough to trust and powerful enough to grow.</blockquote><cite>Operations director / Nairobi</cite></article></div><div class="slider-controls"><button class="slider-button" data-slider-action="prev" data-slider-target="testimonials" aria-label="Previous testimonial"><i data-lucide="arrow-left"></i></button><button class="slider-button" data-slider-action="next" data-slider-target="testimonials" aria-label="Next testimonial"><i data-lucide="arrow-right"></i></button></div></div></div>`;

  const testimonialSlider = testimonials.querySelector(".content-slider");
  const testimonialLayout = document.createElement("div");
  testimonialLayout.className = "testimonial-layout";
  const testimonialVisual = document.createElement("div");
  testimonialVisual.className = "testimonial-visual";
  testimonialVisual.innerHTML =
    '<span class="testimonial-quote testimonial-quote--top">“</span><img src="static/assets/logo-1024.png" alt="Jason Ocholla logo" loading="lazy"><span class="testimonial-quote testimonial-quote--bottom">”</span>';
  testimonialSlider?.parentNode.insertBefore(
    testimonialLayout,
    testimonialSlider,
  );
  testimonialLayout.append(testimonialVisual, testimonialSlider);

  const faqs = document.createElement("section");
  faqs.id = "faqs";
  faqs.className = "content-section content-section--cream";
  faqs.innerHTML = `<div class="container-xxl px-4 px-xl-5"><div class="content-section__heading"><div><p class="eyebrow"><span></span> Before we begin</p><h2 class="section-title">A few clear <em>answers.</em></h2></div></div><div class="faq-list"><div class="faq-item"><button class="faq-question" type="button" aria-expanded="false">What kind of work do you take on?<i data-lucide="chevron-down"></i></button><div class="faq-answer"><div><p>Product interfaces, full-stack applications, interactive websites, real-time dashboards, and the systems that support them.</p></div></div></div><div class="faq-item"><button class="faq-question" type="button" aria-expanded="false">How do you usually start a project?<i data-lucide="chevron-down"></i></button><div class="faq-answer"><div><p>We begin with a short conversation about the problem, the people involved, and the outcome that would make the work worthwhile. From there I shape a focused first step.</p></div></div></div><div class="faq-item"><button class="faq-question" type="button" aria-expanded="false">Can you work with an existing team or codebase?<i data-lucide="chevron-down"></i></button><div class="faq-answer"><div><p>Yes. I am comfortable joining an existing product team, extending an established system, or taking a focused feature from idea through release.</p></div></div></div><div class="faq-item"><button class="faq-question" type="button" aria-expanded="false">Where are you based?<i data-lucide="chevron-down"></i></button><div class="faq-answer"><div><p>I am based in Nairobi and work remotely with collaborators across time zones.</p></div></div></div></div></div>`;

  contact.before(blog, testimonials, faqs);

  const sliderTimers = new Map();
  const moveSlider = (track, direction) => {
    const card = track?.querySelector(".content-card, .testimonial-card");
    if (!card) return;
    const amount = card.getBoundingClientRect().width + 16;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const nextPosition = track.scrollLeft + direction * amount;
    const wrappedPosition =
      nextPosition > maxScroll
        ? 0
        : nextPosition < 0
          ? maxScroll
          : nextPosition;
    track.scrollTo({ left: wrappedPosition, behavior: "smooth" });
  };
  const restartSlider = (track) => {
    const name = track.dataset.slider;
    window.clearInterval(sliderTimers.get(name));
    sliderTimers.set(
      name,
      window.setInterval(() => moveSlider(track, 1), 6000),
    );
  };
  document.querySelectorAll("[data-slider-action]").forEach((button) =>
    button.addEventListener("click", () => {
      const track = document.querySelector(
        `[data-slider="${button.dataset.sliderTarget}"]`,
      );
      moveSlider(track, button.dataset.sliderAction === "next" ? 1 : -1);
      restartSlider(track);
    }),
  );
  document.querySelectorAll("[data-slider]").forEach((track) => {
    restartSlider(track);
    track.addEventListener("mouseenter", () =>
      window.clearInterval(sliderTimers.get(track.dataset.slider)),
    );
    track.addEventListener("mouseleave", () => restartSlider(track));
    track.addEventListener("focusin", () =>
      window.clearInterval(sliderTimers.get(track.dataset.slider)),
    );
    track.addEventListener("focusout", () => restartSlider(track));
  });

  document.querySelectorAll(".faq-question").forEach((question) =>
    question.addEventListener("click", () => {
      const item = question.closest(".faq-item");
      const wasOpen = item.classList.contains("is-open");
      document.querySelectorAll(".faq-item.is-open").forEach((openItem) => {
        openItem.classList.remove("is-open");
        openItem
          .querySelector(".faq-question")
          .setAttribute("aria-expanded", "false");
      });
      if (!wasOpen) {
        item.classList.add("is-open");
        question.setAttribute("aria-expanded", "true");
      }
    }),
  );

  if (window.lucide) lucide.createIcons();
})();
