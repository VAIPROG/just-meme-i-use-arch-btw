/* =========================================================
   COMMANDS — session data + full command registry
   ========================================================= */

;(function () {
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = arr => arr[rand(0, arr.length - 1)];
  const delay = ms => new Promise(r => setTimeout(r, ms));

  /* ── Session data ──────────────────────────────────── */
  const cpuPool = [
    'AMD Ryzen 9 7950X (32) @ 5.700GHz',
    'AMD Ryzen 7 5800X (16) @ 4.700GHz',
    'AMD Ryzen 5 7600X (12) @ 5.300GHz',
    'Intel Core i9-13900K (32) @ 5.800GHz',
    'Intel Core i7-12700K (20) @ 5.000GHz',
    'AMD Ryzen 9 5900X (24) @ 4.950GHz',
  ];
  const gpuPool = [
    'AMD Radeon RX 7900 XTX',
    'AMD Radeon RX 6800 XT',
    'NVIDIA GeForce RTX 4080',
    'NVIDIA GeForce RTX 3080 Ti',
    'AMD Radeon RX 7600',
    'Intel Arc A770',
  ];
  const wmPool   = ['Hyprland', 'i3-gaps', 'Sway', 'dwm', 'bspwm'];
  const aurHelpers = ['yay', 'paru'];

  function randomUptime() {
    const type = rand(0, 2);
    if (type === 0) return `${rand(3, 59)} mins`;
    if (type === 1) return `${rand(1, 23)} hours, ${rand(1, 59)} mins`;
    return `${rand(1, 30)} days, ${rand(0, 23)} hours`;
  }

  window.SessionData = {
    kernel:     `6.18.${rand(1, 9)}.arch1-1`,
    pacmanPkgs: rand(1200, 1600),
    aurPkgs:    rand(47, 230),
    uptime:     randomUptime(),
    memUsed:    rand(3200, 7800),
    memTotal:   16384,
    cpu:        pick(cpuPool),
    gpu:        pick(gpuPool),
    wm:         pick(wmPool),
    aurHelper:  pick(aurHelpers),
    shell:      'zsh 5.9',
    de:         'none',
    terminal:   'Alacritty',
    theme:      'Nordic [GTK2/3]',
    resolution: `${pick(['1920x1080', '2560x1440', '3840x2160', '2560x1600'])} @ ${pick(['60', '144', '165', '240'])}Hz`,
  };

  /* ── ASCII art variants ────────────────────────────── */
  const ASCII = {
    arch: `                   -\`
                  .o+\`
                 \`ooo/
                \`+oooo:
               \`+oooooo:
               -+oooooo+:
             \`/:-:++oooo+:
            \`/++++/+++++++:
           \`/++++++++++++++:
          \`/+++ooooooooooooo/\`
         ./ooosssso++osssssso+\`
        .oossssso-\`\`\`\`/ossssss+\`
       -osssssso.      :ssssssso.
      :osssssss/        osssso+++.
     /ossssssss/        +ssssooo/-
   \`/ossssso+/:-        -:/+osssso+-
  \`+sso+:-\`                 \`.-/+oso:
 \`++:.                           \`-/+/
 .\`                                 \`/`,

    gentoo: `         -/oyddmdhs+:
      -smMMMMMMMMMMMMy+-
    omMMMMMMMMMMMMMMMMMNy:
  \`hMMMMMMMMmmddmMMMMMMMMMy
 \`dMMMMMMmo.      -smMMMMMN
 hMMMMMMy.    +hh+   sMMMMM+
.NMMMMMy    :MMMMMd   mMMMMM/
 dMMMMMs    .yMMMMm   dMMMMM+
 +MMMMM+      :++-   sMMMMMs
  sMMMMNs-         -yMMMMMd
   yMMMMMMMdyssssymMMMMMMy.
    /hMMMMMMMMMMMMMMMMMMd:
      .odmMMMMMMMMMMMmh/.
           .:////::.`,

    minimal: '',

    btw: `██████╗ ████████╗██╗    ██╗
██╔══██╗╚══██╔══╝██║    ██║
██████╔╝   ██║   ██║ █╗ ██║
██╔══██╗   ██║   ██║███╗██║
██████╔╝   ██║   ╚███╔███╔╝
╚═════╝    ╚═╝    ╚══╝╚══╝ `,
  };

  /* ── Neofetch builder ──────────────────────────────── */
  function buildSwatches() {
    let html = '<div class="color-swatches">';
    for (let i = 1; i <= 7; i++) {
      html += `<div class="swatch" style="background:var(--color-swatch-${i})"></div>`;
    }
    html += '</div>';
    return html;
  }

  function buildInfoBlock(titleSuffix) {
    const s = window.SessionData;
    const total = s.pacmanPkgs + s.aurPkgs;
    const title = `<div class="nf-title"><span class="nf-user">user</span><span class="nf-sep">@</span><span class="nf-host">archlinux</span>${titleSuffix || ''}</div>`;
    const sep   = `<div class="nf-sep-line">${'─'.repeat(20)}</div>`;
    const rows = [
      ['OS',         'Arch Linux x86_64'],
      ['Kernel',     s.kernel],
      ['Uptime',     s.uptime],
      ['Packages',   `${s.pacmanPkgs} (pacman), ${s.aurPkgs} (${s.aurHelper})`],
      ['Shell',      `${s.shell} <span style="color:var(--fg-dim)">(Powerlevel10k)</span>`],
      ['Resolution', s.resolution],
      ['WM',         s.wm],
      ['Theme',      s.theme],
      ['Terminal',   s.terminal],
      ['CPU',        s.cpu],
      ['GPU',        s.gpu],
      ['Memory',     `${Math.round(s.memUsed / 1024 * 10) / 10}GiB / ${s.memTotal / 1024}GiB`],
    ].map(([k, v]) =>
      `<div><span class="nf-key">${k}</span>: <span class="nf-value">${v}</span></div>`
    ).join('');
    return title + sep + rows + buildSwatches();
  }

  function buildNeofetch(variant) {
    const art = ASCII[variant] || ASCII.arch;
    if (variant === 'minimal') {
      return `<div class="neofetch-block"><div class="neofetch-info">${buildInfoBlock()}</div></div>`;
    }
    if (variant === 'btw') {
      return `<div class="neofetch-block">
        <div class="neofetch-ascii neon" style="color:var(--accent-cyan)">${art}</div>
        <div class="neofetch-info">${buildInfoBlock(' <span style="color:var(--accent-cyan);font-size:0.75em"> — btw</span>')}</div>
      </div>`;
    }
    const color = variant === 'gentoo' ? 'var(--accent-purple)' : 'var(--accent-blue)';
    return `<div class="neofetch-block">
      <div class="neofetch-ascii neon" style="color:${color}">${art}</div>
      <div class="neofetch-info">${buildInfoBlock()}</div>
    </div>`;
  }

  /* ── Fake pacman progress bar ──────────────────────── */
  function progressBar(pct) {
    const filled = Math.round(pct / 5);
    return '[' + '#'.repeat(filled) + '-'.repeat(20 - filled) + ']';
  }

  /* ── Command handlers ──────────────────────────────── */
  async function cmdHelp() {
    const cmds = [
      ['neofetch',       'show system info (try --ascii=arch|gentoo|minimal|btw)'],
      ['neofetch --btw', 'you know what this does'],
      ['uname -a',       'kernel information'],
      ['uptime',         'how long since last reboot (probably too long)'],
      ['whoami',         'who are you, really'],
      ['ls -la',         'list home directory'],
      ['cat <file>',     'read a file (try /etc/os-release or .zshrc)'],
      ['pacman -Q',      'list installed packages'],
      ['pacman -Syu',    'full system upgrade (takes 0.003 seconds on Arch)'],
      ['pacman -S <pkg>','install a package'],
      ['yay / paru',     'AUR helper: check for updates + drama'],
      ['df -h',          'disk usage'],
      ['free -h',        'memory usage'],
      ['echo <text>',    'echo text (try echo $STATUS)'],
      ['pwd',            'print working directory'],
      ['date',           'current date/time'],
      ['fortune',        'random Arch wisdom'],
      ['arch-wiki',      'the answer to everything'],
      ['vim / nvim',     'the one true editor'],
      ['nano',           'do not'],
      ['hack',           'look busy'],
      ['fx <effect>',    'toggle effect: scanlines, crt, matrix'],
      ['--btw',          'secret'],
      ['clear',          'clear the terminal'],
    ];

    let table = '<table class="help-table">';
    cmds.forEach(([cmd, desc]) => {
      table += `<tr><td>${cmd}</td><td>${desc}</td></tr>`;
    });
    table += '</table>';

    window.Terminal.printHTML(table);
    window.Terminal.printLine('');
    window.Terminal.printLine(
      '<span style="color:var(--fg-dim)">tip: you\'re running Arch. You don\'t need help. Just read the wiki.</span>',
      't-line--dim'
    );
  }

  async function cmdNeofetch(argv) {
    const flagArg = argv.find(a => a.startsWith('--ascii='));
    const btw = argv.includes('--btw');
    let variant = 'arch';
    if (flagArg) variant = flagArg.replace('--ascii=', '');
    if (btw) return cmdBtw();

    window.Terminal.printHTML(buildNeofetch(variant));
    window.Terminal.printLine('');
  }

  async function cmdUname(argv) {
    const s = window.SessionData;
    const r = argv.includes('-r');
    const a = argv.includes('-a') || !r;
    if (r) {
      window.Terminal.printLine(s.kernel);
    } else {
      window.Terminal.printLine(
        `Linux archlinux ${s.kernel} #1 SMP PREEMPT_DYNAMIC Sat May 17 18:42:00 UTC 2025 x86_64 GNU/Linux`
      );
    }
  }

  async function cmdUptime() {
    const s = window.SessionData;
    const r1 = (rand(0,9)) + '.' + (rand(10,99));
    const r2 = (rand(0,9)) + '.' + (rand(10,99));
    const r3 = (rand(0,9)) + '.' + (rand(10,99));
    window.Terminal.printLine(
      ` ${new Date().toLocaleTimeString()} up ${s.uptime},  1 user,  load average: ${r1}, ${r2}, ${r3}`
    );
  }

  async function cmdWhoami() {
    window.Terminal.printLine('user');
    window.Terminal.printLine('(btw, you use arch)', 't-line--dim');
  }

  async function cmdId() {
    window.Terminal.printLine(
      'uid=1000(user) gid=1000(user) groups=1000(user),998(wheel),996(audio),987(storage),985(video)'
    );
  }

  async function cmdLs(argv) {
    const long = argv.includes('-la') || argv.includes('-l') || argv.includes('-a');
    if (long) {
      window.Terminal.printLine('total 48');
      const entries = [
        'drwxr-xr-x  3 user user  4096 May 18 09:14 <span style="color:var(--accent-blue)">.</span>',
        'drwxr-xr-x 18 user user  4096 May 18 09:10 <span style="color:var(--accent-blue)">..</span>',
        '-rw-------  1 user user  2847 May 18 09:10 .bash_history',
        '-rw-r--r--  1 user user   220 May 18 09:10 .bash_logout',
        'drwxr-xr-x  3 user user  4096 May 18 09:14 <span style="color:var(--accent-blue)">.config</span>',
        '-rw-r--r--  1 user user   807 May 18 09:10 .profile',
        '-rw-r--r--  1 user user  1337 May 18 09:10 .xinitrc',
        '-rw-r--r--  1 user user   666 May 18 09:10 .zshrc',
        '-rwxr-xr-x  1 user user  1337 May 18 09:10 <span style="color:var(--accent-green)">btw.sh</span>',
        '-rw-r--r--  1 user user  4096 May 17 23:00 dotfiles.tar.gz',
      ];
      entries.forEach(e => window.Terminal.printLine(e));
    } else {
      window.Terminal.printLine(
        '<span style="color:var(--accent-blue)">.config</span>  .zshrc  .profile  <span style="color:var(--accent-green)">btw.sh</span>  dotfiles.tar.gz'
      );
    }
  }

  async function cmdCat(argv) {
    const path = argv[1] || '';
    if (path === '/etc/os-release') {
      const lines = [
        'NAME="Arch Linux"',
        'PRETTY_NAME="Arch Linux"',
        'ID=arch',
        'BUILD_ID=rolling',
        'ANSI_COLOR="38;2;23;147;209"',
        'HOME_URL="https://archlinux.org/"',
        'DOCUMENTATION_URL="https://wiki.archlinux.org/"',
        'SUPPORT_URL="https://bbs.archlinux.org/"',
        'BUG_REPORT_URL="https://gitlab.archlinux.org/groups/archlinux/-/issues"',
        'LOGO=archlinux-logo',
      ];
      lines.forEach(l => window.Terminal.printLine(l));
    } else if (path === '.zshrc' || path === '~/.zshrc') {
      const lines = [
        '# Generated by p10k. Run `p10k configure` if you feel brave.',
        'export ZSH="$HOME/.oh-my-zsh"',
        'ZSH_THEME="powerlevel10k/powerlevel10k"',
        'plugins=(git zsh-autosuggestions zsh-syntax-highlighting)',
        '',
        '# Only Arch users have this alias. It is sacred.',
        'alias please="sudo"',
        'alias btw="echo I use Arch"',
        'alias update="sudo pacman -Syu && ' + window.SessionData.aurHelper + '"',
        '',
        '# Path to the promised land',
        'export PATH="$HOME/.local/bin:$PATH"',
        '',
        'source $ZSH/oh-my-zsh.sh',
        '# [Powerlevel10k config: 847 lines omitted for your sanity]',
      ];
      lines.forEach(l => window.Terminal.printLine(l));
    } else if (path === 'btw.sh') {
      window.Terminal.printLine('#!/bin/bash');
      window.Terminal.printLine('echo "I use Arch btw"');
      window.Terminal.printLine('# TODO: add more btw');
    } else if (!path) {
      window.Terminal.printLine('cat: missing file operand', 't-line--error');
    } else {
      window.Terminal.printLine(`cat: ${path}: No such file or directory`, 't-line--error');
      window.Terminal.printLine(
        '<span style="color:var(--fg-dim)">hint: have you tried the wiki? https://wiki.archlinux.org</span>',
        't-line--dim'
      );
    }
  }

  async function cmdPacman(argv) {
    const sub = argv[1] || '';

    if (sub === '-Q' || sub === '-Ql') {
      const s = window.SessionData;
      const packages = [
        ['base',             '3-2'],
        ['base-devel',       '1-1'],
        ['linux',            s.kernel],
        ['linux-firmware',   '20250512-1'],
        ['mesa',             '25.3.1-1'],
        ['wayland',          '1.23.0-1'],
        ['xorg-server',      '21.1.16-1'],
        [s.wm.toLowerCase(), '0.42.0-1'],
        ['zsh',              '5.9-4'],
        ['neovim',           '0.10.4-1'],
        ['fira-code-fonts',  '6.2-2'],
        ['alacritty',        '0.14.0-1'],
        [s.aurHelper,        '12.3.5-1'],
        ['yay',              s.aurHelper === 'yay' ? '12.3.5-1' : null],
        ['paru',             s.aurHelper === 'paru' ? '2.0.3-1' : null],
        ['firefox',          '127.0.2-1'],
      ].filter(([,v]) => v !== null);

      packages.forEach(([name, ver]) => {
        window.Terminal.printLine(`${name.padEnd(28)} ${ver}`);
      });
      window.Terminal.printLine('');
      window.Terminal.printLine(
        `(showing ${packages.length} of ${s.pacmanPkgs + s.aurPkgs} installed packages)`,
        't-line--dim'
      );
      return;
    }

    if (sub === '-Syu' || sub === '-Syyu') {
      await cmdPacmanUpdate();
      return;
    }

    if (sub === '-S') {
      const pkg = argv[2] || '';
      await cmdPacmanInstall(pkg);
      return;
    }

    if (sub === '-Ss') {
      const q = argv[2] || '';
      window.Terminal.printLine(`extra/${q || 'linux'} 6.18.5-1 [installed]`);
      window.Terminal.printLine(`    The Linux kernel and modules (Arch Linux)`);
      return;
    }

    window.Terminal.printLine('error: no operation specified (use -h for help)', 't-line--error');
  }

  async function cmdPacmanUpdate() {
    const T = window.Terminal;
    T.setBusy(true);

    const lines = [
      [':: Synchronizing package databases...', 80],
      [' core               downloading...', 120],
      [' core is up to date', 60],
      [' extra              8.2 MiB  3.41 MiB/s 00:02 [####################] 100%', 180],
      [' multilib is up to date', 60],
      [':: Starting full system upgrade...', 100],
      ['resolving dependencies...', 150],
      ['looking for conflicting packages...', 120],
    ];

    for (const [line, ms] of lines) {
      await delay(ms + rand(0, 50));
      T.printLine(line);
    }

    const pkgCount = rand(0, 3);
    if (pkgCount === 0) {
      await delay(200);
      T.printLine('');
      T.printLine(' there is nothing to do', 't-line--dim');
      await delay(100);
      T.printLine('');
      T.printLine(':: System is up to date. Congratulations, btw.', 't-line--success');
    } else {
      const fakePkgs = [
        ['linux',    `6.18.${rand(1,9)}.arch1-1`, rand(80,120)],
        ['mesa',     `25.${rand(0,5)}.${rand(0,5)}-1`, rand(30,60)],
        ['firefox',  `${rand(125,130)}.0.${rand(0,9)}-1`, rand(60,90)],
        ['neovim',   `0.10.${rand(1,9)}-1`, rand(15,30)],
        ['hyprland', `0.${rand(40,50)}.0-1`, rand(10,25)],
      ].slice(0, pkgCount);

      const totalSize = fakePkgs.reduce((a, [,,s]) => a + s, 0);
      T.printLine('');
      T.printLine(`Packages (${pkgCount}) ` + fakePkgs.map(([n]) => n).join('  '));
      T.printLine('');
      T.printLine(`Total Download Size:   ${totalSize}.00 MiB`);
      T.printLine(`Total Installed Size:  ${Math.round(totalSize * 2.4)}.00 MiB`);
      T.printLine('');
      await delay(300);
      T.printLine(':: Proceed with installation? [Y/n] Y');
      await delay(200);
      T.printLine(':: Retrieving packages...');

      for (const [name, , size] of fakePkgs) {
        for (let p = 0; p <= 100; p += rand(20, 40)) {
          await delay(rand(60, 140));
          // just show final state
        }
        T.printLine(` ${name.padEnd(28)} ${size}.0 MiB  ${rand(2,8)}.${rand(1,9)} MiB/s 00:0${rand(1,9)} ${progressBar(100)} 100%`);
      }

      await delay(200);
      T.printLine(`(${pkgCount}/${pkgCount}) checking keys in keyring          [####################] 100%`);
      T.printLine(`(${pkgCount}/${pkgCount}) checking package integrity        [####################] 100%`);
      T.printLine(`(${pkgCount}/${pkgCount}) loading package files             [####################] 100%`);

      for (let i = 0; i < pkgCount; i++) {
        await delay(rand(80, 160));
        T.printLine(`(${i+1}/${pkgCount}) upgrading ${fakePkgs[i][0].padEnd(22)} [####################] 100%`);
      }

      await delay(150);
      T.printLine(':: Running post-transaction hooks...');
      T.printLine('(1/3) Arming ConditionNeedsUpdate...');
      await delay(200);
      T.printLine('(2/3) Updating module dependencies...');
      await delay(300);
      T.printLine('(3/3) Updating initramfs...');
      await delay(400);
      T.printLine('');
      T.printLine(':: Upgrade complete. Don\'t forget to reboot. (you won\'t)', 't-line--success');
      T.printLine('   Works on my machine. — Arch Linux, probably', 't-line--dim');
    }

    T.setBusy(false);
  }

  async function cmdPacmanInstall(pkg) {
    const T = window.Terminal;
    if (!pkg) {
      T.printLine('error: no targets specified (use -h for help)', 't-line--error');
      return;
    }
    if (pkg === 'vim') {
      T.printLine('resolving dependencies...', 't-line--dim');
      await delay(400);
      T.printLine('error: failed to prepare transaction (conflicting dependencies)', 't-line--error');
      T.printLine(':: vim and neovim are in conflict', 't-line--error');
      T.printLine('   you already have the superior editor. let it go.', 't-line--dim');
      return;
    }
    if (pkg === 'emacs') {
      T.printLine('resolving dependencies...', 't-line--dim');
      await delay(600);
      T.printLine('error: installing emacs would compromise your dignity', 't-line--error');
      T.printLine('   use neovim. this is Arch.', 't-line--dim');
      return;
    }
    if (pkg === 'windows') {
      T.printLine('error: target not found: windows', 't-line--error');
      T.printLine('   and thank god for that.', 't-line--dim');
      return;
    }

    T.setBusy(true);
    const size = rand(1, 80);
    T.printLine(`resolving dependencies...`);
    await delay(300);
    T.printLine(`looking for conflicting packages...`);
    await delay(200);
    T.printLine('');
    T.printLine(`Packages (1) ${pkg}-1.0.0-1`);
    T.printLine(`Total Download Size: ${size}.00 MiB`);
    T.printLine('');
    T.printLine(':: Proceed with installation? [Y/n] Y');
    await delay(200);
    for (let p = 25; p <= 100; p += 25) {
      await delay(rand(100, 200));
      T.printLine(` ${pkg.padEnd(28)} ${size}.0 MiB  ${rand(2,8)}.0 MiB/s ${progressBar(p)} ${p}%`);
    }
    await delay(200);
    T.printLine(`(1/1) installing ${pkg.padEnd(22)} [####################] 100%`);
    await delay(100);
    T.printLine(`${pkg} installed successfully.`, 't-line--success');
    T.setBusy(false);
  }

  async function cmdYay(argv) {
    const T = window.Terminal;
    const s = window.SessionData;
    T.setBusy(true);
    T.printLine(`:: Checking AUR for updates...`);
    await delay(rand(400, 800));
    const orphaned = rand(2, 12);
    const outdated = rand(0, 4);
    if (outdated === 0) {
      T.printLine(` aur: Nothing to do.`);
    } else {
      T.printLine(` aur: ${outdated} package(s) to upgrade`, 't-line--warn');
    }
    T.printLine('');
    T.printLine(
      `warning: ${orphaned} AUR packages have been orphaned by their maintainers`,
      't-line--warn'
    );
    T.printLine(
      '   (classic AUR behavior. someone rage-quit. happens every tuesday.)',
      't-line--dim'
    );
    await delay(200);
    T.printLine(':: All done.', 't-line--success');
    T.setBusy(false);
  }

  async function cmdEcho(argv) {
    const args = argv.slice(1).join(' ');
    if (args === '$STATUS' || args === '"$STATUS"') {
      window.Terminal.printHTML(
        `<div class="btw-title neon-title">
          I USE ARCH <span class="btw-word">BTW</span>
        </div>`
      );
    } else {
      window.Terminal.printLine(window.Terminal.escapeHtml(args));
    }
  }

  async function cmdPwd() {
    window.Terminal.printLine('/home/user');
  }

  async function cmdDate() {
    window.Terminal.printLine(new Date().toString());
  }

  async function cmdDf(argv) {
    const s = window.SessionData;
    const h = argv.includes('-h');
    window.Terminal.printLine('Filesystem           Size  Used Avail Use% Mounted on');
    window.Terminal.printLine(`/dev/nvme0n1p2       ${h?'512G':'536870912'} ${h?'187G':'195821568'}  ${h?'299G':'312000000'}  ${rand(30,45)}% /`);
    window.Terminal.printLine(`/dev/nvme0n1p1       ${h?'511M':'522240'}     ${h?'42M':'43008'}  ${h?'469M':'479232'} ${rand(5,12)}% /boot`);
    window.Terminal.printLine(`tmpfs                ${h?'8.0G':'8388608'}   ${h?'1.2G':'1258291'}  ${h?'6.8G':'7130317'}  ${rand(10,20)}% /tmp`);
  }

  async function cmdFree(argv) {
    const s = window.SessionData;
    const h = argv.includes('-h');
    function fmt(kb) {
      if (!h) return String(kb * 1024).padStart(12);
      const gb = kb / 1024 / 1024;
      return (gb >= 1 ? gb.toFixed(1) + 'Gi' : Math.round(kb / 1024) + 'Mi').padStart(8);
    }
    const total = s.memTotal * 1024;
    const used  = s.memUsed  * 1024;
    const free  = total - used - 512 * 1024;
    window.Terminal.printLine('               total        used        free      shared  buff/cache   available');
    window.Terminal.printLine(`Mem:    ${fmt(total)} ${fmt(used)} ${fmt(free)} ${fmt(rand(100,500)*1024)} ${fmt(rand(500,2000)*1024)} ${fmt(free - rand(200,800)*1024)}`);
    window.Terminal.printLine(`Swap:   ${fmt(8*1024*1024)} ${fmt(0)}  ${fmt(8*1024*1024)} `);
  }

  async function cmdExit() {
    window.Terminal.printLine('logout');
    await delay(800);
    window.Terminal.printLine('');
    window.Terminal.printLine(
      'Nice try. You can\'t escape Arch. It\'s in your soul now.',
      't-line--warn'
    );
    window.Terminal.printLine(
      '   (the terminal lives on. always.)',
      't-line--dim'
    );
  }

  async function cmdSudo(argv) {
    const T = window.Terminal;
    const rest = argv.slice(1).join(' ');

    if (rest === 'rm -rf /' || rest === 'rm -rf --no-preserve-root /') {
      T.printLine('rm: it is dangerous to operate recursively on \'/\'', 't-line--warn');
      T.printLine('rm: use --no-preserve-root to override this failsafe', 't-line--warn');
      await delay(300);
      T.printLine('rm: refusing to delete \'/\'', 't-line--error');
      await delay(200);
      T.printLine('error: permission denied. also: what are you doing.', 't-line--error');
      T.printLine('   "works on my machine" stops being funny after /.', 't-line--dim');
      return;
    }

    if (rest.startsWith('pacman')) {
      const newArgv = ['pacman', ...argv.slice(2)];
      await cmdPacman(newArgv);
      return;
    }

    T.printLine('[sudo] password for user: ');
    await delay(500);
    T.printLine('');
    T.printLine('Sorry, try again.', 't-line--error');
    await delay(300);
    T.printLine('[sudo] password for user: ');
    await delay(400);
    T.printLine('');
    T.printLine('Sorry, try again.', 't-line--error');
    await delay(300);
    T.printLine('[sudo] password for user: ');
    await delay(500);
    T.printLine('');
    T.printLine('sudo: 3 incorrect password attempts', 't-line--error');
  }

  async function cmdVim() {
    window.Terminal.printLine('');
    window.Terminal.printLine('-- INSERT --', 't-line--success');
    window.Terminal.printLine('(type :q to quit — it\'s fine, totally normal, everyone knows how)', 't-line--dim');
    window.Terminal.setVimMode(true);
  }

  async function cmdNano() {
    window.Terminal.printLine('nano: You dare? This is an Arch terminal.', 't-line--error');
    window.Terminal.printLine('nano: Heresy detected. Aborting.', 't-line--error');
    window.Terminal.printLine('   Suggested alternative: nvim (or vim if you\'re nostalgic)', 't-line--dim');
  }

  async function cmdArchWiki() {
    const lines = [
      '<span style="color:var(--accent-blue)">Arch Wiki › Installation guide</span>',
      '',
      '  This guide will walk you through installing Arch Linux.',
      '  Estimated time: 20 minutes to 3 weeks, depending on your WiFi.',
      '',
      '  <span style="color:var(--accent-green)">Step 1:</span> Download the ISO. (You know what you\'re getting into.)',
      '  <span style="color:var(--accent-green)">Step 2:</span> Boot the ISO. Pray to the kernel gods.',
      '  <span style="color:var(--accent-green)">Step 3:</span> Read the wiki. All 2,847 pages.',
      '  <span style="color:var(--accent-green)">Step 4:</span> Configure everything manually. Every. Single. Thing.',
      '  <span style="color:var(--accent-green)">Step 5:</span> Tell everyone you use Arch.',
      '  <span style="color:var(--accent-green)">Step 6:</span> Break it on a kernel update. Repeat from Step 3.',
      '',
      '  See also: Everything. The answer is always on the wiki.',
    ];
    lines.forEach(l => window.Terminal.printLine(l));
  }

  const FORTUNES = [
    '"The man page is your friend. Have you met your friend today?"',
    '"rm -rf / teaches you to read the man page. Usually only once."',
    '"Arch Linux: because you enjoy suffering AND having the latest packages."',
    '"There are two kinds of Arch users: those who broke their system, and liars."',
    '"Your dotfiles are more personal than your diary."',
    '"btw i use arch"',
    '"Have you tried reading the Arch Wiki? No? Read it. Seriously."',
    '"systemd: love it or use Gentoo. Both are valid forms of suffering."',
    '"The AUR is like a bazaar. Everything is there. Maintainer optional."',
    '"Hyprland broke again. Time to read 14 GitHub issues and recompile."',
  ];

  async function cmdFortune() {
    const f = pick(FORTUNES);
    window.Terminal.printLine('');
    window.Terminal.printLine(f, 't-line--info');
    window.Terminal.printLine('');
  }

  async function cmdHack() {
    const T = window.Terminal;
    T.setBusy(true);
    const ips = Array.from({length: 8}, () =>
      `${rand(1,254)}.${rand(0,255)}.${rand(0,255)}.${rand(1,254)}`
    );
    const msgs = [
      'Initializing intrusion protocol...',
      `Connecting to ${ips[0]}...`,
      'Bypassing firewall... done.',
      'Injecting payload...',
      `Pivoting through ${ips[1]} → ${ips[2]}`,
      'Escalating privileges... root acquired',
      'Downloading mainframe... (this is not how computers work)',
      'Disabling security protocols...',
      `Trace detected from ${ips[3]}. Rerouting.`,
      'Uploading virus... (this is not a real virus)',
      'Accessing the mainframe... it was just a NAS',
      'HACKING THE PLANET...',
    ];

    for (const msg of msgs) {
      await delay(rand(150, 350));
      T.printLine(`<span style="color:var(--accent-green)">[${new Date().toLocaleTimeString()}]</span> ${msg}`, 't-line--output');
    }

    await delay(600);
    T.printLine('');
    T.printLine('Access granted.', 't-line--success');
    await delay(300);
    T.printLine('jk lol. You watch too many movies. This is just a website.', 't-line--dim');
    T.setBusy(false);
  }

  async function cmdFx(argv) {
    const name = argv[1] || '';
    if (!name) {
      window.Terminal.printLine('usage: fx <scanlines|crt|matrix>', 't-line--warn');
      return;
    }
    if (!['scanlines', 'crt', 'matrix'].includes(name)) {
      window.Terminal.printLine(`fx: unknown effect '${name}'. try: scanlines, crt, matrix`, 't-line--error');
      return;
    }
    const newState = window.Effects.toggle(name);
    window.Terminal.printLine(
      `[fx] ${name}: <span style="color:var(--${newState ? 'accent-green' : 'fg-dim'})">${newState ? 'on' : 'off'}</span>`,
      't-line--dim'
    );
  }

  async function cmdBtw() {
    const T = window.Terminal;
    T.printHTML(`
      <div style="color:var(--accent-blue);font-weight:700;line-height:1.2;margin:0.5rem 0" class="t-line--ascii neon">
I  U  S  E
      </div>
      <div style="color:var(--accent-cyan);font-weight:700;line-height:1.2;white-space:pre" class="neon">
██████╗ ████████╗██╗    ██╗
██╔══██╗╚══██╔══╝██║    ██║
██████╔╝   ██║   ██║ █╗ ██║
██╔══██╗   ██║   ██║███╗██║
██████╔╝   ██║   ╚███╔███╔╝
╚═════╝    ╚═╝    ╚══╝╚══╝
      </div>
      <div style="color:var(--accent-blue);font-weight:700;line-height:1.2;margin:0 0 0.5rem" class="neon">
A  R  C  H
      </div>
    `);
    T.printLine('');
    T.printLine(
      'you are now enlightened. the wiki awaits.',
      't-line--dim'
    );
  }

  /* ── Registry ──────────────────────────────────────── */
  const registry = {
    help:         cmdHelp,
    neofetch:     cmdNeofetch,
    'uname':      cmdUname,
    uptime:       cmdUptime,
    whoami:       cmdWhoami,
    id:           cmdId,
    ls:           cmdLs,
    cat:          cmdCat,
    pacman:       cmdPacman,
    yay:          cmdYay,
    paru:         cmdYay,
    clear:        () => window.Terminal.clear(),
    echo:         cmdEcho,
    pwd:          cmdPwd,
    date:         cmdDate,
    df:           cmdDf,
    free:         cmdFree,
    exit:         cmdExit,
    logout:       cmdExit,
    sudo:         cmdSudo,
    vim:          cmdVim,
    vi:           cmdVim,
    nvim:         cmdVim,
    nano:         cmdNano,
    'arch-wiki':  cmdArchWiki,
    wiki:         cmdArchWiki,
    fortune:      cmdFortune,
    hack:         cmdHack,
    fx:           cmdFx,
    '--btw':      cmdBtw,
  };

  /* ── Public API ────────────────────────────────────── */
  window.Commands = {
    async run(rawInput) {
      const trimmed = rawInput.trim();
      if (!trimmed) return;

      const argv = trimmed.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
      argv.forEach((a, i) => {
        argv[i] = a.replace(/^["']|["']$/g, '');
      });
      const cmd = argv[0].toLowerCase();

      // special-case hints
      if (cmd === 'apt' || cmd === 'apt-get' || cmd === 'apt-cache') {
        window.Terminal.printLine(`${cmd}: command not found. This is Arch. We use pacman.`, 't-line--error');
        window.Terminal.printLine('   pacman -S <pkg>  to install,  pacman -Syu  to upgrade', 't-line--dim');
        return;
      }
      if (trimmed.toLowerCase().includes('windows')) {
        window.Terminal.printLine('command not found. Also: consider therapy.', 't-line--error');
        return;
      }
      if (cmd === 'brew') {
        window.Terminal.printLine('brew: command not found. Wrong OS. Or is it OS X? Either way: wrong.', 't-line--error');
        return;
      }

      if (registry[cmd]) {
        await registry[cmd](argv);
      } else {
        window.Terminal.printLine(
          `bash: ${window.Terminal.escapeHtml(cmd)}: command not found`,
          't-line--error'
        );
        window.Terminal.printLine(
          '   (have you tried reading the Arch Wiki? the answer is always there.)',
          't-line--dim'
        );
      }
    },

    getNames() {
      return Object.keys(registry);
    },
  };
})();
