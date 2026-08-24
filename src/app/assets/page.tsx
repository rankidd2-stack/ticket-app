import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { createAsset, updateAssetStatus } from "./actions";
import { AssetStatus } from "@/generated/prisma/enums";

const NEXT_ASSET_STATUS: Record<AssetStatus, { label: string; next: AssetStatus }[]> = {
  OPERATIONAL: [{ label: "Mark down", next: "DOWN" }],
  DOWN: [
    { label: "Mark operational", next: "OPERATIONAL" },
    { label: "Retire", next: "RETIRED" },
  ],
  RETIRED: [{ label: "Reinstate", next: "OPERATIONAL" }],
};

export default async function AssetsPage() {
  const user = await requireUser();
  const assets = await prisma.asset.findMany({
    where: { organizationId: user.organizationId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-2xl p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Assets</h1>
        <a href="/tickets" className="text-sm underline">
          Tickets
        </a>
      </div>

      <form action={createAsset} className="mt-6 flex flex-col gap-3">
        <input
          name="name"
          placeholder="Name (e.g. Lobby AC Unit)"
          required
          className="rounded border px-3 py-2"
        />
        <input
          name="type"
          placeholder="Type (e.g. HVAC, Laptop, Vehicle)"
          required
          className="rounded border px-3 py-2"
        />
        <input
          name="notes"
          placeholder="Notes (optional)"
          className="rounded border px-3 py-2"
        />
        <button
          type="submit"
          className="rounded bg-black px-4 py-2 text-white"
        >
          Add asset
        </button>
      </form>

      <ul className="mt-8 flex flex-col gap-3">
        {assets.map((asset) => {
          const actions = NEXT_ASSET_STATUS[asset.status];
          return (
            <li key={asset.id} className="rounded border p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{asset.name}</span>
                <span className="text-sm text-gray-500">{asset.status}</span>
              </div>
              <p className="mt-1 text-xs text-gray-400">{asset.type}</p>
              {asset.notes && (
                <p className="mt-1 text-sm text-gray-600">{asset.notes}</p>
              )}
              <div className="mt-2 flex gap-2">
                {actions.map(({ label, next }) => (
                  <form
                    key={label}
                    action={updateAssetStatus.bind(null, asset.id, next)}
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
            </li>
          );
        })}
        {assets.length === 0 && (
          <p className="text-sm text-gray-500">No assets yet.</p>
        )}
      </ul>
    </main>
  );
}
