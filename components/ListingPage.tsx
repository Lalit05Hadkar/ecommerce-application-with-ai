import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import SortSelect from "@/components/SortSelect";
import { getProducts, type SortOption } from "@/lib/api";
import { subcategoriesFor } from "@/lib/data";
import type { Product } from "@/lib/types";

interface ListingPageProps {
  category: Product["category"];
  title: string;
  sub?: string;
  sort?: string;
}

export default async function ListingPage({
  category,
  title,
  sub,
  sort,
}: ListingPageProps) {
  const activeSort: SortOption = (
    ["featured", "price-asc", "price-desc", "newest"] as const
  ).includes(sort as SortOption)
    ? (sort as SortOption)
    : "featured";

  const [products, subcategories] = await Promise.all([
    getProducts({ category, subcategory: sub, sort: activeSort }),
    Promise.resolve(subcategoriesFor(category)),
  ]);

  const pillHref = (subName?: string) => {
    const params = new URLSearchParams();
    if (subName) params.set("sub", subName);
    if (sort) params.set("sort", sort);
    const qs = params.toString();
    return `/${category}${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="container">
      <div className="page-head">
        <p className="micro-label">{sub ?? "All"}</p>
        <h1>{title}</h1>
        <p className="count">
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>
      </div>

      <div className="listing-toolbar">
        <nav className="pills" aria-label="Subcategories">
          <Link href={pillHref()} className={`pill${!sub ? " active" : ""}`}>
            All
          </Link>
          {subcategories.map((s) => (
            <Link
              key={s}
              href={pillHref(s)}
              className={`pill${sub === s ? " active" : ""}`}
            >
              {s}
            </Link>
          ))}
        </nav>
        <SortSelect current={activeSort} />
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <p className="micro-label">Nothing here</p>
          <h2>No products found</h2>
          <p>Try a different subcategory or check back soon.</p>
          <Link href={`/${category}`} className="btn">
            View all {title.toLowerCase()}
          </Link>
        </div>
      ) : (
        <div className="product-grid" style={{ paddingBottom: 90 }}>
          {products.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 70}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
