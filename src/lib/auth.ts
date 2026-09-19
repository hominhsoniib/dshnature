import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

/**
 * Auth KHÁCH HÀNG (NextAuth) — hoàn toàn tách biệt với Payload built-in auth
 * (dùng cho /admin, xem src/collections/Users.ts). Theo PROJECT_BRIEF.md mục 3.
 *
 * PHASE 0: chỉ setup NextAuth + provider Google (hoạt động độc lập, không cần
 * bảng DB). Provider Email/Password (Credentials) còn là STUB — brief xếp
 * "Customer Account (NextAuth)" vào PHASE 3, khi đó bảng `customers` (Prisma)
 * mới được định nghĩa để có nơi tra cứu/verify mật khẩu thật. Không tự suy diễn
 * field bảng customers ở bước setup này.
 */
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Email và mật khẩu',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mật khẩu', type: 'password' },
      },
      // TODO(Phase 3): tra cứu bảng `customers` (Prisma) theo email, verify
      // password hash (bcrypt/argon2). Bảng customers chưa tồn tại ở Phase 0.
      authorize: async () => {
        throw new Error(
          'Đăng nhập email/mật khẩu chưa khả dụng — sẽ hoàn thiện ở PHASE 3 (Customer Account) khi bảng customers được định nghĩa.',
        )
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    // TODO(Phase 3): trỏ đúng trang đăng nhập tuỳ chỉnh khi /tai-khoan có UI thật.
    signIn: '/tai-khoan/dang-nhap',
  },
}
