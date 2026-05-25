"use client";

import { useSearchParams } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";

function LoginPageContent() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");

  return (
    <>
      <div className="cafe-bg">
        <div className="cafe-bg-blob" />
      </div>
      <main
        className="relative z-10 flex min-h-screen items-center justify-center p-4"
        style={{ background: "transparent" }}
      >
        <div className="w-full max-w-sm space-y-3">
          {urlError && (
            <div
              className="rounded-xl px-4 py-3 fade-in-up"
              style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5", fontSize: 13 }}
            >
              {decodeURIComponent(urlError)}
            </div>
          )}
          <LoginForm />
        </div>
      </main>
    </>
  );
}

export default LoginPageContent;
