"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";
import { getCompletedOrders } from "@/lib/firebase/revenueService";
import type { OrderDocument } from "@/types/order";
import { formatPrice } from "@/lib/utils/formatPrice";
import { format, subDays, startOfDay, isAfter } from "date-fns";
import { vi } from "date-fns/locale";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

function RevenuePage() {
  const [orders, setOrders] = useState<OrderDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      // Fetch orders from the last 30 days
      const thirtyDaysAgo = subDays(startOfDay(new Date()), 30);
      try {
        const data = await getCompletedOrders(thirtyDaysAgo);
        setOrders(data);
      } catch (error) {
        console.error("Failed to load revenue data", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

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
            <div className="grid gap-4 sm:grid-cols-3 mb-6">
              {[1, 2, 3].map(i => <div key={i} className="glass shimmer rounded-2xl h-24" />)}
            </div>
            <div className="glass shimmer rounded-2xl h-80 mb-6" />
          </div>
        </main>
      </>
    );
  }

  // --- Aggregate Data ---

  // 1. Overview cards
  const todayStart = startOfDay(new Date());
  const todayOrders = orders.filter((o) => o.createdAt && isAfter(o.createdAt.toDate(), todayStart));
  
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalRevenue30d = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrders30d = orders.length;

  // 2. Line Chart (Revenue by day for the last 7 days)
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(todayStart, 6 - i);
    return {
      date: d,
      dateStr: format(d, "dd/MM", { locale: vi }),
      revenue: 0,
    };
  });

  orders.forEach((o) => {
    if (!o.createdAt) return;
    const orderDate = startOfDay(o.createdAt.toDate());
    const dayData = last7Days.find(d => d.date.getTime() === orderDate.getTime());
    if (dayData) {
      dayData.revenue += o.totalAmount;
    }
  });

  // 3. Best selling items (Top 5)
  const itemSales: Record<string, { name: string; quantity: number; revenue: number }> = {};
  orders.forEach((o) => {
    o.items.forEach((item) => {
      if (!itemSales[item.itemId]) {
        itemSales[item.itemId] = { name: item.name, quantity: 0, revenue: 0 };
      }
      itemSales[item.itemId].quantity += item.quantity;
      itemSales[item.itemId].revenue += item.price * item.quantity;
    });
  });

  const topItems = Object.values(itemSales)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  return (
    <>
      <div className="cafe-bg"><div className="cafe-bg-blob" /></div>
      <main className="relative z-10 min-h-screen p-4 md:p-6">
        <div className="mx-auto max-w-7xl">
          <AdminNav />

          <div className="glass fade-in-up mb-6 flex flex-col md:flex-row items-start md:items-center justify-between px-5 py-4 gap-4" style={{ animationDelay: "0.05s" }}>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>
                Thống kê Doanh thu
              </h1>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
                Dữ liệu 30 ngày gần nhất
              </p>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid gap-4 sm:grid-cols-3 mb-6 fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="glass p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">💰</span>
                <h3 style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 600 }}>Doanh thu hôm nay</h3>
              </div>
              <p style={{ fontSize: 24, fontWeight: 800, color: "var(--amber)" }}>
                {formatPrice(todayRevenue)}
              </p>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
                Từ {todayOrders.length} đơn hàng
              </p>
            </div>
            
            <div className="glass p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">📈</span>
                <h3 style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 600 }}>Doanh thu 30 ngày</h3>
              </div>
              <p style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)" }}>
                {formatPrice(totalRevenue30d)}
              </p>
            </div>

            <div className="glass p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">🛍️</span>
                <h3 style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 600 }}>Tổng đơn 30 ngày</h3>
              </div>
              <p style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)" }}>
                {totalOrders30d} <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-muted)" }}>đơn</span>
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 mb-6">
            {/* Revenue Line Chart */}
            <div className="glass p-5 rounded-2xl fade-in-up" style={{ animationDelay: "0.15s" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>
                Doanh thu 7 ngày gần nhất
              </h3>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={last7Days} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                    <XAxis dataKey="dateStr" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--text-muted)" }} dy={10} />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: "var(--text-muted)" }} 
                      tickFormatter={(value) => `${value / 1000}k`}
                      dx={-10}
                    />
                    <Tooltip 
                      formatter={(value: number) => [formatPrice(value), "Doanh thu"]}
                      contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="var(--amber)" strokeWidth={3} dot={{ r: 4, fill: "var(--amber)", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Items Bar Chart */}
            <div className="glass p-5 rounded-2xl fade-in-up" style={{ animationDelay: "0.2s" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>
                Top 5 món bán chạy (30 ngày)
              </h3>
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={topItems} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" horizontal={false} />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--text-muted)" }} />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--text-secondary)" }} dx={-10} />
                    <Tooltip 
                      formatter={(value: number) => [`${value} ly/phần`, "Đã bán"]}
                      contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                    />
                    <Bar dataKey="quantity" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Completed Orders Table */}
          <div className="glass p-5 rounded-2xl fade-in-up overflow-hidden" style={{ animationDelay: "0.25s" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16 }}>
              Lịch sử đơn hàng gần đây
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left" style={{ fontSize: 13 }}>
                <thead>
                  <tr style={{ color: "var(--text-muted)", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                    <th className="pb-3 font-medium">Mã đơn</th>
                    <th className="pb-3 font-medium">Thời gian</th>
                    <th className="pb-3 font-medium">Bàn</th>
                    <th className="pb-3 font-medium text-right">Tổng tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 10).map((order) => (
                    <tr key={order.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.02)" }}>
                      <td className="py-3 font-medium" style={{ color: "var(--text-primary)" }}>#{order.id.slice(-6).toUpperCase()}</td>
                      <td className="py-3" style={{ color: "var(--text-secondary)" }}>
                        {order.createdAt ? format(order.createdAt.toDate(), "dd/MM/yyyy HH:mm") : "N/A"}
                      </td>
                      <td className="py-3" style={{ color: "var(--text-secondary)" }}>{order.tableNumber}</td>
                      <td className="py-3 text-right font-bold" style={{ color: "var(--amber)" }}>
                        {formatPrice(order.totalAmount)}
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center" style={{ color: "var(--text-muted)" }}>
                        Chưa có đơn hàng nào hoàn thành.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}

export default RevenuePage;
