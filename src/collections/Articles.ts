import type { CollectionConfig } from 'payload'

import { isAdmin } from '@/access/isAdmin'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'category', 'createdAt'],
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
      label: 'Tiêu đề bài viết',
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
    {
      name: 'type',
      label: 'Loại nội dung',
      type: 'select',
      options: [
        { label: 'Kiến thức sức khỏe', value: 'healthKnowledge' },
        { label: 'Blog tin tức', value: 'blog' },
      ],
      defaultValue: 'healthKnowledge',
      required: true,
      admin: { width: '33.33%' },
    },
    {
      name: 'category',
      label: 'Chuyên mục bài viết',
      type: 'text',
      required: true,
      admin: { width: '33.33%' },
    },
    {
      name: 'author',
      label: 'Tác giả',
      type: 'text',
      defaultValue: 'Dược sĩ DSH Nature',
      admin: { width: '33.33%' },
    },
    {
      name: 'featuredImage',
      label: 'Ảnh đại diện bài viết',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'excerpt',
      label: 'Tóm tắt bài viết (Excerpt)',
      type: 'textarea',
    },
    {
      name: 'content',
      label: 'Nội dung chi tiết bài viết',
      type: 'richText',
    },
  ],
}
