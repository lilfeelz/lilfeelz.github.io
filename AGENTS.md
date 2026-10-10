# docs.lilfeelz.org — Site Guide

Zero-dependency GH Pages site. Vanilla JS, no build.

## Structure

```
index.html           # Shell layout + filter + table
assets/
  style.css          # Dark theme, glass accents, Dracula palette
  repos.js           # GitHub API fetch + fuzzy filter + render
  keyboard-nav.js    # Vim-style h/j/k/l nav
  github.svg         # Row icon, local so the page loads nothing from third parties
AGENTS.md            # This file
.agents/             # Vendored org rules (AGENTS.org.md) and skills
.github/workflows/   # ci.yml: node --check and eslint on assets/*.js
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
npx --yes eslint@10.12.0 --no-config-lookup --global document,window,fetch,AbortSignal \
  --rule '{"no-undef": "error", "no-unused-vars": "error"}' assets
```

Same checks CI runs.

### Deploy

Push to `main` → GH Pages auto-deploys to `docs.lilfeelz.org`.

## Key Files

### repos.js

- `assets/repos.js`, `assets/keyboard-nav.js` and `assets/github.svg` are copies of the files in JakobMelchard/JakobMelchard.github.io (docs.melchard.org); change them there and copy them back
- Site values come from `<body data-user data-docs data-skip>` in `index.html`, so the file holds none
- Fetches every page of `api.github.com/users/lilfeelz/repos` (unauthenticated = 60 req/hr), 10 s timeout per request
- Filters: no forks, no archived, no private, skip the names in `data-skip`
- `fuzzy(q, s)`: sequential char match, case-insensitive
- Error state: shows "failed to load repos" row, no retry
- Rows are cloned from `<template id="row">` and filled via `href` and `textContent`; URL segments go through `encodeURIComponent`

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
