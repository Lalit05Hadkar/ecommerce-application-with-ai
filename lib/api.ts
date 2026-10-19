import { insforge } from "./insforge";
import type { Product } from "./types";

/**
 * THE BACKEND-SWAP SEAM.
 * This async service layer queries the real InsForge backend (products table)
 * via the shared client in lib/insforge.ts. Every function returns a Promise
 * and the signatures/return types are unchanged from the original mock layer,
 * so no page-level code changes are required. lib/data.ts remains only as the
 * local mirror used by subcategoriesFor for the filter pills.
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

export async function getProducts(opts: ProductQuery = {}): Promise<Product[]> {
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
  if (error) {
    console.error("getProducts failed:", error.message);
    return [];
  }

  const items = ((data ?? []) as ProductRow[]).map(mapProduct);

  switch (opts.sort) {
    case "price-asc":
      items.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      items.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      items.sort(
        (a, b) => Number(b.isNew) - Number(a.isNew) || a.name.localeCompare(b.name)
      );
      break;
    default: // "featured"
      items.sort(
        (a, b) =>
          Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name)
      );
  }

  return opts.limit ? items.slice(0, opts.limit) : items;
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await insforge.database
    .from("products")
    .select()
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error("getProductById failed:", error.message);
    return null;
  }
  return data ? mapProduct(data as ProductRow) : null;
}

export async function getFeatured(): Promise<Product[]> {
  const { data, error } = await insforge.database
    .from("products")
    .select()
    .eq("featured", true)
    .limit(8);
  if (error) {
    console.error("getFeatured failed:", error.message);
    return [];
  }
  return ((data ?? []) as ProductRow[]).map(mapProduct);
}

export async function getNewArrivals(): Promise<Product[]> {
  const { data, error } = await insforge.database
    .from("products")
    .select()
    .eq("is_new", true)
    .limit(8);
  if (error) {
    console.error("getNewArrivals failed:", error.message);
    return [];
  }
  return ((data ?? []) as ProductRow[]).map(mapProduct);
}

export async function getTrending(): Promise<Product[]> {
  const { data, error } = await insforge.database
    .from("products")
    .select()
    .eq("trending", true)
    .limit(8);
  if (error) {
    console.error("getTrending failed:", error.message);
    return [];
  }
  return ((data ?? []) as ProductRow[]).map(mapProduct);
}

export async function getRelated(id: string): Promise<Product[]> {
  const product = await getProductById(id);
  if (!product) return [];
  const { data, error } = await insforge.database
    .from("products")
    .select()
    .eq("category", product.category)
    .neq("id", id)
    .limit(4);
  if (error) {
    console.error("getRelated failed:", error.message);
    return [];
  }
  return ((data ?? []) as ProductRow[]).map(mapProduct);
}
