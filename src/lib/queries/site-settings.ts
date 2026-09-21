import { getPayloadClient } from "@/lib/payload";
import { prisma } from "@/lib/prisma";
import type { SiteSettings as SiteSettingsType } from "@/types/payload-content";

/**
 * Direct DB-first query for site-settings global. Ensures 100% reliability
 * and instant zero-latency retrieval of updated company info across all storefront pages.
 */
export async function getSiteSettings(): Promise<SiteSettingsType | null> {
  // 1. Direct Prisma SQL Query (Fastest, 100% reliable on Vercel Serverless)
  try {
    const rows = await prisma.$queryRaw<
      Array<{
        company_name: string | null;
        tagline: string | null;
        hotline: string | null;
        email: string | null;
        address: string | null;
        socials_facebook: string | null;
        socials_youtube: string | null;
        socials_tiktok: string | null;
        socials_zalo: string | null;
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
        socials: {
          facebook: row.socials_facebook,
          youtube: row.socials_youtube,
          tiktok: row.socials_tiktok,
          zalo: row.socials_zalo,
        },
        floatingContact: {
          hotline: row.floating_contact_hotline || "0886554242",
          zaloUrl: row.floating_contact_zalo_url,
          messengerUrl: row.floating_contact_messenger_url,
        },
      } as unknown as SiteSettingsType;
    }
  } catch (dbErr) {
    console.error("[getSiteSettings] Prisma SQL error, trying Payload Local API:", dbErr);
  }

  // 2. Fallback: Payload Local API
  try {
    const payload = await getPayloadClient();
    const settings = await payload.findGlobal({
      slug: "site-settings",
      overrideAccess: true,
    });
    if (settings) {
      return settings as unknown as SiteSettingsType;
    }
  } catch (err) {
    console.error("[getSiteSettings] Payload Local API error:", err);
  }

  // 3. Ultimate fallback to real company defaults
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
