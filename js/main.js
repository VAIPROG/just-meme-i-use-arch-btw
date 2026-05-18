/* =========================================================
   MAIN — init, startup sequence, event wiring, easter eggs
   ========================================================= */

(async function () {
  /* ── Init modules ────────────────────────────────────── */
  Effects.init();
  Themes.init();
  Terminal.init();

  /* ── Titlebar control wiring ─────────────────────────── */
  document.getElementById('btn-theme')
    .addEventListener('click', () => Themes.cycle());

  ['scanlines', 'crt', 'matrix'].forEach(name => {
    const btn = document.getElementById('btn-' + name);
    if (btn) btn.addEventListener('click', () => {
      const on = Effects.toggle(name);
      Terminal.printLine(
        `[fx] ${name}: <span style="color:var(--${on ? 'accent-green' : 'fg-dim'})">${on ? 'on' : 'off'}</span>`,
        't-line--dim'
      );
    });
  });

  /* ── Share button ────────────────────────────────────── */
  document.getElementById('btn-share').addEventListener('click', shareNeofetch);

  function shareNeofetch() {
    const s = window.SessionData;
    const text = [
      `user@archlinux`,
      `─────────────────────`,
      `OS:         Arch Linux x86_64`,
      `Kernel:     ${s.kernel}`,
      `Uptime:     ${s.uptime}`,
      `Packages:   ${s.pacmanPkgs} (pacman), ${s.aurPkgs} (${s.aurHelper})`,
      `Shell:      ${s.shell}`,
      `WM:         ${s.wm}`,
      `Terminal:   ${s.terminal}`,
      `CPU:        ${s.cpu}`,
      `GPU:        ${s.gpu}`,
      `Memory:     ${(s.memUsed / 1024).toFixed(1)}GiB / ${s.memTotal / 1024}GiB`,
      ``,
      `I USE ARCH BTW`,
    ].join('\n');

    const toast = document.getElementById('share-toast');

    const show = () => {
      toast.classList.add('visible');
      setTimeout(() => toast.classList.remove('visible'), 2500);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(show).catch(fallback);
    } else {
      fallback();
    }

    function fallback() {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        show();
      } catch (_) {
        toast.textContent = 'copy failed (no clipboard access)';
        toast.style.borderColor = 'var(--accent-red)';
        toast.style.color = 'var(--accent-red)';
        toast.classList.add('visible');
        setTimeout(() => {
          toast.classList.remove('visible');
          toast.textContent = 'neofetch copied!';
          toast.style.borderColor = '';
          toast.style.color = '';
        }, 2500);
      }
    }
  }

  /* ── Konami code ─────────────────────────────────────── */
  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown',
                  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
                  'KeyB','KeyA'];
  let konamiBuffer = [];

  document.addEventListener('keydown', e => {
    konamiBuffer.push(e.code);
    if (konamiBuffer.length > KONAMI.length) konamiBuffer.shift();
    if (KONAMI.every((k, i) => k === konamiBuffer[i])) {
      konamiBuffer = [];
      triggerKonami();
    }
  });

  function triggerKonami() {
    Terminal.printLine('');
    Terminal.printHTML(`
      <div style="color:var(--accent-yellow);font-weight:700" class="neon">
        ↑ ↑ ↓ ↓ ← → ← → B A — CHEAT CODE ACTIVATED
      </div>
    `);
    Terminal.printLine('You have unlocked: the knowledge that you know the Konami code.', 't-line--success');
    Terminal.printLine('True Arch users don\'t need cheat codes. But respect.', 't-line--dim');
    Terminal.printLine('');
  }

  /* ── Startup sequence ────────────────────────────────── */
  await new Promise(r => setTimeout(r, 600));

  await Terminal.typeCommand('neofetch');
  await Commands.run('neofetch');

  Terminal.printLine('');

  await new Promise(r => setTimeout(r, 200));
  await Terminal.typeCommand('echo $STATUS');
  await Commands.run('echo $STATUS');

  Terminal.printLine('');
  Terminal.printLine(
    '<span style="color:var(--fg-dim);font-size:0.8em">type <span style="color:var(--accent-cyan)">help</span> for available commands · click anywhere to type</span>',
    't-line--dim'
  );
  Terminal.printLine('');

  document.getElementById('terminal-input').focus();
})();
