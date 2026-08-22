(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (window.lucide) lucide.createIcons();
  const header = document.getElementById("site-header"),
    toggle = document.getElementById("menu-toggle"),
    menu = document.getElementById("mobile-menu");
  toggle?.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
    menu.setAttribute("aria-hidden", !open);
    toggle.innerHTML = `<i data-lucide="${open ? "x" : "menu"}"></i>`;
    lucide.createIcons();
  });
  document.querySelectorAll(".mobile-nav-link").forEach((a) =>
    a.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle?.setAttribute("aria-expanded", "false");
    }),
  );
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          observer.unobserve(e.target);
        }
      }),
    { threshold: 0.15 },
  );
  document.querySelectorAll(".reveal").forEach((e) => observer.observe(e));
  const items = [...document.querySelectorAll("[data-parallax]")];
  let y = scrollY,
    ticking = false;
  const motion = () => {
    ticking = false;
    header?.classList.toggle("scrolled", y > 24);
    if (!reduced)
      items.forEach((e) => {
        const n = Number(e.dataset.parallax) || 0;
        e.style.transform = `translate3d(0,${(y - e.offsetTop + innerHeight / 2) * n}px,0)`;
      });
  };
  addEventListener(
    "scroll",
    () => {
      y = scrollY;
      if (!ticking) {
        requestAnimationFrame(motion);
        ticking = true;
      }
    },
    { passive: true },
  );
  motion();
  const commands = {
    help: `Available shell systems:\n  - about       View profile and working principles\n  - skills      Inspect core proficiencies\n  - projects    Enumerate active projects\n  - mql5        Review Valkyrie EA status\n  - clear       Wipe terminal logs\n  - contact     Open the communication channel`,
    about: `================ JASON OCHOLLA PROFILE ================\nNAME        : Jason Ocholla\nROLE        : Senior Software & Web Engineer\nEXPERTISE   : Frontend, backend APIs, interactive web\nLOCATION    : Nairobi / Remote\nMOTTO       : Make complex things feel clear`,
    skills: `{"core":["JavaScript","TypeScript","Python","SQL","MQL5"],\n "frameworks":["React","Next.js","FastAPI","Tailwind CSS"],\n "principles":["clarity","restraint","reliability"]}`,
    projects: `1. AETHER DEFI     - Real-time Next.js analytics\n2. VALKYRIE EA      - MQL5 + Python trading system\n3. STELLARMAP 3D   - Interactive telemetry experience`,
    mql5: `================ VALKYRIE EA STATUS REPORT ================\nCOMPILER    : MetaEditor / MQL5\nSTRATEGY    : Volatility prediction and risk controls\nINTEGRATION : MT5 Terminal <--> Python Socket API\nSAFETY      : Equity guards active`,
    contact: `Directing communication pipeline...\nStatus: Ready for a thoughtful brief.\nUse the contact form below to connect.`,
  };
  const out = document.getElementById("terminal-text-output"),
    screen = document.getElementById("terminal-screen"),
    input = document.getElementById("terminal-input");
  const print = (text) => {
    if (!out) return;
    out.textContent = text;
    screen.scrollTop = screen.scrollHeight;
  };
  window.switchTab = (tab) => {
    document
      .querySelectorAll(".terminal-tab")
      .forEach((e) => e.classList.remove("active"));
    document.getElementById(`tab-${tab}`)?.classList.add("active");
    print(commands[tab] || commands.help);
  };
  switchTab("about");
  input?.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const v = input.value.trim().toLowerCase();
    input.value = "";
    if (!v) return;
    const response =
      v === "clear"
        ? "bash terminal log cleared."
        : commands[v] ||
          `Command not recognized: '${v}'. Type 'help' to review directory.`;
    out.textContent += `\n\njason@ocholla:~$ ${v}\n${response}`;
    screen.scrollTop = screen.scrollHeight;
  });
  const status = document.getElementById("form-status"),
    form = document.getElementById("contact-form"),
    submit = document.getElementById("form-submit-btn"),
    subject = document.getElementById("subject"),
    otherWrap = document.getElementById("subject-other-wrapper"),
    other = document.getElementById("subject-other"),
    key = "82721d04-a172-4ed6-b5dd-928285bec7b8";
  subject?.addEventListener("change", () => {
    const show = subject.value === "custom_request";
    otherWrap?.classList.toggle("hidden", !show);
    if (other) {
      other.required = show;
      if (!show) other.value = "";
    }
  });
  window.handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!status || !form || !submit) return;
    status.className = "hidden";
    const hCaptchaToken = form.querySelector(
      'textarea[name="h-captcha-response"]',
    )?.value;
    if (!hCaptchaToken) {
      status.className = "bg-red-950/40";
      status.textContent = "Please complete the hCaptcha verification.";
      return;
    }
    submit.disabled = true;
    submit.querySelector("span").textContent = "Sending...";
    try {
      const message = document.getElementById("message")?.value || "";
      const selectedSubject =
        subject?.value === "custom_request"
          ? other?.value.trim() || "Custom request"
          : subject?.selectedOptions[0]?.textContent.trim() || "Website inquiry";
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: key,
          name: document.getElementById("name")?.value || "",
          email: document.getElementById("email")?.value || "",
          subject: selectedSubject,
          message,
          replyto: document.getElementById("email")?.value || "",
          "h-captcha-response": hCaptchaToken,
        }),
      });
      const responseText = await response.text();
      let result;
      try {
        result = JSON.parse(responseText);
      } catch {
        result = { message: responseText };
      }
      if (!response.ok || result.success !== true) {
        throw new Error(result.message || `Request failed (${response.status})`);
      }
      status.className = "bg-emerald-950/40";
      status.textContent = "Message sent. I will be in touch soon.";
      form.reset();
    } catch (error) {
      status.className = "bg-red-950/40";
      status.textContent =
        error instanceof TypeError
          ? "Unable to reach the contact service. Check your connection and try again."
          : error.message || "The contact service rejected the request. Please try again.";
    } finally {
      submit.disabled = false;
      submit.querySelector("span").textContent = "Send message";
    }
  };
})();
