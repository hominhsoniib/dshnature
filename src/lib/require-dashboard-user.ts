import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getPayloadClient } from "@/lib/payload";

/**
 * Xác thực session Payload (cookie /admin) cho dashboard nội bộ /quan-ly —
 * cùng chuẩn role với src/access/isAdminOrEditor.ts (chỉ admin/editor đã
 * đăng nhập /admin mới được xem). Dùng ở layout.tsx (gate cả subtree) VÀ
 * bên trong mỗi Server Action cập nhật status — action có thể bị gọi độc
 * lập với page render nên cần tự kiểm tra lại, không chỉ dựa vào layout.
 */
export async function requireDashboardUser() {
  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: await headers() });
  const role = (user as { role?: string } | null)?.role;
  const isAllowed = Boolean(user) && (role === "admin" || role === "editor");

  if (!isAllowed) {
    redirect("/admin/login");
  }

  return user;
}
