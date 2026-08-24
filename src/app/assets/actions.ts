"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { AssetStatus } from "@/generated/prisma/enums";
import { requireUser } from "@/lib/auth";

export async function createAsset(formData: FormData) {
  const user = await requireUser();

  const name = String(formData.get("name") ?? "").trim();
  const type = String(formData.get("type") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!name || !type) {
    throw new Error("Name and type are required.");
  }

  await prisma.asset.create({
    data: {
      name,
      type,
      notes: notes || null,
      organizationId: user.organizationId,
    },
  });

  revalidatePath("/assets");
}

export async function updateAssetStatus(assetId: string, status: AssetStatus) {
  const user = await requireUser();

  await prisma.asset.updateMany({
    where: { id: assetId, organizationId: user.organizationId },
    data: { status },
  });

  revalidatePath("/assets");
}
