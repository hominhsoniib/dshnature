import path from 'node:path'
import fs from 'node:fs'

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

const MEDIA_FILES = [
  { filename: 'euginca-chai.png', alt: 'Euginca An Phế DSH - Chai' },
  { filename: 'euginca-tui.png', alt: 'Euginca An Phế DSH - Túi' },
  { filename: 'xuong-khop.png', alt: 'Viên khớp DSH' },
  { filename: 'ginkgo.png', alt: 'Ginkgo Nature Extra Q10' },
  { filename: 'pharton.png', alt: 'Pharton Nature DSH' },
]

const PRODUCTS_SEED = [
  {
    slug: 'euginca-an-phe-dsh',
    name: 'Euginca An Phế DSH',
    categorySlug: 'ho-tro-ho-hap',
    price: 180000,
    originalPrice: 220000,
    shortDescription: 'Hỗ trợ bổ phế, giảm ho, giảm đờm, hỗ trợ giảm đau rát họng do viêm họng.',
    imageFilenames: ['euginca-chai.png', 'euginca-tui.png'],
    tabs: {
      description:
        'Euginca An Phế DSH là sản phẩm chiết xuất từ thảo dược thiên nhiên như húng chanh, tràm, gừng, tần dày lá giúp làm dịu cổ họng, hỗ trợ đường hô hấp khỏe mạnh.',
      ingredients:
        'Chiết xuất Húng chanh: 100mg, Tinh dầu Tràm: 50mg, Chiết xuất Gừng: 40mg, Chiết xuất Tần dày lá: 30mg. Phụ liệu vừa đủ 1 viên.',
      usage:
        'Hỗ trợ bổ phế, hỗ trợ làm dịu cơn ho, giảm đờm, hỗ trợ làm giảm cảm giác đau rát cổ họng và ngứa họng do viêm họng thông thường.',
      targetUsers:
        'Người bị ho khô, ho có đờm, đau rát họng, ngứa cổ họng do thay đổi thời tiết hoặc tiếp xúc môi trường nhiều bụi bẩn.',
      howToUse:
        'Trẻ em trên 6 tuổi và người lớn: Uống 1-2 viên/lần, ngày 2-3 lần sau bữa ăn. Hoặc ngậm trực tiếp theo hướng dẫn chuyên gia.',
      specification: 'Chai 60 viên hoặc Hộp 10 vỉ x 10 viên.',
      storage: 'Bảo quản nơi khô ráo, thoáng mát, nhiệt độ dưới 30°C, tránh ánh nắng trực tiếp.',
      productDossier:
        'Số ĐKSP: 6789/2024/ĐKSP — Cục An toàn Thực phẩm Bộ Y tế cấp phép lưu hành toàn quốc.',
    },
  },
  {
    slug: 'vien-khop-dsh',
    name: 'Viên khớp DSH',
    categorySlug: 'ho-tro-xuong-khop',
    price: 250000,
    originalPrice: 290000,
    shortDescription: 'Hỗ trợ dưỡng khớp, hỗ trợ tăng tiết dịch khớp, giúp khớp vận động linh hoạt.',
    imageFilenames: ['xuong-khop.png'],
    tabs: {
      description:
        'Viên khớp DSH kết hợp thảo dược truyền thống cùng Glucosamine giúp hỗ trợ sức khỏe xương khớp, mang lại sự linh hoạt trong vận động hằng ngày cho người lớn tuổi và người hoạt động thể lực.',
      ingredients:
        'Glucosamine Sulfate: 500mg, Chiết xuất Dây đau xương: 150mg, Chiết xuất Khúc khắc: 100mg, Chiết xuất Độc hoạt: 80mg, Collagen Type II: 50mg.',
      usage:
        'Hỗ trợ bổ sung dưỡng chất cho khớp, hỗ trợ duy trì độ đàn hồi của sụn khớp, giúp khớp vận động dễ dàng và linh hoạt.',
      targetUsers:
        'Người trưởng thành, người lớn tuổi mong muốn hỗ trợ chăm sóc sức khỏe xương khớp, người vận động nhiều gây mỏi khớp.',
      howToUse: 'Uống 1 viên/lần, ngày 2 lần sau khi ăn sáng và ăn tối.',
      specification: 'Hộp 60 viên nén bao phim.',
      storage: 'Nơi khô ráo, tránh ánh sáng trực tiếp, để xa tầm tay trẻ em.',
      productDossier: 'Số ĐKSP: 7890/2024/ĐKSP — Xác nhận công bố phù hợp quy định an toàn thực phẩm.',
    },
  },
  {
    slug: 'ginkgo-nature-extra-q10',
    name: 'Ginkgo Nature Extra Q10',
    categorySlug: 'ho-tro-tuan-hoan-nao-bo',
    price: 320000,
    originalPrice: 380000,
    shortDescription: 'Hỗ trợ tăng cường tuần hoàn máu não, hỗ trợ giảm các triệu chứng hoa mắt, chóng mặt.',
    imageFilenames: ['ginkgo.png'],
    tabs: {
      description:
        'Ginkgo Nature Extra Q10 được chiết xuất từ lá Bạch quả (Ginkgo Biloba) chuẩn hóa kết hợp Coenzyme Q10 giúp hỗ trợ duy trì sự minh mẫn và khả năng tập trung tinh thần.',
      ingredients:
        'Ginkgo Biloba Extract: 120mg, Coenzyme Q10: 20mg, Cao Đinh lăng: 50mg, Magnesi oxyd: 30mg, Vitamin B6: 2mg.',
      usage:
        'Hỗ trợ tăng cường lưu thông máu não, hỗ trợ giảm nguy cơ suy giảm trí nhớ ở người lớn tuổi, giúp tinh thần tỉnh táo và tập trung làm việc.',
      targetUsers:
        'Người lớn tuổi cần hỗ trợ trí nhớ, người làm việc trí óc căng thẳng, thường xuyên mệt mỏi, hoa mắt chóng mặt.',
      howToUse: 'Uống 1 viên/ngày vào buổi sáng sau bữa ăn.',
      specification: 'Lọ 60 viên nang mềm.',
      storage: 'Bảo quản nơi khô ráo, dưới 30°C.',
      productDossier: 'Số ĐKSP: 8901/2024/ĐKSP — Giấy tiếp nhận đăng ký bản công bố sản phẩm.',
    },
  },
  {
    slug: 'pharton-nature-dsh',
    name: 'Pharton Nature DSH',
    categorySlug: 'ho-tro-giac-ngu',
    price: 210000,
    originalPrice: 250000,
    shortDescription: 'Hỗ trợ an thần, hỗ trợ tạo giấc ngủ ngon và sâu, hỗ trợ giảm căng thẳng thần kinh.',
    imageFilenames: ['pharton.png'],
    tabs: {
      description:
        'Pharton Nature DSH kết hợp thảo mộc an thần tự nhiên như Tâm sen, Lạc tiên, Vông nem giúp hỗ trợ xoa dịu thần kinh, dễ đi vào giấc ngủ và ngủ sâu giấc hơn.',
      ingredients:
        'Chiết xuất Lạc tiên: 200mg, Chiết xuất Tâm sen: 150mg, Chiết xuất Vông nem: 100mg, Melatonin: 1.5mg, Vitamin B1: 2mg.',
      usage:
        'Hỗ trợ dưỡng tâm an thần, hỗ trợ cải thiện chất lượng giấc ngủ tự nhiên, hỗ trợ mang lại cảm giác thư thái sau khi thức dậy.',
      targetUsers:
        'Người hay bị trằn trọc khó ngủ, ngủ không sâu giấc, người bị rối loạn giấc ngủ do thay đổi múi giờ hoặc căng thẳng công việc.',
      howToUse: 'Uống 1-2 viên trước khi đi ngủ khoảng 30 - 60 phút.',
      specification: 'Hộp 30 viên nang.',
      storage: 'Nơi khô mát, tránh ánh nắng mặt trời.',
      productDossier: 'Số ĐKSP: 9012/2024/ĐKSP — Được cấp phép bởi Cục An toàn Thực phẩm.',
    },
  },
]

async function main() {
  await loadEnv()

  const { getPayload } = await import('payload')
  const { default: configPromise } = await import('../src/payload.config')

  const payload = await getPayload({ config: configPromise })

  console.log('[seed-data] 1. Khởi tạo danh mục sản phẩm...')
  const categoryMap = new Map<string, number>()

  for (const cat of CATEGORIES) {
    const existing = await payload.find({
      collection: 'product-categories',
      where: { slug: { equals: cat.slug } },
      limit: 1,
    })

    if (existing.totalDocs > 0) {
      const catId = Number(existing.docs[0].id)
      categoryMap.set(cat.slug, catId)
      console.log(`  ~ Danh mục đã tồn tại: ${cat.name} (ID: ${catId})`)
    } else {
      const created = await payload.create({
        collection: 'product-categories',
        data: {
          name: cat.name,
          slug: cat.slug,
        },
      })
      const catId = Number(created.id)
      categoryMap.set(cat.slug, catId)
      console.log(`  + Đã tạo danh mục: ${cat.name} (ID: ${catId})`)
    }
  }

  console.log('[seed-data] 2. Upload hình ảnh từ D:\\DSH-NATURE\\san-pham vào Media collection...')
  const mediaMap = new Map<string, number>()
  const sanPhamDir = path.resolve(process.cwd(), 'san-pham')

  for (const item of MEDIA_FILES) {
    const existingMedia = await payload.find({
      collection: 'media',
      where: { filename: { equals: item.filename } },
      limit: 1,
    })

    if (existingMedia.totalDocs > 0) {
      const mId = Number(existingMedia.docs[0].id)
      mediaMap.set(item.filename, mId)
      console.log(`  ~ Media đã tồn tại: ${item.filename} (ID: ${mId})`)
    } else {
      const filePath = path.join(sanPhamDir, item.filename)
      if (!fs.existsSync(filePath)) {
        console.warn(`  ! File không tồn tại: ${filePath}`)
        continue
      }

      try {
        const createdMedia = await payload.create({
          collection: 'media',
          data: { alt: item.alt },
          filePath,
        })
        const mId = Number(createdMedia.id)
        mediaMap.set(item.filename, mId)
        console.log(`  + Đã upload media: ${item.filename} (ID: ${mId})`)
      } catch (err) {
        console.error(`  ! Lỗi upload media ${item.filename}:`, err)
      }
    }
  }

  console.log('[seed-data] 3. Tạo/Cập nhật dữ liệu sản phẩm...')
  for (const prod of PRODUCTS_SEED) {
    const categoryId = categoryMap.get(prod.categorySlug)
    if (!categoryId) {
      console.warn(`  ! Không tìm thấy ID danh mục cho ${prod.categorySlug}`)
      continue
    }

    const images: { image: number }[] = prod.imageFilenames
      .map((fname) => mediaMap.get(fname))
      .filter((id): id is number => id !== undefined)
      .map((id) => ({ image: id }))

    // Tìm sản phẩm trùng slug HOẶC sản phẩm nháp cũ
    const existingProd = await payload.find({
      collection: 'products',
      where: {
        or: [
          { slug: { equals: prod.slug } },
          { name: { contains: prod.name.split(' ')[0] } },
        ],
      },
      limit: 1,
    })

    const productData = {
      name: prod.name,
      slug: prod.slug,
      category: categoryId,
      price: prod.price,
      originalPrice: prod.originalPrice,
      shortDescription: prod.shortDescription,
      images,
      tabs: prod.tabs,
    }

    if (existingProd.totalDocs > 0) {
      const targetId = existingProd.docs[0].id
      const updated = await payload.update({
        collection: 'products',
        id: targetId,
        data: productData,
      })
      console.log(`  ~ Đã cập nhật sản phẩm: ${prod.name} (ID: ${targetId})`)
    } else {
      const created = await payload.create({
        collection: 'products',
        data: productData,
      })
      console.log(`  + Đã tạo sản phẩm mới: ${prod.name} (ID: ${created.id})`)
    }
  }

  console.log('[seed-data] Hoàn tất khởi tạo dữ liệu sản phẩm & media!')
  process.exit(0)
}

main().catch((err) => {
  console.error('[seed-data] Lỗi khi seed sản phẩm:', err)
  process.exit(1)
})
