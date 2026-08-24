import Link from "next/link";

export function FilterTabs({
  base,
  current,
  options,
}: {
  base: string;
  current: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex gap-1 rounded-md border border-border bg-surface p-1">
      {options.map((opt) => {
        const active = current === opt.value;
        const href = opt.value === "ALL" ? base : `${base}?status=${opt.value}`;
        return (
          <Link
            key={opt.value}
            href={href}
            className={`rounded px-3 py-1.5 text-sm transition-colors ${
              active
                ? "bg-ink text-bg"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            {opt.label}
          </Link>
        );
      })}
    </div>
  );
}
