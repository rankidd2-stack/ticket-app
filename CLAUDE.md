@AGENTS.md

# Ticket App

A generic ticket + asset tracking SaaS. The core engine is built vertical-agnostic on purpose — we pick a specific market (IT/MSP, facilities, clinic chains, etc.) once the baseline works end to end, then adjust category labels and branding, not the data model.

## Stack
- Next.js (App Router) + TypeScript + Tailwind CSS
- PostgreSQL + Prisma
- Hosting: Vercel (app) + Neon or Supabase (Postgres)

## Baseline scope (v1)

### Entities
- **Organization** — the tenant/customer account
- **User** — belongs to an Organization, role: admin or member
- **Ticket** — title, description, category (plain text), priority, status, assignee, timestamps
- **Asset** — name, type (plain text), notes, status (Operational / Down / Retired), optionally linked to tickets

### Core flows
1. Sign up / log in — done (Supabase Auth; signup also creates the Organization)
2. Create an organization — done (folded into signup)
3. Submit a ticket — done
4. View ticket list, filter by status — done (segmented tabs via `?status=`, `FilterTabs` component, reused on Assets too)
5. Update ticket status / assign it — status done, assignment not yet
6. Log an asset (create, view, edit, delete) — create/view/status done, edit/delete not yet

### Auth notes
- Supabase Auth handles login/sessions. `User.id` in Prisma = the Supabase auth user's id (one id, not two).
- Email confirmation is on by default — a new signup can't log in until the confirmation link is clicked. This is correct behavior, not a bug.
- Dev and production currently point at the same Supabase project. Fine for now (just us), but separate them before real users touch this.

### Explicitly NOT in v1
Notifications, invoicing/GCash, multi-branch locations, reporting dashboards, per-vertical custom fields, file attachments. Add one at a time after the baseline works end to end — don't build ahead of this list without discussing it first.

### Workflow patterns noted for later (from Zendesk / Jira Service Management / MaintainX research, 2026-08-24)
- Auto-transitions on events, not just manual buttons (e.g. assigning a ticket auto-moves it to In Progress; a reply auto-reopens it)
- Split "Solved" from "Closed" with a reopen grace period, instead of one manual Close action
- SLA / time-to-resolution tracked as its own field, separate from status

### Asset patterns noted for later (from UpKeep / Fiix / Snipe-IT research, 2026-08-24)
- Parent/child asset hierarchy (a big asset made of trackable sub-components)
- Asset criticality scoring, to prioritize maintenance by impact
- Unique barcode-style asset tags, for physical scanning workflows
- Check-in/check-out to a specific person, separate from status (who has it, not just what condition it's in)

## Design system (2026-08-24)
Synthesized from `design-references/{linear.app,stripe,notion}/DESIGN.md`, not cloned from one brand. All tokens live as CSS custom properties in `globals.css`, registered as Tailwind utilities via `@theme inline` (`bg-surface`, `text-ink`, `bg-accent`, etc.) — don't hardcode hex values in components, use the tokens.
- **Color**: purple-indigo accent (blended from all three brands' near-identical primary), Linear's surface-ladder for dark mode, Stripe/Notion's warm-white for light mode. Semantic tones (`good`/`warn`/`bad`/`neutral`) drive ticket/asset status pills — see `src/components/Pill.tsx`.
- **Shape**: rectangular 8px buttons (Notion's stance, not Linear/Stripe's pills) — reads as a tool, not a marketing page. Pills reserved for status badges only.
- **Type**: Geist Sans + Geist Mono (already bundled by create-next-app) — the open-source substitute all three DESIGN.md files independently point to.
- **Theme toggle**: `src/components/ThemeToggle.tsx`, rendered globally in `layout.tsx` (fixed top-right, every page). Toggles a `.dark` class on `<html>` via `document.startViewTransition` (a left-to-right wipe; instant fallback if unsupported), persisted to `localStorage`. A no-flash inline script in `layout.tsx` reads the stored preference before paint. Uses `flushSync` for the React state update inside the transition callback — the View Transitions API requires the DOM to be fully settled before the callback returns, and a plain `setState` lands on React's own tick, too late.
- **Layout**: `src/app/(dashboard)/` is a route group (doesn't affect the URL) holding the authenticated shell — `layout.tsx` renders `Sidebar` + auth guard once for every nested page (`dashboard`, `tickets`, `assets`, `settings`), replacing the old per-page `AppHeader`. `dashboard` and `settings` are intentional skeleton pages — real nav destinations, placeholder content, to be built out next.
- Auth pages (`login`, `signup`) are split-screen: form on the left, a decorative accent-colored panel with a dot-grid pattern on the right (hidden below `sm:`).
- **Tickets/Assets list pattern**: `<details>`/`<summary>` for the create form (native, zero-JS collapse — no client component needed), a dense `divide-y` row list instead of padded cards (Linear's issue-list density), and `FilterTabs` (Notion's segmented-tab spec) reading/writing a `?status=` query param server-side.

## Gotchas
- After any change to `prisma/schema.prisma`, run `npx prisma generate` explicitly. `prisma migrate dev` does not always regenerate the client on its own, and a stale client throws a confusing `PrismaClientValidationError` at runtime that looks like a data bug but isn't.
- `document.startViewTransition(...).ready` legitimately rejects with `InvalidStateError` when the tab is backgrounded/hidden — the theme still switches correctly, only the animation is skipped. Caught deliberately in `ThemeToggle.tsx`; don't "fix" this by removing the transition.

## Working style
- Patrick is a budding programmer learning through this project. Explain changes briefly, work in small steps, confirm before architecture-level decisions.
- For UI work, use `../design-references/<brand>/DESIGN.md` or the `/taste` skill instead of a generic default SaaS look.
