import { insforge, isInsForgeAvailable } from "./insforge";
import type { Product } from "./types";
import { PRODUCTS } from "./data";

/**
 * THE BACKEND-SWAP SEAM.
 * This async service layer queries the real InsForge backend (products table)
 * via the shared client in lib/insforge.ts IF a live backend is configured.
 * When isInsForgeAvailable is false, it returns the rich local catalogue
 * immediately in 0ms without network latency or timeouts.
 */

export type SortOption = "featured" | "price-asc" | "price-desc" | "newest";

export interface ProductQuery {
  category?: "women" | "men";
  subcategory?: string;
  sort?: SortOption;
  query?: string;
  limit?: number;
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
  const compareAt = row.compare_at_price == null ? undefined : Number(row.compare_at_price);
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

/** Strip characters that would break a PostgREST `or` filter string. */
function sanitizeTerm(q: string): string {
  return q.replace(/[%,()]/g, " ").trim();
}

function applySorting(items: Product[], sort?: SortOption): Product[] {
  switch (sort) {
    case "price-asc":
      return items.sort((a, b) => a.price - b.price);
    case "price-desc":
      return items.sort((a, b) => b.price - a.price);
    case "newest":
      return items.sort(
        (a, b) => Number(b.isNew) - Number(a.isNew) || a.name.localeCompare(b.name)
      );
    default: // "featured"
      return items.sort(
        (a, b) =>
          Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name)
      );
  }
}

function fallbackProducts(opts: ProductQuery = {}): Product[] {
  let items = [...PRODUCTS];

  if (opts.category) {
    items = items.filter((p) => p.category === opts.category);
  }
  if (opts.subcategory) {
    items = items.filter(
      (p) => p.subcategory.toLowerCase() === opts.subcategory!.toLowerCase()
    );
  }
  const term = opts.query ? opts.query.toLowerCase().trim() : "";
  if (term) {
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.subcategory.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
    );
  }

  items = applySorting(items, opts.sort);
  return opts.limit ? items.slice(0, opts.limit) : items;
}

export async function getProducts(opts: ProductQuery = {}): Promise<Product[]> {
  if (isInsForgeAvailable) {
    try {
      let query = insforge.database.from("products").select();

      if (opts.category) query = query.eq("category", opts.category);
      if (opts.subcategory)
        query = query.ilike("subcategory", opts.subcategory);
      const term = opts.query ? sanitizeTerm(opts.query) : "";
      if (term) {
        query = query.or(
          `name.ilike.%${term}%,subcategory.ilike.%${term}%,category.ilike.%${term}%`
        );
      }

      const { data, error } = await query.limit(200);
      if (!error && data && data.length > 0) {
        const items = ((data ?? []) as ProductRow[]).map(mapProduct);
        const sorted = applySorting(items, opts.sort);
        return opts.limit ? sorted.slice(0, opts.limit) : sorted;
      }
    } catch {
      // InsForge unavailable, fall back cleanly
    }
  }

  return fallbackProducts(opts);
}

export async function getProductById(id: string): Promise<Product | null> {
  if (isInsForgeAvailable) {
    try {
      const { data, error } = await insforge.database
        .from("products")
        .select()
        .eq("id", id)
        .maybeSingle();
      if (!error && data) {
        return mapProduct(data as ProductRow);
      }
    } catch {
      // Fall back
    }
  }
  return PRODUCTS.find((p) => p.id === id) ?? null;
}

export async function getFeatured(): Promise<Product[]> {
  if (isInsForgeAvailable) {
    try {
      const { data, error } = await insforge.database
        .from("products")
        .select()
        .eq("featured", true)
        .limit(8);
      if (!error && data && data.length > 0) {
        return ((data ?? []) as ProductRow[]).map(mapProduct);
      }
    } catch {
      // Fall back
    }
  }
  const items = PRODUCTS.filter((p) => p.featured);
  return items.length > 0 ? items.slice(0, 8) : PRODUCTS.slice(0, 8);
}

export async function getNewArrivals(): Promise<Product[]> {
  if (isInsForgeAvailable) {
    try {
      const { data, error } = await insforge.database
        .from("products")
        .select()
        .eq("is_new", true)
        .limit(8);
      if (!error && data && data.length > 0) {
        return ((data ?? []) as ProductRow[]).map(mapProduct);
      }
    } catch {
      // Fall back
    }
  }
  const items = PRODUCTS.filter((p) => p.isNew);
  return items.length > 0 ? items.slice(0, 8) : PRODUCTS.slice(2, 10);
}

export async function getTrending(): Promise<Product[]> {
  if (isInsForgeAvailable) {
    try {
      const { data, error } = await insforge.database
        .from("products")
        .select()
        .eq("trending", true)
        .limit(8);
      if (!error && data && data.length > 0) {
        return ((data ?? []) as ProductRow[]).map(mapProduct);
      }
    } catch {
      // Fall back
    }
  }
  const items = PRODUCTS.filter((p) => p.trending);
  return items.length > 0 ? items.slice(0, 8) : PRODUCTS.slice(4, 12);
}

export async function getRelated(id: string): Promise<Product[]> {
  const product = await getProductById(id);
  if (!product) return [];
  if (isInsForgeAvailable) {
    try {
      const { data, error } = await insforge.database
        .from("products")
        .select()
        .eq("category", product.category)
        .neq("id", id)
        .limit(4);
      if (!error && data && data.length > 0) {
        return ((data ?? []) as ProductRow[]).map(mapProduct);
      }
    } catch {
      // Fall back
    }
  }
  return PRODUCTS.filter((p) => p.category === product.category && p.id !== id).slice(0, 4);
}
