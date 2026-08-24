import { logIn } from "@/app/auth/actions";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-full max-w-sm flex-col justify-center px-6 py-10">
      <div className="rounded-lg border border-border bg-surface p-6">
        <h1 className="text-xl font-semibold tracking-tight">Log in</h1>

        <form action={logIn} className="mt-5 flex flex-col gap-3">
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="rounded-md border border-border bg-bg px-3 py-2 text-sm placeholder:text-ink-faint focus:border-accent focus:outline-none"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="rounded-md border border-border bg-bg px-3 py-2 text-sm placeholder:text-ink-faint focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-ink hover:bg-accent-hover"
          >
            Log in
          </button>
        </form>

        <p className="mt-4 text-sm text-ink-muted">
          No account yet?{" "}
          <a href="/signup" className="text-accent hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </main>
  );
}
