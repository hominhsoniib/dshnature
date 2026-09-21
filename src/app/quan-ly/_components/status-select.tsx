"use client";

import { useTransition } from "react";

export function StatusSelect({
  id,
  currentStatus,
  options,
  action,
}: {
  id: string;
  currentStatus: string;
  options: { value: string; label: string }[];
  action: (id: string, status: string) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      value={currentStatus}
      disabled={isPending}
      onChange={(e) => {
        const next = e.target.value;
        startTransition(() => {
          action(id, next);
        });
      }}
      style={{
        padding: "6px 10px",
        borderRadius: 6,
        border: "1px solid #d1d5db",
        fontSize: 13,
        background: isPending ? "#f3f4f6" : "#fff",
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
