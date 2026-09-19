"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Minus, Plus, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import type { ProductDetail } from "@/lib/products-data";
import { useCart } from "@/context/cart-context";

export function ProductDetailView({ product }: { product: ProductDetail }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<keyof ProductDetail["tabs"]>("description");

  const TAB_LABELS: Record<keyof ProductDetail["tabs"], string> = {
    description: "Mô tả sản phẩm",
    ingredients: "Thành phần",
    usage: "Công dụng hỗ trợ",
    targetUsers: "Đối tượng sử dụng",
    howToUse: "Hướng dẫn sử dụng",
    specification: "Quy cách & Bảo quản",
    storage: "Bảo quản",
    productDossier: "Hồ sơ công bố",
  };

  const handleAddToCart = () => {
    addToCart(
      {
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.images[0],
        categoryName: product.categoryName,
      },
      quantity
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/gio-hang");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-primary">Trang chủ</Link>
        <ChevronRight className="size-3" />
        <Link href="/san-pham" className="hover:text-primary">Sản phẩm</Link>
        <ChevronRight className="size-3" />
        <span className="font-medium text-foreground">{product.name}</span>
      </nav>

      {/* Main Product Details Section */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Product Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-white shadow-soft">
            <Image
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              fill
              className="object-contain p-6"
              priority
            />
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative size-20 overflow-hidden rounded-lg border bg-white ${
                    selectedImageIndex === idx ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-contain p-2" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Meta & Actions */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {product.categoryName}
            </span>
            <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
              {product.name}
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Price block */}
            <div className="flex items-baseline gap-3 rounded-xl bg-cream p-4">
              <span className="font-heading text-3xl font-bold text-primary">
                {product.price.toLocaleString("vi-VN")} đ
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {product.originalPrice.toLocaleString("vi-VN")} đ
                </span>
              )}
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="size-4 text-primary" />
                <span>100% Chính hãng DSH Nature</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Truck className="size-4 text-primary" />
                <span>Giao hàng toàn quốc</span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-4">
              <span className="text-sm font-medium text-foreground">Số lượng:</span>
              <div className="flex items-center rounded-lg border border-border bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 text-muted-foreground hover:text-foreground"
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-12 text-center text-sm font-semibold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2 text-muted-foreground hover:text-foreground"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-primary bg-primary-light py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
            >
              <ShoppingBag className="size-4" />
              Thêm vào giỏ hàng
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              className="flex-1 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary-dark"
            >
              Mua ngay
            </button>
          </div>
        </div>
      </div>

      {/* Product Detail Tabs */}
      <div className="mt-12 rounded-2xl border border-border bg-white p-6 shadow-soft">
        <div className="flex flex-wrap border-b border-border gap-2 pb-3">
          {(Object.keys(TAB_LABELS) as Array<keyof ProductDetail["tabs"]>).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`rounded-lg px-4 py-2 text-xs md:text-sm font-medium transition-colors ${
                activeTab === key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {TAB_LABELS[key]}
            </button>
          ))}
        </div>

        <div className="mt-6 text-sm text-muted-foreground leading-relaxed">
          <p className="font-semibold text-foreground mb-2">{TAB_LABELS[activeTab]}</p>
          <p>{product.tabs[activeTab]}</p>
        </div>
      </div>
    </div>
  );
}
