/**
 * View model đã được chuẩn hoá từ collection `products` (Payload) — tách khỏi
 * shape gốc của Payload (relationship/upload object) để component UI không
 * cần biết gì về Payload. Mapping thật nằm ở `src/lib/queries/products.ts`.
 */
export type ProductCategorySummary = {
  slug: string
  name: string
}

export type ProductTabs = {
  description: string
  ingredients: string
  usage: string
  targetUsers: string
  howToUse: string
  specification: string
  storage: string
  productDossier: string
}

export type ProductViewModel = {
  slug: string
  name: string
  categorySlug: string
  categoryName: string
  price: number
  originalPrice?: number
  shortDescription: string
  images: string[]
  tabs: ProductTabs
}
