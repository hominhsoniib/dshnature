import crypto from 'node:crypto'
import path from 'node:path'

/**
 * Script CLI reset password admin — chạy LOCAL, KHÔNG phải API route public.
 * Dùng khi cần reset mật khẩu admin trên production mà không có DB console
 * trực tiếp. Payload local API đảm bảo hash password đúng chuẩn (không update
 * thẳng cột DB).
 *
 * Không thêm endpoint HTTP nào vào app — mật khẩu mới chỉ in ra terminal của
 * người chạy, không qua mạng, không ghi vào log file nào.
 *
 * Cách dùng:
 *   npm run reset:admin-password                        # tự tìm nếu chỉ có 1 admin, đọc DATABASE_URL/PAYLOAD_SECRET từ process.env/.env mặc định
 *   RESET_ADMIN_EMAIL=admin@dshnature.vn npm run reset:admin-password
 *
 *   # Nhắm vào DB khác (vd: production) mà KHÔNG cần tự set biến môi trường
 *   # qua shell (tránh lỗi PowerShell nuốt ký tự đặc biệt trong password khi
 *   # dùng $env:DATABASE_URL="..."): đặt các biến cần thiết (DATABASE_URL,
 *   # PAYLOAD_SECRET, ...) vào 1 file .env riêng (KHÔNG commit — xem
 *   # .gitignore) rồi trỏ script vào file đó qua --env-file:
 *   npm run reset:admin-password -- --env-file=.env.production-secret.local
 *
 *   # RESET_ADMIN_EMAIL cũng đọc được từ file --env-file đó luôn (thêm dòng
 *   # RESET_ADMIN_EMAIL=admin@dshnature.vn vào file .env.production-secret.local)
 *   # — không cần set thêm gì qua shell.
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

function generateStrongPassword(length = 16): string {
  const lower = 'abcdefghijkmnopqrstuvwxyz'
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const digits = '23456789'
  const special = '!@#$%^&*-_=+?'
  const all = lower + upper + digits + special

  const pick = (charset: string) => charset[crypto.randomInt(charset.length)]

  // Đảm bảo có đủ hoa/thường/số/ký tự đặc biệt, phần còn lại random từ toàn bộ bảng.
  const required = [pick(lower), pick(upper), pick(digits), pick(special)]
  const rest = Array.from({ length: Math.max(length - required.length, 0) }, () => pick(all))
  const chars = [...required, ...rest]

  // Fisher-Yates shuffle bằng crypto.randomInt (không dùng Math.random).
  for (let i = chars.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1)
    ;[chars[i], chars[j]] = [chars[j], chars[i]]
  }

  return chars.join('')
}

async function main() {
  // Phải load env TRƯỚC khi import payload/payload.config — payload.config.ts
  // đọc process.env.PAYLOAD_SECRET/DATABASE_URL ngay ở module scope (fail-fast
  // nếu thiếu), nên dùng dynamic import() ở đây thay vì static import để đảm
  // bảo --env-file có hiệu lực trước khi payload.config được load.
  await loadEnv()

  const { getPayload } = await import('payload')
  const { default: configPromise } = await import('../src/payload.config')

  const payload = await getPayload({ config: configPromise })

  const targetEmail = process.env.RESET_ADMIN_EMAIL

  const admins = await payload.find({
    collection: 'users',
    where: { role: { equals: 'admin' } },
    limit: 100,
  })

  if (admins.totalDocs === 0) {
    throw new Error(
      'Không tìm thấy user nào có role admin. Dùng `npm run seed:admin` để tạo admin mới nếu cần.',
    )
  }

  const candidateEmails = admins.docs.map((u) => u.email).join(', ')

  let target: (typeof admins.docs)[number]
  if (targetEmail) {
    const found = admins.docs.find((u) => u.email === targetEmail)
    if (!found) {
      throw new Error(
        `Không tìm thấy admin với email "${targetEmail}". Các admin hiện có: ${candidateEmails}`,
      )
    }
    target = found
  } else if (admins.totalDocs === 1) {
    target = admins.docs[0]
  } else {
    throw new Error(
      `Tìm thấy ${admins.totalDocs} admin, cần chỉ định rõ qua RESET_ADMIN_EMAIL. ` +
        `Các admin hiện có: ${candidateEmails}`,
    )
  }

  const newPassword = generateStrongPassword(16)

  await payload.update({
    collection: 'users',
    id: target.id,
    data: { password: newPassword },
  })

  console.log('[reset-admin-password] Đã reset mật khẩu thành công.')
  console.log(`  email:       ${target.email}`)
  console.log(`  newPassword: ${newPassword}`)
  console.log(
    '  Mật khẩu này KHÔNG được lưu lại ở đâu khác — copy ngay và đổi lại sau khi đăng nhập lần đầu.',
  )

  process.exit(0)
}

main().catch((err) => {
  console.error('[reset-admin-password] Lỗi:', err instanceof Error ? err.message : err)
  process.exit(1)
})
