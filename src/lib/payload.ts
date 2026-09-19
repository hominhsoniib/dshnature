import { getPayload } from 'payload'

import config from '@payload-config'

/**
 * Payload Local API — dùng trong Server Component để query thẳng DB (nhanh
 * hơn REST/GraphQL, khuyến nghị chính thức của Payload cho Next.js App
 * Router). getPayload() tự cache theo config nên gọi nhiều lần không tốn kém.
 */
export async function getPayloadClient() {
  return getPayload({ config })
}
