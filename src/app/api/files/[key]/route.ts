import { NextRequest, NextResponse } from "next/server";
import { deleteFile } from "@/lib/r2-storage";
import { isRequestFromAdminOrEditor } from "@/lib/require-admin-or-editor";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  if (!(await isRequestFromAdminOrEditor(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { key: rawKey } = await params;
    const key = decodeURIComponent(rawKey);
    await deleteFile(key);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Delete failed" },
      { status: 500 }
    );
  }
}
