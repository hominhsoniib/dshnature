import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireDashboardUser } from "@/lib/require-dashboard-user";

export const dynamic = "force-dynamic";

export default async function DashboardHomePage() {
  await requireDashboardUser();

  const [unreadMessages, pendingDealers, pendingConsultations, pendingOrders] = await Promise.all([
    prisma.contactMessage.count({ where: { status: "unread" } }),
    prisma.dealerRequest.count({ where: { status: "pending" } }),
    prisma.consultationRequest.count({ where: { status: "pending" } }),
    prisma.order.count({ where: { orderStatus: "pending" } }),
  ]);

  const cards = [
    { href: "/quan-ly/lien-he", label: "Tin nhắn chưa đọc", value: unreadMessages },
    { href: "/quan-ly/dai-ly", label: "Đăng ký đại lý chờ xử lý", value: pendingDealers },
    { href: "/quan-ly/tu-van", label: "Yêu cầu tư vấn chờ xử lý", value: pendingConsultations },
    { href: "/quan-ly/don-hang", label: "Đơn hàng chờ xử lý", value: pendingOrders },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Tổng quan</h1>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>
        Số liệu chưa xử lý từ các form trên website.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            style={{
              display: "block",
              background: "#fff",
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              padding: 20,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 700, color: card.value > 0 ? "#dc2626" : "#111827" }}>
              {card.value}
            </div>
            <div style={{ fontSize: 13, color: "#4b5563", marginTop: 4 }}>{card.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
