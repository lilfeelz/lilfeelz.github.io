# docs.lilfeelz.org — Site Guide

Zero-dependency GH Pages site. Vanilla JS, no build.

## Structure

```
index.html           # Shell layout + filter + table
assets/
  style.css          # Dark theme, glass accents, Dracula palette
  repos.js           # GitHub API fetch + fuzzy filter + render
  keyboard-nav.js    # Vim-style h/j/k/l nav
AGENTS.md            # This file
.agents/             # Vendored org rules (AGENTS.org.md) and skills
.github/workflows/   # ci.yml: node --check on assets/*.js
```

## Workflow

### Edit

Edit `assets/` files directly. No build step — changes reflect on reload.

### Test locally

```sh
cd ~/Workspaces/lilfeelz/lilfeelz.github.io
python3 -m http.server 8000
# open http://localhost:8000
```

### Verify

```sh
for f in assets/*.js; do node --check "$f"; done
```

Same check CI runs.

### Deploy

Push to `main` → GH Pages auto-deploys to `docs.lilfeelz.org`.

## Key Files

### repos.js

- Fetches from `api.github.com/users/lilfeelz/repos` (unauthenticated = 60 req/hr)
- Filters: no forks, no archived, no private, exclude `witchblades.org`
- `fuzzy(q, s)`: sequential char match, case-insensitive
- Error state: shows "failed to load repos" row, no retry
- `esc()` escapes `& < > " '` for every API string put into HTML; URL segments also go through `encodeURIComponent`

### keyboard-nav.js

- Row tracking via `rowIdx`, column via `colIdx` (0=github icon, 1=name, 2=desc)
- Highlight via `nav-active` CSS class on `<td>`
- `Enter` opens link with `window.open(href, '_blank')`
- `/` focuses `#filter`; keys are ignored while an input or textarea has focus, except `Escape`, which blurs it
- Click handler: syncs keyboard state with clicked position

### style.css

- `color-mix()` for active row overlay (needs modern browser)
- No reset CSS — minimal `* { box-sizing: border-box }` only

## Constraints

- 60 req/hr unauthenticated rate limit on GitHub API
- No build step — must work as static files on GH Pages
- Keyboard nav must work with dynamic DOM (tbody replaced on filter)
- No external dependencies (no jQuery, no framework)
