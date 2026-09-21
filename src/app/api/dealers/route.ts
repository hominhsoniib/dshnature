import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const dealerSchema = z.object({
  fullName: z.string().trim().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  phone: z.string().trim().min(9, "Số điện thoại không hợp lệ"),
  email: z.string().trim().email("Email không hợp lệ").optional().or(z.literal("")),
  region: z.string().trim().min(1, "Vui lòng chọn hoặc nhập khu vực kinh doanh"),
  experience: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = dealerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dữ liệu đăng ký không hợp lệ", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const dealerRequest = await prisma.dealerRequest.create({
      data: {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email || null,
        region: data.region,
        experience: data.experience || null,
        message: data.message || null,
        status: "pending",
      },
    });

    return NextResponse.json({
      success: true,
      id: dealerRequest.id,
      message: "Đăng ký làm đại lý DSH Nature thành công!",
    });
  } catch (error) {
    console.error("[Dealers API Error]:", error);
    return NextResponse.json(
      { error: "Lỗi máy chủ khi gửi đăng ký đại lý. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
