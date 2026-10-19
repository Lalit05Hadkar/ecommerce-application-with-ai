import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <div className="static-page">
      <p className="micro-label">Legal</p>
      <h1>Privacy policy</h1>
      <p>
        This is a demonstration storefront. No personal data is collected,
        transmitted, or stored on any server. Your cart lives only in your
        browser&apos;s local storage, and checkout does not process real
        payments.
      </p>
      <p>
        If this were a live store, this page would describe what we collect,
        why, how long we keep it, and the rights you have over your data —
        written in plain language, not legalese.
      </p>
    </div>
  );
}
