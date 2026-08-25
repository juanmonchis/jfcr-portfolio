import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import AboutSection from "@/components/AboutSection";
import LogoIcon from "@/components/LogoIcon";

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
      <SiteHeader logoSize={100} logoVariant="light" color="#F2EBD9" mobileOverlayColor="#0C0D1F" mobileNavColor="#F2EBD9" mobileLogoVariant="light" />
      <AboutSection />
      <footer className="rounded-tl-2xl rounded-tr-2xl" style={{ padding: "clamp(48px, 8vw, 96px) clamp(24px, 6vw, 80px)", backgroundColor: "#0C0D1F", backgroundImage: "url('/images/footer-gradient.svg')", backgroundRepeat: "no-repeat", backgroundPosition: "center bottom", backgroundSize: "100% auto" }}>
        <div style={{ position: "relative", border: "1px solid #DDED3C", borderRadius: 4, padding: "clamp(48px, 6vw, 80px) clamp(24px, 4vw, 60px)", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.75rem" }}>
          {([
            { style: { top: 0,    left: 0    }, t: "translate(-50%, -50%)" },
            { style: { top: 0,    right: 0   }, t: "translate(50%,  -50%)" },
            { style: { bottom: 0, right: 0   }, t: "translate(50%,   50%)" },
            { style: { bottom: 0, left: 0    }, t: "translate(-50%,  50%)" },
          ]).map(({ style: corner, t }, i) => (
            <svg key={i} width="72" height="72" viewBox="0 0 117 117" fill="none" style={{ position: "absolute", transform: t, ...corner }}>
              <path d="M58.157 116.314L60.8792 62.526L60.7942 60.5742L116.314 58.157L60.5833 55.7306L58.157 0L55.7398 55.5197L53.7879 55.4347L0 58.157L53.7879 60.8792L55.5097 60.8042L55.4347 62.526L58.157 116.314Z" fill="#DDED3C"/>
            </svg>
          ))}
          <div style={{ filter: "brightness(0) saturate(100%) invert(95%) sepia(60%) saturate(500%) hue-rotate(18deg) brightness(1.05)" }}>
            <LogoIcon variant="light" size={80} cropPx={12} noLink alwaysPlay />
          </div>
          <p style={{ fontFamily: "var(--font-migra), serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 400, color: "#DDED3C", textAlign: "center", lineHeight: 1.1, margin: 0 }}>
            Thanks for stopping by!
          </p>
          <div style={{ display: "flex", gap: "clamp(1.5rem, 4vw, 3rem)", alignItems: "center" }}>
            {[
              { label: "Instagram",  href: "https://www.instagram.com/jfcr_/" },
              { label: "LinkedIn",   href: "https://www.linkedin.com/in/jfcrco/" },
              { label: "Letterboxd", href: "https://letterboxd.com/jfcr/" },
            ].map(({ label, href }) => (
              <Link key={label} href={href} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-telegraf), sans-serif", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#F2EBD9", textDecoration: "none" }}
                className="hover:opacity-60 transition-opacity">
                {label}
              </Link>
            ))}
          </div>
          <p style={{ fontFamily: "var(--font-telegraf), sans-serif", fontSize: 11, letterSpacing: "0.08em", color: "rgba(242,235,217,0.25)", margin: 0 }}>JFCR 2025</p>
        </div>
      </footer>
    </main>
  );
}
