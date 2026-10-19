import Link from "next/link";

/**
 * Full-viewport video hero (server component).
 * Video: public/videos/hero.mp4 (1080p H.264, no audio, faststart),
 * poster/fallback frame: public/images/hero-poster.jpg.
 * If the video is ever removed, swap back to <HeroSlideshow /> in app/page.tsx.
 */
export default function Hero() {
  return (
    <section className="hero">
      <video
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/hero-poster.jpg"
        aria-label="VELOUR seasonal editorial"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>
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
      <div className="hero-scroll">Scroll</div>
    </section>
  );
}
