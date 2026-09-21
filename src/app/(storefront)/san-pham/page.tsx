import type { Metadata } from "next";
import { getAllProducts, getProductCategories } from "@/lib/queries/products";
import { buildMetadata } from "@/lib/seo";
import { ProductCatalogView } from "./product-catalog-view";

export const metadata: Metadata = buildMetadata({
  title: "Sản phẩm | DSH NATURE",
  description:
    "Danh sách sản phẩm chăm sóc sức khỏe gia đình DSH Nature — chiết xuất từ thiên nhiên chọn lọc.",
  path: "/san-pham",
});

// Danh sách sản phẩm cần cập nhật nhanh hơn trang chủ khi admin sửa giá/thêm
// sản phẩm mới (CMS_INTEGRATION_PLAN.md §5.2).
export const revalidate = 60;

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getProductCategories(),
  ]);

  return <ProductCatalogView products={products} categories={categories} />;
}
