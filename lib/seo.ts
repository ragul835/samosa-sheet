import type { Metadata } from "next";
import { site, socialLinks } from "@/lib/site";

export function absoluteUrl(path = "/") {
  return new URL(path, `${site.domain}/`).toString();
}

export function pageMetadata(title: string, description: string, path: string, index = true): Metadata {
  const fullTitle = `${title} | ${site.name}`;
  const image = {
    url: absoluteUrl("/images/banana-leaf-samosas-hero.webp"),
    width: 1672,
    height: 941,
    alt: "Golden triangular samosas served on green banana leaves",
  };
  return {
    title: { absolute: fullTitle },
    description,
    alternates: {
      canonical: absoluteUrl(path),
      languages: {
        "en-IN": absoluteUrl(path),
        "x-default": absoluteUrl(path),
      },
    },
    openGraph: {
      title: fullTitle, description, url: absoluteUrl(path),
      type: "website", locale: "en_IN", siteName: site.name, images: [image],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [image] },
    robots: {
      index, follow: true,
      ...(index ? { googleBot: { index: true, follow: true, "max-image-preview": "large" as const, "max-snippet": -1, "max-video-preview": -1 } } : {}),
    },
  };
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": absoluteUrl("/#organization"),
      name: site.name,
      url: site.domain,
      logo: absoluteUrl("/images/samosa-sheet-logo.png"),
      image: absoluteUrl("/images/banana-leaf-samosas-hero.webp"),
      description:
        "Manufacturer and supplier of ready-made samosa sheets for homes, restaurants, caterers, retailers and wholesale buyers across India.",
      telephone: site.phone,
      email: site.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: site.address,
        addressLocality: site.addressLocality,
        addressRegion: site.addressRegion,
        postalCode: site.postalCode,
        addressCountry: "IN",
      },
      areaServed: [
        { "@type": "City", name: "Chennai" },
        { "@type": "AdministrativeArea", name: "Tamil Nadu" },
        { "@type": "AdministrativeArea", name: "Kerala" },
        { "@type": "AdministrativeArea", name: "Karnataka" },
        { "@type": "AdministrativeArea", name: "Andhra Pradesh" },
        { "@type": "AdministrativeArea", name: "Telangana" },
        { "@type": "AdministrativeArea", name: "Puducherry" },
        { "@type": "Country", name: "India" },
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: site.phone,
        contactType: "sales",
        areaServed: "IN",
        availableLanguage: ["en"],
      },
      sameAs: socialLinks,
    },
    {
      "@type": "WebSite",
      "@id": absoluteUrl("/#website"),
      name: site.name,
      url: site.domain,
      publisher: { "@id": absoluteUrl("/#organization") },
      inLanguage: "en-IN",
    },
  ],
};

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, position) => ({
      "@type": "ListItem",
      position: position + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
