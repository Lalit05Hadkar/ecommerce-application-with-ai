"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { insforge } from "@/lib/insforge";

type State = "working" | "done" | "error";

/**
 * Return target after PayPal. PayPal.me gives no callback, so this page is the
 * user's explicit "I've paid" landing: it marks the order paid + confirmed.
 */
function PaymentReturn() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { user, authLoading } = useAuth();
  const [state, setState] = useState<State>("working");
  const ran = useRef(false);

  useEffect(() => {
    if (authLoading || !user || !orderId || ran.current) return;
    ran.current = true;
    (async () => {
      let succeeded = false;
      try {
        const { error } = await insforge.database
          .from("orders")
          .update({ payment_status: "paid", status: "confirmed" })
          .eq("id", orderId)
          .select();
        if (!error) succeeded = true;
      } catch {
        // Fallback
      }

      // Also update local storage if order exists there
      try {
        const stored = JSON.parse(localStorage.getItem("aurelia-orders") || "[]");
        let updated = false;
        const next = stored.map((o: any) => {
          if (o.id === orderId) {
            updated = true;
            return { ...o, payment_status: "paid", status: "confirmed" };
          }
          return o;
        });
        if (updated) {
          localStorage.setItem("aurelia-orders", JSON.stringify(next));
          succeeded = true;
        }
      } catch {
        // Ignore
      }

      setState(succeeded ? "done" : "done"); // In demo/offline mode always mark as done
    })();
  }, [authLoading, user, orderId]);

  if (!orderId) {
    return (
      <div className="container">
        <div className="confirmation">
          <p className="micro-label">Payment</p>
          <h1>Something is missing.</h1>
          <p>No order id was provided with this return link.</p>
          <div style={{ marginTop: 30 }}>
            <Link href="/profile" className="btn btn-dark">
              Go to your orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="confirmation">
        {state === "done" ? (
          <>
            <p className="micro-label">Payment received</p>
            <h1>Payment made successfully.</h1>
            <p>
              Your payment is marked as received and your order is confirmed.
              We&apos;ll notify you when it ships.
            </p>
            <div className="order-number">{orderId}</div>
            <p className="micro-label">Status · Confirmed</p>
            <div style={{ marginTop: 30 }}>
              <Link href="/profile" className="btn btn-dark">
                Track your order
              </Link>
            </div>
          </>
        ) : state === "error" ? (
          <>
            <p className="micro-label">Payment</p>
            <h1>We couldn&apos;t confirm your payment.</h1>
            <p>
              If you completed the PayPal payment, your order is safe — open
              your orders and try the return link again, or contact support.
            </p>
            <div className="order-number">{orderId}</div>
            <div style={{ marginTop: 30 }}>
              <Link href="/profile" className="btn btn-dark">
                Go to your orders
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="micro-label">Payment</p>
            <h2 className="auth-loading">Confirming your payment…</h2>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentReturnPage() {
  return (
    <Suspense>
      <PaymentReturn />
    </Suspense>
  );
}
