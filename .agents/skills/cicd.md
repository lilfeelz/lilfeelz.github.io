---
name: cicd
description: CI/CD for lilfeelz.github.io. GH Pages auto-deploy from main. ci.yml runs node --check on assets/*.js.
---

# CI/CD

Current: Push to main → GH Pages auto-deploys.

`.github/workflows/ci.yml` calls the shared `JakobMelchard/.github` node workflow and runs `node --check` on each `assets/*.js` on every PR and push to main.

## Planned

- Validate HTML, run eslint, check links
- Prevent deploy if validation fails
