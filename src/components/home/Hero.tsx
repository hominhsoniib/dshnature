"use client";

import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import type { Banner } from "@/types/payload-content";

/**
 * Hero slider banner được tối ưu hóa hiển thị responsive hoàn hảo trên mọi thiết bị
 * (Mobile portrait, Tablet, Desktop).
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
    <section className="relative overflow-hidden bg-primary-dark">
      <div className="relative mx-auto aspect-[4/3] sm:aspect-[16/8] md:aspect-[16/7] min-h-[320px] max-h-[520px] w-full max-w-7xl">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1280px"
            className="object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-primary-dark/80">
            <ImageIcon className="size-10 text-white/40" aria-hidden />
          </div>
        )}

        {/* Backdrop Gradient Overlay giúp chữ tương phản rõ nét trên mobile */}
        <div className="absolute inset-0 flex flex-col items-start justify-end sm:justify-center gap-2.5 sm:gap-3.5 bg-gradient-to-t sm:bg-gradient-to-r from-black/90 via-black/60 sm:via-black/40 to-transparent p-5 sm:px-10 md:px-16 pb-10 sm:pb-10">
          <span className="inline-block rounded-full bg-primary/80 backdrop-blur-sm px-3 py-1 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-white border border-white/20">
            DSH NATURE
          </span>
          <h1 className="font-heading max-w-xl text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-white drop-shadow-md leading-snug sm:leading-tight">
            {banner.title}
          </h1>
          {banner.subtitle ? (
            <p className="max-w-md text-xs sm:text-sm md:text-base text-white/90 drop-shadow line-clamp-2 sm:line-clamp-3 leading-relaxed">
              {banner.subtitle}
            </p>
          ) : null}
          {banner.ctaLabel && banner.ctaHref ? (
            <div className="pt-1">
              <Button
                size="default"
                className="bg-primary hover:bg-primary-dark text-white font-semibold text-xs sm:text-sm px-5 py-2.5 shadow-lg border border-white/20"
                nativeButton={false}
                render={<Link href={banner.ctaHref}>{banner.ctaLabel}</Link>}
              />
            </div>
          ) : null}
        </div>

        {/* Mũi tên điều hướng slider */}
        {banners.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Banner trước"
              onClick={() => setIndex((i) => (i - 1 + banners.length) % banners.length)}
              className="absolute left-2 sm:left-4 top-1/2 flex size-7 sm:size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 backdrop-blur-md text-white border border-white/20 shadow-soft hover:bg-black/60 transition-colors"
            >
              <ChevronLeft className="size-4 sm:size-5" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Banner tiếp theo"
              onClick={() => setIndex((i) => (i + 1) % banners.length)}
              className="absolute right-2 sm:right-4 top-1/2 flex size-7 sm:size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 backdrop-blur-md text-white border border-white/20 shadow-soft hover:bg-black/60 transition-colors"
            >
              <ChevronRight className="size-4 sm:size-5" aria-hidden />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 z-10">
              {banners.map((b, i) => (
                <button
                  key={b.id}
                  type="button"
                  aria-label={`Đến banner ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-6 bg-white" : "w-1.5 bg-white/50"
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
