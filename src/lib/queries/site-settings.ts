import { getPayloadClient } from "@/lib/payload";
import { prisma } from "@/lib/prisma";
import type { SiteSettings as SiteSettingsType } from "@/types/payload-content";

/**
 * Fetch site-settings global. Try Payload Local API first, and fallback to direct
 * SQL/Prisma query on `site_settings` table if Payload Local API throws in Serverless environment.
 */
export async function getSiteSettings(): Promise<SiteSettingsType | null> {
  try {
    const payload = await getPayloadClient();
    const settings = await payload.findGlobal({
      slug: "site-settings",
      overrideAccess: true,
    });
    if (settings && (settings as unknown as { address?: string }).address) {
      return settings as unknown as SiteSettingsType;
    }
  } catch (err) {
    console.error("[getSiteSettings] Payload API error, falling back to direct DB:", err);
  }

  // Fallback: Direct query on `site_settings` PostgreSQL table via Prisma
  try {
    const rows = await prisma.$queryRaw<
      Array<{
        company_name: string | null;
        tagline: string | null;
        hotline: string | null;
        email: string | null;
        address: string | null;
        floating_contact_hotline: string | null;
        floating_contact_zalo_url: string | null;
        floating_contact_messenger_url: string | null;
      }>
    >`SELECT * FROM site_settings LIMIT 1`;

    if (rows && rows.length > 0) {
      const row = rows[0];
      return {
        companyName: row.company_name || "CÔNG TY CỔ PHẦN DSH NATURE",
        tagline: row.tagline || "ĐỒNG HÀNH CÙNG SỨC KHỎE GIA ĐÌNH",
        hotline: row.hotline || "0886554242",
        email: row.email || "dshnature@gmail.com",
        address: row.address || "23 Nguyễn Văn Thủ, Q12, TP.Hồ Chí Minh",
        floatingContact: {
          hotline: row.floating_contact_hotline || "0886554242",
          zaloUrl: row.floating_contact_zalo_url,
          messengerUrl: row.floating_contact_messenger_url,
        },
      } as unknown as SiteSettingsType;
    }
  } catch (dbErr) {
    console.error("[getSiteSettings] Direct DB query fallback error:", dbErr);
  }

  // Ultimate fallback to real company defaults
  return {
    companyName: "CÔNG TY CỔ PHẦN DSH NATURE",
    tagline: "ĐỒNG HÀNH CÙNG SỨC KHỎE GIA ĐÌNH",
    hotline: "0886554242",
    email: "dshnature@gmail.com",
    address: "23 Nguyễn Văn Thủ, Q12, TP.Hồ Chí Minh",
    floatingContact: {
      hotline: "0886554242",
    },
  } as unknown as SiteSettingsType;
}
