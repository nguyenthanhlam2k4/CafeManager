"use client";

import { useState } from "react";
import type { TableDocument } from "@/types/table";
import { updateTable } from "@/lib/firebase/tableService";

interface TableCardProps {
  table: TableDocument;
  onEdit: (table: TableDocument) => void;
  onDelete: (tableId: string) => void;
  onShowQr: (table: TableDocument) => void;
}

function TableCard({ table, onEdit, onDelete, onShowQr }: TableCardProps) {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  async function toggleStatus() {
    setIsUpdatingStatus(true);
    try {
      const newStatus = table.status === "available" ? "occupied" : "available";
      await updateTable(table.id, { status: newStatus });
    } catch {
      alert("Lỗi khi cập nhật trạng thái bàn.");
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  return (
    <div className="glass glass-hover p-4 flex flex-col justify-between h-full relative group">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>
            Bàn {table.tableNumber}
          </h3>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>
            {table.name || "Không có ghi chú"}
          </p>
        </div>
        <div className="flex gap-2">
           <button
            type="button"
            onClick={() => onShowQr(table)}
            title="Xem QR Code"
            style={{
              fontSize: 18,
              background: "rgba(245,158,11,0.1)",
              borderRadius: 8,
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            📱
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
        <button
          onClick={toggleStatus}
          disabled={isUpdatingStatus}
          style={{
            fontSize: 12,
            padding: "4px 10px",
            borderRadius: 16,
            fontWeight: 600,
            cursor: isUpdatingStatus ? "not-allowed" : "pointer",
            opacity: isUpdatingStatus ? 0.6 : 1,
            background: table.status === "available" ? "rgba(34, 197, 94, 0.12)" : "rgba(220, 38, 38, 0.12)",
            color: table.status === "available" ? "#15803d" : "#dc2626",
            border: `1px solid ${table.status === "available" ? "rgba(34, 197, 94, 0.3)" : "rgba(220, 38, 38, 0.3)"}`
          }}
        >
          {table.status === "available" ? "Trống" : "Đang sử dụng"}
        </button>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onEdit(table)}
            style={{
              fontSize: 12, color: "var(--amber)", background: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.2)", borderRadius: 6,
              padding: "4px 10px", cursor: "pointer", transition: "background 0.2s",
            }}
          >
            Sửa
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Xóa bàn ${table.tableNumber}?`)) {
                onDelete(table.id);
              }
            }}
            className="btn-danger"
            style={{ padding: "4px 10px", fontSize: 12 }}
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}

export default TableCard;
