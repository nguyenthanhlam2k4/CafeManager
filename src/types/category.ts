import { z } from "zod";
import type { Timestamp } from "firebase/firestore";

export interface Category {
  name: string;
  order: number;
  createdAt: Timestamp;
}

export interface CategoryDocument extends Category {
  id: string;
}

export const categoryFormSchema = z.object({
  name: z.string().min(1),
  order: z.coerce.number().int().min(0),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
