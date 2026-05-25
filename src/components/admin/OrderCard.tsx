"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import type { OrderDocument, OrderStatus } from "@/types/order";
import { formatPrice } from "@/lib/utils/formatPrice";
import toast from "react-hot-toast";

interface OrderCardProps {
  order: OrderDocument;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>;
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Chờ xác nhận",
  preparing: "Đang chế biến",
  ready: "Sẵn sàng phục vụ",
  completed: "Đã hoàn thành",
  cancelled: "Đã hủy",
};

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: "preparing",
  preparing: "ready",
  ready: "completed",
};

const NEXT_ACTION_LABELS: Partial<Record<OrderStatus, string>> = {
  pending: "Bắt đầu làm",
  preparing: "Xong, gọi khách",
  ready: "Hoàn tất đơn",
};

function OrderCard({ order, onUpdateStatus }: OrderCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const timeAgo = order.createdAt
    ? formatDistanceToNow(order.createdAt.toDate(), { addSuffix: true, locale: vi })
    : "Vừa xong";

  async function handleNextStep() {
    const nextStatus = NEXT_STATUS[order.status];
    if (!nextStatus) return;

    setIsUpdating(true);
    try {
      await onUpdateStatus(order.id, nextStatus);
      toast.success("Cập nhật trạng thái thành công");
    } catch {
      toast.error("Lỗi cập nhật trạng thái");
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleCancel() {
    if (!window.confirm("Bạn có chắc muốn hủy đơn này?")) return;
    setIsUpdating(true);
    try {
      await onUpdateStatus(order.id, "cancelled");
      toast.success("Đã hủy đơn hàng");
    } catch {
      toast.error("Lỗi hủy đơn");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="glass p-5 rounded-3xl flex flex-col fade-in-up relative group overflow-hidden border border-white/60 bg-gradient-to-br from-white/60 to-white/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      
      {/* Background Accent */}
      <div 
        className="absolute top-0 left-0 w-full h-1" 
        style={{ background: order.status === "pending" ? "var(--amber)" : order.status === "preparing" ? "#3b82f6" : "#22c55e" }} 
      />

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
              Bàn {order.tableNumber}
            </h3>
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", background: "rgba(0,0,0,0.04)", padding: "2px 8px", borderRadius: "12px" }}>
              {timeAgo}
            </span>
          </div>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2, fontFamily: "monospace" }}>
            #{order.id.slice(-6).toUpperCase()}
          </p>
        </div>
        
        <div className="flex flex-col items-end">
          <p style={{ fontSize: 16, fontWeight: 800, color: "var(--amber)" }}>
            {formatPrice(order.totalAmount)}
          </p>
          {order.status === "pending" && (
            <button
              onClick={handleCancel}
              disabled={isUpdating}
              title="Hủy đơn"
              className="text-red-400 hover:text-red-600 transition-colors mt-1 opacity-0 group-hover:opacity-100"
              style={{ fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              Hủy
            </button>
          )}
        </div>
      </div>

      {/* Customer Info */}
      {(order.customerName || order.note) && (
        <div className="mb-4 p-3 rounded-2xl bg-white/40 border border-white/50 text-[13px] backdrop-blur-md">
          {order.customerName && (
            <p className="flex items-start gap-2 mb-1">
              <span className="opacity-60 mt-[2px]">👤</span>
              <strong className="text-gray-800">{order.customerName}</strong>
            </p>
          )}
          {order.note && (
            <p className="flex items-start gap-2">
              <span className="opacity-60 mt-[2px]">📝</span>
              <span className="text-gray-700 italic leading-snug">{order.note}</span>
            </p>
          )}
        </div>
      )}

      {/* Items List */}
      <div className="overflow-y-auto mb-5 space-y-2.5 no-scrollbar pr-1" style={{ maxHeight: "160px" }}>
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between items-start text-[14px]">
            <span className="font-semibold text-gray-800 flex items-start gap-2 leading-tight">
              <span className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md min-w-[24px] text-center text-[12px]">{item.quantity}</span>
              <span className="pt-[2px]">{item.name}</span>
            </span>
          </div>
        ))}
      </div>

      {/* Primary Action Button */}
      <div className="mt-4">
        {NEXT_STATUS[order.status] ? (
          <button
            onClick={handleNextStep}
            disabled={isUpdating}
            className="w-full flex items-center justify-center gap-2 transition-all duration-300"
            style={{ 
              padding: "14px 20px", 
              borderRadius: "16px",
              fontWeight: 700,
              fontSize: "14px",
              background: order.status === "pending" ? "linear-gradient(135deg, var(--amber-dark), var(--amber-light))" : 
                          order.status === "preparing" ? "linear-gradient(135deg, #2563eb, #3b82f6)" : 
                          "linear-gradient(135deg, #16a34a, #22c55e)",
              color: "white",
              boxShadow: order.status === "pending" ? "0 8px 20px rgba(217, 119, 6, 0.25)" : 
                         order.status === "preparing" ? "0 8px 20px rgba(59, 130, 246, 0.25)" : 
                         "0 8px 20px rgba(34, 197, 94, 0.25)",
              opacity: isUpdating ? 0.7 : 1,
              transform: isUpdating ? "scale(0.98)" : "scale(1)"
            }}
          >
            {NEXT_ACTION_LABELS[order.status]}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        ) : (
          <div className="w-full text-center py-3 text-[13px] font-semibold text-green-600 bg-green-50 rounded-2xl border border-green-100">
            ✅ Đã xong
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderCard;
