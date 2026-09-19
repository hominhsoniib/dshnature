"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@/components/ui/toast";

export interface CartItem {
  slug: string;
  name: string;
  price: number;
  image: string;
  categoryName: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "dsh_nature_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toast = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage errors
    }
  }, [items]);

  const addToCart = (product: Omit<CartItem, "quantity">, quantityToAdd = 1) => {
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.slug === product.slug);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantityToAdd,
        };
        return updated;
      }
      return [...prevItems, { ...product, quantity: quantityToAdd }];
    });

    toast.add({ description: `Đã thêm ${product.name} vào giỏ hàng.` });
  };

  const removeFromCart = (slug: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.slug !== slug));
    toast.add({ description: "Đã xóa sản phẩm khỏi giỏ hàng." });
  };

  const updateQuantity = (slug: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(slug);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) => (item.slug === slug ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
