import type { CollectionConfig } from 'payload'

import { isAdmin } from '@/access/isAdmin'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'

/**
 * Hero slider ở section 01 trang chủ (brief mục 7: "slider 3-4 banner").
 * Không phụ thuộc business logic của phase sau nên build thật ở Phase 1,
 * khác với products/articles (hoãn đúng Phase 2/4 theo mục 13).
 */
export const Banners: CollectionConfig = {
  slug: 'banners',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'isActive', 'order'],
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'title',
      label: 'Tiêu đề Banner',
      type: 'text',
      required: true,
      admin: { width: '50%' },
    },
    {
      name: 'subtitle',
      label: 'Phụ đề Banner',
      type: 'text',
      admin: { width: '50%' },
    },
    {
      name: 'ctaLabel',
      label: 'Nút bấm CTA (VD: Khám phá ngay)',
      type: 'text',
      admin: { width: '35%' },
    },
    {
      name: 'ctaHref',
      label: 'Đường dẫn liên kết (URL)',
      type: 'text',
      admin: { width: '35%' },
    },
    {
      name: 'order',
      label: 'Thứ tự ưu tiên',
      type: 'number',
      defaultValue: 0,
      admin: { width: '15%' },
    },
    {
      name: 'isActive',
      label: 'Kích hoạt hiển thị',
      type: 'checkbox',
      defaultValue: true,
      admin: { width: '15%' },
    },
    {
      name: 'image',
      label: 'Hình ảnh Banner (Nền / Hero)',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
}
