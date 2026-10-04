# Contributing

Please read the [Code of Conduct](CODE_OF_CONDUCT.md) first.

## Setup

Follow [Getting started](README.md#getting-started) in the README.

## Workflow

1. Create a branch from `main`.
2. Run `pnpm check` before committing: the type check, lint, tests and unused code detection must pass.
3. Write commit messages in the [Conventional Commits](https://www.conventionalcommits.org/) style: `feat: …`, `fix: …`, `refactor: …`, `docs: …`, `chore: …`.

## Code organization

- `app/routes` holds the pages. A route reads the form, calls a feature function and returns the result; it never queries the database itself.
- `app/features/<feature>` holds everything about one subject: `<feature>.ts` for types and pure logic with tests next to it, `<feature>.server.ts` for database access, `*.tsx` for the site UI and `admin/` for the admin panel UI.
- `app/components` holds shared UI that knows nothing about the tournament.
- `*.server.ts` modules never reach the browser: importing one from client code fails the build.

## Code style

- Formatting and import order come from Biome: `pnpm exec biome check --write .`
- No comments in code: function and variable names should explain the intent.
- New logic comes with tests next to it (`*.test.ts`, Vitest).
