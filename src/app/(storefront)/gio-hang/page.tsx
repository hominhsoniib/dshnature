"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { SectionTitle } from "@/components/home/SectionTitle";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();

  const SHIPPING_THRESHOLD = 500000;
  const SHIPPING_FEE = totalPrice >= SHIPPING_THRESHOLD || totalPrice === 0 ? 0 : 30000;
  const finalTotal = totalPrice + SHIPPING_FEE;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center md:px-6">
        <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-cream text-primary">
          <ShoppingBag className="size-10" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Giỏ hàng của bạn đang trống</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Hãy chọn các sản phẩm chăm sóc sức khỏe chất lượng cho gia đình bạn.
        </p>
        <Link
          href="/san-pham"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary-dark"
        >
          <ArrowLeft className="size-4" />
          Khám phá sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <SectionTitle title={`Giỏ hàng của bạn (${totalItems} sản phẩm)`} />

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items List */}
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div
              key={item.slug}
              className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-border bg-white p-4 shadow-soft"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-cream border border-border">
                  <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                </div>
                <div>
                  <Link href={`/san-pham/${item.slug}`} className="font-heading font-semibold text-foreground hover:text-primary transition-colors">
                    {item.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">{item.categoryName}</p>
                  <p className="mt-1 font-heading font-bold text-primary sm:hidden">
                    {item.price.toLocaleString("vi-VN")} đ
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                {/* Quantity buttons */}
                <div className="flex items-center rounded-lg border border-border bg-white">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                    className="p-1.5 text-muted-foreground hover:text-foreground"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-semibold">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                    className="p-1.5 text-muted-foreground hover:text-foreground"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>

                <p className="hidden sm:block font-heading font-bold text-primary min-w-[100px] text-right">
                  {(item.price * item.quantity).toLocaleString("vi-VN")} đ
                </p>

                <button
                  type="button"
                  onClick={() => removeFromCart(item.slug)}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
                  aria-label="Xóa sản phẩm"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Block */}
        <div className="h-fit rounded-xl border border-border bg-white p-6 shadow-soft space-y-4">
          <h2 className="font-heading text-lg font-bold text-foreground">Tóm tắt đơn hàng</h2>

          <div className="space-y-2 text-sm border-b border-border pb-4">
            <div className="flex justify-between text-muted-foreground">
              <span>Tạm tính ({totalItems} sản phẩm):</span>
              <span className="font-medium text-foreground">{totalPrice.toLocaleString("vi-VN")} đ</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Phí vận chuyển:</span>
              <span className="font-medium text-foreground">
                {SHIPPING_FEE === 0 ? (
                  <span className="text-primary font-semibold">Miễn phí</span>
                ) : (
                  `${SHIPPING_FEE.toLocaleString("vi-VN")} đ`
                )}
              </span>
            </div>
            {totalPrice < SHIPPING_THRESHOLD && (
              <p className="text-[11px] text-primary italic pt-1">
                Mua thêm {(SHIPPING_THRESHOLD - totalPrice).toLocaleString("vi-VN")} đ để được MIỄN PHÍ VẬN CHUYỂN!
              </p>
            )}
          </div>

          <div className="flex justify-between items-baseline pt-1">
            <span className="font-heading font-semibold text-foreground">Tổng thanh toán:</span>
            <span className="font-heading text-2xl font-bold text-primary">
              {finalTotal.toLocaleString("vi-VN")} đ
            </span>
          </div>

          <Link
            href="/thanh-toan"
            className="block w-full rounded-xl bg-primary py-3.5 text-center text-sm font-semibold text-primary-foreground shadow-soft transition-colors hover:bg-primary-dark"
          >
            Tiến hành thanh toán
          </Link>

          <Link href="/san-pham" className="block text-center text-xs text-muted-foreground hover:text-primary pt-2">
            &larr; Tiếp tục chọn sản phẩm khác
          </Link>
        </div>
      </div>
    </div>
  );
}
