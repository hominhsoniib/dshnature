import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendAdminNotification } from "@/lib/email";

export const dynamic = "force-dynamic";

const contactSchema = z.object({
  fullName: z.string().trim().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  phone: z.string().trim().min(9, "Số điện thoại không hợp lệ"),
  email: z.string().trim().email("Email không hợp lệ").optional().or(z.literal("")),
  subject: z.string().optional(),
  message: z.string().trim().min(5, "Nội dung tin nhắn quá ngắn"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dữ liệu tin nhắn không hợp lệ", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const contactMessage = await prisma.contactMessage.create({
      data: {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email || null,
        subject: data.subject || null,
        message: data.message,
        status: "unread",
      },
    });

    await sendAdminNotification({
      subject: `[DSH Nature] Liên hệ mới từ ${data.fullName}`,
      text: [
        `Họ tên: ${data.fullName}`,
        `SĐT: ${data.phone}`,
        `Email: ${data.email || "(không có)"}`,
        `Tiêu đề: ${data.subject || "(không có)"}`,
        "",
        "Nội dung:",
        data.message,
        "",
        `ID tin nhắn: ${contactMessage.id}`,
      ].join("\n"),
    });

    return NextResponse.json({
      success: true,
      id: contactMessage.id,
      message: "Gửi tin nhắn liên hệ thành công!",
    });
  } catch (error) {
    console.error("[Contact API Error]:", error);
    return NextResponse.json(
      { error: "Lỗi máy chủ khi gửi tin nhắn. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
