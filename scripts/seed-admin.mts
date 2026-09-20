import 'dotenv/config'
import crypto from 'node:crypto'

import { getPayload } from 'payload'

import configPromise from '../src/payload.config'

/**
 * Script CLI để tạo user admin đầu tiên — thay cho endpoint API cũ
 * `/api/seed-admin` (đã bị xoá, xem SECURITY_FIXES_APPLIED.md). Chạy cục bộ
 * hoặc trong pipeline seed, KHÔNG deploy như một API route public.
 *
 * Cách dùng:
 *   SEED_ADMIN_EMAIL=admin@dshnature.vn npm run seed:admin
 *   # hoặc set thêm SEED_ADMIN_PASSWORD để chỉ định mật khẩu, không thì script
 *   # tự sinh mật khẩu ngẫu nhiên và in ra (chỉ hiện đúng 1 lần).
 */
async function main() {
  const email = process.env.SEED_ADMIN_EMAIL

  if (!email) {
    throw new Error(
      'Thiếu SEED_ADMIN_EMAIL. Ví dụ: SEED_ADMIN_EMAIL=admin@dshnature.vn npm run seed:admin',
    )
  }

  const generatedPassword = crypto.randomBytes(18).toString('base64url')
  const password = process.env.SEED_ADMIN_PASSWORD ?? generatedPassword

  const payload = await getPayload({ config: configPromise })

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })

  if (existing.totalDocs > 0) {
    console.log(
      `[seed-admin] User ${email} đã tồn tại — không tạo lại. Đổi mật khẩu qua /admin nếu cần.`,
    )
    process.exit(0)
  }

  await payload.create({
    collection: 'users',
    data: {
      email,
      password,
      role: 'admin',
    },
  })

  console.log('[seed-admin] Đã tạo admin mới thành công.')
  console.log(`  email:    ${email}`)
  if (process.env.SEED_ADMIN_PASSWORD) {
    console.log('  password: (lấy từ SEED_ADMIN_PASSWORD trong env)')
  } else {
    console.log(`  password: ${password}`)
    console.log(
      '  Mật khẩu này được sinh ngẫu nhiên, KHÔNG được lưu lại ở đâu khác — copy ngay và đổi lại sau khi đăng nhập lần đầu.',
    )
  }

  process.exit(0)
}

main().catch((err) => {
  console.error('[seed-admin] Lỗi khi tạo admin:', err)
  process.exit(1)
})
