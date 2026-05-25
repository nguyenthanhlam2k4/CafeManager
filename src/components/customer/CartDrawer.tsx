"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCartStore } from "@/stores/useCartStore";
import { formatPrice } from "@/lib/utils/formatPrice";
import { createOrder } from "@/lib/firebase/orderService";
import toast from "react-hot-toast";

const orderFormSchema = z.object({
  customerName: z.string().optional(),
  note: z.string().optional(),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

interface CartDrawerProps {
  tableId: string;
  tableNumber: number;
}

function CartDrawer({ tableId, tableNumber }: CartDrawerProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { items, updateQuantity, removeItem, clearCart, getTotalItems, getTotalPrice } = useCartStore();
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
  });

  async function onSubmit(values: OrderFormValues) {
    if (items.length === 0) return;
    setSubmitError(null);
    try {
      const orderId = await createOrder({
        tableId,
        tableNumber,
        customerName: values.customerName || "",
        note: values.note || "",
        items: items.map(cartItem => ({
          itemId: cartItem.menuItem.id,
          name: cartItem.menuItem.name,
          price: cartItem.menuItem.price,
          quantity: cartItem.quantity,
        })),
        totalAmount: totalPrice,
        status: "pending",
      });
      clearCart();
      setIsOpen(false);
      toast.success("Đặt món thành công!");
      router.push(`/order/${orderId}`);
    } catch {
      setSubmitError("Lỗi khi đặt món. Vui lòng thử lại.");
      toast.error("Lỗi khi đặt món.");
    }
  }

  if (totalItems === 0) return null;

  return (
    <>
      {/* Floating Cart Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center gap-2 rounded-full fade-in-up"
          style={{
            background: "linear-gradient(135deg, var(--amber-dark), var(--amber-light))",
            color: "white",
            padding: "12px 24px",
            boxShadow: "0 8px 32px rgba(180, 83, 9, 0.35)",
            fontWeight: 700,
            fontSize: 15,
          }}
        >
          <span style={{ fontSize: 18 }}>🛒</span>
          {totalItems} món • {formatPrice(totalPrice)}
        </button>
      )}

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-sm transition-all duration-300">
          <div className="flex-1" onClick={() => setIsOpen(false)} />
          
          <div className="bg-[var(--bg-primary)] w-full rounded-t-3xl shadow-2xl p-5 md:p-6" style={{ maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)" }}>Giỏ hàng của bạn</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="btn-ghost rounded-full"
                style={{ width: 32, height: 32, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto mb-4 space-y-3 no-scrollbar">
              {items.map((cartItem) => (
                <div key={cartItem.menuItem.id} className="flex justify-between items-center glass p-3">
                  <div className="flex-1 min-w-0 pr-3">
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }} className="truncate">
                      {cartItem.menuItem.name}
                    </h4>
                    <p style={{ fontSize: 13, color: "var(--amber)", fontWeight: 700 }}>
                      {formatPrice(cartItem.menuItem.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(cartItem.menuItem.id, cartItem.quantity - 1)}
                      className="btn-ghost rounded-full"
                      style={{ width: 28, height: 28, padding: 0 }}
                    >
                      -
                    </button>
                    <span style={{ fontSize: 14, fontWeight: 600, width: "20px", textAlign: "center" }}>
                      {cartItem.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(cartItem.menuItem.id, cartItem.quantity + 1)}
                      className="btn-amber rounded-full"
                      style={{ width: 28, height: 28, padding: 0 }}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 border-t pt-4" style={{ borderColor: "rgba(0,0,0,0.05)" }}>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="glass-label">Tên của bạn (tuỳ chọn)</label>
                  <input type="text" placeholder="VD: Anh Huy" className="glass-input" {...register("customerName")} />
                </div>
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                  <label className="glass-label">Ghi chú (tuỳ chọn)</label>
                  <input type="text" placeholder="Ít đá, nhiều đường..." className="glass-input" {...register("note")} />
                </div>
              </div>

              {submitError && (
                <p style={{ fontSize: 13, color: "#dc2626", background: "rgba(239,68,68,0.08)", padding: "8px 12px", borderRadius: 8 }}>
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-amber w-full flex items-center justify-between"
                style={{ padding: "14px 20px", fontSize: 16 }}
              >
                <span>{isSubmitting ? "Đang đặt món..." : "Xác nhận đặt món"}</span>
                <span style={{ fontWeight: 800 }}>{formatPrice(totalPrice)}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default CartDrawer;
