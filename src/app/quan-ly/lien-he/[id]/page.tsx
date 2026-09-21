import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireDashboardUser } from "@/lib/require-dashboard-user";
import { StatusSelect } from "../../_components/status-select";
import { updateContactMessageStatus } from "../actions";

export const dynamic = "force-dynamic";

const STATUS_OPTIONS = [
  { value: "unread", label: "Chưa đọc" },
  { value: "read", label: "Đã đọc" },
  { value: "replied", label: "Đã trả lời" },
];

export default async function ContactMessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireDashboardUser();
  const { id } = await params;

  const message = await prisma.contactMessage.findUnique({ where: { id } });
  if (!message) {
    notFound();
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <Link href="/quan-ly/lien-he" style={{ fontSize: 12, color: "#2563eb", textDecoration: "none" }}>
        &larr; Danh sách tin nhắn liên hệ
      </Link>

      <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb", padding: 24, marginTop: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{message.fullName}</h1>
            <p style={{ fontSize: 12, color: "#6b7280", margin: "4px 0 0" }}>
              {message.createdAt.toLocaleString("vi-VN")}
            </p>
          </div>
          <StatusSelect
            id={message.id}
            currentStatus={message.status}
            options={STATUS_OPTIONS}
            action={updateContactMessageStatus}
          />
        </div>

        <dl style={{ fontSize: 13, display: "grid", gridTemplateColumns: "120px 1fr", rowGap: 8 }}>
          <dt style={{ color: "#6b7280" }}>Số điện thoại</dt>
          <dd style={{ margin: 0 }}>{message.phone}</dd>
          <dt style={{ color: "#6b7280" }}>Email</dt>
          <dd style={{ margin: 0 }}>{message.email || "—"}</dd>
          <dt style={{ color: "#6b7280" }}>Tiêu đề</dt>
          <dd style={{ margin: 0 }}>{message.subject || "—"}</dd>
        </dl>

        <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #f0f0f0" }}>
          <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>Nội dung:</p>
          <p style={{ fontSize: 14, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{message.message}</p>
        </div>
      </div>
    </div>
  );
}
