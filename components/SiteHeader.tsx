"use client";

import { useState } from "react";
import Link from "next/link";
import LogoIcon, { LogoVariant } from "@/components/LogoIcon";

interface SiteHeaderProps {
  logoVariant?: LogoVariant;
  logoSize?: number;
  color?: string;
}

const NAV_LINKS = [
  { label: "MY WORK",    href: "/#projects" },
  { label: "DRAFTS",     href: "/blog" },
  { label: "WHO'S THAT", href: "/about" },
];

const SOCIALS = [
  {
    label: "Letterboxd",
    href: "https://letterboxd.com/jfcr/",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="8"  cy="12" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="16" cy="12" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/juanfelipecadavid/",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M7 10v7M7 7v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M11 17v-4c0-1.5 1-2 2-2s2 .5 2 2v4M11 10v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Dribbble",
    href: "https://dribbble.com/jfcr",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M5 7.5c2 1.5 4.5 2 7.5 2s5.5-.5 7-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M4.5 13.5c2-.5 5 0 7.5 2s4 4.5 4.5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M9 3c1 3 1.5 7 1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Behance",
    href: "https://behance.net/jfcr",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 7h5.5C11.4 7 13 8 13 10c0 1.2-.7 2-1.7 2.4C12.6 12.8 13.5 14 13.5 15.2 13.5 17.3 11.9 18 10 18H4V7z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none" />
        <path d="M4 12.5h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M15.5 10h5M15.5 14.5h5c0 0-.2 2-2.5 2s-2.5-2-2.5-2 .2-4 2.5-4 2.5 2 2.5 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/jfcr_/",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
];

// ─── Shared pill used in both the desktop header and the mobile overlay ──────
function NavPill({
  children,
  onClick,
  href,
  active = false,
  color = "#0C0D1F",
  size = "md",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  active?: boolean;
  color?: string;
  size?: "sm" | "md";
}) {
  const base =
    size === "sm"
      ? "flex items-center gap-2 border rounded-full transition-colors duration-200 cursor-pointer select-none px-4 py-1.5"
      : "w-full max-w-[520px] flex items-center gap-4 border-2 rounded-full transition-colors duration-200 cursor-pointer select-none px-7 py-4";

  const style = {
    borderColor: color,
    background: active ? color : "transparent",
    color: active ? (color === "#0C0D1F" ? "#DDED3C" : "#0C0D1F") : color,
  };

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={base} style={style}>
        {children}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className={base} style={style}>
      {children}
    </button>
  );
}

export default function SiteHeader({
  logoVariant = "dark",
  logoSize = 70,
  color = "#0C0D1F",
}: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const [socialsOpen, setSocialsOpen] = useState(false);

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="w-full px-6 md:px-12 lg:px-20 pt-[20vw] pb-4 md:pt-8 md:pb-6 flex items-start justify-between">
          <LogoIcon variant={logoVariant} size={logoSize} />

          {/* ── Desktop nav — permanent pill stack, top-right ─────────────── */}
          <nav className="hidden md:flex flex-col items-end gap-2">
            {NAV_LINKS.map(({ label, href }) => (
              <NavPill key={label} href={href} color={color} size="sm">
                <span className="text-sm">→</span>
                <span className="type-tag" style={{ color: "inherit" }}>{label}</span>
              </NavPill>
            ))}

            {/* Divider */}
            <div className="w-full h-px my-0.5" style={{ backgroundColor: `${color}33` }} />

            {/* Socials pill — desktop */}
            <div className="relative">
              <NavPill
                color={color}
                size="sm"
                active={socialsOpen}
                onClick={() => setSocialsOpen(s => !s)}
              >
                <span className="text-sm">{socialsOpen ? "↓" : "→"}</span>
                <span className="type-tag" style={{ color: "inherit" }}>SOCIALS</span>
              </NavPill>

              {/* Dropdown */}
              {socialsOpen && (
                <div
                  className="absolute right-0 top-full mt-2 flex items-center gap-2 px-3 py-2 rounded-2xl border"
                  style={{ borderColor: `${color}33`, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)" }}
                >
                  {SOCIALS.map(({ label, href, icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      title={label}
                      className="w-8 h-8 flex items-center justify-center rounded-full border hover:opacity-60 transition-opacity duration-200"
                      style={{ borderColor: `${color}55`, color }}
                    >
                      {icon}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* ── Mobile hamburger ──────────────────────────────────────────── */}
          <button
            className="md:hidden flex flex-col justify-center items-center gap-[5px] w-10 h-10"
            onClick={() => { setOpen(true); setSocialsOpen(false); }}
            aria-label="Open menu"
          >
            <span className="block w-6 h-[2px] rounded-full" style={{ backgroundColor: color }} />
            <span className="block w-6 h-[2px] rounded-full" style={{ backgroundColor: color }} />
          </button>
        </div>
      </header>

      {/* ── Mobile full-screen overlay ──────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-[200] flex flex-col transition-opacity duration-300 md:hidden ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ backgroundColor: "#DDED3C" }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 pt-8 pb-4">
          <LogoIcon variant="dark" size={logoSize} />
          <button onClick={() => setOpen(false)} aria-label="Close menu" className="w-10 h-10 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <line x1="4" y1="4" x2="20" y2="20" stroke="#0C0D1F" strokeWidth="2" strokeLinecap="round" />
              <line x1="20" y1="4" x2="4" y2="20" stroke="#0C0D1F" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Pill list */}
        <nav className="flex flex-col items-center justify-center flex-1 gap-4 px-6 pb-8">
          {NAV_LINKS.map(({ label, href }) => (
            <NavPill key={label} href={href} color="#0C0D1F" size="md" onClick={() => setOpen(false)}>
              <span className="text-xl">→</span>
              <span className="flex-1 text-center type-cta tracking-widest uppercase" style={{ color: "inherit" }}>
                {label}
              </span>
            </NavPill>
          ))}

          {/* Divider */}
          <div className="w-full max-w-[520px] h-[2px] bg-[#0C0D1F]/20 my-1" />

          {/* Socials */}
          <div className="w-full max-w-[520px]">
            <NavPill
              color="#0C0D1F"
              size="md"
              active={socialsOpen}
              onClick={() => setSocialsOpen(s => !s)}
            >
              <span className="text-xl">{socialsOpen ? "↓" : "→"}</span>
              <span className="flex-1 text-center type-cta tracking-widest uppercase" style={{ color: "inherit" }}>
                SOCIALS
              </span>
            </NavPill>

            <div
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{ maxHeight: socialsOpen ? 80 : 0, opacity: socialsOpen ? 1 : 0 }}
            >
              <div className="flex items-center justify-center gap-5 pt-4">
                {SOCIALS.map(({ label, href, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="w-11 h-11 flex items-center justify-center rounded-full border-2 border-[#0C0D1F] hover:bg-[#0C0D1F] hover:text-[#DDED3C] transition-colors duration-200"
                    style={{ color: "#0C0D1F" }}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
