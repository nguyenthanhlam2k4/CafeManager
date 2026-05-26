import { notFound } from "next/navigation";
import { getTable } from "@/lib/firebase/tableService";
import { getCategories, getMenuItems } from "@/lib/firebase/menuService";
import MenuCategory from "@/components/customer/MenuCategory";
import CartDrawer from "@/components/customer/CartDrawer";
import type { Metadata } from "next";

interface Props {
  params: { tableId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const table = await getTable(params.tableId);
  return {
    title: table ? `Menu Bàn ${table.tableNumber} - CaféLavka` : "Menu - CaféLavka",
    description: "Xem thực đơn và đặt món tại bàn",
  };
}

export const revalidate = 60;

export default async function CustomerMenuPage({ params }: Props) {
  const table = await getTable(params.tableId);
  if (!table) notFound();

  const [categories, items] = await Promise.all([
    getCategories(),
    getMenuItems(),
  ]);

  const availableItems = items.filter((i) => i.isAvailable && !i.isDeleted);

  return (
    <div className="menu-root">
      <div className="menu-bg" />

      <header className="menu-topbar" id="menu-topbar">
        <div className="menu-topbar__inner">
          <div className="menu-topbar__brand">
            <span className="menu-topbar__icon">☕</span>
            <div>
              <span className="menu-topbar__name">CaféLavka</span>
              <span className="menu-topbar__table">
                Bàn {table.tableNumber}{table.name ? ` · ${table.name}` : ""}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="menu-main">
        <MenuCategory categories={categories} items={availableItems} tableId={table.id} />
      </main>

      <CartDrawer tableId={table.id} tableNumber={table.tableNumber} />
    </div>
  );
}
