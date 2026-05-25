"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { AUTH_ROUTES } from "@/constants/auth";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, initialized, authError } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!initialized || loading) return;
    if (!user) {
      const loginUrl = authError
        ? `${AUTH_ROUTES.LOGIN}?error=${encodeURIComponent(authError)}`
        : AUTH_ROUTES.LOGIN;
      router.replace(loginUrl);
    }
  }, [user, loading, initialized, authError, router]);

  if (!initialized || loading) {
    return (
      <>
        <div className="cafe-bg"><div className="cafe-bg-blob" /></div>
        <div className="relative z-10 flex min-h-screen items-center justify-center">
          <div className="glass-strong p-8 flex flex-col items-center gap-4" style={{ minWidth: 200 }}>
            <div
              className="flex items-center justify-center rounded-2xl"
              style={{
                width: 48, height: 48,
                background: "linear-gradient(135deg, #d97706, #f59e0b)",
                boxShadow: "0 8px 24px rgba(217,119,6,0.4)",
                fontSize: 24,
              }}
            >
              ☕
            </div>
            <div className="flex items-center gap-2">
              <div
                className="rounded-full"
                style={{
                  width: 8, height: 8,
                  background: "var(--amber)",
                  animation: "pulse 1s infinite",
                  boxShadow: "0 0 8px rgba(217,119,6,0.5)",
                }}
              />
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Đang tải...</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}

export default AuthGuard;
