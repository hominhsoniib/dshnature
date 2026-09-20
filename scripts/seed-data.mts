import path from 'node:path'

function parseEnvFileArg(argv: string[]): string | undefined {
  const prefix = '--env-file='
  for (const arg of argv) {
    if (arg.startsWith(prefix)) {
      return arg.slice(prefix.length)
    }
  }
  return undefined
}

async function loadEnv() {
  const envFileArg = parseEnvFileArg(process.argv.slice(2))
  const { config } = await import('dotenv')

  if (!envFileArg) {
    config()
    return
  }

  const resolvedPath = path.resolve(process.cwd(), envFileArg)
  const result = config({ path: resolvedPath, override: true })

  if (result.error) {
    throw new Error(`Không đọc được --env-file="${envFileArg}" (${resolvedPath}): ${result.error.message}`)
  }

  console.log(`[env] Đã load biến môi trường từ ${resolvedPath}`)
}

const CATEGORIES = [
  { name: 'Hỗ trợ hô hấp', slug: 'ho-tro-ho-hap' },
  { name: 'Hỗ trợ xương khớp', slug: 'ho-tro-xuong-khop' },
  { name: 'Hỗ trợ tuần hoàn – não bộ', slug: 'ho-tro-tuan-hoan-nao-bo' },
  { name: 'Hỗ trợ giấc ngủ', slug: 'ho-tro-giac-ngu' },
]

async function main() {
  await loadEnv()

  const { getPayload } = await import('payload')
  const { default: configPromise } = await import('../src/payload.config')

  const payload = await getPayload({ config: configPromise })

  console.log('[seed-data] Đang khởi tạo danh mục sản phẩm...')

  for (const cat of CATEGORIES) {
    const existing = await payload.find({
      collection: 'product-categories',
      where: { slug: { equals: cat.slug } },
      limit: 1,
    })

    if (existing.totalDocs === 0) {
      await payload.create({
        collection: 'product-categories',
        data: {
          name: cat.name,
          slug: cat.slug,
        },
      })
      console.log(`  + Đã tạo danh mục: ${cat.name} (${cat.slug})`)
    } else {
      console.log(`  ~ Danh mục đã tồn tại: ${cat.name}`)
    }
  }

  console.log('[seed-data] Hoàn tất khởi tạo danh mục sản phẩm!')
  process.exit(0)
}

main().catch((err) => {
  console.error('[seed-data] Lỗi khi seed danh mục:', err)
  process.exit(1)
})
