import { logIn } from "@/app/auth/actions";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      <div className="flex w-full flex-col justify-center px-6 py-10 sm:w-[420px] sm:px-10">
        <p className="text-sm font-semibold tracking-tight">Ticket App</p>
        <h1 className="mt-8 text-xl font-semibold tracking-tight">Log in</h1>

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

      <div className="relative hidden flex-1 overflow-hidden bg-accent sm:block">
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1.5px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative flex h-full flex-col justify-end p-14">
          <p className="text-3xl font-semibold tracking-tight text-accent-ink">
            Track tickets and assets in one place.
          </p>
          <p className="mt-3 max-w-sm text-sm text-accent-ink/75">
            Built for small teams who need something simple, not another
            enterprise suite.
          </p>
        </div>
      </div>
    </div>
  );
}
