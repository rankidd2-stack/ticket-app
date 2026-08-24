import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

// Looks up the logged-in Supabase user and their matching Prisma User row
// (which carries the organization they belong to). Redirects to /login if
// there's no session, or if the auth user has no matching app user yet.
export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    include: { organization: true },
  });

  if (!user) {
    redirect("/login");
  }

  return user;
}
