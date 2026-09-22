import { cache } from "react";
import pg from "pg";
import { getPayloadClient } from "@/lib/payload";
import type { SiteSettings as SiteSettingsType } from "@/types/payload-content";

// Dùng ở cả 3 tier bên dưới (query pg trực tiếp + fallback cuối cùng) —
// khớp với defaultValue khai báo ở SiteSettings.ts cho bản ghi Payload global
// tạo mới, nhưng bản ghi cũ (tạo trước khi thêm 2 field này) sẽ có cột NULL
// nên vẫn cần default ở đây.
export const DEFAULT_WORKING_HOURS = "Thứ 2 - Thứ 7: 08:00 - 17:30";
export const DEFAULT_MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.863981044336!2d105.7801!3d21.0368!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab325697669d%3A0x401828f72c478a0!2zQ8OidSBHaeG6pXksIEjDoCBO4buZaSwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s";

let pool: pg.Pool | null = null;
function getPgPool() {
  if (!pool && process.env.DATABASE_URL) {
    pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 5,
      idleTimeoutMillis: 10000,
    });
  }
  return pool;
}

/**
 * Direct DB-first query for site-settings global. Ensures 100% reliability
 * and instant zero-latency retrieval of updated company info across all storefront pages.
 *
 * Bọc React.cache() ở export bên dưới — dedupe trong cùng 1 request React
 * (layout.tsx + lien-he/page.tsx cùng gọi hàm này mỗi lần load /lien-he) để
 * tránh round-trip DB thừa; page vẫn force-dynamic nên KHÔNG cache xuyên
 * request, chỉ dedupe trong 1 lần render.
 */
async function getSiteSettingsUncached(): Promise<SiteSettingsType | null> {
  // 1. Direct pg SQL Query (Zero extra engines, 100% reliable on Vercel Serverless with SSL)
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
          workingHours: row.working_hours || DEFAULT_WORKING_HOURS,
          mapEmbedUrl: row.map_embed_url || DEFAULT_MAP_EMBED_URL,
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

  // 1. Fallback / Primary: Payload Local API with populated media depth
  try {
    const payload = await getPayloadClient();
    const settings = await payload.findGlobal({
      slug: "site-settings",
      depth: 1,
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
    workingHours: DEFAULT_WORKING_HOURS,
    mapEmbedUrl: DEFAULT_MAP_EMBED_URL,
    socials: {
      facebook: null,
      youtube: null,
      tiktok: null,
      zalo: null,
    },
    floatingContact: {
      hotline: "0886554242",
    },
  } as unknown as SiteSettingsType;
}

export const getSiteSettings = cache(getSiteSettingsUncached);
