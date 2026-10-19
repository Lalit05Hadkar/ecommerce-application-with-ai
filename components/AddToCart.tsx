"use client";

import { useState } from "react";
import { useCart } from "@/lib/store";
import { useToast } from "@/components/Toast";
import { MinusIcon, PlusIcon } from "@/components/Icons";
import type { Product } from "@/lib/types";

export default function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const toast = useToast();
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState(false);

  const onAdd = () => {
    if (!size) {
      setError(true);
      return;
    }
    add(product, size, qty);
    toast("Added to cart");
  };

  return (
    <>
      <div>
        <p className="micro-label">Select size</p>
        <div className="size-row">
          {product.sizes.map((s) => (
            <button
              key={s}
              className={`size-btn${size === s ? " active" : ""}`}
              onClick={() => {
                setSize(s);
                setError(false);
              }}
            >
              {s}
            </button>
          ))}
        </div>
        {error && <p className="field-error">Please select a size first.</p>}
      </div>

      <div className="buy-row">
        <div className="qty-stepper">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
          >
            <MinusIcon />
          </button>
          <span>{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">
            <PlusIcon />
          </button>
        </div>
        <button className="btn btn-dark" onClick={onAdd}>
          Add to cart
        </button>
      </div>
    </>
  );
}
