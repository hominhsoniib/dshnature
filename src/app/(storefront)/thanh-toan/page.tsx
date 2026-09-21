"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, CreditCard, QrCode, ShieldCheck, Truck, Wallet } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { SectionTitle } from "@/components/home/SectionTitle";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bank" | "vnpay" | "momo">("cod");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "Hà Nội",
    district: "Cầu Giấy",
    note: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  const SHIPPING_FEE = totalPrice >= 500000 || totalPrice === 0 ? 0 : 30000;
  const finalTotal = totalPrice + SHIPPING_FEE;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = "Vui lòng nhập họ và tên";
    if (!formData.phone.trim()) {
      errs.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^(0[3|5|7|8|9])+([0-9]{8})$/.test(formData.phone.trim())) {
      errs.phone = "Số điện thoại không hợp lệ (10 chữ số)";
    }
    if (!formData.address.trim()) errs.address = "Vui lòng nhập địa chỉ giao hàng";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const apiPaymentMethod = paymentMethod === "bank" ? "cod" : paymentMethod;

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.fullName,
          customerPhone: formData.phone,
          customerEmail: formData.email,
          shippingAddress: formData.address,
          province: formData.city,
          district: formData.district,
          note: formData.note,
          paymentMethod: apiPaymentMethod,
          items: items.map((item) => ({
            slug: item.slug,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Không thể tạo đơn hàng. Vui lòng thử lại.");
      }

      setOrderId(data.orderNumber);
      setIsSuccess(true);
      clearCart();
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Có lỗi xảy ra khi tạo đơn hàng.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary-light text-primary">
          <CheckCircle2 className="size-10" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-foreground md:text-3xl">
          Đặt hàng thành công!
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Cảm ơn bạn đã tin tưởng DSH Nature. Chuyên viên DSH Nature sẽ liên hệ xác nhận đơn hàng với bạn trong thời gian sớm nhất.
        </p>

        <div className="mt-6 rounded-xl border border-border bg-white p-6 text-left shadow-soft space-y-2 text-xs md:text-sm">
          <p className="font-semibold text-primary">Mã đơn hàng: {orderId}</p>
          <p><span className="text-muted-foreground">Người nhận:</span> {formData.fullName}</p>
          <p><span className="text-muted-foreground">Số điện thoại:</span> {formData.phone}</p>
          <p><span className="text-muted-foreground">Địa chỉ:</span> {formData.address}, {formData.district}, {formData.city}</p>
          <p><span className="text-muted-foreground">Tổng thanh toán:</span> <strong className="text-primary">{finalTotal.toLocaleString("vi-VN")} đ</strong></p>
          <p><span className="text-muted-foreground">Hình thức thanh toán:</span> {
            paymentMethod === "cod" ? "Thanh toán khi nhận hàng (COD)" :
            paymentMethod === "bank" ? "Chuyển khoản Ngân hàng (QR Code)" :
            paymentMethod === "vnpay" ? "Cổng thanh toán VNPay" : "Ví điện tử MoMo"
          }</p>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/san-pham"
            className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary-dark"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-muted-foreground">Giỏ hàng của bạn chưa có sản phẩm nào để thanh toán.</p>
        <Link href="/san-pham" className="mt-4 inline-block text-sm font-semibold text-primary">
          &larr; Khám phá danh mục sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <SectionTitle title="Thanh toán đơn hàng" />

      <form onSubmit={handleSubmitOrder} className="grid gap-8 lg:grid-cols-3">
        {/* Form Fields */}
        <div className="space-y-6 lg:col-span-2">
          {/* Customer Info */}
          <div className="rounded-xl border border-border bg-white p-6 shadow-soft space-y-4">
            <h2 className="font-heading text-lg font-bold text-foreground">1. Thông tin người nhận</h2>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Họ và tên *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={`w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ${
                    errors.fullName ? "border-red-500" : "border-border focus:border-primary"
                  }`}
                />
                {errors.fullName && <p className="text-[11px] text-red-500 mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Số điện thoại *</label>
                <input
                  type="text"
                  placeholder="Ví dụ: 0987654321"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ${
                    errors.phone ? "border-red-500" : "border-border focus:border-primary"
                  }`}
                />
                {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Email (Nhận thông báo đơn hàng)</label>
                <input
                  type="email"
                  placeholder="nguyenvana@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Tỉnh / Thành phố *</label>
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
              <label className="block text-xs font-semibold text-foreground mb-1">Địa chỉ giao hàng chi tiết *</label>
              <input
                type="text"
                placeholder="Số nhà, đường, phường/xã..."
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className={`w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none ${
                  errors.address ? "border-red-500" : "border-border focus:border-primary"
                }`}
              />
              {errors.address && <p className="text-[11px] text-red-500 mt-1">{errors.address}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Ghi chú giao hàng (Tuỳ chọn)</label>
              <textarea
                placeholder="Giao giờ hành chính, gọi trước khi giao..."
                rows={2}
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-xl border border-border bg-white p-6 shadow-soft space-y-4">
            <h2 className="font-heading text-lg font-bold text-foreground">2. Phương thức thanh toán</h2>

            <div className="space-y-3">
              {[
                {
                  id: "cod" as const,
                  title: "Thanh toán khi nhận hàng (COD)",
                  desc: "Thanh toán tiền mặt cho nhân viên giao hàng khi nhận sản phẩm",
                  icon: Truck,
                },
                {
                  id: "bank" as const,
                  title: "Chuyển khoản Ngân hàng (QR Code / Mã đơn hàng)",
                  desc: "Quét mã QR chuyển khoản nhanh qua ứng dụng Ngân hàng",
                  icon: QrCode,
                },
                {
                  id: "vnpay" as const,
                  title: "Cổng thanh toán VNPay",
                  desc: "Thẻ ATM / Thẻ quốc tế Visa, Mastercard / VNPAY QR",
                  icon: CreditCard,
                },
                {
                  id: "momo" as const,
                  title: "Ví điện tử MoMo",
                  desc: "Thanh toán qua ứng dụng ví MoMo",
                  icon: Wallet,
                },
              ].map((method) => {
                const Icon = method.icon;
                const isSelected = paymentMethod === method.id;
                return (
                  <label
                    key={method.id}
                    className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-all ${
                      isSelected
                        ? "border-primary bg-primary-light/30 ring-1 ring-primary"
                        : "border-border hover:border-primary/50 bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={isSelected}
                      onChange={() => setPaymentMethod(method.id)}
                      className="mt-1 accent-primary"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Icon className="size-4 text-primary" />
                        <span className="font-semibold text-sm text-foreground">{method.title}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{method.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="h-fit rounded-xl border border-border bg-white p-6 shadow-soft space-y-4">
          <h2 className="font-heading text-lg font-bold text-foreground">Sản phẩm thanh toán</h2>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1 border-b border-border pb-4">
            {items.map((item) => (
              <div key={item.slug} className="flex items-center gap-3">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-md border border-border bg-cream">
                  <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{item.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {item.quantity} x {item.price.toLocaleString("vi-VN")} đ
                  </p>
                </div>
                <span className="text-xs font-bold text-primary">
                  {(item.price * item.quantity).toLocaleString("vi-VN")} đ
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs border-b border-border pb-4">
            <div className="flex justify-between text-muted-foreground">
              <span>Tạm tính:</span>
              <span className="font-medium text-foreground">{totalPrice.toLocaleString("vi-VN")} đ</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Phí vận chuyển:</span>
              <span className="font-medium text-foreground">
                {SHIPPING_FEE === 0 ? "Miễn phí" : `${SHIPPING_FEE.toLocaleString("vi-VN")} đ`}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-baseline pt-1">
            <span className="font-heading font-semibold text-foreground">Tổng tiền:</span>
            <span className="font-heading text-xl font-bold text-primary">
              {finalTotal.toLocaleString("vi-VN")} đ
            </span>
          </div>

          {submitError && (
            <p className="text-xs text-red-500 font-medium text-center">{submitError}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-primary py-3.5 text-center text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Đang xử lý..." : "Xác nhận đặt hàng"}
          </button>

          <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground pt-2">
            <ShieldCheck className="size-3.5 text-primary" />
            <span>Bảo mật thông tin thanh toán 100%</span>
          </div>
        </div>
      </form>
    </div>
  );
}
