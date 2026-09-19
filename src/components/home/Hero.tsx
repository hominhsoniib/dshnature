"use client";

import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import type { Banner } from "@/types/payload-content";

/** Brief mục 7 (section 01): "Hero (slider 3-4 banner, CTA...)". */
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
    <section className="relative overflow-hidden bg-primary-light">
      <div className="relative mx-auto aspect-[16/7] max-h-[520px] min-h-[280px] w-full max-w-7xl">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-primary-light">
            <ImageIcon className="size-10 text-primary/40" aria-hidden />
          </div>
        )}

        <div className="absolute inset-0 flex flex-col items-start justify-center gap-3 bg-gradient-to-r from-black/40 via-black/10 to-transparent px-6 md:px-16">
          <h1 className="font-heading max-w-lg text-2xl font-bold text-white drop-shadow md:text-4xl">
            {banner.title}
          </h1>
          {banner.subtitle ? (
            <p className="max-w-md text-sm text-white/90 drop-shadow md:text-base">
              {banner.subtitle}
            </p>
          ) : null}
          {banner.ctaLabel && banner.ctaHref ? (
            <Button
              size="lg"
              className="mt-1"
              nativeButton={false}
              render={<Link href={banner.ctaHref}>{banner.ctaLabel}</Link>}
            />
          ) : null}
        </div>

        {banners.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Banner trước"
              onClick={() => setIndex((i) => (i - 1 + banners.length) % banners.length)}
              className="absolute left-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-primary shadow-soft hover:bg-white"
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Banner tiếp theo"
              onClick={() => setIndex((i) => (i + 1) % banners.length)}
              className="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-primary shadow-soft hover:bg-white"
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
              {banners.map((b, i) => (
                <button
                  key={b.id}
                  type="button"
                  aria-label={`Đến banner ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-6 bg-white" : "w-1.5 bg-white/60"
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
