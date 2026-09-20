# Security Fixes Applied — DSH Nature

**Ngày fix:** 2026-09-20
**Đối tượng:** 4 finding CRITICAL + 1 finding HIGH trong `SECURITY_AUDIT_REPORT.md`.
**Verify:** `npm run build` ✅ và `npm run type-check` ✅ (đã chạy sau mỗi bước, không gãy).

---

## 1. [CRITICAL] Xoá endpoint `/api/seed-admin`

- **Đã xoá:** `src/app/api/seed-admin/route.ts` (và thư mục rỗng `src/app/api/seed-admin/`).
- **Thay bằng:** `scripts/seed-admin.mts` — script CLI chạy bằng `node` (không phải API route nên không public trên internet).
  - Chạy: `SEED_ADMIN_EMAIL=admin@dshnature.vn npm run seed:admin`
  - Không hardcode mật khẩu: nếu không set `SEED_ADMIN_PASSWORD`, script tự sinh mật khẩu ngẫu nhiên (`crypto.randomBytes(18)`) và chỉ in ra console **đúng 1 lần** khi chạy — không bao giờ trả qua HTTP response.
  - Script từ chối chạy nếu thiếu `SEED_ADMIN_EMAIL` (không có default email cố định).
  - Idempotent: nếu email đã tồn tại, script báo và dừng, không ghi đè mật khẩu.
- **Thêm vào `package.json`:**
  - `"seed:admin": "node --experimental-specifier-resolution=node --loader ts-node/esm --loader ./scripts/alias-loader.mjs scripts/seed-admin.mts"` (ban đầu dùng `tsx`, đã đổi — xem mục "Sự cố tooling: tsx không chạy được" bên dưới để biết lý do và cách chẩn đoán).
  - `"type-check": "tsc --noEmit"`
  - devDependency: `ts-node` (đã bỏ `tsx` — không dùng được cho script này, xem bên dưới).

## 2. [CRITICAL] Access control cho `Users` collection

- **File:** `src/collections/Users.ts`
- Thêm field `role` (select: `admin` | `editor`, mặc định `editor`, `required: true`), có field-level access `update` chỉ cho `admin` — chặn một editor tự nâng quyền lên admin cho chính mình.
- Thêm `access`:
  - `create`: chỉ user đã đăng nhập với `role === 'admin'` (dùng helper `isAdmin`). Bootstrap admin đầu tiên khi DB rỗng vẫn hoạt động qua màn "Create first user" của Payload (cơ chế nội tại của Payload tự bỏ access control khi collection `users` chưa có document nào) hoặc qua `scripts/seed-admin.mts`.
  - `read`/`update`: user tự đọc/sửa được chính mình, hoặc admin đọc/sửa được tất cả (dùng pattern trả về `Where` `{ id: { equals: user.id } }` khi không phải admin — đúng chuẩn Payload access control).
  - `delete`: chỉ admin.
- Site này **không có đăng ký khách hàng công khai** qua collection này (đã xác nhận trong comment gốc của file + `src/lib/auth.ts` — khách hàng dùng NextAuth/Prisma riêng), nên không cần nhánh "cho phép create nhưng ép role=customer" như đề xuất trong yêu cầu ban đầu — nhánh đó không áp dụng cho collection này.

## 3. [CRITICAL] Access control cho content collections

- **Files:** `src/collections/Products.ts`, `Articles.ts`, `Banners.ts`, `Media.ts`, `ProductCategories.ts`, `SiteSettings.ts`
- Tạo 2 helper dùng chung tại `src/access/`:
  - `isAdmin.ts` — `({ req: { user } }) => Boolean(user) && user?.role === 'admin'`
  - `isAdminOrEditor.ts` — cho phép cả `admin` và `editor`
- Áp dụng cho từng collection:
  - `read: () => true` (giữ nguyên — public đọc được, đúng vì là site thương mại)
  - `create: isAdminOrEditor`
  - `update: isAdminOrEditor`
  - `delete: isAdmin`
- Global `SiteSettings` (không có `create`/`delete`): `read: () => true`, `update: isAdminOrEditor`.

## 4. [CRITICAL] Bỏ auto-create admin hardcoded trong `payload.config.ts`

- **File:** `src/payload.config.ts`, hook `onInit`
- Đã xoá logic tự `payload.create` admin với password hardcoded `'[REDACTED-old-admin-password]'`.
- Thay bằng: chỉ `payload.find({ collection: 'users', limit: 1 })` để kiểm tra có user nào chưa; nếu `totalDocs === 0` → `console.warn` hướng dẫn chạy `npm run seed:admin` hoặc dùng màn "Create first user" — **không tự tạo user nữa**.

## 5. [HIGH] Bỏ fallback hardcoded cho `PAYLOAD_SECRET`

- **File:** `src/payload.config.ts`
- Xoá `process.env.PAYLOAD_SECRET || '[REDACTED-old-fallback-secret]'`.
- Thay bằng fail-fast ngay khi module được import (trước `buildConfig`):
  ```ts
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error('[Payload] Thiếu biến môi trường PAYLOAD_SECRET. ...')
  }
  ```
  → `secret: process.env.PAYLOAD_SECRET` (không còn fallback).
- **Đã kiểm tra `.env.example`:** field `PAYLOAD_SECRET=` đã để trống với comment hướng dẫn generate (`openssl rand -base64 32`) — không chứa giá trị thật. Không cần sửa thêm.
- **`.env` local đã có `PAYLOAD_SECRET` thật** (đã verify tồn tại, không đọc giá trị) nên build/dev cục bộ không bị chặn bởi fail-fast mới.

---

## Kết quả audit lại sau khi fix — xác nhận không còn collection thiếu access control

| Collection/Global | read | create | update | delete |
|---|---|---|---|---|
| `Users` | self hoặc admin | `isAdmin` | self (trừ field `role`) hoặc admin | `isAdmin` |
| `Products` | public | `isAdminOrEditor` | `isAdminOrEditor` | `isAdmin` |
| `Articles` | public | `isAdminOrEditor` | `isAdminOrEditor` | `isAdmin` |
| `Banners` | public | `isAdminOrEditor` | `isAdminOrEditor` | `isAdmin` |
| `ProductCategories` | public | `isAdminOrEditor` | `isAdminOrEditor` | `isAdmin` |
| `Media` | public | `isAdminOrEditor` | `isAdminOrEditor` | `isAdmin` |
| `SiteSettings` (global) | public | — | `isAdminOrEditor` | — |

Không còn collection/global nào chạy với access control mặc định (open-write) của Payload.

## Git history — secret/password thực từng bị commit (chỉ báo cáo, CHƯA rewrite history)

Đã scan `git log --all -p` cho toàn bộ tên biến secret. Kết quả:

- **Không có giá trị `DATABASE_URL`/`R2_*`/`VNPAY_*`/`MOMO_*`/`NEXTAUTH_SECRET` thật nào bị commit** — các dòng `DATABASE_URL="postgresql://user:password@..."` tìm thấy trong lịch sử chỉ là placeholder mẫu (đến từ tài liệu/template có sẵn trong `node_modules`/docs, không phải giá trị thật của dự án).
- **CÓ 2 giá trị nhạy cảm đã bị commit thật vào git history** (đều nằm trong code, không phải file `.env`):
  1. Chuỗi fallback secret `'[REDACTED-old-fallback-secret]'` — commit `455c3bc` (`fix: add PAYLOAD_SECRET fallback in payload.config.ts`) và còn trong `c034605`.
  2. Mật khẩu admin hardcoded `'[REDACTED-old-admin-password]'` cùng email `admin@dshnature.vn` — commit `c034605` (`feat: auto seed default admin account...`).

**Khuyến nghị (để bạn quyết định, chưa tự thực hiện):**
- Nếu `[REDACTED-old-fallback-secret]` đã từng được dùng làm `PAYLOAD_SECRET` thật trên bất kỳ môi trường nào (production/staging) — **phải rotate `PAYLOAD_SECRET` ngay** (mọi session admin hiện tại sẽ bị invalidate, cần đăng nhập lại). Không cần rewrite git history cho việc này vì bản chất là secret ký JWT, rotate là đủ để vô hiệu hoá giá trị cũ.
- Nếu mật khẩu `[REDACTED-old-admin-password]` đã từng chạy trên bất kỳ môi trường nào — **đổi mật khẩu admin ngay** (qua `/admin` sau khi đăng nhập, hoặc tạo admin mới bằng `npm run seed:admin` rồi xoá/disable admin cũ).
- Rewrite git history (`git filter-repo`/BFG) chỉ cần thiết nếu bạn lo remote repo (GitHub) đã/sẽ public hoặc đã có người ngoài team clone được — quyết định này để bạn cân nhắc dựa trên việc repo `hominhsoniib/dshnature` hiện đang private hay public.

## Việc cần làm thêm (không nằm trong 5 mục fix, nhưng phát sinh khi fix)

- **Schema DB cho field mới `Users.role`:** ~~Cần chạy `npm run dev` một lần hoặc `payload migrate` trước khi deploy~~ — **đã tự động xảy ra**: chạy `npm run seed:admin`/`npm run reset:admin-password` (hoặc `npm run dev`) sẽ kích hoạt `push: true` của Payload và tạo cột `role` trên DB thật. Đã verify: sau khi chạy thử `reset:admin-password` một lần trên DB dev, `npm run build` không còn log lỗi `column "users"."role" does not exist` nữa. Nếu deploy thẳng lên production mà chưa từng chạy 1 trong các lệnh trên nhắm vào DB đó, cột `role` sẽ chưa tồn tại — chạy `npm run seed:admin` (hoặc `npm run dev`) nhắm vào `DATABASE_URL` production ít nhất 1 lần trước khi có traffic thật.

## Sự cố tooling: `tsx` không chạy được `scripts/*.ts` — đã đổi sang `node` + `ts-node/esm`

Khi chạy `npm run seed:admin`/`reset:admin-password` bản đầu (dùng `tsx`), gặp lỗi:

```
Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: No "exports" main defined in .../node_modules/file-type/package.json
    at ... resolveTsPaths (tsx/dist/register-*.cjs...)
```

**Nguyên nhân gốc (đã xác nhận bằng cách đọc source `tsx` đã bundle, không đoán):** `tsx` luôn patch `Module._resolveFilename` (CJS resolver) của Node cho MỌI specifier nó load, kể cả khi file đang chạy là ESM — không có cách tắt qua `--tsconfig`, qua `.mts`, hay qua `node --import tsx`. `file-type@21.3.4` (dependency của `payload`, dùng cho kiểm tra MIME khi upload) là gói pure-ESM, `package.json` của nó chỉ khai báo condition `"import"`/`"module-sync"` trong `exports`, không có `"require"`. Khi resolver bị `tsx` ép chạy qua đường CJS, Node đòi condition `"require"` → không có → throw. Bug này nằm ở `tsx` (đã thử bản mới nhất 4.23.13, vẫn lỗi), không phải ở code của dự án. Đây cùng gốc với lỗi `ERR_REQUIRE_ASYNC_MODULE`/`ERR_REQUIRE_ESM` đã ghi chú trước đó ở `src/types/payload-content.ts` (cho `payload generate:types`) và ở `payload.config.ts` (cho `payload migrate:create`) — bản chất đều là xung đột ESM/CJS giữa Node và các gói pure-ESM trong dependency tree của Payload (`file-type`, `@payloadcms/richtext-lexical`, `@payloadcms/db-postgres`), vốn chỉ được `next build`/`next dev` (Webpack/Turbopack — không quan tâm quy tắc ESM/CJS của Node) che đi, không phải do dự án thiếu cấu hình.

**Đã thử và loại (không dùng được):**
- `tsx --tsconfig <tsconfig không có "paths">` — vẫn lỗi giống hệt.
- `node --import tsx script.ts` — vẫn lỗi giống hệt (cùng resolver bug).
- `.mts` + `tsx` — vẫn lỗi giống hệt.
- `node --loader ts-node/esm` (không kèm cấu hình khác) — lỗi khác: `Cannot use import statement outside a module` (vì `src/payload.config.ts` bị coi là CommonJS do package.json gốc không có `"type": "module"`).
- `npx payload run` (mặc định, dùng `tsx` nội bộ) — lỗi `ERR_REQUIRE_ESM` khi `require('payload')`.
- `npx payload run --use-swc` (dùng `@swc-node/register/esm`) — tiến xa hơn nhưng vẫn vướng cùng vấn đề module-format cho `payload.config.ts`.

**Giải pháp cuối cùng (đang dùng, đã verify chạy thành công tới bước kết nối DB thật):**
1. `src/package.json` (file mới, chỉ có `{"type": "module", "private": true}`) — khoanh vùng để Node coi MỌI file dưới `src/` là ESM thật sự khi được `import()` trực tiếp (không ảnh hưởng `next build`/`next dev` vì Webpack/Turbopack không đọc field `type` của Node để quyết định cách bundle — đã verify `npm run build`/`type-check`/`lint` vẫn pass sau khi thêm file này).
2. Đổi 2 script sang phần mở rộng `.mts` (`scripts/seed-admin.mts`, `scripts/reset-admin-password.mts`) — báo hiệu rõ ràng, không phụ thuộc suy đoán, rằng đây là ESM (không cần đụng tới `src/`).
3. `scripts/alias-loader.mjs` (file mới) — một Node loader hook nhỏ, tự viết, chỉ làm đúng 1 việc: dịch specifier `@/...` (alias trong `tsconfig.json`) sang đường dẫn thật dưới `src/`, vì `ts-node/esm` không tự đọc field `paths` của tsconfig.
4. Lệnh chạy cuối cùng: `node --experimental-specifier-resolution=node --loader ts-node/esm --loader ./scripts/alias-loader.mjs scripts/<script>.mts` (thứ tự `--loader` quan trọng: loader đăng ký SAU chạy TRƯỚC trong resolve hook chain, nên `alias-loader.mjs` phải đứng sau `ts-node/esm` để nó được ưu tiên xử lý specifier `@/...` trước).
5. Đã bỏ `tsx` khỏi `devDependencies` (không dùng được cho việc này nữa, gây nhầm lẫn nếu để lại); thêm `ts-node`.

**Đã verify:** `npm run type-check` ✅, `npm run lint` ✅, `npm run build` ✅ (test riêng, tạm đổi tên `.env.production.local` ra ngoài trong lúc build để không vô tình kết nối DB production — đã khôi phục lại nguyên trạng ngay sau đó), và `npm run reset:admin-password` (với email giả để không đổi dữ liệu thật) chạy hết pipeline: load env → kết nối Neon dev DB thật → tự động `push` schema (tạo cột `role`) → query `users` → báo đúng "không tìm thấy admin" (vì DB dev hiện chưa có admin nào — `onInit` không còn tự tạo nữa theo mục 4 ở trên). Chưa chạy `seed:admin` thật để tạo admin thật — bạn tự chạy để mật khẩu sinh ra chỉ hiện trên terminal của bạn, không qua tay tôi.

**Lưu ý về phiên bản Node:** Đã verify trên Node v20.18.0. Ghi chú cũ trong `src/types/payload-content.ts` nói dự án từng chạy Node 24.17 khi gặp lỗi tương tự (`ERR_REQUIRE_ASYNC_MODULE`) — chưa verify được giải pháp này trên Node 24.x. Nếu máy bạn dùng Node 24, chạy `npm run seed:admin` một lần trước; nếu vẫn gặp lỗi ESM/CJS, báo lại kèm lỗi đầy đủ.
