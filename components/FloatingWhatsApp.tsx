import { MessageCircle } from "lucide-react";
import { OrderWhatsAppButton } from "@/components/OrderWhatsApp";
export default function FloatingWhatsApp() {
  return (
    <OrderWhatsAppButton ariaLabel="Order on WhatsApp" className="group fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-green-600 text-white shadow-lg transition hover:scale-105 hover:bg-green-700">
      <MessageCircle size={28} aria-hidden="true"/>
      <span className="pointer-events-none absolute right-16 hidden whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white shadow-lg group-hover:block">Order on WhatsApp</span>
    </OrderWhatsAppButton>
  );
}
