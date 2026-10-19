"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { money } from "@/lib/format";
import { useAuth } from "@/lib/auth";
import { insforge } from "@/lib/insforge";
import { useCart } from "@/lib/store";
import type { Product } from "@/lib/types";
import {
  AccountIcon,
  BagIcon,
  CloseIcon,
  MenuIcon,
  SearchIcon,
} from "./Icons";
import Img from "./Img";

export default function Navbar() {
  const { count, mounted } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const suggestions = useProductSuggestions(query);
  const { user, authLoading } = useAuth();

  const submitSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <>
      <div className="announcement-bar">
        Free worldwide shipping over $75
      </div>
      <header className="navbar">
        <button
          className="nav-icon-btn nav-hamburger"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          <MenuIcon />
        </button>

        <nav className="nav-links" aria-label="Primary">
          <Link href="/">Home</Link>
          <Link href="/women">Women</Link>
          <Link href="/men">Men</Link>
        </nav>

        <Link href="/" className="nav-logo" aria-label="VELOUR home">
          VELOUR
        </Link>

        <div className="nav-actions">
          <button
            className="nav-icon-btn"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
          >
            <SearchIcon />
          </button>
          <Link
            href={user ? "/profile" : "/login"}
            className="nav-icon-btn nav-account"
            aria-label="Account"
          >
            <AccountIcon />
            {!authLoading && user && (
              <span className="account-dot" aria-hidden="true" />
            )}
          </Link>
          <Link href="/cart" className="nav-icon-btn nav-cart" aria-label="Cart">
            <BagIcon />
            {mounted && count > 0 && (
              <span className="cart-badge">{count}</span>
            )}
          </Link>
        </div>
      </header>

      {/* Full-screen search overlay */}
      <div className={`search-overlay${searchOpen ? " open" : ""}`} aria-hidden={!searchOpen}>
        <button
          className="nav-icon-btn search-close"
          aria-label="Close search"
          onClick={() => setSearchOpen(false)}
        >
          <CloseIcon />
        </button>
        <form className="search-form" onSubmit={submitSearch} role="search">
          <input
            ref={inputRef}
            type="search"
            placeholder="Search VELOUR…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search products"
          />
          <button type="submit" className="btn btn-dark">
            Search
          </button>
        </form>
        {suggestions.length > 0 && (
          <ul className="search-suggestions">
            {suggestions.map((p) => (
              <li key={p.id}>
                <Link href={`/product/${p.id}`} onClick={() => setSearchOpen(false)}>
                  <span className="suggestion-thumb">
                    <Img src={p.images[0]} alt="" width={48} height={60} />
                  </span>
                  <span className="suggestion-name">{p.name}</span>
                  <span className="suggestion-price">{money(p.price)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Mobile drawer */}
      <div
        className={`drawer-backdrop${menuOpen ? " open" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
      <aside className={`drawer${menuOpen ? " open" : ""}`} aria-hidden={!menuOpen}>
        <div className="drawer-head">
          <span className="nav-logo">VELOUR</span>
          <button
            className="nav-icon-btn"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            <CloseIcon />
          </button>
        </div>
        <nav className="drawer-links" aria-label="Mobile" onClick={() => setMenuOpen(false)}>
          <Link href="/">Home</Link>
          <Link href="/women">Women</Link>
          <Link href="/men">Men</Link>
          <Link href="/cart">Cart</Link>
          <Link href={user ? "/profile" : "/login"}>Account</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </aside>
    </>
  );
}

/** Debounced live search suggestions from the products table. */
function useProductSuggestions(query: string): Product[] {
  const [suggestions, setSuggestions] = useState<Product[]>([]);

  useEffect(() => {
    const term = query.trim().replace(/[%,()]/g, " ");
    if (!term) {
      setSuggestions([]);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      const { data, error } = await insforge.database
        .from("products")
        .select("id, name, price, images")
        .ilike("name", `%${term}%`)
        .limit(6);
      if (cancelled) return;
      if (error) {
        console.error("search suggestions failed:", error.message);
        setSuggestions([]);
        return;
      }
      setSuggestions((data ?? []) as unknown as Product[]);
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  return suggestions;
}
