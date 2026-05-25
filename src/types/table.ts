import { z } from "zod";
import type { Timestamp } from "firebase/firestore";

export type TableStatus = "available" | "occupied";

export interface Table {
  tableNumber: number;
  name: string;
  status: TableStatus;
  qrCodeUrl: string;
  createdAt: Timestamp;
}

export interface TableDocument extends Table {
  id: string;
}

export const tableFormSchema = z.object({
  tableNumber: z.coerce.number().int().positive(),
  name: z.string().min(1),
  status: z.enum(["available", "occupied"]).default("available"),
});

export type TableFormValues = z.infer<typeof tableFormSchema>;
