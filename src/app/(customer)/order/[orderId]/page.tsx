"use client";

import { useOrder } from "@/hooks/useOrder";
import { formatPrice } from "@/lib/utils/formatPrice";
import type { OrderStatus } from "@/types/order";

interface Props {
  params: {
    orderId: string;
  };
}

const STATUS_CONFIG: Record<OrderStatus, { title: string; color: string; icon: string; desc: string }> = {
  pending: {
    title: "Chờ xác nhận",
    color: "var(--amber)",
    icon: "🕒",
    desc: "Đơn hàng của bạn đang chờ nhân viên xác nhận.",
  },
  preparing: {
    title: "Đang chế biến",
    color: "#3b82f6",
    icon: "👨‍🍳",
    desc: "Quán đang chuẩn bị món cho bạn nhé.",
  },
  ready: {
    title: "Sẵn sàng",
    color: "#22c55e",
    icon: "🛎️",
    desc: "Món đã xong! Nhân viên đang mang ra cho bạn.",
  },
  completed: {
    title: "Đã hoàn thành",
    color: "#16a34a",
    icon: "✅",
    desc: "Chúc bạn ngon miệng!",
  },
  cancelled: {
    title: "Đã hủy",
    color: "#dc2626",
    icon: "❌",
    desc: "Đơn hàng đã bị hủy.",
  },
};

export default function OrderStatusPage({ params }: Props) {
  const { order, loading } = useOrder(params.orderId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="shimmer rounded-full" style={{ width: 64, height: 64 }} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-strong p-8 max-w-sm w-full text-center fade-in-up">
          <span style={{ fontSize: 40 }}>❓</span>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", marginTop: 16 }}>Không tìm thấy đơn hàng</h1>
          <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 8 }}>Vui lòng kiểm tra lại đường dẫn.</p>
        </div>
      </div>
    );
  }

  const config = STATUS_CONFIG[order.status];

  return (
    <>
      <div className="cafe-bg"><div className="cafe-bg-blob" /></div>
      <main className="relative z-10 min-h-screen p-4 md:p-6 flex flex-col items-center justify-center">
        <div className="glass-strong p-8 max-w-sm w-full text-center space-y-4 fade-in-up transition-all duration-300">
          <div
            className="mx-auto flex items-center justify-center rounded-2xl transition-all duration-500"
            style={{
              width: 64, height: 64,
              background: `linear-gradient(135deg, ${config.color}, ${config.color}dd)`,
              boxShadow: `0 8px 24px ${config.color}40`,
              fontSize: 32,
            }}
          >
            {config.icon}
          </div>
          
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: config.color }}>
              {config.title}
            </h1>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>
              {config.desc}
            </p>
          </div>
          
          <div className="glass p-4 rounded-xl text-left space-y-2 mt-4">
            <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Mã đơn: <strong style={{ color: "var(--text-primary)" }}>{order.id.slice(-6).toUpperCase()}</strong></p>
            <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Bàn: <strong style={{ color: "var(--text-primary)" }}>{order.tableNumber}</strong></p>
            <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Tổng tiền: <strong style={{ color: "var(--amber)" }}>{formatPrice(order.totalAmount)}</strong></p>
          </div>

          <div className="mt-4 pt-4 border-t border-black/5">
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", textAlign: "left", marginBottom: 8 }}>Món đã đặt:</h3>
            <div className="space-y-1 max-h-32 overflow-y-auto no-scrollbar text-left">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-700"><span className="text-amber-600 font-bold mr-1">{item.quantity}x</span> {item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
