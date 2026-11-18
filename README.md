[![GH Pages](https://img.shields.io/badge/GitHub%20Pages-Deployed-success?logo=github&labelColor=0b0d10)](https://docs.lilfeelz.org)

# docs.lilfeelz.org

Filterable, keyboard-navigable listing of `lilfeelz` GitHub repositories. Static site with no runtime dependencies, rendered client-side from the unauthenticated GitHub API.

## Quickstart

```sh
python3 -m http.server 8000  # or: npx serve .
```

Open `http://localhost:8000` (no `npm install` needed to serve).
Dev checks: `npm ci`, `npm run check` (`tsc` + `prettier`), `npm run lint` (`eslint`), `npm run format`. Pre-commit hooks: `brew install prek && prek install`.

## Structure

- `index.html`: shell layout, filter input, repo table, footer links
- `assets/tokens.css`: org design tokens from `JakobMelchard/web` (`.config/tokens.path`)
- `assets/style.css`, `assets/repos.js`, `assets/keyboard-nav.js`, `assets/github.svg`: synced from `JakobMelchard/JakobMelchard.github.io`
- `CNAME`, `.nojekyll`: GitHub Pages config (`docs.lilfeelz.org`)
- `.github/workflows/ci.yml`: `npm run check`, `npm run lint`, and `prek` hooks via `JakobMelchard/.github` (`v2.3.1`)

## Navigation & Filter

| Key | Action |
|---|---|
| `j` / `ArrowDown`, `k` / `ArrowUp` | Next / previous row |
| `h` / `ArrowLeft`, `l` / `ArrowRight` | Switch between GitHub icon and name columns |
| `/` | Focus filter input |
| `Enter` | Open highlighted link in a new tab |
| `Escape` | Clear highlight or blur filter |
| Click | Highlight clicked row/column |

Fuzzy filter matches characters sequentially, case-insensitively (for example `"ttm"` matches `"totem"`, `"cfg"` matches `".config"`).

## Data, Style & Deploy

- `index.html` configures `<body data-user data-docs data-skip>`; `repos.js` excludes forks, archived repos, private repos, and `data-skip` entries, caching results in `localStorage` for 1 hour (60 req/hr unauthenticated API limit).
- Links open `https://docs.lilfeelz.org/<repo>` when GitHub Pages is enabled (`lilfeelz.github.io` opens `https://docs.lilfeelz.org/`), otherwise the GitHub repo.
- Push to `main` deploys via GitHub Pages to `docs.lilfeelz.org`.
