/**
 * Menu chính — thứ tự đã CHỐT CỨNG (PROJECT_BRIEF.md mục 2, mục 1: "Không tự ý
 * đổi thứ tự menu hoặc thêm mục menu mới"). Dùng chung cho Navigation (desktop)
 * và MobileMenu (drawer) để không lệch thứ tự giữa 2 nơi.
 */
export const NAV_ITEMS = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Giới thiệu', href: '/gioi-thieu' },
  { label: 'Sản phẩm', href: '/san-pham' },
  { label: 'Giỏ hàng', href: '/gio-hang' },
  { label: 'Kiến thức sức khỏe', href: '/kien-thuc' },
  { label: 'Tư vấn sức khỏe', href: '/tu-van' },
  { label: 'Đại lý', href: '/dai-ly' },
  { label: 'Blog', href: '/blog' },
  { label: 'Liên hệ', href: '/lien-he' },
] as const

/** Bottom nav mobile — 5 mục cố định theo brief mục 2. */
export const BOTTOM_NAV_ITEMS = [
  { label: 'Trang chủ', href: '/', icon: 'home' },
  { label: 'Sản phẩm', href: '/san-pham', icon: 'package' },
  { label: 'Giỏ hàng', href: '/gio-hang', icon: 'cart' },
  { label: 'Kiến thức', href: '/kien-thuc', icon: 'book' },
  { label: 'Tài khoản', href: '/tai-khoan', icon: 'user' },
] as const
