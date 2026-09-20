# Task: Hiển thị ảnh sản phẩm (Payload Media) lên frontend

## Bối cảnh
- R2 bucket `dsh-nature-media` đã bật Public Access (r2.dev subdomain)
- Public URL: https://pub-2befd13a4b0840138bfe6eae5639a765.r2.dev
- Payload Media collection đã dùng R2 làm storage qua plugin s3Storage (đã cấu hình từ task trước)
- Products collection quản lý trong Payload CMS

## Yêu cầu

### 1. Cấu hình public URL cho Media
- Kiểm tra `payload.config.ts` — trong cấu hình `s3Storage`, thêm option để build public URL đúng dùng domain https://pub-2befd13a4b0840138bfe6eae5639a765.r2.dev thay vì URL nội bộ R2 (mặc định S3 SDK sẽ trả về endpoint không public được)
- Nếu plugin storage-s3 có sẵn config `generateFileURL` hoặc tương tự, dùng nó để build URL dạng: `https://pub-2befd13a4b0840138bfe6eae5639a765.r2.dev/{filename}`
- Nếu không có sẵn option đó trong plugin, tạo helper function riêng để build URL từ `doc.filename` khi render ảnh ở frontend

### 2. Kiểm tra Products collection có field ảnh chưa
- Đọc schema Products collection trong payload.config.ts (hoặc collections/Products.ts nếu tách file riêng)
- Nếu CHƯA có field ảnh (relationship tới Media, hoặc upload field), thêm field `images` (kiểu upload/relationship tới Media, cho phép nhiều ảnh — hasMany hoặc array) — đặt tên field rõ ràng, ví dụ `images` hoặc `gallery`
- Nếu ĐÃ có field ảnh rồi, báo lại tên field đang dùng, không tạo trùng

### 3. Hiển thị ảnh trên trang danh sách sản phẩm
- Tìm component/page hiện tại render danh sách sản phẩm (route `/san-pham` theo menu, hoặc tương tự — kiểm tra route thực tế trong `src/app/(storefront)`)
- Thêm hiển thị ảnh đầu tiên (hoặc ảnh chính) của mỗi sản phẩm trong card sản phẩm, dùng Next.js `<Image>` component (không dùng thẻ `<img>` thường) để tối ưu
- Cấu hình `next.config.ts` thêm domain `pub-2befd13a4b0840138bfe6eae5639a765.r2.dev` vào `images.remotePatterns` (bắt buộc, nếu không Next Image sẽ chặn ảnh từ domain lạ)

### 4. Hiển thị ảnh trên trang chi tiết sản phẩm
- Tìm trang chi tiết sản phẩm (dynamic route dạng `/san-pham/[slug]` hoặc tương tự)
- Hiển thị đầy đủ gallery ảnh sản phẩm (nếu field cho phép nhiều ảnh) — có thể làm carousel/gallery đơn giản, hoặc chỉ hiển thị dạng grid nếu chưa cần carousel phức tạp
- Vẫn dùng `<Image>` component, đảm bảo có `alt` text hợp lý (dùng tên sản phẩm nếu ảnh không có alt riêng)

## Lưu ý
- Không sửa lại cấu trúc R2 bucket, API token, hay 2 route /api/upload, /api/files (đã xong, không liên quan task này)
- Nếu Products collection hiện đang hardcode data mẫu (theo AUDIT_REPORT.md có nhắc), kiểm tra xem phần hiển thị ảnh cần áp dụng cho data thật từ Payload API hay vẫn còn đang dùng mock — báo lại rõ trạng thái hiện tại trước khi sửa
- Sau khi xong, test bằng cách: vào /admin thêm 1 sản phẩm có ảnh thật, xác nhận ảnh hiển thị đúng trên trang danh sách và trang chi tiết ở frontend (localhost:3000)
- Báo lại: (a) field ảnh trong Products tên gì, (b) các file đã sửa, (c) còn vướng gì cần quyết định thêm không
