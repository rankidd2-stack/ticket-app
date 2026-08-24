import Link from "next/link";
import { logOut } from "@/app/auth/actions";

export function AppHeader({
  title,
  orgName,
}: {
  title: string;
  orgName: string;
}) {
  return (
    <header className="flex items-center justify-between border-b border-border pb-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-ink-muted">{orgName}</p>
      </div>
      <nav className="flex items-center gap-4 text-sm text-ink-muted">
        <Link href="/tickets" className="hover:text-ink">
          Tickets
        </Link>
        <Link href="/assets" className="hover:text-ink">
          Assets
        </Link>
        <form action={logOut}>
          <button type="submit" className="hover:text-ink">
            Log out
          </button>
        </form>
      </nav>
    </header>
  );
}
