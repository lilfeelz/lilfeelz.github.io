# docs.lilfeelz.org: Site Guide

Zero-dependency static GitHub Pages site (`vanilla JS`, JSDoc types, no build step).
Site settings live on `<body data-user data-docs data-skip>` in `index.html`; footer links point to `https://lil.feelz.dev` and `https://big.feelz.dev`.

## Upstream Sync Contract

- `assets/repos.js`, `assets/keyboard-nav.js`, `assets/github.svg`, and `assets/style.css` are copied from `JakobMelchard/JakobMelchard.github.io`; edit upstream first and sync back here.
- `assets/tokens.css` is copied from `JakobMelchard/web` (`dist/tokens.css`) and tracked in `.config/tokens.path` (`web-tokens` hook enforces an exact match; never edit by hand).

## Workflow

- Edit `index.html` or `assets/` directly; test locally and deploy on push to `main` (GitHub Pages serves `docs.lilfeelz.org`).
- Run `npm run check` (`tsc -p jsconfig.json` + `prettier --check .`) and `npm run lint` (`eslint .`) per `README.md` and `.github/workflows/ci.yml`.

## Key Files

- **repos.js**: paginates `api.github.com/users/lilfeelz/repos` (10s timeout, 1h `localStorage` cache for 60 req/hr limit); drops forks, archived, private, and `data-skip` entries; clones `<template id="row">` with `textContent` and `encodeURIComponent` URLs; shows `"GitHub rate limit reached, try again later"` on 403 or `"failed to load repos"` on other errors when uncached.
- **keyboard-nav.js**: tracks `rowIdx` and `colIdx` (0=github icon, 1=name); applies `.nav-active` on `<td>`; `Enter` calls `window.open(href, '_blank')`; `/` focuses `#filter`; ignores keys inside inputs/textareas (`Escape` blurs); click syncs `rowIdx`/`colIdx`.
- **style.css**: uses `color-mix()` for `.nav-active` and minimal `* { box-sizing: border-box }` (no CSS reset).

## Constraints

- Static files only on GitHub Pages (no bundler, no runtime dependencies).
- Keyboard navigation must work against dynamic `<tbody>` rows replaced on filter.
