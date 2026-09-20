import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { buildStoragePathData } from '@payloadcms/plugin-cloud-storage/utilities'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Articles } from './collections/Articles'
import { Banners } from './collections/Banners'
import { Media } from './collections/Media'
import { ProductCategories } from './collections/ProductCategories'
import { Products } from './collections/Products'
import { SiteSettings } from './collections/SiteSettings'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * Build URL public trực tiếp tới R2 (vd https://pub-xxxx.r2.dev/<key>) thay
 * vì mặc định của Payload (proxy qua /api/media/file/<filename>, xem
 * @payloadcms/plugin-cloud-storage/dist/hooks/afterRead.js — khi không truyền
 * generateFileURL, Payload tự phục vụ file qua route riêng của nó, không cần
 * bucket public). Bucket R2 đã bật Public Access (r2.dev) — dùng
 * buildStoragePathData (chính hàm nội bộ generateURL.js của
 * @payloadcms/storage-s3 dùng) để đảm bảo key khớp đúng file thật đã upload,
 * không tự đoán cách ghép prefix/filename.
 *
 * Đánh đổi: bỏ qua hoàn toàn access control của Payload cho Media — ai có URL
 * đều xem trực tiếp được qua R2, không phụ thuộc access.read của collection.
 * Chấp nhận vì Media.access.read đã là public (`() => true`) từ đầu.
 */
function generateR2PublicFileURL({ filename, prefix }: { filename: string; prefix?: string }): string {
  const { storageFilePath } = buildStoragePathData({ docPrefix: prefix, filename })
  const dir = path.posix.dirname(storageFilePath)
  const encodedFilename = encodeURIComponent(path.posix.basename(storageFilePath))
  const fileKey = dir === '.' ? encodedFilename : path.posix.join(dir, encodedFilename)
  return `${process.env.R2_PUBLIC_URL}/${fileKey}`
}

// Fail-fast: không cho phép app khởi động với secret ký session suy đoán
// được. Trước đây có fallback hardcoded ('dsh-nature-fallback-payload-secret-key-2026')
// — đã bị coi là lỗ hổng CRITICAL vì secret đó nằm trong git history công khai
// (xem SECURITY_AUDIT_REPORT.md / SECURITY_FIXES_APPLIED.md).
if (!process.env.PAYLOAD_SECRET) {
  throw new Error(
    '[Payload] Thiếu biến môi trường PAYLOAD_SECRET. Tạo giá trị ngẫu nhiên đủ dài ' +
      '(vd: openssl rand -base64 32) và set vào .env trước khi khởi động app — ' +
      'không được chạy với secret cố định/suy đoán được.',
  )
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname, 'app', '(payload)', 'admin'),
    },
  },
  // Toàn bộ các Collection quản lý nội dung không cần code (No-Code Admin)
  collections: [Users, Media, Banners, ProductCategories, Products, Articles],
  // Global (1 bản ghi duy nhất) — thông tin công ty cho Header/Footer/FloatingContact
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    push: true,
  }),
  sharp,
  onInit: async (payload) => {
    // KHÔNG tự tạo admin ở đây nữa — tạo admin bằng hardcoded password mỗi lần
    // server start là lỗ hổng CRITICAL (mật khẩu nằm trong git history công
    // khai). Chỉ cảnh báo, việc tạo admin đầu tiên chuyển sang
    // `scripts/seed-admin.ts` (npm run seed:admin) hoặc màn "Create first user"
    // của Payload Admin UI.
    try {
      const existingUsers = await payload.find({
        collection: 'users',
        limit: 1,
      })
      if (existingUsers.totalDocs === 0) {
        console.warn(
          '[Payload] Chưa có user admin nào trong hệ thống. Chạy `npm run seed:admin` ' +
            '(xem scripts/seed-admin.ts) hoặc mở /admin để tạo user đầu tiên.',
        )
      }
    } catch (err) {
      console.error('[Payload] Error checking existing admin users:', err)
    }
  },
  plugins: [
    s3Storage({
      collections: {
        // Fallback về true (proxy qua Payload) nếu R2_PUBLIC_URL chưa set —
        // môi trường dev chưa bật Public Access trên R2 vẫn chạy được, không
        // crash. Set R2_PUBLIC_URL để chuyển sang URL public trực tiếp.
        media: process.env.R2_PUBLIC_URL
          ? { generateFileURL: generateR2PublicFileURL }
          : true,
      },
      bucket: process.env.R2_BUCKET || '',
      config: {
        endpoint: process.env.R2_ENDPOINT,
        region: 'auto',
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
        },
        forcePathStyle: true,
      },
    }),
  ],
})
