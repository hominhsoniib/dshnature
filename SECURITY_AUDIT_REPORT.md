# Security Audit Report — DSH Nature

**Ngày audit:** 2026-09-20
**Phương pháp:** Đọc trực tiếp toàn bộ source code trong `src/`, `prisma/`, cấu hình gốc (`payload.config.ts`, `next.config.ts`, `.env*`, `.gitignore`) và lịch sử git. Không suy đoán — mọi finding dưới đây trích từ code thực tế, kèm số dòng.

**Bối cảnh quan trọng:** Dự án đang ở **Phase 0/1** (theo comment trong code, ví dụ `prisma/schema.prisma`, `src/lib/auth.ts`). Rất nhiều hạng mục người dùng yêu cầu audit (orders, dealers, consultations, Prisma models, VNPay/MoMo IPN, upload R2 presigned URL, Resend email) **chưa được implement** — chỉ có UI tĩnh (ví dụ `src/app/(storefront)/thanh-toan/page.tsx` chỉ là state React, không gọi API nào). Các mục này được ghi chú rõ là "N/A — chưa tồn tại" kèm cảnh báo cần lưu ý khi triển khai thật, thay vì bị bỏ qua.

---

## [CRITICAL] Endpoint `/api/seed-admin` cho phép bất kỳ ai reset mật khẩu admin về giá trị cố định và trả lại mật khẩu trong response

- **Vị trí:** `src/app/api/seed-admin/route.ts:5-59`
- **Vấn đề:** Route `GET /api/seed-admin` **không có bất kỳ xác thực/authorization nào**. Bất kỳ ai (không cần đăng nhập) gọi `GET /api/seed-admin` sẽ:
  1. Nếu user `admin@dshnature.vn` đã tồn tại → **reset mật khẩu** của user đó về hardcoded string `'[REDACTED-old-admin-password]'` (dòng 24).
  2. Nếu chưa tồn tại → tạo mới admin với mật khẩu đó.
  3. Trong cả 2 trường hợp, **trả email + mật khẩu plaintext ngay trong JSON response** (dòng 30-33, 45-48).

  Đây là full admin account takeover: attacker chỉ cần biết URL (public, dễ đoán) là có ngay quyền admin toàn bộ Payload CMS (`/admin`), có thể sửa/xoá toàn bộ nội dung, user, media.
- **Cách fix:**
  - Xoá hoàn toàn route này khỏi codebase production (nó chỉ nên là script chạy 1 lần cục bộ, không nên là API endpoint public).
  - Nếu buộc phải giữ dạng endpoint (vd cho seed CI/CD), bắt buộc: chỉ chạy khi `NODE_ENV !== 'production'`, yêu cầu secret header/token so sánh bằng hằng thời gian (constant-time compare) với biến env riêng (không phải giá trị cố định), method không phải GET (tránh bị cache/crawl), và không bao giờ trả mật khẩu trong response.
  - Đổi ngay mật khẩu admin hiện tại trên môi trường production nếu route này đã từng được deploy public.

## [CRITICAL] Collection `Users` (Payload admin) không có `access` control → cho phép tự đăng ký làm admin ẩn danh

- **Vị trí:** `src/collections/Users.ts:11-18`
- **Vấn đề:** Collection này có `auth: true` và **không khai báo `access`**. Payload CMS mặc định (khi không set `access`) áp dụng chính sách **mở hoàn toàn** cho `create/read/update/delete` — đây là hành vi default đã được chính Payload docs cảnh báo là nguy hiểm nếu không override. Vì `Users.slug` chính là collection dùng cho `admin.user` trong `payload.config.ts:22` (collection xác định ai được vào `/admin`), hậu quả là:
  - Bất kỳ ai gọi `POST /api/users` (route REST tự sinh tại `src/app/(payload)/api/[...slug]`) với `{ email, password }` tuỳ ý → **tạo được một tài khoản admin mới** không cần mời/duyệt.
  - Tài khoản đó đăng nhập `/admin` ngay được, có full quyền quản trị CMS.
  - Thêm vào đó, `read`/`update`/`delete` cũng mở public → ai cũng list được danh sách email toàn bộ admin (`GET /api/users`), sửa/xoá tài khoản admin khác qua ID (kể cả đổi email/password của admin gốc).
- **Cách fix:** Thêm `access` rõ ràng cho collection `Users`, ví dụ:
  ```ts
  access: {
    create: ({ req }) => Boolean(req.user), // chỉ admin đã đăng nhập mới tạo được admin mới
    read: ({ req }) => Boolean(req.user),
    update: ({ req, id }) => Boolean(req.user) && req.user.id === id,
    delete: ({ req }) => Boolean(req.user?.roles?.includes('super-admin')),
  }
  ```
  Không bao giờ để collection chứa tài khoản `admin.user` chạy với access control mặc định.

## [CRITICAL] Toàn bộ Collection nội dung (Products, Articles, Banners, ProductCategories, Media) và Global SiteSettings chỉ khai báo `access.read`, để mặc định `create/update/delete` mở public

- **Vị trí:**
  - `src/collections/Products.ts:23-25`
  - `src/collections/Articles.ts:9-11`
  - `src/collections/Banners.ts:14-16`
  - `src/collections/ProductCategories.ts:9-11`
  - `src/collections/Media.ts:11-13`
  - `src/collections/SiteSettings.ts:11-13` (Global)
- **Vấn đề:** Mỗi collection chỉ set `access: { read: () => true }`. Việc set `read: true` là dư thừa (đã là default), nhưng quan trọng hơn là **`create`, `update`, `delete` không hề bị override**, nên vẫn giữ default **mở toàn quyền cho unauthenticated request**. Kết quả: bất kỳ ai (không cần login) có thể qua REST API tự sinh (`/api/products`, `/api/articles`, `/api/banners`, `/api/media`, `/api/globals/site-settings`, ...) để:
  - Tạo/sửa/xoá sản phẩm, bài viết, banner tuỳ ý (deface website, chèn nội dung sai lệch — đặc biệt nhạy cảm vì `Products.ts` có logic kiểm duyệt từ khoá TPCN theo Nghị định 15/2018/NĐ-CP, nhưng attacker có thể bypass hoàn toàn bằng cách gọi API trực tiếp thay vì qua Admin UI).
  - Sửa `site-settings` (hotline, email, social links) → phục vụ lừa đảo khách hàng (đổi hotline/Zalo sang số của attacker).
  - Upload file bất kỳ vào `media` (không giới hạn ai được tạo).
- **Cách fix:** Với mọi collection quản trị nội dung, giới hạn `create/update/delete` cho user đã đăng nhập (admin), chỉ giữ `read` mở public:
  ```ts
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  }
  ```
  Áp dụng tương tự cho Global `SiteSettings` (`read`/`update`).

## [CRITICAL] `payload.config.ts` `onInit` tự tạo admin với mật khẩu hardcoded mỗi lần server khởi động nếu tài khoản chưa tồn tại

- **Vị trí:** `src/payload.config.ts:43-66`
- **Vấn đề:** Ngay cả khi xoá route `/api/seed-admin`, hook `onInit` vẫn tự động tạo `admin@dshnature.vn` / `'[REDACTED-old-admin-password]'` (dòng 57-59) mỗi lần app khởi động (mọi lần deploy/restart) nếu tài khoản chưa tồn tại. Mật khẩu là **hằng số hardcoded trong source đã/sẽ commit lên git** (xem git log: `feat: auto seed default admin account...`) — bất kỳ ai đọc được repo (kể cả sau này public hoá, hoặc leak) đều biết chính xác thông tin đăng nhập admin mặc định.
- **Cách fix:**
  - Không hardcode mật khẩu trong source. Đọc từ biến env riêng (`INITIAL_ADMIN_PASSWORD`), sinh ngẫu nhiên nếu không có, và log ra console một lần duy nhất (không lưu plaintext ở đâu khác) để người vận hành đổi ngay.
  - Bắt buộc flag `forcePasswordChange` hoặc yêu cầu đổi mật khẩu ngay lần đăng nhập đầu tiên.
  - Đổi ngay mật khẩu này trên mọi môi trường đã từng chạy code này.

## [HIGH] `PAYLOAD_SECRET` có fallback hardcoded trong source khi thiếu biến env

- **Vị trí:** `src/payload.config.ts:32`
  ```ts
  secret: process.env.PAYLOAD_SECRET || '[REDACTED-old-fallback-secret]',
  ```
- **Vấn đề:** Secret này dùng để ký JWT session cho `/admin`. Nếu triển khai production quên set `PAYLOAD_SECRET` (hoặc secret bị xoá do lỗi config), server **âm thầm chạy với secret cố định đã biết công khai trong git history**, cho phép attacker tự forge session token hợp lệ cho bất kỳ user nào → chiếm toàn quyền admin mà không cần mật khẩu. Vì đây là fallback "âm thầm" (không throw, không cảnh báo runtime), lỗi thiếu env sẽ không bị phát hiện cho tới khi bị khai thác.
- **Cách fix:**
  ```ts
  secret: process.env.PAYLOAD_SECRET ?? (() => { throw new Error('PAYLOAD_SECRET is required') })(),
  ```
  Không dùng fallback tĩnh cho bất kỳ secret ký session/JWT nào. Đồng thời rotate `PAYLOAD_SECRET` thật trên production ngay vì giá trị fallback đã nằm trong git history công khai của repo.

## [HIGH] NextAuth `authOptions` không có kiểm tra `NEXTAUTH_SECRET` tồn tại — nếu thiếu, NextAuth fallback không an toàn

- **Vị trí:** `src/lib/auth.ts:53`
  ```ts
  secret: process.env.NEXTAUTH_SECRET,
  ```
- **Vấn đề:** Nếu `NEXTAUTH_SECRET` không được set (dev quên, hoặc lỗi deploy), NextAuth v4 sẽ dùng giá trị fallback nội bộ không ổn định giữa các lần khởi động (hoặc cảnh báo nhưng vẫn chạy tuỳ version) — dẫn tới JWT session có thể bị vô hiệu hoặc, tuỳ cấu hình, dễ bị đoán. Đây không hardcode như Payload, nhưng thiếu fail-fast.
- **Cách fix:** Thêm validate khi module load:
  ```ts
  if (!process.env.NEXTAUTH_SECRET) throw new Error('NEXTAUTH_SECRET is required')
  ```

## [MEDIUM] Không có rate limiting cho bất kỳ endpoint xác thực nào (Payload admin login, NextAuth)

- **Vị trí:** Không tìm thấy `middleware.ts` nào trong project (`find . -iname "middleware*"` không có kết quả); không có rate-limit logic trong `src/lib/auth.ts` hay `src/app/api/**`.
- **Vấn đề:** Không có lớp chống brute-force ở tầng ứng dụng cho login admin (`/admin` → Payload REST auth) hoặc NextAuth. Payload có cơ chế `loginAttempts`/lock mặc định khi `auth: true` không custom (built-in framework default), nhưng NextAuth Credentials provider hiện tại chỉ throw lỗi "chưa khả dụng" (`src/lib/auth.ts:40-44`) nên chưa áp dụng — cần bổ sung khi Phase 3 hoàn thiện email/password login thật.
- **Cách fix:** Khi implement Credentials provider thật ở Phase 3, thêm rate limiting theo IP + theo email (ví dụ Upstash/Redis fixed-window) trước khi verify password, và giữ nguyên cơ chế lock built-in của Payload cho `/admin`.

## [LOW] Không có security headers (CSP, X-Frame-Options, HSTS) trong `next.config.ts`

- **Vị trí:** `next.config.ts:1-18` — chỉ khai báo `images.remotePatterns`, không có `headers()`.
- **Vấn đề:** Thiếu các header phòng vệ chiều sâu: không có CSP (giảm khả năng chặn XSS nếu về sau có lỗ hổng render user input), không có `X-Frame-Options`/`frame-ancestors` (chống clickjacking cho `/admin`), không có HSTS.
- **Cách fix:** Thêm `headers()` trong `next.config.ts`:
  ```ts
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ]
  },
  ```
  CSP nên được thêm sau khi rà soát các domain script/style thực tế đang dùng (Payload admin UI cần khá nhiều `unsafe-inline`/`unsafe-eval` cho editor, nên cân nhắc chỉ áp CSP nghiêm cho route storefront, không áp cho `/admin`).

## [LOW] `postgresAdapter` dùng `push: true` — tự động đồng bộ schema, không qua migration có kiểm soát

- **Vị trí:** `src/payload.config.ts:36-41`
- **Vấn đề:** `push: true` khiến Payload tự `db push` schema mỗi lần khởi động — phù hợp dev nhưng rủi ro vận hành ở production (không có migration history, thay đổi schema không được review/audit, có thể gây mất dữ liệu nếu field bị đổi/xoá ngoài ý muốn). Không phải lỗ hổng bảo mật trực tiếp nhưng ảnh hưởng đến toàn vẹn dữ liệu và khả năng audit.
- **Cách fix:** Chuyển sang Payload migrations (`payload migrate`) trước khi lên production, tắt `push` ở production build.

---

## Các mục đã kiểm tra nhưng KHÔNG có finding (hoặc chưa áp dụng được vì chưa implement)

| Mục yêu cầu audit | Kết quả |
|---|---|
| Hardcoded API keys/DB string trong source | Không tìm thấy (grep secrets pattern trên toàn `src/` — sạch) |
| `.env`/`.env.local` bị commit git | Không — `.gitignore` chặn `.env*` từ đầu, `git log`/`git ls-files` xác nhận chưa từng commit |
| `.env.example` leak giá trị thật | Không — chỉ có placeholder/comment hướng dẫn |
| Biến `NEXT_PUBLIC_*` expose secret | Không có biến `NEXT_PUBLIC_*` nào được dùng trong `src/` hiện tại |
| Google OAuth scope quá rộng | `GoogleProvider` (`src/lib/auth.ts:24-28`) dùng scope mặc định của `next-auth`, không custom mở rộng — ổn |
| Session strategy NextAuth | `strategy: 'jwt'` (`src/lib/auth.ts:51`) — hợp lý cho phase hiện tại, không có gì bất thường |
| Password hashing (bcrypt/argon2) | Credentials provider hiện chỉ là stub `throw new Error(...)` (`src/lib/auth.ts:40-44`), **chưa có logic verify password thật** → không có gì để audit; Payload tự quản lý hashing cho collection `Users` bằng cơ chế nội bộ (không phải code của dự án). **Cần re-audit khi Phase 3 implement Credentials provider thật** — bắt buộc dùng bcrypt/argon2 khi đó, không tự viết hash. |
| API routes cho orders/dealers/consultations, IDOR | Chưa tồn tại — chỉ có UI tĩnh tại `src/app/(storefront)/dai-ly`, `tu-van`, `gio-hang`, `thanh-toan` (không có `fetch`/`axios` gọi API nào, xác nhận bằng grep). Không có gì để audit; risk cần theo dõi khi các API này được thêm (đặc biệt: object ID trong URL phải kiểm tra ownership). |
| Input validation (Zod) trên API endpoint | Chỉ 2 route API tồn tại (`auth`, `seed-admin`), không route nào nhận input JSON cần validate. `zod` mới chỉ dùng ở component client `Newsletter.tsx` (validate email trước khi gọi API — nhưng API thật `TODO` chưa có, xem comment dòng 28-31 trong file đó). |
| CORS trên API routes | Không có custom CORS config nào trong `src/app/api/**` — dùng default Next.js same-origin, không có lỗ hổng CORS vì không có route nào set `Access-Control-Allow-Origin: *`. |
| VNPay/MoMo IPN signature verification | **Chưa implement** — `src/app/(storefront)/thanh-toan/page.tsx` chỉ là React state chọn phương thức thanh toán (`useState<"cod"\|"bank"\|"vnpay"\|"momo">`), không có endpoint callback/IPN nào trong `src/app/api`. **Bắt buộc khi implement**: verify `vnp_SecureHash`/MoMo `signature` bằng HMAC so với `HASH_SECRET`, verify amount + orderId khớp đơn hàng trong DB trước khi mark "đã thanh toán", và đảm bảo idempotency (kiểm tra trạng thái đã xử lý trước khi update) để chống replay. |
| SQL injection qua raw query | Không có Prisma model/query nào được viết (`prisma/schema.prisma` chỉ có `generator`/`datasource`, chưa có `model` nào — xem comment dòng 18-27 giải thích rõ đây là Phase 0). Không có raw query nào trong `src/`. |
| Prisma connection SSL | `.env.example` khai báo `DATABASE_URL="postgresql://...?sslmode=require"` — đúng, nhưng phụ thuộc người vận hành giữ đúng khi điền `.env` thật (Neon yêu cầu SSL, không set sẽ lỗi connect nên khó bị bỏ sót). |
| Field nhạy cảm (password/token) bị leak qua API response | Payload tự động loại `password`/`salt`/`hash` khỏi response cho collection `auth: true` (framework default) — không có override nào trong `Users.ts` làm lộ field này. |
| File upload validate type/size, presigned URL expiry | Chưa có logic upload tuỳ chỉnh — dùng thẳng `upload: true` của Payload + plugin `@payloadcms/storage-s3` (`Media.ts:21`, `payload.config.ts:67-82`) với default settings, chưa custom giới hạn `mimeTypes`/`maxFileSize`. Không phải lỗ hổng nhưng nên giới hạn `mimeTypes` trong `Media.ts` để tránh upload file thực thi (`.php`, `.html`, ...) lên R2 khi phase sau mở upload cho user ngoài admin. |
| R2 bucket public leak | Bucket được cấu hình qua `s3Storage` plugin, không có logic project tự set ACL — phụ thuộc cấu hình bucket trên Cloudflare (ngoài phạm vi code). Khuyến nghị kiểm tra ACL bucket trên R2 dashboard: chỉ nên public-read cho object đã publish qua Payload, không list toàn bucket. |
| Resend API key scope / email template injection | `resend` có trong `package.json` nhưng **không được import/dùng ở đâu trong `src/`** — chưa implement, không có gì để audit. |
| Middleware bảo vệ `/admin`, `/dashboard` | Không có `middleware.ts` trong project — route `/admin` được bảo vệ trực tiếp bởi Payload's built-in admin auth (route group `src/app/(payload)/admin/[[...segments]]`), đây là cơ chế nội tại của framework, không phải lỗ hổng. Không có route `/dashboard` nào tồn tại. |

---

## Tổng kết ưu tiên xử lý ngay

1. **Xoá `/api/seed-admin`** hoặc khoá nó lại — đây là lỗ hổng nghiêm trọng nhất, khai thác được ngay bây giờ với 1 request GET.
2. **Thêm `access` control cho collection `Users`** — chặn tự đăng ký admin qua REST API.
3. **Thêm `access.create/update/delete` cho mọi collection nội dung** (Products, Articles, Banners, ProductCategories, Media) và Global `SiteSettings`.
4. **Bỏ fallback hardcoded của `PAYLOAD_SECRET`**, rotate secret thật trên production.
5. **Đổi mật khẩu admin** trên mọi môi trường đã từng chạy `onInit`/`seed-admin` với giá trị `[REDACTED-old-admin-password]`.

Sau khi vá 5 mục trên, nên chạy lại audit vòng 2 tập trung vào Phase 3 (Payment IPN, Customer auth thật, Prisma models orders/dealers) khi các phần đó được implement.
