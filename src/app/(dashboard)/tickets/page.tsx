import { prisma } from "@/lib/prisma";
import { createTicket, updateTicketStatus } from "./actions";
import { Status, Priority } from "@/generated/prisma/enums";
import { requireUser } from "@/lib/auth";
import { Pill, type Tone } from "@/components/Pill";

const STATUS_ACTIONS: Record<Status, { label: string; next: Status }[]> = {
  OPEN: [{ label: "Start", next: "IN_PROGRESS" }],
  IN_PROGRESS: [
    { label: "Hold", next: "ON_HOLD" },
    { label: "Close", next: "CLOSED" },
  ],
  ON_HOLD: [{ label: "Resume", next: "IN_PROGRESS" }],
  CLOSED: [{ label: "Reopen", next: "OPEN" }],
};

const STATUS_TONE: Record<Status, Tone> = {
  OPEN: "neutral",
  IN_PROGRESS: "accent",
  ON_HOLD: "warn",
  CLOSED: "good",
};

const PRIORITY_TONE: Record<Priority, Tone> = {
  LOW: "neutral",
  MEDIUM: "neutral",
  HIGH: "warn",
  URGENT: "bad",
};

export default async function TicketsPage() {
  const user = await requireUser();
  const [tickets, assets] = await Promise.all([
    prisma.ticket.findMany({
      where: { organizationId: user.organizationId },
      orderBy: { createdAt: "desc" },
      include: { asset: true },
    }),
    prisma.asset.findMany({
      where: { organizationId: user.organizationId },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight">Tickets</h1>

      <form
        action={createTicket}
        className="mt-6 flex flex-col gap-3 rounded-lg border border-border bg-surface p-5"
      >
        <input
          name="title"
          placeholder="Title"
          required
          className="rounded-md border border-border bg-bg px-3 py-2 text-sm placeholder:text-ink-faint focus:border-accent focus:outline-none"
        />
        <textarea
          name="description"
          placeholder="Description"
          required
          className="rounded-md border border-border bg-bg px-3 py-2 text-sm placeholder:text-ink-faint focus:border-accent focus:outline-none"
        />
        <input
          name="category"
          placeholder="Category (e.g. IT, Facilities)"
          required
          className="rounded-md border border-border bg-bg px-3 py-2 text-sm placeholder:text-ink-faint focus:border-accent focus:outline-none"
        />
        <select
          name="assetId"
          className="rounded-md border border-border bg-bg px-3 py-2 text-sm focus:border-accent focus:outline-none"
        >
          <option value="">No asset</option>
          {assets.map((asset) => (
            <option key={asset.id} value={asset.id}>
              {asset.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-ink hover:bg-accent-hover"
        >
          Submit ticket
        </button>
      </form>

      <ul className="mt-6 flex flex-col gap-3">
        {tickets.map((ticket) => {
          const actions = STATUS_ACTIONS[ticket.status];
          return (
            <li
              key={ticket.id}
              className="rounded-lg border border-border bg-surface p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium">{ticket.title}</span>
                <div className="flex shrink-0 gap-1.5">
                  <Pill tone={STATUS_TONE[ticket.status]}>
                    {ticket.status.replace("_", " ")}
                  </Pill>
                  <Pill tone={PRIORITY_TONE[ticket.priority]}>
                    {ticket.priority}
                  </Pill>
                </div>
              </div>
              <p className="mt-1 text-sm text-ink-muted">
                {ticket.description}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-ink-faint">
                  {ticket.category}
                  {ticket.asset && ` · ${ticket.asset.name}`}
                </span>
                <div className="flex gap-2">
                  {actions.map(({ label, next }) => (
                    <form
                      key={label}
                      action={updateTicketStatus.bind(null, ticket.id, next)}
                    >
                      <button
                        type="submit"
                        className="rounded-md border border-border px-3 py-1 text-sm text-ink-muted hover:text-ink"
                      >
                        {label}
                      </button>
                    </form>
                  ))}
                </div>
              </div>
            </li>
          );
        })}
        {tickets.length === 0 && (
          <p className="text-sm text-ink-faint">No tickets yet.</p>
        )}
      </ul>
    </div>
  );
}
