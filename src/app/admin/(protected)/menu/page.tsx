"use client";

import { useMemo, useState } from "react";
import AdminNav from "@/components/admin/AdminNav";
import CategoryManager from "@/components/admin/CategoryManager";
import MenuItemForm from "@/components/admin/MenuItemForm";
import { useMenuItems } from "@/hooks/useMenuItems";
import { softDeleteMenuItem } from "@/lib/firebase/menuService";
import { formatPrice } from "@/lib/utils/formatPrice";
import { MENU_ERRORS, MENU_LABELS } from "@/constants/menu";
import type { MenuItemDocument } from "@/types/menu";

function AdminMenuPage() {
  const { menuItems, categories, loading } = useMenuItems();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [editingItem, setEditingItem] = useState<MenuItemDocument | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return menuItems.filter((item) => {
      const matchesCategory = selectedCategoryId === "all" || item.categoryId === selectedCategoryId;
      const matchesSearch = normalizedQuery.length === 0 || item.name.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, searchQuery, selectedCategoryId]);

  const categoryNameById = useMemo(
    () => new Map(categories.map((c) => [c.id, c.name])),
    [categories]
  );

  function handleFormSuccess() {
    setShowAddForm(false);
    setEditingItem(null);
  }

  async function handleDelete(itemId: string) {
    if (!window.confirm("Xóa món này khỏi menu?")) return;
    setDeletingId(itemId);
    try {
      await softDeleteMenuItem(itemId);
    } catch {
      window.alert(MENU_ERRORS.DELETE_FAILED);
    } finally {
      setDeletingId(null);
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
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="glass shimmer rounded-2xl" style={{ height: 200 }} />
              <div className="glass shimmer rounded-2xl lg:col-span-2" style={{ height: 200 }} />
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

          {/* Page header */}
          <div
            className="glass fade-in-up mb-5 flex items-center justify-between px-5 py-4"
            style={{ animationDelay: "0.05s" }}
          >
            <div>
              <h1
                style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}
              >
                {MENU_LABELS.PAGE_TITLE}
              </h1>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                {filteredItems.length} món · {categories.length} danh mục
              </p>
            </div>
            <button
              type="button"
              onClick={() => { setEditingItem(null); setShowAddForm(true); }}
              className="btn-amber"
              style={{ padding: "9px 18px", fontSize: 13 }}
            >
              + {MENU_LABELS.ADD_ITEM}
            </button>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {/* Left: Category Manager */}
            <div className="fade-in-up lg:col-span-1" style={{ animationDelay: "0.1s" }}>
              <CategoryManager categories={categories} />
            </div>

            {/* Right: Menu items */}
            <div className="fade-in-up space-y-4 lg:col-span-2" style={{ animationDelay: "0.15s" }}>
              {/* Search & filter */}
              <div
                className="glass flex flex-col gap-2 p-3 sm:flex-row"
              >
                <div className="relative flex-1">
                  <span
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--text-muted)", fontSize: 14 }}
                  >
                    🔍
                  </span>
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={MENU_LABELS.SEARCH_PLACEHOLDER}
                    className="glass-input"
                    style={{ paddingLeft: 32 }}
                  />
                </div>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="glass-input"
                  style={{ maxWidth: "180px" }}
                >
                  <option value="all">{MENU_LABELS.ALL_CATEGORIES}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Add/Edit form */}
              {(showAddForm || editingItem) && (
                <MenuItemForm
                  categories={categories}
                  item={editingItem}
                  onSuccess={handleFormSuccess}
                  onCancel={() => { setShowAddForm(false); setEditingItem(null); }}
                />
              )}

              {/* Menu items grid */}
              {filteredItems.length === 0 ? (
                <div
                  className="glass flex flex-col items-center justify-center py-16 text-center"
                  style={{ border: "1px dashed rgba(255,255,255,0.12)" }}
                >
                  <span style={{ fontSize: 40, marginBottom: 12 }}>☕</span>
                  <p style={{ fontSize: 14, color: "var(--text-muted)" }}>{MENU_LABELS.NO_ITEMS}</p>
                </div>
              ) : (
                <ul className="grid gap-3 sm:grid-cols-2">
                  {filteredItems.map((item, i) => (
                    <li
                      key={item.id}
                      className="glass glass-hover fade-in-up p-4"
                      style={{ animationDelay: `${i * 0.04}s` }}
                    >
                      <div className="flex gap-3">
                        {/* Image */}
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="rounded-xl object-cover flex-shrink-0"
                            style={{ width: 72, height: 72 }}
                          />
                        ) : (
                          <div
                            className="flex-shrink-0 flex items-center justify-center rounded-xl"
                            style={{
                              width: 72, height: 72,
                              background: "rgba(255,255,255,0.05)",
                              border: "1px solid rgba(255,255,255,0.08)",
                              fontSize: 28,
                            }}
                          >
                            ☕
                          </div>
                        )}

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3
                            className="truncate"
                            style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}
                          >
                            {item.name}
                          </h3>
                          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                            {categoryNameById.get(item.categoryId) ?? "—"}
                          </p>
                          <p
                            style={{
                              fontSize: 14, fontWeight: 700, color: "var(--amber)",
                              marginTop: 4,
                            }}
                          >
                            {formatPrice(item.price)}
                          </p>
                          <div className="mt-2">
                            {item.isAvailable
                              ? <span className="badge-available">Còn bán</span>
                              : <span className="badge-unavailable">Tạm hết</span>
                            }
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div
                        className="flex gap-2 mt-3 pt-3"
                        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
                      >
                        <button
                          type="button"
                          onClick={() => { setShowAddForm(false); setEditingItem(item); }}
                          style={{
                            fontSize: 12, color: "var(--amber)", background: "rgba(245,158,11,0.1)",
                            border: "1px solid rgba(245,158,11,0.2)", borderRadius: 6,
                            padding: "4px 12px", cursor: "pointer", transition: "background 0.2s",
                          }}
                        >
                          {MENU_LABELS.EDIT_ITEM}
                        </button>
                        <button
                          type="button"
                          disabled={deletingId === item.id}
                          onClick={() => handleDelete(item.id)}
                          className="btn-danger"
                          style={{ padding: "4px 12px", fontSize: 12 }}
                        >
                          {deletingId === item.id ? MENU_LABELS.DELETING : MENU_LABELS.DELETE}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default AdminMenuPage;
