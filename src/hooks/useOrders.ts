import { useEffect, useState } from "react";
import { subscribeActiveOrders } from "@/lib/firebase/orderService";
import type { OrderDocument } from "@/types/order";

export function useOrders() {
  const [orders, setOrders] = useState<OrderDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeActiveOrders((data) => {
      setOrders(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { orders, loading };
}
