import { MessageCircle, Phone } from "lucide-react";

import type { SiteSettings } from "@/types/payload-content";

/**
 * Brief mục 7: "Floating contact: Hotline/Zalo/Messenger — không che CTA
 * chính" — đặt trên BottomNav mobile (z-40) nhưng dưới header (z-50), và có
 * margin-bottom trên mobile để không đè lên BottomNav.
 */
export function FloatingContact({ siteSettings }: { siteSettings: SiteSettings | null }) {
  const fc = siteSettings?.floatingContact;
  if (!fc?.hotline && !fc?.zaloUrl && !fc?.messengerUrl) return null;

  return (
    <div className="fixed bottom-20 right-4 z-30 flex flex-col gap-2 lg:bottom-6">
      {fc.hotline ? (
        <a
          href={`tel:${fc.hotline.replace(/\s+/g, "")}`}
          aria-label={`Gọi hotline ${fc.hotline}`}
          className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft-hover"
        >
          <Phone className="size-5" aria-hidden />
        </a>
      ) : null}
      {fc.zaloUrl ? (
        <a
          href={fc.zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Liên hệ Zalo"
          className="flex size-12 items-center justify-center rounded-full bg-white text-primary shadow-soft-hover"
        >
          <MessageCircle className="size-5" aria-hidden />
        </a>
      ) : null}
      {fc.messengerUrl ? (
        <a
          href={fc.messengerUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Liên hệ Messenger"
          className="flex size-12 items-center justify-center rounded-full bg-white text-primary shadow-soft-hover"
        >
          <MessageCircle className="size-5" aria-hidden />
        </a>
      ) : null}
    </div>
  );
}
