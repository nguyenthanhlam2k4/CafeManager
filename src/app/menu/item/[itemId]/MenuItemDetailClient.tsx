"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatPrice } from "@/lib/utils/formatPrice";
import type { MenuItemDocument } from "@/types/menu";
import Navbar from "@/components/Navbar";

interface Props {
  item: MenuItemDocument;
  related: MenuItemDocument[];
  categoryName: string;
}

const FEATURES = [
  { icon: "🌿", title: "Sugar free", desc: "Now without added sugar", bgColor: "rgba(236, 72, 153, 0.15)", color: "#db2777" },
  { icon: "✨", title: "100% Premium", desc: "Using 100% premium beans", bgColor: "rgba(245, 158, 11, 0.15)", color: "#d97706" },
  { icon: "☕", title: "Chilled Classics", desc: "Signature coffee collection", bgColor: "rgba(16, 185, 129, 0.15)", color: "#059669" },
];

export default function MenuItemDetailClient({ item, related, categoryName }: Props) {
  const router = useRouter();
  const [relatedIdx, setRelatedIdx] = useState(0);
  const visibleCount = 3;
  const canPrev = relatedIdx > 0;
  const canNext = relatedIdx + visibleCount < related.length;
  const visibleRelated = related.slice(relatedIdx, relatedIdx + visibleCount);

  return (
    <div className="detail-root">
      <div className="detail-bg" />
      <Navbar />

      <main className="detail-main">
        {/* Breadcrumb */}
        <nav className="detail-breadcrumb">
          <Link href="/menu" className="detail-breadcrumb__link">Menu</Link>
          <span className="detail-breadcrumb__sep">›</span>
          {categoryName && (
            <>
              <Link href="/menu" className="detail-breadcrumb__link">{categoryName}</Link>
              <span className="detail-breadcrumb__sep">›</span>
            </>
          )}
          <span className="detail-breadcrumb__current">{item.name}</span>
        </nav>

        {/* Hero Area */}
        <section className="detail-hero">
          {/* Decorative coffee bean emojis to match the image floating items */}
          <span className="floating-bean floating-bean--1">🫘</span>
          <span className="floating-bean floating-bean--2">🫘</span>
          <span className="floating-bean floating-bean--3">☕</span>

          {/* Left: Info Column */}
          <div className="detail-hero__left">
            {categoryName && (
              <span className="detail-hero__category">{categoryName}</span>
            )}
            <h1 className="detail-hero__title">{item.name}</h1>
            <p className="detail-hero__desc">
              {item.description || "Thưởng thức hương vị tuyệt vời cùng công thức pha chế độc quyền mang đến trải nghiệm tuyệt hảo."}
            </p>

            <div className="detail-hero__price-row">
              <span className="detail-hero__price">{formatPrice(item.price)}</span>
              <button
                className="detail-hero__cta"
                onClick={() => router.push("/#contact")}
                id="detail-buy-btn"
              >
                <span>Đặt ngay</span>
                <span className="detail-hero__cta-arrow">›</span>
              </button>
            </div>

            <div className="detail-promo-card">
              <h4 className="detail-promo-card__title">GỢI Ý ĐI KÈM</h4>
              <p className="detail-promo-card__desc">Thưởng thức cùng bánh sừng bò (Croissant) nóng hổi để có một buổi sáng trọn vẹn năng lượng.</p>
            </div>
          </div>

          {/* Center: Image Column */}
          <div className="detail-hero__center">
            {/* The circular green/accent badge backdrop from the picture */}
            <div className="detail-hero__img-backdrop">
              <svg viewBox="0 0 200 200" className="backdrop-circles">
                <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(201,109,30,0.15)" strokeWidth="1.5" />
                <circle cx="100" cy="100" r="75" fill="none" stroke="rgba(201,109,30,0.1)" strokeWidth="1" strokeDasharray="4 4" />
                <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(201,109,30,0.2)" strokeWidth="2" />
              </svg>
            </div>
            <div className="detail-hero__img-wrap animate-float">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="detail-hero__img"
                  priority
                />
              ) : (
                <div className="detail-hero__img-placeholder">🍽️</div>
              )}
            </div>
          </div>

          {/* Right: Features Column */}
          <div className="detail-hero__right">
            {FEATURES.map((f) => (
              <div key={f.title} className="detail-feature">
                <div
                  className="detail-feature__icon"
                  style={{ backgroundColor: f.bgColor, color: f.color }}
                >
                  {f.icon}
                </div>
                <div>
                  <div className="detail-feature__title">{f.title}</div>
                  <div className="detail-feature__desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Curved Block for Related Items */}
        {related.length > 0 && (
          <section className="detail-related">
            <h3 className="detail-related__title">Có thể bạn sẽ thích</h3>
            <div className="detail-related__inner">
              <button
                className="detail-related__arrow detail-related__arrow--prev"
                onClick={() => setRelatedIdx((i) => Math.max(0, i - 1))}
                disabled={!canPrev}
                aria-label="Trước"
                id="related-prev-btn"
              >
                ‹
              </button>

              <div className="detail-related__track">
                {visibleRelated.map((r, i) => (
                  <Link
                    key={r.id}
                    href={`/menu/item/${r.id}`}
                    className={`detail-related__card ${i === 1 ? "detail-related__card--featured" : ""}`}
                    id={`related-item-${r.id}`}
                  >
                    <div className="detail-related__img-wrap">
                      {r.imageUrl ? (
                        <Image
                          src={r.imageUrl}
                          alt={r.name}
                          fill
                          className="detail-related__img"
                        />
                      ) : (
                        <span className="detail-related__img-placeholder">🍽️</span>
                      )}
                    </div>
                    <div className="detail-related__name">{r.name}</div>
                    <div className="detail-related__price">{formatPrice(r.price)}</div>
                    <div className="detail-related__order">Xem chi tiết +</div>
                  </Link>
                ))}
              </div>

              <button
                className="detail-related__arrow detail-related__arrow--next"
                onClick={() => setRelatedIdx((i) => Math.min(related.length - visibleCount, i + 1))}
                disabled={!canNext}
                aria-label="Tiếp"
                id="related-next-btn"
              >
                ›
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
