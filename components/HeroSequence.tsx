"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import HeroFrog from "./HeroFrog";
import HeroStar from "./HeroStar";

const WORDS = ["Hey,", "I", "am", "Juan", "Felipe"];

// ms from animation start when each word fires — "Hey," breathes, then rest accelerates
const WORD_OFFSETS   = [0, 1000, 1180, 1320, 1420];
// animation duration per word in seconds
const WORD_DURATIONS = [1.2, 0.38, 0.28, 0.22, 0.18];

const START_DELAY = 500;
const REST_DELAY  = START_DELAY + WORD_OFFSETS[WORD_OFFSETS.length - 1]
                  + Math.round(WORD_DURATIONS[WORD_DURATIONS.length - 1] * 1000) + 400;

export default function HeroSequence() {
  const [wordCount, setWordCount] = useState(0);
  const [showRest,  setShowRest]  = useState(false);

  useEffect(() => {
    const wordTimers = WORDS.map((_, i) =>
      setTimeout(() => setWordCount(i + 1), START_DELAY + WORD_OFFSETS[i])
    );
    const t = setTimeout(() => setShowRest(true), REST_DELAY);
    return () => { clearTimeout(t); wordTimers.forEach(clearTimeout); };
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center pt-36 pb-16">
      <div className="w-full max-w-[1000px] flex flex-col items-center text-center gap-10">

        <div className="relative w-full">
          <HeroFrog />
          <h1 className="w-full type-homepage-hero">
            {WORDS.slice(0, wordCount).map((word, i) => (
              <span key={word} style={{ display: "inline" }}>
                <span
                  className="hero-word hero-word-in"
                  style={{ marginRight: "0.28em", animationDuration: `${WORD_DURATIONS[i]}s` }}
                >
                  {word}
                </span>
              </span>
            ))}
          </h1>
        </div>

        <p
          className="text-[#0C0D1F]/80 max-w-xl type-paragraph"
          style={{
            opacity:    showRest ? 1 : 0,
            transform:  showRest ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          A digital designer focused on exceptional products, brands and sometimes silly animations.
        </p>

        <div
          className="flex items-center gap-8"
          style={{
            opacity:    showRest ? 1 : 0,
            transform:  showRest ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s 0.15s ease, transform 0.7s 0.15s ease",
          }}
        >
          <Link
            href="/about"
            className="inline-flex items-center gap-1 border border-[#0C0D1F] text-[#0C0D1F] px-8 py-3 rounded-full hover:bg-[#0C0D1F] hover:text-[#DDED3C] transition-colors duration-300 ease-in-out type-cta"
          >
            About Me
          </Link>
          <HeroStar />
        </div>

      </div>
    </div>
  );
}
