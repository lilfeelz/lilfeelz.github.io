---
name: cicd
description: CI/CD for lilfeelz.github.io. GH Pages auto-deploy from main. ci.yml runs npm run check and npm run lint, plus the prek hooks.
---

# CI/CD

Current: Push to main → GH Pages auto-deploys.

`.github/workflows/ci.yml` calls the shared `JakobMelchard/.github` node workflow and runs `npm run check` (tsc `--checkJs`, prettier) and `npm run lint` (eslint) on every PR and push to main, plus the shared hooks workflow for the prek hooks. Locally:

```sh
npm ci
npm run check
npm run lint
```

## Planned

- Validate HTML, check links
- Prevent deploy if validation fails
