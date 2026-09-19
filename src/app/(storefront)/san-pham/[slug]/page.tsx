import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products-data";
import { ProductDetailView } from "./product-detail-view";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Sản phẩm không tồn tại | DSH NATURE",
    };
  }

  return {
    title: `${product.name} | DSH NATURE`,
    description: product.shortDescription,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailView product={product} />;
}
