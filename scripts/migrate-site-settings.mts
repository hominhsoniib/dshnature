import 'dotenv/config'
import pg from 'pg'

const { Pool } = pg
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('sslmode=') || process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : undefined,
})

async function main() {
  console.log('[migration] Adding missing columns to site_settings table...')
  
  await pool.query(`
    ALTER TABLE "site_settings"
    ADD COLUMN IF NOT EXISTS "about_brand_image_id" integer,
    ADD COLUMN IF NOT EXISTS "about_mission_image_id" integer,
    ADD COLUMN IF NOT EXISTS "about_vision_image_id" integer,
    ADD COLUMN IF NOT EXISTS "about_strategy_image_id" integer;
  `)
  
  console.log('[migration] Successfully added columns to site_settings table!')
}

main().catch(console.error).finally(() => pool.end())
