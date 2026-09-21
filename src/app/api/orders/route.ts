import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendAdminNotification } from "@/lib/email";

export const dynamic = "force-dynamic";

const orderItemSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
});

// TODO: re-enable "vnpay", "momo" once C4 (real gateway integration —
// signature verify + webhook) ships. Until then, reject them here too so a
// direct API call bypassing the checkout UI can't create a "paid"-looking
// order without a real payment. See audit report, item C4.
const ENABLED_PAYMENT_METHODS = ["cod"] as const;

const orderSchema = z.object({
  customerName: z.string().trim().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  customerPhone: z.string().trim().min(9, "Số điện thoại không hợp lệ"),
  customerEmail: z.string().trim().email("Email không hợp lệ").optional().or(z.literal("")),
  shippingAddress: z.string().trim().min(5, "Địa chỉ nhận hàng quá ngắn"),
  province: z.string().optional(),
  district: z.string().optional(),
  ward: z.string().optional(),
  note: z.string().optional(),
  paymentMethod: z.enum(ENABLED_PAYMENT_METHODS, {
    message: "Phương thức thanh toán này hiện chưa được hỗ trợ. Vui lòng chọn Thanh toán khi nhận hàng (COD).",
  }),
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

    await sendAdminNotification({
      subject: `[DSH Nature] Đơn hàng mới #${order.orderNumber}`,
      text: [
        `Khách hàng: ${data.customerName}`,
        `SĐT: ${data.customerPhone}`,
        `Email: ${data.customerEmail || "(không có)"}`,
        `Địa chỉ nhận hàng: ${data.shippingAddress}`,
        `Phương thức thanh toán: ${data.paymentMethod.toUpperCase()}`,
        `Ghi chú: ${data.note || "(không có)"}`,
        "",
        "Sản phẩm:",
        ...data.items.map(
          (item) => `- ${item.name} x${item.quantity} — ${item.price.toLocaleString("vi-VN")}đ`
        ),
        "",
        `Tổng tiền: ${totalAmount.toLocaleString("vi-VN")}đ`,
        `Mã đơn hàng: ${order.orderNumber}`,
      ].join("\n"),
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
