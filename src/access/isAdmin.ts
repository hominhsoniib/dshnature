import type { Access } from 'payload'

/**
 * Chỉ user Payload đã đăng nhập với role 'admin' mới pass. Dùng cho các thao
 * tác nhạy cảm (xoá, đổi role, quản trị Users) — xem SECURITY_AUDIT_REPORT.md.
 */
export const isAdmin: Access = ({ req: { user } }) => Boolean(user) && user?.role === 'admin'
