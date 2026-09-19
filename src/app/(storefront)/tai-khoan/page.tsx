"use client";

import React, { useState } from "react";
import { MapPin, Package, User } from "lucide-react";
import { SectionTitle } from "@/components/home/SectionTitle";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "addresses">("orders");

  const MOCK_CUSTOMER = {
    name: "Nguyễn Văn A",
    phone: "0987 654 321",
    email: "nguyenvana@gmail.com",
    address: "123 Đường Cầu Giấy, Phường Dịch Vọng, Quận Cầu Giấy, Hà Nội",
  };

  const MOCK_ORDERS = [
    {
      id: "#DSH-849201",
      date: "18/09/2026",
      total: 360000,
      status: "Đang giao hàng",
      items: ["Euginca An Phế DSH (x2)"],
    },
    {
      id: "#DSH-720194",
      date: "02/09/2026",
      total: 250000,
      status: "Đã hoàn thành",
      items: ["Viên khớp DSH (x1)"],
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12 space-y-8">
      <SectionTitle title="Tài khoản cá nhân" />

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Sidebar Nav */}
        <div className="rounded-xl border border-border bg-white p-4 shadow-soft h-fit space-y-1">
          <div className="p-3 border-b border-border mb-2 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary-light text-primary font-bold">
              A
            </div>
            <div className="min-w-0">
              <p className="font-heading font-bold text-sm text-foreground truncate">{MOCK_CUSTOMER.name}</p>
              <p className="text-xs text-muted-foreground truncate">{MOCK_CUSTOMER.phone}</p>
            </div>
          </div>

          {[
            { id: "orders" as const, label: "Đơn hàng của tôi", icon: Package },
            { id: "profile" as const, label: "Thông tin cá nhân", icon: User },
            { id: "addresses" as const, label: "Sổ địa chỉ nhận hàng", icon: MapPin },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="size-4" />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 rounded-xl border border-border bg-white p-6 shadow-soft space-y-6">
          {activeTab === "orders" && (
            <div className="space-y-4">
              <h2 className="font-heading text-lg font-bold text-foreground border-b border-border pb-3">
                Lịch sử đơn hàng đã đặt
              </h2>
              {MOCK_ORDERS.map((order) => (
                <div key={order.id} className="rounded-xl border border-border p-4 space-y-2 bg-cream/40">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2">
                    <span className="font-heading font-bold text-sm text-primary">{order.id}</span>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{order.date}</span>
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-foreground font-medium">{order.items.join(", ")}</p>
                  <div className="flex justify-between items-baseline pt-1">
                    <span className="text-xs text-muted-foreground">Tổng thanh toán:</span>
                    <span className="font-heading font-bold text-primary text-sm">
                      {order.total.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-4">
              <h2 className="font-heading text-lg font-bold text-foreground border-b border-border pb-3">
                Thông tin tài khoản
              </h2>
              <div className="space-y-3 text-sm text-muted-foreground max-w-md">
                <div>
                  <label className="block text-xs font-semibold text-foreground">Họ và tên:</label>
                  <p className="text-foreground font-medium mt-0.5">{MOCK_CUSTOMER.name}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground">Số điện thoại:</label>
                  <p className="text-foreground font-medium mt-0.5">{MOCK_CUSTOMER.phone}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground">Email:</label>
                  <p className="text-foreground font-medium mt-0.5">{MOCK_CUSTOMER.email}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "addresses" && (
            <div className="space-y-4">
              <h2 className="font-heading text-lg font-bold text-foreground border-b border-border pb-3">
                Sổ địa chỉ nhận hàng
              </h2>
              <div className="rounded-xl border border-border p-4 bg-cream/40 space-y-1 text-xs md:text-sm">
                <span className="inline-block rounded bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  Mặc định
                </span>
                <p className="font-bold text-foreground">{MOCK_CUSTOMER.name} - {MOCK_CUSTOMER.phone}</p>
                <p className="text-muted-foreground">{MOCK_CUSTOMER.address}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
