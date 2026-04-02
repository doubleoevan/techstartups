@AGENTS.md

# TechStartups AI — Claude Code context

## What this project is

TechStartups AI (techstartups.ai) — a startup intelligence platform for three user types:

- Job seekers: find stable, growing companies before job postings go live
- Founders: raise smarter, get discovered by investors
- Investors: source deals before they're obvious

Each user type has Free / Tier 1 / Tier 2 plans. Users can subscribe to multiple types simultaneously (25% off each add-on). 14-day free trial on all paid tiers.

## Monorepo structure

```
techstartupsai/
├── apps/
│   ├── web/              ← Next.js 14 App Router (frontend + API routes)
│   └── ai-service/       ← AI inference jobs (TypeScript + Python sidecar)
├── packages/
│   ├── ui/               ← shadcn/ui components (@techstartups/ui)
│   ├── db/               ← Supabase client + generated types (@techstartups/db)
│   └── config/           ← shared eslint, tsconfig, tailwind
├── CLAUDE.md             ← you are here
├── AGENTS.md
└── turbo.json
```

## Tech stack

- **Next.js 14 App Router** — NO `pages/` directory, ever. All routes in `app/`.
- **shadcn/ui + Tailwind CSS v4** — dark mode via `@custom-variant dark (&:is(.dark *))` in globals.css (no tailwind.config.ts)
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

| URL                   | File                                    | Component               | Status      |
| --------------------- | --------------------------------------- | ----------------------- | ----------- |
| `/`                   | `app/(public)/page.tsx`                 | `HomePage`              | Built       |
| `/pricing`            | `app/(public)/pricing/page.tsx`         | `PricingPage`           | In progress |
| `/blog`               | `app/(public)/blog/page.tsx`            | `BlogPage`              | Pending     |
| `/blog/[slug]`        | `app/(public)/blog/[slug]/page.tsx`     | `BlogPostPage`          | Pending     |
| `/startups/[id]`      | `app/(public)/startups/[id]/page.tsx`   | `StartupProfilePage`    | Pending     |
| `/onboarding`         | `app/(app)/onboarding/page.tsx`         | `OnboardingPage`        | Pending     |
| `/dashboard`          | `app/(app)/dashboard/page.tsx`          | `DashboardPage`         | Pending     |
| `/dashboard/founder`  | `app/(app)/dashboard/founder/page.tsx`  | `FounderDashboardPage`  | Pending     |
| `/dashboard/investor` | `app/(app)/dashboard/investor/page.tsx` | `InvestorDashboardPage` | Pending     |
| `/settings`           | `app/(app)/settings/page.tsx`           | `SettingsPage`          | Pending     |

## Coding conventions

- **Tailwind only** — no inline styles, no CSS modules, no hardcoded hex values
- All colours must work in **light AND dark mode** via Tailwind semantic classes
- Use **shadcn/ui components** from packages/ui wherever they fit
- **TypeScript strict mode** throughout — no `any`, no `as` casts without justification
- Always use `cn` from `@techstartups/ui` for class merging — never string concatenation or template literals for Tailwind classes
- Every component that accepts a `className` prop must pass it through `cn`

## Naming conventions

- **No abbreviations or acronyms in variable names.** Write the full word, always.
  - `res` → `response`
  - `req` → `request`
  - `err` → `error`
  - `btn` → `button`
  - `val` → `value`
  - `idx` → `index`
  - `e` → `event`
  - `cb` → `callback`
  - `fn` → `function` (or a descriptive name)
  - `tmp` / `temp` → descriptive name for what it actually holds
- Exception: well-established domain abbreviations that are clearer than the full word (`url`, `id`, `api`, `html`, `css`, `sdk`) are fine.
- **Boolean variables and props must be prefixed with `is`, `has`, `can`, `should`, or `will`.** Examples: `isPopular`, `isLoading`, `hasError`, `canSubmit`.

## Brace style

- **Always use curly braces for if/else blocks — even single-line ones.** Never omit braces.

```typescript
// ❌ never
if (response.ok) setSubmitted(true)

// ✅ always
if (response.ok) {
  setSubmitted(true)
}
```

- Same rule applies to `for`, `while`, and `else` blocks — always braces, always a new line.

## AI conventions

- No LangChain — direct SDK calls to Anthropic/OpenAI only
- Prompts live in Supabase `prompts` table, not in code
- Models live in Supabase `models` table, not hardcoded
- **Never hardcode a model name, provider, temperature, or max_tokens anywhere in the codebase — ever.** Any literal like `claude-sonnet-4-6` or `anthropic` in application code is a bug. Everything loads from `models` at runtime. See DEC-015.

## Key database tables

- `profiles` — user identity, `primary_user_type`, `trial_used`
- `user_subscriptions` — one row per user per type (replaces single user_type field); includes `trial_ends_at`
- `startups` — startup profiles
- `momentum_scores` — computed per startup per date
- `usage_limits` — keyed by user_id + user_type + feature
- `models` — runtime model routing per feature (was `model_configs`)
- `prompts` — versioned prompt templates per feature (was `prompt_configs`)

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
2. Check the Decision Log for decisions affecting what you're building
3. Follow File & Route Structure conventions exactly
4. Stop after each logical unit and wait for review before continuing
5. One commit per logical unit — never bundle unrelated changes
6. Each commit must be independently deployable to Vercel
7. **Never commit or push.** Make the changes, then stop and suggest a commit message. The human will review, edit if needed, and commit manually.

## Refactor Log

Whenever a refactor is made during implementation — whether initiated by Claude Code

or requested via Cursor review — log it here before ending the session.

Format:

### [DATE] [File or module affected]

- **What changed:** Brief description

- **Why:** Reason (e.g. simplify, performance, convention alignment)

- **Impact:** Any downstream files or patterns affected

## Workflow

- Tasks come from Notion Sprint / Tasks page

- Claude Code (Warp) implements; Cursor is used for review and inline edits

- After Cursor review, Claude Code applies the requested changes

- All refactors are logged in the Refactor Log above before session end

- Mark tasks ✅ Done in Notion after completion

## Refactor Log

Whenever a refactor is made during implementation — whether initiated by Claude Code
or requested via Cursor review — log it here before ending the session.

Format:

### [DATE] [File or module affected]

- **What changed:** Brief description
- **Why:** Reason (e.g. simplify, performance, convention alignment)
- **Impact:** Any downstream files or patterns affected

## Workflow

- Tasks come from Notion Sprint / Tasks page
- Claude Code (Warp) implements; Cursor is used for review and inline edits
- After Cursor review, Claude Code applies the requested changes
- All refactors are logged in the Refactor Log above before session end
- Mark tasks ✅ Done in Notion after completion
