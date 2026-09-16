import VoizePrototype from "./VoizePrototype";

export const metadata = {
  robots: "noindex, nofollow",
};

export default function PrototypePage() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#F0EDE8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: 390,
          minWidth: 390,
          maxWidth: 390,
          height: "844px",
          borderRadius: 44,
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.08)",
          background: "#fff",
          position: "relative",
          flexShrink: 0,
        }}
      >
        <VoizePrototype />
      </div>
    </div>
  );
}
