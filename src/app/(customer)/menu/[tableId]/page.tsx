import { notFound } from "next/navigation";
import { getTable } from "@/lib/firebase/tableService";
import { getCategories, getMenuItems } from "@/lib/firebase/menuService";
import MenuCategory from "@/components/customer/MenuCategory";
import CartDrawer from "@/components/customer/CartDrawer";
import type { Metadata } from "next";

interface Props {
  params: {
    tableId: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const table = await getTable(params.tableId);
  return {
    title: table ? `Menu Bàn ${table.tableNumber} - Cafe Manager` : "Menu - Cafe Manager",
  };
}

export const revalidate = 60; // ISR for menu pages

export default async function CustomerMenuPage({ params }: Props) {
  const table = await getTable(params.tableId);
  if (!table) {
    notFound();
  }

  // Fetch categories and items
  const [categories, items] = await Promise.all([
    getCategories(),
    getMenuItems(),
  ]);

  // Filter available items only
  const availableItems = items.filter(item => item.isAvailable && !item.isDeleted);

  return (
    <>
      <div className="cafe-bg"><div className="cafe-bg-blob" /></div>
      <main className="relative z-10 min-h-screen pb-32">
        <header className="glass sticky top-0 z-40 mx-4 mt-4 mb-6 px-5 py-3 flex items-center justify-between" style={{ borderRadius: 16 }}>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{
                width: 36, height: 36,
                background: "linear-gradient(135deg, #d97706, #f59e0b)",
                boxShadow: "0 4px 12px rgba(217,119,6,0.35)",
                fontSize: 18,
              }}
            >
              ☕
            </div>
            <div>
              <span
                className="font-bold block"
                style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: "var(--text-primary)" }}
              >
                Cafe Menu
              </span>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                Bàn {table.tableNumber} {table.name ? `(${table.name})` : ""}
              </span>
            </div>
          </div>
        </header>

        <div className="mx-4 max-w-2xl md:mx-auto">
          <MenuCategory categories={categories} items={availableItems} tableId={table.id} />
        </div>

        <CartDrawer tableId={table.id} tableNumber={table.tableNumber} />
      </main>
    </>
  );
}
