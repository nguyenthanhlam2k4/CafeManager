"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTable, updateTable } from "@/lib/firebase/tableService";
import { tableFormSchema, type TableDocument, type TableFormValues } from "@/types/table";

interface TableFormProps {
  table?: TableDocument | null;
  onSuccess: () => void;
  onCancel: () => void;
}

function TableForm({ table, onSuccess, onCancel }: TableFormProps) {
  const isEditing = Boolean(table);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TableFormValues>({
    resolver: zodResolver(tableFormSchema),
    defaultValues: {
      tableNumber: table?.tableNumber ?? 1,
      name: table?.name ?? "",
      status: table?.status ?? "available",
    },
  });

  async function onSubmit(values: TableFormValues) {
    setSubmitError(null);
    try {
      if (isEditing && table) {
        await updateTable(table.id, values);
      } else {
        await createTable(values);
      }
      onSuccess();
    } catch {
      setSubmitError("Lỗi khi lưu bàn. Vui lòng thử lại.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="glass fade-in-up p-5 space-y-4"
    >
      <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>
        {isEditing ? "Cập nhật bàn" : "Thêm bàn mới"}
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {/* Table Number */}
        <div className="space-y-1.5">
          <label className="glass-label">Số Bàn</label>
          <input type="number" min={1} className="glass-input" {...register("tableNumber")} />
          {errors.tableNumber && <p style={{ fontSize: 12, color: "#dc2626" }}>{errors.tableNumber.message}</p>}
        </div>

        {/* Name/Description */}
        <div className="space-y-1.5">
          <label className="glass-label">Tên/Ghi chú</label>
          <input type="text" placeholder="Khu vực A" className="glass-input" {...register("name")} />
          {errors.name && <p style={{ fontSize: 12, color: "#dc2626" }}>{errors.name.message}</p>}
        </div>
      </div>

      {/* Status */}
      <div className="space-y-1.5">
        <label className="glass-label">Trạng thái</label>
        <select className="glass-input" {...register("status")}>
          <option value="available">Trống (Available)</option>
          <option value="occupied">Đang sử dụng (Occupied)</option>
        </select>
        {errors.status && <p style={{ fontSize: 12, color: "#dc2626" }}>{errors.status.message}</p>}
      </div>

      {submitError && (
        <div
          className="rounded-xl px-4 py-3"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#dc2626", fontSize: 13 }}
        >
          {submitError}
        </div>
      )}

      <div className="flex gap-2">
        <button type="submit" disabled={isSubmitting} className="btn-amber" style={{ padding: "8px 20px", fontSize: 13 }}>
          {isSubmitting ? "Đang lưu..." : "Lưu"}
        </button>
        <button type="button" onClick={onCancel} className="btn-ghost" style={{ padding: "8px 20px", fontSize: 13 }}>
          Hủy
        </button>
      </div>
    </form>
  );
}

export default TableForm;
