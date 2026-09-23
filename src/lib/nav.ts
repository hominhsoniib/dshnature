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
    logo?: string | null;
  }[];
};

export function getNavItems(
  partners?: { name: string; url: string; logo?: { url?: string | null } | string | null }[] | null
): NavItem[] {
  const partnerChildren =
    partners && partners.length > 0
      ? partners.map((p) => {
          const logoUrl = typeof p.logo === 'object' ? p.logo?.url : typeof p.logo === 'string' ? p.logo : null;
          return {
            label: p.name,
            href: p.url,
            external: true,
            logo: logoUrl,
          };
        })
      : [
          {
            label: 'CTY CP BÀ ĐEN FARM',
            href: 'https://ando.badenfarm.com.vn/',
            external: true,
            logo: null,
          },
        ];

  const firstPartnerHref = partnerChildren[0]?.href ?? 'https://ando.badenfarm.com.vn/';

  return [
    { label: 'Trang chủ', href: '/' },
    { label: 'Giới thiệu', href: '/gioi-thieu' },
    { label: 'Sản phẩm', href: '/san-pham' },
    { label: 'Giỏ hàng', href: '/gio-hang' },
    { label: 'Kiến thức sức khỏe', href: '/kien-thuc' },
    { label: 'Tư vấn sức khỏe', href: '/tu-van' },
    { label: 'Đại lý', href: '/dai-ly' },
    {
      label: 'Đối tác',
      href: firstPartnerHref,
      external: true,
      children: partnerChildren,
    },
    { label: 'Blog', href: '/blog' },
    { label: 'Liên hệ', href: '/lien-he' },
  ];
}

export const NAV_ITEMS: NavItem[] = getNavItems();

/** Bottom nav mobile — 5 mục cố định theo brief mục 2. */
export const BOTTOM_NAV_ITEMS = [
  { label: 'Trang chủ', href: '/', icon: 'home' },
  { label: 'Sản phẩm', href: '/san-pham', icon: 'package' },
  { label: 'Giỏ hàng', href: '/gio-hang', icon: 'cart' },
  { label: 'Kiến thức', href: '/kien-thuc', icon: 'book' },
  { label: 'Tài khoản', href: '/tai-khoan', icon: 'user' },
] as const;
