# Repository Guidelines

## Project Structure & Module Organization

This is a Vite + React 19 + TypeScript frontend. Code lives in `src/`:

- `src/modules/` contains route-level features: `home`, `auth`, and `app`.
- `src/components/`, `src/hooks/`, and `src/utils/` hold reusable UI, hooks, formatters, API helpers, and shared logic.
- `src/auth/` contains authentication state, providers, services, and route guards.
- `src/assets/` contains bundled assets; `public/` contains files served unchanged (for example, `robots.txt`).
- Build and tooling configuration is at the root (`vite.config.ts`, `tsconfig*.json`, `eslint.config.ts`).

Keep feature-specific components, hooks, services, and interfaces near their module; promote code to shared directories only when it is reused.

## Build, Test, and Development Commands

This project uses **Bun** (see `packageManager` in `package.json`; a devcontainer with Bun and Trivy is in `.devcontainer/`). Run `bun install --frozen-lockfile` for a clean, lockfile-based install, then:

- `bun run dev` starts the Vite development server with HMR.
- `bun run build` creates the production bundle in `dist/`.
- `bun run preview` serves the production bundle locally for verification.
- `bun run lint` runs ESLint across the repository.
- `bun run typecheck` runs TypeScript without emitting files.
- `bun run audit` runs `bun audit` (fails on high severity).
- `bun run scan:cve` runs a local Trivy scan using `trivy.yaml` (Trivy is preinstalled in the devcontainer).
- `bun run test` currently runs a placeholder and exits successfully; do not treat it as automated coverage.

CI runs linting, type checking, the build, and security scans. The pre-commit hook runs `bun run test` (not `bun test`, which would invoke Bun's own runner).

## Coding Style & Naming Conventions

Use TypeScript and existing four-space indentation. Follow ESLint, including ordered imports with blank lines between groups, strict equality, curly braces, typed React props, self-closing JSX, and accessible markup. Use PascalCase for components and pages, camelCase for functions/hooks/services, and descriptive feature filenames (for example, `useGetHistory.ts` and `WalletViewPage.tsx`). Keep API calls in the relevant `*.service.ts` or `src/utils/api/` module.

## Testing Guidelines

No test framework or coverage threshold is configured yet. For changes, run `bun run lint`, `bun run typecheck`, and `bun run build`; manually verify affected flows with `bun run dev` and include regression tests when a test runner is introduced.

## Commit & Pull Request Guidelines

Use Conventional Commit messages, such as `feat: add wallet history` or `fix: correct login redirect`. Allowed types include `feat`, `fix`, `ui`, `refactor`, `chore`, `docs`, `test`, `perf`, `revert`, and `hotfix`; subjects must be 10-125 characters. Pull requests should explain the behavior change, list validation commands, link the relevant issue, and include screenshots or recordings for UI changes. Keep changes focused and ensure CI passes.

## Security & Configuration Tips

Do not commit secrets or credentials. Review configuration in `src/config/` and authentication changes carefully; CI runs Gitleaks, `bun audit --audit-level=high`, Trivy (`.github/workflows/trivy.yml`, config in `trivy.yaml`), and CodeQL. Third-party GitHub Actions that handle security tooling are pinned to full commit SHAs.
