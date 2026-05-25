"use client";

import { useEffect, useState } from "react";
import {
  subscribeCategories,
  subscribeMenuItems,
} from "@/lib/firebase/menuService";
import type { CategoryDocument } from "@/types/category";
import type { MenuItemDocument } from "@/types/menu";

export function useMenuItems() {
  const [menuItems, setMenuItems] = useState<MenuItemDocument[]>([]);
  const [categories, setCategories] = useState<CategoryDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let itemsReady = false;
    let categoriesReady = false;

    function updateLoadingState() {
      if (itemsReady && categoriesReady) {
        setLoading(false);
      }
    }

    const unsubscribeItems = subscribeMenuItems((items) => {
      setMenuItems(items);
      itemsReady = true;
      updateLoadingState();
    });

    const unsubscribeCategories = subscribeCategories((data) => {
      setCategories(data);
      categoriesReady = true;
      updateLoadingState();
    });

    return () => {
      unsubscribeItems();
      unsubscribeCategories();
    };
  }, []);

  return {
    menuItems,
    categories,
    loading,
    error,
    setError,
  };
}
