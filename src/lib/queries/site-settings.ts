import { getPayloadClient } from "@/lib/payload";
import type { SiteSettings as SiteSettingsType } from "@/types/payload-content";

/**
 * Dùng chung cho Header/Footer/FloatingContact (RootLayout) và bất kỳ trang
 * nào cần thông tin công ty (vd Liên hệ) — tránh mỗi nơi tự viết lại cùng 1
 * hàm fetch + fallback null khi lỗi (brief mục 12: không để trắng trang).
 */
export async function getSiteSettings(): Promise<SiteSettingsType | null> {
  try {
    const payload = await getPayloadClient();
    const settings = await payload.findGlobal({
      slug: "site-settings",
      overrideAccess: true,
    });
    return settings as unknown as SiteSettingsType;
  } catch (err) {
    console.error("[getSiteSettings] Error fetching site-settings:", err);
    return null;
  }
}
