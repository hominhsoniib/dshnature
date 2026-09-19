"use client";

import { useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

const emailSchema = z.email("Email không hợp lệ.");

/** Brief mục 8: "Newsletter (Zod validate)", section 12 trang chủ. */
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const toast = useToast();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Email không hợp lệ.");
      return;
    }

    setError(null);
    setPending(true);
    // TODO(phase sau): POST /api/newsletter — bảng `newsletter_subscribers`
    // (Prisma, PROJECT_BRIEF.md mục 4) chưa được định nghĩa nên API thật chưa
    // có; không tự tạo route giả trước đúng phase. Tạm chỉ validate + phản hồi
    // UI (không claim đã lưu DB).
    await new Promise((resolve) => setTimeout(resolve, 400));
    setPending(false);
    setEmail("");
    toast.add({
      title: "Đã ghi nhận email",
      description: "Tính năng gửi bản tin sẽ hoàn thiện ở phase sau.",
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto flex w-full max-w-md flex-col gap-2 sm:flex-row sm:items-start"
    >
      <div className="flex-1">
        <label htmlFor="newsletter-email" className="sr-only">
          Email
        </label>
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Nhập email của bạn"
          aria-invalid={Boolean(error)}
          className="h-10 w-full rounded-md border border-border bg-white px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
        {error ? <p className="mt-1 text-xs text-destructive">{error}</p> : null}
      </div>
      <Button type="submit" disabled={pending} className="h-10">
        {pending ? "Đang gửi..." : "Đăng ký"}
      </Button>
    </form>
  );
}
