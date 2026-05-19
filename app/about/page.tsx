import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import AboutSection from "@/components/AboutSection";

export const metadata: Metadata = {
  title: "About",
  description: "Product designer, brand strategist, and mentor. D&AD Wood Pencil & Webby Award winner. ADPList Top 100 Most Influential Mentors 2024.",
  openGraph: {
    title: "About — JFCR",
    description: "Product designer, brand strategist, and mentor. D&AD Wood Pencil & Webby Award winner.",
    url: "https://www.jfcr.design/about",
  },
};

export default function AboutPage() {
  return (
    <main className="relative">
      <SiteHeader logoSize={100} logoVariant="light" color="#F2EBD9" />
      <AboutSection />
    </main>
  );
}
