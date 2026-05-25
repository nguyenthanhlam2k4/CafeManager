import { z } from "zod";
import type { Timestamp } from "firebase/firestore";

export type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export interface OrderItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  tableId: string;
  tableNumber: number;
  customerName?: string;
  note?: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface OrderDocument extends Order {
  id: string;
}

export const placeOrderSchema = z.object({
  customerName: z.string().optional(),
  note: z.string().optional(),
});

export type PlaceOrderFormValues = z.infer<typeof placeOrderSchema>;

export const ACTIVE_ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "preparing",
  "ready",
];
