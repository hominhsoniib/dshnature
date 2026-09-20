import crypto from 'node:crypto'
import path from 'node:path'

/**
 * Script CLI để tạo user admin đầu tiên — thay cho endpoint API cũ
 * `/api/seed-admin` (đã bị xoá, xem SECURITY_FIXES_APPLIED.md). Chạy cục bộ
 * hoặc trong pipeline seed, KHÔNG deploy như một API route public.
 *
 * Cách dùng:
 *   SEED_ADMIN_EMAIL=admin@dshnature.vn npm run seed:admin
 *   # hoặc set thêm SEED_ADMIN_PASSWORD để chỉ định mật khẩu, không thì script
 *   # tự sinh mật khẩu ngẫu nhiên và in ra (chỉ hiện đúng 1 lần).
 *
 *   # Nhắm vào DB khác (vd: production) mà KHÔNG cần tự set biến môi trường
 *   # qua shell (tránh lỗi PowerShell nuốt ký tự đặc biệt trong password khi
 *   # dùng $env:DATABASE_URL="..."): đặt các biến cần thiết (DATABASE_URL,
 *   # PAYLOAD_SECRET, SEED_ADMIN_EMAIL, ...) vào 1 file .env riêng (KHÔNG
 *   # commit — xem .gitignore) rồi trỏ script vào file đó qua --env-file:
 *   npm run seed:admin -- --env-file=.env.production-secret.local
 *
 *   (Không truyền --env-file thì hành vi giữ nguyên như trước: đọc
 *   process.env / .env mặc định ở thư mục gốc — không breaking change.)
 */

function parseEnvFileArg(argv: string[]): string | undefined {
  const prefix = '--env-file='
  for (const arg of argv) {
    if (arg.startsWith(prefix)) {
      return arg.slice(prefix.length)
    }
  }
  return undefined
}

async function loadEnv() {
  const envFileArg = parseEnvFileArg(process.argv.slice(2))
  const { config } = await import('dotenv')

  if (!envFileArg) {
    // Tương đương `import 'dotenv/config'` (load .env mặc định ở cwd) nhưng
    // gọi trực tiếp API có type thay vì import module side-effect không có
    // declaration — tránh lỗi `tsc` "implicitly has an any type".
    config()
    return
  }

  const resolvedPath = path.resolve(process.cwd(), envFileArg)
  const result = config({ path: resolvedPath, override: true })

  if (result.error) {
    throw new Error(`Không đọc được --env-file="${envFileArg}" (${resolvedPath}): ${result.error.message}`)
  }

  console.log(
    `[env] Đã load biến môi trường từ ${resolvedPath} (ghi đè lên process.env/.env mặc định).`,
  )
}

async function main() {
  // Phải load env TRƯỚC khi import payload/payload.config — payload.config.ts
  // đọc process.env.PAYLOAD_SECRET/DATABASE_URL ngay ở module scope (fail-fast
  // nếu thiếu), nên dùng dynamic import() ở đây thay vì static import để đảm
  // bảo --env-file có hiệu lực trước khi payload.config được load.
  await loadEnv()

  const email = process.env.SEED_ADMIN_EMAIL

  if (!email) {
    throw new Error(
      'Thiếu SEED_ADMIN_EMAIL. Ví dụ: SEED_ADMIN_EMAIL=admin@dshnature.vn npm run seed:admin',
    )
  }

  const generatedPassword = crypto.randomBytes(18).toString('base64url')
  const password = process.env.SEED_ADMIN_PASSWORD ?? generatedPassword

  const { getPayload } = await import('payload')
  const { default: configPromise } = await import('../src/payload.config')

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
