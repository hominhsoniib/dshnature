import type { CollectionConfig } from 'payload'

import { isAdmin } from '@/access/isAdmin'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'

function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

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
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data?.title && (!data.slug || data.slug.trim() === '')) {
          data.slug = slugify(data.title)
        } else if (data?.slug) {
          data.slug = slugify(data.slug)
        }
        return data
      },
    ],
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
      admin: {
        width: '50%',
        description: 'Tự động tạo từ Tiêu đề bài viết nếu để trống.',
      },
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
