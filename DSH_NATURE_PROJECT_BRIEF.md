# DSH NATURE — PROJECT BRIEF (đưa cho Claude Code để triển khai)

> File này là bản chốt kiến trúc cuối cùng, dùng làm prompt khởi động cho Claude Code.
> KHÔNG được đổi các mục đánh dấu 🔒 (đã chốt cứng theo yêu cầu gốc của khách hàng).

---

## 0. VAI TRÒ & QUY TRÌNH LÀM VIỆC BẮT BUỘC

Bạn là Senior Full-Stack Engineer + UI/UX Designer + Product Architect + SEO Specialist.
Xây dựng website chính thức cho **CÔNG TY CỔ PHẦN DSH NATURE**.

Brand message: "ĐỒNG HÀNH CÙNG SỨC KHỎE GIA ĐÌNH"
Cảm giác thương hiệu: Natural + Professional + Premium + Trustworthy + Modern + Healthcare + Vietnamese

**Quy trình bắt buộc mỗi phase:**
1. Run build → 2. TypeScript check → 3. Lint → 4. Fix errors → 5. Kiểm tra responsive
→ 6. Kiểm tra navigation → 7. Kiểm tra DB/API → 8. Phase ổn định mới chuyển phase tiếp theo.

Không cố làm tất cả trong một bước. Nếu phát hiện requirement chưa rõ → đánh dấu TODO, tiếp tục phần đã rõ, không tự suy diễn.

---

## 1. RÀNG BUỘC KHÔNG ĐƯỢC ĐỔI 🔒

- Không dùng chữ **"Bán hàng"** hoặc **"Cửa hàng"** làm tên menu/tiêu đề hiển thị (nhưng chức năng thương mại điện tử — giỏ hàng, thanh toán, đơn hàng — vẫn đầy đủ 100%, chỉ đổi tên gọi thành "Giỏ hàng")
- Không thêm "Nhà máy / Quy trình sản xuất"
- Không tự ý đổi thứ tự menu hoặc thêm mục menu mới
- **Cấm tuyệt đối** các từ trong nội dung sản phẩm: "chữa bệnh", "điều trị", "trị dứt điểm", "thay thế thuốc" (tuân thủ Nghị định 15/2018/NĐ-CP về quảng cáo TPCN) — cần validate hook ở tầng Payload trước khi lưu
- Không dùng ảnh: bệnh viện, cấp cứu, bệnh nhân nặng, điều trị bệnh
- Không tạo ảnh sản phẩm giả có nhãn hiệu gây hiểu nhầm là thật — nếu chưa có ảnh thật, dùng placeholder rõ ràng
- Admin không hard-code dữ liệu — toàn bộ nội dung phải sửa được qua Admin CMS

---

## 2. HEADER 🔒 (thứ tự cố định)

```
DSH NATURE
TRANG CHỦ | GIỚI THIỆU | SẢN PHẨM | 🛒 GIỎ HÀNG(n) | KIẾN THỨC SỨC KHỎE
TƯ VẤN SỨC KHỎE | ĐẠI LÝ | BLOG | LIÊN HỆ                    🔍 👤
```
Sticky khi scroll. Mobile: hamburger drawer + bottom nav (Trang chủ/Sản phẩm/Giỏ hàng/Kiến thức/Tài khoản).

---

## 3. TECH STACK (CHỐT)

| Layer | Công nghệ |
|---|---|
| Frontend | Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui |
| Content/Admin CMS | **Payload CMS 3.x** (nhúng trong Next.js App Router, cùng repo) |
| Business logic API | Next.js API routes + Prisma (Orders, Customers, Dealers, Consultations) |
| Database | PostgreSQL trên **Neon** |
| Media Storage | **Cloudflare R2** (qua `@payloadcms/storage-s3`) |
| Auth khách hàng | NextAuth — Email/Password + Google OAuth |
| Auth admin | Payload built-in auth (tách biệt hoàn toàn với NextAuth khách hàng) |
| Validation | Zod |
| Icons | Lucide React |
| Email | Resend |
| Thanh toán | VNPay + MoMo + COD |
| Vận chuyển | Bảng phí cố định theo khu vực (cấu hình trong Site Settings), không tích hợp API GHTK/GHN ở MVP |
| Ngôn ngữ | Chỉ tiếng Việt (không build i18n ở MVP) |
| Deploy | Vercel (frontend + API) |

---

## 4. KIẾN TRÚC ADMIN — HYBRID

**Payload CMS quản lý (no-code content):**
`products`, `product-categories`, `articles` (dùng chung cho Health Knowledge + Blog qua field `type`), `banners`, `partners`, `certifications`, `faqs`, `team-members`, `media`, `pages`, global `site-settings`

**Custom API + Prisma quản lý (business logic có workflow trạng thái):**
`customers`, `addresses`, `orders`, `order_items`, `payments`, `shipments`, `dealers`, `dealer_regions`, `dealer_documents`, `consultation_requests`, `reviews`, `wishlists`, `newsletter_subscribers`, `contact_requests`, `notifications`, `users/roles/permissions` (nhân sự admin, không phải Payload user)

---

## 5. SITEMAP & ROUTE MAP

```
/                       Trang chủ (12 section — xem mục 7)
/gioi-thieu             Giới thiệu (Tổng quan, Sứ mệnh, Tầm nhìn, Giá trị, Định hướng, Chứng nhận, Đội ngũ)
/san-pham               Danh sách SP (filter 4 nhóm + search + sort)
/san-pham/[slug]        Chi tiết SP (gallery + tabs: Mô tả/Thành phần/Công dụng/Đối tượng/Cách dùng/Quy cách/Bảo quản/Hồ sơ)
/gio-hang               Giỏ hàng
/thanh-toan             Checkout (COD/Chuyển khoản/VNPay/MoMo)
/kien-thuc, /kien-thuc/[slug]   Kiến thức sức khỏe (6 category)
/tu-van                 Tư vấn sức khỏe (form + FAQ + chuyên gia)
/dai-ly                 Đại lý (chính sách + tìm đại lý + đăng ký + khu vực)
/blog, /blog/[slug]     Blog (4 category)
/lien-he                Liên hệ (thông tin + form + map)
/tai-khoan              Customer dashboard (protected — NextAuth)
/admin/*                Payload Admin (protected — Payload auth)
/admin/orders, /admin/dealers, /admin/consultations   Back-office custom (protected — role-based)
```

4 nhóm sản phẩm 🔒: Hỗ trợ hô hấp | Hỗ trợ xương khớp | Hỗ trợ tuần hoàn – não bộ | Hỗ trợ giấc ngủ

---

## 6. DESIGN TOKENS

```ts
colors: {
  primary: { DEFAULT: '#087443', dark: '#005C36', light: '#EAF6EF' },
  cream: '#F7FAF4', white: '#FFFFFF',
},
fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
borderRadius: { sm: '12px', md: '16px', lg: '20px' },
boxShadow: {
  soft: '0 4px 20px rgba(0,0,0,0.06)',
  softHover: '0 8px 30px rgba(0,0,0,0.10)',
},
```
Nguyên tắc: không gradient mạnh, không quá 2-3 màu/section, shadow luôn "soft".

Breakpoints kiểm tra: Desktop 1920/1440/1280 · Tablet 1024/768 · Mobile 430/390/375/360.

---

## 7. TRANG CHỦ — 12 SECTION (thứ tự cố định)

01 Hero (slider 3-4 banner, CTA: Khám phá sản phẩm / Tìm hiểu DSH Nature)
02 Giá trị nổi bật (5 card: Chất lượng/An toàn/Khoa học/Uy tín/Bền vững)
03 Danh mục sản phẩm (4 nhóm)
04 Sản phẩm nổi bật (grid/carousel)
05 Về DSH Nature (ảnh + text công ty)
06 Sứ mệnh & Tầm nhìn
07 Giá trị cốt lõi (5 giá trị dạng card/timeline)
08 Kiến thức sức khỏe (tabs theo category + article card)
09 Tư vấn sức khỏe (CTA + form nhanh)
10 Đại lý (CTA đăng ký + tìm đại lý)
11 Blog (4 category)
12 Newsletter

Footer: logo + tagline + thông tin công ty + link menu + chính sách + social (Facebook/YouTube/TikTok/Zalo).
Floating contact: Hotline/Zalo/Messenger — không che CTA chính.

---

## 8. COMPONENT ARCHITECTURE

Layout: `Header`, `TopBar`, `Navigation`, `MobileMenu`, `Footer`, `FloatingContact`
Home: `Hero`, `SectionTitle`, `ValueCard`, `CategoryCard`
Product: `ProductCard`, `ProductGrid`, `ProductFilter`, `ProductGallery`
Cart: `CartItem`, `CartSummary`
Article: `ArticleCard`, `ArticleGrid`
Forms: `ConsultationForm`, `DealerForm`, `ContactForm`, `Newsletter` (Zod validate)
UI: `Modal`, `Toast`, `Pagination`, `Loading`, `EmptyState`, `ErrorState`, `Breadcrumb`, `SearchModal`

Nguyên tắc: component trình bày không tự fetch data — nhận props từ server component đã query Payload/Prisma.

---

## 9. FOLDER STRUCTURE

```
src/
├── app/
│   ├── (storefront)/         # toàn bộ route public
│   ├── (payload)/admin/      # Payload admin mount point
│   └── api/                  # business API: cart, checkout, orders, dealers, consultations
├── collections/               # Payload collection configs
├── components/{layout,product,cart,article,forms,ui}/
├── features/                  # logic theo domain
├── lib/                       # payload client, db, utils
├── hooks/
├── services/                  # payment (VNPay/MoMo), shipping
├── types/
├── prisma/                    # schema cho business tables
├── payload.config.ts
├── public/
└── styles/
```

---

## 10. PAYLOAD COLLECTIONS — SCHEMA GỐC

Tham khảo file thiết kế collections đã có: `product-categories`, `products` (với group `tabs`: description/ingredients/usage/targetUsers/howToUse/specification/storage/productDossier + group `seo`), `articles` (field `type`: healthKnowledge|blog), `banners`, `partners`/`certifications`/`faqs`/`team-members` (pattern tương tự), global `site-settings` (companyName/hotline/email/address/socials/floatingContact).

**Hook bắt buộc:** `beforeChange` trên `products.tabs.usage` và `products.tabs.description` → validate chặn từ khóa cấm ở mục 1.

**Media plugin:** `@payloadcms/storage-s3` trỏ Cloudflare R2 (biến môi trường: `R2_BUCKET`, `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`).

---

## 11. SAMPLE DATA (seed)

1. Euginca An Phế DSH — nhóm Hỗ trợ hô hấp
2. Viên khớp DSH — nhóm Hỗ trợ xương khớp
3. Ginkgo Nature Extra Q10 — nhóm Hỗ trợ tuần hoàn – não bộ
4. Pharton Nature DSH — nhóm Hỗ trợ giấc ngủ

Wording công dụng phải an toàn (không claim điều trị) và chỉnh sửa được qua Admin.

---

## 12. SEO / PERFORMANCE / SECURITY / UX (chuẩn bắt buộc)

- SEO: metadata, canonical, OpenGraph, Twitter Card, sitemap.xml, robots.txt, breadcrumb, Schema.org (Organization/Product/Article/BreadcrumbList/FAQPage)
- Performance: WebP/AVIF, lazy loading, code splitting, SSR/ISR hợp lý, responsive images — target Lighthouse Performance/SEO/Accessibility ≥ 90
- Security: NextAuth session, RBAC cho back-office, Zod input validation, CSRF khi phù hợp, rate limiting form, hash password, env vars không lộ secret
- UX states bắt buộc: Loading/Empty/Error/Success/Validation + Toast (ví dụ: "Đã thêm sản phẩm vào giỏ hàng.", "Đặt hàng thành công.", "Thông tin chưa hợp lệ.") — không để trang trắng khi lỗi

---

## 13. DEVELOPMENT PHASES

```
PHASE 0  Setup: Next.js + Payload + Neon Postgres + R2 + NextAuth + design tokens
PHASE 1  Design System, Header, Footer, Homepage (12 section)
PHASE 2  Giới thiệu, Products, Product Detail (data từ Payload)
PHASE 3  Cart, Checkout (VNPay/MoMo/COD), Customer Account (NextAuth)
PHASE 4  Health Knowledge, Blog, Consultation (Payload content + custom request flow)
PHASE 5  Dealer System (form + workflow duyệt trong back-office)
PHASE 6  Payload admin tinh chỉnh (RBAC, custom validation hook) + back-office custom (Orders/Dealers/Consultations)
PHASE 7  SEO, Performance, Security, Accessibility, QA cuối, deploy production
```

---

## 14. ACCEPTANCE CRITERIA

- [ ] Header đúng menu đã chốt, không có "Bán hàng"/"Cửa hàng"
- [ ] Giỏ hàng nằm ngay sau Sản phẩm
- [ ] Homepage/About/Product catalog/Product detail hoạt động đầy đủ
- [ ] Add to cart, Cart, Checkout (VNPay/MoMo/COD) hoạt động
- [ ] Customer account, Health Knowledge, Blog, Consultation, Dealer registration, Contact hoạt động
- [ ] Payload Admin + back-office custom hoạt động, admin sửa nội dung không cần code
- [ ] Responsive đầy đủ mobile/tablet/desktop
- [ ] SEO cơ bản hoàn chỉnh, không hard-code dữ liệu quan trọng
- [ ] Không có TypeScript error, không có build error
- [ ] Không có nội dung claim điều trị bệnh ở bất kỳ đâu

---

**→ Bắt đầu PHASE 0 ngay khi nhận file này.**
