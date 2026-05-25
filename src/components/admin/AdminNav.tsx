"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { signOutUser } from "@/lib/firebase/authService";
import { useAuthStore } from "@/stores/useAuthStore";
import { AUTH_LABELS, AUTH_ROUTES } from "@/constants/auth";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "⊞" },
  { href: "/admin/menu", label: "Quản lý Menu", icon: "☰" },
  { href: "/admin/tables", label: "Quản lý Bàn", icon: "🪑" },
  { href: "/admin/revenue", label: "Doanh thu", icon: "📊" },
] as const;

function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const reset = useAuthStore((state) => state.reset);

  async function handleLogout() {
    await signOutUser();
    reset();
    router.replace(AUTH_ROUTES.LOGIN);
  }

  return (
    <header
      className="glass mb-6 flex items-center justify-between px-5 py-3"
      style={{ borderRadius: 14 }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center rounded-xl"
          style={{
            width: 36, height: 36,
            background: "linear-gradient(135deg, #d97706, #f59e0b)",
            boxShadow: "0 4px 12px rgba(217,119,6,0.35)",
            fontSize: 18,
          }}
        >
          ☕
        </div>
        <span
          className="font-bold hidden sm:block"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "var(--text-primary)" }}
        >
          Cafe Manager
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex items-center gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                background: isActive ? "rgba(245,158,11,0.18)" : "transparent",
                color: isActive ? "var(--amber)" : "var(--text-secondary)",
                border: isActive ? "1px solid rgba(245,158,11,0.3)" : "1px solid transparent",
                fontSize: 13,
              }}
            >
              <span>{item.icon}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User & logout */}
      <div className="flex items-center gap-3">
        {user && (
          <span
            className="hidden md:block text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            {user.name}
          </span>
        )}
        <button
          type="button"
          onClick={handleLogout}
          className="btn-ghost"
          style={{ padding: "6px 14px", fontSize: 12 }}
        >
          {AUTH_LABELS.LOGOUT}
        </button>
      </div>
    </header>
  );
}

export default AdminNav;
