import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Gallery() {
  return (
    <section id="gallery" aria-labelledby="gallery-title" className="section overflow-hidden bg-cream">
      <div className="container-shell">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-leaf-700">From sheet to serving</p>
            <h2 id="gallery-title" className="section-title mt-3">Golden folds. Simple pleasures.</h2>
            <p className="section-copy">A closer look at crisp samosas and the sheets behind them. Find your size, prepare your filling and make something worth sharing.</p>
          </div>
          <Link href="/products/" className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl border border-leaf-700/20 px-5 py-3 font-semibold text-leaf-700 transition hover:bg-white md:self-auto">Explore samosa sheets <ArrowUpRight size={18} aria-hidden="true" /></Link>
        </div>
        <div className="grid items-start gap-6 md:grid-cols-2 lg:gap-8">
          <figure className="overflow-hidden rounded-3xl bg-leaf-900 shadow-soft">
            <div className="relative aspect-[1054/1492] overflow-hidden">
              <Image src="/images/golden-samosas-premium-background-v3.webp" alt="Crisp golden samosas piled in a round stainless steel serving tray" fill loading="lazy" sizes="(max-width: 767px) 100vw, 50vw" className="object-cover" />
            </div>
            <figcaption className="px-6 py-5 text-green-50"><p className="text-lg font-bold">Ready for the table</p><p className="mt-1 text-sm leading-6 text-green-100">From everyday snacks to a generous spread for guests.</p></figcaption>
          </figure>
          <figure className="overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-soft">
            <a href="/images/samosa-sheets-promotional-poster.webp" target="_blank" rel="noopener noreferrer" className="block" aria-label="View the full samosa sheets promotional poster (opens in a new tab)">
              <Image src="/images/samosa-sheets-promotional-poster.webp" alt="Karpagam Foods samosa sheets poster: easy to peel, non-stick, 100 sheets per pack; Nerkundram, Chennai; phone 90953 33944" width={1054} height={1492} loading="lazy" sizes="(max-width: 767px) 100vw, 50vw" className="h-auto w-full" />
            </a>
            <figcaption className="px-6 py-5"><p className="text-lg font-bold text-gray-900">Samosa sheets, at a glance</p><a href="/images/samosa-sheets-promotional-poster.webp" target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-sm font-semibold leading-6 text-leaf-700 underline underline-offset-4">View full-size poster <ArrowUpRight size={15} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a></figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
