"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import { formatPrice } from "@/lib/utils/formatPrice";
import { useCartStore } from "@/stores/useCartStore";
import type { CategoryDocument } from "@/types/category";
import type { MenuItemDocument } from "@/types/menu";
import toast from "react-hot-toast";

const CATEGORY_ICONS: Record<string, string> = {
  default: "🍽️",
  "cà phê": "☕", coffee: "☕",
  "đồ uống": "🥤", drink: "🥤",
  "bữa sáng": "🥞", breakfast: "🥞",
  "tráng miệng": "🍰", dessert: "🍰",
  "món chính": "🍜", main: "🍜",
  snack: "🥐",
};

function getCategoryIcon(name: string) {
  const key = name.toLowerCase();
  for (const [k, v] of Object.entries(CATEGORY_ICONS)) {
    if (key.includes(k)) return v;
  }
  return CATEGORY_ICONS.default;
}

function MenuItemCard({
  item,
  onAddToCart,
}: {
  item: MenuItemDocument;
  onAddToCart: (item: MenuItemDocument) => void;
}) {
  const [liked, setLiked] = useState(false);
  const [qty, setQty] = useState(0);

  const handleAdd = () => {
    setQty((q) => q + 1);
    onAddToCart(item);
  };

  const handleMinus = () => {
    if (qty > 0) setQty((q) => q - 1);
  };

  return (
    <div className="menu-item-card">
      <div className="menu-item-card__img-area">
        {item.imageUrl ? (
          <Image src={item.imageUrl} alt={item.name} fill className="menu-item-card__img" />
        ) : (
          <div className="menu-item-card__img-placeholder">🍽️</div>
        )}
        <div className="menu-item-card__rating">
          <span className="menu-item-card__rating-star">★</span>
          <span className="menu-item-card__rating-val">5.0</span>
        </div>
        <button className="menu-item-card__like" onClick={() => setLiked(!liked)} aria-label="Yêu thích">
          {liked ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="menu-item-card__body">
        <h3 className="menu-item-card__name">{item.name}</h3>
        {item.description && <p className="menu-item-card__desc">{item.description}</p>}

        <div className="menu-item-card__footer">
          <div className="menu-item-card__qty">
            <button className="menu-item-card__qty-btn" onClick={handleMinus} aria-label="Giảm">−</button>
            <span className="menu-item-card__qty-val">{qty > 0 ? qty : 1}</span>
            <button className="menu-item-card__qty-btn menu-item-card__qty-btn--plus" onClick={handleAdd} aria-label="Tăng">+</button>
          </div>
          <span className="menu-item-card__price">{formatPrice(item.price)}</span>
          <button
            className="menu-item-card__cart-btn"
            onClick={handleAdd}
            aria-label="Thêm vào giỏ"
            id={`add-to-cart-${item.id}`}
          >
            🛒
          </button>
        </div>
      </div>
    </div>
  );
}

interface MenuCategoryProps {
  categories: CategoryDocument[];
  items: MenuItemDocument[];
  tableId: string;
}

function MenuCategory({ categories, items, tableId }: MenuCategoryProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    categories[0]?.id ?? ""
  );
  const addItem = useCartStore((s) => s.addItem);
  const setTableId = useCartStore((s) => s.setTableId);

  const handleAddToCart = useCallback((item: MenuItemDocument) => {
    setTableId(tableId);
    addItem(item);
    toast.success(`Đã thêm ${item.name} 🛒`, { duration: 1500 });
  }, [tableId, addItem, setTableId]);

  const activeItems = items.filter((i) => i.categoryId === activeCategoryId);
  const activeCategory = categories.find((c) => c.id === activeCategoryId);

  return (
    <div className="menu-page">
      <div className="menu-page__header">
        <div>
          <h1 className="menu-page__title">Our Popular Menu</h1>
          <p className="menu-page__subtitle">
            {activeCategory?.name ?? "Chọn món yêu thích của bạn"}
          </p>
        </div>
        <div className="menu-page__cat-icons">
          {categories.map((cat) => {
            const isActive = cat.id === activeCategoryId;
            return (
              <button
                key={cat.id}
                className={`menu-cat-icon-btn ${isActive ? "menu-cat-icon-btn--active" : ""}`}
                onClick={() => setActiveCategoryId(cat.id)}
                title={cat.name} aria-label={cat.name}
                id={`cat-btn-${cat.id}`}
              >
                <span>{getCategoryIcon(cat.name)}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="menu-page__tabs">
        {categories.map((cat) => {
          const isActive = cat.id === activeCategoryId;
          return (
            <button
              key={cat.id}
              className={`menu-tab-pill ${isActive ? "menu-tab-pill--active" : ""}`}
              onClick={() => setActiveCategoryId(cat.id)}
              id={`tab-${cat.id}`}
            >
              {getCategoryIcon(cat.name)} {cat.name}
            </button>
          );
        })}
      </div>

      {activeItems.length === 0 ? (
        <div className="menu-page__empty">
          <span>🍽️</span>
          <p>Danh mục này chưa có món nào.</p>
        </div>
      ) : (
        <div className="menu-page__grid" key={activeCategoryId}>
          {activeItems.map((item, i) => (
            <div key={item.id} className="fade-in-up" style={{ animationDelay: `${i * 0.06}s` }}>
              <MenuItemCard item={item} onAddToCart={handleAddToCart} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MenuCategory;
