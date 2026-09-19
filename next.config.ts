import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
