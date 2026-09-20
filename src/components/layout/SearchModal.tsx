"use client";

import React, { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";
import type { ProductViewModel } from "@/types/product";

export function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductViewModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const trimmedQuery = query.trim();
  const isEmptyQuery = trimmedQuery === "";

  // Debounce 300ms trước khi gọi /api/search — SearchModal là Client
  // Component nên không thể gọi Payload Local API trực tiếp
  // (CMS_INTEGRATION_PLAN.md §5.1/§5.2).
  //
  // react-hooks/set-state-in-effect: effect body (phần chạy đồng bộ ngay khi
  // effect fire) không được gọi setState ở bất kỳ đâu — kể cả setIsLoading(true).
  // Mọi setState (setIsLoading/setResults) phải nằm bên trong callback bất
  // đồng bộ thật sự của setTimeout (chạy sau 300ms, ở tick khác), không phải
  // ngay khi effect chạy. Nhánh early-return (query rỗng) cũng không setState
  // — render dựa thẳng vào `isEmptyQuery` để ẩn kết quả cũ.
  useEffect(() => {
    if (isEmptyQuery) {
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmedQuery)}`, {
          signal: controller.signal,
        });
        const data: { results?: ProductViewModel[] } = await res.json();
        setResults(data.results ?? []);
      } catch {
        // AbortError (gõ tiếp) hoặc lỗi mạng — không để crash UI, giữ nguyên
        // trạng thái loading để lần gọi tiếp theo (nếu có) tự cập nhật lại.
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmedQuery, isEmptyQuery]);

  if (!isOpen) return null;

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
          {isEmptyQuery ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Nhập từ khóa để tìm kiếm sản phẩm DSH Nature...
            </div>
          ) : isLoading ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Đang tìm kiếm...
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Không tìm thấy sản phẩm nào khớp với &quot;{query}&quot;
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Kết quả tìm kiếm ({results.length})
              </p>
              {results.map((item) => (
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
