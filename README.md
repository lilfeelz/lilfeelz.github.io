[![GH Pages](https://img.shields.io/badge/GitHub%20Pages-Deployed-success?logo=github&labelColor=0b0d10)](https://docs.lilfeelz.org)

# docs.lilfeelz.org

Filterable, keyboard-navigable listing of lilfeelz GitHub repositories. Static site with no runtime dependencies, client-side rendered from the unauthenticated GitHub API.

## Quickstart

```sh
# Serve locally (no build step)
python3 -m http.server 8000
# or
npx serve .
```

Open `http://localhost:8000`. Serving needs no npm install.

Checks: `npm ci`, then `npm run check` (tsc on the JSDoc types, prettier) and `npm run lint` (eslint); `npm run format` rewrites. Git hooks (`.pre-commit-config.yaml`) run the same tools: `brew install prek && prek install`, once per clone.

## Structure

```
lilfeelz.github.io/
├── index.html              # Shell layout, filter input, table
├── CNAME                   # Custom domain: docs.lilfeelz.org
├── .nojekyll               # Disable Jekyll (pure static)
├── assets/
│   ├── tokens.css          # Org design tokens, vendored by config-sync
│   ├── style.css           # Layout; colours from tokens.css
│   ├── repos.js            # GitHub API fetch + fuzzy filter + render
│   ├── keyboard-nav.js     # Vim-style h/j/k/l table navigation
│   └── github.svg          # Row icon
├── package.json            # dev tools only: typescript, eslint, prettier
├── jsconfig.json           # tsc --checkJs, strict
├── .github/workflows/ci.yml  # npm run check and lint, plus the prek hooks
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
| `h` / `ArrowLeft` | Previous column (GitHub icon ↔ name) |
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

`.github/workflows/ci.yml` runs `npm run check` (tsc `--checkJs` in strict mode over the JSDoc types, prettier) and `npm run lint` (eslint, `eslint.config.js`) for every PR and push to `main`, via the shared `JakobMelchard/.github` node workflow pinned to v2.3.1, plus the prek hooks.

## Dependencies

None at runtime. No bundler, no build step: vanilla HTML, CSS and JS with JSDoc types. `package.json` holds only the dev tools, pinned and bumped by Renovate.
