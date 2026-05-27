"use client";

import { useState } from "react";

export default function NewsletterSection() {
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
              <input
                type="email"
                className="homepage-newsletter__input"
                placeholder="Email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                id="newsletter-email"
              />
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
