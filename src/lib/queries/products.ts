import { getPayloadClient } from "@/lib/payload";
import type { ProductCategorySummary, ProductViewModel } from "@/types/product";

/**
 * Query layer cho collection `products`/`product-categories` — mọi hàm ở đây
 * bọc try/catch trả về mảng rỗng/null khi Payload lỗi (brief mục 12: không
 * để trắng trang/crash khi DB lỗi), đúng pattern đã có sẵn ở getBanners().
 */

type MediaRef = { url?: string | null; alt?: string | null } | string | null | undefined;

type PayloadProductCategory = {
  id: string;
  name: string;
  slug: string;
};

type PayloadProduct = {
  id: string;
  slug: string;
  name: string;
  category: PayloadProductCategory | string;
  price: number;
  originalPrice?: number | null;
  shortDescription: string;
  images?: { image: MediaRef }[] | null;
  tabs?: {
    description?: string | null;
    ingredients?: string | null;
    usage?: string | null;
    targetUsers?: string | null;
    howToUse?: string | null;
    specification?: string | null;
    storage?: string | null;
    productDossier?: string | null;
  } | null;
};

function getMediaUrl(media: MediaRef): string | undefined {
  if (!media || typeof media === "string") return undefined;
  return media.url ?? undefined;
}

function toViewModel(doc: PayloadProduct): ProductViewModel {
  const category = typeof doc.category === "string" ? null : doc.category;
  const images = (doc.images ?? [])
    .map((item) => getMediaUrl(item.image))
    .filter((url): url is string => Boolean(url));

  return {
    slug: doc.slug,
    name: doc.name,
    categorySlug: category?.slug ?? "",
    categoryName: category?.name ?? "",
    price: doc.price,
    originalPrice: doc.originalPrice ?? undefined,
    shortDescription: doc.shortDescription,
    images,
    tabs: {
      description: doc.tabs?.description ?? "",
      ingredients: doc.tabs?.ingredients ?? "",
      usage: doc.tabs?.usage ?? "",
      targetUsers: doc.tabs?.targetUsers ?? "",
      howToUse: doc.tabs?.howToUse ?? "",
      specification: doc.tabs?.specification ?? "",
      storage: doc.tabs?.storage ?? "",
      productDossier: doc.tabs?.productDossier ?? "",
    },
  };
}

export async function getAllProducts(): Promise<ProductViewModel[]> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "products",
      limit: 100,
      depth: 1,
    });
    return (result.docs as unknown as PayloadProduct[]).map(toViewModel);
  } catch {
    return [];
  }
}

export async function getFeaturedProducts(limit = 4): Promise<ProductViewModel[]> {
  // TODO(Phase A2): collection `products` chưa có field "isFeatured" để admin
  // tự chọn sản phẩm nổi bật (đã ghi nhận ở CMS_INTEGRATION_PLAN.md mục 2) —
  // tạm lấy N sản phẩm mới nhất theo thời gian tạo thay cho việc admin tự chọn.
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "products",
      limit,
      depth: 1,
      sort: "-createdAt",
    });
    return (result.docs as unknown as PayloadProduct[]).map(toViewModel);
  } catch {
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<ProductViewModel | null> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "products",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
    });
    const doc = result.docs[0] as unknown as PayloadProduct | undefined;
    return doc ? toViewModel(doc) : null;
  } catch {
    return null;
  }
}

export async function getProductCategories(): Promise<ProductCategorySummary[]> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "product-categories",
      limit: 100,
    });
    return (result.docs as unknown as PayloadProductCategory[]).map((doc) => ({
      slug: doc.slug,
      name: doc.name,
    }));
  } catch {
    return [];
  }
}

/**
 * Dùng bởi Route Handler `/api/search` — SearchModal là Client Component nên
 * không thể gọi Local API trực tiếp (chỉ chạy được ở server/Node context).
 */
export async function searchProducts(query: string, limit = 8): Promise<ProductViewModel[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "products",
      where: {
        or: [{ name: { like: trimmed } }, { shortDescription: { like: trimmed } }],
      },
      limit,
      depth: 1,
    });
    return (result.docs as unknown as PayloadProduct[]).map(toViewModel);
  } catch {
    return [];
  }
}
