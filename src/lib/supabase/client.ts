import { createBrowserClient } from "@supabase/ssr";

// Used in Client Components (interactive UI running in the browser).
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
