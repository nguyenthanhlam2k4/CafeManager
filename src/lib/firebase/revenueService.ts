import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { OrderDocument } from "@/types/order";

const ORDERS_COLLECTION = "orders";

export async function getCompletedOrders(startDate?: Date): Promise<OrderDocument[]> {
  const constraints = [
    where("status", "==", "completed"),
    orderBy("createdAt", "desc"),
  ];

  if (startDate) {
    constraints.push(where("createdAt", ">=", startDate));
  }

  const q = query(collection(db, ORDERS_COLLECTION), ...constraints);

  const snapshot = await getDocs(q);

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      tableId: data.tableId,
      tableNumber: data.tableNumber,
      customerName: data.customerName,
      note: data.note,
      status: data.status as "completed",
      items: data.items,
      totalAmount: data.totalAmount,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  });
}
