import type { NextAuthOptions } from 'next-auth'
import type { Provider } from 'next-auth/providers/index'
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
 *
 * Google provider chỉ bật khi có đủ GOOGLE_CLIENT_ID/SECRET — chưa có key thật
 * (đang chờ) thì bỏ qua provider này thay vì để NextAuth khởi tạo với
 * clientId/secret rỗng (crash lúc gọi /api/auth/signin/google).
 */
// Fail-fast: NextAuth tự sinh secret tạm cho development (kèm cảnh báo) nếu
// thiếu NEXTAUTH_SECRET, nhưng ở production thì bắt buộc — thiếu sẽ khiến JWT
// session ký/verify không an toàn (hoặc lỗi mơ hồ ở lần request đầu tiên thay
// vì báo rõ ngay lúc khởi động).
if (process.env.NODE_ENV === 'production' && !process.env.NEXTAUTH_SECRET) {
  throw new Error(
    'Missing required env var: NEXTAUTH_SECRET (bắt buộc ở production — tạo ngẫu nhiên, đủ dài, vd: openssl rand -base64 32).',
  )
}

const providers: Provider[] = []

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  )
}

providers.push(
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
)

export const authOptions: NextAuthOptions = {
  providers,
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    // TODO(Phase 3): trỏ đúng trang đăng nhập tuỳ chỉnh khi /tai-khoan có UI thật.
    signIn: '/tai-khoan/dang-nhap',
  },
}
