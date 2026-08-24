import { signUp } from "@/app/auth/actions";

export default function SignUpPage() {
  return (
    <main className="mx-auto flex min-h-full max-w-sm flex-col justify-center px-6 py-10">
      <div className="rounded-lg border border-border bg-surface p-6">
        <h1 className="text-xl font-semibold tracking-tight">
          Create your organization
        </h1>

        <form action={signUp} className="mt-5 flex flex-col gap-3">
          <input
            name="orgName"
            placeholder="Organization name"
            required
            className="rounded-md border border-border bg-bg px-3 py-2 text-sm placeholder:text-ink-faint focus:border-accent focus:outline-none"
          />
          <input
            name="name"
            placeholder="Your name"
            required
            className="rounded-md border border-border bg-bg px-3 py-2 text-sm placeholder:text-ink-faint focus:border-accent focus:outline-none"
          />
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
            minLength={6}
            className="rounded-md border border-border bg-bg px-3 py-2 text-sm placeholder:text-ink-faint focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-ink hover:bg-accent-hover"
          >
            Sign up
          </button>
        </form>

        <p className="mt-4 text-sm text-ink-muted">
          Already have an account?{" "}
          <a href="/login" className="text-accent hover:underline">
            Log in
          </a>
        </p>
      </div>
    </main>
  );
}
