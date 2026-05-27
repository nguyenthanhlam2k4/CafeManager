import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { cache } from "react";
import { db } from "@/lib/firebase/config";
import type { TableDocument, TableFormValues } from "@/types/table";

const TABLES_COLLECTION = "tables";

function mapTableDoc(
  id: string,
  data: Record<string, unknown>
): TableDocument {
  return {
    id,
    tableNumber: data.tableNumber as number,
    name: data.name as string,
    status: data.status as "available" | "occupied",
    qrCodeUrl: (data.qrCodeUrl as string) ?? "",
    createdAt: data.createdAt as TableDocument["createdAt"],
  };
}

export async function getTables(): Promise<TableDocument[]> {
  const snapshot = await getDocs(
    query(collection(db, TABLES_COLLECTION), orderBy("tableNumber", "asc"))
  );

  return snapshot.docs.map((item) => mapTableDoc(item.id, item.data()));
}

export const getTable = cache(async (tableId: string): Promise<TableDocument | null> => {
  const docRef = doc(db, TABLES_COLLECTION, tableId);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return null;
  }

  return mapTableDoc(snapshot.id, snapshot.data());
});

export function subscribeTables(
  callback: (tables: TableDocument[]) => void
): Unsubscribe {
  const tablesQuery = query(
    collection(db, TABLES_COLLECTION),
    orderBy("tableNumber", "asc")
  );

  return onSnapshot(tablesQuery, (snapshot) => {
    const tables = snapshot.docs.map((item) =>
      mapTableDoc(item.id, item.data())
    );
    callback(tables);
  });
}

export async function createTable(data: TableFormValues): Promise<string> {
  const docRef = await addDoc(collection(db, TABLES_COLLECTION), {
    tableNumber: data.tableNumber,
    name: data.name,
    status: data.status,
    qrCodeUrl: "",
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function updateTable(
  tableId: string,
  data: Partial<TableFormValues> & { qrCodeUrl?: string }
): Promise<void> {
  const payload: Record<string, unknown> = { ...data };
  await updateDoc(doc(db, TABLES_COLLECTION, tableId), payload);
}

export async function deleteTable(tableId: string): Promise<void> {
  await deleteDoc(doc(db, TABLES_COLLECTION, tableId));
}
