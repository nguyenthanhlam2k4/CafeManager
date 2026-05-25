import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MenuItemDocument } from "@/types/menu";

export interface CartItem {
  menuItem: MenuItemDocument;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  tableId: string | null;
  setTableId: (id: string) => void;
  addItem: (menuItem: MenuItemDocument) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      tableId: null,

      setTableId: (id) => set({ tableId: id }),

      addItem: (menuItem) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.menuItem.id === menuItem.id
          );

          if (existingItemIndex >= 0) {
            // Item exists, increment quantity
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += 1;
            return { items: newItems };
          } else {
            // New item
            return { items: [...state.items, { menuItem, quantity: 1 }] };
          }
        });
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.menuItem.id !== itemId),
        }));
      },

      updateQuantity: (itemId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.menuItem.id !== itemId),
            };
          }

          return {
            items: state.items.map((item) =>
              item.menuItem.id === itemId ? { ...item, quantity } : item
            ),
          };
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        const state = get();
        return state.items.reduce(
          (total, item) => total + item.menuItem.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "cafe-cart-storage",
      // Only persist items and tableId, functions are excluded automatically
    }
  )
);
