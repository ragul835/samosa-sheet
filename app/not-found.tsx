import Link from "next/link";
import { ArrowLeft, Home, PackageSearch } from "lucide-react";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-cream via-white to-green-50 px-5 py-16">
      <section className="w-full max-w-2xl rounded-[2rem] border border-gray-200 bg-white p-8 text-center shadow-soft sm:p-12" aria-labelledby="not-found-title">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-100 text-brand-700">
          <PackageSearch size={32} aria-hidden="true" />
        </div>
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-brand-700">Error 404</p>
        <h1 id="not-found-title" className="mt-3 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Page not found
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-gray-600 sm:text-lg">
          The page may have moved, the address may be incorrect, or it may no longer exist.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-primary">
            <Home size={18} aria-hidden="true" /> Return home
          </Link>
          <Link href="/products/" className="btn-secondary">
            View products
          </Link>
          <Link href="/contact/" className="btn-secondary">
            Contact us <ArrowLeft className="rotate-180" size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
