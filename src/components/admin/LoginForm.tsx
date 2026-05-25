"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signInWithEmail } from "@/lib/firebase/authService";
import { useAuthStore } from "@/stores/useAuthStore";
import { AUTH_ERRORS, AUTH_LABELS, AUTH_ROUTES } from "@/constants/auth";
import { loginSchema, type LoginFormValues } from "@/types/user";

function getLoginErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) return AUTH_ERRORS.GENERIC;
  const code = (error as Error & { code?: string }).code;
  if (code === "auth/invalid-credential" || code === "auth/wrong-password") return AUTH_ERRORS.INVALID_CREDENTIALS;
  if (error.message.startsWith("USER_NOT_FOUND:")) {
    const uid = error.message.split(":")[1] ?? "";
    return uid ? `${AUTH_ERRORS.USER_NOT_FOUND} ${AUTH_ERRORS.USER_NOT_FOUND_UID(uid)}` : AUTH_ERRORS.USER_NOT_FOUND;
  }
  if (error.message === "UNAUTHORIZED_ROLE") return AUTH_ERRORS.UNAUTHORIZED_ROLE;
  return AUTH_ERRORS.GENERIC;
}

function LoginForm() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginFormValues) {
    setSubmitError(null);
    try {
      const user = await signInWithEmail(values.email, values.password);
      setSession(user);
      router.replace(AUTH_ROUTES.MENU);
    } catch (error) {
      setSubmitError(getLoginErrorMessage(error));
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="glass-strong fade-in-up w-full max-w-sm p-8 space-y-5"
      style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}
    >
      {/* Logo & Title */}
      <div className="text-center space-y-2">
        <div
          className="mx-auto mb-3 flex items-center justify-center rounded-2xl"
          style={{
            width: 56, height: 56,
            background: "linear-gradient(135deg, #d97706, #f59e0b)",
            boxShadow: "0 8px 24px rgba(217,119,6,0.4)",
          }}
        >
          <span style={{ fontSize: 26 }}>☕</span>
        </div>
        <h1
          className="font-bold tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: "var(--text-primary)" }}
        >
          {AUTH_LABELS.LOGIN_TITLE}
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          {AUTH_LABELS.LOGIN_SUBTITLE}
        </p>
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="email" className="glass-label">{AUTH_LABELS.EMAIL}</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="admin@cafe.com"
          className="glass-input"
          {...register("email")}
        />
        {errors.email && <p style={{ fontSize: 12, color: "#fca5a5" }}>{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label htmlFor="password" className="glass-label">{AUTH_LABELS.PASSWORD}</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          className="glass-input"
          {...register("password")}
        />
        {errors.password && <p style={{ fontSize: 12, color: "#fca5a5" }}>{errors.password.message}</p>}
      </div>

      {/* Error */}
      {submitError && (
        <div
          className="rounded-xl px-4 py-3"
          style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5", fontSize: 13 }}
        >
          {submitError}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-amber w-full"
        style={{ padding: "12px 20px", fontSize: 15 }}
      >
        {isSubmitting ? AUTH_LABELS.SUBMITTING : AUTH_LABELS.SUBMIT}
      </button>
    </form>
  );
}

export default LoginForm;
