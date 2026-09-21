const STATUS_COLORS: Record<string, string> = {
  unread: "#f59e0b",
  read: "#3b82f6",
  replied: "#10b981",
  pending: "#f59e0b",
  contacted: "#3b82f6",
  approved: "#10b981",
  rejected: "#ef4444",
  advised: "#3b82f6",
  closed: "#10b981",
  processing: "#3b82f6",
  completed: "#10b981",
  cancelled: "#ef4444",
  paid: "#10b981",
  failed: "#ef4444",
};

export function StatusBadge({ status, label }: { status: string; label: string }) {
  const color = STATUS_COLORS[status] ?? "#6b7280";
  return (
    <span
      style={{
        background: `${color}22`,
        color,
        padding: "2px 10px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}
