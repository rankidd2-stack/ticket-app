"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Status } from "@/generated/prisma/enums";

const DEMO_ORG_ID = "demo-org";

export async function createTicket(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();

  if (!title || !description || !category) {
    throw new Error("Title, description, and category are required.");
  }

  await prisma.ticket.create({
    data: {
      title,
      description,
      category,
      organizationId: DEMO_ORG_ID,
    },
  });

  revalidatePath("/tickets");
}

export async function updateTicketStatus(ticketId: string, status: Status) {
  await prisma.ticket.update({
    where: { id: ticketId },
    data: { status },
  });

  revalidatePath("/tickets");
}
