---
name: cicd
description: CI/CD for lilfeelz.github.io. GH Pages auto-deploy from main. ci.yml runs node --check and eslint on assets/*.js.
---

# CI/CD

Current: Push to main → GH Pages auto-deploys.

`.github/workflows/ci.yml` calls the shared `JakobMelchard/.github` node workflow and runs `node --check` and eslint on each `assets/*.js` on every PR and push to main. Locally:

```sh
for f in assets/*.js; do node --check "$f"; done
npx --yes eslint@10.12.0 --no-config-lookup --global document,window,fetch,AbortSignal \
  --rule '{"no-undef": "error", "no-unused-vars": "error"}' assets
```

## Planned

- Validate HTML, check links
- Prevent deploy if validation fails
