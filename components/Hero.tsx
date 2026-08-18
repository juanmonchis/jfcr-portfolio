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

import SiteHeader from "@/components/SiteHeader";
import HeroSequence from "@/components/HeroSequence";

export default function Hero() {
  return (
    <section className="relative bg-[#DDED3C] w-full min-h-screen flex flex-col px-6 md:px-12 lg:px-20 py-8">
      <SiteHeader logoSize={100} />
      <HeroSequence />
    </section>
  );
}
