@AGENTS.md

# TechStartups AI — Claude Code context

## What this project is

TechStartups AI (techstartups.ai) — a startup intelligence platform for three user types:

- Job seekers: find stable, growing companies before job postings go live
- Founders: raise smarter, get discovered by investors
- Investors: source deals before they’re obvious

Each user type has Free / Tier 1 / Tier 2 plans. Users can subscribe to multiple types simultaneously (25% off each add-on). 14-day free trial on all paid tiers.

## Monorepo structure

techstartupsai/

├── apps/

│   ├── web/              ← Next.js 14 App Router (frontend + API routes)

│   └── ai-service/       ← AI inference jobs (TypeScript + Python sidecar)

├── packages/

│   ├── ui/               ← shadcn/ui components (@techstartups/ui)

│   ├── db/               ← Supabase client + generated types (@techstartups/db)

│   └── config/           ← shared eslint, tsconfig, tailwind

├── CLAUDE.md           ← you are here

├── AGENTS.md

└── turbo.json

## Tech stack

- **Next.js 14 App Router** — NO `pages/` directory, ever. All routes in `app/`.
- **shadcn/ui + Tailwind CSS** — `darkMode: 'class'` in tailwind.config.ts
- **next-themes** — dark/light toggle, system preference + localStorage
- **Supabase** — PostgreSQL, auth (email + Google OAuth), RLS
- **Stripe** — subscriptions, one per user type per user
- **Turborepo + pnpm workspaces** — build caching, shared packages
- **Vercel** — apps/web deployment
- **Railway** — apps/ai-service deployment
- **Langfuse** — AI observability (traces, cost, evals)
- **Anthropic Claude** — primary AI provider, direct SDK (no LangChain)

## Route conventions

- Route files are always named `page.tsx`. Never use custom names like `HomePage.tsx` as route files.
- `app/(public)/` — public-facing pages (landing, pricing, blog, startup profiles)
- `app/(app)/` — authenticated pages (dashboards, onboarding, settings)
- Components go in `apps/web/components/` or `packages/ui/components/`

## Current routes


| URL        | File                            | Component     | Status      |
| ---------- | ------------------------------- | ------------- | ----------- |
| `/`        | `app/(public)/page.tsx`         | `HomePage`    | In progress |
| `/pricing` | `app/(public)/pricing/page.tsx` | `PricingPage` | In progress |


## Coding conventions

- **Tailwind only** — no inline styles, no CSS modules, no hardcoded hex values
- All colours must work in **light AND dark mode** via Tailwind semantic classes
- Use **shadcn/ui components** from packages/ui wherever they fit
- **TypeScript strict mode** throughout — no `any`, no `as` casts without justification
- No LangChain — direct SDK calls to Anthropic/OpenAI only
- Prompts live in Supabase `prompt_configs` table, not in code
- Models live in Supabase `model_configs` table, not hardcoded

## Key database tables

- `profiles` — user identity, `primary_user_type`, `trial_used`
- `user_subscriptions` — one row per user per type (replaces single user_type field)
- `startups` — startup profiles
- `momentum_scores` — computed per startup per date
- `usage_limits` — keyed by user_id + user_type + feature
- `model_configs` — runtime model routing per feature
- `prompt_configs` — versioned prompt templates per feature

## Notion — source of truth

Always read the relevant Notion page before building a feature:

- Architecture: [https://www.notion.so/33562400378d803e936fd6866881b3e8](https://www.notion.so/33562400378d803e936fd6866881b3e8)
- File & Route Structure: [https://www.notion.so/33562400378d81f68254ea465d579884](https://www.notion.so/33562400378d81f68254ea465d579884)
- Product Specs (tiers + features): [https://www.notion.so/33562400378d80ec929cc644350e344f](https://www.notion.so/33562400378d80ec929cc644350e344f)
- Decision Log: [https://www.notion.so/33562400378d805e9315f03fea059619](https://www.notion.so/33562400378d805e9315f03fea059619)
- Design & Mockups: [https://www.notion.so/33562400378d81e39209f9ca595d2617](https://www.notion.so/33562400378d81e39209f9ca595d2617)
- Global Layout spec: [https://www.notion.so/33562400378d81378413c71c4605bb33](https://www.notion.so/33562400378d81378413c71c4605bb33)
- Landing Page spec + source: [https://www.notion.so/33562400378d81ef91f5e13bf51c06e0](https://www.notion.so/33562400378d81ef91f5e13bf51c06e0)
- Pricing Page spec + source: [https://www.notion.so/33562400378d818f84a7ec4682869a43](https://www.notion.so/33562400378d818f84a7ec4682869a43)

## Rules for every session

1. Read the relevant Notion page(s) before writing any code
2. Check the Decision Log for decisions affecting what you’re building
3. Follow File & Route Structure conventions exactly
4. Stop after each logical unit and wait for review before continuing
5. One commit per logical unit — never bundle unrelated changes
6. Each commit must be independently deployable to Vercel
7. **Never commit or push.** Make the changes, then stop and suggest a commit message. The human will review, edit if needed, and commit manually.

