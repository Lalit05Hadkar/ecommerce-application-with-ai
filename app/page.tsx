import Link from "next/link";
import Hero from "@/components/Hero";
import Img from "@/components/Img";
import NewsletterForm from "@/components/NewsletterForm";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { getFeatured, getNewArrivals, getTrending } from "@/lib/api";
import type { Product } from "@/lib/types";

function ProductRow({ products }: { products: Product[] }) {
  return (
    <div className="product-grid">
      {products.slice(0, 4).map((p, i) => (
        <Reveal key={p.id} delay={i * 90}>
          <ProductCard product={p} />
        </Reveal>
      ))}
    </div>
  );
}

export default async function Home() {
  const [featured, newArrivals, trending] = await Promise.all([
    getFeatured(),
    getNewArrivals(),
    getTrending(),
  ]);

  return (
    <>
      <Hero />

      {/* Category highlights */}
      <section className="section">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <div>
                <p className="micro-label">The Collections</p>
                <h2>Shop by category</h2>
              </div>
            </div>
          </Reveal>
          <div className="category-cards">
            <Reveal>
              <Link href="/women" className="category-card">
                <Img
                  src="/images/products/oversized-wool-coat-1.jpg"
                  alt="Women's collection"
                  fill
                  sizes="(max-width: 820px) 100vw, 50vw"
                />
                <div className="category-card-label">
                  <h3>Women</h3>
                  <span>Explore the collection</span>
                </div>
              </Link>
            </Reveal>
            <Reveal delay={120}>
              <Link href="/men" className="category-card">
                <Img
                  src="/images/products/tailored-wool-overcoat-1.jpg"
                  alt="Men's collection"
                  fill
                  sizes="(max-width: 820px) 100vw, 50vw"
                />
                <div className="category-card-label">
                  <h3>Men</h3>
                  <span>Explore the collection</span>
                </div>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="section section-bordered">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <div>
                <p className="micro-label">Curated</p>
                <h2>Featured pieces</h2>
              </div>
              <Link href="/women" className="section-link">
                View all
              </Link>
            </div>
          </Reveal>
          <ProductRow products={featured} />
        </div>
      </section>

      {/* Promo banners */}
      <section className="section">
        <div className="container promo-grid">
          <Reveal>
            <div className="promo-banner promo-dark">
              <p className="micro-label" style={{ color: "rgba(250,248,245,0.6)" }}>
                Limited time
              </p>
              <h3>Winter Sale — Up to 40% off</h3>
              <p>Seasonal staples at their softest prices.</p>
              <Link href="/women" className="btn btn-light">
                Shop the sale
              </Link>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="promo-banner">
              <p className="micro-label">Always on</p>
              <h3>Free shipping over $75</h3>
              <p>Worldwide delivery, on us, for every order over $75.</p>
              <Link href="/men" className="btn">
                Start shopping
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* New arrivals */}
      <section className="section section-bordered">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <div>
                <p className="micro-label">Just landed</p>
                <h2>New arrivals</h2>
              </div>
              <Link href="/women?sort=newest" className="section-link">
                View all
              </Link>
            </div>
          </Reveal>
          <ProductRow products={newArrivals} />
        </div>
      </section>

      {/* Trending */}
      <section className="section section-bordered">
        <div className="container">
          <Reveal>
            <div className="section-head">
              <div>
                <p className="micro-label">Most wanted</p>
                <h2>Trending now</h2>
              </div>
              <Link href="/men" className="section-link">
                View all
              </Link>
            </div>
          </Reveal>
          <ProductRow products={trending} />
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <Reveal>
          <p className="micro-label">The VELOUR List</p>
          <h2>First to know</h2>
          <p>
            New collections, private sales, and stories from the atelier —
            delivered occasionally, never noisily.
          </p>
          <NewsletterForm />
        </Reveal>
      </section>
    </>
  );
}
