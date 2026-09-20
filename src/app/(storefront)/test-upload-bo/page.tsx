"use client";

import { useState } from "react";

export default function TestUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [result, setResult] = useState<{ key: string; size: number } | null>(
    null
  );

  async function handleUpload() {
    if (!file) {
      setStatus("Chưa chọn file.");
      return;
    }

    setStatus("Đang upload...");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus(`Lỗi: ${data.error || "Upload thất bại"}`);
        return;
      }

      setStatus("Upload thành công!");
      setResult({ key: data.key, size: data.size });
    } catch (err) {
      setStatus(`Lỗi: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  }

  return (
    <div style={{ maxWidth: 480, margin: "60px auto", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 20, marginBottom: 16 }}>Test Upload R2</h1>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        style={{ marginBottom: 16, display: "block" }}
      />

      <button
        onClick={handleUpload}
        style={{
          padding: "8px 16px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Upload
      </button>

      {status && <p style={{ marginTop: 16 }}>{status}</p>}

      {result && (
        <div style={{ marginTop: 8, fontSize: 14, color: "#555" }}>
          <p>Key: {result.key}</p>
          <p>Size: {result.size} bytes</p>
          <p style={{ marginTop: 8 }}>
            Kiểm tra lại trong Cloudflare R2 Dashboard → bucket dsh-nature-media
            → tab Objects để xem file vừa upload.
          </p>
        </div>
      )}
    </div>
  );
}
