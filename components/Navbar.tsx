"use client";

import { Menu, MessageCircle, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { OrderWhatsAppButton } from "@/components/OrderWhatsApp";
import { site } from "@/lib/site";

const navigation = [
  ["Home", "/"],
  ["Products", "/products/"],
  ["How to Use", "/how-to-use/"],
  ["About", "/about/"],
  ["Bulk Orders", "/wholesale/"],
  ["Contact", "/contact/"],
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const closeOnDesktop = () => {
      if (window.innerWidth >= 1280) setOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", closeOnDesktop);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", closeOnDesktop);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="container-shell flex min-h-[72px] items-center gap-4 py-3">
        <Link href="/" onClick={() => setOpen(false)} className="flex shrink-0 items-center gap-3 rounded-lg font-bold text-gray-900" aria-label={`${site.name} home`}>
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-500 text-sm font-black text-gray-950 shadow-sm" aria-hidden="true">SF</span>
          <span className="whitespace-nowrap text-lg">{site.name}</span>
        </Link>

        <nav aria-label="Primary navigation" className="ml-auto hidden items-center gap-1 xl:flex">
          {navigation.map(([label, href]) => (
            <Link key={href} href={href} aria-current={pathname === href.replace(/\/$/, "") || (href === "/" && pathname === "/") ? "page" : undefined} className="whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-brand-50 hover:text-brand-700 aria-[current=page]:bg-brand-50 aria-[current=page]:text-brand-700">
              {label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 xl:ml-3">
          <OrderWhatsAppButton className="btn-whatsapp hidden md:inline-flex">
            <MessageCircle size={18} aria-hidden="true" />
            <span>Order on WhatsApp</span>
          </OrderWhatsAppButton>
          <button
            type="button"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-gray-300 bg-white text-gray-900 transition hover:border-brand-500 hover:bg-brand-50 xl:hidden"
            onClick={() => setOpen((current) => !current)}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-navigation" className="absolute inset-x-0 top-full border-t border-gray-200 bg-white shadow-xl xl:hidden">
          <nav aria-label="Mobile navigation" className="container-shell grid max-h-[calc(100dvh-73px)] gap-1 overflow-y-auto overscroll-contain py-4">
            {navigation.map(([label, href]) => (
              <Link key={href} href={href} aria-current={pathname === href.replace(/\/$/, "") || (href === "/" && pathname === "/") ? "page" : undefined} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 font-semibold text-gray-700 transition hover:bg-brand-50 hover:text-brand-700 aria-[current=page]:bg-brand-50 aria-[current=page]:text-brand-700">
                {label}
              </Link>
            ))}
            <OrderWhatsAppButton onClick={() => setOpen(false)} className="btn-whatsapp mt-2 md:hidden">
              <MessageCircle size={18} aria-hidden="true" />
              Order on WhatsApp
            </OrderWhatsAppButton>
          </nav>
        </div>
      )}
    </header>
  );
}
