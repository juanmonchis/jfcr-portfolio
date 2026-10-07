"use client";

import { useEffect, useState } from "react";

export interface Stat {
  value: string;
  label: string;
}

interface Props {
  items: Stat[];
  valueColor: string;
  labelColor: string;
  /** ms between swaps */
  interval?: number;
  /** ms before the first swap, to stagger columns */
  delay?: number;
}

export default function RotatingStat({
  items,
  valueColor,
  labelColor,
  interval = 3600,
  delay = 0,
}: Props) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      setActive((i) => (i + 1) % items.length);
      timer = setInterval(() => setActive((i) => (i + 1) % items.length), interval);
    }, delay + interval);

    return () => {
      clearTimeout(start);
      clearInterval(timer);
    };
  }, [items.length, interval, delay]);

  return (
    // All items share one grid cell so the column keeps the height of the tallest one.
    <div className="grid w-full justify-items-center text-center" aria-live="off">
      {items.map((item, i) => {
        const isActive = i === active;
        return (
          <div
            key={item.value + item.label}
            className="col-start-1 row-start-1 flex flex-col items-center gap-1 transition-all duration-700 ease-out"
            style={{
              opacity: isActive ? 1 : 0,
              transform: isActive ? "translateY(0)" : "translateY(12px)",
            }}
            aria-hidden={!isActive}
          >
            <span className="type-case-title" style={{ color: valueColor }}>
              {item.value}
            </span>
            <span className="type-caption-sm" style={{ color: labelColor }}>
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
