import { signUp } from "@/app/auth/actions";

export default function SignUpPage() {
  return (
    <main className="mx-auto max-w-sm p-8">
      <h1 className="text-2xl font-semibold">Create your organization</h1>

      <form action={signUp} className="mt-6 flex flex-col gap-3">
        <input
          name="orgName"
          placeholder="Organization name"
          required
          className="rounded border px-3 py-2"
        />
        <input
          name="name"
          placeholder="Your name"
          required
          className="rounded border px-3 py-2"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="rounded border px-3 py-2"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          minLength={6}
          className="rounded border px-3 py-2"
        />
        <button
          type="submit"
          className="rounded bg-black px-4 py-2 text-white"
        >
          Sign up
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-500">
        Already have an account?{" "}
        <a href="/login" className="underline">
          Log in
        </a>
      </p>
    </main>
  );
}
