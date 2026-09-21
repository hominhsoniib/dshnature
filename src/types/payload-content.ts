/**
 * Type thủ công cho SiteSettings/Banners — KHÔNG dùng payload-types.ts sinh tự
 * động vì `payload generate:types` đang lỗi thật với Node 24.17
 * (ERR_REQUIRE_ASYNC_MODULE khi require() @payloadcms/richtext-lexical — cùng
 * nguyên nhân đã ghi chú ở payload.config.ts cho `payload migrate:create`).
 * TODO: xoá file này, dùng lại payload-types.ts khi Payload/Node tương thích.
 */

export type SiteSettings = {
  companyName: string
  tagline?: string | null
  hotline?: string | null
  email?: string | null
  address?: string | null
  workingHours?: string | null
  mapEmbedUrl?: string | null
  socials?: {
    facebook?: string | null
    youtube?: string | null
    tiktok?: string | null
    zalo?: string | null
  } | null
  floatingContact?: {
    hotline?: string | null
    zaloUrl?: string | null
    messengerUrl?: string | null
  } | null
}

export type Banner = {
  id: string
  title: string
  subtitle?: string | null
  image: { url?: string | null; alt?: string | null } | string
  ctaLabel?: string | null
  ctaHref?: string | null
  order?: number | null
  isActive?: boolean | null
}
