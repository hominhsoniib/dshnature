"use client";

import React, { useState } from "react";
import { Award, Building2, CheckCircle2, Handshake, MapPin, Percent, Send, ShieldCheck, Users } from "lucide-react";
import { SectionTitle } from "@/components/home/SectionTitle";
import { useToast } from "@/components/ui/toast";

const MOCK_DEALERS = [
  { name: "Đại lý DSH Nature Cầu Giấy", city: "Hà Nội", address: "123 Đường Cầu Giấy, Quận Cầu Giấy, Hà Nội", phone: "0981 123 456" },
  { name: "Nhà phân phối DSH Nature Miền Nam", city: "TP. Hồ Chí Minh", address: "456 Đường Nguyễn Thị Minh Khai, Quận 3, TP.HCM", phone: "0909 888 999" },
  { name: "Đại lý DSH Nature Hải Châu", city: "Đà Nẵng", address: "78 Đường Lê Duẩn, Quận Hải Châu, Đà Nẵng", phone: "0912 345 678" },
  { name: "Đại lý DSH Nature Hồng Bàng", city: "Hải Phòng", address: "12 Đường Điện Biên Phủ, Quận Hồng Bàng, Hải Phòng", phone: "0934 567 890" },
];

export default function DealerPage() {
  const toast = useToast();
  const [selectedCity, setSelectedCity] = useState("all");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: "Hà Nội",
    experience: "",
    note: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const filteredDealers = selectedCity === "all"
    ? MOCK_DEALERS
    : MOCK_DEALERS.filter((d) => d.city === selectedCity);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      toast.add({ description: "Vui lòng điền Họ tên và Số điện thoại." });
      return;
    }
    setIsSubmitted(true);
    toast.add({ description: "Đăng ký đại lý thành công! Bộ phận phát triển đại lý sẽ liên hệ." });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12 space-y-12">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-primary-dark via-primary to-primary/90 text-primary-foreground rounded-2xl p-8 md:p-12 shadow-soft text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-2xl">
          <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
            HỢP TÁC KINH DOANH DSH NATURE
          </span>
          <h1 className="font-heading text-3xl font-bold md:text-4xl tracking-tight">
            Trở thành Đại lý & Nhà phân phối DSH Nature
          </h1>
          <p className="text-sm md:text-base text-primary-light/90 leading-relaxed">
            Đồng hành cùng phát triển thương hiệu chăm sóc sức khỏe uy tín. Chiết khấu hấp dẫn, hỗ trợ truyền thông và chính sách độc quyền khu vực.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3 rounded-xl bg-white/10 p-5 backdrop-blur border border-white/20">
          <Handshake className="size-10 text-primary-light" />
          <div className="text-left">
            <p className="text-xs text-primary-light">Phòng Phát triển Đại lý</p>
            <p className="font-heading text-lg font-bold">1900 xxxx (Phím 2)</p>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="space-y-6">
        <SectionTitle
          eyebrow="Quyền lợi hợp tác"
          title="Vì sao nên trở thành Đại lý DSH Nature?"
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Chiết khấu cao",
              icon: Percent,
              desc: "Chính sách giá đại lý và thưởng doanh số hấp dẫn bậc nhất thị trường.",
            },
            {
              title: "Hỗ trợ Marketing",
              icon: Award,
              desc: "Cung cấp catalogue, biển bảng, quà tặng khuyến mãi và truyền thông thương hiệu.",
            },
            {
              title: "Đào tạo sản phẩm",
              icon: Users,
              desc: "Được tư vấn kiến thức y dược và đào tạo kỹ năng bán hàng bài bản.",
            },
            {
              title: "Bảo hộ khu vực",
              icon: ShieldCheck,
              desc: "Chính sách bảo vệ thị trường kinh doanh riêng cho từng đại lý chính thức.",
            },
          ].map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title} className="rounded-xl border border-border p-6 bg-white shadow-soft text-center space-y-3">
                <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary-light text-primary">
                  <Icon className="size-6" />
                </div>
                <h3 className="font-heading font-semibold text-foreground">{benefit.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{benefit.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Search Dealers System */}
      <section className="rounded-2xl border border-border bg-cream p-6 md:p-8 space-y-6">
        <SectionTitle
          eyebrow="Mạng lưới phân phối"
          title="Tìm kiếm hệ thống Đại lý DSH Nature"
        />

        <div className="flex flex-wrap items-center gap-3 border-b border-border pb-4">
          <span className="text-xs font-semibold text-muted-foreground">Khu vực:</span>
          {["all", "Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Hải Phòng"].map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => setSelectedCity(city)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                selectedCity === city
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "bg-white text-foreground hover:bg-muted border border-border"
              }`}
            >
              {city === "all" ? "Tất cả tỉnh thành" : city}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {filteredDealers.map((dealer, idx) => (
            <div key={idx} className="flex items-start gap-4 rounded-xl bg-white p-5 border border-border shadow-soft">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary mt-1">
                <Building2 className="size-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-heading font-bold text-foreground">{dealer.name}</h4>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="size-3.5 text-primary shrink-0" /> {dealer.address}
                </p>
                <p className="text-xs font-semibold text-primary pt-1">SĐT: {dealer.phone}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Registration Form */}
      <section className="rounded-2xl border border-border bg-white p-6 md:p-8 shadow-soft space-y-6">
        <SectionTitle
          eyebrow="Đăng ký đại lý"
          title="Form Đăng ký Hợp tác làm Đại lý"
          description="Điền thông tin bên dưới để bộ phận phát triển thị trường DSH Nature gửi bảng giá chính sách."
        />

        {isSubmitted ? (
          <div className="rounded-xl border border-primary/20 bg-primary-light/30 p-8 text-center space-y-3">
            <CheckCircle2 className="mx-auto size-12 text-primary" />
            <h3 className="font-heading text-xl font-bold text-foreground">Đăng ký thành công!</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Chuyên viên DSH Nature sẽ liên hệ trực tiếp với <strong>{formData.fullName}</strong> qua SĐT <strong>{formData.phone}</strong> để tư vấn chính sách đại lý tại {formData.city}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl mx-auto">
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
                <label className="block text-xs font-semibold text-foreground mb-1">Tỉnh / Thành phố dự định đăng ký *</label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
                >
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Hải Phòng">Hải Phòng</option>
                  <option value="Cần Thơ">Cần Thơ</option>
                  <option value="Khác">Tỉnh thành khác</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Ghi chú / Mô tả mô hình kinh doanh hiện tại</label>
              <textarea
                rows={3}
                placeholder="Nhà thuốc, phòng khám, siêu thị mini hoặc kinh doanh cá nhân..."
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary-dark w-full"
            >
              <Send className="size-4" />
              Gửi đăng ký hợp tác đại lý
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
