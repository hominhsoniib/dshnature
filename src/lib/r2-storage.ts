import {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { r2Client, R2_BUCKET_NAME } from "./r2-client";

interface UploadResult {
  key: string;
  size: number;
}

/**
 * Upload một file lên R2.
 * @param key - đường dẫn/tên file trong bucket, ví dụ "products/abc.jpg"
 * @param body - nội dung file (Buffer, Uint8Array, hoặc string)
 * @param contentType - MIME type, ví dụ "image/jpeg"
 */
export async function uploadFile(
  key: string,
  body: Buffer | Uint8Array | string,
  contentType: string
): Promise<UploadResult> {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  await r2Client.send(command);

  return {
    key,
    size: body instanceof Buffer ? body.length : Buffer.byteLength(body as string),
  };
}

/**
 * Xoá một file khỏi R2.
 */
export async function deleteFile(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });

  await r2Client.send(command);
}

/**
 * Đọc nội dung một file từ R2 (trả về Buffer).
 */
export async function getFile(key: string): Promise<Buffer> {
  const command = new GetObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });

  const response = await r2Client.send(command);
  const byteArray = await response.Body?.transformToByteArray();

  if (!byteArray) {
    throw new Error(`File not found: ${key}`);
  }

  return Buffer.from(byteArray);
}

/**
 * Liệt kê file trong bucket, có thể lọc theo prefix (thư mục ảo).
 * @param prefix - ví dụ "products/" để chỉ lấy file trong thư mục products
 */
export async function listFiles(prefix?: string) {
  const command = new ListObjectsV2Command({
    Bucket: R2_BUCKET_NAME,
    Prefix: prefix,
  });

  const response = await r2Client.send(command);

  return (response.Contents ?? []).map((obj) => ({
    key: obj.Key!,
    size: obj.Size ?? 0,
    lastModified: obj.LastModified,
  }));
}
