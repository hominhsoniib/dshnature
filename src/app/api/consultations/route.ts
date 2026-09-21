import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const consultationSchema = z.object({
  fullName: z.string().trim().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  phone: z.string().trim().min(9, "Số điện thoại không hợp lệ"),
  email: z.string().trim().email("Email không hợp lệ").optional().or(z.literal("")),
  age: z.number().int().positive().optional().nullable(),
  gender: z.string().optional().nullable(),
  healthIssue: z.string().trim().min(5, "Nội dung thắc mắc y khoa quá ngắn"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = consultationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dữ liệu tư vấn không hợp lệ", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const consultation = await prisma.consultationRequest.create({
      data: {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email || null,
        age: data.age ?? null,
        gender: data.gender ?? null,
        healthIssue: data.healthIssue,
        status: "pending",
      },
    });

    return NextResponse.json({
      success: true,
      id: consultation.id,
      message: "Gửi câu hỏi tư vấn sức khỏe thành công!",
    });
  } catch (error) {
    console.error("[Consultations API Error]:", error);
    return NextResponse.json(
      { error: "Lỗi máy chủ khi gửi yêu cầu tư vấn. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
