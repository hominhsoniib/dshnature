import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@/lib/r2-storage";
import { isRequestFromAdminOrEditor } from "@/lib/require-admin-or-editor";

export async function POST(request: NextRequest) {
  if (!(await isRequestFromAdminOrEditor(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Đặt tên file duy nhất, giữ nguyên phần mở rộng
    const ext = file.name.split(".").pop();
    const key = `uploads/${Date.now()}-${crypto.randomUUID()}.${ext}`;

    const result = await uploadFile(key, buffer, file.type);

    return NextResponse.json({
      success: true,
      key: result.key,
      size: result.size,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
