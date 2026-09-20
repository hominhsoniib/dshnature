# CMS Integration Plan — DSH Nature (Phase A)

**Ngày:** 2026-09-20
**Phạm vi:** Nối Payload CMS vào frontend, thay hardcode data bằng dữ liệu thật. Đây là bước tiếp theo của finding 🔴 #1 và #3 trong `AUDIT_REPORT.md`.
**Trạng thái tài liệu:** **BƯỚC 1 — chỉ phân tích, chưa sửa code, chưa lập kế hoạch fetch.** Dừng ở đây chờ duyệt trước khi làm Bước 2.

---

## Mục lục

1. [Toàn bộ nơi đang dùng hardcode data](#1-toàn-bộ-nơi-đang-dùng-hardcode-data)
2. [So sánh field: Payload CMS ⟷ Frontend](#2-so-sánh-field-payload-cms--frontend)
3. [Cơ chế fetch hiện tại](#3-cơ-chế-fetch-hiện-tại)
4. [Quyết định cần bạn duyệt trước khi sang Bước 2](#4-quyết-định-cần-bạn-duyệt-trước-khi-sang-bước-2)

---

## 1. Toàn bộ nơi đang dùng hardcode data

### A. `src/lib/products-data.ts`
Export: `ProductDetail` (type), `PRODUCTS_LIST` (4 sản phẩm), `getProductBySlug()`.

Được import ở:
- `src/app/(storefront)/san-pham/page.tsx:8` — `import { PRODUCTS_LIST } from "@/lib/products-data"` — dùng cho danh sách + filter/sort/search (client-side).
- `src/app/(storefront)/san-pham/[slug]/page.tsx:4` — `import { getProductBySlug } from "@/lib/products-data"` — dùng cho cả `generateMetadata` và render trang chi tiết.
- `src/app/(storefront)/san-pham/[slug]/product-detail-view.tsx:8` — `import type { ProductDetail } from "@/lib/products-data"` — chỉ import type, nhận `product` qua props (đã tách server/client đúng pattern).

### B. `src/features/home/mock-data.ts`
Export: `mockProductCategories`, `mockFeaturedProducts`, `mockAboutSection`, `mockMissionVision`, `mockCoreValues`, `mockHealthArticles`, `mockBlogArticles`.

Được import ở:
- `src/app/(storefront)/page.tsx:19-27` — dùng cả 7 export, cho section 02 (Giá trị nổi bật), 03 (Danh mục), 04 (Sản phẩm nổi bật), 05 (Về DSH Nature), 06 (Sứ mệnh & Tầm nhìn), 07 (Giá trị cốt lõi — **dùng lại `mockCoreValues` y hệt section 02**), 08 (Kiến thức sức khỏe), 11 (Blog).
- `src/components/layout/SearchModal.tsx:6` — dùng `mockFeaturedProducts` (chỉ 4 sản phẩm) để search. Đây là **Client Component** gắn ở `Header` → mount toàn site.

### C. Hardcode dạng inline const ngay trong page.tsx (không phải file riêng, nhưng cùng bản chất — tính là "file tương tự" theo yêu cầu)

| File | Const hardcode | Ghi chú |
|---|---|---|
| `src/app/(storefront)/kien-thuc/page.tsx:13-56` | `HEALTH_CATEGORIES` (6 mục), `HEALTH_ARTICLES` (4 bài: slug/title/category/excerpt/date/author) | **Không trùng khớp** với `mockHealthArticles` ở mock-data.ts — khác field (thiếu `excerpt`/`date`/`author` bên mock-data), khác số lượng (mock-data chỉ có 3 bài, thiếu bài "mẹo cải thiện giấc ngủ") |
| `src/app/(storefront)/blog/page.tsx:13-43` | `BLOG_CATEGORIES` (5 mục), `BLOG_POSTS` (3 bài) | Cùng vấn đề: không khớp field/số lượng với `mockBlogArticles` |
| `src/app/(storefront)/dai-ly/page.tsx:8` | `MOCK_DEALERS` (4 đại lý) | Đây là **business data thuộc domain Prisma** theo brief §4 (`dealers`), không phải Payload content — nêu ra để bạn quyết định có nằm trong scope Phase A hay để lại Phase 5 (dealer backend) như `AUDIT_REPORT.md` đã đề xuất |
| `src/app/(storefront)/tu-van/page.tsx:8-21` | `FAQS` (3 câu hỏi) | Brief §10 có dự tính collection `faqs` nhưng **collection này chưa tồn tại** trong `src/collections/` |
| `src/app/(storefront)/lien-he/page.tsx:59` | Chuỗi hardcode `"1900 xxxx / 0987 654 321"` | Nên đọc từ `SiteSettings.hotline` như `Footer.tsx` đã làm đúng — hiện đang lặp/không nhất quán giữa 2 nơi |

### D. Vấn đề nghiêm trọng hơn "chưa nối CMS" — 2 trang chi tiết bài viết bỏ qua `slug` hoàn toàn

- `src/app/(storefront)/kien-thuc/[slug]/page.tsx` và `src/app/(storefront)/blog/[slug]/page.tsx`: cả hai **không hề dùng `slug` để tra cứu bài viết** — `slug` chỉ được nội suy vào chuỗi `description` của `generateMetadata`. Nội dung trang **giống hệt nhau bất kể URL nào**, ví dụ `/kien-thuc/abc-bat-ky` vẫn hiện đúng 1 bài viết cứng về hô hấp.
- Đây không chỉ là "thay nguồn data" — cần **viết lại gần như từ đầu** phần render nội dung khi nối Payload (query theo `slug`, `notFound()` khi không có, render Lexical richText).

### E. `src/app/(storefront)/gioi-thieu/page.tsx`
Không có file data riêng — toàn bộ nội dung (Tổng quan, Sứ mệnh, Tầm nhìn, Sơ đồ chiến lược, 5 Giá trị cốt lõi, Tiêu chuẩn & Chứng nhận, Đội ngũ) viết thẳng trong JSX. Cùng loại vấn đề nhưng **hiện chưa có collection Payload nào tương ứng** (xem mục 2 bên dưới).

---

## 2. So sánh field: Payload CMS ⟷ Frontend

### Collection `products` (đã có) ⟷ `ProductDetail` (products-data.ts)

| Field frontend cần | Có ở Payload? | Ghi chú |
|---|---|---|
| `slug` | ✅ `slug` | khớp |
| `name` | ✅ `name` | khớp |
| `categorySlug` + `categoryName` | ⚠️ có, khác dạng | Payload dùng `category` là **relationship** → `product-categories`, trả về object `{id, name, slug}` khi populate (depth ≥ 1), không phải 2 string phẳng như frontend đang dùng. Cần map lại, không thiếu field. |
| `price` / `originalPrice` | ✅ | khớp |
| `images: string[]` | ⚠️ có, khác dạng | Payload: `images` là mảng `{ image: <Media relationship> }`; mỗi `image` khi populate trả `{ url, alt }`, không phải mảng string URL phẳng. Cần map lại. |
| `shortDescription` | ✅ | khớp |
| `tabs.description/ingredients/usage/targetUsers/howToUse/specification/storage/productDossier` | ✅ khớp tên 1:1 | không cần đổi |
| SEO fields (brief §10 có nhắc group `seo` cho Products) | ❌ **chưa tồn tại** trong `Products.ts` hiện tại (chỉ có 2 tab: "Thông tin cơ bản", "Chi tiết nội dung sản phẩm") | quyết định cần duyệt — xem mục 4 |

### Collection `product-categories` (đã có) ⟷ `mockProductCategories`

| Field | Có ở Payload? |
|---|---|
| `slug` | ✅ |
| `name` | ✅ |

Khớp hoàn toàn — **đơn giản nhất để nối trong toàn bộ danh sách**.

### Collection `articles` (đã có) ⟷ `mockHealthArticles`/`mockBlogArticles`/`HEALTH_ARTICLES`/`BLOG_POSTS`

| Field frontend cần | Có ở Payload `Articles`? | Ghi chú |
|---|---|---|
| `slug` | ✅ | |
| `title` | ✅ | |
| `category` (string tự do) | ✅ `category` (text, không phải select/relationship) | Khớp, nhưng vì là text tự do nên list "category chip" ở `/kien-thuc` và `/blog` hiện đang hardcode riêng (`HEALTH_CATEGORIES`/`BLOG_CATEGORIES`) — khi nối CMS nên tính distinct category từ data thật thay vì hardcode |
| `type` (healthKnowledge / blog) | ✅ select | Dùng đúng 1 collection cho cả `/kien-thuc` và `/blog`, đúng thiết kế brief §4 |
| ảnh đại diện | ✅ `featuredImage` (upload → media) | |
| `excerpt` | ✅ | |
| `author` | ✅ (có defaultValue) | |
| ngày hiển thị | ⚠️ không có field `date` riêng | Payload có sẵn `createdAt`/`updatedAt` — dùng thay, không phải thiếu field |
| nội dung chi tiết đầy đủ | ✅ `content` (richText/Lexical) | Cần renderer Lexical → JSX ở trang chi tiết — hiện 2 trang chi tiết chưa render bất kỳ nội dung động nào (xem mục 1D) |

### Collection `banners` (đã có, **đã nối CMS thật**) ⟷ `DEFAULT_BANNERS` fallback

Khớp field-for-field (`title`, `subtitle`, `ctaLabel`, `ctaHref`, `image`, `order`, `isActive`), đã có type `Banner` sẵn trong `src/types/payload-content.ts`. Đây là **collection duy nhất đã sống bằng data thật** hiện nay, qua `getBanners()` trong `page.tsx`.

### Global `site-settings` (đã có, đã nối 1 phần qua Header/Footer/FloatingContact)

Không liên quan trực tiếp 2 file hardcode chính, nhưng `lien-he/page.tsx` nên tái sử dụng thay vì hardcode số hotline riêng (mục 1C).

### Không có collection/global Payload nào cho:

- **Core Values** (Giá trị nổi bật/cốt lõi — dùng ở trang chủ section 02+07 và `gioi-thieu` section 05)
- **About / Mission / Vision** (trang chủ section 05-06 và `gioi-thieu` section 01-03)
- **Sơ đồ chiến lược, Tiêu chuẩn & Chứng nhận, Đội ngũ** (toàn bộ `gioi-thieu` từ section 04 trở đi — brief có nhắc `partners`/`certifications`/`team-members` ở §10 nhưng chưa tạo collection nào)
- **FAQs** (dùng ở `tu-van/page.tsx`; brief §10 có nêu tên `faqs` nhưng collection chưa tồn tại)
- **Dealers/MOCK_DEALERS** — thuộc domain Prisma (brief §4), không phải Payload — đề xuất loại khỏi scope Phase A này

---

## 3. Cơ chế fetch hiện tại

- **Đã có `src/lib/payload.ts`** dùng **Payload Local API** (`getPayload({ config })`) — gọi trực tiếp trong Server Component. Đây là cách chính thức Payload khuyến nghị cho Next.js App Router cùng process (nhanh hơn REST/GraphQL vì không qua HTTP).
- Đây là **cơ chế fetch duy nhất đang tồn tại** trong repo — dùng cho `getSiteSettings()` và `getBanners()` trong `page.tsx`. **Chưa có** bất kỳ `fetch()` nào gọi REST (`/api/products`, `/api/articles`...) hay GraphQL từ phía frontend.
- **Chưa có route handler nào phục vụ search** — `SearchModal.tsx` là Client Component nên không thể gọi Local API trực tiếp (Local API chỉ chạy ở server/Node context). Cần thiết kế riêng ở Bước 2.
- `san-pham/page.tsx` hiện là **Client Component** (`"use client"` dòng 1, dùng `useSearchParams`/`useState` để filter/sort/search), nhận `PRODUCTS_LIST` bằng import tĩnh trực tiếp. Không thể import Payload Local API thẳng vào Client Component — cần tách Server Component cha (fetch) + Client Component con (nhận props để filter/sort), đúng pattern đã có sẵn ở `san-pham/[slug]/page.tsx` (server) + `product-detail-view.tsx` (client).

---

## 4. Quyết định đã duyệt (2026-09-20)

1. **Phạm vi Phase A: CHỈ 5 collection đã có sẵn** — Products, ProductCategories, Articles, Banners, SiteSettings. Phần chưa có collection (Core Values, About/Mission/Vision, Sơ đồ chiến lược, Chứng nhận, Đội ngũ, FAQs) **tạm giữ hardcode**, gắn `// TODO(Phase A2):` rõ ràng tại từng chỗ khi triển khai Bước 3.
2. **Ghi nhận cho Phase A2** (chưa làm ở Phase A, chỉ note lại để không quên):
   - Core Values → **Global riêng `CoreValues`**
   - About/Mission/Vision (gồm cả sơ đồ chiến lược) → **Global riêng `AboutPage`**
   - Team/Chứng nhận/FAQs → **3 collection riêng**: `TeamMembers`, `Certifications`, `Faqs`
   - Không nhét các phần trên vào `SiteSettings`.
3. **`MOCK_DEALERS` (dai-ly/page.tsx): loại khỏi Phase A.** Giữ hardcode, gắn `// TODO(Phase B):` trỏ tới dealer backend (Prisma), thiết kế cùng lúc với domain `dealers` để tránh 2 nguồn sự thật (Payload hiển thị danh sách vs Prisma xử lý đăng ký).
4. **SEO fields cho `Products`: chưa làm ở Phase A.** Dùng metadata mặc định (`name` + `shortDescription`) cho `generateMetadata`. Việc thêm SEO field vào collection gộp chung vào **Phase C** (cùng nhóm sitemap/robots/Schema.org — đã nêu trong `AUDIT_REPORT.md` mục 9).
5. **`kien-thuc/[slug]` và `blog/[slug]`: XÁC NHẬN nằm trong scope Phase A.** Bắt buộc viết lại: query theo `slug` thật qua Payload, `notFound()` khi không tìm thấy document, render Lexical richText từ field `content` bằng renderer chính thức của Payload (xem mục 5.4 Bước 2 bên dưới).

---

# BƯỚC 2 — Thiết kế cách fetch data

**Trạng thái:** Chỉ là kế hoạch, chưa sửa code. Dừng ở cuối tài liệu này chờ duyệt trước khi làm Bước 3.

## 5.1. Local API vs REST/GraphQL — chọn Local API cho toàn bộ Phase A

**Quyết định: dùng tiếp Payload Local API** (`getPayload({ config })`, đã có sẵn ở `src/lib/payload.ts`) cho mọi trang Server Component, **không** chuyển sang REST/GraphQL.

Lý do:
- Payload và Next.js chạy **cùng một process** (`withPayload()` trong `next.config.ts` nhúng Payload thẳng vào Next app, không phải service tách riêng) — đúng điều kiện Payload khuyến nghị dùng Local API.
- Local API gọi thẳng vào DB layer trong process, không qua HTTP round-trip, không qua lớp serialize/deserialize JSON REST — nhanh hơn và ít lỗi hơn cho mọi Server Component đang fetch (đã áp dụng đúng cho `getBanners()`/`getSiteSettings()`).
- Repo **chưa có tiền lệ dùng REST/GraphQL** ở phía frontend (đã xác nhận ở Bước 1 mục 3) — dùng Local API tiếp tục giữ nhất quán 1 cách fetch duy nhất, dễ maintain.
- **Ngoại lệ duy nhất: Search (`SearchModal.tsx`)** — đây là Client Component, không thể gọi Local API trực tiếp (Local API chỉ chạy được trong server/Node context, không phải trong browser bundle). Cần **1 Route Handler mới** (`src/app/api/search/route.ts`) gọi Local API ở phía server rồi trả JSON cho client gọi qua `fetch()`. Đây là route business API đầu tiên của dự án — sẽ áp dụng luôn pattern Zod validate query param (`q`) làm chuẩn cho các route sau này.

## 5.2. Kế hoạch fetch/cache theo từng trang

| Trang | Kiểu component | Cách fetch | Cache/Revalidate |
|---|---|---|---|
| `/` (trang chủ) | Server Component (đã là async function) | Thêm `getFeaturedProducts()`, `getProductCategories()` bằng Local API, chạy **song song** với `getSiteSettings()`/`getBanners()` hiện có qua `Promise.all` (sửa luôn phần tuần tự đã nêu ở `AUDIT_REPORT.md` mục 4). Core Values/About/Mission/Vision/Health articles/Blog articles: **giữ nguyên mock-data.ts** theo quyết định mục 4.1, kèm `// TODO(Phase A2)` | `export const revalidate = 300` (5 phút) — nội dung trang chủ ít đổi, không cần realtime tuyệt đối |
| `/san-pham` | **Tách 2 file**: `page.tsx` (Server Component, fetch toàn bộ `products` + `product-categories` qua Local API) → truyền props xuống `product-catalog-view.tsx` (Client Component mới, giữ nguyên logic filter/search/sort hiện tại của `san-pham/page.tsx` cũ) | `payload.find({ collection: 'products', limit: 100 })` + `payload.find({ collection: 'product-categories' })`, populate `category`/`images` (depth: 1) | `export const revalidate = 60` — danh sách sản phẩm cần cập nhật nhanh hơn trang chủ khi admin sửa giá/thêm SP mới |
| `/san-pham/[slug]` | Giữ nguyên pattern hiện tại: `page.tsx` (Server) → `product-detail-view.tsx` (Client) | Thay `getProductBySlug()` (products-data.ts) bằng `payload.find({ collection: 'products', where: { slug: { equals: slug } }, limit: 1, depth: 1 })`; không có kết quả → `notFound()` | `export const revalidate = 60`, cộng thêm `generateStaticParams()` lấy toàn bộ slug hiện có để pre-render tĩnh các trang sản phẩm đã biết tại build time (ISR) |
| `/kien-thuc` | Server Component (hiện đang là function đồng bộ không async — sẽ đổi thành `async`) | `payload.find({ collection: 'articles', where: { type: { equals: 'healthKnowledge' } }, sort: '-createdAt' })`; tính `HEALTH_CATEGORIES` bằng cách lấy distinct `category` từ kết quả thay vì hardcode | `export const revalidate = 120` |
| `/kien-thuc/[slug]` | **Viết lại** — Server Component thật (đã có `async` nhưng chưa dùng `slug`) | `payload.find({ collection: 'articles', where: { slug: { equals: slug }, type: { equals: 'healthKnowledge' } }, limit: 1 })`; không thấy → `notFound()`; render `content` (Lexical JSON) bằng `<RichText data={article.content} />` từ `@payloadcms/richtext-lexical/react` (package đã có sẵn trong `node_modules`, chỉ cần import — không cần cài thêm dependency) | `export const revalidate = 120`, `generateStaticParams()` theo slug |
| `/blog` | Tương tự `/kien-thuc`, filter `type: { equals: 'blog' }` | như trên | `export const revalidate = 120` |
| `/blog/[slug]` | **Viết lại** tương tự `/kien-thuc/[slug]`, filter thêm `type: { equals: 'blog' }` | như trên | `export const revalidate = 120`, `generateStaticParams()` |
| `SearchModal.tsx` | Client Component (giữ nguyên là client) | `fetch('/api/search?q=...')` (debounce ~300ms phía client) → Route Handler mới gọi Local API `payload.find({ collection: 'products', where: { or: [{ name: { like: q } }, { shortDescription: { like: q } }] }, limit: 8 })` | Route Handler set `export const dynamic = 'force-dynamic'` (search luôn cần data mới nhất, không cache) |
| `lien-he/page.tsx` | Không đổi kiểu component | Nhận `siteSettings` giống `Footer`/`Header` (RootLayout đã fetch sẵn, có thể pass qua props hoặc gọi lại `getSiteSettings()` — sẽ tái dùng hàm đã có, không viết lại) — thay chuỗi hotline hardcode bằng `siteSettings.hotline` | dùng chung cache của layout |
| `dai-ly/page.tsx`, `tu-van/page.tsx`, `gioi-thieu/page.tsx` | Không đổi trong Phase A | Giữ nguyên hardcode, gắn `// TODO(Phase A2)` hoặc `// TODO(Phase B)` theo đúng phân loại ở mục 4 | — |

**Ghi chú kỹ thuật quan trọng — populate quan hệ:** mọi query `products`/`articles` cần `depth: 1` (mặc định của Payload Local API) để `category`/`images.image`/`featuredImage` trả về object đầy đủ (`{url, alt}`) thay vì chỉ ID — đã xác nhận qua field type ở Bước 1 mục 2, không cần thử-sai.

## 5.3. Kế hoạch xử lý rỗng/lỗi (không được để trang trắng hoặc crash)

Áp dụng đúng pattern đã có sẵn ở `getSiteSettings()`/`getBanners()` (`try/catch` trả `null`/fallback) cho **mọi** hàm fetch mới, cụ thể:

- **Payload API lỗi (DB down, timeout...):** mọi hàm fetch mới (`getFeaturedProducts`, `getProductCategories`, `getProductBySlug`, `getArticles`, `getArticleBySlug`) bọc `try/catch`, trả về `[]`/`null` khi lỗi — **không throw ra ngoài Server Component** (nếu throw, Next.js sẽ render Error Boundary/trang lỗi mặc định, vi phạm yêu cầu brief §12 "không để trang trắng khi lỗi").
- **Danh sách rỗng (chưa nhập data qua Admin):**
  - `/san-pham`: nếu `payload.find({ collection: 'products' })` trả `totalDocs === 0`, hiện `EmptyState` ("Chưa có sản phẩm nào được đăng.") — component `EmptyState` được liệt kê trong brief §8 nhưng **hiện chưa có trong `src/components/ui/`** (cần kiểm tra lại/tạo mới ở Bước 3, không phải Bước 2 — chỉ ghi nhận ở đây).
  - `/kien-thuc`, `/blog`: tương tự, hiện thông báo rỗng thay vì lưới trống trơn.
  - Trang chủ: sản phẩm nổi bật/danh mục nếu rỗng — **fallback về đúng dữ liệu tĩnh cũ** (`mockFeaturedProducts`/`mockProductCategories`) giống cách `DEFAULT_BANNERS` đang làm cho banner, để trang chủ không bao giờ trống trơn ngay cả khi admin chưa kịp nhập liệu.
- **Chi tiết không tồn tại (`slug` sai hoặc bị xoá):** `san-pham/[slug]`, `kien-thuc/[slug]`, `blog/[slug]` gọi `notFound()` của Next.js — đã là pattern có sẵn ở `san-pham/[slug]/page.tsx`, áp dụng thêm cho 2 route còn lại.
- **Search không có kết quả:** giữ nguyên UI rỗng đã có sẵn trong `SearchModal.tsx` ("Không tìm thấy sản phẩm nào khớp với...") — chỉ đổi nguồn data, không đổi UI trạng thái rỗng.

## 5.4. Renderer cho Lexical richText

- Dùng component **`RichText`** export từ `@payloadcms/richtext-lexical/react` (đã xác nhận export tồn tại trong `node_modules/@payloadcms/richtext-lexical/package.json`, field `exports["./react"]` — không cần cài thêm package).
- Dùng converter mặc định của package cho các node cơ bản (heading, paragraph, list, link, upload/ảnh chèn trong bài) — đủ cho nhu cầu hiện tại (bài viết sức khỏe/blog, không có block tuỳ chỉnh phức tạp).
- Style: bọc trong cùng class `prose prose-emerald` đang dùng ở 2 trang chi tiết hiện tại để giữ nguyên giao diện.

## 5.5. Kế hoạch migrate dữ liệu — KHÔNG viết script seed tự động

**Đã xác nhận (2026-09-20): tự nhập tay qua `/admin`, không viết script seed từ hardcode sang Payload.**

Lý do:
- 4 sản phẩm mẫu trong `products-data.ts` là **placeholder/demo** (brief §11 cũng ghi rõ "Sample data (seed)"), không phải data thật cần giữ nguyên vẹn — nhập tay qua `/admin` vừa là cách để bạn **xác nhận lại UI Admin hoạt động đúng** (đúng quy trình brief §0: "Kiểm tra DB/API" mỗi phase), vừa tránh việc viết 1 script seed dùng một lần rồi bỏ.
- Bài viết (`kien-thuc`/`blog`) hiện có nội dung rất khác nhau giữa `mock-data.ts` và `HEALTH_ARTICLES`/`BLOG_POSTS` (đã nêu ở Bước 1 mục 1C) — không có "1 nguồn sự thật" rõ ràng để tự động chọn seed từ đâu.

**Hệ quả cho Bước 3:** sau khi nối xong mỗi trang, trang đó sẽ **tạm thời hiện `EmptyState`** cho tới khi bạn nhập data qua `/admin` — đây là hành vi đúng theo thiết kế, không phải lỗi, sẽ ghi rõ trong báo cáo Bước 4 (phần nào cần bạn nhập tay để lên đúng dữ liệu).

---

**→ Bước 2 đã chốt đầy đủ (bao gồm mục 5.5). Chờ bạn xác nhận để bắt đầu Bước 3 (code từng trang, commit riêng theo brief đã yêu cầu).**

---

# BƯỚC 3 — Đã triển khai (2026-09-20)

9 commit riêng, theo đúng thứ tự đã duyệt (trang chủ → danh sách sản phẩm → chi tiết sản phẩm → search → kiến thức sức khỏe list+detail → blog list+detail → liên hệ):

1. `docs: add full project audit report and CMS integration plan`
2. `feat(cms): connect homepage sections to Payload CMS`
3. `feat(cms): connect product catalog to Payload CMS`
4. `feat(cms): connect product detail page to Payload CMS`
5. `feat(cms): connect search modal to Payload via new /api/search route`
6. `feat(cms): connect health knowledge list to Payload CMS`
7. `feat(cms): implement health knowledge detail page backed by Payload CMS`
8. `feat(cms): connect blog list to Payload CMS`
9. `feat(cms): implement blog detail page backed by Payload CMS`
10. `fix(cms): use SiteSettings hotline instead of hardcoded value on contact page`

**Hạ tầng mới dùng chung:** `src/lib/queries/{products,articles,site-settings}.ts` (mọi hàm bọc try/catch trả `[]`/`null` khi lỗi, đúng §5.3), `src/types/{product,article}.ts` (view model chuẩn hoá, tách khỏi shape gốc Payload), `src/app/api/search/route.ts` (Route Handler đầu tiên phục vụ business logic của dự án).

**⚠️ Giới hạn quan trọng:** môi trường thực hiện Bước 3 này **không có Node.js/npm** (đã nêu ở `AUDIT_REPORT.md` mục 1) nên **không tự chạy được `npm run build` / `type-check` / `lint`** để xác nhận biên dịch sau khi sửa. Mọi thay đổi đã được rà soát thủ công kỹ (khớp field Payload đã xác nhận ở Bước 1, khớp type `RichText`/`SerializedEditorState` đã kiểm tra trực tiếp trong `node_modules`), nhưng **bắt buộc bạn chạy `npm run build && npm run type-check` trên máy thật trước khi deploy** — đây là việc chưa từng được xác nhận cho các thay đổi này.

---

# BƯỚC 4 — Báo cáo kết thúc

## Trang/tính năng giờ đã sống bằng CMS thật

| Trang/tính năng | Nguồn dữ liệu mới |
|---|---|
| `/` — Danh mục sản phẩm, Sản phẩm nổi bật, Kiến thức sức khỏe, Blog | Payload (`products`, `product-categories`, `articles`) — Banner đã nối từ trước |
| `/san-pham` | Payload `products` + `product-categories`, filter/sort/search vẫn client-side trên data thật |
| `/san-pham/[slug]` | Payload `products`, query theo `slug`, `notFound()` khi không có |
| Search (icon kính lúp ở Header, mọi trang) | Payload `products` qua Route Handler `/api/search` mới |
| `/kien-thuc` | Payload `articles` (`type=healthKnowledge`), danh mục chip tính distinct từ data thật |
| `/kien-thuc/[slug]` | **Viết lại hoàn toàn** — trước đây bỏ qua `slug`, giờ query đúng bài viết + render Lexical richText thật |
| `/blog` | Payload `articles` (`type=blog`), tương tự `/kien-thuc` |
| `/blog/[slug]` | **Viết lại hoàn toàn**, tương tự `/kien-thuc/[slug]` |
| `/lien-he` | Hotline đọc từ `SiteSettings.hotline` thay vì hardcode |

## Vẫn hardcode — có lý do, đã ghi `// TODO` tại chỗ trong code

| Nơi | Lý do | Theo dõi ở |
|---|---|---|
| Trang chủ: Giá trị nổi bật/cốt lõi, Về DSH Nature, Sứ mệnh & Tầm nhìn (`mock-data.ts`) | Chưa có Global `CoreValues`/`AboutPage` | Phase A2 |
| `gioi-thieu/page.tsx` (toàn bộ — Tổng quan, Sơ đồ chiến lược, Chứng nhận, Đội ngũ) | Chưa có Global/Collection tương ứng | Phase A2 |
| `tu-van/page.tsx` — `FAQS` | Chưa có collection `Faqs` | Phase A2 |
| `dai-ly/page.tsx` — `MOCK_DEALERS` | Thuộc domain Prisma (đăng ký đại lý), không phải Payload content | Phase B (dealer backend) |
| SEO field riêng cho `Products` (title/description/OG tuỳ chỉnh) | Dùng metadata mặc định (name + shortDescription) tạm thời | Phase C (cùng sitemap/robots/Schema.org) |
| `getFeaturedProducts()` chọn "sản phẩm nổi bật" bằng N sản phẩm mới nhất | `Products` chưa có field `isFeatured` để admin tự chọn | Phase A2 (ghi chú ngay trong code) |

`src/lib/products-data.ts` và `src/features/home/mock-data.ts` **chưa bị xoá** — đúng yêu cầu, giữ làm tham chiếu/fallback. `products-data.ts` hiện không còn được import ở đâu (đã xác nhận bằng grep); `mock-data.ts` vẫn được trang chủ import làm fallback khi CMS rỗng.

## Cần bạn nhập data qua `/admin` để các trang trên hiển thị đúng (không phải lỗi — đúng thiết kế đã duyệt ở §5.5)

Cho tới khi nhập, các trang sẽ hiện `EmptyState` (sản phẩm/bài viết) hoặc fallback về `mock-data.ts` (trang chủ):

1. **`Product Categories`** (`/admin/collections/product-categories`) — 4 nhóm: Hỗ trợ hô hấp, Hỗ trợ xương khớp, Hỗ trợ tuần hoàn – não bộ, Hỗ trợ giấc ngủ (slug đúng theo brief để URL `?nhom=` hoạt động: `ho-hap`, `xuong-khop`, `tuan-hoan-nao-bo`, `giac-ngu`).
2. **`Products`** (`/admin/collections/products`) — ít nhất vài sản phẩm, nhớ điền đủ `tabs` (8 mục) và ít nhất 1 ảnh để trang chi tiết/card hiển thị đủ.
3. **`Articles`** (`/admin/collections/articles`) — cần cả 2 loại (`type = Kiến thức sức khỏe` và `type = Blog tin tức`); **nhớ điền field `content` (richText)** — nếu để trống, trang chi tiết sẽ hiện "Bài viết chưa có nội dung chi tiết" thay vì bài viết đầy đủ.
4. **`Banners`** — không đổi so với trước (đã hoạt động từ Phase 1), nhắc lại nếu chưa nhập.

## Việc chưa làm trong Phase A (nằm ngoài phạm vi đã duyệt)

- Core Values, About/Mission/Vision, Sơ đồ chiến lược, Chứng nhận, Đội ngũ, FAQs (Phase A2 — cần bạn duyệt schema Global/Collection mới trước khi làm, xem mục 4).
- Dealer system thật (Phase B).
- SEO field riêng cho Products, sitemap.ts/robots.ts/Schema.org (Phase C, theo `AUDIT_REPORT.md` mục 9).
- Chưa chạy `npm run build`/`type-check`/`lint` để xác nhận biên dịch (môi trường này không có Node.js) — **bạn cần tự chạy trước khi deploy**.
