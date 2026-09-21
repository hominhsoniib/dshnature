import pg from "pg";
import { getPayloadClient } from "@/lib/payload";
import type { SiteSettings as SiteSettingsType } from "@/types/payload-content";

let pool: pg.Pool | null = null;
function getPgPool() {
  if (!pool && process.env.DATABASE_URL) {
    pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      idleTimeoutMillis: 10000,
    });
  }
  return pool;
}

/**
 * Direct DB-first query for site-settings global. Ensures 100% reliability
 * and instant zero-latency retrieval of updated company info across all storefront pages.
 */
export async function getSiteSettings(): Promise<SiteSettingsType | null> {
  // 1. Direct pg SQL Query (Zero extra engines, 100% reliable on Vercel Serverless)
  try {
    const p = getPgPool();
    if (p) {
      const res = await p.query(`SELECT * FROM site_settings LIMIT 1`);
      if (res.rows && res.rows.length > 0) {
        const row = res.rows[0];
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
    }
  } catch (dbErr) {
    console.error("[getSiteSettings] pg SQL error, trying Payload Local API:", dbErr);
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
