"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireDashboardUser } from "@/lib/require-dashboard-user";

export async function updateOrderStatus(id: string, status: string): Promise<void> {
  await requireDashboardUser();

  if (!["pending", "processing", "completed", "cancelled"].includes(status)) {
    throw new Error("Trạng thái đơn hàng không hợp lệ");
  }

  await prisma.order.update({ where: { id }, data: { orderStatus: status } });

  revalidatePath("/quan-ly/don-hang");
  revalidatePath(`/quan-ly/don-hang/${id}`);
  revalidatePath("/quan-ly");
}

export async function updatePaymentStatus(id: string, status: string): Promise<void> {
  await requireDashboardUser();

  if (!["pending", "paid", "failed"].includes(status)) {
    throw new Error("Trạng thái thanh toán không hợp lệ");
  }

  await prisma.order.update({ where: { id }, data: { paymentStatus: status } });

  revalidatePath("/quan-ly/don-hang");
  revalidatePath(`/quan-ly/don-hang/${id}`);
  revalidatePath("/quan-ly");
}
