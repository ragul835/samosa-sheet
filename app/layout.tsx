import type { Metadata } from "next";
import "./globals.css";
import JsonLd from "@/components/JsonLd";
import { site } from "@/lib/site";
import { organizationJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: `${site.brand} | Samosa Sheets & Patti Supplier in South India`,
    template: `%s | ${site.name}`,
  },
  description:
    "Karpagam Foods supplies ready-made samosa sheets and samosa patti from Chennai to homes, restaurants, caterers and wholesale buyers across South India and India.",
  keywords: [
    "SamosaSheet", "Samosa Sheet", "samosa sheet",
    "ready made samosa sheets",
    "samosa sheet supplier",
    "samosa patti",
    "samosa wrapper",
    "samosa sheet wholesale India",
    "ready made samosa patti",
    "samosa sheets India",
    "samosa wrapper supplier India",
    "samosa sheets Chennai", "samosa patti Tamil Nadu", "samosa sheet supplier South India", "samosa sheets Kerala", "samosa sheets Karnataka", "samosa sheets Andhra Pradesh", "samosa sheets Telangana", "samosa sheets Puducherry",
    "Indian samosa sheets", "samosa wrapper manufacturer", "bulk samosa pastry supplier"
  ],
  openGraph: {
    title: `${site.brand} | Samosa Sheets & Patti Supplier in South India`,
    description: "Ready-made samosa sheets from Chennai for retail and wholesale supply across Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, Telangana and India.",
    type: "website",
    locale: "en_IN",
    url: site.domain,
    siteName: site.name,
    images: [{ url: "/images/banana-leaf-samosas-hero.webp", width: 1672, height: 941, alt: "Golden samosas served on green banana leaves" }]
  },
  twitter: { card: "summary_large_image", title: `${site.brand} | Samosa Sheets & Patti Supplier in South India`, description: "Ready-made samosa sheets from Chennai for retail and wholesale supply across South India and India.", images: ["/images/banana-leaf-samosas-hero.webp"] },
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
