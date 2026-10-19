"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Img from "./Img";

const SLIDES = [
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=80",
];

/**
 * Full-viewport auto-rotating crossfade hero (slideshow variant).
 * If a hero video is added at public/videos/hero.mp4, this component can be
 * swapped for a server-rendered video hero — see README.
 */
export default function HeroSlideshow() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setActive((i) => (i + 1) % SLIDES.length),
      5000
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero">
      {SLIDES.map((src, i) => (
        <div key={src} className={`hero-slide${i === active ? " active" : ""}`}>
          <Img
            src={src}
            alt={i === 0 ? "VELOUR seasonal editorial" : ""}
            fill
            priority={i === 0}
            sizes="100vw"
          />
        </div>
      ))}
      <div className="hero-overlay" />
      <div className="hero-content">
        <p className="micro-label hero-kicker">Autumn / Winter Collection</p>
        <h1 className="hero-title">
          <span>Quiet luxury,</span>
          <span>worn daily.</span>
        </h1>
        <p className="hero-sub">
          Considered fabrics and timeless silhouettes for women and men.
          Essentials designed to outlast the season.
        </p>
        <div className="hero-ctas">
          <Link href="/women" className="btn btn-light">
            Shop Women
          </Link>
          <Link href="/men" className="btn btn-light">
            Shop Men
          </Link>
        </div>
      </div>
      <div className="hero-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={i === active ? "active" : ""}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setActive(i)}
          />
        ))}
      </div>
      <div className="hero-scroll">Scroll</div>
    </section>
  );
}
