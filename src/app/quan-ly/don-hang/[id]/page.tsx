import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireDashboardUser } from "@/lib/require-dashboard-user";
import { StatusSelect } from "../../_components/status-select";
import { updateOrderStatus, updatePaymentStatus } from "../actions";

export const dynamic = "force-dynamic";

const ORDER_STATUS_OPTIONS = [
  { value: "pending", label: "Chờ xử lý" },
  { value: "processing", label: "Đang xử lý" },
  { value: "completed", label: "Hoàn thành" },
  { value: "cancelled", label: "Đã hủy" },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: "pending", label: "Chưa thanh toán" },
  { value: "paid", label: "Đã thanh toán" },
  { value: "failed", label: "Thất bại" },
];

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cod: "Thanh toán khi nhận hàng (COD)",
  vnpay: "VNPay",
  momo: "MoMo",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireDashboardUser();
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) {
    notFound();
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <Link href="/quan-ly/don-hang" style={{ fontSize: 12, color: "#2563eb", textDecoration: "none" }}>
        &larr; Danh sách đơn hàng
      </Link>

      <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb", padding: 24, marginTop: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{order.orderNumber}</h1>
            <p style={{ fontSize: 12, color: "#6b7280", margin: "4px 0 0" }}>
              {order.createdAt.toLocaleString("vi-VN")}
            </p>
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            <div>
              <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 4px" }}>Thanh toán</p>
              <StatusSelect
                id={order.id}
                currentStatus={order.paymentStatus}
                options={PAYMENT_STATUS_OPTIONS}
                action={updatePaymentStatus}
              />
            </div>
            <div>
              <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 4px" }}>Đơn hàng</p>
              <StatusSelect
                id={order.id}
                currentStatus={order.orderStatus}
                options={ORDER_STATUS_OPTIONS}
                action={updateOrderStatus}
              />
            </div>
          </div>
        </div>

        <dl style={{ fontSize: 13, display: "grid", gridTemplateColumns: "160px 1fr", rowGap: 8 }}>
          <dt style={{ color: "#6b7280" }}>Khách hàng</dt>
          <dd style={{ margin: 0 }}>{order.customerName}</dd>
          <dt style={{ color: "#6b7280" }}>Số điện thoại</dt>
          <dd style={{ margin: 0 }}>{order.customerPhone}</dd>
          <dt style={{ color: "#6b7280" }}>Email</dt>
          <dd style={{ margin: 0 }}>{order.customerEmail || "—"}</dd>
          <dt style={{ color: "#6b7280" }}>Địa chỉ nhận hàng</dt>
          <dd style={{ margin: 0 }}>
            {order.shippingAddress}
            {order.ward ? `, ${order.ward}` : ""}
            {order.district ? `, ${order.district}` : ""}
            {order.province ? `, ${order.province}` : ""}
          </dd>
          <dt style={{ color: "#6b7280" }}>Phương thức thanh toán</dt>
          <dd style={{ margin: 0 }}>{PAYMENT_METHOD_LABELS[order.paymentMethod] ?? order.paymentMethod}</dd>
          {order.note && (
            <>
              <dt style={{ color: "#6b7280" }}>Ghi chú</dt>
              <dd style={{ margin: 0 }}>{order.note}</dd>
            </>
          )}
        </dl>

        <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #f0f0f0" }}>
          <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>Sản phẩm:</p>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>
                <th style={{ padding: "6px 0" }}>Sản phẩm</th>
                <th style={{ padding: "6px 0", textAlign: "right" }}>Đơn giá</th>
                <th style={{ padding: "6px 0", textAlign: "right" }}>SL</th>
                <th style={{ padding: "6px 0", textAlign: "right" }}>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "8px 0" }}>{item.productName}</td>
                  <td style={{ padding: "8px 0", textAlign: "right" }}>
                    {item.price.toLocaleString("vi-VN")} đ
                  </td>
                  <td style={{ padding: "8px 0", textAlign: "right" }}>{item.quantity}</td>
                  <td style={{ padding: "8px 0", textAlign: "right" }}>
                    {(item.price * item.quantity).toLocaleString("vi-VN")} đ
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} style={{ padding: "8px 0", textAlign: "right", fontWeight: 700 }}>
                  Tổng tiền
                </td>
                <td style={{ padding: "8px 0", textAlign: "right", fontWeight: 700 }}>
                  {order.totalAmount.toLocaleString("vi-VN")} đ
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
