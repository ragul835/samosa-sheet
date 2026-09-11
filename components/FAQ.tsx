import { ChevronDown } from "lucide-react";
import { faqs } from "@/data/faqs";
export default function FAQ() {
  return (
    <section id="faq" className="section bg-white"><div className="container-shell max-w-4xl">
      <div className="text-center"><h2 className="section-title">Frequently Asked Questions</h2><p className="section-copy mx-auto">Common questions about storage, ordering and bulk supply.</p></div>
      <div className="mt-10 space-y-3">{faqs.map((x,i) => <details key={x.q} name="samosa-faq" open={i === 0} className="group overflow-hidden rounded-2xl border border-gray-200">
        <summary className="flex min-h-14 w-full cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-semibold hover:bg-gray-50 [&::-webkit-details-marker]:hidden">{x.q}<ChevronDown aria-hidden="true" className="shrink-0 transition group-open:rotate-180" size={20}/></summary>
        <div id={`faq-answer-${i}`} className="border-t border-gray-100 px-5 py-4 text-sm leading-6 text-gray-600">{x.a}</div>
      </details>)}</div>
    </div></section>
  );
}
