import {
  signInWithEmailAndPassword,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { clearSessionCookie, setSessionCookie } from "@/lib/firebase/session";
import type { AuthUser } from "@/stores/useAuthStore";
import type { User } from "@/types/user";

const USERS_COLLECTION = "users";

export async function fetchUserProfile(uid: string): Promise<AuthUser | null> {
  const snapshot = await getDoc(doc(db, USERS_COLLECTION, uid));

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data() as User;
  const role = data.role;

  if (role !== "admin" && role !== "staff") {
    return null;
  }

  return {
    uid,
    email: data.email,
    name: data.name,
    role,
  };
}

async function createUserProfile(
  firebaseUser: FirebaseUser
): Promise<AuthUser | null> {
  const email = firebaseUser.email ?? "";
  const name =
    firebaseUser.displayName ?? email.split("@")[0] ?? "Admin";

  await setDoc(doc(db, USERS_COLLECTION, firebaseUser.uid), {
    email,
    name,
    role: "admin",
    createdAt: serverTimestamp(),
  });

  return fetchUserProfile(firebaseUser.uid);
}

export async function ensureUserProfile(
  firebaseUser: FirebaseUser
): Promise<AuthUser | null> {
  const existing = await fetchUserProfile(firebaseUser.uid);

  if (existing) {
    return existing;
  }

  try {
    return await createUserProfile(firebaseUser);
  } catch {
    return null;
  }
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthUser> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const profile = await ensureUserProfile(credential.user);

  if (!profile) {
    await signOut(auth);
    clearSessionCookie();
    throw new Error(`USER_NOT_FOUND:${credential.user.uid}`);
  }

  await setSessionCookie(credential.user);
  return {
    ...profile,
    email: credential.user.email ?? profile.email,
  };
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
  clearSessionCookie();
}

export async function resolveAuthUser(
  firebaseUser: FirebaseUser
): Promise<AuthUser | null> {
  const profile = await ensureUserProfile(firebaseUser);

  if (!profile) {
    return null;
  }

  await setSessionCookie(firebaseUser);

  return {
    ...profile,
    email: firebaseUser.email ?? profile.email,
  };
}
