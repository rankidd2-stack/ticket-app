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
- **Asset** — name, type (plain text), notes

### Core flows
1. Sign up / log in
2. Create an organization
3. Submit a ticket
4. View ticket list, filter by status
5. Update ticket status / assign it
6. Log an asset (create, view, edit, delete)

### Explicitly NOT in v1
Notifications, invoicing/GCash, multi-branch locations, reporting dashboards, per-vertical custom fields, file attachments. Add one at a time after the baseline works end to end — don't build ahead of this list without discussing it first.

## Working style
- Patrick is a budding programmer learning through this project. Explain changes briefly, work in small steps, confirm before architecture-level decisions.
- For UI work, use `../design-references/<brand>/DESIGN.md` or the `/taste` skill instead of a generic default SaaS look.
