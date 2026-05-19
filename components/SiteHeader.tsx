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
  { label: "Work", href: "/#projects" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

export default function SiteHeader({
  logoVariant = "dark",
  logoSize = 70,
  color = "#0C0D1F",
}: SiteHeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="w-full px-6 md:px-12 lg:px-20 pt-[20vw] pb-4 md:pt-8 md:pb-6 flex items-center justify-between">
          <LogoIcon variant={logoVariant} size={logoSize} />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-2">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="group relative type-tag px-4 py-2 transition-colors duration-300"
                style={{ color }}
              >
                <span
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                />
                <span className="relative group-hover:opacity-50 transition-opacity duration-300">
                  {label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center gap-[5px] w-10 h-10"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <span className="block w-6 h-[2px] rounded-full" style={{ backgroundColor: color }} />
            <span className="block w-6 h-[2px] rounded-full" style={{ backgroundColor: color }} />
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-[200] flex flex-col transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ backgroundColor: "#0C0D1F" }}
      >
        <div className="flex items-center justify-between px-6 pt-10 pb-4">
          <LogoIcon variant="light" size={logoSize} />
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="w-10 h-10 flex items-center justify-center"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <line x1="4" y1="4" x2="20" y2="20" stroke="#F2EBD9" strokeWidth="2" strokeLinecap="round" />
              <line x1="20" y1="4" x2="4" y2="20" stroke="#F2EBD9" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col items-start px-6 pt-10 gap-6">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="type-case-title hover:opacity-60 transition-opacity"
              style={{ color: "#F2EBD9" }}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
