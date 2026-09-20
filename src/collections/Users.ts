import type { CollectionConfig } from 'payload'

import { isAdmin } from '@/access/isAdmin'

/**
 * Auth built-in của Payload — CHỈ dành cho người vận hành nội dung đăng nhập
 * vào /admin (CMS). Đây KHÔNG phải nơi lưu tài khoản khách hàng (khách hàng
 * dùng NextAuth + bảng `customers` riêng ở Prisma) và cũng KHÔNG phải nơi lưu
 * nhân sự back-office custom (`users/roles/permissions` ở Prisma, xem
 * PROJECT_BRIEF.md mục 4) — hai hệ thống auth tách biệt hoàn toàn theo đúng
 * chốt kiến trúc, collection này chỉ phục vụ đăng nhập Payload Admin UI.
 *
 * KHÔNG có đăng ký công khai: collection này không phải nơi khách hàng tự tạo
 * tài khoản, nên `create` chỉ cho phép user admin đã đăng nhập gọi (bootstrap
 * user admin đầu tiên vẫn hoạt động qua màn "Create first user" của Payload —
 * cơ chế đó tự bỏ qua access control khi collection chưa có document nào —
 * hoặc qua `scripts/seed-admin.ts`, xem SECURITY_FIXES_APPLIED.md).
 */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Tài khoản Admin',
    plural: 'Tài khoản Admin (Đổi MK)',
  },
  admin: {
    useAsTitle: 'email',
    group: 'Tài khoản',
  },
  auth: true,
  access: {
    create: isAdmin,
    read: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return { id: { equals: user.id } }
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return { id: { equals: user.id } }
    },
    delete: isAdmin,
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      defaultValue: 'editor',
      required: true,
      access: {
        // Chặn editor tự nâng quyền cho chính mình — chỉ admin đổi được role.
        // (Field-level access chỉ nhận boolean, không nhận `Where` như Access
        // ở cấp collection, nên viết inline thay vì tái dùng `isAdmin`.)
        update: ({ req: { user } }) => Boolean(user) && user?.role === 'admin',
      },
    },
  ],
}
