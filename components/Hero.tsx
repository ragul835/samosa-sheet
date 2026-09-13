import { CheckCircle2, MessageCircle, Phone, ShoppingBag } from "lucide-react";
import { site } from "@/lib/site";
import Image from "next/image";
import Link from "next/link";
import { OrderWhatsAppButton } from "@/components/OrderWhatsApp";

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-[#fbf7ef] py-12 sm:py-16 md:py-24 lg:py-28">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />
      <div aria-hidden="true" className="absolute -right-40 top-12 h-96 w-96 rounded-full bg-brand-100/40 blur-3xl" />
      <div className="container-shell grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-leaf-800/10 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-leaf-800 shadow-sm backdrop-blur">Fresh • Hygienic • Ready to use</span>
          <h1 className="mt-6 max-w-2xl break-words text-4xl font-extrabold leading-[1.04] tracking-[-0.045em] text-gray-950 sm:text-5xl xl:text-[4rem]">
            <span className="text-brand-600">Fresh samosa sheets.</span><br />Made for the perfect fold.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
            Ready-to-use samosa sheets by {site.name}, Chennai—consistently thin, easy to fold and available in three sizes for homes and professional kitchens.
          </p>
          <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
            <OrderWhatsAppButton className="btn-whatsapp w-full sm:w-auto"><MessageCircle size={19} aria-hidden="true"/> Order on WhatsApp</OrderWhatsAppButton>
            <Link href="/products/" className="btn-primary w-full sm:w-auto"><ShoppingBag size={19} aria-hidden="true"/> View Products</Link>
            <a href={`tel:${site.phone}`} className="btn-secondary w-full sm:w-auto"><Phone size={19} aria-hidden="true"/> Call Now</a>
          </div>
          <div className="mt-8 hidden gap-3 text-sm text-gray-700 sm:grid-cols-3 md:grid">
            {["Ready to Use","Consistent Quality","Bulk Supply Available"].map(x => (
              <div key={x} className="flex items-center gap-2"><CheckCircle2 className="text-leaf-700" size={18}/>{x}</div>
            ))}
          </div>
        </div>
        <div className="relative rounded-[2rem] border border-white/80 bg-white/70 p-2 shadow-[0_30px_80px_rgba(54,43,25,0.16)] sm:p-3">
          <div className="relative overflow-hidden rounded-[1.55rem]">
            <Image src="/images/samosa-sheets-natural-premium-hero-v2.webp" alt="Natural thin samosa sheets beside crisp golden vegetable samosas" width={1672} height={941} preload sizes="(max-width: 1024px) calc(100vw - 2rem), 50vw" className="aspect-[16/9] w-full object-cover" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            <div className="absolute inset-x-3 bottom-3 flex items-end justify-end gap-3 sm:inset-x-5 sm:bottom-5">
              <span className="hidden rounded-full border border-white/40 bg-white/90 px-3 py-2 text-xs font-bold text-leaf-900 shadow-sm sm:inline-flex">100 sheets / pack</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-3 sm:px-4"><span className="text-xs font-bold uppercase tracking-wider text-leaf-800">Made for busy kitchens</span><Link href="#gallery" className="text-sm font-semibold text-gray-900 underline decoration-brand-500 underline-offset-4 hover:text-brand-700">See sheet to serving</Link></div>
        </div>
      </div>
    </section>
  );
}
