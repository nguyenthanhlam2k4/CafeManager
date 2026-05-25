import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Unsubscribe,
} from "firebase/firestore";
import imageCompression from "browser-image-compression";
import { db } from "@/lib/firebase/config";
import { DEFAULT_CATEGORIES } from "@/constants/menu";
import type { CategoryDocument, CategoryFormValues } from "@/types/category";
import type { MenuItemDocument, MenuItemFormValues } from "@/types/menu";

const CATEGORIES_COLLECTION = "categories";
const MENU_ITEMS_COLLECTION = "menuItems";

const MAX_IMAGE_SIZE_MB = 0.5;

function mapCategoryDoc(
  id: string,
  data: Record<string, unknown>
): CategoryDocument {
  return {
    id,
    name: data.name as string,
    order: data.order as number,
    createdAt: data.createdAt as CategoryDocument["createdAt"],
  };
}

function mapMenuItemDoc(
  id: string,
  data: Record<string, unknown>
): MenuItemDocument {
  return {
    id,
    name: data.name as string,
    description: data.description as string,
    price: data.price as number,
    imageUrl: (data.imageUrl as string) ?? "",
    categoryId: data.categoryId as string,
    isAvailable: data.isAvailable as boolean,
    isDeleted: data.isDeleted as boolean,
    createdAt: data.createdAt as MenuItemDocument["createdAt"],
    updatedAt: data.updatedAt as MenuItemDocument["updatedAt"],
  };
}

export async function getCategories(): Promise<CategoryDocument[]> {
  const snapshot = await getDocs(
    query(
      collection(db, CATEGORIES_COLLECTION),
      orderBy("order", "asc")
    )
  );

  return snapshot.docs.map((item) =>
    mapCategoryDoc(item.id, item.data())
  );
}

export function subscribeCategories(
  callback: (categories: CategoryDocument[]) => void
): Unsubscribe {
  const categoriesQuery = query(
    collection(db, CATEGORIES_COLLECTION),
    orderBy("order", "asc")
  );

  return onSnapshot(categoriesQuery, (snapshot) => {
    const categories = snapshot.docs.map((item) =>
      mapCategoryDoc(item.id, item.data())
    );
    callback(categories);
  });
}

export async function createCategory(
  data: CategoryFormValues
): Promise<string> {
  const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), {
    name: data.name,
    order: data.order,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function updateCategory(
  categoryId: string,
  data: CategoryFormValues
): Promise<void> {
  await updateDoc(doc(db, CATEGORIES_COLLECTION, categoryId), {
    name: data.name,
    order: data.order,
  });
}

export async function deleteCategory(categoryId: string): Promise<void> {
  await deleteDoc(doc(db, CATEGORIES_COLLECTION, categoryId));
}

export async function seedDefaultCategories(): Promise<void> {
  const existing = await getCategories();

  if (existing.length > 0) {
    return;
  }

  await Promise.all(
    DEFAULT_CATEGORIES.map((category) => createCategory(category))
  );
}

export async function getMenuItems(): Promise<MenuItemDocument[]> {
  const snapshot = await getDocs(
    query(
      collection(db, MENU_ITEMS_COLLECTION),
      where("isDeleted", "==", false),
      orderBy("createdAt", "desc")
    )
  );

  return snapshot.docs.map((item) =>
    mapMenuItemDoc(item.id, item.data())
  );
}

export function subscribeMenuItems(
  callback: (items: MenuItemDocument[]) => void
): Unsubscribe {
  const menuQuery = query(
    collection(db, MENU_ITEMS_COLLECTION),
    where("isDeleted", "==", false),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(menuQuery, (snapshot) => {
    const items = snapshot.docs.map((item) =>
      mapMenuItemDoc(item.id, item.data())
    );
    callback(items);
  });
}

export async function createMenuItem(
  data: MenuItemFormValues,
  imageUrl = ""
): Promise<string> {
  const docRef = await addDoc(collection(db, MENU_ITEMS_COLLECTION), {
    name: data.name,
    description: data.description ?? "",
    price: data.price,
    imageUrl,
    categoryId: data.categoryId,
    isAvailable: data.isAvailable,
    isDeleted: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function updateMenuItem(
  itemId: string,
  data: MenuItemFormValues,
  imageUrl?: string
): Promise<void> {
  const payload: Record<string, unknown> = {
    name: data.name,
    description: data.description ?? "",
    price: data.price,
    categoryId: data.categoryId,
    isAvailable: data.isAvailable,
    updatedAt: serverTimestamp(),
  };

  if (imageUrl !== undefined) {
    payload.imageUrl = imageUrl;
  }

  await updateDoc(doc(db, MENU_ITEMS_COLLECTION, itemId), payload);
}

export async function softDeleteMenuItem(itemId: string): Promise<void> {
  await updateDoc(doc(db, MENU_ITEMS_COLLECTION, itemId), {
    isDeleted: true,
    updatedAt: serverTimestamp(),
  });
}

export async function uploadMenuItemImage(
  itemId: string,
  file: File
): Promise<string> {
  const compressed = await imageCompression(file, {
    maxSizeMB: MAX_IMAGE_SIZE_MB,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
  });

  const formData = new FormData();
  formData.append("file", compressed);
  formData.append("upload_preset", "ml_default");

  const cloudName = "dydkxcdcd";
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload image to Cloudinary");
  }

  const data = await response.json();
  return data.secure_url;
}
