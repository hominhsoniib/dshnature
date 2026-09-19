export interface ProductDetail {
  slug: string;
  name: string;
  categorySlug: string;
  categoryName: string;
  price: number;
  originalPrice?: number;
  images: string[];
  shortDescription: string;
  tabs: {
    description: string;
    ingredients: string;
    usage: string;
    targetUsers: string;
    howToUse: string;
    specification: string;
    storage: string;
    productDossier: string;
  };
}

export const PRODUCTS_LIST: ProductDetail[] = [
  {
    slug: "euginca-an-phe-dsh",
    name: "Euginca An Phế DSH",
    categorySlug: "ho-hap",
    categoryName: "Hỗ trợ hô hấp",
    price: 180000,
    originalPrice: 220000,
    images: ["/san-pham/euginca-chai.png", "/san-pham/euginca-tui.png"],
    shortDescription: "Hỗ trợ bổ phế, giảm ho, giảm đờm, hỗ trợ giảm đau rát họng do viêm họng.",
    tabs: {
      description:
        "Euginca An Phế DSH là sản phẩm chiết xuất từ thảo dược thiên nhiên như húng chanh, tràm, gừng, tần dày lá giúp làm dịu cổ họng, hỗ trợ đường hô hấp khỏe mạnh.",
      ingredients:
        "Chiết xuất Húng chanh: 100mg, Tinh dầu Tràm: 50mg, Chiết xuất Gừng: 40mg, Chiết xuất Tần dày lá: 30mg. Phụ liệu vừa đủ 1 viên.",
      usage:
        "Hỗ trợ bổ phế, hỗ trợ làm dịu cơn ho, giảm đờm, hỗ trợ làm giảm cảm giác đau rát cổ họng và ngứa họng do viêm họng thông thường.",
      targetUsers:
        "Người bị ho khô, ho có đờm, đau rát họng, ngứa cổ họng do thay đổi thời tiết hoặc tiếp xúc môi trường nhiều bụi bẩn.",
      howToUse:
        "Trẻ em trên 6 tuổi và người lớn: Uống 1-2 viên/lần, ngày 2-3 lần sau bữa ăn. Hoặc ngậm trực tiếp theo hướng dẫn chuyên gia.",
      specification: "Chai 60 viên hoặc Hộp 10 vỉ x 10 viên.",
      storage: "Bảo quản nơi khô ráo, thoáng mát, nhiệt độ dưới 30°C, tránh ánh nắng trực tiếp.",
      productDossier:
        "Số ĐKSP: 6789/2024/ĐKSP — Cục An toàn Thực phẩm Bộ Y tế cấp phép lưu hành toàn quốc.",
    },
  },
  {
    slug: "vien-khop-dsh",
    name: "Viên khớp DSH",
    categorySlug: "xuong-khop",
    categoryName: "Hỗ trợ xương khớp",
    price: 250000,
    originalPrice: 290000,
    images: ["/san-pham/xuong-khop.png"],
    shortDescription: "Hỗ trợ dưỡng khớp, hỗ trợ tăng tiết dịch khớp, giúp khớp vận động linh hoạt.",
    tabs: {
      description:
        "Viên khớp DSH kết hợp thảo dược truyền thống cùng Glucosamine giúp hỗ trợ sức khỏe xương khớp, mang lại sự linh hoạt trong vận động hằng ngày cho người lớn tuổi và người hoạt động thể lực.",
      ingredients:
        "Glucosamine Sulfate: 500mg, Chiết xuất Dây đau xương: 150mg, Chiết xuất Khúc khắc: 100mg, Chiết xuất Độc hoạt: 80mg, Collagen Type II: 50mg.",
      usage:
        "Hỗ trợ bổ sung dưỡng chất cho khớp, hỗ trợ duy trì độ đàn hồi của sụn khớp, giúp khớp vận động dễ dàng và linh hoạt.",
      targetUsers:
        "Người trưởng thành, người lớn tuổi mong muốn hỗ trợ chăm sóc sức khỏe xương khớp, người vận động nhiều gây mỏi khớp.",
      howToUse: "Uống 1 viên/lần, ngày 2 lần sau khi ăn sáng và ăn tối.",
      specification: "Hộp 60 viên nén bao phim.",
      storage: "Nơi khô ráo, tránh ánh sáng trực tiếp, để xa tầm tay trẻ em.",
      productDossier: "Số ĐKSP: 7890/2024/ĐKSP — Xác nhận công bố phù hợp quy định an toàn thực phẩm.",
    },
  },
  {
    slug: "ginkgo-nature-extra-q10",
    name: "Ginkgo Nature Extra Q10",
    categorySlug: "tuan-hoan-nao-bo",
    categoryName: "Hỗ trợ tuần hoàn – não bộ",
    price: 320000,
    originalPrice: 380000,
    images: ["/san-pham/ginkgo.png"],
    shortDescription: "Hỗ trợ tăng cường tuần hoàn máu não, hỗ trợ giảm các triệu chứng hoa mắt, chóng mặt.",
    tabs: {
      description:
        "Ginkgo Nature Extra Q10 được chiết xuất từ lá Bạch quả (Ginkgo Biloba) chuẩn hóa kết hợp Coenzyme Q10 giúp hỗ trợ duy trì sự minh mẫn và khả năng tập trung tinh thần.",
      ingredients:
        "Ginkgo Biloba Extract: 120mg, Coenzyme Q10: 20mg, Cao Đinh lăng: 50mg, Magnesi oxyd: 30mg, Vitamin B6: 2mg.",
      usage:
        "Hỗ trợ tăng cường lưu thông máu não, hỗ trợ giảm nguy cơ suy giảm trí nhớ ở người lớn tuổi, giúp tinh thần tỉnh táo và tập trung làm việc.",
      targetUsers:
        "Người lớn tuổi cần hỗ trợ trí nhớ, người làm việc trí óc căng thẳng, thường xuyên mệt mỏi, hoa mắt chóng mặt.",
      howToUse: "Uống 1 viên/ngày vào buổi sáng sau bữa ăn.",
      specification: "Lọ 60 viên nang mềm.",
      storage: "Bảo quản nơi khô ráo, dưới 30°C.",
      productDossier: "Số ĐKSP: 8901/2024/ĐKSP — Giấy tiếp nhận đăng ký bản công bố sản phẩm.",
    },
  },
  {
    slug: "pharton-nature-dsh",
    name: "Pharton Nature DSH",
    categorySlug: "giac-ngu",
    categoryName: "Hỗ trợ giấc ngủ",
    price: 210000,
    originalPrice: 250000,
    images: ["/san-pham/euginca-tui.png"],
    shortDescription: "Hỗ trợ an thần, hỗ trợ tạo giấc ngủ ngon và sâu, hỗ trợ giảm căng thẳng thần kinh.",
    tabs: {
      description:
        "Pharton Nature DSH kết hợp thảo mộc an thần tự nhiên như Tâm sen, Lạc tiên, Vông nem giúp hỗ trợ xoa dịu thần kinh, dễ đi vào giấc ngủ và ngủ sâu giấc hơn.",
      ingredients:
        "Chiết xuất Lạc tiên: 200mg, Chiết xuất Tâm sen: 150mg, Chiết xuất Vông nem: 100mg, Melatonin: 1.5mg, Vitamin B1: 2mg.",
      usage:
        "Hỗ trợ dưỡng tâm an thần, hỗ trợ cải thiện chất lượng giấc ngủ tự nhiên, hỗ trợ mang lại cảm giác thư thái sau khi thức dậy.",
      targetUsers:
        "Người hay bị trằn trọc khó ngủ, ngủ không sâu giấc, người bị rối loạn giấc ngủ do thay đổi múi giờ hoặc căng thẳng công việc.",
      howToUse: "Uống 1-2 viên trước khi đi ngủ khoảng 30 - 60 phút.",
      specification: "Hộp 30 viên nang.",
      storage: "Nơi khô mát, tránh ánh nắng mặt trời.",
      productDossier: "Số ĐKSP: 9012/2024/ĐKSP — Được cấp phép bởi Cục An toàn Thực phẩm.",
    },
  },
];

export function getProductBySlug(slug: string): ProductDetail | undefined {
  return PRODUCTS_LIST.find((p) => p.slug === slug);
}
