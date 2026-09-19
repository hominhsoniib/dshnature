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
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'product-categories',
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
    {
      name: 'originalPrice',
      type: 'number',
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'tabs',
      type: 'group',
      fields: [
        { name: 'description', type: 'textarea' },
        { name: 'ingredients', type: 'textarea' },
        { name: 'usage', type: 'textarea' },
        { name: 'targetUsers', type: 'textarea' },
        { name: 'howToUse', type: 'textarea' },
        { name: 'specification', type: 'textarea' },
        { name: 'storage', type: 'textarea' },
        { name: 'productDossier', type: 'textarea' },
      ],
    },
  ],
}
