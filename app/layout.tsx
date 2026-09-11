import type { Metadata } from "next";
import "./globals.css";
import JsonLd from "@/components/JsonLd";
import { site } from "@/lib/site";
import { organizationJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: `Ready-Made Samosa Sheets in India | ${site.name}`,
    template: `%s | ${site.name}`,
  },
  description:
    "Ready-made samosa sheets for homes, restaurants, caterers and wholesale buyers across India. Contact us for retail and bulk supply details.",
  keywords: [
    "ready made samosa sheets",
    "samosa sheet supplier",
    "samosa patti",
    "samosa wrapper",
    "samosa sheet wholesale India",
    "ready made samosa patti",
    "samosa sheets India",
    "samosa wrapper supplier India"
  ],
  openGraph: {
    title: `Ready Made Samosa Sheets | ${site.name}`,
    description: "Fresh, hygienic and ready-to-use samosa sheets for retail and wholesale supply across India.",
    type: "website",
    locale: "en_IN",
    url: site.domain,
    siteName: site.name,
    images: [{ url: "/images/banana-leaf-samosas-hero.webp", width: 1672, height: 941, alt: "Golden samosas served on green banana leaves" }]
  },
  twitter: { card: "summary_large_image", title: `Ready-Made Samosa Sheets in India | ${site.name}`, description: "Fresh, hygienic and ready-to-use samosa sheets for retail and wholesale supply across India.", images: ["/images/banana-leaf-samosas-hero.webp"] },
  robots: { index: true, follow: true },
  category: "Food supplier",
  referrer: "strict-origin-when-cross-origin",
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <body>
        <JsonLd data={organizationJsonLd} />
        {children}
      </body>
    </html>
  );
}
