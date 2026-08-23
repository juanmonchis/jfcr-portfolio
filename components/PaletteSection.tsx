const PALETTE = [
  { name: "Coral",     hex: "#FBAA94", rgb: "251, 170, 148" },
  { name: "Lemon",     hex: "#F7E677", rgb: "247, 230, 119" },
  { name: "Lavender",  hex: "#DB74FF", rgb: "219, 116, 255" },
  { name: "Charcoal",  hex: "#1E1E1E", rgb: "30, 30, 30"    },
  { name: "Mint",      hex: "#6AFF8B", rgb: "106, 255, 139" },
  { name: "Aqua",      hex: "#6AC9FF", rgb: "106, 201, 255" },
  { name: "Cherry",    hex: "#FF1515", rgb: "255, 21, 21"   },
  { name: "Plum",      hex: "#743EE7", rgb: "116, 62, 231"  },
  { name: "Honey",     hex: "#FFC226", rgb: "255, 194, 38"  },
  { name: "Fuchsia",   hex: "#FD74C6", rgb: "253, 116, 198" },
  { name: "Eggplant",  hex: "#573FE7", rgb: "87, 63, 231"   },
  { name: "Ocean",     hex: "#0FD0B8", rgb: "15, 208, 184"  },
  { name: "Violet",    hex: "#C727FF", rgb: "199, 39, 255"  },
]

function relativeLuminance(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const toLinear = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

export default function PaletteSection() {
  return (
    <section className="bg-white py-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-[1200px] mx-auto">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            border: "1px solid #e5e5e5",
          }}
        >
          {PALETTE.map((color) => {
            const lum = relativeLuminance(color.hex)
            const textColor = lum < 0.25 ? "#ffffff" : "#111111"
            const labelColor = lum < 0.25 ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)"
            const bg = lum < 0.05
              ? color.hex
              : `linear-gradient(135deg, ${color.hex} 0%, #ffffff 120%)`

            return (
              <div
                key={color.name}
                style={{
                  background: bg,
                  padding: "clamp(20px, 2.5vw, 32px)",
                  border: "1px solid #e5e5e5",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                  minHeight: "clamp(160px, 16vw, 220px)",
                }}
              >
                <p style={{ fontFamily: "var(--font-telegraf), sans-serif", fontWeight: 700, fontSize: "clamp(14px, 1.5vw, 18px)", color: textColor, letterSpacing: "0.04em", textTransform: "uppercase", margin: 0 }}>
                  {color.name}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "auto" }}>
                  <div>
                    <p style={{ fontFamily: "var(--font-telegraf), sans-serif", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: labelColor, margin: "0 0 2px" }}>HEX</p>
                    <p style={{ fontFamily: "var(--font-telegraf), sans-serif", fontWeight: 700, fontSize: "clamp(12px, 1.2vw, 14px)", color: textColor, margin: 0 }}>{color.hex}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-telegraf), sans-serif", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: labelColor, margin: "0 0 2px" }}>RGB</p>
                    <p style={{ fontFamily: "var(--font-telegraf), sans-serif", fontWeight: 700, fontSize: "clamp(12px, 1.2vw, 14px)", color: textColor, margin: 0 }}>{color.rgb}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
