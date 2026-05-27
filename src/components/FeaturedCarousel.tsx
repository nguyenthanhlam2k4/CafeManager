"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { MenuItemDocument } from "@/types/menu";

interface FeaturedCarouselProps {
  items: MenuItemDocument[];
}

function formatPrice(price: number) {
  return price.toLocaleString("vi-VN") + " ₫";
}

function getItemImage(item: MenuItemDocument): string {
  return item.imageUrl || "/food_latte.png";
}

export default function FeaturedCarousel({ items }: FeaturedCarouselProps) {
  const [current, setCurrent] = useState(0);
  const VISIBLE = 3;
  const total = items.length;

  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);

  const getVisible = () => {
    if (total === 0) return [];
    const result = [];
    for (let i = 0; i < Math.min(VISIBLE, total); i++) {
      result.push(items[(current + i) % total]);
    }
    return result;
  };

  const visibleItems = getVisible();

  return (
    <section className="homepage-carousel-section" id="featured">
      <div className="homepage-carousel-header">
        <div>
          <h2 className="homepage-section__title" style={{ color: "#1c1008" }}>Hôm Nay Thử Gì?</h2>
          <Link href="#breakfast" className="btn-homepage-ghost" style={{ marginTop: 12 }} id="full-menu-link">
            Xem thêm →
          </Link>
        </div>
        {total > VISIBLE && (
          <div className="homepage-carousel-controls">
            <button className="homepage-carousel-btn" onClick={prev} id="carousel-prev" aria-label="Trước">‹</button>
            <button className="homepage-carousel-btn" onClick={next} id="carousel-next" aria-label="Tiếp">›</button>
          </div>
        )}
      </div>

      <div className="homepage-carousel-track">
        {visibleItems.length === 0 ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="homepage-carousel-item">
              <div className="homepage-carousel-item__img-wrap homepage-skeleton" />
              <div className="homepage-carousel-item__body">
                <div className="homepage-skeleton" style={{ height: 16, borderRadius: 6, marginBottom: 8 }} />
                <div className="homepage-skeleton" style={{ height: 16, width: "50%", borderRadius: 6 }} />
              </div>
            </div>
          ))
        ) : (
          visibleItems.map((item, i) => (
            <div key={`${item.id}-${i}`} className="homepage-carousel-item" id={`featured-item-${item.id}`}>
              <div className="homepage-carousel-item__img-wrap">
                <Image src={getItemImage(item)} alt={item.name} fill className="homepage-carousel-item__img" />
              </div>
              <div className="homepage-carousel-item__body">
                <div className="homepage-carousel-item__name">{item.name}</div>
                <div className="homepage-carousel-item__price">{formatPrice(item.price)}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {total > VISIBLE && (
        <div className="homepage-carousel-dots">
          {items.map((_, i) => (
            <button
              key={i}
              className={`homepage-carousel-dot ${i === current ? "homepage-carousel-dot--active" : ""}`}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
              id={`carousel-dot-${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
