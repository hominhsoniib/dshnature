/**
 * MOCK DATA — TẠM THỜI cho PHASE 1 (Homepage).
 *
 * Các mảng dưới đây thuộc phạm vi PHASE 2 (products, nội dung Giới thiệu) và
 * PHASE 4 (articles — Kiến thức sức khỏe/Blog) theo PROJECT_BRIEF.md mục 13.
 * Dựng Payload collection thật cho chúng ngay ở Phase 1 là làm trước phase
 * (vi phạm mục 0: "Không cố làm tất cả trong một bước"), nên tạm mock ở đây,
 * tách riêng file để xoá/thay bằng query Payload thật khi tới đúng phase.
 *
 * Wording công dụng sản phẩm dưới đây CHỈ mang tính placeholder bố cục, không
 * phải nội dung final — vẫn tuân thủ mục 1 (không claim điều trị/chữa bệnh).
 */

// TODO(Phase 2): thay bằng payload.find({ collection: 'product-categories' }).
export const mockProductCategories = [
  { slug: 'ho-hap', name: 'Hỗ trợ hô hấp' },
  { slug: 'xuong-khop', name: 'Hỗ trợ xương khớp' },
  { slug: 'tuan-hoan-nao-bo', name: 'Hỗ trợ tuần hoàn – não bộ' },
  { slug: 'giac-ngu', name: 'Hỗ trợ giấc ngủ' },
] as const

// TODO(Phase 2): thay bằng payload.find({ collection: 'products', where: { featured } }).
// Tên sản phẩm lấy từ PROJECT_BRIEF.md mục 11 (sample data đã chốt).
export const mockFeaturedProducts = [
  {
    slug: 'euginca-an-phe-dsh',
    name: 'Euginca An Phế DSH',
    categorySlug: 'ho-hap',
    shortDescription: 'Hỗ trợ đường hô hấp, dùng đều đặn theo hướng dẫn.',
  },
  {
    slug: 'vien-khop-dsh',
    name: 'Viên khớp DSH',
    categorySlug: 'xuong-khop',
    shortDescription: 'Hỗ trợ sức khỏe xương khớp cho vận động hằng ngày.',
  },
  {
    slug: 'ginkgo-nature-extra-q10',
    name: 'Ginkgo Nature Extra Q10',
    categorySlug: 'tuan-hoan-nao-bo',
    shortDescription: 'Hỗ trợ tuần hoàn máu não, tăng cường tập trung.',
  },
  {
    slug: 'pharton-nature-dsh',
    name: 'Pharton Nature DSH',
    categorySlug: 'giac-ngu',
    shortDescription: 'Hỗ trợ giấc ngủ ngon và sâu hơn.',
  },
] as const

// TODO(Phase 2): brief chưa cung cấp nội dung thật cho "Về DSH Nature" — cần
// khách hàng xác nhận trước khi thay placeholder này.
export const mockAboutSection = {
  heading: 'Về DSH Nature',
  body: '[TODO: nội dung giới thiệu công ty thật — chờ khách hàng cung cấp ở Phase 2]',
}

// TODO(Phase 2): tương tự — nội dung Sứ mệnh/Tầm nhìn thật chưa có trong brief.
export const mockMissionVision = {
  mission: '[TODO: Sứ mệnh — chờ nội dung thật]',
  vision: '[TODO: Tầm nhìn — chờ nội dung thật]',
}

// Brief mục 7 (section 02) đặt tên 5 giá trị rõ ràng — không suy diễn.
// Section 07 "Giá trị cốt lõi" brief không nêu tên riêng, tạm dùng chung 5 giá
// trị này (TODO: xác nhận với khách hàng nếu 2 bộ giá trị này khác nhau).
export const mockCoreValues = [
  { title: 'Chất lượng', description: '[TODO: mô tả chi tiết — chờ nội dung thật]' },
  { title: 'An toàn', description: '[TODO: mô tả chi tiết — chờ nội dung thật]' },
  { title: 'Khoa học', description: '[TODO: mô tả chi tiết — chờ nội dung thật]' },
  { title: 'Uy tín', description: '[TODO: mô tả chi tiết — chờ nội dung thật]' },
  { title: 'Bền vững', description: '[TODO: mô tả chi tiết — chờ nội dung thật]' },
] as const

// TODO(Phase 4): thay bằng payload.find({ collection: 'articles', where: { type: 'healthKnowledge' } }).
// Brief mục 5 nói "6 category" nhưng không nêu tên — tạm 1 nhóm placeholder.
export const mockHealthArticles = [
  {
    slug: 'bai-viet-mau-1',
    title: '[TODO: tiêu đề bài viết Kiến thức sức khỏe — chờ nội dung thật]',
    category: 'Chưa xác định danh mục',
  },
  {
    slug: 'bai-viet-mau-2',
    title: '[TODO: tiêu đề bài viết Kiến thức sức khỏe — chờ nội dung thật]',
    category: 'Chưa xác định danh mục',
  },
  {
    slug: 'bai-viet-mau-3',
    title: '[TODO: tiêu đề bài viết Kiến thức sức khỏe — chờ nội dung thật]',
    category: 'Chưa xác định danh mục',
  },
] as const

// TODO(Phase 4): thay bằng payload.find({ collection: 'articles', where: { type: 'blog' } }).
// Brief mục 5 nói "4 category" nhưng không nêu tên — tạm placeholder.
export const mockBlogArticles = [
  {
    slug: 'blog-mau-1',
    title: '[TODO: tiêu đề bài Blog — chờ nội dung thật]',
    category: 'Chưa xác định danh mục',
  },
  {
    slug: 'blog-mau-2',
    title: '[TODO: tiêu đề bài Blog — chờ nội dung thật]',
    category: 'Chưa xác định danh mục',
  },
] as const
