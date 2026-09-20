# AUDIT REPORT — DSH Nature

**Ngày audit:** 2026-09-20
**Phạm vi:** Toàn bộ repo tại HEAD `e536dd6` (branch `main`, đã đồng bộ với `origin/main`).
**Phương pháp:** Đọc trực tiếp source code, cấu hình, `package.json`, git log/history, và hai tài liệu đã có sẵn trong repo (`SECURITY_AUDIT_REPORT.md`, `SECURITY_FIXES_APPLIED.md`, cùng ngày). Không suy đoán — mọi finding kèm đường dẫn file.
**Giới hạn quan trọng:** Môi trường thực thi audit này **không có Node.js/npm** (đã kiểm chứng qua nhiều cách: `which node`, `Get-Command node`, `where.exe node` đều không tìm thấy binary nào trên máy). Vì vậy **không thể tự chạy** `npm run build` / `type-check` / `lint` / bundle analyzer trong lượt audit này — mục 1 và 4 dựa trên đọc code tĩnh, không phải kết quả build thực tế. Đề xuất bạn tự chạy 3 lệnh này trên máy có Node.js trước khi merge/deploy.

---

## Mục lục

1. [Trạng thái repo & deploy](#1-trạng-thái-repo--deploy)
2. [Kiến trúc & cấu trúc thư mục](#2-kiến-trúc--cấu-trúc-thư-mục)
3. [Bảo mật](#3-bảo-mật)
4. [Hiệu năng](#4-hiệu-năng)
5. [SEO & metadata](#5-seo--metadata)
6. [Responsive & accessibility](#6-responsive--accessibility)
7. [Database & data layer](#7-database--data-layer)
8. [Payment & business logic](#8-payment--business-logic)
9. [Tổng kết](#9-tổng-kết)

---

## 1. Trạng thái repo & deploy

- **Git:** branch `main`, `HEAD = e536dd6` ("feat: display product and about images on homepage and storefront"), **up to date với `origin/main`** (`git fetch` xong, `git log HEAD..origin/main` và `origin/main..HEAD` đều rỗng). `git status` sạch — không có gì chưa commit.
- **Build/TypeScript/Lint:** **KHÔNG chạy được trong môi trường audit này** (thiếu Node.js — xem cảnh báo đầu file). Theo `SECURITY_FIXES_APPLIED.md:5`, `npm run build` và `npm run type-check` đã pass **tại thời điểm commit sửa bảo mật** (trước `e536dd6`). Commit `e536dd6` (thêm ảnh sản phẩm/about) **chưa có bằng chứng nào được build-verify** — khuyến nghị chạy lại cả 3 lệnh trên máy thật trước khi deploy tiếp.
- **`next.config.ts`:** tối giản, chỉ khai báo `images.remotePatterns` cho domain R2 (`**.r2.cloudflarestorage.com`) và bọc `withPayload()`. Không có `headers()`, không có `compress`/`experimental` nào khác. Không phải lỗi, nhưng thiếu security headers (xem mục 3) và không set `images.minimumCacheTTL`.
- **`vercel.json`:** không tồn tại trong repo (không bắt buộc — Vercel tự nhận diện Next.js App Router). `.vercel/` tồn tại local (project đã link) và được `.gitignore` chặn đúng cách, không commit nhầm `project.json`/`README.txt`.
- **`package.json` scripts** đầy đủ: `dev`, `build`, `start`, `lint`, `type-check`, và 3 script CLI seed/reset admin (không phải API routes — đúng theo khuyến nghị bảo mật đã áp dụng).

---

## 2. Kiến trúc & cấu trúc thư mục

- Cấu trúc `src/` bám khá sát `DSH_NATURE_PROJECT_BRIEF.md` §9: có `app/(storefront)`, `app/(payload)`, `collections/`, `components/{layout,product,article,forms,ui,home}`, `features/`, `lib/`, `types/`, `access/`. Còn thiếu `hooks/` và `services/` (payment/shipping) — hợp lý vì các phase đó (3/5) chưa tới.
- **Phát hiện kiến trúc quan trọng nhất:** kiến trúc hybrid "Payload quản content / Prisma quản business logic" (brief §4) hiện **chỉ mới đúng một nửa cho phía Payload, và storefront không thực sự nối vào Payload cho phần sản phẩm/nội dung trang chủ**:
  - `src/app/(storefront)/san-pham/page.tsx` và `san-pham/[slug]/page.tsx` lấy dữ liệu từ **`PRODUCTS_LIST` hardcode trong `src/lib/products-data.ts`**, không phải từ collection `Products` của Payload — dù collection đó đã có đầy đủ schema (tabs mô tả/thành phần/công dụng..., field SEO, hook validate từ khóa cấm TPCN).
  - Hệ quả: **sửa sản phẩm qua `/admin` không có tác dụng gì trên site thật** — vi phạm trực tiếp ràng buộc 🔒 của brief ("Admin không hard-code dữ liệu — toàn bộ nội dung phải sửa được qua Admin CMS") và acceptance criteria §14.
  - Hook `beforeChange` chặn từ khóa "chữa bệnh/điều trị/..." (`src/collections/Products.ts`) chỉ bảo vệ nội dung nhập trong Payload — **không bảo vệ nội dung hiển thị thật** (đã grep `products-data.ts`, hiện chưa chứa từ cấm nào, nhưng không có cơ chế nào chặn nếu ai đó sửa file này thêm từ vi phạm sau này).
  - Trang chủ (`src/app/(storefront)/page.tsx`) cũng lấy **Giá trị nổi bật, Danh mục sản phẩm, Sản phẩm nổi bật, Về DSH Nature, Sứ mệnh/Tầm nhìn, Kiến thức sức khỏe, Blog** từ `src/features/home/mock-data.ts` — chỉ riêng **Banner** thật sự đọc từ Payload (`getBanners()`, có fallback `DEFAULT_BANNERS` hardcode khi lỗi/rỗng — fallback là chủ đích tốt, nhưng phần lớn trang chủ chưa hề "no-code").
- **Trùng lặp code:** UI card sản phẩm bị lặp lại 2 nơi với cấu trúc khác nhau — `src/components/product/ProductCard.tsx` (dùng ở trang chủ, nhận props theo shape đơn giản) và JSX card viết tay lặp lại bên trong `san-pham/page.tsx` (theo shape `ProductDetail` của `products-data.ts`). Khi nối cả hai vào cùng nguồn Payload sau này nên gộp lại thành 1 component.
- Không phát hiện import vòng trong lượt rà soát `collections/`, `components/`, `lib/`. Không có file mồ côi đáng chú ý (`src/generated/prisma` là output tự sinh, đã `.gitignore` đúng).
- Không có `middleware.ts` — `/admin` hiện chỉ dựa vào cơ chế auth nội tại của Payload (chấp nhận được ở giai đoạn này), nhưng các route back-office custom trong brief (`/admin/orders`, `/admin/dealers`, `/admin/consultations`) chưa tồn tại nên chưa có lớp RBAC dùng chung nào để tái sử dụng khi implement.

---

## 3. Bảo mật

Repo đã có sẵn `SECURITY_AUDIT_REPORT.md` (5 finding: 3 Critical, 1 High liên quan `PAYLOAD_SECRET`, 1 High liên quan `NEXTAUTH_SECRET`, 2 Low) và `SECURITY_FIXES_APPLIED.md` ghi lại fix cho 4 Critical + 1 High (`PAYLOAD_SECRET`). Tôi đã **đọc lại trực tiếp code tại HEAD hiện tại** để xác nhận các fix còn hiệu lực sau commit mới nhất:

| Finding gốc | Trạng thái xác nhận lại | Bằng chứng |
|---|---|---|
| `/api/seed-admin` public, reset mật khẩu admin không xác thực | ✅ Đã xoá | `find` xác nhận route không tồn tại; chỉ còn `scripts/seed-admin.mts` (CLI, không public) |
| `Users` collection không có `access` | ✅ Đã fix | `src/collections/Users.ts:30-43` — `create: isAdmin`, `read`/`update` tự-mình-hoặc-admin, `delete: isAdmin`, field `role` khoá field-level cho non-admin |
| Content collections (Products/Articles/Banners/Media/ProductCategories/SiteSettings) mở `create/update/delete` public | ✅ Đã fix (theo bảng trong `SECURITY_FIXES_APPLIED.md`; không kiểm tra lại từng dòng trong lượt này vì các file này không thay đổi từ commit `40a161f`) | `src/access/isAdmin.ts`, `isAdminOrEditor.ts` |
| `onInit` tự tạo admin hardcoded password mỗi lần start | ✅ Đã xoá | `src/payload.config.ts:55-75` chỉ còn `console.warn`, không còn `payload.create` |
| `PAYLOAD_SECRET` fallback hardcoded | ✅ Đã xoá, thay bằng fail-fast | `src/payload.config.ts:24-30` — `throw new Error(...)` nếu thiếu env |

**Vẫn còn tồn đọng (chưa nằm trong danh sách đã fix):**

- 🟡 **`NEXTAUTH_SECRET` không có fail-fast check** — `src/lib/auth.ts:53` chỉ `secret: process.env.NEXTAUTH_SECRET` (không throw nếu thiếu), trong khi `PAYLOAD_SECRET` đã được fix theo đúng pattern này. Nên áp dụng nhất quán: `if (!process.env.NEXTAUTH_SECRET) throw new Error(...)`.
- 🟡 **Không có security headers** trong `next.config.ts` (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, HSTS) — vẫn như finding LOW gốc, chưa có `headers()`.
- 🟡 **`postgresAdapter({ push: true })`** (`src/payload.config.ts:48-53`) — vẫn tự động `db push`, chưa chuyển sang `payload migrate` có kiểm soát.
- 🟢 **`Media.ts` không giới hạn `mimeTypes`/`maxFileSize`** khi upload qua `@payloadcms/storage-s3` — chấp nhận được khi chỉ admin/editor upload, nhưng nên giới hạn trước khi mở quyền upload rộng hơn.

**Rà soát bổ sung trong lượt audit này (không trùng với 2 báo cáo cũ):**

- **Biến môi trường cần có trên Vercel** (chỉ tên, lấy từ `grep process.env` trong `src/`, không đọc giá trị): `DATABASE_URL`, `PAYLOAD_SECRET`, `R2_BUCKET`, `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`. Các biến `RESEND_API_KEY`, `VNPAY_TMN_CODE`, `VNPAY_HASH_SECRET`, `MOMO_PARTNER_CODE`, `MOMO_ACCESS_KEY`, `MOMO_SECRET_KEY` có trong `.env.example` nhưng **chưa được code nào đọc tới** (Resend/VNPay/MoMo chưa implement — xem mục 8), nên chưa cần set thật trên Vercel cho đến khi các phase đó bắt đầu.
- **`.env`/`.env.local`/`.env.example`:** `.gitignore` chặn `.env*` (khai báo 2 lần, dư thừa nhưng vô hại) — xác nhận **chưa từng có file `.env*` nào bị commit** (`git log --all -- .env*` rỗng) và `.env.example` chỉ chứa placeholder, không có giá trị thật.
- **CORS:** không có cấu hình CORS tuỳ chỉnh nào trong `src/app/api/**` — dùng mặc định same-origin của Next.js, không có route nào set `Access-Control-Allow-Origin: *`.
- **SQL injection / raw query:** không có, vì Prisma chưa có `model` nào (xem mục 7) và không có raw query nào trong `src/`.
- **`NEXT_PUBLIC_*`:** không có biến nào dạng này trong `src/` — không có nguy cơ lộ secret ra client bundle.
- **API surface hiện tại** chỉ có `src/app/api/auth/[...nextauth]/route.ts` (Credentials provider luôn `throw` — an toàn vì chưa cho đăng nhập thật) và các route REST/GraphQL tự sinh của Payload (`(payload)/api/[...slug]`, `/api/graphql`, `/api/graphql-playground`). Chưa có route business nào (orders/dealers/consultations/payment callback) để audit IDOR/input-validation — đây là **rủi ro cần theo dõi khi implement**, vì hiện chưa có pattern Zod-validation nào có sẵn trong repo cho API route (Zod hiện chỉ dùng ở `Newsletter.tsx`, phía client).

---

## 4. Hiệu năng

- `next/image` được dùng nhất quán cho ảnh sản phẩm/bài viết/banner (không tìm thấy thẻ `<img>` thô trong các file đã kiểm tra).
- `next.config.ts` chỉ whitelist domain R2 cho `remotePatterns`, không set `images.minimumCacheTTL`; Cache-Control cho ảnh trên R2 nằm ở phía cấu hình bucket Cloudflare (ngoài phạm vi code) — cần kiểm tra riêng trên R2 dashboard khi có ảnh thật.
- **Không có ISR/ dynamic export nào** (`grep "revalidate\|export const dynamic"` trong toàn bộ `src/app` — không có kết quả) — mọi trang có gọi Payload (hiện chỉ có trang chủ) đều fetch lại từ Postgres ở **mọi request**, không cache. Trang chủ còn gọi `getSiteSettings()` và `getBanners()` **tuần tự** (2 round-trip DB nối tiếp) thay vì `Promise.all` song song.
- Ảnh nguồn trong `public/` khá nặng cho placeholder: `public/san-pham/*.png` và `public/gioi-thieu/*.png` đều ở mức **2.0–2.6MB/file** (PNG chưa nén) — nên chuyển sang WebP/AVIF nén trước khi thay bằng ảnh thật, hoặc quản lý qua Payload Media (đã có `sharp` sẵn trong `payload.config.ts` để tự xử lý ảnh khi upload qua CMS).
- `package.json`: gói `shadcn` (`^4.21.0`) nằm trong `dependencies` thay vì `devDependencies` — đây là CLI codegen tool, **không được import ở đâu trong `src/`** (đã grep xác nhận) nên không ảnh hưởng bundle client, chỉ là vấn đề vệ sinh dependency tree.
- Payload/Lexical richtext editor chỉ được import trong route group `(payload)`, được Next App Router code-split tách khỏi bundle storefront — không có dấu hiệu rò rỉ dependency nặng sang phía client site bán hàng.
- **Không thể chạy `next build` để lấy số liệu First Load JS thật hoặc bundle analyzer** trong môi trường audit này (xem giới hạn ở đầu file) — khuyến nghị tự chạy `npm run build` để lấy bảng kích thước từng route.

---

## 5. SEO & metadata

- `src/app/(storefront)/layout.tsx` chỉ set `title`/`description` toàn site, **không có `openGraph`, `twitter`, `alternates.canonical`, `metadataBase`** — khi chia sẻ link lên Facebook/Zalo (kênh chính của khách hàng Việt Nam) sẽ không có ảnh/preview đẹp.
- Các trang **có** `metadata`/`generateMetadata` riêng: `blog`, `blog/[slug]`, `gioi-thieu`, `kien-thuc`, `kien-thuc/[slug]`, `san-pham/[slug]` — tốt, nhưng **chưa trang nào set OG/canonical**.
- Các trang **chưa có metadata riêng nào** (chỉ kế thừa title/description chung của layout): `san-pham/page.tsx` (danh sách sản phẩm — trang quan trọng nhất về SEO thương mại), `gio-hang`, `thanh-toan`, `tu-van`, `dai-ly`, `lien-he`, `tai-khoan`.
- **Không có `sitemap.ts`/`robots.ts`** trong `src/app` (convention file của Next.js 16) — xác nhận bằng glob, chỉ có tài liệu tham khảo nằm trong `node_modules/next/dist/docs`. Đây là yêu cầu cứng của brief §12 và **hiện chưa làm gì cả**.
- **Không có Schema.org / JSON-LD** ở bất kỳ đâu (`grep "application/ld+json\|schema.org"` không ra kết quả) — Organization/Product/Article/BreadcrumbList/FAQPage theo brief §12 chưa implement.
- Không tìm thấy component `Breadcrumb` được dùng ở trang chi tiết sản phẩm/bài viết dù có trong danh sách component kiến trúc của brief §8 — thiếu cả về SEO (rich result) lẫn UX điều hướng.
- `alt` text trên ảnh: có mặt và mô tả hợp lý ở các nơi đã kiểm tra (Hero, ProductCard, ArticleCard, section "Về DSH Nature") — không phát hiện `alt=""` rỗng hay thiếu `alt` trong các file đã đọc.
- Heading hierarchy: chưa mở `SectionTitle.tsx` để xác nhận có dùng đúng `<h2>` nhất quán hay không — đánh dấu 🟢 cần soát lại khi nội dung final.

---

## 6. Responsive & accessibility

- Breakpoint Tailwind (`sm:`/`md:`/`lg:`) được dùng nhất quán ở mọi trang/grid đã kiểm tra (trang chủ, danh sách sản phẩm, đại lý, tư vấn, checkout đều có grid 1 cột mobile → 2/3/4/5 cột desktop). **Không thể** tự mở trình duyệt/dev server để chụp thực tế ở đúng các breakpoint brief yêu cầu (1920/1440/1280/1024/768/430/390/375/360) vì môi trường audit này không có Node.js để chạy `next dev` — khuyến nghị bạn tự kiểm tra bằng mắt hoặc Lighthouse/Percy ở các mốc đó trước khi release.
- `aria-label` có mặt trên các control chỉ-icon quan trọng: nút tìm kiếm, link tài khoản, menu mobile, bottom nav, floating contact, toast (17 chỗ dùng `aria-label` trên toàn `src/`) — độ phủ tốt ở phần layout chung.
- Có **9 thẻ `<button>`** trong `src/components/**` **thiếu `type=`** rõ ràng (mặc định HTML là `type="submit"` — dễ gây submit form ngoài ý muốn nếu button đó nằm trong `<form>`). Nên rà soát và thêm `type="button"` cho các nút không phải submit.
- Radio button chọn phương thức thanh toán (`thanh-toan/page.tsx`) được bọc đúng trong `<label>` — tốt cho vùng bấm và liên kết screen-reader.
- Input/textarea trên toàn site chỉ đổi `focus:border-primary`, **không có `focus-visible:ring`** rõ ràng — chỉ đổi màu viền là chỉ báo focus khá mờ nhạt cho người dùng bàn phím, nên cân nhắc thêm ring rõ hơn (WCAG 2.4.7 Focus Visible).
- Contrast màu: `text-primary` (#087443) trên nền trắng/cream nhìn chung ổn cho text đậm; các đoạn `text-[11px]`/`text-xs text-muted-foreground` (dùng rất nhiều cho helper text) **chưa được kiểm tra bằng công cụ contrast checker thật** vì cần render trang — cần đo lại giá trị token `--muted-foreground` thực tế khi có thể chạy trang.

---

## 7. Database & data layer

- **Prisma:** `prisma/schema.prisma` chỉ có `generator`/`datasource`, **0 model** — đúng như comment trong file ("PHASE 0", chưa định nghĩa bảng business logic). Vì vậy **không có gì để kiểm tra** về N+1 query, index thiếu, hay migration chưa apply cho Prisma — chưa có bảng nào tồn tại để có vấn đề đó.
- **Payload/Neon (Postgres):** vẫn dùng `push: true` (xem mục 3) — không có migration history theo dõi được. Query duy nhất hiện có trong toàn bộ codebase là:
  ```ts
  payload.find({ collection: 'banners', where: { isActive: { equals: true } }, sort: 'order', limit: 6 })
  ```
  (trang chủ) — 1 filter boolean đơn giản, `limit: 6`, không có quan hệ lồng nhau, không có rủi ro N+1 ở quy mô hiện tại.
- `src/generated/prisma` (output của Prisma client) được `.gitignore` đúng cách, không bị commit nhầm.
- Vì storefront sản phẩm/nội dung hiện đọc từ file tĩnh (`products-data.ts`, `mock-data.ts` — xem mục 2), **không có query Payload/Prisma nào khác để audit hiệu năng DB** ngoài banner ở trên. Đây vừa là tin tốt (không có N+1) vừa là tin xấu (vì lẽ ra phải có, theo đúng kiến trúc brief).

---

## 8. Payment & business logic

- **VNPay/MoMo/COD:** chưa có bất kỳ implementation nào. `thanh-toan/page.tsx` hoàn toàn là React state phía client — chọn phương thức thanh toán chỉ đổi radio button được highlight; nút "Xác nhận đặt hàng" sinh `orderId` bằng `Math.random()` ngay trên trình duyệt, gọi `clearCart()`, rồi hiển thị màn hình "thành công" giả. **Không có `fetch`/API route nào được gọi, không ghi DB, không redirect sang cổng thanh toán thật, và (đã grep toàn repo) không có bất kỳ đoạn code nào verify HMAC signature cho IPN/callback của VNPay hay MoMo.** Refresh lại trang là mất đơn hàng vừa "đặt".
- **Đại lý (`dai-ly/page.tsx`) và Tư vấn sức khỏe (`tu-van/page.tsx`):** cùng một pattern — validate bằng vài `if` thủ công (không dùng Zod dù đây là thư viện validation đã chọn trong brief và đã dùng ở `Newsletter.tsx`), submit chỉ bật cờ `isSubmitted` local và hiện toast. Không gửi lên server, không log, không gửi email (`resend` có trong `package.json` nhưng **không được import ở bất kỳ đâu trong `src/`**).
- **Giỏ hàng (`context/cart-context.tsx`)** là phần "thật" nhất: lưu vào `localStorage` (`dsh_nature_cart_v1`), có `try/catch` quanh `window`/`JSON.parse`/`setItem`, logic add/remove/update/clear hợp lý. Tuy nhiên đây thuần là state client — chưa có đồng bộ giỏ hàng phía server, chưa re-check tồn kho/giá tại thời điểm checkout từ nguồn đáng tin cậy (giá hiển thị ở bước thanh toán lấy nguyên từ `products-data.ts` cache trong localStorage — về lý thuyết có thể bị sửa tay trong localStorage để đổi giá hiển thị, nhưng vì hiện chưa có gì được lưu ở server nên chưa khai thác được gì thực tế ngoài việc tự lừa chính mình).
- **Kết luận mục này:** mọi tiêu chí "hoạt động" cho Cart/Checkout/Đại lý/Tư vấn trong acceptance criteria (brief §14) hiện là **mô phỏng giao diện, chưa có backend đứng sau**. Đây không phải lỗ hổng bảo mật mới (đã được `SECURITY_AUDIT_REPORT.md` ghi nhận là "Phase 0/1, chưa implement"), nhưng là khoảng trống **chức năng/business-readiness** cần lên kế hoạch rõ ràng trước khi gọi đây là một website thương mại điện tử hoàn chỉnh.

---

## 9. Tổng kết

### 🔴 Critical — nên xử lý trước khi tuyên bố các tính năng liên quan "đã hoạt động"

1. **Danh mục sản phẩm không đọc từ Payload CMS** — `/san-pham` và `/san-pham/[slug]` dùng `src/lib/products-data.ts` hardcode, sửa qua `/admin` không có tác dụng gì. Vi phạm trực tiếp ràng buộc 🔒 "không hard-code nội dung" của brief.
2. **Cart/Checkout/Đại lý/Tư vấn không có backend** — không có đơn hàng, không lưu đăng ký đại lý, không lưu yêu cầu tư vấn, không tích hợp cổng thanh toán, không gửi email. Không có gì khách hàng nhập vào được giữ lại ở đâu cả.
3. **Phần lớn trang chủ (Giá trị nổi bật, Danh mục, Sản phẩm nổi bật, Về DSH Nature, Sứ mệnh/Tầm nhìn, Kiến thức sức khỏe, Blog) lấy từ `mock-data.ts`**, không phải Payload — cùng nhóm vấn đề với mục 1, ở diện rộng hơn.
4. **Thiếu hoàn toàn `sitemap.ts`/`robots.ts` và Schema.org structured data** — yêu cầu cứng ở brief §12, hiện 0% triển khai, ảnh hưởng khả năng được index tốt ngay từ đầu.

### 🟡 Nên sửa sớm — trước khi triển khai Phase 3+ thật hoặc trước go-live

5. `NEXTAUTH_SECRET` chưa có fail-fast check (không nhất quán với fix đã áp dụng cho `PAYLOAD_SECRET`) — `src/lib/auth.ts:53`.
6. Chưa có security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, HSTS) trong `next.config.ts`.
7. `postgresAdapter` vẫn chạy `push: true` thay vì migration có kiểm soát.
8. Metadata layout gốc thiếu `openGraph`/`twitter`/`canonical`/`metadataBase`; nhiều trang (`san-pham`, `gio-hang`, `thanh-toan`, `tu-van`, `dai-ly`, `lien-he`, `tai-khoan`) chưa có metadata riêng.
9. Không có ISR/`revalidate` ở đâu cả — mọi request tới trang có gọi Payload đều query DB trực tiếp; 2 lệnh gọi Payload ở trang chủ chưa chạy song song (`Promise.all`).
10. Ảnh PNG nguồn trong `/public` khá nặng (2–2.6MB/ảnh), chưa nén — nên chuyển WebP/AVIF trước khi thay bằng ảnh thật.
11. Collection `Media` chưa giới hạn `mimeTypes`/`maxFileSize` khi upload.
12. 9 `<button>` thiếu `type=` rõ ràng; focus-visible trên input/button toàn site khá mờ nhạt.

### 🟢 Có thể làm sau — không chặn go-live nhưng nên theo dõi

13. Gói `shadcn` nằm nhầm trong `dependencies` thay vì `devDependencies` (không dùng ở runtime, chỉ là vệ sinh dependency tree).
14. Chưa có component `Breadcrumb` dù có trong kiến trúc component của brief.
15. Card sản phẩm bị viết trùng lặp ở 2 nơi (`ProductCard.tsx` và JSX trong `san-pham/page.tsx`) do đang dùng 2 nguồn dữ liệu khác nhau — nên gộp khi nối chung về Payload.
16. Contrast của text rất nhỏ (`text-[11px]`/`text-xs text-muted-foreground`) chưa được đo bằng công cụ thật.
17. **Chưa chạy được `npm run build`/`type-check`/`lint`/bundle analyzer trong lượt audit này** (môi trường thiếu Node.js) — `SECURITY_FIXES_APPLIED.md` ghi nhận các lệnh này pass tại thời điểm trước `e536dd6`; khuyến nghị chạy lại cả 3 trên máy thật để xác nhận commit mới nhất không có lỗi mới (chưa từng được xác nhận).

### Đề xuất thứ tự khắc phục (chỉ đề xuất, chưa tự sửa)

1. **Chạy lại `npm run build` / `type-check` / `lint` trên máy có Node.js** để xác nhận HEAD hiện tại (`e536dd6`) không có lỗi mới — chưa có bằng chứng nào cho việc này.
2. **Quyết định kiến trúc:** đưa Products/Articles/Categories/trang chủ nối thật vào Payload trước, hay tiếp tục dùng mock data thêm một thời gian? Đây là thay đổi nền tảng, nên chốt trước khi đầu tư công sức vào SEO/Schema.org/Breadcrumb cho dữ liệu sẽ bị thay thế.
3. **Vá 2 mục bảo mật còn tồn đọng** (`NEXTAUTH_SECRET` fail-fast, security headers) — nhỏ, nhanh, độc lập với quyết định ở bước 2.
4. **Xây backend thật cho Cart/Checkout/Đại lý/Tư vấn** (Prisma models + API routes + Zod validation + verify signature VNPay/MoMo) — khối lượng lớn nhất, nên đi đúng theo thứ tự Phase 3 → Phase 5 đã chốt trong brief.
5. **SEO** (sitemap/robots/Schema.org/OG/Breadcrumb) — làm sau bước 2 để không phải viết lại khi đổi nguồn dữ liệu.
6. **Performance/accessibility polish** (nén ảnh, ISR, focus-visible, contrast) — đúng như Phase 7 brief đã định.

---

*Báo cáo này chỉ audit và đề xuất — chưa có thay đổi code nào được thực hiện. Chờ review trước khi tiến hành sửa bất kỳ mục nào ở trên.*
