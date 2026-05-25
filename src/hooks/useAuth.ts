"use client";

import { useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { resolveAuthUser } from "@/lib/firebase/authService";
import { clearSessionCookie } from "@/lib/firebase/session";
import { AUTH_ERRORS } from "@/constants/auth";
import { useAuthStore } from "@/stores/useAuthStore";

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const initialized = useAuthStore((state) => state.initialized);
  const authError = useAuthStore((state) => state.authError);
  const setSession = useAuthStore((state) => state.setSession);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setInitialized = useAuthStore((state) => state.setInitialized);
  const setAuthError = useAuthStore((state) => state.setAuthError);
  const reset = useAuthStore((state) => state.reset);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        reset();
        clearSessionCookie();
        setLoading(false);
        setInitialized(true);
        return;
      }

      setLoading(true);
      setAuthError(null);

      try {
        const profile = await resolveAuthUser(firebaseUser);

        if (!profile) {
          const message = AUTH_ERRORS.USER_NOT_FOUND_UID(firebaseUser.uid);
          setAuthError(message);
          await signOut(auth);
          reset();
          clearSessionCookie();
          return;
        }

        setSession(profile);
      } catch {
        setAuthError(AUTH_ERRORS.GENERIC);
        await signOut(auth);
        reset();
        clearSessionCookie();
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    });

    return () => unsubscribe();
  }, [reset, setAuthError, setInitialized, setLoading, setSession]);

  return {
    user,
    loading,
    initialized,
    authError,
    isAuthenticated: Boolean(user),
  };
}
