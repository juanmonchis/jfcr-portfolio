/*
 * ════════════════════════════════════════════════════════════════════════════
 * FILE: components/Hero.tsx
 * ════════════════════════════════════════════════════════════════════════════
 * WHAT IT DOES:
 *   The full-screen hero section at the top of the homepage.
 *   Contains the logo, nav links, headline, subtitle, and CTA button.
 *   Also has a reserved slot (HERO_INTERACTIVE_SLOT) for future animations.
 *
 * 🎨 DESIGN — things to edit here:
 *   - Section background    → bg-[#DDED3C] (the lime yellow-green)
 *   - Headline classes      → type-homepage-hero controls the font style
 *                             (defined in globals.css)
 *   - CTA button style      → border-2, rounded-full, hover colors
 *   - Nav link style        → font size, opacity, spacing
 *   - Spacing               → min-h-screen, pt-20, pb-16, mb-6, mb-10, etc.
 *
 * ✏️  CONTENT — things to edit here:
 *   - Headline text         → "Hey, I am Juan Felipe 🐸"
 *   - Subtitle text         → "A digital designer focused on..."
 *   - CTA label & href      → "About Me" + #about
 *   - Nav links             → Blog, Work
 *
 * ℹ️  INTERACTIVE SLOT:
 *   Look for the {/* HERO_INTERACTIVE_SLOT *\/} comment near the bottom.
 *   Drop any animated component there — it won't affect the rest of the layout.
 * ════════════════════════════════════════════════════════════════════════════
 */

import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import HeroFrog from "@/components/HeroFrog";
import HeroStar from "@/components/HeroStar";

export default function Hero() {
  return (
    <section className="relative bg-[#DDED3C] w-full min-h-screen flex flex-col px-6 md:px-12 lg:px-20 py-8">
      <SiteHeader logoSize={100} />

      {/* Main hero content */}
      <div className="flex-1 flex flex-col items-center justify-center pt-36 pb-16">
        <div className="w-full max-w-[1000px] flex flex-col items-center text-center gap-10">
          <div className="relative w-full">
            <HeroFrog />
            <h1 className="w-full type-homepage-hero">
              Hey, I am Juan Felipe
            </h1>
          </div>
          <p className="text-[#0C0D1F]/80 max-w-xl type-paragraph">
            A digital designer focused on exceptional products, brands and sometimes silly animations.
          </p>
          <div className="flex items-center gap-8">
            <Link
              href="/about"
              className="inline-flex items-center gap-1 border border-[#0C0D1F] text-[#0C0D1F] px-8 py-3 rounded-full hover:bg-[#0C0D1F] hover:text-[#DDED3C] transition-colors duration-300 ease-in-out type-cta"
            >
              About Me
            </Link>
            <HeroStar />
          </div>
        </div>

          {/* HERO_INTERACTIVE_SLOT */}
        </div>
    </section>

  );
}
