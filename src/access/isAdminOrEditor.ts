import type { Access } from 'payload'

/**
 * User Payload đã đăng nhập với role 'admin' hoặc 'editor'. Dùng cho create/update
 * trên các collection nội dung (Products, Articles, Banners, ...) — xem
 * SECURITY_AUDIT_REPORT.md.
 */
export const isAdminOrEditor: Access = ({ req: { user } }) =>
  Boolean(user) && (user?.role === 'admin' || user?.role === 'editor')
