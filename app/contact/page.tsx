import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="static-page">
      <p className="micro-label">We&apos;re here</p>
      <h1>Contact us</h1>
      <p>
        Questions about an order, sizing, or a fabric? Write to us at{" "}
        <strong>care@velour.example</strong> and we&apos;ll reply within one
        business day.
      </p>
      <p>
        For press and partnership enquiries, reach{" "}
        <strong>studio@velour.example</strong>. Our client care team is
        available Monday to Friday, 9:00–18:00 CET.
      </p>
    </div>
  );
}
