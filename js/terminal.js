/* =========================================================
   TERMINAL ENGINE — input, history, typing, output
   ========================================================= */

window.Terminal = (function () {
  let outputEl, bodyEl, inputEl, promptDisplayEl, cursorEl, vimIndicatorEl;
  let history = [];
  let historyIndex = -1;
  let busy = false;
  let vimMode = false;
  let vimBuffer = '';

  function scrollToBottom() {
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function printLine(html, cssClass) {
    const div = document.createElement('div');
    div.className = 't-line ' + (cssClass || 't-line--output');
    div.innerHTML = html;
    outputEl.appendChild(div);
    scrollToBottom();
    return div;
  }

  function printHTML(html) {
    const div = document.createElement('div');
    div.className = 't-line t-line--block';
    div.innerHTML = html;
    outputEl.appendChild(div);
    scrollToBottom();
    return div;
  }

  function printBlank() {
    printLine('', 't-line--blank');
  }

  function printPromptEcho(cmd) {
    const promptHtml =
      `<span class="prompt-bracket">[</span>` +
      `<span class="prompt-user">user</span>` +
      `<span class="prompt-at">@</span>` +
      `<span class="prompt-host">archlinux</span>` +
      `<span class="prompt-space"> </span>` +
      `<span class="prompt-path">~</span>` +
      `<span class="prompt-bracket">]</span>` +
      `<span class="prompt-sym">$</span> ` +
      `<span>${escapeHtml(cmd)}</span>`;
    printLine(promptHtml, 't-line--cmd');
  }

  function clearOutput() {
    outputEl.innerHTML = '';
  }

  function syncDisplay() {
    if (promptDisplayEl) promptDisplayEl.textContent = inputEl.value;
  }

  function historyUp() {
    if (!history.length) return;
    historyIndex = Math.min(historyIndex + 1, history.length - 1);
    inputEl.value = history[history.length - 1 - historyIndex];
    syncDisplay();
    setTimeout(() => {
      inputEl.selectionStart = inputEl.selectionEnd = inputEl.value.length;
    }, 0);
  }

  function historyDown() {
    if (historyIndex <= 0) {
      historyIndex = -1;
      inputEl.value = '';
      syncDisplay();
      return;
    }
    historyIndex--;
    inputEl.value = history[history.length - 1 - historyIndex];
    syncDisplay();
  }

  function autocomplete() {
    const partial = inputEl.value;
    if (!partial) return;
    const names = window.Commands ? window.Commands.getNames() : [];
    const matches = names.filter(n => n.startsWith(partial));
    if (matches.length === 1) {
      inputEl.value = matches[0] + ' ';
      syncDisplay();
    } else if (matches.length > 1) {
      printLine(matches.join('  '), 't-line--dim');
    }
  }

  async function executeInput(raw) {
    if (busy) return;
    const cmd = raw.trim();
    inputEl.value = '';
    syncDisplay();
    historyIndex = -1;

    if (!cmd) {
      printPromptEcho('');
      return;
    }

    if (history[history.length - 1] !== cmd) {
      history.push(cmd);
      if (history.length > 200) history.shift();
    }

    printPromptEcho(cmd);
    await window.Commands.run(cmd);
  }

  /* Vim mode input handler */
  function handleVimInput(key, value) {
    vimBuffer = value;
    if (key === 'Enter') {
      const trimmed = vimBuffer.trim();
      if (trimmed === ':q' || trimmed === ':q!' || trimmed === ':wq' || trimmed === ':x') {
        setVimMode(false);
        inputEl.value = '';
        syncDisplay();
        printLine('[No write since last change (add ! to override)]', 't-line--dim');
        printBlank();
      } else if (trimmed.startsWith(':')) {
        printLine(`E492: Not an editor command: ${escapeHtml(trimmed)}`, 't-line--error');
        inputEl.value = '';
        syncDisplay();
      } else {
        inputEl.value = '';
        syncDisplay();
      }
    }
  }

  function onKeydown(e) {
    if (vimMode) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleVimInput('Enter', inputEl.value);
      }
      return;
    }

    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        executeInput(inputEl.value);
        break;
      case 'ArrowUp':
        e.preventDefault();
        historyUp();
        break;
      case 'ArrowDown':
        e.preventDefault();
        historyDown();
        break;
      case 'Tab':
        e.preventDefault();
        autocomplete();
        break;
      case 'Escape':
        inputEl.value = '';
        syncDisplay();
        historyIndex = -1;
        break;
      case 'l':
        if (e.ctrlKey) {
          e.preventDefault();
          clearOutput();
        }
        break;
      case 'c':
        if (e.ctrlKey) {
          e.preventDefault();
          printPromptEcho(inputEl.value + '^C');
          inputEl.value = '';
          syncDisplay();
          historyIndex = -1;
        }
        break;
    }
  }

  function setVimMode(active) {
    vimMode = active;
    vimBuffer = '';
    if (vimIndicatorEl) vimIndicatorEl.classList.toggle('visible', active);
    if (active) {
      printLine('-- INSERT --  (hint: :q to quit)', 't-line--dim');
    }
  }

  function setBusy(isBusy) {
    busy = isBusy;
    inputEl.disabled = isBusy;
    if (cursorEl) cursorEl.classList.toggle('typing', isBusy);
  }

  async function typeCommand(cmd) {
    setBusy(true);
    promptDisplayEl.textContent = '';
    cursorEl.classList.add('typing');

    const jitter = () => Math.random() * 30 - 15;
    for (const ch of cmd) {
      promptDisplayEl.textContent += ch;
      await new Promise(r => setTimeout(r, 55 + jitter()));
    }
    await new Promise(r => setTimeout(r, 280));
    setBusy(false);
    cursorEl.classList.remove('typing');
  }

  return {
    init() {
      outputEl       = document.getElementById('terminal-output');
      bodyEl         = document.getElementById('terminal-body');
      inputEl        = document.getElementById('terminal-input');
      promptDisplayEl= document.getElementById('prompt-display');
      cursorEl       = document.getElementById('cursor');
      vimIndicatorEl = document.getElementById('vim-indicator');

      inputEl.addEventListener('keydown', onKeydown);
      inputEl.addEventListener('input', syncDisplay);

      bodyEl.addEventListener('click', () => inputEl.focus());
      bodyEl.addEventListener('touchend', e => {
        if (e.target === bodyEl || e.target === outputEl) {
          e.preventDefault();
          inputEl.focus();
        }
      }, { passive: false });

      const mobileUp   = document.getElementById('mobile-up');
      const mobileDown = document.getElementById('mobile-down');
      if (mobileUp)   mobileUp.addEventListener('click',   historyUp);
      if (mobileDown) mobileDown.addEventListener('click', historyDown);
    },

    printLine,
    printHTML,
    printBlank,
    clear: clearOutput,
    escapeHtml,
    typeCommand,
    setBusy,
    setVimMode,

    async execute(cmd) {
      await executeInput(cmd);
    },
  };
})();
