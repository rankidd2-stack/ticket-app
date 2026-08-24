import { prisma } from "@/lib/prisma";
import { createTicket, updateTicketStatus } from "./actions";
import { Status } from "@/generated/prisma/enums";
import { requireUser } from "@/lib/auth";
import { logOut } from "@/app/auth/actions";

const STATUS_ACTIONS: Record<Status, { label: string; next: Status }[]> = {
  OPEN: [{ label: "Start", next: "IN_PROGRESS" }],
  IN_PROGRESS: [
    { label: "Hold", next: "ON_HOLD" },
    { label: "Close", next: "CLOSED" },
  ],
  ON_HOLD: [{ label: "Resume", next: "IN_PROGRESS" }],
  CLOSED: [{ label: "Reopen", next: "OPEN" }],
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
    <main className="mx-auto max-w-2xl p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tickets</h1>
          <p className="text-sm text-gray-500">{user.organization.name}</p>
        </div>
        <div className="flex items-center gap-4">
          <a href="/assets" className="text-sm underline">
            Assets
          </a>
          <form action={logOut}>
            <button type="submit" className="text-sm underline">
              Log out
            </button>
          </form>
        </div>
      </div>

      <form action={createTicket} className="mt-6 flex flex-col gap-3">
        <input
          name="title"
          placeholder="Title"
          required
          className="rounded border px-3 py-2"
        />
        <textarea
          name="description"
          placeholder="Description"
          required
          className="rounded border px-3 py-2"
        />
        <input
          name="category"
          placeholder="Category (e.g. IT, Facilities)"
          required
          className="rounded border px-3 py-2"
        />
        <select name="assetId" className="rounded border px-3 py-2">
          <option value="">No asset</option>
          {assets.map((asset) => (
            <option key={asset.id} value={asset.id}>
              {asset.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded bg-black px-4 py-2 text-white"
        >
          Submit ticket
        </button>
      </form>

      <ul className="mt-8 flex flex-col gap-3">
        {tickets.map((ticket) => {
          const actions = STATUS_ACTIONS[ticket.status];
          return (
            <li key={ticket.id} className="rounded border p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{ticket.title}</span>
                <span className="text-sm text-gray-500">
                  {ticket.status} · {ticket.priority}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-600">{ticket.description}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="inline-block text-xs text-gray-400">
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
                        className="rounded border px-3 py-1 text-sm"
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
          <p className="text-sm text-gray-500">No tickets yet.</p>
        )}
      </ul>
    </main>
  );
}
