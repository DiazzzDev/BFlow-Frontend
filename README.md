# BFlow Frontend

[![Trivy](https://github.com/DiazzzDev/BFlow-Frontend/actions/workflows/trivy.yml/badge.svg?branch=main)](https://github.com/DiazzzDev/BFlow-Frontend/actions/workflows/trivy.yml)

The web client for **BFlow**, a collaborative financial-control platform for people and small groups who need a clearer view of how their money moves across wallets, budgets, recurring transactions, and shared finances.

This repository contains the React application. It communicates with the [BFlow Financial Engine](https://github.com/DiazzzDev/BFlow-Financial-Engine), which owns the financial domain, persistence, authentication integration, and payment workflows.

## The problem BFlow addresses

Managing money across cash, bank accounts, cards, and shared funds quickly becomes difficult. BFlow helps users:

- Organize income, expenses, transfers, and recurring transactions.
- Track several personal or shared wallets in one place.
- Define budgets and understand spending progress before a limit is exceeded.
- Review financial history and dashboard insights without sharing bank credentials.
- Collaborate safely through wallet invitations and role-aware access.

The frontend focuses on making these financial workflows understandable, responsive, and secure while the backend remains the source of truth for business rules and financial data.

## Architecture overview

```text
Browser
  │
  ▼
React + TypeScript + Vite
  ├── React Router: public, auth, and protected application routes
  ├── TanStack Query: server-state fetching, caching, and mutations
  ├── Zustand: authenticated-user and UI session state
  ├── react-i18next: Spanish and English localization
  └── Tailwind CSS: visual system and responsive UI
  │
  ├── AWS Cognito / Amplify: sign-in, sign-out, OAuth, and access tokens
  │
  ▼
BFlow Financial Engine API
  ├── Financial domain and authorization rules
  ├── Wallets, transactions, budgets, subscriptions, and notifications
  └── Payment and cloud-service integrations
```

All API communication goes through the shared API utility in `src/utils/api/`. It attaches the Cognito access token when available, sends the active language, normalizes API failures, and gives feature services a consistent request interface.

## Current capabilities

- Authentication with email/password, Google OAuth, account verification, password recovery, and account deletion flows.
- Personal and shared wallets, invitations, member management, and transaction history.
- Income, expenses, transfers, recurring transactions, budgets, and dashboard summaries.
- Notifications, settings, profile management, and localization.
- Public landing, contact, legal, documentation, pricing, subscription, and Wompi checkout flows.
- Responsive application shell with protected routes and reusable controls.

## Technology stack

- **React 19** and **TypeScript**
- **Vite** for development and production builds
- **Bun** for package management and script execution
- **React Router** for client-side routing
- **TanStack Query** for API state and cache management
- **Zustand** for local application state
- **AWS Amplify / Cognito** for authentication
- **Tailwind CSS** for styling
- **react-i18next** for localization
- **React Hook Form**, **Zod**, **Sonner**, **Lucide**, and **Recharts** for forms, validation, feedback, icons, and charts

## Project structure

```text
src/
├── auth/                       # Cognito configuration, session bootstrap, and auth state
├── components/                 # Reusable controls, loaders, icons, and shared UI
├── config/                     # Environment-derived application configuration
├── hooks/                      # Generic reusable hooks
├── i18n/                       # Internationalization setup and locale dictionaries
├── modules/
│   ├── app/                    # Authenticated product experience
│   │   ├── components/          # Header, navigation, user menu, notifications
│   │   ├── features/            # Dashboard, wallets, budgets, history, settings, etc.
│   │   ├── hooks/               # App-shell interaction hooks
│   │   ├── interfaces/          # Shared application-domain types
│   │   └── utils/               # Presentation and navigation helpers
│   ├── auth/                   # Login, registration, recovery, verification, OAuth pages
│   └── home/                   # Landing, legal, docs, contact, plans, and subscriptions
├── utils/
│   ├── api/                    # Authenticated API client, response types, and error handling
│   └── formatters/             # Currency, date, and numeric presentation helpers
├── AppRouter.tsx               # Route tree and route guards
└── main.tsx                    # Application bootstrap

.devcontainer/                  # Reproducible local development environment
.github/workflows/              # CI, quality, security, and Trivy workflows
docs/features/                  # Lightweight specification-driven feature documentation
public/                         # Static assets served without bundling
```

## Getting started

### Recommended: Dev Container

The repository includes a development container with Bun, Node.js 22 for supporting tools, Git, and Trivy. This is the recommended way to work on the project because every contributor gets the same runtime and security tooling.

#### Requirements

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Visual Studio Code](https://code.visualstudio.com/)
- The **Dev Containers** extension for VS Code

#### Steps

1. Clone the repository.
2. Open the repository folder in VS Code.
3. Run **Dev Containers: Reopen in Container** from the Command Palette.
4. Copy the environment template if the creation hook did not do it already:

   ```bash
   cp -n .env.example .env
   ```

5. Fill in the required environment values in `.env`.
6. Start the development server:

   ```bash
   bun run dev
   ```

Vite is exposed on port `5173`. VS Code forwards the port automatically when using the devcontainer; otherwise open the URL printed by Vite in your browser.

> Source changes under `src/` do not require rebuilding the container. Keep one `bun run dev` process running and Vite will reload the application as files change. Rebuild the container only after modifying `.devcontainer/`, its Dockerfile, or container-level dependencies.

### Local setup without Docker

Use this option only when Bun is installed locally.

```bash
bun install --frozen-lockfile
cp .env.example .env
bun run dev
```

## Environment variables

Create a local `.env` file from `.env.example`. Do not commit secrets or production credentials.

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Base URL for the BFlow Financial Engine API used by the frontend. |
| `VITE_API_URL_PROD` | Production API URL, when required by deployment configuration. |
| `VITE_COGNITO_ISSUER` | AWS Cognito issuer URL. |
| `VITE_COGNITO_DOMAIN` | Cognito hosted UI domain. |
| `VITE_COGNITO_CLIENT_ID` | Cognito application client identifier. |
| `VITE_COGNITO_USER_POOL_ID` | Cognito user-pool identifier. |
| `VITE_COGNITO_REDIRECT_SIGN_IN` | OAuth callback URL, normally `http://localhost:5173/auth/callback` during development. |
| `VITE_COGNITO_REDIRECT_SIGN_OUT` | URL to return to after sign-out. |
| `VITE_MCP_SERVER_URL` | Optional BFlow MCP server endpoint. |

## Available commands

| Command | Description |
| --- | --- |
| `bun run dev` | Starts Vite with hot module replacement. |
| `bun run build` | Produces the optimized production bundle in `dist/`. |
| `bun run preview` | Serves the production bundle locally. |
| `bun run lint` | Runs ESLint across the repository. |
| `bun run typecheck` | Validates TypeScript without emitting files. |
| `bun run test` | Runs the current test placeholder; it is not coverage evidence. |
| `bun run audit` | Fails on high-severity dependency findings reported by Bun. |
| `bun run scan:cve` | Runs a local Trivy filesystem scan using `trivy.yaml`. |

## API and state-management conventions

Feature code follows a consistent flow:

```text
page or component
  → feature hook (TanStack Query)
  → feature service
  → shared apiRequest utility
  → BFlow Financial Engine
```

- Keep HTTP operations in the feature's `*.service.ts` file.
- Use feature hooks for queries, mutations, cache invalidation, loading, and error states.
- Keep feature-specific interfaces near the feature that owns them.
- Use `apiRequest` instead of raw `fetch` for protected API calls so tokens, language headers, and normalized errors remain consistent.
- Treat backend-provided values such as plans, benefits, limits, and permissions as the source of truth instead of duplicating them in the UI.

## Quality and security

The repository applies several safeguards:

- ESLint, TypeScript type checking, and production builds run in CI.
- Husky hooks enforce commit-message and pre-commit checks.
- Gitleaks scans the Git history for secrets.
- Bun audit checks dependency advisories.
- Trivy scans the filesystem and configuration for HIGH and CRITICAL findings, uploads SARIF results to GitHub Security, and runs on pull requests, pushes, and a weekly schedule.
- CodeQL provides JavaScript/TypeScript static analysis.
- Dependabot tracks Bun, GitHub Actions, and devcontainer image dependencies.

## Product scope

BFlow is in active development. The current focus is reliable financial tracking, understandable collaboration, and strong security boundaries.

The frontend intentionally does not own financial calculations, authorization decisions, payment validation, or persistent data. Those responsibilities belong to the [BFlow Financial Engine](https://github.com/DiazzzDev/BFlow-Financial-Engine), which exposes the API consumed here.

## Contributing

Before opening a pull request:

1. Keep the change focused and place code in the feature that owns it.
2. Run `bun run lint`, `bun run typecheck`, and `bun run build` inside the devcontainer.
3. Add or update the corresponding specification in `docs/features/` for product-facing work.
4. Use Conventional Commit messages such as `feat: add wallet history` or `fix: correct login redirect`.
5. Describe behavior changes, validation evidence, related issues, and UI screenshots or recordings when applicable.

## Related repositories

- [BFlow Financial Engine](https://github.com/DiazzzDev/BFlow-Financial-Engine) — backend, financial domain, persistence, and cloud integrations.
