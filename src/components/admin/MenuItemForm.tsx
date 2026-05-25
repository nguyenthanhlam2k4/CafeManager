"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createMenuItem, updateMenuItem, uploadMenuItemImage } from "@/lib/firebase/menuService";
import { MENU_ERRORS, MENU_LABELS } from "@/constants/menu";
import { menuItemFormSchema, type MenuItemDocument, type MenuItemFormValues } from "@/types/menu";
import type { CategoryDocument } from "@/types/category";

interface MenuItemFormProps {
  categories: CategoryDocument[];
  item?: MenuItemDocument | null;
  onSuccess: () => void;
  onCancel: () => void;
}

function MenuItemForm({ categories, item, onSuccess, onCancel }: MenuItemFormProps) {
  const isEditing = Boolean(item);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemFormSchema),
    defaultValues: {
      name: item?.name ?? "",
      description: item?.description ?? "",
      price: item?.price ?? 1,
      categoryId: item?.categoryId ?? categories[0]?.id ?? "",
      isAvailable: item?.isAvailable ?? true,
    },
  });

  async function onSubmit(values: MenuItemFormValues) {
    setSubmitError(null);
    try {
      if (isEditing && item) {
        let imageUrl: string | undefined;
        if (imageFile) imageUrl = await uploadMenuItemImage(item.id, imageFile);
        await updateMenuItem(item.id, values, imageUrl);
      } else {
        const newItemId = await createMenuItem(values);
        if (imageFile) {
          const imageUrl = await uploadMenuItemImage(newItemId, imageFile);
          await updateMenuItem(newItemId, values, imageUrl);
        }
      }
      onSuccess();
    } catch {
      setSubmitError(MENU_ERRORS.SAVE_FAILED);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="glass fade-in-up p-5 space-y-4"
    >
      <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>
        {isEditing ? MENU_LABELS.EDIT_ITEM : MENU_LABELS.ADD_ITEM}
      </h2>

      {/* Name */}
      <div className="space-y-1.5">
        <label className="glass-label">{MENU_LABELS.NAME}</label>
        <input type="text" className="glass-input" {...register("name")} />
        {errors.name && <p style={{ fontSize: 12, color: "#fca5a5" }}>{errors.name.message}</p>}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="glass-label">{MENU_LABELS.DESCRIPTION}</label>
        <textarea
          rows={2}
          className="glass-input"
          style={{ resize: "none" }}
          {...register("description")}
        />
      </div>

      {/* Price & Category */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="glass-label">{MENU_LABELS.PRICE}</label>
          <input type="number" min={1} className="glass-input" {...register("price")} />
          {errors.price && <p style={{ fontSize: 12, color: "#fca5a5" }}>{errors.price.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="glass-label">{MENU_LABELS.CATEGORY}</label>
          <select className="glass-input" {...register("categoryId")}>
            <option value="">{MENU_LABELS.SELECT_CATEGORY}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {errors.categoryId && <p style={{ fontSize: 12, color: "#fca5a5" }}>{errors.categoryId.message}</p>}
        </div>
      </div>

      {/* Available toggle */}
      <label className="flex items-center gap-2.5 cursor-pointer">
        <input
          id="isAvailable"
          type="checkbox"
          className="h-4 w-4"
          style={{ accentColor: "var(--amber)" }}
          {...register("isAvailable")}
        />
        <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{MENU_LABELS.AVAILABLE}</span>
      </label>

      {/* Image upload */}
      <div className="space-y-1.5">
        <label className="glass-label">{MENU_LABELS.IMAGE}</label>
        <div
          className="rounded-xl p-3"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.15)" }}
        >
          <input
            type="file"
            accept="image/*"
            className="w-full text-sm"
            style={{ color: "var(--text-secondary)" }}
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          />
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{MENU_LABELS.IMAGE_HINT}</p>
        </div>
        {item?.imageUrl && !imageFile && (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="mt-2 rounded-xl object-cover"
            style={{ width: 80, height: 80 }}
          />
        )}
      </div>

      {submitError && (
        <div
          className="rounded-xl px-4 py-3"
          style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5", fontSize: 13 }}
        >
          {submitError}
        </div>
      )}

      <div className="flex gap-2">
        <button type="submit" disabled={isSubmitting} className="btn-amber" style={{ padding: "8px 20px", fontSize: 13 }}>
          {isSubmitting ? MENU_LABELS.SAVING : MENU_LABELS.SAVE}
        </button>
        <button type="button" onClick={onCancel} className="btn-ghost" style={{ padding: "8px 20px", fontSize: 13 }}>
          {MENU_LABELS.CANCEL}
        </button>
      </div>
    </form>
  );
}

export default MenuItemForm;
