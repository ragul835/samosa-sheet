import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const processGallery = [
  {
    src: "/images/samosa-sheets-rectangle-separation-v2.webp",
    alt: "A thin rectangular samosa sheet being gently lifted from a fresh stack",
    title: "Delicately thin",
    copy: "Easy-to-separate sheets with a light, flexible texture.",
  },
  {
    src: "/images/samosa-sheet-rectangle-folding-v2.webp",
    alt: "Hands folding a thin rectangular samosa sheet around vegetable filling",
    title: "Simple to shape",
    copy: "Flexible sheets that fold neatly around your chosen filling.",
  },
  {
    src: "/images/samosas-premium-serving.webp",
    alt: "Golden samosas served with mint and tamarind chutneys",
    title: "Crisp, golden results",
    copy: "A delicate shell with the satisfying crunch every serving deserves.",
  },
];

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
        <div className="grid gap-6 md:grid-cols-3">
          {processGallery.map((image) => (
            <figure key={image.src} className="group overflow-hidden rounded-3xl border border-brand-100 bg-white shadow-soft">
              <div className="relative aspect-[3/2] overflow-hidden bg-stone-100">
                <Image src={image.src} alt={image.alt} fill loading="lazy" sizes="(max-width: 767px) calc(100vw - 2rem), (max-width: 1279px) calc(33vw - 2rem), 389px" className="object-cover transition duration-500 group-hover:scale-[1.025]" />
              </div>
              <figcaption className="px-5 py-5 sm:px-6">
                <p className="text-lg font-bold text-gray-900">{image.title}</p>
                <p className="mt-1 text-sm leading-6 text-gray-600">{image.copy}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-8 grid items-start gap-6 md:grid-cols-2 lg:gap-8">
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
