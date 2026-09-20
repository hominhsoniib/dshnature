import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

// R2_PUBLIC_URL (vd https://pub-xxxx.r2.dev) — domain public dùng cho
// generateFileURL trong payload.config.ts (Media collection). Parse hostname
// động từ env thay vì hardcode domain riêng của 1 account Cloudflare cụ thể.
const r2PublicHostname = process.env.R2_PUBLIC_URL
  ? new URL(process.env.R2_PUBLIC_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  // Máy dev không có quyền admin và .next/types bị Windows khoá "Access is
  // denied" (icacls/takeown đều fail) — build ra thư mục khác thay vì .next
  // mặc định. Không ảnh hưởng Vercel: Vercel tự chạy `next build` trên máy
  // chủ riêng, đọc distDir này từ chính next.config.ts qua adapter của Next
  // (context.distDir), không có .next cũ nào trên máy dev để xung đột.
  distDir: "build-output",
  images: {
    // Media (banner, sản phẩm...) lưu trên Cloudflare R2 qua plugin
    // @payloadcms/storage-s3 — next/image cần khai báo domain ảnh ngoài mới
    // render được, nếu không sẽ lỗi runtime khi có banner/sản phẩm thật.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.r2.cloudflarestorage.com",
      },
      // Domain public R2 (r2.dev hoặc custom domain) mà Media.url giờ trỏ
      // thẳng vào qua generateFileURL — chỉ thêm khi R2_PUBLIC_URL có set.
      ...(r2PublicHostname
        ? [{ protocol: "https" as const, hostname: r2PublicHostname }]
        : []),
    ],
  },
};

export default withPayload(nextConfig);
