import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { OrderProvider } from "@/components/OrderWhatsApp";

export default function MarketingLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <OrderProvider>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </OrderProvider>
  );
}
