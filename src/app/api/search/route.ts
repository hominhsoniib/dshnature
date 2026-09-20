import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { searchProducts } from "@/lib/queries/products";

// Search luôn cần data mới nhất, không cache (CMS_INTEGRATION_PLAN.md §5.2).
export const dynamic = "force-dynamic";

const querySchema = z.object({
  q: z.string().trim().min(1).max(100),
});

/**
 * Route Handler đầu tiên phục vụ business logic của dự án (ngoài NextAuth và
 * REST/GraphQL tự sinh của Payload) — SearchModal là Client Component nên
 * không thể gọi Payload Local API trực tiếp. Chỉ đọc dữ liệu public
 * (products.read đã mở public ở Payload), không cần auth.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({ q: searchParams.get("q") ?? "" });

  if (!parsed.success) {
    return NextResponse.json({ results: [] });
  }

  const results = await searchProducts(parsed.data.q);
  return NextResponse.json({ results });
}
