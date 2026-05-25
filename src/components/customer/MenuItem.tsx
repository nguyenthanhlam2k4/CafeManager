"use client";

import { formatPrice } from "@/lib/utils/formatPrice";
import type { MenuItemDocument } from "@/types/menu";

interface MenuItemProps {
  item: MenuItemDocument;
  onAddToCart?: (item: MenuItemDocument) => void;
}

function MenuItem({ item, onAddToCart }: MenuItemProps) {
  return (
    <div className="glass glass-hover p-4 mb-3 flex gap-3">
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.name}
          className="rounded-xl object-cover flex-shrink-0"
          style={{ width: 80, height: 80 }}
        />
      ) : (
        <div
          className="flex-shrink-0 flex items-center justify-center rounded-xl"
          style={{
            width: 80, height: 80,
            background: "rgba(255,255,255,0.4)",
            border: "1px solid rgba(255,255,255,0.6)",
            fontSize: 32,
          }}
        >
          ☕
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }} className="truncate">
            {item.name}
          </h3>
          {item.description && (
            <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }} className="line-clamp-2">
              {item.description}
            </p>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <p style={{ fontSize: 15, fontWeight: 800, color: "var(--amber)" }}>
            {formatPrice(item.price)}
          </p>
          <button
            onClick={() => onAddToCart && onAddToCart(item)}
            className="btn-amber flex items-center justify-center rounded-full"
            style={{ width: 32, height: 32, padding: 0 }}
            aria-label="Thêm vào giỏ"
          >
            <span style={{ fontSize: 18, lineHeight: 1, marginTop: -2 }}>+</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuItem;
