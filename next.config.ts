import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Máy dev không có quyền admin và .next/types bị Windows khoá "Access is
  // denied" (icacls/takeown đều fail) — build ra thư mục khác thay vì .next
  // mặc định. Không ảnh hưởng Vercel: Vercel tự chạy `next build` trên máy
  // chủ riêng, đọc distDir này từ chính next.config.ts qua adapter của Next
  // (context.distDir), không có .next cũ nào trên máy dev để xung đột.
  distDir: "build-output",
  images: {
    // Media (banner, sản phẩm...) lưu trên Cloudflare R2 qua plugin
    // @payloadcms/storage-s3 (brief mục 10) — next/image cần khai báo domain
    // ảnh ngoài mới render được, nếu không sẽ lỗi runtime khi có banner thật.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.r2.cloudflarestorage.com",
      },
    ],
  },
};

export default withPayload(nextConfig);
