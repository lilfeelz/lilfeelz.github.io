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

## Structure

```
lilfeelz.github.io/
├── index.html              # Shell layout, filter input, table
├── CNAME                   # Custom domain: docs.lilfeelz.org
├── .nojekyll               # Disable Jekyll (pure static)
├── assets/
│   ├── style.css           # Dark terminal theme, glass accents
│   ├── repos.js            # GitHub API fetch + fuzzy filter + render
│   └── keyboard-nav.js     # Vim-style h/j/k/l table navigation
└── .agents/                # AI agent rules for this repo
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
| `Enter` | Open link in new tab |
| `Escape` | Clear highlight |
| Click | Focus row/column at click position |

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
fetch(`https://api.github.com/users/lilfeelz/repos?sort=updated&per_page=100&type=owner`)
```

Filters out forks, archived, private, and `witchblades.org`. Sorted alphabetically by name. Links go to `https://docs.lilfeelz.org/<repo>` (each project's docs subpage).

**Known issue:** Unauthenticated API — 60 requests/hour rate limit. `.todo` plans localStorage caching with TTL and authenticated API fallback.

### Style

Dark terminal theme with glass-morphism elements. Color palette:
- Background: `#000000`, text: `#eef2f7`
- Accent: `#9ee7ff` (cyan), muted: `#9aa4b2`
- Active row: `color-mix(in srgb, #9ee7ff 40%, transparent)`
- Font: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas`

## CI/CD

Deployed via GitHub Pages from `main` branch. Push to `main` → auto-deploys to `docs.lilfeelz.org`.

No CI workflow yet (planned: HTML/JS/CSS validation on PR).

## Dependencies

Zero. No npm, no bundler, no build step. Pure vanilla HTML/CSS/JS.

## .todo

See `.todo` for planned work: authenticated API calls, loading state, retry logic, error differentiation, favicon, 404 page, CI workflow, localStorage caching.
