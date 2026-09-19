# Security Fixes Applied — DSH Nature

**Ngày fix:** 2026-09-20
**Đối tượng:** 4 finding CRITICAL + 1 finding HIGH trong `SECURITY_AUDIT_REPORT.md`.
**Verify:** `npm run build` ✅ và `npm run type-check` ✅ (đã chạy sau mỗi bước, không gãy).

---

## 1. [CRITICAL] Xoá endpoint `/api/seed-admin`

- **Đã xoá:** `src/app/api/seed-admin/route.ts` (và thư mục rỗng `src/app/api/seed-admin/`).
- **Thay bằng:** `scripts/seed-admin.ts` — script CLI chạy bằng `tsx`, không phải API route nên không public trên internet.
  - Chạy: `SEED_ADMIN_EMAIL=admin@dshnature.vn npm run seed:admin`
  - Không hardcode mật khẩu: nếu không set `SEED_ADMIN_PASSWORD`, script tự sinh mật khẩu ngẫu nhiên (`crypto.randomBytes(18)`) và chỉ in ra console **đúng 1 lần** khi chạy — không bao giờ trả qua HTTP response.
  - Script từ chối chạy nếu thiếu `SEED_ADMIN_EMAIL` (không có default email cố định).
  - Idempotent: nếu email đã tồn tại, script báo và dừng, không ghi đè mật khẩu.
- **Thêm vào `package.json`:**
  - `"seed:admin": "tsx scripts/seed-admin.ts"`
  - `"type-check": "tsc --noEmit"`
  - Thêm devDependency `tsx` (`npm install -D tsx`).

## 2. [CRITICAL] Access control cho `Users` collection

- **File:** `src/collections/Users.ts`
- Thêm field `role` (select: `admin` | `editor`, mặc định `editor`, `required: true`), có field-level access `update` chỉ cho `admin` — chặn một editor tự nâng quyền lên admin cho chính mình.
- Thêm `access`:
  - `create`: chỉ user đã đăng nhập với `role === 'admin'` (dùng helper `isAdmin`). Bootstrap admin đầu tiên khi DB rỗng vẫn hoạt động qua màn "Create first user" của Payload (cơ chế nội tại của Payload tự bỏ access control khi collection `users` chưa có document nào) hoặc qua `scripts/seed-admin.ts`.
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

- **Schema DB cho field mới `Users.role`:** Khi chạy `npm run build` (NODE_ENV=production), Payload **không** tự `push` schema mới vào DB thật (chỉ push khi chạy dev) — log build cho thấy `onInit` bắt được lỗi `column "users"."role" does not exist` khi query DB Neon thật hiện tại (bị catch, không làm build fail, nhưng field chưa có ở DB thật). **Cần chạy `npm run dev` một lần (kích hoạt `push: true`) hoặc `payload migrate` trước khi deploy**, để cột `role` được tạo trên DB thật trước khi ai đăng nhập — nếu không, mọi query liên quan `Users` sẽ lỗi ở runtime cho tới khi schema được đồng bộ. Đây là bước vận hành, không phải lỗi code.
