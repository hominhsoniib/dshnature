import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireDashboardUser } from "@/lib/require-dashboard-user";
import { StatusBadge } from "../_components/status-badge";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  pending: "Chờ xử lý",
  contacted: "Đã liên hệ",
  approved: "Đã duyệt",
  rejected: "Từ chối",
};

export default async function DealerRequestsPage() {
  await requireDashboardUser();

  const requests = await prisma.dealerRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Đăng ký đại lý</h1>
      <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>
        {requests.length} đăng ký gần nhất (form /dai-ly)
      </p>

      {requests.length === 0 ? (
        <p style={{ color: "#6b7280", fontSize: 13 }}>Chưa có đăng ký nào.</p>
      ) : (
        <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                <th style={{ padding: "10px 14px" }}>Họ tên</th>
                <th style={{ padding: "10px 14px" }}>SĐT / Email</th>
                <th style={{ padding: "10px 14px" }}>Khu vực</th>
                <th style={{ padding: "10px 14px" }}>Ngày gửi</th>
                <th style={{ padding: "10px 14px" }}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} style={{ borderTop: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "10px 14px" }}>
                    <Link href={`/quan-ly/dai-ly/${r.id}`} style={{ color: "#111827", fontWeight: 600, textDecoration: "none" }}>
                      {r.fullName}
                    </Link>
                  </td>
                  <td style={{ padding: "10px 14px", color: "#4b5563" }}>
                    {r.phone}
                    {r.email ? ` · ${r.email}` : ""}
                  </td>
                  <td style={{ padding: "10px 14px", color: "#4b5563" }}>{r.region}</td>
                  <td style={{ padding: "10px 14px", color: "#6b7280" }}>
                    {r.createdAt.toLocaleString("vi-VN")}
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <StatusBadge status={r.status} label={STATUS_LABELS[r.status] ?? r.status} />
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
