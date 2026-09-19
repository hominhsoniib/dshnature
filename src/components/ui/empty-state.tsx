import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

/**
 * UX state bắt buộc theo brief mục 12: "không để trang trắng khi lỗi/rỗng".
 * Dùng khi 1 section chưa có dữ liệu (vd chưa seed banner/bài viết trong Admin).
 */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 px-6 py-12 text-center">
      <Icon className="size-8 text-muted-foreground" aria-hidden />
      <p className="font-medium text-foreground">{title}</p>
      {description ? (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
