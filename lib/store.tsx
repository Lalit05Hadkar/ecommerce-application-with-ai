"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { insforge } from "./insforge";
import { useAuth } from "./auth";
import type { Product } from "./types";

export interface CartLine {
  product: Product;
  size: string;
  qty: number;
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  mounted: boolean;
  add: (product: Product, size: string, qty?: number) => void;
  remove: (productId: string, size: string) => void;
  updateQty: (productId: string, size: string, qty: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "velour-cart";

interface CartRow {
  product_id: string;
  size: string;
  quantity: number | string;
}

interface ProductRow {
  id: string;
  name: string;
  category: "women" | "men";
  subcategory: string;
  price: number | string;
  compare_at_price: number | string | null;
  description: string | null;
  sizes: string[] | null;
  images: string[] | null;
  featured: boolean;
  is_new: boolean;
  trending: boolean;
}

function mapProduct(row: ProductRow): Product {
  const compareAt =
    row.compare_at_price == null ? undefined : Number(row.compare_at_price);
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    subcategory: row.subcategory,
    price: Number(row.price),
    compareAtPrice: compareAt,
    description: row.description ?? "",
    sizes: row.sizes ?? [],
    images: row.images ?? [],
    featured: row.featured,
    isNew: row.is_new,
    trending: row.trending,
  };
}

function readStored(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [lines, setLines] = useState<CartLine[]>([]);
  const [mounted, setMounted] = useState(false);
  const linesRef = useRef<CartLine[]>([]);
  const userRef = useRef(user);
  const syncedForRef = useRef<string | null>(null);

  linesRef.current = lines;
  userRef.current = user;

  // Read localStorage only after mount so SSR markup never mismatches.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional hydration guard
    setLines(readStored());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // storage unavailable — cart stays in memory
    }
  }, [lines, mounted]);

  // ——— Remote cart sync (InsForge `carts` table) ———
  // Write-through is fire-and-forget: sync failures log and never block the UX.

  const upsertRemote = useCallback(
    async (productId: string, size: string, quantity: number) => {
      if (!userRef.current) return;
      try {
        const { data, error } = await insforge.database
          .from("carts")
          .update({ quantity })
          .eq("product_id", productId)
          .eq("size", size)
          .select();
        if (error) {
          console.error("cart sync failed:", error.message);
          return;
        }
        if (!data || data.length === 0) {
          const { error: insertError } = await insforge.database
            .from("carts")
            .insert([{ product_id: productId, size, quantity }]);
          if (insertError)
            console.error("cart sync failed:", insertError.message);
        }
      } catch (e) {
        console.error("cart sync failed:", e);
      }
    },
    []
  );

  const deleteRemote = useCallback(
    async (productId: string, size: string) => {
      if (!userRef.current) return;
      try {
        const { error } = await insforge.database
          .from("carts")
          .delete()
          .eq("product_id", productId)
          .eq("size", size);
        if (error) console.error("cart sync failed:", error.message);
      } catch (e) {
        console.error("cart sync failed:", e);
      }
    },
    []
  );

  const clearRemote = useCallback(async () => {
    if (!userRef.current) return;
    try {
      // RLS scopes the delete to the caller's own rows.
      const { error } = await insforge.database.from("carts").delete();
      if (error) console.error("cart sync failed:", error.message);
    } catch (e) {
      console.error("cart sync failed:", e);
    }
  }, []);

  // On login: load cart lines from the carts table. On logout: keep the
  // local cart as-is (guest mode).
  useEffect(() => {
    if (!user) return;
    if (syncedForRef.current === user.id) return;
    syncedForRef.current = user.id;

    (async () => {
      const { data, error } = await insforge.database
        .from("carts")
        .select("product_id, size, quantity");
      if (error) {
        console.error("cart load failed:", error.message);
        return;
      }
      if (userRef.current?.id !== user.id) return;
      const rows = (data ?? []) as CartRow[];

      if (rows.length === 0) {
        // Remote cart empty — push any local guest lines up instead of wiping them.
        for (const l of linesRef.current) {
          await upsertRemote(l.product.id, l.size, l.qty);
        }
        return;
      }

      const ids = [...new Set(rows.map((r) => r.product_id))];
      const { data: products, error: productsError } = await insforge.database
        .from("products")
        .select()
        .in("id", ids);
      if (productsError) {
        console.error("cart load failed:", productsError.message);
        return;
      }
      if (userRef.current?.id !== user.id) return;

      const byId = new Map(
        ((products ?? []) as ProductRow[]).map((p) => [p.id, p])
      );
      const next: CartLine[] = [];
      for (const r of rows) {
        const row = byId.get(r.product_id);
        if (!row) continue;
        next.push({
          product: mapProduct(row),
          size: r.size,
          qty: Number(r.quantity),
        });
      }
      setLines(next);
    })();
  }, [user, upsertRemote]);

  const add = useCallback(
    (product: Product, size: string, qty = 1) => {
      const existing = linesRef.current.find(
        (l) => l.product.id === product.id && l.size === size
      );
      const newQty = (existing?.qty ?? 0) + qty;
      setLines((prev) => {
        const idx = prev.findIndex(
          (l) => l.product.id === product.id && l.size === size
        );
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], qty: next[idx].qty + qty };
          return next;
        }
        return [...prev, { product, size, qty }];
      });
      void upsertRemote(product.id, size, newQty);
    },
    [upsertRemote]
  );

  const remove = useCallback(
    (productId: string, size: string) => {
      setLines((prev) =>
        prev.filter((l) => !(l.product.id === productId && l.size === size))
      );
      void deleteRemote(productId, size);
    },
    [deleteRemote]
  );

  const updateQty = useCallback(
    (productId: string, size: string, qty: number) => {
      if (qty <= 0) {
        remove(productId, size);
        return;
      }
      setLines((prev) =>
        prev.map((l) =>
          l.product.id === productId && l.size === size ? { ...l, qty } : l
        )
      );
      void upsertRemote(productId, size, qty);
    },
    [remove, upsertRemote]
  );

  const clear = useCallback(() => {
    setLines([]);
    void clearRemote();
  }, [clearRemote]);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((n, l) => n + l.qty * l.product.price, 0);
    return { lines, count, subtotal, mounted, add, remove, updateQty, clear };
  }, [lines, mounted, add, remove, updateQty, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
