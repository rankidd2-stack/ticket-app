"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function signUp(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const orgName = String(formData.get("orgName") ?? "").trim();

  if (!email || !password || !name || !orgName) {
    throw new Error("All fields are required.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error || !data.user) {
    throw new Error(error?.message ?? "Sign up failed.");
  }

  const organization = await prisma.organization.create({
    data: { name: orgName },
  });

  await prisma.user.create({
    data: {
      id: data.user.id,
      email,
      name,
      role: "ADMIN",
      organizationId: organization.id,
    },
  });

  redirect("/tickets");
}

export async function logIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/tickets");
}

export async function logOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
