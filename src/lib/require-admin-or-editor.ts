import type { NextRequest } from "next/server";
import { getPayloadClient } from "@/lib/payload";

/**
 * Xác thực session Payload (cookie /admin) cho các Route Handler custom nằm
 * ngoài collection access control — dùng cho /api/upload, /api/files/[key]
 * (ghi/xoá file trực tiếp trên R2 qua r2-client.ts, không qua Media
 * collection nên không tự động có access control của Payload). Cùng chuẩn
 * role với src/access/isAdminOrEditor.ts — chỉ admin/editor đã đăng nhập
 * /admin mới được phép, tránh lỗ hổng upload/xoá file không xác thực.
 */
export async function isRequestFromAdminOrEditor(request: NextRequest): Promise<boolean> {
  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: request.headers });
  const role = (user as { role?: string } | null)?.role;
  return Boolean(user) && (role === "admin" || role === "editor");
}
