"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatPrice } from "@/lib/utils/formatPrice";
import type { CategoryDocument } from "@/types/category";
import type { MenuItemDocument } from "@/types/menu";
import Navbar from "@/components/Navbar";

const CATEGORY_ICONS: Record<string, string> = {
  "cà phê": "☕", coffee: "☕",
  "đồ uống": "🥤", drink: "🥤",
  "bữa sáng": "🥞", breakfast: "🥞",
  "tráng miệng": "🍰", dessert: "🍰",
  "món chính": "🍜", main: "🍜",
  snack: "🥐",
  default: "🍽️",
};
function getCategoryIcon(name: string) {
  const key = name.toLowerCase();
  for (const [k, v] of Object.entries(CATEGORY_ICONS)) {
    if (key.includes(k)) return v;
  }
  return CATEGORY_ICONS.default;
}

function PublicMenuItemCard({ item }: { item: MenuItemDocument }) {
  return (
    <Link href={`/menu/item/${item.id}`} className="menu-item-card menu-item-card--link" id={`menu-card-${item.id}`}>
      <div className="menu-item-card__img-area">
        {item.imageUrl ? (
          <Image src={item.imageUrl} alt={item.name} fill className="menu-item-card__img" />
        ) : (
          <div className="menu-item-card__img-placeholder">🍽️</div>
        )}
      </div>
      <div className="menu-item-card__body">
        <h3 className="menu-item-card__name">{item.name}</h3>
        {item.description && <p className="menu-item-card__desc">{item.description}</p>}
        <div className="menu-item-card__footer" style={{ justifyContent: "space-between" }}>
          <span className="menu-item-card__price">{formatPrice(item.price)}</span>
          <span className="pub-menu-available-badge">Xem chi tiết →</span>
        </div>
      </div>
    </Link>
  );
}


interface Props {
  categories: CategoryDocument[];
  items: MenuItemDocument[];
}

export default function PublicMenuClient({ categories, items }: Props) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>("all");

  const activeItems =
    activeCategoryId === "all"
      ? items
      : items.filter((i) => i.categoryId === activeCategoryId);

  return (
    <div className="menu-root">
      <div className="menu-bg" />

      {/* Dùng chung Navbar với trang chủ */}
      <Navbar />

      <main className="menu-main" style={{ paddingTop: 80 }}>
        <div className="menu-page__header">
          <div>
            <h1 className="menu-page__title">Our Popular Menu</h1>
            <p className="menu-page__subtitle">
              Khám phá toàn bộ thực đơn với nhiều lựa chọn hấp dẫn
            </p>
          </div>
          <div className="menu-page__cat-icons">
            <button
              className={`menu-cat-icon-btn ${activeCategoryId === "all" ? "menu-cat-icon-btn--active" : ""}`}
              onClick={() => setActiveCategoryId("all")}
              title="Tất cả" aria-label="Tất cả"
            >
              <span>🍽️</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`menu-cat-icon-btn ${cat.id === activeCategoryId ? "menu-cat-icon-btn--active" : ""}`}
                onClick={() => setActiveCategoryId(cat.id)}
                title={cat.name} aria-label={cat.name}
                id={`pub-cat-icon-${cat.id}`}
              >
                <span>{getCategoryIcon(cat.name)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="menu-page__tabs">
          <button
            className={`menu-tab-pill ${activeCategoryId === "all" ? "menu-tab-pill--active" : ""}`}
            onClick={() => setActiveCategoryId("all")} id="pub-tab-all"
          >
            🍽️ Tất cả
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`menu-tab-pill ${cat.id === activeCategoryId ? "menu-tab-pill--active" : ""}`}
              onClick={() => setActiveCategoryId(cat.id)}
              id={`pub-tab-${cat.id}`}
            >
              {getCategoryIcon(cat.name)} {cat.name}
            </button>
          ))}
        </div>

        {activeItems.length === 0 ? (
          <div className="menu-page__empty">
            <span>🍽️</span>
            <p>Chưa có món nào trong danh mục này.</p>
          </div>
        ) : (
          <div className="menu-page__grid" key={activeCategoryId}>
            {activeItems.map((item, i) => (
              <div key={item.id} className="fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <PublicMenuItemCard item={item} />
              </div>
            ))}
          </div>
        )}

        <div className="pub-menu-cta">
          <div className="pub-menu-cta__text">
            <div className="pub-menu-cta__title">Muốn đặt món?</div>
            <div className="pub-menu-cta__desc">Quét mã QR tại bàn để đặt món trực tiếp và nhận phục vụ tại chỗ.</div>
          </div>
          <span className="pub-menu-cta__icon">📱</span>
        </div>
      </main>
    </div>
  );
}
