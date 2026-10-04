<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/assets/logo-dark.svg">
  <img src=".github/assets/logo-light.svg" alt="" height="72">
</picture>

# Viperr Tournament

*Website for a Dota 2 tournament between CIS Discord communities*

[![CI](https://img.shields.io/github/actions/workflow/status/twaddlelug/dota2-viperr-lending/ci.yml?style=flat-square&label=CI)](https://github.com/twaddlelug/dota2-viperr-lending/actions)
[![Node.js](https://img.shields.io/badge/Node.js-%E2%89%A522.12-3c873a?style=flat-square)](https://nodejs.org)
[![React Router](https://img.shields.io/badge/React_Router-8-ca4245?style=flat-square)](https://reactrouter.com)
[![Prisma](https://img.shields.io/badge/Prisma-7-2d3748?style=flat-square)](https://www.prisma.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?style=flat-square)](https://tailwindcss.com)

[Features](#features) • [Getting started](#getting-started) • [Deployment](#deployment) • [Project structure](#project-structure)

</div>

Every Discord community fields one team of its best players, and the teams play a double-elimination playoff in the format of The International. The tournament is organized by the Viperr server. The site itself is in Russian.

## Features

- **Website**: landing page, playoff bracket (upper and lower bracket, best-of-five grand final), team list and team profiles.
- **Admin panel** at `/admin`: servers, teams, rosters with personal invite links, seeding, match results and landing page texts.
- **Players** sign in with Discord and link their Steam account; nicknames and avatars are pulled in automatically.
- **Two modes**: a static demo built from sample data, and a server backed by Postgres.

## Getting started

You need Node.js 22.12+, pnpm and Docker (or `pnpm db:dev` instead of Docker).

```bash
pnpm install
cp .env.example .env
docker compose up -d db
pnpm db:migrate
pnpm db:seed
pnpm dev
```

The site runs at http://localhost:5173.

> [!TIP]
> To open the admin panel without a Discord application, put the same Discord ID into `DEV_LOGIN_DISCORD_ID` and `ADMIN_DISCORD_IDS` in `.env`. Production builds do not include this shortcut.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `DATA_SOURCE` | `db` for the server with a database, empty for the static demo. Read at build time |
| `DATABASE_URL` | Postgres connection string |
| `DB_PORT` | Host port of the `docker compose` database, if 5432 is taken |
| `SESSION_SECRET` | Long random string that signs the session cookie |
| `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET` | Discord application used for sign-in |
| `ADMIN_DISCORD_IDS` | Comma-separated Discord IDs of the administrators |
| `STEAM_API_KEY` | Optional: Steam nicknames and avatars instead of SteamIDs |
| `PUBLIC_URL` | Public address of the site, required behind a reverse proxy |
| `DEV_LOGIN_DISCORD_ID` | Development only: sign in without Discord |

### Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Development server |
| `pnpm check` | Type check, lint, tests and unused code detection |
| `pnpm build`, `pnpm start` | Production build and server |
| `pnpm db:migrate`, `pnpm db:seed` | Migrations and sample data |
| `pnpm db:studio` | Database browser |

## Deployment

**Demo on Vercel.** Import the repository. No environment variables are needed: the site is built as static pages from the sample data.

**Production on a VPS.**

```bash
cp .env.example .env
docker compose up -d --build
```

This starts Postgres and the app on `127.0.0.1:3000`; migrations run on startup. Expose the site through a reverse proxy with HTTPS, and add `<PUBLIC_URL>/auth/discord/callback` as a redirect URI under OAuth2 in the Discord Developer Portal.

> [!IMPORTANT]
> Host the VPS outside Russia: the server has to reach Discord for sign-in and images. Visitors from Russia receive Discord images through the site itself.

## Project structure

```
app/
├── routes/      pages: data loading, form handling, markup
├── features/    domain logic: bracket, teams, servers, settings, auth, landing
├── components/  shared UI: ui, layout, effects, admin
├── lib/         database, environment, formatting
└── config/      site name, navigation, tournament facts
prisma/          schema, migrations, sample data for an empty database
```
