import { create } from "zustand";
import type { UserRole } from "@/types/user";

export interface AuthUser {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  initialized: boolean;
  authError: string | null;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  setAuthError: (authError: string | null) => void;
  setSession: (user: AuthUser) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  initialized: false,
  authError: null,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setInitialized: (initialized) => set({ initialized }),
  setAuthError: (authError) => set({ authError }),
  setSession: (user) =>
    set({
      user,
      loading: false,
      initialized: true,
      authError: null,
    }),
  reset: () =>
    set({
      user: null,
      loading: false,
      initialized: true,
      authError: null,
    }),
}));
