import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireDashboardUser } from "@/lib/require-dashboard-user";
import { StatusBadge } from "../_components/status-badge";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  unread: "Chưa đọc",
  read: "Đã đọc",
  replied: "Đã trả lời",
};

export default async function ContactMessagesPage() {
  await requireDashboardUser();

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Tin nhắn liên hệ</h1>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>
        {messages.length} tin nhắn gần nhất (form /lien-he)
      </p>

      {messages.length === 0 ? (
        <p style={{ color: "#6b7280", fontSize: 13 }}>Chưa có tin nhắn nào.</p>
      ) : (
        <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                <th style={{ padding: "10px 14px" }}>Họ tên</th>
                <th style={{ padding: "10px 14px" }}>SĐT / Email</th>
                <th style={{ padding: "10px 14px" }}>Tiêu đề</th>
                <th style={{ padding: "10px 14px" }}>Ngày gửi</th>
                <th style={{ padding: "10px 14px" }}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <tr key={m.id} style={{ borderTop: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "10px 14px" }}>
                    <Link href={`/quan-ly/lien-he/${m.id}`} style={{ color: "#111827", fontWeight: 600, textDecoration: "none" }}>
                      {m.fullName}
                    </Link>
                  </td>
                  <td style={{ padding: "10px 14px", color: "#4b5563" }}>
                    {m.phone}
                    {m.email ? ` · ${m.email}` : ""}
                  </td>
                  <td style={{ padding: "10px 14px", color: "#4b5563" }}>{m.subject || "—"}</td>
                  <td style={{ padding: "10px 14px", color: "#6b7280" }}>
                    {m.createdAt.toLocaleString("vi-VN")}
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <StatusBadge status={m.status} label={STATUS_LABELS[m.status] ?? m.status} />
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
