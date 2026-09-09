const env = (key: string, fallback: string) => process.env[key] || fallback;

export const site = {
  name: env("NEXT_PUBLIC_BUSINESS_NAME", "Samosa Fresh"),
  phoneDisplay: env("NEXT_PUBLIC_PHONE_DISPLAY", "+91 90803 33944"),
  phone: env("NEXT_PUBLIC_PHONE", "+919080333944"),
  whatsappDisplay: env("NEXT_PUBLIC_WHATSAPP_DISPLAY", "+91 90803 33944"),
  whatsapp: env("NEXT_PUBLIC_WHATSAPP", "919080333944"),
  email: env("NEXT_PUBLIC_EMAIL", "orders@samosasheet.com"),
  address: env(
    "NEXT_PUBLIC_ADDRESS",
    "No. 88, 7th Street, Azhagammal Nagar, Nerkundram, Chennai – 600107",
  ),
  addressLocality: env("NEXT_PUBLIC_ADDRESS_LOCALITY", "Chennai"),
  addressRegion: env("NEXT_PUBLIC_ADDRESS_REGION", "Tamil Nadu"),
  postalCode: env("NEXT_PUBLIC_POSTAL_CODE", "600107"),
  hours: env("NEXT_PUBLIC_HOURS", "Monday – Saturday, 9:00 AM – 7:00 PM"),
  domain: env("NEXT_PUBLIC_SITE_URL", "https://samosasheet.com").replace(/\/$/, ""),
  instagram: env("NEXT_PUBLIC_INSTAGRAM", "https://instagram.com"),
  facebook: env("NEXT_PUBLIC_FACEBOOK", "https://facebook.com"),
  youtube: env("NEXT_PUBLIC_YOUTUBE", "https://youtube.com")
};

const isBusinessSocialUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.pathname !== "/" && !url.pathname.includes("yourbusiness");
  } catch {
    return false;
  }
};

export const socialLinks = [site.instagram, site.facebook, site.youtube].filter(isBusinessSocialUrl);

export function waLink(message: string) {
  const companyNumber = site.whatsapp.replace(/\D/g, "");
  if (!/^\d{10,15}$/.test(companyNumber)) {
    throw new Error("NEXT_PUBLIC_WHATSAPP must contain a valid number with country code.");
  }
  return `https://wa.me/${companyNumber}?text=${encodeURIComponent(message.trim())}`;
}

export function orderWaLink(
  product: { name: string; size: string; quantity: string },
  customer: { packs: number; customerPhone: string; address: string },
) {
  return waLink(`Hello ${site.name},

I would like to place an order.

Product: ${product.name}
Size: ${product.size}
Pack size: ${product.quantity}
Quantity: ${customer.packs} pack${customer.packs === 1 ? "" : "s"}
Customer phone: ${customer.customerPhone}
Delivery address: ${customer.address}

Please confirm the price, availability, payment method and delivery details.`);
}

export const directionsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address)}`;
export const mapsEmbedLink = `https://www.google.com/maps?q=${encodeURIComponent(site.address)}&output=embed`;
