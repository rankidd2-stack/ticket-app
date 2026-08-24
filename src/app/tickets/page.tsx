import { prisma } from "@/lib/prisma";
import { createTicket, updateTicketStatus } from "./actions";
import { Status } from "@/generated/prisma/enums";

const NEXT_STATUS: Record<Status, { label: string; next: Status }> = {
  OPEN: { label: "Start", next: "IN_PROGRESS" },
  IN_PROGRESS: { label: "Close", next: "CLOSED" },
  CLOSED: { label: "Reopen", next: "OPEN" },
};

export default async function TicketsPage() {
  const tickets = await prisma.ticket.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-semibold">Tickets</h1>

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
        <button
          type="submit"
          className="rounded bg-black px-4 py-2 text-white"
        >
          Submit ticket
        </button>
      </form>

      <ul className="mt-8 flex flex-col gap-3">
        {tickets.map((ticket) => {
          const { label, next } = NEXT_STATUS[ticket.status];
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
                </span>
                <form action={updateTicketStatus.bind(null, ticket.id, next)}>
                  <button
                    type="submit"
                    className="rounded border px-3 py-1 text-sm"
                  >
                    {label}
                  </button>
                </form>
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
