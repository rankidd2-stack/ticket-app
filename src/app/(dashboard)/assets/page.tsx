import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { createAsset, updateAssetStatus } from "./actions";
import { AssetStatus } from "@/generated/prisma/enums";
import { Pill, type Tone } from "@/components/Pill";
import { FilterTabs } from "@/components/FilterTabs";

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

const STATUS_FILTERS = [
  { value: "ALL", label: "All" },
  { value: "OPERATIONAL", label: "Operational" },
  { value: "DOWN", label: "Down" },
  { value: "RETIRED", label: "Retired" },
];

const FIELD =
  "rounded-md border border-border bg-bg px-3 py-2 text-sm placeholder:text-ink-faint focus:border-accent focus:outline-none";

export default async function AssetsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await requireUser();
  const { status } = await searchParams;
  const activeStatus = status ?? "ALL";

  const assets = await prisma.asset.findMany({
    where: {
      organizationId: user.organizationId,
      ...(activeStatus !== "ALL" ? { status: activeStatus as AssetStatus } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Assets</h1>
        <FilterTabs base="/assets" current={activeStatus} options={STATUS_FILTERS} />
      </div>

      <details className="group mt-6 overflow-hidden rounded-lg border border-border bg-surface">
        <summary className="flex cursor-pointer list-none items-center gap-2 px-5 py-3.5 text-sm font-medium">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-accent text-xs text-accent-ink transition-transform group-open:rotate-45">
            +
          </span>
          New asset
        </summary>
        <form action={createAsset} className="flex flex-col gap-3 px-5 pb-5">
          <input
            name="name"
            placeholder="Name (e.g. Lobby AC Unit)"
            required
            className={FIELD}
          />
          <input
            name="type"
            placeholder="Type (e.g. HVAC, Laptop, Vehicle)"
            required
            className={FIELD}
          />
          <input name="notes" placeholder="Notes (optional)" className={FIELD} />
          <button
            type="submit"
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-ink hover:bg-accent-hover"
          >
            Add asset
          </button>
        </form>
      </details>

      <ul className="mt-6 divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
        {assets.map((asset) => {
          const actions = NEXT_ASSET_STATUS[asset.status];
          return (
            <li
              key={asset.id}
              className="flex items-center gap-4 px-4 py-3 hover:bg-bg-soft"
            >
              <Pill tone={STATUS_TONE[asset.status]}>{asset.status}</Pill>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{asset.name}</p>
                <p className="truncate text-xs text-ink-faint">
                  {asset.type}
                  {asset.notes && ` — ${asset.notes}`}
                </p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                {actions.map(({ label, next }) => (
                  <form
                    key={label}
                    action={updateAssetStatus.bind(null, asset.id, next)}
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
        {assets.length === 0 && (
          <li className="px-4 py-8 text-center text-sm text-ink-faint">
            {activeStatus === "ALL"
              ? "No assets yet."
              : "No assets with this status."}
          </li>
        )}
      </ul>
    </div>
  );
}
