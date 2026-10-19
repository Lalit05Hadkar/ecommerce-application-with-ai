"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { insforge } from "@/lib/insforge";
import { money } from "@/lib/format";
import Img from "@/components/Img";

const FREE_SHIPPING_THRESHOLD = 75;
const FLAT_SHIPPING = 8;

type Fields = Record<string, string>;

const REQUIRED: { key: string; label: string }[] = [
  { key: "name", label: "Full name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "address", label: "Street address" },
  { key: "city", label: "City" },
  { key: "zip", label: "ZIP / Postcode" },
  { key: "country", label: "Country" },
];

export default function CheckoutPage() {
  const { lines, subtotal, mounted, clear } = useCart();
  const { user, authLoading } = useAuth();
  const [fields, setFields] = useState<Fields>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const set = (key: string, value: string) => {
    setFields((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: false }));
  };

  const placeOrder = async (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, boolean> = {};
    for (const { key } of REQUIRED) {
      if (!fields[key]?.trim()) next[key] = true;
    }
    if (fields.email && !/^\S+@\S+\.\S+$/.test(fields.email)) next.email = true;
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);

    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
    const total = subtotal + shipping;
    const { data, error } = await insforge.database
      .from("orders")
      .insert([
        {
          items: lines.map((l) => ({
            id: l.product.id,
            name: l.product.name,
            size: l.size,
            qty: l.qty,
            price: l.product.price,
          })),
          subtotal,
          shipping,
          total,
          status: "pending",
          payment_status: "unpaid",
          payment_method: "paypal",
          contact: {
            name: fields.name,
            email: fields.email,
            phone: fields.phone,
          },
          shipping_address: {
            address: fields.address,
            city: fields.city,
            zip: fields.zip,
            country: fields.country,
          },
        },
      ])
      .select();

    if (error || !data || data.length === 0) {
      setSubmitError(error?.message ?? "Could not place your order. Please try again.");
      setSubmitting(false);
      return;
    }

    const orderId = (data[0] as { id: string }).id;
    clear();
    router.push(`/payment/${orderId}`);
  };

  if (authLoading) {
    return (
      <div className="container">
        <div className="empty-state">
          <p className="micro-label">Checkout</p>
          <h2 className="auth-loading">Loading…</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container">
        <div className="empty-state">
          <p className="micro-label">Checkout</p>
          <h2>Sign in to check out</h2>
          <p>You need an account to place an order.</p>
          <Link href="/login?from=/checkout" className="btn btn-dark">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  if (mounted && lines.length === 0) {
    return (
      <div className="container">
        <div className="empty-state">
          <p className="micro-label">Checkout</p>
          <h2>Your cart is empty</h2>
          <p>Add something beautiful before checking out.</p>
          <Link href="/women" className="btn btn-dark">
            Shop women
          </Link>
        </div>
      </div>
    );
  }

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const total = subtotal + shipping;

  const field = (
    key: string,
    label: string,
    opts: { type?: string; placeholder?: string; span?: boolean } = {}
  ) => (
    <div className={`field${opts.span ? " span-2" : ""}`}>
      <label htmlFor={`f-${key}`}>{label}</label>
      <input
        id={`f-${key}`}
        type={opts.type ?? "text"}
        placeholder={opts.placeholder}
        value={fields[key] ?? ""}
        onChange={(e) => set(key, e.target.value)}
        className={errors[key] ? "invalid" : undefined}
      />
      {errors[key] && (
        <p className="field-error">
          {key === "email" && fields.email
            ? "Please enter a valid email address."
            : `${label} is required.`}
        </p>
      )}
    </div>
  );

  return (
    <div className="container">
      <div className="page-head">
        <p className="micro-label">Secure checkout</p>
        <h1>Checkout</h1>
      </div>
      <form className="checkout-layout" onSubmit={placeOrder} noValidate>
        <div>
          <section className="form-section">
            <h2>Contact</h2>
            <div className="form-grid">
              {field("name", "Full name", { span: true })}
              {field("email", "Email", { type: "email" })}
              {field("phone", "Phone", { type: "tel" })}
            </div>
          </section>

          <section className="form-section">
            <h2>Shipping</h2>
            <div className="form-grid">
              {field("address", "Street address", { span: true })}
              {field("city", "City")}
              {field("zip", "ZIP / Postcode")}
              {field("country", "Country", { span: true })}
            </div>
          </section>

          <section className="form-section">
            <h2>Payment</h2>
            <p className="demo-note">
              Payment is handled by PayPal — after placing your order
              you&apos;ll be redirected to complete the payment.
            </p>
          </section>
        </div>

        <aside className="summary-panel">
          <h2>Order summary</h2>
          {lines.map((l) => (
            <div key={`${l.product.id}-${l.size}`} className="cart-line">
              <span className="cart-line-img">
                <Img
                  src={l.product.images[0]}
                  alt={l.product.name}
                  fill
                  sizes="88px"
                />
              </span>
              <div>
                <p className="cart-line-name">{l.product.name}</p>
                <p className="cart-line-meta">
                  Size {l.size} · Qty {l.qty}
                </p>
              </div>
              <p className="cart-line-total">{money(l.product.price * l.qty)}</p>
            </div>
          ))}
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
          {submitError && <p className="field-error">{submitError}</p>}
          <button type="submit" className="btn btn-dark" disabled={submitting}>
            {submitting ? "Placing order…" : "Place order"}
          </button>
        </aside>
      </form>
    </div>
  );
}
