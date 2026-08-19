import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Drafts",
  description: "Work in progress.",
};

export default function DraftsPage() {
  return (
    <main style={{ background: "#F2EBD9", minHeight: "100vh" }}>
      <SiteHeader logoSize={100} logoVariant="dark" color="#0C0D1F" />
      <section className="px-6 md:px-12 lg:px-20 pt-40 pb-28">
        <div className="max-w-[1000px] mx-auto">
          <p className="type-tag mb-4" style={{ color: "rgba(12,13,31,0.45)" }}>WORK IN PROGRESS</p>
          <h1 className="type-homepage-hero-left mb-10" style={{ color: "#0C0D1F" }}>Drafts</h1>
          <p className="type-paragraph max-w-xl" style={{ color: "rgba(12,13,31,0.5)" }}>
            Coming soon.
          </p>
        </div>
      </section>
    </main>
  );
}
