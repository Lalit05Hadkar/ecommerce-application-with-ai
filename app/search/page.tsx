import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { getProducts } from "@/lib/api";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const products = query ? await getProducts({ query }) : [];

  return (
    <div className="container">
      <div className="page-head">
        <p className="micro-label">Search</p>
        <h1>
          {query ? (
            <>
              Results for &ldquo;{query}&rdquo;
            </>
          ) : (
            "Search VELOUR"
          )}
        </h1>
        {query && (
          <p className="count">
            {products.length} {products.length === 1 ? "result" : "results"}
          </p>
        )}
      </div>

      {!query ? (
        <div className="empty-state">
          <p>Type a query in the search bar above to find pieces.</p>
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <p className="micro-label">No matches</p>
          <h2>Nothing found for &ldquo;{query}&rdquo;</h2>
          <p>Try a different term, or browse the collections.</p>
          <Link href="/women" className="btn">
            Shop women
          </Link>
        </div>
      ) : (
        <div className="product-grid" style={{ padding: "40px 0 90px" }}>
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
