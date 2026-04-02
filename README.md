# TechStartups AI

Startup intelligence platform for job seekers, founders, and investors.

## Stack

- **Next.js 14 App Router** — `apps/web`
- **Supabase** — Postgres, Auth, RLS
- **Stripe** — subscriptions
- **Turborepo + pnpm workspaces** — monorepo

## Getting started

```bash
pnpm install
pnpm dev
```

Copy `apps/web/.env.example` → `apps/web/.env.local` and fill in values.

---

## Database migration workflow

All schema changes are version-controlled as SQL files in `supabase/migrations/`.

### One-time setup

1. Install Supabase CLI:

   ```bash
   brew install supabase/tap/supabase
   ```

2. Log in to Supabase:

   ```bash
   supabase login
   ```

3. Set your project ref in your shell (or add to root `.env.local`):

   ```bash
   export SUPABASE_PROJECT_REF=xucigljidauhxskrglds
   ```

4. Link this repo to the hosted project:
   ```bash
   pnpm db:link
   ```
   You will be prompted for the database password — find it in the Supabase dashboard under **Settings → Database**.

### Adding a new table

1. Create a new migration file with a UTC timestamp prefix:

   ```
   supabase/migrations/YYYYMMDDHHMMSS_describe_change.sql
   ```

2. Write the SQL (table definition + RLS policies).

3. Push to prod:
   ```bash
   pnpm db:push
   ```

### Scripts

| Script          | What it does                                                     |
| --------------- | ---------------------------------------------------------------- |
| `pnpm db:link`  | Links repo to hosted Supabase project (run once per machine)     |
| `pnpm db:push`  | Applies all pending migrations to prod                           |
| `pnpm db:reset` | Resets the local Supabase instance and re-applies all migrations |
