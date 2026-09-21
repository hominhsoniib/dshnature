import type { GlobalConfig } from 'payload'

import { isAdminOrEditor } from '@/access/isAdminOrEditor'

/**
 * Global (không phải collection — chỉ 1 bản ghi duy nhất) chứa thông tin công ty
 * dùng chung cho Header/Footer/FloatingContact (Phase 1) — brief mục 10:
 * "global site-settings (companyName/hotline/email/address/socials/floatingContact)".
 * Field đã được brief nêu rõ tên, không suy diễn thêm.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Thông tin Website',
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  hooks: {
    afterChange: [
      async () => {
        try {
          const { revalidatePath } = await import('next/cache')
          revalidatePath('/', 'layout')
          revalidatePath('/lien-he')
        } catch {
          // Ignore outside Next.js request lifecycle
        }
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Thông tin thương hiệu & Liên hệ',
          fields: [
            {
              name: 'companyName',
              label: 'Tên công ty',
              type: 'text',
              required: false,
              defaultValue: 'CÔNG TY CỔ PHẦN DSH NATURE',
              admin: {
                width: '50%',
              },
            },
            {
              name: 'tagline',
              label: 'Khẩu hiệu (Tagline)',
              type: 'text',
              defaultValue: 'ĐỒNG HÀNH CÙNG SỨC KHỎE GIA ĐÌNH',
              admin: {
                width: '50%',
              },
            },
            {
              name: 'hotline',
              label: 'Hotline chính',
              type: 'text',
              admin: {
                width: '50%',
              },
            },
            {
              name: 'email',
              label: 'Email liên hệ',
              type: 'email',
              admin: {
                width: '50%',
              },
            },
            {
              name: 'address',
              label: 'Địa chỉ trụ sở',
              type: 'textarea',
            },
            {
              name: 'workingHours',
              label: 'Giờ làm việc',
              type: 'text',
              defaultValue: 'Thứ 2 - Thứ 7: 08:00 - 17:30',
              admin: {
                description: 'Hiển thị ở trang Liên hệ.',
              },
            },
            {
              name: 'mapEmbedUrl',
              label: 'URL bản đồ nhúng (Google Maps)',
              type: 'text',
              admin: {
                description:
                  'Vào Google Maps → Chia sẻ → Nhúng bản đồ → Sao chép URL trong thuộc tính src của thẻ <iframe> rồi dán vào đây. Để trống sẽ dùng bản đồ mặc định.',
              },
            },
          ],
        },
        {
          label: 'Mạng xã hội (Socials)',
          fields: [
            {
              name: 'socials',
              label: 'Liên kết Mạng xã hội',
              type: 'group',
              fields: [
                {
                  name: 'facebook',
                  label: 'Facebook URL',
                  type: 'text',
                  admin: { width: '50%' },
                },
                {
                  name: 'youtube',
                  label: 'Youtube URL',
                  type: 'text',
                  admin: { width: '50%' },
                },
                {
                  name: 'tiktok',
                  label: 'TikTok URL',
                  type: 'text',
                  admin: { width: '50%' },
                },
                {
                  name: 'zalo',
                  label: 'Zalo OA / URL',
                  type: 'text',
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
        {
          label: 'Floating Contact Widget',
          fields: [
            {
              name: 'floatingContact',
              label: 'Nút liên hệ nhanh (Góc màn hình)',
              type: 'group',
              fields: [
                {
                  name: 'hotline',
                  label: 'Hotline hiển thị',
                  type: 'text',
                  admin: { width: '33.33%' },
                },
                {
                  name: 'zaloUrl',
                  label: 'Zalo URL',
                  type: 'text',
                  admin: { width: '33.33%' },
                },
                {
                  name: 'messengerUrl',
                  label: 'Messenger URL',
                  type: 'text',
                  admin: { width: '33.33%' },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

