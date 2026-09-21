import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireDashboardUser } from "@/lib/require-dashboard-user";
import { StatusSelect } from "../../_components/status-select";
import { updateDealerRequestStatus } from "../actions";

export const dynamic = "force-dynamic";

const STATUS_OPTIONS = [
  { value: "pending", label: "Chờ xử lý" },
  { value: "contacted", label: "Đã liên hệ" },
  { value: "approved", label: "Đã duyệt" },
  { value: "rejected", label: "Từ chối" },
];

export default async function DealerRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireDashboardUser();
  const { id } = await params;

  const request = await prisma.dealerRequest.findUnique({ where: { id } });
  if (!request) {
    notFound();
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <Link href="/quan-ly/dai-ly" style={{ fontSize: 12, color: "#2563eb", textDecoration: "none" }}>
        &larr; Danh sách đăng ký đại lý
      </Link>

      <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb", padding: 24, marginTop: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{request.fullName}</h1>
            <p style={{ fontSize: 12, color: "#6b7280", margin: "4px 0 0" }}>
              {request.createdAt.toLocaleString("vi-VN")}
            </p>
          </div>
          <StatusSelect
            id={request.id}
            currentStatus={request.status}
            options={STATUS_OPTIONS}
            action={updateDealerRequestStatus}
          />
        </div>

        <dl style={{ fontSize: 13, display: "grid", gridTemplateColumns: "140px 1fr", rowGap: 8 }}>
          <dt style={{ color: "#6b7280" }}>Số điện thoại</dt>
          <dd style={{ margin: 0 }}>{request.phone}</dd>
          <dt style={{ color: "#6b7280" }}>Email</dt>
          <dd style={{ margin: 0 }}>{request.email || "—"}</dd>
          <dt style={{ color: "#6b7280" }}>Khu vực kinh doanh</dt>
          <dd style={{ margin: 0 }}>{request.region}</dd>
          <dt style={{ color: "#6b7280" }}>Kinh nghiệm</dt>
          <dd style={{ margin: 0 }}>{request.experience || "—"}</dd>
        </dl>

        {request.message && (
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #f0f0f0" }}>
            <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>Ghi chú:</p>
            <p style={{ fontSize: 14, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{request.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
