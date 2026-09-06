import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: `Ready Made Samosa Sheets | ${site.name}`,
  description:
    "Fresh and ready-to-use samosa sheets for homes, restaurants, catering and wholesale orders. Contact us for bulk supply and delivery.",
  keywords: [
    "ready made samosa sheets",
    "samosa sheet supplier",
    "samosa patti",
    "samosa wrapper",
    "samosa sheet wholesale",
    "ready made samosa patti"
  ],
  openGraph: {
    title: `Ready Made Samosa Sheets | ${site.name}`,
    description: "Fresh, hygienic and ready-to-use samosa sheets for retail and bulk supply.",
    type: "website",
    locale: "en_IN",
    url: site.domain,
    siteName: site.name,
    images: [{ url: "/images/samosa-sheets-hero.png", width: 1536, height: 1024, alt: "Ready-made samosa sheets and golden samosas" }]
  },
  twitter: { card: "summary_large_image", title: `Ready Made Samosa Sheets | ${site.name}`, description: "Fresh, hygienic and ready-to-use samosa sheets for retail and bulk supply.", images: ["/images/samosa-sheets-hero.png"] },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <body>{children}</body>
    </html>
  );
}
