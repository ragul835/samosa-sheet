import { Facebook, Instagram, Youtube } from "lucide-react";
import Link from "next/link";
import { site } from "@/lib/site";
import { OrderWhatsAppButton } from "@/components/OrderWhatsApp";
const links = [["Home","/"],["Products","/products/"],["How to Use","/how-to-use/"],["About","/about/"],["Bulk Orders","/wholesale/"],["FAQ","/faq/"],["Contact","/contact/"]];
export default function Footer() {
  return (
    <footer className="bg-leaf-900 py-12 text-green-50">
      <div className="container-shell grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div><div className="text-xl font-bold text-white">{site.name}</div><p className="mt-3 text-sm leading-6 text-green-100">Fresh, ready-made samosa sheets for home, restaurants, catering and wholesale supply.</p></div>
        <div><h3 className="font-bold text-white">Quick Links</h3><div className="mt-3 flex flex-col items-start gap-2 text-sm">{links.map(([label,href]) => <Link className="hover:text-brand-500" key={href} href={href}>{label}</Link>)}</div></div>
        <div className="min-w-0"><h3 className="font-bold text-white">Contact</h3><div className="mt-3 flex min-w-0 flex-col items-start gap-2 text-sm text-green-100"><a href={`tel:${site.phone}`}>{site.phoneDisplay}</a><OrderWhatsAppButton className="text-left hover:text-white">Order on WhatsApp</OrderWhatsAppButton><a href={`mailto:${site.email}`} className="max-w-full break-all">{site.email}</a><span className="break-words">{site.address}</span></div></div>
        <div><h3 className="font-bold text-white">Follow Us</h3><div className="mt-4 flex gap-3"><a aria-label="Instagram" href={site.instagram} target="_blank" rel="noopener noreferrer" className="grid h-11 w-11 place-items-center rounded-full bg-white/10 hover:bg-brand-500 hover:text-gray-950"><Instagram size={20}/></a><a aria-label="Facebook" href={site.facebook} target="_blank" rel="noopener noreferrer" className="grid h-11 w-11 place-items-center rounded-full bg-white/10 hover:bg-brand-500 hover:text-gray-950"><Facebook size={20}/></a><a aria-label="YouTube" href={site.youtube} target="_blank" rel="noopener noreferrer" className="grid h-11 w-11 place-items-center rounded-full bg-white/10 hover:bg-brand-500 hover:text-gray-950"><Youtube size={20}/></a></div></div>
      </div>
      <div className="container-shell mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-green-200 sm:flex-row sm:justify-between"><div>© {new Date().getFullYear()} {site.name}. All Rights Reserved.</div><div className="flex flex-wrap gap-x-4 gap-y-2"><a href="/privacy-policy/">Privacy Policy</a><a href="/terms/">Terms & Conditions</a></div></div>
    </footer>
  );
}
