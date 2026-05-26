"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { getMenuItems, getCategories } from "@/lib/firebase/menuService";
import type { MenuItemDocument } from "@/types/menu";
import type { CategoryDocument } from "@/types/category";
import Navbar from "@/components/Navbar";

// ─── STATIC FALLBACK DATA ────────────────────────────────────────────────────

const FALLBACK_ITEMS = [
  { id: "f1", name: "Toast Bơ & Trứng Chần", price: 75000, imageUrl: "/food_avocado_toast.png", categoryId: "", isAvailable: true, isDeleted: false, description: "", createdAt: null, updatedAt: null },
  { id: "f2", name: "Yến Mạch Hoa Quả Tươi", price: 55000, imageUrl: "/food_oatmeal.png", categoryId: "", isAvailable: true, isDeleted: false, description: "", createdAt: null, updatedAt: null },
  { id: "f3", name: "Croissant Jambon", price: 65000, imageUrl: "/food_croissant.png", categoryId: "", isAvailable: true, isDeleted: false, description: "", createdAt: null, updatedAt: null },
  { id: "f4", name: "Bánh Chocolate Berry", price: 85000, imageUrl: "/food_cake.png", categoryId: "", isAvailable: true, isDeleted: false, description: "", createdAt: null, updatedAt: null },
  { id: "f5", name: "Cà phê Latte", price: 55000, imageUrl: "/food_latte.png", categoryId: "", isAvailable: true, isDeleted: false, description: "", createdAt: null, updatedAt: null },
  { id: "f6", name: "Iced Latte", price: 60000, imageUrl: "/food_ice_latte.png", categoryId: "", isAvailable: true, isDeleted: false, description: "", createdAt: null, updatedAt: null },
] as MenuItemDocument[];



const WHY_ITEMS = [
  { icon: "☕", title: "Cà phê Đặc Biệt", desc: "Hạt từ các nông trại uy tín, rang và pha chế bởi barista chuyên nghiệp." },
  { icon: "🥗", title: "Món Ăn Tươi Ngon", desc: "Chuẩn bị mỗi ngày từ nguyên liệu tươi, không chất bảo quản." },
  { icon: "🛋️", title: "Không Gian Ấm Cúng", desc: "Nhạc nhẹ, nội thất sang trọng, không gian lý tưởng để làm việc và thư giãn." },
  { icon: "💝", title: "Phục Vụ Tận Tâm", desc: "Đội ngũ thân thiện, luôn chào đón bạn với nụ cười nhiệt tình." },
];

const INFO_CARDS = [
  { title: "Hạt Cà Phê Tinh Tuyển", desc: "Chúng tôi hợp tác với những nông trại cà phê tốt nhất tại Đà Lạt, Buôn Ma Thuột và các vùng nổi tiếng trên thế giới.", cta: "Tìm hiểu thêm", image: "/food_latte.png" },
  { title: "Dessert Như Nghệ Thuật", desc: "Công thức gia truyền và sáng tạo không ngừng, từng chiếc bánh là một tác phẩm nghệ thuật đáng được thưởng thức.", cta: "Xem thực đơn", image: "/food_cake.png" },
  { title: "Không Gian Dành Cho Bạn", desc: "Góc làm việc tiện nghi, Wi-Fi tốc độ cao và không khí yên tĩnh. Lý tưởng cho công việc và học tập.", cta: "Xem không gian", image: "/cafe_interior.png" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function formatPrice(price: number) {
  return price.toLocaleString("vi-VN") + " ₫";
}

function getItemImage(item: MenuItemDocument): string {
  return item.imageUrl || "/food_latte.png";
}

// ─── HOOK: fetch menu data ────────────────────────────────────────────────────

function useMenuData() {
  const [items, setItems] = useState<MenuItemDocument[]>([]);
  const [categories, setCategories] = useState<CategoryDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [menuItems, cats] = await Promise.all([getMenuItems(), getCategories()]);
        if (!cancelled) {
          setItems(menuItems.filter((i) => i.isAvailable));
          setCategories(cats);
        }
      } catch {
        // silent fallback — use static data
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const displayItems = items.length > 0 ? items : FALLBACK_ITEMS;
  const breakfastItems = displayItems.slice(0, 4);
  const featuredItems = displayItems.slice(0, 5);

  return { items: displayItems, breakfastItems, featuredItems, categories, loading };
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────


function HeroSection() {
  return (
    <section className="homepage-hero" id="hero">
      <div className="homepage-hero__content">
        <span className="homepage-hero__badge">✦ Hơn 2.000 khách hàng tin tưởng</span>
        <h1 className="homepage-hero__title">
          Nơi Bình Yên<br />
          <span className="homepage-hero__title--accent">Cho Những</span><br />
          Khoảnh Khắc Quan Trọng
        </h1>
        <p className="homepage-hero__desc">
          Bạn đang vội vã hay muốn gặp gỡ bạn bè? Tại CaféLavka, chúng tôi có cà phê thơm ngon,
          bữa sáng phong phú và những món tráng miệng khiến bạn mỉm cười suốt cả ngày.
        </p>
        <div className="homepage-hero__actions">
          <Link href="#breakfast" className="btn-homepage-primary btn--large">Xem thực đơn →</Link>
          <Link href="#about" className="btn-homepage-ghost btn--large">Về chúng tôi</Link>
        </div>
        <div className="homepage-hero__proof">
          <div className="homepage-hero__avatars">
            {["👩🏻","👨🏼","👩🏽","👨🏻"].map((e, i) => <span key={i} className="homepage-avatar">{e}</span>)}
          </div>
          <div>
            <div className="homepage-hero__proof-stars">★★★★★</div>
            <div className="homepage-hero__proof-text">Hơn 2.000 khách quay lại</div>
          </div>
        </div>
        <div className="homepage-address-chip">
          <span>📍</span>
          <span>123 Nguyễn Huệ, Q.1 · 7:00 – 22:00</span>
        </div>
      </div>

      <div className="homepage-hero__visual">
        <div className="homepage-hero__image-wrap">
          <Image src="/cafe_interior.png" alt="Không gian quán cà phê CaféLavka" fill className="homepage-hero__image" priority />
          <div className="homepage-float-card homepage-float-card--top">
            <span>☕</span>
            <div>
              <div className="homepage-float-card__title">Cà phê Đặc Biệt</div>
              <div className="homepage-float-card__sub">Mới pha · Tươi ngon</div>
            </div>
          </div>
          <div className="homepage-float-card homepage-float-card--bottom">
            <span>⭐</span>
            <div>
              <div className="homepage-float-card__title">Đánh giá 4.9/5</div>
              <div className="homepage-float-card__sub">Trên 1.200 đánh giá</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BreakfastSection({ items, loading }: { items: MenuItemDocument[]; loading: boolean }) {
  const TAGS = ["Bestseller", "Healthy", "Mới", "Dessert", "Đặc biệt", "Phổ biến"];

  return (
    <section className="homepage-section" id="breakfast">
      <div className="homepage-section__row">
        <div className="homepage-section__intro">
          <h2 className="homepage-section__title">Bữa Sáng<br />Cả Ngày</h2>
          <p className="homepage-section__desc">
            Nhẹ nhàng, tươi mát và thật ngon miệng — chọn món bữa sáng yêu thích bất kỳ lúc nào.
          </p>
          <Link href="#featured" className="btn-homepage-ghost" id="see-all-breakfast">Xem tất cả →</Link>
        </div>

        <div className="homepage-food-grid">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="homepage-food-card homepage-food-card--skeleton">
                  <div className="homepage-food-card__img-wrap homepage-skeleton" />
                  <div className="homepage-food-card__body">
                    <div className="homepage-skeleton" style={{ height: 14, borderRadius: 6, marginBottom: 8 }} />
                    <div className="homepage-skeleton" style={{ height: 14, width: "50%", borderRadius: 6 }} />
                  </div>
                </div>
              ))
            : items.map((item, i) => (
                <div key={item.id} className="homepage-food-card" id={`breakfast-item-${item.id}`}>
                  <div className="homepage-food-card__img-wrap">
                    <Image src={getItemImage(item)} alt={item.name} fill className="homepage-food-card__img" />
                    <span className="homepage-food-card__tag">{TAGS[i % TAGS.length]}</span>
                  </div>
                  <div className="homepage-food-card__body">
                    <div className="homepage-food-card__name">{item.name}</div>
                    <div className="homepage-food-card__price">{formatPrice(item.price)}</div>
                  </div>
                </div>
              ))
          }
        </div>
      </div>
    </section>
  );
}

function WhySection() {
  return (
    <section className="homepage-why" id="about">
      <div className="homepage-why__inner">
        <div className="homepage-why__left">
          <h2 className="homepage-section__title" style={{ color: "#1c1008" }}>Vì Sao Khách<br />Chọn Chúng Tôi</h2>
          <div className="homepage-leaf-deco">🌿</div>
        </div>
        <div className="homepage-why__grid">
          {WHY_ITEMS.map((item, i) => (
            <div key={i} className="homepage-why-card" id={`why-card-${i + 1}`}>
              <div className="homepage-why-card__icon">{item.icon}</div>
              <div className="homepage-why-card__title">{item.title}</div>
              <div className="homepage-why-card__desc">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedCarousel({ items, loading }: { items: MenuItemDocument[]; loading: boolean }) {
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
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="homepage-carousel-item">
                <div className="homepage-carousel-item__img-wrap homepage-skeleton" />
                <div className="homepage-carousel-item__body">
                  <div className="homepage-skeleton" style={{ height: 16, borderRadius: 6, marginBottom: 8 }} />
                  <div className="homepage-skeleton" style={{ height: 16, width: "50%", borderRadius: 6 }} />
                </div>
              </div>
            ))
          : getVisible().map((item, i) => (
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
        }
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

function InfoCardsSection() {
  return (
    <section className="homepage-info-section" id="gallery">
      <div className="homepage-info-grid">
        {INFO_CARDS.map((card, i) => (
          <div key={i} className="homepage-info-card" id={`info-card-${i + 1}`}>
            <div className="homepage-info-card__img-wrap">
              <Image src={card.image} alt={card.title} fill className="homepage-info-card__img" />
              <div className="homepage-info-card__overlay" />
            </div>
            <div className="homepage-info-card__body">
              <h3 className="homepage-info-card__title">{card.title}</h3>
              <p className="homepage-info-card__desc">{card.desc}</p>
              <button className="btn-homepage-ghost" id={`info-cta-${i + 1}`}>{card.cta}</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="homepage-newsletter" id="contact">
      <div className="homepage-newsletter__inner">
        <div className="homepage-newsletter__left">
          <div className="homepage-newsletter__plant">🪴</div>
          <div>
            <h2 className="homepage-newsletter__title">Ghé thăm chúng tôi!<br />Luôn chào đón bạn.</h2>
            <p className="homepage-newsletter__desc">
              Đăng ký nhận tin để nhận ưu đãi và phần quà đặc biệt cho cà phê đầu tiên của bạn.
            </p>
          </div>
        </div>
        <div className="homepage-newsletter__right">
          {submitted ? (
            <div className="homepage-newsletter__success">✅ Cảm ơn bạn đã đăng ký! Kiểm tra hộp thư của bạn.</div>
          ) : (
            <form className="homepage-newsletter__form" onSubmit={handleSubmit} id="newsletter-form">
              <input type="email" className="homepage-newsletter__input" placeholder="Email của bạn" value={email} onChange={(e) => setEmail(e.target.value)} required id="newsletter-email" />
              <button type="submit" className="btn-homepage-primary" id="newsletter-submit">Đăng ký</button>
            </form>
          )}
          <div className="homepage-newsletter__socials">
            <a href="#" className="homepage-social-icon" aria-label="Instagram" id="social-instagram">📷</a>
            <a href="#" className="homepage-social-icon" aria-label="TikTok" id="social-tiktok">🎵</a>
            <a href="#" className="homepage-social-icon" aria-label="Zalo" id="social-zalo">💬</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="homepage-footer">
      <div className="homepage-footer__inner">
        <div className="homepage-footer__brand">
          <div className="homepage-logo">
            <span className="homepage-logo__icon">☕</span>
            <div>
              <div className="homepage-logo__name">CaféLavka</div>
              <div className="homepage-logo__sub">quán cà phê thành phố</div>
            </div>
          </div>
          <p className="homepage-footer__brand-desc">© 2024 CaféLavka<br />Mọi quyền được bảo lưu.</p>
        </div>

        <div className="homepage-footer__col">
          <div className="homepage-footer__col-title">Điều hướng</div>
          {[["Menu","#breakfast"],["Bữa sáng","#breakfast"],["Liên hệ","#contact"],["Về chúng tôi","#about"],["Đặt bàn","#contact"]].map(([label, href]) => (
            <Link key={label} href={href} className="homepage-footer__link" id={`footer-${label}`}>{label}</Link>
          ))}
        </div>

        <div className="homepage-footer__col">
          <div className="homepage-footer__col-title">Thư viện ảnh</div>
          {[["Không gian quán","#gallery"],["Đồ uống","#featured"],["Bữa sáng","#breakfast"],["Tráng miệng","#featured"]].map(([label, href]) => (
            <Link key={label} href={href} className="homepage-footer__link" id={`footer-gallery-${label}`}>{label}</Link>
          ))}
        </div>

        <div className="homepage-footer__col">
          <div className="homepage-footer__col-title">Liên hệ</div>
          <div className="homepage-footer__contact-item">📍 123 Nguyễn Huệ, Quận 1, TP.HCM</div>
          <div className="homepage-footer__contact-item">📞 +84 (0) 123-456-789</div>
          <div className="homepage-footer__contact-item">🕐 7:00 – 22:00 (Hàng ngày)</div>
          <div className="homepage-footer__icon-wrap">☕</div>
        </div>
      </div>
    </footer>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { breakfastItems, featuredItems, loading } = useMenuData();

  return (
    <div className="homepage-root">
      <Navbar />
      <main>
        <HeroSection />
        <BreakfastSection items={breakfastItems} loading={loading} />
        <WhySection />
        <FeaturedCarousel items={featuredItems} loading={loading} />
        <InfoCardsSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
}
