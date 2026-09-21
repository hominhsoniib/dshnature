"use client";

import React, { useState } from "react";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { SectionTitle } from "@/components/home/SectionTitle";
import { useToast } from "@/components/ui/toast";
import type { SiteSettings } from "@/types/payload-content";

export function ContactPageView({ siteSettings }: { siteSettings: SiteSettings | null }) {
  const toast = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSent, setIsSent] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.message) {
      toast.add({ description: "Vui lòng điền Họ tên, Số điện thoại và Nội dung tin nhắn." });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gửi tin nhắn thất bại.");
      }

      setIsSent(true);
      toast.add({ description: "Cảm ơn bạn! Thông điệp liên hệ đã được gửi thành công." });
    } catch (err: unknown) {
      toast.add({ description: err instanceof Error ? err.message : "Đã có lỗi xảy ra." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12 space-y-12">
      <SectionTitle
        eyebrow="Kết nối với DSH Nature"
        title="Thông tin liên hệ"
        description="Đội ngũ hỗ trợ DSH Nature luôn sẵn sàng lắng nghe và giải đáp mọi ý kiến của khách hàng."
      />

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Company Info Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-soft space-y-6">
            <h3 className="font-heading font-bold text-foreground text-lg border-b border-border pb-3">
              CÔNG TY CỔ PHẦN DSH NATURE
            </h3>

            <div className="space-y-4 text-xs md:text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <MapPin className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground block">Địa chỉ trụ sở:</strong>
                  <span>Tầng 5, Tòa nhà DSH Nature, Hà Nội, Việt Nam</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground block">Hotline tư vấn:</strong>
                  <span className="text-primary font-semibold">
                    {siteSettings?.hotline || "1900 xxxx / 0987 654 321"}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground block">Email tiếp nhận:</strong>
                  <span>cskh@dshnature.vn</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="size-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="text-foreground block">Thời gian làm việc:</strong>
                  <span>Thứ 2 - Thứ 7: 08:00 - 17:30</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-white p-6 md:p-8 shadow-soft space-y-6">
          <div className="border-b border-border pb-4">
            <h3 className="font-heading font-bold text-foreground text-xl">
              Gửi thông điệp trực tiếp
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Điền thông tin và ý kiến của bạn, chúng tôi sẽ phản hồi trong vòng 24h.
            </p>
          </div>

          {isSent ? (
            <div className="rounded-xl border border-primary/20 bg-primary-light/30 p-8 text-center space-y-3">
              <Send className="mx-auto size-10 text-primary" />
              <h4 className="font-heading text-lg font-bold text-foreground">Gửi liên hệ thành công!</h4>
              <p className="text-xs text-muted-foreground">
                Bộ phận CSKH DSH Nature đã nhận được thông điệp của <strong>{formData.fullName}</strong> và sẽ liên hệ lại qua SĐT {formData.phone}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Họ và tên *</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Nguyễn Văn A"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Số điện thoại *</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 0987654321"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="nguyenvana@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Tiêu đề liên hệ</label>
                  <input
                    type="text"
                    placeholder="Tư vấn sản phẩm / Phản hồi dịch vụ..."
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Nội dung tin nhắn *</label>
                <textarea
                  rows={4}
                  placeholder="Nhập chi tiết thông điệp của bạn..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary-dark w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="size-4" />
                {isSubmitting ? "Đang gửi..." : "Gửi liên hệ"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Embedded Map Section */}
      <section className="rounded-2xl border border-border overflow-hidden bg-cream p-4 shadow-soft">
        <p className="text-xs font-semibold text-foreground mb-3 px-2">Vị trí CÔNG TY CỔ PHẦN DSH NATURE trên bản đồ</p>
        <div className="aspect-[21/9] w-full rounded-xl overflow-hidden bg-muted flex items-center justify-center border border-border">
          <iframe
            title="DSH Nature Map Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.863981044336!2d105.7801!3d21.0368!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab325697669d%3A0x401828f72c478a0!2zQ8OidSBHaeG6pXksIEjDoCBO4buZaSwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
}
