import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
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
  secret: process.env.PAYLOAD_SECRET || 'dsh-nature-fallback-payload-secret-key-2026',
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
    try {
      const existingUsers = await payload.find({
        collection: 'users',
        where: {
          email: {
            equals: 'admin@dshnature.vn',
          },
        },
      })
      if (existingUsers.totalDocs === 0) {
        await payload.create({
          collection: 'users',
          data: {
            email: 'admin@dshnature.vn',
            password: 'Admin@dshnature2026',
          },
        })
        console.log('[Payload] Auto-created admin user: admin@dshnature.vn')
      }
    } catch (err) {
      console.error('[Payload] Error checking/creating admin user:', err)
    }
  },
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
