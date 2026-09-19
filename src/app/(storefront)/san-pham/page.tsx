"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingBag, SlidersHorizontal } from "lucide-react";
import { PRODUCTS_LIST } from "@/lib/products-data";
import { useCart } from "@/context/cart-context";
import { SectionTitle } from "@/components/home/SectionTitle";

const CATEGORIES = [
  { slug: "all", name: "Tất cả sản phẩm" },
  { slug: "ho-hap", name: "Hỗ trợ hô hấp" },
  { slug: "xuong-khop", name: "Hỗ trợ xương khớp" },
  { slug: "tuan-hoan-nao-bo", name: "Hỗ trợ tuần hoàn – não bộ" },
  { slug: "giac-ngu", name: "Hỗ trợ giấc ngủ" },
];

function ProductCatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("nhom") || "all";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "name">("default");
  const { addToCart } = useCart();

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS_LIST];

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.categorySlug === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q)
      );
    }

    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <SectionTitle
        eyebrow="Danh mục DSH Nature"
        title="Sản phẩm chăm sóc sức khỏe gia đình"
        description="Các giải pháp hỗ trợ sức khỏe chiết xuất từ thiên nhiên chọn lọc."
      />

      {/* Filter Tabs & Search Controls */}
      <div className="mb-8 space-y-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-border pb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setSelectedCategory(cat.slug)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                selectedCategory === cat.slug
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search & Sort Options */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-white pl-9 pr-4 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "default" | "price-asc" | "price-desc" | "name")}
              className="rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="default">Mặc định</option>
              <option value="price-asc">Giá: Thấp đến Cao</option>
              <option value="price-desc">Giá: Cao đến Thấp</option>
              <option value="name">Tên: A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center">
          <p className="text-muted-foreground">Không tìm thấy sản phẩm nào phù hợp.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <div
              key={product.slug}
              className="group flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-white p-4 shadow-soft transition-all duration-300 hover:shadow-soft-hover"
            >
              <div>
                <Link href={`/san-pham/${product.slug}`} className="relative block aspect-square w-full overflow-hidden rounded-lg bg-cream">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute left-2 top-2 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                    {product.categoryName}
                  </span>
                </Link>

                <div className="mt-4 space-y-1">
                  <Link
                    href={`/san-pham/${product.slug}`}
                    className="font-heading font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {product.shortDescription}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                <div>
                  <p className="font-heading font-bold text-primary">
                    {product.price.toLocaleString("vi-VN")} đ
                  </p>
                  {product.originalPrice && (
                    <p className="text-[11px] text-muted-foreground line-through">
                      {product.originalPrice.toLocaleString("vi-VN")} đ
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    addToCart({
                      slug: product.slug,
                      name: product.name,
                      price: product.price,
                      image: product.images[0],
                      categoryName: product.categoryName,
                    })
                  }
                  className="flex items-center gap-1.5 rounded-lg bg-primary-light px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <ShoppingBag className="size-3.5" />
                  Thêm giỏ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-muted-foreground">Đang tải sản phẩm...</div>}>
      <ProductCatalogContent />
    </Suspense>
  );
}
