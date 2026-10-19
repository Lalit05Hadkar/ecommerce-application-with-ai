import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCart from "@/components/AddToCart";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import Reveal from "@/components/Reveal";
import { getProductById, getRelated } from "@/lib/api";
import { money } from "@/lib/format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  return { title: product ? product.name : "Product" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const related = await getRelated(product.id);

  return (
    <div className="container">
      <div className="product-detail">
        <ProductGallery images={product.images} name={product.name} />
        <div className="product-info">
          <p className="micro-label">
            <Link href={`/${product.category}`}>{product.category}</Link>
            {" / "}
            {product.subcategory}
          </p>
          <h1>{product.name}</h1>
          <p className="detail-price">
            {product.compareAtPrice && (
              <span className="price-compare">{money(product.compareAtPrice)}</span>
            )}
            {money(product.price)}
          </p>
          <p className="detail-description">{product.description}</p>
          <AddToCart product={product} />
          <div className="detail-meta">
            <span>Free worldwide shipping over $75</span>
            <span>30-day returns, no questions asked</span>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section section-bordered">
          <Reveal>
            <div className="section-head">
              <div>
                <p className="micro-label">Complete the look</p>
                <h2>You may also like</h2>
              </div>
            </div>
          </Reveal>
          <div className="product-grid">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 90}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
