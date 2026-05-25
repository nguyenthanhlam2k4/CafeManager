import { useEffect, useState } from "react";
import { subscribeOrder } from "@/lib/firebase/orderService";
import type { OrderDocument } from "@/types/order";

export function useOrder(orderId: string) {
  const [order, setOrder] = useState<OrderDocument | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeOrder(orderId, (data) => {
      setOrder(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [orderId]);

  return { order, loading };
}
