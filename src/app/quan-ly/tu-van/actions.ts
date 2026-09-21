"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireDashboardUser } from "@/lib/require-dashboard-user";

export async function updateConsultationStatus(id: string, status: string): Promise<void> {
  await requireDashboardUser();

  if (!["pending", "advised", "closed"].includes(status)) {
    throw new Error("Trạng thái không hợp lệ");
  }

  await prisma.consultationRequest.update({ where: { id }, data: { status } });

  revalidatePath("/quan-ly/tu-van");
  revalidatePath(`/quan-ly/tu-van/${id}`);
  revalidatePath("/quan-ly");
}
