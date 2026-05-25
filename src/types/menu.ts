import { z } from "zod";
import type { Timestamp } from "firebase/firestore";

export interface MenuItem {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  isAvailable: boolean;
  isDeleted: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface MenuItemDocument extends MenuItem {
  id: string;
}

export const menuItemFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().default(""),
  price: z.coerce.number().positive(),
  categoryId: z.string().min(1),
  isAvailable: z.boolean().default(true),
});

export type MenuItemFormValues = z.infer<typeof menuItemFormSchema>;
