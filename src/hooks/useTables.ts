import { useEffect, useState } from "react";
import { subscribeTables } from "@/lib/firebase/tableService";
import type { TableDocument } from "@/types/table";

export function useTables() {
  const [tables, setTables] = useState<TableDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeTables((data) => {
      setTables(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { tables, loading };
}
