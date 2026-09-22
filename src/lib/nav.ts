/**
 * Menu chính — Dùng chung cho Navigation (desktop), MobileMenu (drawer) và Footer.
 */
export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
  children?: {
    label: string;
    href: string;
    external?: boolean;
  }[];
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Giới thiệu', href: '/gioi-thieu' },
  { label: 'Sản phẩm', href: '/san-pham' },
  { label: 'Giỏ hàng', href: '/gio-hang' },
  { label: 'Kiến thức sức khỏe', href: '/kien-thuc' },
  { label: 'Tư vấn sức khỏe', href: '/tu-van' },
  { label: 'Đại lý', href: '/dai-ly' },
  {
    label: 'Đối tác',
    href: 'https://ando.badenfarm.com.vn/',
    external: true,
    children: [
      {
        label: 'CTY CP BÀ ĐEN FARM',
        href: 'https://ando.badenfarm.com.vn/',
        external: true,
      },
    ],
  },
  { label: 'Blog', href: '/blog' },
  { label: 'Liên hệ', href: '/lien-he' },
];

/** Bottom nav mobile — 5 mục cố định theo brief mục 2. */
export const BOTTOM_NAV_ITEMS = [
  { label: 'Trang chủ', href: '/', icon: 'home' },
  { label: 'Sản phẩm', href: '/san-pham', icon: 'package' },
  { label: 'Giỏ hàng', href: '/gio-hang', icon: 'cart' },
  { label: 'Kiến thức', href: '/kien-thuc', icon: 'book' },
  { label: 'Tài khoản', href: '/tai-khoan', icon: 'user' },
] as const;
