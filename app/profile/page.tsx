"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { insforge } from "@/lib/insforge";
import { money } from "@/lib/format";

interface OrderItem {
  id: string;
  name: string;
  size: string;
  qty: number;
  price: number | string;
}

interface OrderRow {
  id: string;
  items: OrderItem[];
  subtotal: number | string;
  shipping: number | string;
  total: number | string;
  status: string;
  payment_status: string;
  created_at: string;
}

const STATUS_STEPS = ["pending", "confirmed", "shipped", "delivered"] as const;

function StatusTracker({ status }: { status: string }) {
  const current = STATUS_STEPS.indexOf(
    status.toLowerCase() as (typeof STATUS_STEPS)[number]
  );
  return (
    <ol className="status-tracker">
      {STATUS_STEPS.map((step, i) => (
        <li
          key={step}
          className={`status-step${i <= current ? " done" : ""}`}
        >
          <span className="status-dot" />
          <span className="status-label">{step}</span>
        </li>
      ))}
    </ol>
  );
}

export default function ProfilePage() {
  const { user, authLoading, signOut } = useAuth();
  const [orders, setOrders] = useState<OrderRow[] | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await insforge.database
        .from("orders")
        .select()
        .order("created_at", { ascending: false })
        .limit(50);
      if (cancelled) return;
      if (error) {
        console.error("orders load failed:", error.message);
        setOrders([]);
        return;
      }
      setOrders((data ?? []) as OrderRow[]);
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="container">
        <div className="empty-state">
          <p className="micro-label">Account</p>
          <h2 className="auth-loading">Loading…</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-head">
        <p className="micro-label">Account</p>
        <h1>Your profile</h1>
      </div>

      <section className="profile-card">
        <div>
          <p className="micro-label">Signed in as</p>
          <p className="profile-email">{user.email}</p>
        </div>
        <button
          className="btn btn-dark"
          onClick={async () => {
            await signOut();
            router.push("/");
          }}
        >
          Sign out
        </button>
      </section>

      <section>
        <p className="micro-label">Order history</p>
        {orders === null ? (
          <h2 className="auth-loading">Loading…</h2>
        ) : orders.length === 0 ? (
          <p className="profile-empty">
            No orders yet — your placed orders will appear here.
          </p>
        ) : (
          <div className="order-list">
            {orders.map((o) => (
              <article key={o.id} className="order-card">
                <header className="order-card-head">
                  <div>
                    <p className="micro-label">
                      Order {o.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="order-date">
                      {new Date(o.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="order-card-head-right">
                    <span
                      className={`payment-badge${o.payment_status === "paid" ? " paid" : ""}`}
                    >
                      {o.payment_status === "paid" ? "Paid" : "Unpaid"}
                    </span>
                    <p className="order-total">{money(Number(o.total))}</p>
                  </div>
                </header>
                <ul className="order-items">
                  {(o.items ?? []).map((item, i) => (
                    <li key={`${item.id}-${item.size}-${i}`}>
                      {item.name} × {item.qty}
                      <span className="order-item-size"> · Size {item.size}</span>
                    </li>
                  ))}
                </ul>
                <StatusTracker status={o.status} />
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
