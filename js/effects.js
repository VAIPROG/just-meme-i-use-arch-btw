/* =========================================================
   EFFECTS — matrix rain canvas, CRT/scanlines/matrix toggles
   ========================================================= */

window.Effects = (function () {
  const EFFECT_KEYS = ['scanlines', 'crt', 'matrix'];

  let state = { scanlines: true, crt: true, matrix: false };
  let canvas, ctx, cols, dropY;
  let matrixRAF = null;
  let matrixColor = '#9ece6a';

  const CHARS = 'ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEF';

  function readMatrixColor() {
    matrixColor = getComputedStyle(document.body)
      .getPropertyValue('--accent-green').trim() || '#9ece6a';
  }

  function initCanvas() {
    canvas = document.getElementById('matrix-canvas');
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.floor(canvas.width / 16);
    dropY = Array.from({ length: cols }, () => Math.random() * -(canvas.height / 16));
  }

  function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = matrixColor;
    ctx.font = '14px monospace';

    for (let i = 0; i < cols; i++) {
      const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
      const x = i * 16;
      const y = dropY[i] * 16;
      ctx.fillText(ch, x, y);

      if (y > canvas.height && Math.random() > 0.975) {
        dropY[i] = 0;
      }
      dropY[i] += 0.5;
    }

    matrixRAF = requestAnimationFrame(drawMatrix);
  }

  function startMatrix() {
    if (matrixRAF) return;
    readMatrixColor();
    matrixRAF = requestAnimationFrame(drawMatrix);
  }

  function stopMatrix() {
    if (matrixRAF) {
      cancelAnimationFrame(matrixRAF);
      matrixRAF = null;
    }
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function applyState() {
    EFFECT_KEYS.forEach(key => {
      document.body.dataset[key] = state[key] ? 'on' : 'off';
    });
    updateButtons();
  }

  function saveState() {
    try { localStorage.setItem('arch-effects', JSON.stringify(state)); } catch (_) {}
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem('arch-effects') || 'null');
      if (saved && typeof saved === 'object') {
        EFFECT_KEYS.forEach(k => {
          if (typeof saved[k] === 'boolean') state[k] = saved[k];
        });
      }
    } catch (_) {}
  }

  function updateButtons() {
    EFFECT_KEYS.forEach(key => {
      const btn = document.getElementById('btn-' + key);
      if (btn) btn.classList.toggle('active', state[key]);
    });
  }

  return {
    init() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      loadState();
      initCanvas();
      applyState();
      if (state.matrix) startMatrix();
    },

    toggle(name) {
      if (!EFFECT_KEYS.includes(name)) return;
      state[name] = !state[name];
      document.body.dataset[name] = state[name] ? 'on' : 'off';
      saveState();
      updateButtons();
      if (name === 'matrix') {
        state.matrix ? startMatrix() : stopMatrix();
      }
      return state[name];
    },

    onThemeChange() {
      requestAnimationFrame(readMatrixColor);
    },

    getState() { return { ...state }; }
  };
})();
