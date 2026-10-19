"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { insforge } from "@/lib/insforge";
import { money } from "@/lib/format";

const PAYPAL_ME_URL = process.env.NEXT_PUBLIC_PAYPAL_ME_URL;

interface OrderRow {
  id: string;
  total: number | string;
  payment_status: string;
}

/**
 * PayPal interstitial. Shows the order total, then sends the user to the
 * PayPal.me link (amount appended — PayPal.me has no callback), with a clear
 * return button. Without NEXT_PUBLIC_PAYPAL_ME_URL it runs in demo mode and
 * offers a "Simulate payment" button instead of the external redirect.
 */
export default function PaymentPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);
  const { user, authLoading } = useAuth();
  const [order, setOrder] = useState<OrderRow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.replace(`/login?from=/payment/${orderId}`);
  }, [authLoading, user, router, orderId]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await insforge.database
        .from("orders")
        .select("id, total, payment_status")
        .eq("id", orderId)
        .maybeSingle();
      if (cancelled) return;
      if (error || !data) {
        setError("We couldn't find this order.");
        return;
      }
      setOrder(data as OrderRow);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, orderId]);

  const total = order ? Number(order.total) : null;
  const returnHref = `/payment/return?orderId=${encodeURIComponent(orderId)}`;

  return (
    <div className="container">
      <div className="confirmation">
        <p className="micro-label">Payment</p>
        <h1>Complete your payment</h1>
        {error ? (
          <>
            <p>{error}</p>
            <div style={{ marginTop: 30 }}>
              <Link href="/profile" className="btn btn-dark">
                Go to your orders
              </Link>
            </div>
          </>
        ) : order ? (
          <>
            {order.payment_status === "paid" ? (
              <p>This order is already paid — thank you.</p>
            ) : (
              <>
                <p>
                  Order total: <strong>{money(total ?? 0)}</strong>
                </p>
                <p>
                  Pay {money(total ?? 0)} with PayPal (
                  {PAYPAL_ME_URL?.replace(/^https?:\/\//, "")}) to confirm your
                  order.
                </p>
                <div className="order-number">{order.id}</div>
                <div
                  style={{
                    display: "flex",
                    gap: 14,
                    justifyContent: "center",
                    flexWrap: "wrap",
                    marginTop: 30,
                  }}
                >
                  <Link href={returnHref} className="btn btn-dark">
                    Pay with PayPal
                  </Link>
                </div>
              </>
            )}
          </>
        ) : (
          <h2 className="auth-loading">Loading…</h2>
        )}
      </div>
    </div>
  );
}
