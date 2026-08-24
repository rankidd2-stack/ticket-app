import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { createAsset, updateAssetStatus } from "./actions";
import { AssetStatus } from "@/generated/prisma/enums";
import { Pill, type Tone } from "@/components/Pill";

const NEXT_ASSET_STATUS: Record<AssetStatus, { label: string; next: AssetStatus }[]> = {
  OPERATIONAL: [{ label: "Mark down", next: "DOWN" }],
  DOWN: [
    { label: "Mark operational", next: "OPERATIONAL" },
    { label: "Retire", next: "RETIRED" },
  ],
  RETIRED: [{ label: "Reinstate", next: "OPERATIONAL" }],
};

const STATUS_TONE: Record<AssetStatus, Tone> = {
  OPERATIONAL: "good",
  DOWN: "bad",
  RETIRED: "neutral",
};

export default async function AssetsPage() {
  const user = await requireUser();
  const assets = await prisma.asset.findMany({
    where: { organizationId: user.organizationId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight">Assets</h1>

      <form
        action={createAsset}
        className="mt-6 flex flex-col gap-3 rounded-lg border border-border bg-surface p-5"
      >
        <input
          name="name"
          placeholder="Name (e.g. Lobby AC Unit)"
          required
          className="rounded-md border border-border bg-bg px-3 py-2 text-sm placeholder:text-ink-faint focus:border-accent focus:outline-none"
        />
        <input
          name="type"
          placeholder="Type (e.g. HVAC, Laptop, Vehicle)"
          required
          className="rounded-md border border-border bg-bg px-3 py-2 text-sm placeholder:text-ink-faint focus:border-accent focus:outline-none"
        />
        <input
          name="notes"
          placeholder="Notes (optional)"
          className="rounded-md border border-border bg-bg px-3 py-2 text-sm placeholder:text-ink-faint focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-ink hover:bg-accent-hover"
        >
          Add asset
        </button>
      </form>

      <ul className="mt-6 flex flex-col gap-3">
        {assets.map((asset) => {
          const actions = NEXT_ASSET_STATUS[asset.status];
          return (
            <li
              key={asset.id}
              className="rounded-lg border border-border bg-surface p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium">{asset.name}</span>
                <Pill tone={STATUS_TONE[asset.status]}>{asset.status}</Pill>
              </div>
              <p className="mt-1 text-xs text-ink-faint">{asset.type}</p>
              {asset.notes && (
                <p className="mt-1 text-sm text-ink-muted">{asset.notes}</p>
              )}
              <div className="mt-3 flex gap-2">
                {actions.map(({ label, next }) => (
                  <form
                    key={label}
                    action={updateAssetStatus.bind(null, asset.id, next)}
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
            </li>
          );
        })}
        {assets.length === 0 && (
          <p className="text-sm text-ink-faint">No assets yet.</p>
        )}
      </ul>
    </div>
  );
}
