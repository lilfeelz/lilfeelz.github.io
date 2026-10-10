[![GH Pages](https://img.shields.io/badge/GitHub%20Pages-Deployed-success?logo=github&labelColor=0b0d10)](https://docs.lilfeelz.org)

# docs.lilfeelz.org

Filterable, keyboard-navigable listing of lilfeelz GitHub repositories. Zero-dependency static site, client-side rendered from the unauthenticated GitHub API.

## Quickstart

```sh
# Serve locally (no build step)
python3 -m http.server 8000
# or
npx serve .
```

Open `http://localhost:8000`. No npm install needed.

Git hooks (`.pre-commit-config.yaml`): `brew install prek && prek install`, once per clone.

## Structure

```
lilfeelz.github.io/
├── index.html              # Shell layout, filter input, table
├── CNAME                   # Custom domain: docs.lilfeelz.org
├── .nojekyll               # Disable Jekyll (pure static)
├── assets/
│   ├── style.css           # Dark terminal theme, glass accents
│   ├── repos.js            # GitHub API fetch + fuzzy filter + render
│   ├── keyboard-nav.js     # Vim-style h/j/k/l table navigation
│   └── github.svg          # Row icon
├── .github/workflows/ci.yml  # node --check and eslint on assets/*.js
├── AGENTS.md               # AI agent rules for this repo
└── .agents/                # Vendored org rules and skills
```

## Features

### Keyboard Navigation

`keyboard-nav.js` implements vim-style table row/column navigation:

| Key | Action |
|-----|--------|
| `j` / `ArrowDown` | Next row |
| `k` / `ArrowUp` | Previous row |
| `h` / `ArrowLeft` | Previous column (name ↔ description) |
| `l` / `ArrowRight` | Next column |
| `/` | Focus the filter |
| `Enter` | Open link in new tab |
| `Escape` | Clear highlight, or leave the filter |
| Click | Focus row/column at click position |

Shortcuts are ignored while the filter (or any input) has focus, so every letter can be typed into it.

Active cell highlighted with cyan glow (`nav-active` class). Scrolled into view smoothly.

### Fuzzy Filter

`repos.js` implements character-wise fuzzy matching on repo names:

```js
// "zmt" matches "zmk" (z matches z, m matches m, t skips)
// "cfg" matches ".config" (c matches c, f matches ., g matches g)
function fuzzy(q, s) { /* case-insensitive, sequential char match */ }
```

Filter input at top of page, real-time filtering as you type. Uses `input` event, no debounce.

### Data Source

```js
fetch(`https://api.github.com/users/lilfeelz/repos?sort=full_name&per_page=100&type=owner&page=${page}`)
```

Pages until a short page. Owner, docs origin and hidden repos come from `<body data-user data-docs data-skip>`, so `repos.js` and `keyboard-nav.js` are the same files as on docs.melchard.org.

Filters out forks, archived, private, and `witchblades.org`. Sorted alphabetically by name. Links go to `https://docs.lilfeelz.org/<repo>` when the repo has Pages, otherwise to the GitHub repo.

**Known issue:** Unauthenticated API, 60 requests/hour rate limit. No caching or authenticated fallback yet.

### Style

Colours and font come from `assets/tokens.css`, the org design tokens vendored from JakobMelchard/.config by `config-sync` (opt-in via `.config/tokens.path`; never edit it by hand). `assets/style.css` only references `var(--bg)`, `var(--fg)`, `var(--link)`, `var(--muted)`, `var(--line)` and `var(--font)`, and is the same file as on docs.melchard.org.

## CI/CD

Deployed via GitHub Pages from `main` branch. Push to `main` → auto-deploys to `docs.lilfeelz.org`.

`.github/workflows/ci.yml` runs `node --check` and eslint (`no-undef`, `no-unused-vars`, pinned `npx eslint@10.12.0`, no config file) on `assets/*.js` for every PR and push to `main`, via the shared `JakobMelchard/.github` node workflow pinned to v1.3.0, plus the prek hooks.

## Dependencies

Zero. No npm, no bundler, no build step. Pure vanilla HTML/CSS/JS.
