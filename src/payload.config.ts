import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { Banners } from './collections/Banners'
import { Media } from './collections/Media'
import { SiteSettings } from './collections/SiteSettings'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname, 'app', '(payload)', 'admin'),
    },
  },
  // PHASE 1: thêm Banners (Hero slider, section 01 trang chủ) — pattern đơn
  // giản, không phụ thuộc business logic phase sau. Products/Articles/... vẫn
  // hoãn đúng PHASE 2/4 theo PROJECT_BRIEF.md mục 13 (dùng mock data tạm, xem
  // src/features/home/mock-data.ts).
  collections: [Users, Media, Banners],
  // Global (1 bản ghi duy nhất) — thông tin công ty cho Header/Footer/
  // FloatingContact, brief mục 10.
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    // TẠM THỜI push:true (Phase 0) — lý tưởng nên push:false + migration tường
    // minh (an toàn hơn cho production), nhưng `payload migrate:create` đang lỗi
    // thật với Node 24.17 (ERR_REQUIRE_ASYNC_MODULE khi require() gói
    // @payloadcms/richtext-lexical — gói này có top-level await, không thể
    // require() đồng bộ được). Đã thử --use-swc và --disable-transpile đều lỗi
    // khác (thiếu @swc-node/register / mất khả năng resolve extension .ts).
    // TODO: quay lại push:false + migration thật khi Payload/Node tương thích
    // hơn, hoặc trước khi lên production thật.
    push: true,
  }),
  sharp,
  // Cloudflare R2 qua @payloadcms/storage-s3 (R2 tương thích S3 API) — brief
  // mục 10. Biến môi trường xem .env.example.
  plugins: [
    s3Storage({
      collections: {
        media: true,
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
