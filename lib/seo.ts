import { site, socialLinks } from "@/lib/site";

export function absoluteUrl(path = "/") {
  return new URL(path, `${site.domain}/`).toString();
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": absoluteUrl("/#organization"),
      name: site.name,
      url: site.domain,
      logo: absoluteUrl("/images/samosa-sheets-hero.png"),
      image: absoluteUrl("/images/samosa-sheets-hero.png"),
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
      areaServed: {
        "@type": "Country",
        name: "India",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: site.phone,
        contactType: "sales",
        areaServed: "IN",
        availableLanguage: ["en", "ta"],
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
