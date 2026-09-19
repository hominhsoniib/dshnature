/**
 * DỮ LIỆU CHUẨN CHO HOMEPAGE & STOREFRONT (DSH NATURE)
 *
 * Tuân thủ quy định y tế (Nghị định 15/2018/NĐ-CP): Không dùng các từ chữa bệnh, điều trị.
 */

export const mockProductCategories = [
  { slug: 'ho-hap', name: 'Hỗ trợ hô hấp' },
  { slug: 'xuong-khop', name: 'Hỗ trợ xương khớp' },
  { slug: 'tuan-hoan-nao-bo', name: 'Hỗ trợ tuần hoàn – não bộ' },
  { slug: 'giac-ngu', name: 'Hỗ trợ giấc ngủ' },
] as const;

export const mockFeaturedProducts = [
  {
    slug: 'euginca-an-phe-dsh',
    name: 'Euginca An Phế DSH',
    categorySlug: 'ho-hap',
    shortDescription: 'Hỗ trợ bổ phế, giảm ho, giảm đờm, làm dịu cổ họng.',
  },
  {
    slug: 'vien-khop-dsh',
    name: 'Viên khớp DSH',
    categorySlug: 'xuong-khop',
    shortDescription: 'Hỗ trợ dưỡng khớp, hỗ trợ tăng tiết dịch khớp linh hoạt.',
  },
  {
    slug: 'ginkgo-nature-extra-q10',
    name: 'Ginkgo Nature Extra Q10',
    categorySlug: 'tuan-hoan-nao-bo',
    shortDescription: 'Hỗ trợ tăng cường tuần hoàn máu não, hỗ trợ trí nhớ.',
  },
  {
    slug: 'pharton-nature-dsh',
    name: 'Pharton Nature DSH',
    categorySlug: 'giac-ngu',
    shortDescription: 'Hỗ trợ an thần, tạo giấc ngủ ngon và sâu hơn.',
  },
] as const;

export const mockAboutSection = {
  heading: 'Về DSH Nature',
  body: 'Công ty Cổ phần DSH Nature là thương hiệu chăm sóc sức khỏe uy tín tại Việt Nam. Chúng tôi cam kết mang đến những giải pháp bảo vệ sức khỏe an toàn, tinh khiết từ nguồn thảo dược thiên nhiên chọn lọc kết hợp cùng công nghệ nghiên cứu hiện đại.',
};

export const mockMissionVision = {
  mission: 'Đồng hành cùng sức khỏe mọi gia đình Việt Nam bằng những giải pháp chăm sóc sức khỏe an toàn, tinh khiết từ tự nhiên và đáng tin cậy.',
  vision: 'Trở thành biểu tượng uy tín hàng đầu trong ngành thảo dược chăm sóc sức khỏe gia đình tại Việt Nam và mở rộng quy mô hệ thống phân phối toàn quốc.',
};

export const mockCoreValues = [
  {
    title: 'Chất lượng',
    description: 'Nguồn nguyên liệu đầu vào tinh sạch, quy trình kiểm định nghiêm ngặt từ khâu thu hái đến thành phẩm.',
  },
  {
    title: 'An toàn',
    description: 'Đảm bảo các tiêu chuẩn an toàn thực phẩm, tuân thủ đúng quy định pháp luật và Bộ Y tế.',
  },
  {
    title: 'Khoa học',
    description: 'Kế thừa bài thuốc thảo dược kết hợp cùng các công trình nghiên cứu khoa học hiện đại.',
  },
  {
    title: 'Uy tín',
    description: 'Luôn giữ vững cam kết về nguồn gốc, công bố minh bạch và tận tụy tư vấn cho khách hàng.',
  },
  {
    title: 'Bền vững',
    description: 'Hướng đến phát triển bền vững cùng môi trường, đồng hành dài lâu cùng sức khỏe cộng đồng.',
  },
] as const;

export const mockHealthArticles = [
  {
    slug: 'bi-quyet-bao-ve-he-ho-hap-khi-thay-doi-thoi-tiet',
    title: 'Bí quyết bảo vệ hệ hô hấp cho cả gia đình khi thời tiết giao mùa',
    category: 'Hô hấp & Phế quản',
  },
  {
    slug: 'huong-dan-cham-soc-suc-khoe-xuong-khop-cho-nguoi-cao-tuoi',
    title: 'Hướng dẫn chăm sóc sức khỏe xương khớp vận động linh hoạt cho người cao tuổi',
    category: 'Xương khớp & Vận động',
  },
  {
    slug: 'giai-phap-ho-tro-tuan-hoan-mau-nao-giam-cang-thang',
    title: 'Giải pháp hỗ trợ tuần hoàn máu não và giảm căng thẳng cho người làm việc trí óc',
    category: 'Tuần hoàn & Não bộ',
  },
] as const;

export const mockBlogArticles = [
  {
    slug: 'dsh-nature-trao-tang-qua-suc-khoe-cho-cong-dong',
    title: 'DSH Nature đồng hành cùng chương trình trao tặng quà sức khỏe cho cộng đồng',
    category: 'Hoạt động xã hội',
  },
  {
    slug: 'hanh-trinh-phat-trien-thuong-hieu-dsh-nature',
    title: 'Hành trình phát triển thương hiệu DSH Nature — Đồng hành cùng sức khỏe gia đình',
    category: 'Thông tin thương hiệu',
  },
] as const;
