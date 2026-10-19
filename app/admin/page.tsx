"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PRODUCTS } from "@/lib/data";
import { isInsForgeAvailable } from "@/lib/insforge";
import { useAuth } from "@/lib/auth";
import { money } from "@/lib/format";

interface LocalOrder {
  id: string;
  items: Array<{ id: string; name: string; size: string; qty: number; price: number }>;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  payment_status: string;
  payment_method: string;
  contact?: { name: string; email: string; phone: string };
  shipping_address?: { address: string; city: string; zip: string; country: string };
  created_at: string;
}

export default function AdminDatabasePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"orders" | "products" | "users" | "schema">("orders");
  const [orders, setOrders] = useState<LocalOrder[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("aurelia-orders") || "[]");
      setOrders(stored);
    } catch {
      setOrders([]);
    }
    setMounted(true);
  }, []);

  const updateOrderStatus = (orderId: string, nextStatus: string, nextPayment?: string) => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status: nextStatus,
          payment_status: nextPayment || o.payment_status,
        };
      }
      return o;
    });
    setOrders(updated);
    try {
      localStorage.setItem("aurelia-orders", JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const clearAllOrders = () => {
    if (confirm("Clear all orders from the local database?")) {
      setOrders([]);
      localStorage.removeItem("aurelia-orders");
    }
  };

  const totalRevenue = orders
    .filter((o) => o.payment_status === "paid")
    .reduce((sum, o) => sum + Number(o.total || 0), 0);

  return (
    <div className="container" style={{ padding: "40px 20px 90px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 30 }}>
        <div>
          <p className="micro-label">Database &amp; Backend Control Center</p>
          <h1 style={{ fontSize: "2.4rem", margin: "6px 0" }}>Backend Inspector</h1>
          <p style={{ color: "var(--muted)" }}>
            Inspect live database tables, active records, orders, catalogue, and schema.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/" className="btn" style={{ border: "1px solid var(--line)" }}>
            ← Storefront
          </Link>
          <Link href="/profile" className="btn" style={{ border: "1px solid var(--line)" }}>
            Customer Profile
          </Link>
        </div>
      </div>

      {/* Backend Status Card */}
      <div
        style={{
          background: "var(--bg-soft, #f3efe9)",
          padding: "20px 24px",
          border: "1px solid var(--line, #e5e0da)",
          borderRadius: 4,
          marginBottom: 30,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 20,
        }}
      >
        <div>
          <span className="micro-label">Backend Engine</span>
          <p style={{ fontWeight: 600, fontSize: "1.1rem", marginTop: 4 }}>
            {isInsForgeAvailable ? "🟢 InsForge Cloud BaaS" : "⚡ High-Speed Local Engine"}
          </p>
          <p style={{ fontSize: "12px", color: "var(--muted)" }}>
            {isInsForgeAvailable ? "Connected to remote PostgreSQL instance" : "Running locally via Browser Database (LocalStorage & Memory)"}
          </p>
        </div>
        <div>
          <span className="micro-label">Total Orders</span>
          <p style={{ fontWeight: 600, fontSize: "1.1rem", marginTop: 4 }}>
            {mounted ? orders.length : 0} Orders
          </p>
          <p style={{ fontSize: "12px", color: "var(--muted)" }}>
            {orders.filter((o) => o.payment_status === "paid").length} Paid &bull; {orders.filter((o) => o.payment_status !== "paid").length} Unpaid
          </p>
        </div>
        <div>
          <span className="micro-label">Paid Revenue</span>
          <p style={{ fontWeight: 600, fontSize: "1.1rem", marginTop: 4 }}>
            {money(totalRevenue)}
          </p>
          <p style={{ fontSize: "12px", color: "var(--muted)" }}>Calculated from paid orders</p>
        </div>
        <div>
          <span className="micro-label">Active Products</span>
          <p style={{ fontWeight: 600, fontSize: "1.1rem", marginTop: 4 }}>
            {PRODUCTS.length} SKUs
          </p>
          <p style={{ fontSize: "12px", color: "var(--muted)" }}>Women &amp; Men Apparel</p>
        </div>
      </div>

      {/* Table Navigation Tabs */}
      <div style={{ display: "flex", gap: 10, borderBottom: "1px solid var(--line)", paddingBottom: 12, marginBottom: 24, overflowX: "auto" }}>
        <button
          onClick={() => setActiveTab("orders")}
          style={{
            padding: "8px 16px",
            fontSize: "13px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            borderBottom: activeTab === "orders" ? "2px solid var(--ink)" : "2px solid transparent",
            color: activeTab === "orders" ? "var(--ink)" : "var(--muted)",
          }}
        >
          Orders Table ({mounted ? orders.length : 0})
        </button>
        <button
          onClick={() => setActiveTab("products")}
          style={{
            padding: "8px 16px",
            fontSize: "13px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            borderBottom: activeTab === "products" ? "2px solid var(--ink)" : "2px solid transparent",
            color: activeTab === "products" ? "var(--ink)" : "var(--muted)",
          }}
        >
          Products Table ({PRODUCTS.length})
        </button>
        <button
          onClick={() => setActiveTab("users")}
          style={{
            padding: "8px 16px",
            fontSize: "13px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            borderBottom: activeTab === "users" ? "2px solid var(--ink)" : "2px solid transparent",
            color: activeTab === "users" ? "var(--ink)" : "var(--muted)",
          }}
        >
          Auth &amp; Users Table
        </button>
        <button
          onClick={() => setActiveTab("schema")}
          style={{
            padding: "8px 16px",
            fontSize: "13px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            borderBottom: activeTab === "schema" ? "2px solid var(--ink)" : "2px solid transparent",
            color: activeTab === "schema" ? "var(--ink)" : "var(--muted)",
          }}
        >
          SQL Schema (Postgres)
        </button>
      </div>

      {/* TAB 1: Orders Table */}
      {activeTab === "orders" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <p className="micro-label">Table: public.orders</p>
            {orders.length > 0 && (
              <button onClick={clearAllOrders} style={{ fontSize: "12px", color: "var(--danger, red)" }}>
                Clear All Orders
              </button>
            )}
          </div>
          {orders.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center", border: "1px dashed var(--line)", borderRadius: 4 }}>
              <p style={{ color: "var(--muted)", marginBottom: 12 }}>No orders found in the database yet.</p>
              <Link href="/women" className="btn btn-dark">
                Create a Test Order in Shop
              </Link>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--line)", background: "var(--bg-soft)" }}>
                    <th style={{ padding: "10px 12px" }}>Order ID</th>
                    <th style={{ padding: "10px 12px" }}>Customer</th>
                    <th style={{ padding: "10px 12px" }}>Items</th>
                    <th style={{ padding: "10px 12px" }}>Total</th>
                    <th style={{ padding: "10px 12px" }}>Payment Status</th>
                    <th style={{ padding: "10px 12px" }}>Order Status</th>
                    <th style={{ padding: "10px 12px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} style={{ borderBottom: "1px solid var(--line)" }}>
                      <td style={{ padding: "12px", fontFamily: "monospace", fontWeight: 600 }}>
                        <Link href={`/payment/${o.id}`} style={{ textDecoration: "underline" }}>
                          {o.id}
                        </Link>
                      </td>
                      <td style={{ padding: "12px" }}>
                        <div>{o.contact?.name || "Guest Customer"}</div>
                        <div style={{ fontSize: "11px", color: "var(--muted)" }}>{o.contact?.email}</div>
                      </td>
                      <td style={{ padding: "12px" }}>
                        {o.items?.map((it, idx) => (
                          <div key={idx} style={{ fontSize: "12px" }}>
                            {it.qty}x {it.name} ({it.size}) - {money(it.price)}
                          </div>
                        ))}
                      </td>
                      <td style={{ padding: "12px", fontWeight: 600 }}>{money(o.total)}</td>
                      <td style={{ padding: "12px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "3px 8px",
                            borderRadius: 12,
                            fontSize: "11px",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            background: o.payment_status === "paid" ? "#e6f4ea" : "#fef7e0",
                            color: o.payment_status === "paid" ? "#137333" : "#b06000",
                          }}
                        >
                          {o.payment_status}
                        </span>
                      </td>
                      <td style={{ padding: "12px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "3px 8px",
                            borderRadius: 12,
                            fontSize: "11px",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            background: "var(--bg-soft)",
                          }}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px" }}>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {o.payment_status !== "paid" && (
                            <button
                              onClick={() => updateOrderStatus(o.id, "confirmed", "paid")}
                              style={{ fontSize: "11px", padding: "4px 8px", border: "1px solid var(--line)", borderRadius: 3 }}
                            >
                              Mark Paid
                            </button>
                          )}
                          {o.status !== "shipped" && o.status !== "delivered" && (
                            <button
                              onClick={() => updateOrderStatus(o.id, "shipped")}
                              style={{ fontSize: "11px", padding: "4px 8px", border: "1px solid var(--line)", borderRadius: 3 }}
                            >
                              Ship
                            </button>
                          )}
                          {o.status !== "delivered" && (
                            <button
                              onClick={() => updateOrderStatus(o.id, "delivered")}
                              style={{ fontSize: "11px", padding: "4px 8px", border: "1px solid var(--line)", borderRadius: 3 }}
                            >
                              Deliver
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Products Table */}
      {activeTab === "products" && (
        <div>
          <p className="micro-label" style={{ marginBottom: 12 }}>Table: public.products ({PRODUCTS.length} records)</p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--line)", background: "var(--bg-soft)" }}>
                  <th style={{ padding: "10px 12px" }}>ID</th>
                  <th style={{ padding: "10px 12px" }}>Name</th>
                  <th style={{ padding: "10px 12px" }}>Category</th>
                  <th style={{ padding: "10px 12px" }}>Subcategory</th>
                  <th style={{ padding: "10px 12px" }}>Price</th>
                  <th style={{ padding: "10px 12px" }}>Flags</th>
                  <th style={{ padding: "10px 12px" }}>Sizes</th>
                </tr>
              </thead>
              <tbody>
                {PRODUCTS.map((p) => (
                  <tr key={p.id} style={{ borderBottom: "1px solid var(--line)" }}>
                    <td style={{ padding: "10px 12px", fontFamily: "monospace", fontSize: "11px" }}>
                      <Link href={`/product/${p.id}`} style={{ textDecoration: "underline" }}>
                        {p.id}
                      </Link>
                    </td>
                    <td style={{ padding: "10px 12px", fontWeight: 500 }}>{p.name}</td>
                    <td style={{ padding: "10px 12px", textTransform: "capitalize" }}>{p.category}</td>
                    <td style={{ padding: "10px 12px" }}>{p.subcategory}</td>
                    <td style={{ padding: "10px 12px", fontWeight: 600 }}>{money(p.price)}</td>
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", fontSize: "10px" }}>
                        {p.featured && <span style={{ background: "#e8eaed", padding: "2px 5px", borderRadius: 3 }}>Featured</span>}
                        {p.isNew && <span style={{ background: "#e6f4ea", color: "#137333", padding: "2px 5px", borderRadius: 3 }}>New</span>}
                        {p.trending && <span style={{ background: "#fce8e6", color: "#c5221f", padding: "2px 5px", borderRadius: 3 }}>Trending</span>}
                      </div>
                    </td>
                    <td style={{ padding: "10px 12px", fontSize: "11px", color: "var(--muted)" }}>
                      {p.sizes.join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Users Table */}
      {activeTab === "users" && (
        <div>
          <p className="micro-label" style={{ marginBottom: 12 }}>Table: auth.users</p>
          <div style={{ background: "var(--bg-soft)", padding: 20, borderRadius: 4, border: "1px solid var(--line)" }}>
            <h3 style={{ marginBottom: 10 }}>Current Active Session</h3>
            {user ? (
              <div style={{ display: "grid", gap: 8, fontSize: "14px" }}>
                <div><strong>User ID:</strong> <code>{user.id}</code></div>
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Name:</strong> {user.profile?.name || "N/A"}</div>
                <div><strong>Email Verified:</strong> {user.emailVerified ? "Yes" : "No"}</div>
                <div><strong>Created:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleString() : "Just now"}</div>
              </div>
            ) : (
              <p style={{ color: "var(--muted)" }}>
                No active user session currently logged in. Visit <Link href="/login" style={{ textDecoration: "underline" }}>/login</Link> to sign in.
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: SQL Schema */}
      {activeTab === "schema" && (
        <div>
          <p className="micro-label" style={{ marginBottom: 12 }}>PostgreSQL Migration Schema (from migrations/)</p>
          <pre
            style={{
              background: "#16130f",
              color: "#faf8f5",
              padding: 20,
              borderRadius: 4,
              overflowX: "auto",
              fontSize: "12px",
              lineHeight: 1.6,
              fontFamily: "monospace",
            }}
          >
{`-- VELOUR / AURELIA core schema:
-- products (public read)
create table public.products (
  id text primary key,
  name text not null,
  category text not null check (category in ('women', 'men')),
  subcategory text not null,
  price numeric(10,2) not null,
  compare_at_price numeric(10,2),
  description text,
  sizes text[] default array['XS','S','M','L','XL'],
  images text[] not null,
  featured boolean default false,
  is_new boolean default false,
  trending boolean default false,
  created_at timestamptz default now()
);

-- carts (owner-only access via RLS)
create table public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id text not null references public.products(id) on delete cascade,
  size text not null,
  quantity integer not null check (quantity > 0),
  created_at timestamptz default now(),
  unique (user_id, product_id, size)
);

-- orders (owner-only access via RLS)
create table public.orders (
  id text primary key,
  user_id uuid references auth.users(id) on delete set null,
  items jsonb not null,
  subtotal numeric(10,2) not null,
  shipping numeric(10,2) not null,
  total numeric(10,2) not null,
  status text not null default 'pending',
  payment_status text not null default 'unpaid',
  payment_method text not null default 'paypal',
  contact jsonb,
  shipping_address jsonb,
  created_at timestamptz default now()
);`}
          </pre>
        </div>
      )}
    </div>
  );
}
