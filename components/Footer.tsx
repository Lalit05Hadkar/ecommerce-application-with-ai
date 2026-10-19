import Link from "next/link";
import { FacebookIcon, InstagramIcon, XIcon } from "./Icons";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <p className="footer-logo">VELOUR</p>
          <p className="footer-blurb">
            Quietly luxurious essentials for men and women — considered fabrics,
            honest construction, timeless silhouettes.
          </p>
          <div className="footer-social">
            <a href="#" aria-label="Instagram"><InstagramIcon /></a>
            <a href="#" aria-label="X"><XIcon /></a>
            <a href="#" aria-label="Facebook"><FacebookIcon /></a>
          </div>
        </div>
        <div className="footer-col">
          <p className="footer-heading">Shop</p>
          <Link href="/women">Women</Link>
          <Link href="/men">Men</Link>
          <Link href="/cart">Cart</Link>
        </div>
        <div className="footer-col">
          <p className="footer-heading">Company</p>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div className="footer-col">
          <p className="footer-heading">Support &amp; Legal</p>
          <Link href="/privacy">Privacy</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {year} VELOUR. All rights reserved.</p>
      </div>
    </footer>
  );
}
