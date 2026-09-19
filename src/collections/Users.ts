import type { CollectionConfig } from 'payload'

/**
 * Auth built-in của Payload — CHỈ dành cho người vận hành nội dung đăng nhập
 * vào /admin (CMS). Đây KHÔNG phải nơi lưu tài khoản khách hàng (khách hàng
 * dùng NextAuth + bảng `customers` riêng ở Prisma) và cũng KHÔNG phải nơi lưu
 * nhân sự back-office custom (`users/roles/permissions` ở Prisma, xem
 * PROJECT_BRIEF.md mục 4) — hai hệ thống auth tách biệt hoàn toàn theo đúng
 * chốt kiến trúc, collection này chỉ phục vụ đăng nhập Payload Admin UI.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [],
}
