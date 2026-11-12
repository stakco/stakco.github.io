/* ══ STAKCO UI POLISH (behaviour) ════════════════════════════
   1. Footer ⓘ: full-screen frosted note on hover intent (rule 18).
   2. Screen-fit groups + ↑/↓ paging on pages with
      <body data-screen-fit> (rules 1, 2, 5).
   ═══════════════════════════════════════════════════════════ */
(function () {
  /* ── 1. Footer ⓘ note ─────────────────────────────────────── */
  function initInfoNotes() {
    const buttons = document.querySelectorAll('.sk-info[data-note]');
    if (!buttons.length) return;

    const glass = document.createElement('div');
    glass.className = 'sk-note-glass';
    glass.setAttribute('role', 'dialog');
    glass.setAttribute('aria-live', 'polite');
    glass.innerHTML = '<div class="sk-note"></div>';
    document.body.appendChild(glass);
    const noteEl = glass.firstChild;

    let floatBtn = null;
    let timer = 0;
    let openFor = null;

    function close() {
      clearTimeout(timer);
      glass.classList.remove('open');
      openFor = null;
      if (floatBtn) { floatBtn.remove(); floatBtn = null; }
    }

    function open(btn) {
      openFor = btn;
      noteEl.innerHTML = btn.dataset.note
        .split('|').map((t) => '<p>' + t.trim() + '</p>').join('');
      // Re-draw the ⓘ above the glass at the same spot, so it stays sharp
      // and leaving it closes the note.
      const r = btn.getBoundingClientRect();
      floatBtn = btn.cloneNode(true);
      floatBtn.classList.add('sk-info-float');
      floatBtn.removeAttribute('data-note');
      Object.assign(floatBtn.style, { left: r.left + 'px', top: r.top + 'px', margin: 0 });
      floatBtn.addEventListener('mouseleave', close);
      floatBtn.addEventListener('click', (e) => { e.stopPropagation(); close(); });
      document.body.appendChild(floatBtn);
      requestAnimationFrame(() => glass.classList.add('open'));
    }

    buttons.forEach((btn) => {
      btn.addEventListener('mouseenter', () => {
        clearTimeout(timer);
        timer = setTimeout(() => open(btn), 400);   // hover intent
      });
      btn.addEventListener('mouseleave', () => clearTimeout(timer));
      btn.addEventListener('click', (e) => {         // touch / keyboard
        e.stopPropagation();
        clearTimeout(timer);
        openFor ? close() : open(btn);
      });
    });
    document.addEventListener('click', () => { if (openFor) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    window.addEventListener('scroll', () => { if (openFor) close(); }, { passive: true });
  }

  /* ── 2. Screen-fit groups + ↑/↓ paging ─────────────────────── */
  function initScreenFit() {
    if (!document.body.hasAttribute('data-screen-fit')) return;
    document.body.classList.add('screen-fit');

    const nav = document.querySelector('.site-nav');
    const groups = [...document.querySelectorAll('.wrap > .section, .sk-footer-group')];
    if (!groups.length) return;

    // The floating bar sits 12px down; content lands just under it.
    const barBottom = () => (nav ? nav.getBoundingClientRect().height + 12 : 0);
    const wide = () => window.innerWidth > 900 && window.innerHeight >= 540;

    function layout() {
      groups.forEach((g) => { g.style.minHeight = ''; g.classList.remove('screen'); });
      if (!wide()) { groups.forEach((g) => g.classList.add('screen')); return; }

      const avail = window.innerHeight - barBottom();
      const heights = groups.map((g) => g.getBoundingClientRect().height);
      const screens = [];
      let cur = null;
      groups.forEach((g, i) => {
        const solo = g.hasAttribute('data-solo') || (cur && cur.solo);
        if (cur && !solo && cur.sum + heights[i] <= avail + 1) {
          cur.items.push(i); cur.sum += heights[i];
        } else {
          cur = { items: [i], sum: heights[i], solo: g.hasAttribute('data-solo') };
          screens.push(cur);
        }
      });
      screens.forEach((sc, n) => {
        // The first screen also holds the space the bar's float gap takes.
        const room = n === 0 ? window.innerHeight - 12 - (nav ? nav.offsetHeight : 0) - 12 : avail;
        // The footer keeps its own height; the content groups share the rest,
        // so the last content sits centred and the footer on the bottom edge.
        const takers = sc.items.filter((i) => !groups[i].classList.contains('sk-footer-group'));
        const extra = Math.max(0, room - sc.sum) / (takers.length || 1);
        sc.items.forEach((i, k) => {
          const grow = takers.includes(i) ? extra : 0;
          groups[i].style.minHeight = heights[i] + grow + 'px';
          if (k === 0) groups[i].classList.add('screen');
        });
      });
    }

    let raf = 0;
    const relayout = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(layout); };
    window.addEventListener('resize', relayout);
    document.fonts && document.fonts.ready.then(relayout);
    window.addEventListener('load', relayout);
    // Late-loading media (videos, the puzzle embed) change heights.
    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(relayout);
      groups.forEach((g) => [...g.children].forEach((c) => ro.observe(c)));
    }
    relayout();

    /* ↑/↓ land each screen just under the app bar. */
    let target = null;
    let clearTarget = 0;
    window.addEventListener('scrollend', () => { target = null; });

    const stops = () => [...document.querySelectorAll('.screen')].map((s) =>
      Math.round(s.getBoundingClientRect().top + window.scrollY - barBottom()));

    function pageBy(dir) {
      const pos = target ?? window.scrollY;
      const step = window.innerHeight - barBottom();
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const s = stops().map((t) => Math.max(0, t));
      let dest;
      if (dir > 0) {
        const next = s.find((t) => t > pos + 4) ?? max;
        dest = Math.min(next, pos + step);
      } else {
        const prev = s.filter((t) => t < pos - 4).pop() ?? 0;
        dest = Math.max(prev, pos - step);
      }
      dest = Math.min(Math.max(dest, 0), max);
      if (dest === Math.round(pos)) return;
      target = dest;
      clearTimeout(clearTarget);
      clearTarget = setTimeout(() => { target = null; }, 900); // no scrollend in older Safari
      window.scrollTo({ top: dest, behavior: 'smooth' });
    }

    const ignore = 'input, textarea, select, [role="radiogroup"], [role="slider"], [contenteditable], stakco-daily-embed';
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const t = e.target instanceof Element ? e.target : null;
      if (t && t.closest(ignore)) return;
      e.preventDefault();
      pageBy(e.key === 'ArrowDown' ? 1 : -1);
    });
  }

  function init() { initInfoNotes(); initScreenFit(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
