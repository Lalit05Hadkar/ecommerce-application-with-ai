import Link from "next/link";
import { money } from "@/lib/format";
import type { Product } from "@/lib/types";
import Img from "./Img";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`} className="product-card">
      <div className="product-card-media">
        <Img
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 25vw"
          className="product-img product-img-primary"
        />
        <Img
          src={product.images[1] ?? product.images[0]}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 25vw"
          className="product-img product-img-hover"
        />
        {product.isNew && <span className="badge-new">New</span>}
        <span className="quick-add">Quick add</span>
      </div>
      <div className="product-card-info">
        <p className="product-name">{product.name}</p>
        <p className="product-price">
          {product.compareAtPrice && (
            <span className="price-compare">{money(product.compareAtPrice)}</span>
          )}
          {money(product.price)}
        </p>
      </div>
    </Link>
  );
}
