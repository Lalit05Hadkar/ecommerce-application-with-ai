"use client";

import { useState, type FormEvent } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <p className="serif" style={{ fontSize: 24, marginTop: 28 }}>
        Thank you — you&apos;re on the list.
      </p>
    );
  }

  return (
    <form className="newsletter-form" onSubmit={submit}>
      <input
        type="email"
        required
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Email address"
      />
      <button type="submit" className="btn btn-dark">
        Subscribe
      </button>
    </form>
  );
}
