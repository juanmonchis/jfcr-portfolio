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
  { label: "MY WORK",   href: "/#projects" },
  { label: "DRAFTS",    href: "/blog" },
  { label: "WHO'S THAT", href: "/about" },
];

const SOCIALS = [
  {
    label: "Letterboxd",
    href: "https://letterboxd.com/jfcr/",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="8"  cy="12" r="7" stroke="#0C0D1F" strokeWidth="2" fill="none" />
        <circle cx="16" cy="12" r="7" stroke="#0C0D1F" strokeWidth="2" fill="none" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/juanfelipecadavid/",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="4" stroke="#0C0D1F" strokeWidth="2" fill="none" />
        <path d="M7 10v7M7 7v.5" stroke="#0C0D1F" strokeWidth="2" strokeLinecap="round" />
        <path d="M11 17v-4c0-1.5 1-2 2-2s2 .5 2 2v4" stroke="#0C0D1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 10v7" stroke="#0C0D1F" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Dribbble",
    href: "https://dribbble.com/jfcr",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="#0C0D1F" strokeWidth="2" fill="none" />
        <path d="M5 7.5c2 1.5 4.5 2 7.5 2s5.5-.5 7-2" stroke="#0C0D1F" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M4.5 13.5c2-.5 5 0 7.5 2s4 4.5 4.5 6" stroke="#0C0D1F" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M9 3c1 3 1.5 7 1 11" stroke="#0C0D1F" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Behance",
    href: "https://behance.net/jfcr",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 7h5.5C11.4 7 13 8 13 10c0 1.2-.7 2-1.7 2.4C12.6 12.8 13.5 14 13.5 15.2 13.5 17.3 11.9 18 10 18H4V7z" stroke="#0C0D1F" strokeWidth="2" strokeLinejoin="round" fill="none" />
        <path d="M4 12.5h6" stroke="#0C0D1F" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M15.5 10h5M15.5 14.5h5c0 0-.2 2-2.5 2s-2.5-2-2.5-2 .2-4 2.5-4 2.5 2 2.5 2" stroke="#0C0D1F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/jfcr_/",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="#0C0D1F" strokeWidth="2" fill="none" />
        <circle cx="12" cy="12" r="4.5" stroke="#0C0D1F" strokeWidth="2" fill="none" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="#0C0D1F" />
      </svg>
    ),
  },
];

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
        <div className="w-full px-6 md:px-12 lg:px-20 pt-[20vw] pb-4 md:pt-8 md:pb-6 flex items-center justify-between">
          <LogoIcon variant={logoVariant} size={logoSize} />

          {/* Hamburger — all screen sizes */}
          <button
            className="flex flex-col justify-center items-center gap-[5px] w-10 h-10"
            onClick={() => { setOpen(true); setSocialsOpen(false); }}
            aria-label="Open menu"
          >
            <span className="block w-6 h-[2px] rounded-full" style={{ backgroundColor: color }} />
            <span className="block w-6 h-[2px] rounded-full" style={{ backgroundColor: color }} />
          </button>
        </div>
      </header>

      {/* Full-screen overlay */}
      <div
        className={`fixed inset-0 z-[200] flex flex-col transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ backgroundColor: "#DDED3C" }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 md:px-12 pt-8 md:pt-10 pb-4">
          <LogoIcon variant="dark" size={logoSize} />
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="w-10 h-10 flex items-center justify-center"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <line x1="4" y1="4" x2="20" y2="20" stroke="#0C0D1F" strokeWidth="2" strokeLinecap="round" />
              <line x1="20" y1="4" x2="4" y2="20" stroke="#0C0D1F" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Nav pills */}
        <nav className="flex flex-col items-center justify-center flex-1 gap-4 px-6 pb-8">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="group w-full max-w-[520px] flex items-center gap-4 border-2 border-[#0C0D1F] rounded-full px-7 py-4 hover:bg-[#0C0D1F] transition-colors duration-200"
            >
              <span className="text-[#0C0D1F] group-hover:text-[#DDED3C] text-xl transition-colors duration-200">→</span>
              <span
                className="flex-1 text-center type-cta tracking-widest uppercase !text-[#0C0D1F] group-hover:!text-[#DDED3C] transition-colors duration-200"
              >
                {label}
              </span>
            </Link>
          ))}

          {/* Divider */}
          <div className="w-full max-w-[520px] h-[2px] bg-[#0C0D1F]/20 my-1" />

          {/* Socials pill */}
          <div className="w-full max-w-[520px]">
            <button
              onClick={() => setSocialsOpen(s => !s)}
              className="group w-full flex items-center gap-4 border-2 border-[#0C0D1F] rounded-full px-7 py-4 hover:bg-[#0C0D1F] transition-colors duration-200"
              style={{ background: socialsOpen ? "#0C0D1F" : "transparent" }}
            >
              <span
                className="text-xl transition-colors duration-200"
                style={{ color: socialsOpen ? "#DDED3C" : "#0C0D1F" }}
              >
                {socialsOpen ? "↓" : "→"}
              </span>
              <span
                className="flex-1 text-center type-cta tracking-widest uppercase transition-colors duration-200"
                style={{ color: socialsOpen ? "#DDED3C" : "#0C0D1F" }}
              >
                SOCIALS
              </span>
            </button>

            {/* Social icon row */}
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
                    className="w-11 h-11 flex items-center justify-center rounded-full border-2 border-[#0C0D1F] hover:bg-[#0C0D1F] hover:[&_svg_*]:stroke-[#DDED3C] hover:[&_circle[fill]]:fill-[#DDED3C] transition-colors duration-200"
                    title={label}
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
