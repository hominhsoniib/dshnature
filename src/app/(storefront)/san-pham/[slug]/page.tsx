import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProducts, getProductBySlug } from "@/lib/queries/products";
import { buildMetadata } from "@/lib/seo";
import { productJsonLd } from "@/lib/structured-data";
import { ProductDetailView } from "./product-detail-view";

// revalidate 60s (giống /san-pham) + pre-render tĩnh các slug đã biết tại
// build time (ISR) — CMS_INTEGRATION_PLAN.md §5.2.
export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Sản phẩm không tồn tại | DSH NATURE",
    };
  }

  // SEO field riêng cho Products chưa có ở Phase A — dùng name + shortDescription
  // mặc định (CMS_INTEGRATION_PLAN.md mục 4, item 4 — gộp vào Phase C sau).
  return buildMetadata({
    title: `${product.name} | DSH NATURE`,
    description: product.shortDescription,
    path: `/san-pham/${slug}`,
    image: product.images[0],
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: productJsonLd(product) }}
      />
      <ProductDetailView product={product} />
    </>
  );
}
