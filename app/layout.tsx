import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth";
import { CartProvider } from "@/lib/store";
import { ToastProvider } from "@/components/Toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "VELOUR — Premium Fashion for Women & Men",
    template: "%s | VELOUR",
  },
  description:
    "Quietly luxurious essentials for men and women — considered fabrics, honest construction, timeless silhouettes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <Navbar />
              <main>{children}</main>
              <Footer />
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
