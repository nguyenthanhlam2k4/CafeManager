import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { OrderDocument, OrderStatus } from "@/types/order";

const ORDERS_COLLECTION = "orders";

export async function createOrder(data: Omit<OrderDocument, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // Cập nhật trạng thái bàn sang "Đang sử dụng" (occupied)
  const tableRef = doc(db, "tables", data.tableId);
  await updateDoc(tableRef, { status: "occupied" });

  return docRef.id;
}

export async function getOrder(orderId: string): Promise<OrderDocument | null> {
  const docRef = doc(db, ORDERS_COLLECTION, orderId);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();
  
  return {
    id: snapshot.id,
    tableId: data.tableId,
    tableNumber: data.tableNumber,
    customerName: data.customerName,
    note: data.note,
    status: data.status as OrderStatus,
    items: data.items,
    totalAmount: data.totalAmount,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

export function subscribeActiveOrders(
  callback: (orders: OrderDocument[]) => void
): Unsubscribe {
  // Active orders are those not completed and not cancelled
  const ordersQuery = query(
    collection(db, ORDERS_COLLECTION),
    where("status", "in", ["pending", "preparing", "ready"]),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(ordersQuery, (snapshot) => {
    const orders = snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        tableId: data.tableId,
        tableNumber: data.tableNumber,
        customerName: data.customerName,
        note: data.note,
        status: data.status as OrderStatus,
        items: data.items,
        totalAmount: data.totalAmount,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    });
    callback(orders);
  });
}

export function subscribeOrder(
  orderId: string,
  callback: (order: OrderDocument | null) => void
): Unsubscribe {
  const docRef = doc(db, ORDERS_COLLECTION, orderId);

  return onSnapshot(docRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback(null);
      return;
    }

    const data = snapshot.data();
    callback({
      id: snapshot.id,
      tableId: data.tableId,
      tableNumber: data.tableNumber,
      customerName: data.customerName,
      note: data.note,
      status: data.status as OrderStatus,
      items: data.items,
      totalAmount: data.totalAmount,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  });
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<void> {
  const docRef = doc(db, ORDERS_COLLECTION, orderId);
  await updateDoc(docRef, {
    status,
    updatedAt: serverTimestamp(),
  });
}
