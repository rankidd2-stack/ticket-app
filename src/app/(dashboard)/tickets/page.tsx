import { prisma } from "@/lib/prisma";
import { createTicket, updateTicketStatus } from "./actions";
import { Status, Priority } from "@/generated/prisma/enums";
import { requireUser } from "@/lib/auth";
import { Pill, type Tone } from "@/components/Pill";
import { FilterTabs } from "@/components/FilterTabs";

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

const STATUS_FILTERS = [
  { value: "ALL", label: "All" },
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "ON_HOLD", label: "On Hold" },
  { value: "CLOSED", label: "Closed" },
];

const FIELD =
  "rounded-md border border-border bg-bg px-3 py-2 text-sm placeholder:text-ink-faint focus:border-accent focus:outline-none";

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await requireUser();
  const { status } = await searchParams;
  const activeStatus = status ?? "ALL";

  const [tickets, assets] = await Promise.all([
    prisma.ticket.findMany({
      where: {
        organizationId: user.organizationId,
        ...(activeStatus !== "ALL" ? { status: activeStatus as Status } : {}),
      },
      orderBy: { createdAt: "desc" },
      include: { asset: true },
    }),
    prisma.asset.findMany({
      where: { organizationId: user.organizationId },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Tickets</h1>
        <FilterTabs base="/tickets" current={activeStatus} options={STATUS_FILTERS} />
      </div>

      <details className="group mt-6 overflow-hidden rounded-lg border border-border bg-surface">
        <summary className="flex cursor-pointer list-none items-center gap-2 px-5 py-3.5 text-sm font-medium">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-accent text-xs text-accent-ink transition-transform group-open:rotate-45">
            +
          </span>
          New ticket
        </summary>
        <form action={createTicket} className="flex flex-col gap-3 px-5 pb-5">
          <input name="title" placeholder="Title" required className={FIELD} />
          <textarea
            name="description"
            placeholder="Description"
            required
            className={FIELD}
          />
          <input
            name="category"
            placeholder="Category (e.g. IT, Facilities)"
            required
            className={FIELD}
          />
          <select name="assetId" className={FIELD}>
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
      </details>

      <ul className="mt-6 divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
        {tickets.map((ticket) => {
          const actions = STATUS_ACTIONS[ticket.status];
          return (
            <li
              key={ticket.id}
              className="flex items-center gap-4 px-4 py-3 hover:bg-bg-soft"
            >
              <Pill tone={STATUS_TONE[ticket.status]}>
                {ticket.status.replace("_", " ")}
              </Pill>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{ticket.title}</p>
                <p className="truncate text-xs text-ink-faint">
                  {ticket.category}
                  {ticket.asset && ` · ${ticket.asset.name}`} —{" "}
                  {ticket.description}
                </p>
              </div>
              <Pill tone={PRIORITY_TONE[ticket.priority]}>
                {ticket.priority}
              </Pill>
              <div className="flex shrink-0 gap-1.5">
                {actions.map(({ label, next }) => (
                  <form
                    key={label}
                    action={updateTicketStatus.bind(null, ticket.id, next)}
                  >
                    <button
                      type="submit"
                      className="rounded-md border border-border px-2.5 py-1 text-xs text-ink-muted hover:text-ink"
                    >
                      {label}
                    </button>
                  </form>
                ))}
              </div>
            </li>
          );
        })}
        {tickets.length === 0 && (
          <li className="px-4 py-8 text-center text-sm text-ink-faint">
            {activeStatus === "ALL"
              ? "No tickets yet."
              : "No tickets with this status."}
          </li>
        )}
      </ul>
    </div>
  );
}
