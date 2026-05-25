import { z } from "zod";
import type { Timestamp } from "firebase/firestore";

export type UserRole = "admin" | "staff";

export interface User {
  email: string;
  name: string;
  role: UserRole;
  createdAt: Timestamp;
}

export interface UserDocument extends User {
  id: string;
}

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const createStaffSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  role: z.enum(["admin", "staff"]),
});

export type CreateStaffFormValues = z.infer<typeof createStaffSchema>;
