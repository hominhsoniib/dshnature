import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireDashboardUser } from "@/lib/require-dashboard-user";
import { StatusBadge } from "../_components/status-badge";

export const dynamic = "force-dynamic";

const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Chờ xử lý",
  processing: "Đang xử lý",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: "Chưa thanh toán",
  paid: "Đã thanh toán",
  failed: "Thất bại",
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cod: "COD",
  vnpay: "VNPay",
  momo: "MoMo",
};

export default async function OrdersPage() {
  await requireDashboardUser();

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { items: true },
  });

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Đơn hàng</h1>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>
        {orders.length} đơn hàng gần nhất
      </p>

      {orders.length === 0 ? (
        <p style={{ color: "#6b7280", fontSize: 13 }}>Chưa có đơn hàng nào.</p>
      ) : (
        <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                <th style={{ padding: "10px 14px" }}>Mã đơn</th>
                <th style={{ padding: "10px 14px" }}>Khách hàng</th>
                <th style={{ padding: "10px 14px" }}>Tổng tiền</th>
                <th style={{ padding: "10px 14px" }}>Thanh toán</th>
                <th style={{ padding: "10px 14px" }}>Trạng thái</th>
                <th style={{ padding: "10px 14px" }}>Ngày đặt</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} style={{ borderTop: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "10px 14px" }}>
                    <Link href={`/quan-ly/don-hang/${o.id}`} style={{ color: "#111827", fontWeight: 600, textDecoration: "none" }}>
                      {o.orderNumber}
                    </Link>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>{o.items.length} sản phẩm</div>
                  </td>
                  <td style={{ padding: "10px 14px", color: "#4b5563" }}>
                    {o.customerName}
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>{o.customerPhone}</div>
                  </td>
                  <td style={{ padding: "10px 14px", fontWeight: 600 }}>
                    {o.totalAmount.toLocaleString("vi-VN")} đ
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>
                      {PAYMENT_METHOD_LABELS[o.paymentMethod] ?? o.paymentMethod}
                    </div>
                    <StatusBadge
                      status={o.paymentStatus}
                      label={PAYMENT_STATUS_LABELS[o.paymentStatus] ?? o.paymentStatus}
                    />
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <StatusBadge
                      status={o.orderStatus}
                      label={ORDER_STATUS_LABELS[o.orderStatus] ?? o.orderStatus}
                    />
                  </td>
                  <td style={{ padding: "10px 14px", color: "#6b7280" }}>
                    {o.createdAt.toLocaleString("vi-VN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
