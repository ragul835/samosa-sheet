import { CheckCircle2, MessageCircle, Phone, ShoppingBag } from "lucide-react";
import { site } from "@/lib/site";
import Image from "next/image";
import Link from "next/link";
import { OrderWhatsAppButton } from "@/components/OrderWhatsApp";

export default function Hero() {
  return (
    <section id="home" className="overflow-hidden bg-cream py-12 sm:py-16 md:py-24">
      <div className="container-shell grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
        <div>
          <span className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-leaf-700 shadow-sm">Fresh • Hygienic • Ready to Use</span>
          <h1 className="mt-6 break-words text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl md:text-5xl xl:text-6xl">
            Fresh & Ready-to-Use <span className="text-brand-600">Samosa Sheets</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
            Make crispy, delicious samosas easily with high-quality ready-made samosa sheets for homes, restaurants, catering businesses and food outlets across India.
          </p>
          <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
            <OrderWhatsAppButton className="btn-whatsapp w-full sm:w-auto"><MessageCircle size={19} aria-hidden="true"/> Order on WhatsApp</OrderWhatsAppButton>
            <Link href="/products/" className="btn-primary w-full sm:w-auto"><ShoppingBag size={19} aria-hidden="true"/> View Products</Link>
            <a href={`tel:${site.phone}`} className="btn-secondary w-full sm:w-auto"><Phone size={19} aria-hidden="true"/> Call Now</a>
          </div>
          <div className="mt-8 grid gap-3 text-sm text-gray-700 sm:grid-cols-3">
            {["Ready to Use","Consistent Quality","Bulk Supply Available"].map(x => (
              <div key={x} className="flex items-center gap-2"><CheckCircle2 className="text-leaf-700" size={18}/>{x}</div>
            ))}
          </div>
        </div>
        <div className="relative rounded-[2rem] bg-gradient-to-br from-brand-100 via-white to-green-100 p-3 shadow-soft sm:p-5">
          <Image src="/images/samosa-sheets-hero.png" alt="Ready-made samosa sheets with folded and golden fried samosas" width={1536} height={1024} priority sizes="(max-width: 1024px) 100vw, 50vw" className="aspect-[3/2] w-full rounded-[1.5rem] object-cover" />
          <div className="absolute bottom-5 left-5 max-w-[calc(100%-2.5rem)] rounded-2xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur sm:bottom-7 sm:left-7"><div className="text-xs font-bold uppercase tracking-wider text-leaf-700">Made for busy kitchens</div><div className="mt-1 font-bold">50 sheets per pack</div></div>
        </div>
      </div>
    </section>
  );
}
