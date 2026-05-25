"use client";

import AdminNav from "@/components/admin/AdminNav";
import { useOrders } from "@/hooks/useOrders";
import { updateOrderStatus } from "@/lib/firebase/orderService";
import OrderCard from "@/components/admin/OrderCard";
import type { OrderStatus } from "@/types/order";

const COLUMNS: { id: OrderStatus; title: string; icon: string; color: string }[] = [
  { id: "pending", title: "Chờ xác nhận", icon: "📥", color: "var(--amber)" },
  { id: "preparing", title: "Đang chế biến", icon: "👨‍🍳", color: "#3b82f6" },
  { id: "ready", title: "Sẵn sàng", icon: "🛎️", color: "#22c55e" },
];

function AdminDashboardPage() {
  const { orders, loading } = useOrders();

  async function handleUpdateStatus(orderId: string, newStatus: OrderStatus) {
    await updateOrderStatus(orderId, newStatus);
  }

  if (loading) {
    return (
      <>
        <div className="cafe-bg"><div className="cafe-bg-blob" /></div>
        <main className="relative z-10 min-h-screen p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            <div className="glass p-4 mb-6 flex items-center gap-3">
              <div className="shimmer rounded-xl" style={{ width: 36, height: 36 }} />
              <div className="shimmer rounded-lg" style={{ width: 120, height: 20 }} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((col) => (
                <div key={col} className="glass p-4 rounded-2xl min-h-[500px]">
                  <div className="shimmer h-6 w-1/2 rounded mb-4" />
                  <div className="shimmer h-32 rounded-xl mb-3" />
                  <div className="shimmer h-32 rounded-xl mb-3" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <div className="cafe-bg"><div className="cafe-bg-blob" /></div>
      <main className="relative z-10 min-h-screen p-4 md:p-6">
        <div className="mx-auto max-w-7xl">
          <AdminNav />

          <div className="glass fade-in-up mb-6 flex items-center justify-between px-5 py-4" style={{ animationDelay: "0.05s" }}>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>
                Order Realtime
              </h1>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
                Tổng {orders.length} order đang xử lý
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {COLUMNS.map((col, index) => {
              const colOrders = orders.filter((o) => o.status === col.id);
              
              return (
                <div key={col.id} className="glass flex flex-col p-4 rounded-3xl min-h-[300px] lg:min-h-[500px] fade-in-up" style={{ animationDelay: `${0.1 + index * 0.05}s`, background: "rgba(255,255,255,0.4)" }}>
                  <div className="flex items-center justify-between mb-4 px-2">
                    <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 8 }}>
                      <span>{col.icon}</span>
                      {col.title}
                    </h2>
                    <span style={{ background: "rgba(0,0,0,0.05)", padding: "2px 10px", borderRadius: 12, fontSize: 12, fontWeight: 700 }}>
                      {colOrders.length}
                    </span>
                  </div>

                  <div className="flex-1 space-y-4">
                    {colOrders.length === 0 ? (
                      <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-black/5 rounded-2xl text-gray-400">
                        <span className="text-2xl mb-1 opacity-50">🍃</span>
                        <span className="text-xs font-medium">Trống</span>
                      </div>
                    ) : (
                      colOrders.map((order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          onUpdateStatus={handleUpdateStatus}
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </main>
    </>
  );
}

export default AdminDashboardPage;
