import { getCategories, getMenuItems } from "@/lib/firebase/menuService";
import PublicMenuClient from "./PublicMenuClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thực Đơn - CaféLavka",
  description: "Xem toàn bộ thực đơn cà phê, đồ ăn và tráng miệng tại CaféLavka",
};

export const revalidate = 60;

export default async function PublicMenuPage() {
  const [categories, items] = await Promise.all([
    getCategories(),
    getMenuItems(),
  ]);

  const availableItems = items.filter((i) => i.isAvailable && !i.isDeleted);

  // Fully serialize to plain JSON — strips all Firestore Timestamp objects
  const safeItems = JSON.parse(JSON.stringify(availableItems));
  const safeCategories = JSON.parse(JSON.stringify(categories));


  return (
    <PublicMenuClient categories={safeCategories} items={safeItems} />
  );
}

