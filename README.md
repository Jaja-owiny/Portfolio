# Jason Ocholla — Portfolio

Personal portfolio for Jason Ocholla, a software and web engineer based in Nairobi. The site presents selected work, capabilities, professional history, and a contact channel in a single-page layout with an auxiliary blog reader.

---

## Tech stack

| Layer | Choice |
|---|---|
| Markup | HTML5, semantic sectioning |
| Styling | Custom CSS (modular files) + Tailwind CSS (play CDN) + Bootstrap 5 grid |
| Scripting | Vanilla JavaScript (ES modules via IIFEs) |
| Type | Playfair Display · Manrope · DM Mono (Google Fonts) |
| Icons | Lucide · Font Awesome 6 |
| Markdown | marked.js (blog reader) |
| Mail | Web3Forms |

No build step. No framework. Open `index.html` in a browser and it runs.

---

## File structure

```
/
├── index.html                  # Single-page portfolio entry point
├── blog.html                   # Standalone blog reader (Markdown, ?post=slug)
│
├── static/
│   ├── css/
│   │   ├── main.css            # Design tokens, layout, all core components
│   │   ├── navigation.css      # Floating pill nav + compact scrolled state
│   │   ├── navigation-fix.css  # Stacking-context isolation for the header
│   │   ├── image-sections.css  # Hero background + about/experience portrait images
│   │   ├── social-links.css    # Social icon row in the contact section
│   │   ├── content-sections.css # Blog slider, testimonials, FAQ accordion
│   │   ├── carousel-fix.css    # Per-slider column-count overrides
│   │   └── blog.css            # Blog reader — hero, two-column layout, ToC sidebar
│   │
│   └── js/
│       ├── main.js             # Scroll reveal, parallax, terminal, contact form
│       ├── navigation.js       # Mobile menu open/close, header compact state
│       ├── social-links.js     # Injects the social icon row into .contact-details
│       ├── content-sections.js # Injects blog/testimonials/FAQ, runs sliders
│       └── blog.js             # Blog reader — frontmatter, markdown, ToC, progress
│
└── posts/
    ├── index.json              # Post manifest for adjacent-post navigation
    └── *.md                    # Individual posts (YAML frontmatter + Markdown body)
```

---

## Design system

Tokens are defined on `:root` in `main.css`:

```css
--cream:  #f7f1e8   /* page background */
--paper:  #fffdf9   /* card / white-section surface */
--maroon: #762f3c   /* primary accent */
--deep:   #54212c   /* footer / hover darken */
--ink:    #171414   /* body text */
--muted:  #746a67   /* secondary text */
--line:   rgba(23,20,20,.14)
--radius: 1.1rem
```

**Type scale**

- `Playfair Display` — section headings, blockquotes, project titles
- `Manrope` — body copy, navigation, buttons
- `DM Mono` — eyebrows, labels, tags, terminal, code

---

## Sections (index.html)

| # | ID | Background | Notes |
|---|---|---|---|
| — | `#hero` | `--cream` + full-bleed image | Parallax orbs, scroll indicator |
| 01 | `#about` | `--paper` | Metrics strip, portrait image |
| — | `#terminal` | `--ink` | Interactive tab + command shell |
| 02 | `#skills` | `--maroon` | 2×2 capability grid |
| — | `#projects` | `--cream` | Horizontal project rows |
| 03 | `#experience` | `--paper` | Two-column timeline |
| 04 | `#blog` | `--cream` | Auto-scrolling card slider *(injected)* |
| 05 | `#testimonials` | `--paper` | Full-width quote slider *(injected)* |
| 06 | `#faqs` | `--cream` | Accordion *(injected)* |
| — | `#contact` | `--cream` | Split layout, captcha, Web3Forms |

Sections 04–06 are injected at runtime by `content-sections.js` so the HTML stays lean.

---

## Blog reader (blog.html)

Posts live in `/posts/` as Markdown files with a YAML-style frontmatter block:

```markdown
---
title: Post title
date: 2024-06-01
readTime: 5 min
category: Craft
image: https://…
---

Body content here.
```

The reader is reached at `blog.html?post=slug` where `slug` matches the filename without `.md`. `posts/index.json` lists all posts for adjacent-post navigation.

---

## Terminal commands

The in-page terminal (§ Terminal) accepts:

| Command | Output |
|---|---|
| `help` | Command directory |
| `about` | Profile summary |
| `skills` | JSON skills object |
| `projects` | Project list |
| `mql5` | Valkyrie EA status report |
| `contact` | Contact channel note |
| `clear` | Clears the log |

Clicking a tab at the top of the terminal loads the same content without typing.

---

## Contact form

Powered by [Web3Forms](https://web3forms.com). The access key lives in `main.js`. A client-side CAPTCHA (random 4-char alphanumeric) guards against basic bot submissions. On success the form resets and a confirmation message is shown inline.

To swap the recipient, replace the `key` value in `main.js`:

```js
const key = 'your-web3forms-access-key';
```

---

## Local development

No build tooling required.

```bash
# Any static server works — Python example:
python -m http.server 8080

# Or with Node:
npx serve .
```

Then open `http://localhost:8080`.

---

## Customisation

| What | Where |
|---|---|
| Color tokens | `:root` block in `main.css` |
| Typefaces | `<link>` in `<head>` + `tailwind.config` in `index.html` |
| Projects | `.project-list` articles in `index.html` |
| Timeline entries | `.timeline` items in `index.html` |
| Terminal content | `commands` object in `main.js` |
| Social links | `links` array in `social-links.js` |
| Blog posts | Add `.md` files to `/posts/`, register them in `posts/index.json` |
| Hero image | `image-sections.css` — the `::before` pseudo-element on `.hero-section` |

---

## Browser support

Targets modern evergreen browsers. Uses `backdrop-filter`, `CSS Grid`, `IntersectionObserver`, and `scroll-behavior` — all widely supported. No polyfills are included.

---

## License

Personal portfolio — not licensed for redistribution. Contact jason via the site if you want to discuss anything.
