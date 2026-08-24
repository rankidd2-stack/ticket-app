import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const user = await requireUser();
  const [openTickets, downAssets] = await Promise.all([
    prisma.ticket.count({
      where: { organizationId: user.organizationId, status: { not: "CLOSED" } },
    }),
    prisma.asset.count({
      where: { organizationId: user.organizationId, status: "DOWN" },
    }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-muted">Welcome back, {user.name}.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard label="Open tickets" value={openTickets} />
        <StatCard label="Assets down" value={downAssets} />
        <StatCard label="Reports" value="Coming soon" />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <p className="text-xs text-ink-faint">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}
