"use client";

import { Toast } from "@base-ui/react/toast";
import { X } from "lucide-react";

/**
 * Toast dùng chung toàn site (brief mục 8 + mục 12: "Toast — ví dụ: 'Đã thêm
 * sản phẩm vào giỏ hàng.'"). `ToastProvider` bọc ở RootLayout, `<Toaster />`
 * render viewport 1 lần; các form/action khác gọi `useToast().add(...)`.
 */
export const ToastProvider = Toast.Provider;
export const useToast = Toast.useToastManager;

function ToastList() {
  const { toasts } = useToast();

  return toasts.map((toast) => (
    <Toast.Root
      key={toast.id}
      toast={toast}
      className="pointer-events-auto relative rounded-lg border border-border bg-white p-4 pr-8 shadow-soft-hover data-[type=error]:border-destructive/40"
    >
      {toast.title ? (
        <Toast.Title className="text-sm font-semibold text-foreground" />
      ) : null}
      {toast.description ? (
        <Toast.Description className="mt-0.5 text-sm text-muted-foreground" />
      ) : null}
      <Toast.Close
        aria-label="Đóng thông báo"
        className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
      >
        <X className="size-3.5" aria-hidden />
      </Toast.Close>
    </Toast.Root>
  ));
}

export function Toaster() {
  return (
    <Toast.Portal>
      <Toast.Viewport className="fixed inset-x-4 bottom-24 z-[100] flex flex-col gap-2 lg:bottom-6 lg:right-6 lg:inset-x-auto lg:w-full lg:max-w-sm">
        <ToastList />
      </Toast.Viewport>
    </Toast.Portal>
  );
}
