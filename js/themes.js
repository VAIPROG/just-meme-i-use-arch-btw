/* =========================================================
   THEMES — cycle through 5 terminal colour schemes
   ========================================================= */

window.Themes = (function () {
  const THEMES = ['tokyo-night', 'gruvbox', 'nord', 'dracula', 'solarized'];
  let current = 0;

  function apply(theme) {
    document.body.setAttribute('data-theme', theme);
    const btn = document.getElementById('btn-theme');
    if (btn) btn.textContent = theme;
    try { localStorage.setItem('arch-theme', theme); } catch (_) {}
    if (window.Effects) window.Effects.onThemeChange();
  }

  function load() {
    try {
      const saved = localStorage.getItem('arch-theme');
      const idx = THEMES.indexOf(saved);
      if (idx !== -1) current = idx;
    } catch (_) {}
  }

  return {
    init() {
      load();
      apply(THEMES[current]);
    },

    cycle() {
      current = (current + 1) % THEMES.length;
      apply(THEMES[current]);
      if (window.Terminal) {
        window.Terminal.printLine(
          `theme switched to <span style="color:var(--accent-cyan)">${THEMES[current]}</span>`,
          't-line--dim'
        );
      }
    },

    current() { return THEMES[current]; }
  };
})();
