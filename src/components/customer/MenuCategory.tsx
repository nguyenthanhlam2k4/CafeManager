"use client";

import { useState } from "react";
import MenuItem from "@/components/customer/MenuItem";
import type { CategoryDocument } from "@/types/category";
import type { MenuItemDocument } from "@/types/menu";
import { useCartStore } from "@/stores/useCartStore";
import toast from "react-hot-toast";

interface MenuCategoryProps {
  categories: CategoryDocument[];
  items: MenuItemDocument[];
  tableId: string;
}

function MenuCategory({ categories, items, tableId }: MenuCategoryProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>(categories[0]?.id ?? "");
  const addItem = useCartStore((state) => state.addItem);
  const setTableId = useCartStore((state) => state.setTableId);

  const handleAddToCart = (item: MenuItemDocument) => {
    setTableId(tableId);
    addItem(item);
    toast.success(`Đã thêm ${item.name}`);
  };

  const activeItems = items.filter(item => item.categoryId === activeCategoryId);

  return (
    <div className="flex flex-col">
      {/* Category Tabs (Sticky) */}
      <div className="sticky top-20 z-30 pb-4 pt-2 mb-2 bg-[var(--bg-primary)]">
        <div className="flex overflow-x-auto gap-2 no-scrollbar px-1" style={{ WebkitOverflowScrolling: "touch", msOverflowStyle: "none", scrollbarWidth: "none" }}>
          {categories.map((category) => {
            const isActive = category.id === activeCategoryId;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategoryId(category.id)}
                className="whitespace-nowrap px-4 py-2 rounded-xl transition-all duration-200"
                style={{
                  fontSize: 14,
                  fontWeight: isActive ? 700 : 500,
                  background: isActive ? "linear-gradient(135deg, var(--amber-dark), var(--amber-light))" : "rgba(255,255,255,0.6)",
                  color: isActive ? "#fff" : "var(--text-secondary)",
                  border: isActive ? "none" : "1px solid rgba(200, 170, 130, 0.3)",
                  boxShadow: isActive ? "0 4px 12px rgba(180, 83, 9, 0.25)" : "none",
                }}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Items List */}
      <div className="fade-in-up" key={activeCategoryId}>
        {activeItems.length === 0 ? (
          <div className="glass flex flex-col items-center justify-center py-16 text-center mt-4">
            <span style={{ fontSize: 40, marginBottom: 12 }}>🍽️</span>
            <p style={{ fontSize: 14, color: "var(--text-muted)" }}>Danh mục này hiện chưa có món.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeItems.map((item, index) => (
              <div key={item.id} style={{ animationDelay: `${index * 0.05}s` }} className="fade-in-up">
                <MenuItem item={item} onAddToCart={handleAddToCart} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MenuCategory;
