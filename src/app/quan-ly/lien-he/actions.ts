"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireDashboardUser } from "@/lib/require-dashboard-user";

export async function updateContactMessageStatus(id: string, status: string): Promise<void> {
  await requireDashboardUser();

  if (!["unread", "read", "replied"].includes(status)) {
    throw new Error("Trạng thái không hợp lệ");
  }

  await prisma.contactMessage.update({ where: { id }, data: { status } });

  revalidatePath("/quan-ly/lien-he");
  revalidatePath(`/quan-ly/lien-he/${id}`);
  revalidatePath("/quan-ly");
}
