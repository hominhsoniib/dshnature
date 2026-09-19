import { AlertTriangle } from "lucide-react";

/**
 * UX state bắt buộc theo brief mục 12 — hiển thị khi query Payload/DB lỗi,
 * thay vì để section trắng hoặc crash cả trang.
 */
export function ErrorState({
  title = "Không tải được nội dung.",
  description = "Vui lòng thử tải lại trang sau ít phút.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-destructive/40 bg-destructive/5 px-6 py-12 text-center">
      <AlertTriangle className="size-8 text-destructive" aria-hidden />
      <p className="font-medium text-foreground">{title}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
