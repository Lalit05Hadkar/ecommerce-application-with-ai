"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { insforge } from "@/lib/insforge";
import { useAuth } from "@/lib/auth";

const EMAIL_RE = /^\S+@\S+\.\S+$/;

function sanitizeFrom(from: string | null): string {
  if (from && from.startsWith("/") && !from.startsWith("//")) return from;
  return "/profile";
}

function LoginForm() {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // Signup step 2: email waiting on its 6-digit verification code.
  const [pendingVerify, setPendingVerify] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [resent, setResent] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();

  const set = (key: string, value: string) => {
    setFields((f) => ({ ...f, [key]: value }));
    setFieldErrors((e) => ({ ...e, [key]: false }));
  };

  const switchTab = (next: "signin" | "signup") => {
    setTab(next);
    setError(null);
    setFieldErrors({});
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, boolean> = {};
    if (!fields.email || !EMAIL_RE.test(fields.email)) next.email = true;
    if (!fields.password || fields.password.length < 6) next.password = true;
    if (tab === "signup" && !fields.name?.trim()) next.name = true;
    setFieldErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    setError(null);

    if (tab === "signup") {
      const { data, error: signUpError } = await insforge.auth.signUp({
        email: fields.email,
        password: fields.password,
        name: fields.name.trim(),
      });
      if (signUpError) {
        setError(signUpError.message);
        setSubmitting(false);
        return;
      }
      if (data?.requireEmailVerification) {
        // Verification method is "code": stay in the flow and ask for the
        // 6-digit code sent to the email address.
        setPendingVerify(fields.email);
        setSubmitting(false);
        return;
      }
      await refresh();
      router.push(sanitizeFrom(searchParams.get("from")));
      return;
    }

    const { error: authError } = await insforge.auth.signInWithPassword({
      email: fields.email,
      password: fields.password,
    });
    if (authError) {
      setError(authError.message);
      setSubmitting(false);
      return;
    }

    await refresh();
    router.push(sanitizeFrom(searchParams.get("from")));
  };

  const submitCode = async (e: FormEvent) => {
    e.preventDefault();
    if (!pendingVerify || code.trim().length !== 6) return;
    setSubmitting(true);
    setError(null);
    // verifyEmail() saves the session automatically on success.
    const { error: verifyError } = await insforge.auth.verifyEmail({
      email: pendingVerify,
      otp: code.trim(),
    });
    if (verifyError) {
      setError(verifyError.message);
      setSubmitting(false);
      return;
    }
    await refresh();
    router.push(sanitizeFrom(searchParams.get("from")));
  };

  const resendCode = async () => {
    if (!pendingVerify) return;
    const { error: resendError } = await insforge.auth.resendVerificationEmail({
      email: pendingVerify,
    });
    if (resendError) setError(resendError.message);
    else setResent(true);
  };

  const fieldError = (key: string, message: string) =>
    fieldErrors[key] ? <p className="field-error">{message}</p> : null;

  return (
    <div className="container">
      <div className="auth-card">
        {!pendingVerify && (
        <div className="auth-tabs" role="tablist">
          <button
            role="tab"
            aria-selected={tab === "signin"}
            className={tab === "signin" ? "active" : ""}
            onClick={() => switchTab("signin")}
          >
            Sign in
          </button>
          <button
            role="tab"
            aria-selected={tab === "signup"}
            className={tab === "signup" ? "active" : ""}
            onClick={() => switchTab("signup")}
          >
            Create account
          </button>
        </div>
        )}

        {pendingVerify ? (
          <form className="auth-form" onSubmit={submitCode} noValidate>
            <p className="auth-footnote" style={{ textAlign: "left" }}>
              We sent a 6-digit verification code to{" "}
              <strong>{pendingVerify}</strong>. Enter it below to finish
              creating your account.
            </p>
            <div className="field">
              <label htmlFor="verify-code">Verification code</label>
              <input
                id="verify-code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            {error && <p className="field-error">{error}</p>}
            <button
              type="submit"
              className="btn btn-dark"
              disabled={submitting || code.trim().length !== 6}
            >
              {submitting ? "Verifying…" : "Verify & sign in"}
            </button>
            <p className="auth-footnote">
              {resent ? (
                "Code resent — check your inbox."
              ) : (
                <>
                  Didn&apos;t get it?{" "}
                  <button
                    type="button"
                    className="auth-resend"
                    onClick={resendCode}
                  >
                    Resend code
                  </button>
                </>
              )}
            </p>
          </form>
        ) : (
        <form className="auth-form" onSubmit={submit} noValidate>
          {tab === "signup" && (
            <div className="field">
              <label htmlFor="su-name">Full name</label>
              <input
                id="su-name"
                type="text"
                value={fields.name ?? ""}
                onChange={(e) => set("name", e.target.value)}
                className={fieldErrors.name ? "invalid" : undefined}
              />
              {fieldError("name", "Please enter your name.")}
            </div>
          )}
          <div className="field">
            <label htmlFor={`${tab}-email`}>Email</label>
            <input
              id={`${tab}-email`}
              type="email"
              value={fields.email ?? ""}
              onChange={(e) => set("email", e.target.value)}
              className={fieldErrors.email ? "invalid" : undefined}
            />
            {fieldError("email", "Please enter a valid email address.")}
          </div>
          <div className="field">
            <label htmlFor={`${tab}-password`}>Password</label>
            <input
              id={`${tab}-password`}
              type="password"
              value={fields.password ?? ""}
              onChange={(e) => set("password", e.target.value)}
              className={fieldErrors.password ? "invalid" : undefined}
            />
            {fieldError(
              "password",
              "Password must be at least 6 characters."
            )}
          </div>
          {error && <p className="field-error">{error}</p>}
          <button type="submit" className="btn btn-dark" disabled={submitting}>
            {submitting
              ? "One moment…"
              : tab === "signin"
                ? "Sign in"
                : "Create account"}
          </button>
          {tab === "signin" ? (
            <p className="auth-footnote">Forgot your password?</p>
          ) : (
            <p className="auth-footnote">
              By creating an account you agree to our terms.
            </p>
          )}
        </form>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
