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

    const timer = setTimeout(() => {
      window.location.href = to;
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        background: "#0c0d1f",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ position: "relative", width: 300, height: 300 }}>
        {/* Lottie centered inside the spinning circle */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Lottie
            lottieRef={lottieRef}
            animationData={logoLight}
            autoplay
            loop={false}
            style={{ width: 200, height: 200 }}
          />
        </div>

        {/* Spinning circular text — same arch technique as the card pack circle */}
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            overflow: "visible",
            pointerEvents: "none",
          }}
          viewBox="0 0 300 300"
        >
          <defs>
            {/* Arc sitting on a circle of r≈120 centred at (150,150) */}
            <path id="summon-arch" d="M 46,90 Q 150,-30 254,90" />
          </defs>
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 150 150"
              to="360 150 150"
              dur="8s"
              repeatCount="indefinite"
            />
            {[0, 120, 240].map((deg) => (
              <g key={deg} transform={`rotate(${deg} 150 150)`}>
                <text
                  fill="#F5EFE0"
                  fontSize="16"
                  fontWeight="800"
                  textAnchor="middle"
                  style={{
                    fontFamily: "var(--font-migra), serif",
                    userSelect: "none",
                    WebkitUserSelect: "none",
                  }}
                >
                  <textPath href="#summon-arch" startOffset="50%">
                    summoning •
                  </textPath>
                </text>
              </g>
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}
