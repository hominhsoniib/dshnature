"use client";

import React, { useState } from "react";
import { CheckCircle2, HelpCircle, MessageSquareCheck, PhoneCall, Send, ShieldCheck, UserCheck } from "lucide-react";
import { SectionTitle } from "@/components/home/SectionTitle";
import { useToast } from "@/components/ui/toast";

const FAQS = [
  {
    q: "Làm sao để nhận tư vấn trực tiếp từ chuyên gia DSH Nature?",
    a: "Bạn có thể điền thông tin vào form tư vấn bên dưới hoặc gọi hotline trực tiếp. Dược sĩ DSH Nature sẽ liên hệ hỗ trợ bạn trong vòng 1-2 giờ làm việc.",
  },
  {
    q: "Sản phẩm DSH Nature có dùng được cho người cao tuổi không?",
    a: "Tất cả các dòng sản phẩm của DSH Nature đều được nghiên cứu với công thức chiết xuất thiên nhiên an toàn, rất phù hợp và lành tính cho người lớn tuổi.",
  },
  {
    q: "Thời gian giao hàng tư vấn sau khi đặt mua là bao lâu?",
    a: "DSH Nature hỗ trợ giao hàng toàn quốc từ 1-3 ngày làm việc. Khách hàng được kiểm tra hàng trước khi thanh toán.",
  },
];

export default function ConsultationPage() {
  const toast = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    topic: "ho-hap",
    question: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.question) {
      toast.add({ description: "Vui lòng điền đầy đủ Họ tên, Số điện thoại và Câu hỏi." });
      return;
    }
    setIsSubmitted(true);
    toast.add({ description: "Gửi câu hỏi tư vấn thành công!" });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12 space-y-12">
      {/* Banner Intro */}
      <section className="rounded-2xl bg-gradient-to-r from-primary to-primary-dark p-8 md:p-12 text-primary-foreground shadow-soft flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-2xl">
          <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
            ĐỘI NGŨ CHUYÊN MÔN DSH NATURE
          </span>
          <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            Tư vấn sức khỏe cùng Chuyên gia
          </h1>
          <p className="text-sm md:text-base text-primary-light/90 leading-relaxed">
            Đặt câu hỏi hoặc để lại thông tin để nhận tư vấn hoàn toàn miễn phí từ đội ngũ Dược sĩ và Cố vấn y khoa tận tâm của DSH Nature.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3 rounded-xl bg-white/10 p-4 backdrop-blur border border-white/20">
          <PhoneCall className="size-8 text-primary-light" />
          <div>
            <p className="text-xs text-primary-light">Hotline hỗ trợ nhanh</p>
            <p className="font-heading text-xl font-bold">1900 xxxx</p>
          </div>
        </div>
      </section>

      {/* Main Content: Form + Expert Info */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Consultation Form */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-white p-6 md:p-8 shadow-soft space-y-6">
          <div className="border-b border-border pb-4">
            <h2 className="font-heading text-xl font-bold text-foreground">
              Gửi câu hỏi tư vấn sức khỏe
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Thông tin của bạn được bảo mật tuyệt đối và chỉ sử dụng cho mục đích tư vấn sức khỏe.
            </p>
          </div>

          {isSubmitted ? (
            <div className="rounded-xl border border-primary/20 bg-primary-light/30 p-8 text-center space-y-3">
              <MessageSquareCheck className="mx-auto size-12 text-primary" />
              <h3 className="font-heading text-xl font-bold text-foreground">Đã gửi yêu cầu tư vấn thành công!</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Cảm ơn <strong>{formData.fullName}</strong>. Dược sĩ DSH Nature sẽ nghiên cứu câu hỏi và liên hệ lại với bạn qua SĐT <strong>{formData.phone}</strong> sớm nhất.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({ fullName: "", phone: "", email: "", topic: "ho-hap", question: "" });
                }}
                className="mt-4 rounded-xl bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground shadow-soft"
              >
                Gửi câu hỏi khác
              </button>
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
                  <label className="block text-xs font-semibold text-foreground mb-1">Số điện thoại liên hệ *</label>
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
                  <label className="block text-xs font-semibold text-foreground mb-1">Email (Tuỳ chọn)</label>
                  <input
                    type="email"
                    placeholder="nguyenvana@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Chủ đề cần tư vấn</label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
                  >
                    <option value="ho-hap">Sức khỏe hô hấp & Phế quản</option>
                    <option value="xuong-khop">Sức khỏe xương khớp</option>
                    <option value="tuan-hoan">Tuần hoàn máu & Não bộ</option>
                    <option value="giac-ngu">Cải thiện giấc ngủ</option>
                    <option value="khac">Chủ đề sức khỏe khác</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Câu hỏi hoặc vấn đề sức khỏe thắc mắc *</label>
                <textarea
                  rows={4}
                  placeholder="Mô tả chi tiết biểu hiện hoặc thắc mắc của bạn..."
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
                  required
                />
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary-dark w-full sm:w-auto"
              >
                <Send className="size-4" />
                Gửi yêu cầu tư vấn
              </button>
            </form>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-soft space-y-4">
            <h3 className="font-heading font-bold text-foreground">Cam kết tư vấn</h3>
            <div className="space-y-3 text-xs text-muted-foreground">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                <span>100% Tư vấn bởi Dược sĩ chuyên môn am hiểu sản phẩm.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="size-4 text-primary shrink-0 mt-0.5" />
                <span>Miễn phí hoàn toàn dịch vụ hỏi đáp tư vấn.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <UserCheck className="size-4 text-primary shrink-0 mt-0.5" />
                <span>Theo sát hỗ trợ hướng dẫn sử dụng đúng cách.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="rounded-2xl border border-border bg-cream p-6 md:p-8 space-y-6">
        <SectionTitle title="Câu hỏi thường gặp (FAQ)" />
        <div className="grid gap-4 md:grid-cols-3">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="rounded-xl bg-white p-5 border border-border shadow-soft space-y-2">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <HelpCircle className="size-4" />
                <span>{faq.q}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
