# BFlow Frontend

[![Trivy](https://github.com/DiazzzDev/BFlow-Frontend/actions/workflows/trivy.yml/badge.svg?branch=main)](https://github.com/DiazzzDev/BFlow-Frontend/actions/workflows/trivy.yml)

React + Vite + TypeScript frontend for BFlow.

## Getting started

This project uses [Bun](https://bun.sh) as package manager and script runner.

```bash
bun install --frozen-lockfile
cp .env.example .env
bun run dev
```

Other useful scripts: `bun run lint`, `bun run typecheck`, `bun run build`, `bun run audit`, `bun run scan:cve`.

### Devcontainer

Open the repo in VS Code / GitHub Codespaces and choose **Reopen in Container**. `.devcontainer/` provides Bun, Node 22 (some tooling still expects it), and the Trivy CLI; dependencies are installed automatically.
Vite listens on all container interfaces so the forwarded port 5173 is reachable from your browser.

## Security scanning

[Trivy](https://trivy.dev) scans `bun.lock` and the repo's IaC/config for known CVEs on every pull request, on pushes to `main`/`develop`, and weekly. Findings of HIGH/CRITICAL severity fail the pipeline and are published to the GitHub Security tab. Configuration lives in [`trivy.yaml`](./trivy.yaml); run it locally with `bun run scan:cve`.
