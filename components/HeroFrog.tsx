import { assetPath } from "@/lib/assetPath";

export default function HeroFrog() {
  return (
    <img
      src={assetPath("/images/home_sleeping_animation_jfcr.gif")}
      alt=""
      aria-hidden="true"
      style={{
        position: "absolute",
        top: -5,
        left: "50%",
        transform: "translate(-50%, -80%)",
        width: 250,
        height: 250,
        objectFit: "contain",
        pointerEvents: "none",
        zIndex: 10,
      }}
    />
  );
}
