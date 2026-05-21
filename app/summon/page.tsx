"use client";

import { useEffect, useRef } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import logoLight from "@/public/logo-light.json";

export default function SummonPage() {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get("to");
    if (!to) return;

    lottieRef.current?.goToAndPlay(0, true);

    // Navigate after one logo animation cycle (~2.3s) with a safety fallback
    const timer = setTimeout(() => {
      window.location.href = to;
    }, 2300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        background: "#0c0d1f",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
      }}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={logoLight}
        autoplay
        loop={false}
        style={{ width: 200, height: 200 }}
      />
      <p
        style={{
          color: "rgba(255,255,255,0.35)",
          fontFamily: "sans-serif",
          fontSize: "0.75rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        Summoning…
      </p>
    </div>
  );
}
