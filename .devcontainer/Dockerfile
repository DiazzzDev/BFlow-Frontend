# Versions are pinned on purpose; Dependabot (docker ecosystem) keeps them fresh.
ARG BUN_VERSION=1.4.3
ARG TRIVY_VERSION=0.69.3

FROM oven/bun:${BUN_VERSION} AS bun
FROM aquasec/trivy:${TRIVY_VERSION} AS trivy

FROM mcr.microsoft.com/devcontainers/base:noble

# Bun (package manager + script runner) copied from the official image.
COPY --from=bun /usr/local/bin/bun /usr/local/bin/bun
RUN ln -s /usr/local/bin/bun /usr/local/bin/bunx

# Trivy CLI for local CVE scans (`bun run scan:cve`).
COPY --from=trivy /usr/local/bin/trivy /usr/local/bin/trivy

USER vscode
