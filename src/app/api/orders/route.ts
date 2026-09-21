import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const orderItemSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
});

const orderSchema = z.object({
  customerName: z.string().trim().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  customerPhone: z.string().trim().min(9, "Số điện thoại không hợp lệ"),
  customerEmail: z.string().trim().email("Email không hợp lệ").optional().or(z.literal("")),
  shippingAddress: z.string().trim().min(5, "Địa chỉ nhận hàng quá ngắn"),
  province: z.string().optional(),
  district: z.string().optional(),
  ward: z.string().optional(),
  note: z.string().optional(),
  paymentMethod: z.enum(["cod", "vnpay", "momo"]),
  items: z.array(orderItemSchema).min(1, "Giỏ hàng rỗng"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = orderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dữ liệu đơn hàng không hợp lệ", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Tính tổng tiền từ backend
    const totalAmount = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Sinh mã đơn hàng dạng DSH-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `DSH-${dateStr}-${randomSuffix}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail || null,
        shippingAddress: data.shippingAddress,
        province: data.province || null,
        district: data.district || null,
        ward: data.ward || null,
        note: data.note || null,
        paymentMethod: data.paymentMethod,
        paymentStatus: "pending",
        orderStatus: "pending",
        totalAmount,
        items: {
          create: data.items.map((item) => ({
            productSlug: item.slug,
            productName: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
    });
  } catch (error) {
    console.error("[Orders API Error]:", error);
    return NextResponse.json(
      { error: "Lỗi máy chủ khi tạo đơn hàng. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }
}
