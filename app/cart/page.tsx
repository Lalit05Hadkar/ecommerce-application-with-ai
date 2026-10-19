"use client";

import Link from "next/link";
import { useCart } from "@/lib/store";
import { money } from "@/lib/format";
import Img from "@/components/Img";
import { MinusIcon, PlusIcon } from "@/components/Icons";

const FREE_SHIPPING_THRESHOLD = 75;
const FLAT_SHIPPING = 8;

export default function CartPage() {
  const { lines, subtotal, count, mounted, updateQty, remove } = useCart();

  if (!mounted) {
    return (
      <div className="container">
        <div className="page-head">
          <h1>Your cart</h1>
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="container">
        <div className="empty-state">
          <p className="micro-label">Your cart</p>
          <h2>It&apos;s empty in here</h2>
          <p>Beautiful things await — start with the women&apos;s collection.</p>
          <Link href="/women" className="btn btn-dark">
            Shop women
          </Link>
        </div>
      </div>
    );
  }

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const total = subtotal + shipping;

  return (
    <div className="container">
      <div className="page-head">
        <p className="micro-label">{count} items</p>
        <h1>Your cart</h1>
      </div>
      <div className="cart-layout">
        <div>
          {lines.map((l) => (
            <div key={`${l.product.id}-${l.size}`} className="cart-line">
              <Link href={`/product/${l.product.id}`} className="cart-line-img">
                <Img
                  src={l.product.images[0]}
                  alt={l.product.name}
                  fill
                  sizes="88px"
                />
              </Link>
              <div>
                <Link href={`/product/${l.product.id}`} className="cart-line-name">
                  {l.product.name}
                </Link>
                <p className="cart-line-meta">
                  Size {l.size} · {money(l.product.price)}
                </p>
                <div className="cart-line-controls">
                  <div className="qty-stepper">
                    <button
                      onClick={() => updateQty(l.product.id, l.size, l.qty - 1)}
                      aria-label="Decrease quantity"
                    >
                      <MinusIcon />
                    </button>
                    <span>{l.qty}</span>
                    <button
                      onClick={() => updateQty(l.product.id, l.size, l.qty + 1)}
                      aria-label="Increase quantity"
                    >
                      <PlusIcon />
                    </button>
                  </div>
                  <button
                    className="link-remove"
                    onClick={() => remove(l.product.id, l.size)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <p className="cart-line-total">{money(l.product.price * l.qty)}</p>
            </div>
          ))}
        </div>

        <aside className="summary-panel">
          <h2>Order summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{money(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : money(shipping)}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>{money(total)}</span>
          </div>
          <Link href="/checkout" className="btn btn-dark">
            Proceed to checkout
          </Link>
          <p className="summary-note">
            {shipping === 0
              ? "Your order ships free."
              : `Add ${money(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping.`}
          </p>
        </aside>
      </div>
    </div>
  );
}
