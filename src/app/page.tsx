import Image from "next/image";
import Link from "next/link";
import { getMenuItems } from "@/lib/firebase/menuService";
import type { MenuItemDocument } from "@/types/menu";
import Navbar from "@/components/Navbar";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import NewsletterSection from "@/components/NewsletterSection";

// ─── STATIC FALLBACK DATA ────────────────────────────────────────────────────

const FALLBACK_ITEMS = [
  { id: "f1", name: "Toast Bơ & Trứng Chần", price: 75000, imageUrl: "/food_avocado_toast.png", categoryId: "", isAvailable: true, isDeleted: false, description: "", createdAt: null, updatedAt: null },
  { id: "f2", name: "Yến Mạch Hoa Quả Tươi", price: 55000, imageUrl: "/food_oatmeal.png", categoryId: "", isAvailable: true, isDeleted: false, description: "", createdAt: null, updatedAt: null },
  { id: "f3", name: "Croissant Jambon", price: 65000, imageUrl: "/food_croissant.png", categoryId: "", isAvailable: true, isDeleted: false, description: "", createdAt: null, updatedAt: null },
  { id: "f4", name: "Bánh Chocolate Berry", price: 85000, imageUrl: "/food_cake.png", categoryId: "", isAvailable: true, isDeleted: false, description: "", createdAt: null, updatedAt: null },
  { id: "f5", name: "Cà phê Latte", price: 55000, imageUrl: "/food_latte.png", categoryId: "", isAvailable: true, isDeleted: false, description: "", createdAt: null, updatedAt: null },
  { id: "f6", name: "Iced Latte", price: 60000, imageUrl: "/food_ice_latte.png", categoryId: "", isAvailable: true, isDeleted: false, description: "", createdAt: null, updatedAt: null },
] as unknown as MenuItemDocument[];

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

function BreakfastSection({ items }: { items: MenuItemDocument[] }) {
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
          {items.map((item, i) => (
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
          ))}
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

export const revalidate = 60;

export default async function HomePage() {
  let menuItems: MenuItemDocument[] = [];
  try {
    menuItems = await getMenuItems();
  } catch (error) {
    console.error("Failed to fetch menu items on server:", error);
  }

  const items = menuItems.filter((i) => i.isAvailable);
  const displayItems = items.length > 0 ? items : FALLBACK_ITEMS;
  const breakfastItems = displayItems.slice(0, 4);
  const featuredItems = displayItems.slice(0, 5);

  const safeFeaturedItems = JSON.parse(JSON.stringify(featuredItems));

  return (
    <div className="homepage-root">
      <Navbar />
      <main>
        <HeroSection />
        <BreakfastSection items={breakfastItems} />
        <WhySection />
        <FeaturedCarousel items={safeFeaturedItems} />
        <InfoCardsSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
}
