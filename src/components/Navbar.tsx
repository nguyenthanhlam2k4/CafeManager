"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "Menu", href: "/menu" },
  { label: "Bữa sáng", href: "/#breakfast" },
  { label: "Về chúng tôi", href: "/#about" },
  { label: "Thư viện ảnh", href: "/#gallery" },
  { label: "Liên hệ", href: "/#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header className={`homepage-nav ${scrolled ? "homepage-nav--scrolled" : ""}`}>
      <div className="homepage-nav__inner">
        <Link href="/" className="homepage-logo">
          <span className="homepage-logo__icon">☕</span>
          <div>
            <div className="homepage-logo__name">CaféLavka</div>
            <div className="homepage-logo__sub">quán cà phê thành phố</div>
          </div>
        </Link>

        <nav className="homepage-nav__links">
          {NAV_LINKS.map((l) => (
            <Link key={l.label} href={l.href} className="homepage-nav__link">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="homepage-nav__cta">
          <Link href="/admin/login" className="btn-homepage-outline">Quản lý</Link>
          <Link href="/#contact" className="btn-homepage-primary">Đặt bàn ngay</Link>
        </div>

        <button
          className="homepage-burger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          id="mobile-menu-btn"
        >
          <span /><span /><span />
        </button>
      </div>

      {menuOpen && (
        <div className="homepage-mobile-menu">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="homepage-mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/#contact" className="btn-homepage-primary" style={{ marginTop: 8 }}>
            Đặt bàn ngay
          </Link>
        </div>
      )}
    </header>
  );
}
