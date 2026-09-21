import type { CollectionConfig } from 'payload'

import { isAdmin } from '@/access/isAdmin'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'

const FORBIDDEN_WORDS = ['chữa bệnh', 'điều trị', 'trị dứt điểm', 'thay thế thuốc']

function validateNoForbiddenWords(value: string | undefined | null) {
  if (!value) return
  const lower = value.toLowerCase()
  for (const word of FORBIDDEN_WORDS) {
    if (lower.includes(word)) {
      throw new Error(
        `Nội dung chứa từ khóa vi phạm quy định quảng cáo TPCN (Nghị định 15/2018/NĐ-CP): "${word}". Vui lòng sửa lại bằng các từ an toàn như "hỗ trợ", "giúp giảm", "chăm sóc"...`
      )
    }
  }
}

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

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'price', 'slug'],
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
        if (data?.name && (!data.slug || data.slug.trim() === '')) {
          data.slug = slugify(data.name)
        } else if (data?.slug) {
          data.slug = slugify(data.slug)
        }
        if (data?.tabs) {
          validateNoForbiddenWords(data.tabs.description)
          validateNoForbiddenWords(data.tabs.usage)
        }
        if (data?.shortDescription) {
          validateNoForbiddenWords(data.shortDescription)
        }
        return data
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Thông tin cơ bản',
          fields: [
            {
              name: 'name',
              label: 'Tên sản phẩm',
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
                description: 'Tự động tạo slug chuẩn SEO từ Tên sản phẩm nếu để trống (vd: xuong-khop).',
              },
            },
            {
              name: 'category',
              label: 'Danh mục sản phẩm',
              type: 'relationship',
              relationTo: 'product-categories',
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'price',
              label: 'Giá bán (VNĐ)',
              type: 'number',
              required: true,
              admin: { width: '25%' },
            },
            {
              name: 'originalPrice',
              label: 'Giá gốc / Chưa giảm (VNĐ)',
              type: 'number',
              admin: { width: '25%' },
            },
            {
              name: 'shortDescription',
              label: 'Mô tả ngắn (Hiển thị danh sách & card)',
              type: 'textarea',
              required: true,
            },
            {
              name: 'images',
              label: 'Bộ sưu tập hình ảnh sản phẩm',
              type: 'array',
              fields: [
                {
                  name: 'image',
                  label: 'Hình ảnh',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Chi tiết nội dung sản phẩm',
          fields: [
            {
              name: 'tabs',
              label: 'Các thông tin chi tiết (Tabs SP)',
              type: 'group',
              fields: [
                { name: 'description', label: '1. Mô tả chi tiết', type: 'textarea' },
                { name: 'ingredients', label: '2. Thành phần chính', type: 'textarea' },
                { name: 'usage', label: '3. Công dụng sản phẩm', type: 'textarea' },
                { name: 'targetUsers', label: '4. Đối tượng sử dụng', type: 'textarea' },
                { name: 'howToUse', label: '5. Hướng dẫn sử dụng', type: 'textarea' },
                { name: 'specification', label: '6. Quy cách đóng gói', type: 'textarea' },
                { name: 'storage', label: '7. Hướng dẫn bảo quản', type: 'textarea' },
                { name: 'productDossier', label: '8. Hồ sơ công bố / Giấy phép', type: 'textarea' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
