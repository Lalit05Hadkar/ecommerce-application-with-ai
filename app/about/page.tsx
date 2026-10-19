import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="static-page">
      <p className="micro-label">Our story</p>
      <h1>About VELOUR</h1>
      <p>
        VELOUR began with a simple conviction: that the clothes you reach for
        every day should be the best-made things you own. We design quiet,
        luxurious essentials for women and men — pieces defined by fabric, fit,
        and finish rather than logos and noise.
      </p>
      <p>
        Every collection is built in small runs from considered materials —
        washed silk, extra-fine merino, Japanese selvedge denim — and cut to
        outlast the season it arrives in. This is a demo storefront; the
        philosophy, however, is real.
      </p>
    </div>
  );
}
