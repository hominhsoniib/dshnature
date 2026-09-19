import type { GlobalConfig } from 'payload'

/**
 * Global (không phải collection — chỉ 1 bản ghi duy nhất) chứa thông tin công ty
 * dùng chung cho Header/Footer/FloatingContact (Phase 1) — brief mục 10:
 * "global site-settings (companyName/hotline/email/address/socials/floatingContact)".
 * Field đã được brief nêu rõ tên, không suy diễn thêm.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'companyName',
      type: 'text',
      required: true,
      defaultValue: 'CÔNG TY CỔ PHẦN DSH NATURE',
    },
    {
      name: 'tagline',
      type: 'text',
      // Brief mục 0: brand message đã chốt.
      defaultValue: 'ĐỒNG HÀNH CÙNG SỨC KHỎE GIA ĐÌNH',
    },
    {
      name: 'hotline',
      type: 'text',
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'address',
      type: 'textarea',
    },
    {
      name: 'socials',
      type: 'group',
      fields: [
        { name: 'facebook', type: 'text' },
        { name: 'youtube', type: 'text' },
        { name: 'tiktok', type: 'text' },
        { name: 'zalo', type: 'text' },
      ],
    },
    {
      name: 'floatingContact',
      type: 'group',
      // Brief mục 7: "Floating contact: Hotline/Zalo/Messenger".
      fields: [
        { name: 'hotline', type: 'text' },
        { name: 'zaloUrl', type: 'text' },
        { name: 'messengerUrl', type: 'text' },
      ],
    },
  ],
}
