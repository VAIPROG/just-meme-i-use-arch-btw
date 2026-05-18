# i use arch btw

A terminal meme page for people who need the world to know.

Live: [vadim-khristenko.github.io/just-meme-i-use-arch-btw](https://vadim-khristenko.github.io/just-meme-i-use-arch-btw)

## What it does

Renders a fake terminal running `neofetch` with dynamic, session-randomised system stats. Fully interactive: type real commands, cycle through 5 terminal colour schemes, toggle CRT effects, watch matrix rain. All vanilla JS — no build step, no framework.

## Running locally

```sh
python -m http.server 8080
# open http://localhost:8080
```

Or just open `index.html` directly in a browser (clipboard API requires HTTPS or localhost).

## Commands

| Command | What it does |
|---------|-------------|
| `help` | list all commands |
| `neofetch` | display system info |
| `neofetch --ascii=arch\|gentoo\|minimal\|btw` | pick ASCII art variant |
| `neofetch --btw` | you know |
| `uname -a` | kernel info |
| `uptime` | uptime |
| `whoami` | who are you |
| `ls -la` | fake home directory |
| `cat /etc/os-release` | OS info |
| `cat .zshrc` | p10k config excerpt |
| `pacman -Q` | installed packages |
| `pacman -Syu` | animated system upgrade |
| `pacman -S <pkg>` | fake install |
| `yay` / `paru` | AUR drama |
| `df -h` | disk usage |
| `free -h` | memory |
| `date` | current time |
| `fortune` | Arch wisdom |
| `arch-wiki` | installation guide |
| `vim` / `nvim` | enter vim modal (`:q` to exit) |
| `nano` | heresy |
| `hack` | look busy |
| `fx <scanlines\|crt\|matrix>` | toggle visual effects |
| `--btw` | secret |
| `clear` | clear terminal |
| `echo $STATUS` | the message |

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| `↑` / `↓` | command history |
| `Tab` | autocomplete |
| `Ctrl+L` | clear |
| `Ctrl+C` | cancel |
| Konami code | ↑↑↓↓←→←→BA |

## Colour schemes

Click the theme button in the titlebar to cycle:
- **tokyo-night** (default) — dark blue/purple
- **gruvbox** — warm brown/yellow
- **nord** — cool grey/blue
- **dracula** — purple/pink
- **solarized** — classic dark

Preferences persist via `localStorage`.

## File structure

```
/
├── index.html
├── css/
│   ├── themes.css     CSS custom properties for each theme
│   ├── styles.css     layout and components
│   └── effects.css    animations, CRT, scanlines, cursor
├── js/
│   ├── effects.js     matrix rain + effect toggles
│   ├── themes.js      theme cycling + persistence
│   ├── commands.js    session data + all command handlers
│   ├── terminal.js    keyboard input, history, typing engine
│   └── main.js        startup sequence, Konami code, share
└── .nojekyll
```

## Deployment

GitHub Pages workflow in `.github/workflows/gh-pages.yml` deploys on every push to `main`. No build step required.

## Changelog

### v2.0 — Elite Edition

- **Interactive terminal**: full keyboard input with command history, Tab autocomplete, Ctrl+L/Ctrl+C
- **20+ commands**: neofetch, pacman, uname, uptime, ls, cat, vim modal, fortune, hack, and more
- **Dynamic session stats**: package count, kernel version, uptime, CPU/GPU randomised each load
- **4 neofetch variants**: arch, gentoo, minimal, btw
- **5 colour themes**: tokyo-night, gruvbox, nord, dracula, solarized — persisted in localStorage
- **Visual effects**: scanlines, CRT flicker, matrix rain (all toggleable)
- **Konami code easter egg**
- **Share button**: copies neofetch text block to clipboard
- **Mobile support**: touch input, history nav buttons, responsive ASCII art
- **Removed Tailwind CDN**: real CSS with custom properties
- **Switched to English**: removed Russian text
- **XSS-safe**: user input HTML-escaped before render
- **Zero dependencies**: vanilla JS, no build step

### v1.0 — Initial

- Static neofetch display
- `sudo pacman -Syu` button animation
- CRT effects and neon glow

---

MIT © Vadim Khristenko
