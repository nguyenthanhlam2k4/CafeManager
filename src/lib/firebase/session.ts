import type { User as FirebaseUser } from "firebase/auth";
import { AUTH_TOKEN_COOKIE } from "@/constants/auth";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24;

export async function setSessionCookie(
  firebaseUser: FirebaseUser
): Promise<void> {
  const token = await firebaseUser.getIdToken();
  document.cookie = `${AUTH_TOKEN_COOKIE}=${token}; path=/; max-age=${SESSION_MAX_AGE_SECONDS}; SameSite=Lax`;
}

export function clearSessionCookie(): void {
  document.cookie = `${AUTH_TOKEN_COOKIE}=; path=/; max-age=0`;
}
