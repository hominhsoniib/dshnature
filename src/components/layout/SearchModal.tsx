"use client";

import React, { useState } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { mockFeaturedProducts } from "@/features/home/mock-data";

export function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");

  if (!isOpen) return null;

  const filtered = query.trim()
    ? mockFeaturedProducts.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-2xl rounded-xl bg-background p-4 shadow-soft-hover mx-4 border border-border">
        <div className="flex items-center gap-3 border-b border-border pb-3">
          <Search className="size-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm (ví dụ: Euginca, Ginkgo, Viên khớp...)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm md:text-base outline-none placeholder:text-muted-foreground"
            autoFocus
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 hover:bg-muted text-muted-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-4 max-h-[60vh] overflow-y-auto">
          {query.trim() === "" ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Nhập từ khóa để tìm kiếm sản phẩm DSH Nature...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Không tìm thấy sản phẩm nào khớp với &quot;{query}&quot;
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Kết quả tìm kiếm ({filtered.length})
              </p>
              {filtered.map((item) => (
                <Link
                  key={item.slug}
                  href={`/san-pham/${item.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between rounded-lg p-3 hover:bg-muted/80 transition-colors"
                >
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.shortDescription}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-primary">Xem chi tiết &rarr;</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
