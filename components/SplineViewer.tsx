"use client";

import Script from "next/script";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "spline-viewer": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { url?: string; class?: string }, HTMLElement>;
    }
  }
}

interface SplineViewerProps {
  url: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function SplineViewer({ url, className = "", style }: SplineViewerProps) {
  return (
    <>
      <Script
        src="https://unpkg.com/@splinetool/viewer@1.10.14/build/spline-viewer.js"
        type="module"
        strategy="afterInteractive"
      />
      <spline-viewer url={url} class={className} style={style} />
    </>
  );
}
