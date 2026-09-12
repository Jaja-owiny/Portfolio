/**
 * blog.js — Portfolio blog reader
 *
 * How it works
 * ─────────────
 * 1. URL param  ?post=my-article  → fetches  /posts/my-article.md
 * 2. Parses YAML-style frontmatter from the top of the file.
 * 3. Renders the remaining markdown body with marked.js.
 * 4. Builds a sticky TOC from <h2> headings, wires scroll spy.
 * 5. Generates a reading-progress bar.
 * 6. Optionally shows adjacent posts from posts/index.json.
 *
 * Markdown file format
 * ────────────────────
 * ---
 * title: My Post Title
 * date: 2026-09-12
 * tag: Craft
 * lede: A one-sentence teaser shown on the hero.
 * image: https://...  (or a local path like /posts/images/cover.jpg)
 * ---
 *
 * The heading you want as the first H2 goes in the body below the
 * frontmatter. The drop-cap is applied automatically to the first <p>.
 *
 * Adjacent posts
 * ─────────────
 * Place a file at /posts/index.json with the shape:
 * [
 *   { "slug": "my-article", "title": "My Article", "tag": "Craft" },
 *   ...
 * ]
 * The reader will show the previous and next entries relative to the
 * current post.  If the file is absent the section is silently hidden.
 */

(() => {
  'use strict';

  /* ── Utilities ────────────────────────────────────────────── */

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  function slug(text) {
    return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
  }

  function readTime(text) {
    const words = text.trim().split(/\s+/).length;
    const mins = Math.max(1, Math.round(words / 220));
    return `${mins} min read`;
  }

  function formatDate(str) {
    if (!str) return '';
    try {
      return new Date(str).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric'
      });
    } catch { return str; }
  }

  /* ── Frontmatter parser ──────────────────────────────────── */

  function parseFrontmatter(raw) {
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    if (!match) return { meta: {}, body: raw };

    const meta = {};
    match[1].split('\n').forEach(line => {
      const idx = line.indexOf(':');
      if (idx < 0) return;
      const key = line.slice(0, idx).trim();
      const val = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
      meta[key] = val;
    });

    return { meta, body: match[2] };
  }

  /* ── Reading progress bar ────────────────────────────────── */

  function initProgress() {
    const bar = $('#reading-progress');
    if (!bar) return;

    function update() {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
      bar.style.width = `${Math.min(100, pct)}%`;
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ── TOC + scroll spy ────────────────────────────────────── */

  function buildTOC(headings) {
    const list = $('#toc-list');
    const toc  = $('#blog-toc');
    if (!list || !toc || !headings.length) {
      toc?.classList.add('hidden');
      return;
    }

    list.innerHTML = headings.map(h => `
      <li>
        <a href="#${h.id}">${h.textContent}</a>
      </li>`).join('');

    // Scroll spy
    const links = $$('a', list);
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        links.forEach(a => a.classList.remove('is-active'));
        const active = list.querySelector(`a[href="#${e.target.id}"]`);
        active?.classList.add('is-active');
      });
    }, { rootMargin: '-25% 0px -60% 0px' });

    headings.forEach(h => obs.observe(h));
  }

  /* ── Prose scroll reveals ────────────────────────────────── */

  function animateProse(container) {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { container.classList.add('loaded'); return; }

    const targets = $$('h2, h3, blockquote, pre, img', container);
    targets.forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.06}s`;
    });

    requestAnimationFrame(() => container.classList.add('loaded'));
  }

  /* ── Share buttons ────────────────────────────────────────── */

  function initShare(title) {
    const copyBtn    = $('#share-copy');
    const twitterBtn = $('#share-twitter');
    const url        = window.location.href;

    copyBtn?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(url);
        copyBtn.title = 'Copied!';
        copyBtn.querySelector('svg')?.setAttribute('data-lucide', 'check');
        lucide.createIcons();
        setTimeout(() => {
          copyBtn.title = 'Copy link';
          copyBtn.querySelector('svg')?.setAttribute('data-lucide', 'link');
          lucide.createIcons();
        }, 2000);
      } catch { /* silent */ }
    });

    if (twitterBtn) {
      const tweet = `${title} — ${url}`;
      twitterBtn.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`;
    }
  }

  /* ── Adjacent posts ─────────────────────────────────────── */

  async function loadAdjacent(currentSlug) {
    const wrap = $('#adjacent-posts');
    if (!wrap) return;

    try {
      const res = await fetch(new URL('posts/index.json', document.baseURI));
      if (!res.ok) throw new Error();
      const posts = await res.json();

      const idx  = posts.findIndex(p => p.slug === currentSlug);
      if (idx < 0) return;

      const prev = posts[idx - 1];
      const next = posts[idx + 1];

      wrap.innerHTML = [
        prev ? `<a href="blog.html?post=${encodeURIComponent(prev.slug)}"><i data-lucide="arrow-left"></i>${prev.title}</a>` : '',
        next ? `<a href="blog.html?post=${encodeURIComponent(next.slug)}">${next.title}<i data-lucide="arrow-right"></i></a>` : ''
      ].join('');

      lucide.createIcons();
    } catch { /* index.json absent — silently hide */ }
  }

  /* ── Sticky sidebar header for mobile ───────────────────── */

  function initHeader() {
    const header = $('#site-header');
    if (!header) return;
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 80);
    }, { passive: true });
  }

  /* ── Main renderer ────────────────────────────────────────── */

  async function render() {
    const params   = new URLSearchParams(window.location.search);
    const postSlug = params.get('post');

    if (!postSlug) {
      showError();
      return;
    }

    let raw;
    try {
      const res = await fetch(
        new URL(`posts/${encodeURIComponent(postSlug)}.md`, document.baseURI),
      );
      if (!res.ok) throw new Error(`${res.status}`);
      raw = await res.text();
    } catch {
      showError();
      return;
    }

    const { meta, body } = parseFrontmatter(raw);
    const rt             = readTime(body);
    const formattedDate  = formatDate(meta.date);

    /* ── Page meta ── */
    document.title = meta.title ? `${meta.title} — Jason Ocholla` : 'Reading — Jason Ocholla';
    $('#page-title').textContent = document.title;

    /* ── Hero ── */
    const heroImg = $('#hero-image');
    if (meta.image && heroImg) {
      heroImg.src = meta.image;
      heroImg.alt = meta.title || '';
    } else {
      heroImg?.parentElement?.remove();
      $('#blog-hero').style.minHeight = '40vh';
    }

    $('#hero-tag').textContent       = meta.tag   || 'Notes';
    $('#hero-date').textContent      = formattedDate;
    $('#hero-read-time').textContent = rt;
    $('#hero-title').textContent     = meta.title || 'Untitled';
    $('#hero-lede').textContent      = meta.lede  || '';

    /* ── Sidebar ── */
    $('#sidebar-tag').textContent  = meta.tag   || 'Notes';
    $('#sidebar-date').textContent = formattedDate;
    $('#sidebar-rt').textContent   = rt;

    /* ── Markdown → HTML ── */
    marked.setOptions({ breaks: false });
    const html = marked.parse(body);

    const articleBody = $('#article-body');
    if (!articleBody) throw new Error('Article body container is missing.');
    articleBody.innerHTML = html;
    articleBody.classList.add('prose');

    // Add stable IDs after parsing so this works with current marked versions.
    $$('h2, h3, h4', articleBody).forEach((heading) => {
      heading.id = slug(heading.textContent || 'section');
    });

    /* ── TOC (h2 headings only) ── */
    const headings = $$('h2', articleBody);
    buildTOC(headings);

    /* ── Animate prose ── */
    animateProse(articleBody);

    /* ── Lucide icons (re-run after DOM mutation) ── */
    if (window.lucide) lucide.createIcons();

    /* ── Share ── */
    initShare(meta.title || document.title);

    /* ── Adjacent posts ── */
    loadAdjacent(postSlug);
  }

  function showError() {
    const hero  = $('#blog-hero');
    const body  = $('.blog-body');
    const err   = $('#blog-error');
    hero?.classList.add('hidden');
    body?.classList.add('hidden');
    err?.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  }

  /* ── Bootstrap ───────────────────────────────────────────── */

  document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) lucide.createIcons();
    initProgress();
    initHeader();
    render();
  });

})();