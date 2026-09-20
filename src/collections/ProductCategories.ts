import type { CollectionConfig } from 'payload'

import { isAdmin } from '@/access/isAdmin'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'

export const ProductCategories: CollectionConfig = {
  slug: 'product-categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      label: 'Tên danh mục sản phẩm',
      type: 'text',
      required: true,
      admin: { width: '50%' },
    },
    {
      name: 'slug',
      label: 'Đường dẫn (Slug)',
      type: 'text',
      required: true,
      unique: true,
      admin: { width: '50%' },
    },
  ],
}
