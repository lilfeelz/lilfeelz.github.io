---
name: cicd
description: CI/CD for lilfeelz.github.io. GH Pages auto-deploy from main. No workflow yet. Add HTML/JS/CSS validation on PR.
---

# CI/CD

Current: Push to main → GH Pages auto-deploys. No workflow file.

## Planned

- `.github/workflows/ci.yml`: validate HTML, run eslint, check links
- Prevent deploy if validation fails
