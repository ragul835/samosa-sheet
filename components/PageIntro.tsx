import Link from "next/link";

export default function PageIntro({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <header className="bg-cream py-14 md:py-20">
      <div className="container-shell max-w-4xl text-center">
        <nav aria-label="Breadcrumb" className="mb-5 text-sm text-gray-500">
          <Link href="/" className="font-semibold text-leaf-700 hover:text-brand-700">Home</Link>
          <span aria-hidden="true" className="mx-2">/</span>
          <span aria-current="page">{eyebrow}</span>
        </nav>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">{eyebrow}</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">{title}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-600">{copy}</p>
      </div>
    </header>
  );
}
