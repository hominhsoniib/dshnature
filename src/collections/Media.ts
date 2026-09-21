import type { CollectionConfig } from 'payload'

import { isAdmin } from '@/access/isAdmin'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'

/**
 * Collection upload dùng chung cho mọi ảnh/file quản lý qua Payload (banner,
 * ảnh sản phẩm, ảnh bài viết...). File thực tế lưu trên Cloudflare R2 qua
 * plugin @payloadcms/storage-s3 (cấu hình ở payload.config.ts) — collection
 * này chỉ lưu metadata, không lưu file trực tiếp trên server.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    adminThumbnail: 'thumbnail',
    imageSizes: [],
  },
}
