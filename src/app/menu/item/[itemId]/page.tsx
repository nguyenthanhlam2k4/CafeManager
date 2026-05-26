import { notFound } from "next/navigation";
import { getMenuItemById, getMenuItems, getCategories } from "@/lib/firebase/menuService";
import MenuItemDetailClient from "./MenuItemDetailClient";
import type { Metadata } from "next";

interface Props {
  params: { itemId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await getMenuItemById(params.itemId);
  return {
    title: item ? `${item.name} - CaféLavka` : "Món ăn - CaféLavka",
    description: item?.description || "Xem chi tiết món ăn tại CaféLavka",
  };
}

export const revalidate = 60;

export default async function MenuItemDetailPage({ params }: Props) {
  const [item, allItems, categories] = await Promise.all([
    getMenuItemById(params.itemId),
    getMenuItems(),
    getCategories(),
  ]);

  if (!item || item.isDeleted || !item.isAvailable) notFound();

  const related = allItems
    .filter((i) => i.id !== item.id && i.isAvailable && !i.isDeleted)
    .slice(0, 6);

  const category = categories.find((c) => c.id === item.categoryId);

  return (
    <MenuItemDetailClient
      item={JSON.parse(JSON.stringify(item))}
      related={JSON.parse(JSON.stringify(related))}
      categoryName={category?.name ?? ""}
    />
  );
}
