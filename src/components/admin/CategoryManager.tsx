"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createCategory,
  deleteCategory,
  seedDefaultCategories,
  updateCategory,
} from "@/lib/firebase/menuService";
import { CATEGORY_LABELS, MENU_ERRORS } from "@/constants/menu";
import {
  categoryFormSchema,
  type CategoryDocument,
  type CategoryFormValues,
} from "@/types/category";

interface CategoryManagerProps {
  categories: CategoryDocument[];
}

function CategoryManager({ categories }: CategoryManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { name: "", order: categories.length },
  });

  useEffect(() => {
    async function initCategories() {
      if (categories.length > 0) return;
      setIsSeeding(true);
      try {
        await seedDefaultCategories();
      } catch {
        setActionError(MENU_ERRORS.CATEGORY_SAVE_FAILED);
      } finally {
        setIsSeeding(false);
      }
    }
    void initCategories();
  }, [categories.length]);

  function openAddForm() {
    setEditingId(null);
    setIsAdding(true);
    reset({ name: "", order: categories.length });
  }

  function openEditForm(category: CategoryDocument) {
    setIsAdding(false);
    setEditingId(category.id);
    reset({ name: category.name, order: category.order });
  }

  function closeForm() {
    setIsAdding(false);
    setEditingId(null);
    setActionError(null);
    reset({ name: "", order: categories.length });
  }

  async function onSubmit(values: CategoryFormValues) {
    setActionError(null);
    try {
      if (editingId) {
        await updateCategory(editingId, values);
      } else {
        await createCategory(values);
      }
      closeForm();
    } catch {
      setActionError(MENU_ERRORS.CATEGORY_SAVE_FAILED);
    }
  }

  async function handleDelete(categoryId: string) {
    if (!window.confirm(CATEGORY_LABELS.DELETE_CONFIRM)) return;
    setActionError(null);
    try {
      await deleteCategory(categoryId);
    } catch {
      setActionError(MENU_ERRORS.CATEGORY_DELETE_FAILED);
    }
  }

  return (
    <section className="glass p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "0.02em" }}>
          {CATEGORY_LABELS.TITLE}
        </h2>
        <button
          type="button"
          onClick={openAddForm}
          className="btn-amber"
          style={{ padding: "5px 12px", fontSize: 12 }}
        >
          + {CATEGORY_LABELS.ADD}
        </button>
      </div>

      {isSeeding && (
        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{CATEGORY_LABELS.SEEDING}</p>
      )}
      {categories.length === 0 && !isSeeding && (
        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{CATEGORY_LABELS.EMPTY}</p>
      )}

      {/* Category list */}
      <ul className="space-y-1.5">
        {categories.map((category) => (
          <li
            key={category.id}
            className="flex items-center justify-between rounded-xl px-3 py-2 glass-hover"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div>
              <span style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 500 }}>{category.name}</span>
              <span style={{ fontSize: 11, color: "var(--text-muted)", marginLeft: 6 }}>#{category.order}</span>
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => openEditForm(category)}
                style={{
                  fontSize: 12, color: "var(--amber)", background: "rgba(245,158,11,0.1)",
                  border: "1px solid rgba(245,158,11,0.2)", borderRadius: 6, padding: "3px 10px", cursor: "pointer"
                }}
              >
                {CATEGORY_LABELS.EDIT}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(category.id)}
                className="btn-danger"
                style={{ padding: "3px 10px", fontSize: 12 }}
              >
                Xóa
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-3 pt-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="space-y-1.5">
            <label className="glass-label">{CATEGORY_LABELS.NAME}</label>
            <input type="text" className="glass-input" {...register("name")} />
            {errors.name && <p style={{ fontSize: 12, color: "#fca5a5" }}>{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <label className="glass-label">{CATEGORY_LABELS.ORDER}</label>
            <input type="number" min={0} className="glass-input" {...register("order")} />
            {errors.order && <p style={{ fontSize: 12, color: "#fca5a5" }}>{errors.order.message}</p>}
          </div>
          {actionError && <p style={{ fontSize: 12, color: "#fca5a5" }}>{actionError}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={isSubmitting} className="btn-amber" style={{ padding: "7px 16px", fontSize: 13 }}>
              Lưu
            </button>
            <button type="button" onClick={closeForm} className="btn-ghost" style={{ padding: "7px 16px", fontSize: 13 }}>
              Hủy
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

export default CategoryManager;
