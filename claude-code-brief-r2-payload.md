# Task: Gắn Cloudflare R2 làm storage cho Payload CMS Media collection

## Bối cảnh
- Project: DSH Nature website (D:\DSH-NATURE), Next.js + Payload CMS 3.x
- Đã tạo sẵn Cloudflare R2 bucket `dsh-nature-media`, credentials đã có trong `.env.local`:
  R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT, R2_BUCKET_NAME
- Products collection được quản lý trong Payload CMS (/admin), ảnh sản phẩm hiện chưa có nơi lưu trữ đúng chuẩn
- Đã có sẵn code upload thủ công (src/lib/r2-client.ts, src/lib/r2-storage.ts, src/app/api/upload, src/app/api/files) — KHÔNG dùng cho ảnh sản phẩm, giữ lại cho mục đích khác (form đính kèm file...)

## Yêu cầu
1. Cài `@payloadcms/storage-s3`
2. Tìm và đọc file `payload.config.ts` thật trong project (kiểm tra `src/lib/payload.ts` để biết đường dẫn chính xác)
3. Thêm plugin `s3Storage` vào mảng `plugins` trong payload.config.ts, trỏ vào R2 qua S3-compatible API:
   - endpoint: process.env.R2_ENDPOINT
   - region: "auto"
   - credentials từ R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY
   - bucket: process.env.R2_BUCKET_NAME
   - collections: áp dụng cho collection Media hiện có (kiểm tra tên chính xác trong config, thường là "media")
4. Đảm bảo Products collection tham chiếu đúng tới Media collection này (kiểm tra field ảnh trong Products schema, dùng relationship tới Media nếu chưa có)
5. Cấu hình để ảnh có thể hiển thị công khai trên frontend (kiểm tra field `disableLocalStorage`, và nếu cần custom domain cho bucket thì báo lại — bucket hiện đang Public Access: Disabled, cần bật hoặc gắn custom domain trên Cloudflare Dashboard, việc này KHÔNG tự làm được qua code)
6. Restart dev server, test upload ảnh thật trong /admin → Products → thêm ảnh, xác nhận ảnh lưu vào R2 (không lưu local) và hiển thị được trên trang sản phẩm frontend

## Lưu ý
- Không sửa/xoá code r2-client.ts, r2-storage.ts, api/upload, api/files hiện có — chúng phục vụ mục đích khác
- Nếu payload.config.ts có cấu trúc plugins khác biệt (không phải mảng đơn giản), báo lại thay vì tự đoán
- Sau khi xong, liệt kê rõ: (a) file nào đã sửa, (b) có cần thao tác thủ công gì trên Cloudflare Dashboard không (VD: bật Public Access, tạo custom domain)
