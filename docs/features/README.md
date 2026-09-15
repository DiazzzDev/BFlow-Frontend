# Feature SDD

This directory uses a lightweight Specification-Driven Development (SDD) workflow for product features. Each feature has a short specification, one tracker entry, and validation evidence linked from its pull request.

## Workflow

1. **Propose** — Add a row to [`INDEX.md`](./INDEX.md) with an owner, status, and expected outcome.
2. **Specify** — Copy [`TEMPLATE.md`](./TEMPLATE.md) to `NNN-short-name.md`. Complete the requirements and acceptance criteria before implementation.
3. **Build** — Link the specification in the pull request. Keep meaningful scope or implementation decisions in the specification.
4. **Validate** — Run `npm run lint`, `npm run typecheck`, and `npm run build`; record any feature-specific manual checks.
5. **Ship** — Mark a feature `shipped` after its acceptance criteria are met and any follow-up work is captured.

## Statuses

Use one tracker status: `proposed`, `specified`, `building`, `validating`, `shipped`, or `paused`. Update the tracker and specification in the same pull request as the feature change.

## Pull request convention

Include `Feature spec: <spec filename>` in the pull request description. Link the tracker entry, list validation evidence, explain behavior changes, and include screenshots or recordings for UI changes.
