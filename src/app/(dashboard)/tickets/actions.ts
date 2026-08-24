"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Status } from "@/generated/prisma/enums";
import { requireUser } from "@/lib/auth";

export async function createTicket(formData: FormData) {
  const user = await requireUser();

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const assetId = String(formData.get("assetId") ?? "").trim() || null;

  if (!title || !description || !category) {
    throw new Error("Title, description, and category are required.");
  }

  // Only attach the asset if it actually belongs to this org — never trust
  // an id submitted from the client without checking.
  const asset = assetId
    ? await prisma.asset.findFirst({
        where: { id: assetId, organizationId: user.organizationId },
      })
    : null;

  await prisma.ticket.create({
    data: {
      title,
      description,
      category,
      organizationId: user.organizationId,
      assetId: asset?.id,
    },
  });

  revalidatePath("/tickets");
}

export async function updateTicketStatus(ticketId: string, status: Status) {
  const user = await requireUser();

  // Scope the update to the user's own organization, so no one can change
  // a ticket that isn't theirs just by knowing its id.
  await prisma.ticket.updateMany({
    where: { id: ticketId, organizationId: user.organizationId },
    data: { status },
  });

  revalidatePath("/tickets");
}
