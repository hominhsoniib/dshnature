"use client";

import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import type { Banner } from "@/types/payload-content";

/**
 * Hero slider banner — hiển thị hình ảnh banner sạch sẽ, không che khuất chữ trên thiết kế poster.
 */
export function Hero({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (banners.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % banners.length), 6000);
    return () => clearInterval(id);
  }, [banners.length]);

  if (banners.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 pt-8 md:px-6">
        <EmptyState
          icon={ImageIcon}
          title="Chưa có banner nào."
          description="Thêm banner trong Payload Admin (/admin/collections/banners) để hiển thị slider ở đây."
        />
      </div>
    );
  }

  const banner = banners[index];
  const imageUrl = typeof banner.image === "string" ? undefined : banner.image?.url ?? undefined;
  const imageAlt = typeof banner.image === "string" ? banner.title : banner.image?.alt ?? banner.title;

  return (
    <section className="relative overflow-hidden bg-cream border-b border-border">
      <div className="relative mx-auto aspect-[16/9] sm:aspect-[16/7] min-h-[200px] max-h-[500px] w-full max-w-7xl">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-contain sm:object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-primary-light">
            <ImageIcon className="size-10 text-primary/40" aria-hidden />
          </div>
        )}

        {/* Nút CTA gọn gàng nếu banner có liên kết */}
        {banner.ctaLabel && banner.ctaHref ? (
          <div className="absolute bottom-4 left-4 sm:left-10 z-10">
            <Button
              size="sm"
              className="bg-primary hover:bg-primary-dark text-white font-semibold text-xs sm:text-sm px-4 py-2 shadow-soft border border-white/20"
              nativeButton={false}
              render={<Link href={banner.ctaHref}>{banner.ctaLabel}</Link>}
            />
          </div>
        ) : null}

        {/* Mũi tên điều hướng slider */}
        {banners.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Banner trước"
              onClick={() => setIndex((i) => (i - 1 + banners.length) % banners.length)}
              className="absolute left-2 sm:left-4 top-1/2 flex size-8 sm:size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-primary shadow-soft hover:bg-white transition-colors"
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Banner tiếp theo"
              onClick={() => setIndex((i) => (i + 1) % banners.length)}
              className="absolute right-2 sm:right-4 top-1/2 flex size-8 sm:size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-primary shadow-soft hover:bg-white transition-colors"
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 z-10">
              {banners.map((b, i) => (
                <button
                  key={b.id}
                  type="button"
                  aria-label={`Đến banner ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-6 bg-primary" : "w-1.5 bg-primary/30"
                  }`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
