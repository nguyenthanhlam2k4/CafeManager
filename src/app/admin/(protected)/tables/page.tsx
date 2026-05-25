"use client";

import { useState } from "react";
import AdminNav from "@/components/admin/AdminNav";
import { useTables } from "@/hooks/useTables";
import { deleteTable } from "@/lib/firebase/tableService";
import TableCard from "@/components/admin/TableCard";
import TableForm from "@/components/admin/TableForm";
import QrModal from "@/components/admin/QrModal";
import type { TableDocument } from "@/types/table";

function AdminTablesPage() {
  const { tables, loading } = useTables();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTable, setEditingTable] = useState<TableDocument | null>(null);
  const [qrTable, setQrTable] = useState<TableDocument | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTables = tables.filter((table) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      table.name.toLowerCase().includes(q) ||
      table.tableNumber.toString().includes(q)
    );
  });

  async function handleDelete(tableId: string) {
    try {
      await deleteTable(tableId);
    } catch {
      alert("Lỗi khi xóa bàn.");
    }
  }

  if (loading) {
    return (
      <>
        <div className="cafe-bg"><div className="cafe-bg-blob" /></div>
        <main className="relative z-10 min-h-screen p-4 md:p-6">
          <div className="mx-auto max-w-6xl">
            <div className="glass p-4 mb-6 flex items-center gap-3">
              <div className="shimmer rounded-xl" style={{ width: 36, height: 36 }} />
              <div className="shimmer rounded-lg" style={{ width: 120, height: 20 }} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="glass shimmer rounded-2xl" style={{ height: 160 }} />
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
        <div className="mx-auto max-w-6xl">
          <AdminNav />

          {/* Page Header */}
          <div
            className="glass fade-in-up mb-5 flex items-center justify-between px-5 py-4"
            style={{ animationDelay: "0.05s" }}
          >
            <div>
              <h1
                style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}
              >
                Quản lý Bàn & QR Code
              </h1>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                Tổng số {tables.length} bàn
              </p>
            </div>
            <button
              type="button"
              onClick={() => { setEditingTable(null); setShowAddForm(true); }}
              className="btn-amber"
              style={{ padding: "9px 18px", fontSize: 13 }}
            >
              + Thêm Bàn
            </button>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="glass p-3 mb-4 flex items-center fade-in-up" style={{ animationDelay: "0.1s" }}>
                <span style={{ color: "var(--text-muted)", fontSize: 14, marginLeft: 8, marginRight: 8 }}>🔍</span>
                <input
                  type="search"
                  placeholder="Tìm kiếm theo số bàn hoặc tên..."
                  className="glass-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ border: "none", background: "transparent", paddingLeft: 0, boxShadow: "none" }}
                />
              </div>

              {filteredTables.length === 0 ? (
                <div
                  className="glass flex flex-col items-center justify-center py-16 text-center fade-in-up"
                  style={{ border: "1px dashed rgba(0,0,0,0.08)", animationDelay: "0.15s" }}
                >
                  <span style={{ fontSize: 40, marginBottom: 12 }}>🪑</span>
                  <p style={{ fontSize: 14, color: "var(--text-muted)" }}>Không tìm thấy bàn nào.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 fade-in-up" style={{ animationDelay: "0.15s" }}>
                  {filteredTables.map((table) => (
                    <TableCard
                      key={table.id}
                      table={table}
                      onEdit={(t) => { setShowAddForm(false); setEditingTable(t); }}
                      onDelete={handleDelete}
                      onShowQr={setQrTable}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="fade-in-up lg:col-span-1" style={{ animationDelay: "0.2s" }}>
              {(showAddForm || editingTable) ? (
                <TableForm
                  table={editingTable}
                  onSuccess={() => { setShowAddForm(false); setEditingTable(null); }}
                  onCancel={() => { setShowAddForm(false); setEditingTable(null); }}
                />
              ) : (
                <div className="glass p-6 text-center">
                  <span style={{ fontSize: 32, marginBottom: 12, display: "block" }}>📌</span>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                    Chọn "Thêm Bàn" hoặc "Sửa" để quản lý thông tin bàn.
                  </p>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>
                    Khách hàng quét mã QR trên bàn để xem menu và đặt món.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {qrTable && (
        <QrModal
          tableId={qrTable.id}
          tableNumber={qrTable.tableNumber}
          onClose={() => setQrTable(null)}
        />
      )}
    </>
  );
}

export default AdminTablesPage;
