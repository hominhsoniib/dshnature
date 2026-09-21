"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireDashboardUser } from "@/lib/require-dashboard-user";

export async function updateDealerRequestStatus(id: string, status: string): Promise<void> {
  await requireDashboardUser();

  if (!["pending", "contacted", "approved", "rejected"].includes(status)) {
    throw new Error("Trạng thái không hợp lệ");
  }

  await prisma.dealerRequest.update({ where: { id }, data: { status } });

  revalidatePath("/quan-ly/dai-ly");
  revalidatePath(`/quan-ly/dai-ly/${id}`);
  revalidatePath("/quan-ly");
}
