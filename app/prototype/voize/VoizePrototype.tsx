"use client";

import { useState, useRef, useEffect } from "react";

const C = {
  bg:           "#F3F3F2",
  white:        "#FFFFFF",
  text:         "#322B00",
  textMid:      "#322B00",
  textMuted:    "#A9A6B8",
  purple:       "#7B5CF6",
  purpleDim:    "#EDE9FD",
  purpleLine:   "#C4B5FD",
  tagBlue:      "#E8F0FE",
  tagBlueText:  "#3D5AFE",
  wellbeingBg:  "#FFE0EC",
  wellbeingRed: "#FF3374",
  border:       "#EBEBF0",
  cardShadow:   "0 1px 4px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
  medGreenBg:   "#E8F5E9",
  medGreenText: "#2E7D32",
  medPurpleBg:  "#F0EAFE",
  medBlueBg:    "#E3F2FD",
  dropBg:       "#FFF3E0",
  dropGrad1:    "#FFB300",
  dropGrad2:    "#FF6D00",
  // medication badge colours
  crushedBg:    "#EAF0E3",
  crushedText:  "#4A6741",
  dissolvedBg:  "#F5EDD8",
  dissolvedText:"#7A5C2E",
  // Friday badge
  fridayBg:     "#3D3D2E",
  fridayText:   "#FFFFFF",
};

function PillTag({ label, bg, color }: { label: string; bg: string; color: string }) {
  return (
    <span style={{ background: bg, color, borderRadius: 6, padding: "3px 9px", fontSize: 11, fontWeight: 600, lineHeight: 1 }}>
      {label}
    </span>
  );
}

function Chevron({ dir = "right", color = C.textMuted, size = 24 }: { dir?: "right" | "down" | "up"; color?: string; size?: number }) {
  const rotate = dir === "up" ? "180deg" : dir === "right" ? "-90deg" : "0deg";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, transform: `rotate(${rotate})`, transition: "transform 0.2s" }}>
      <path d="M16.2163 9.04772C16.5273 8.7367 17.0315 8.7367 17.3425 9.04772C17.6535 9.35875 17.6535 9.86291 17.3425 10.1739L12.5639 14.9526C12.2529 15.2636 11.7487 15.2636 11.4377 14.9526L6.65905 10.1739C6.34802 9.86291 6.34802 9.35875 6.65905 9.04772C6.97008 8.7367 7.47424 8.7367 7.78526 9.04772L12.0008 13.2632L16.2163 9.04772Z" fill={color} />
    </svg>
  );
}

function PatientPhoto({ width = 96, height = 116, radius = 14 }: { width?: number; height?: number; radius?: number }) {
  return (
    <div style={{ width, height, borderRadius: radius, overflow: "hidden", flexShrink: 0, background: "#C8B09A" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/patient-turner.png" alt="Ms. Turner"
        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 10%" }} />
    </div>
  );
}

function SectionTitle({ children, badge }: { children: React.ReactNode; badge?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "32px 0 10px" }}>
      <div style={{ fontSize: 20, fontWeight: 700, color: C.text, fontFamily: "'SeasonMix', serif" }}>{children}</div>
      {badge}
    </div>
  );
}

function ExpandView({ label = "Expand", open = false, onClick }: { label?: string; open?: boolean; onClick?: () => void }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
      <button onClick={onClick} style={{ width: "30%", background: C.white, border: "none", cursor: "pointer", borderRadius: 22, boxShadow: "0 1px 3px rgba(0,0,0,0.07)", padding: "10px 0", display: "flex", justifyContent: "center", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 14, color: C.text, fontWeight: 700 }}>{open ? "Collapse" : label}</span>
        <Chevron dir={open ? "up" : "down"} color={C.text} />
      </button>
    </div>
  );
}

// ── Update icons ──────────────────────────────────────────────────────────────
function UpdateIcon({ type }: { type: "food" | "social" | "chat" | "temp" | "weight" | "hygiene" }) {
  const src =
    type === "food"    ? "/images/update-drop.png" :
    type === "social"  ? "/images/update-people.png" :
    type === "chat"    ? "/images/update-note.png" :
    type === "temp"    ? "/images/update-temp.png" :
    type === "weight"  ? "/images/update-weight.png" :
                         "/images/update-hygiene.png";
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" style={{ width: 36, height: 36, flexShrink: 0 }} />;
}

function UpdateRow({ label, time, date, type, faded = false }: { label: string; time: string; date: string; type: "food" | "social" | "chat" | "temp" | "weight" | "hygiene"; faded?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: C.white, borderRadius: 14, marginBottom: 8, boxShadow: C.cardShadow, opacity: faded ? 0.38 : 1, transition: "opacity 0.35s ease" }}>
      <UpdateIcon type={type} />
      <div style={{ flex: 1, fontSize: 14, color: C.text, lineHeight: 1.3 }}>{label}</div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.4 }}>{time}</div>
        <div style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.4 }}>{date}</div>
      </div>
      <Chevron />
    </div>
  );
}

// ── Wellbeing score ───────────────────────────────────────────────────────────
function WellbeingExpanded() {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const scores = [62, 55, 48, 70, 44, 30, 24];
  const BAR_H = 80;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 16, paddingTop: 8, paddingBottom: 4 }}>
      {/* Bar chart */}
      <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 5 }}>
        {days.map((d, i) => {
          const fillH = Math.max(8, (scores[i] / 100) * BAR_H);
          const isToday = i === 6;
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              <div style={{ width: "100%", height: BAR_H, borderRadius: 8, background: "rgba(255,255,255,0.65)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: fillH, background: isToday ? C.wellbeingRed : "rgba(255,51,116,0.7)", borderRadius: "6px 6px 0 0" }} />
              </div>
              <span style={{ fontSize: 11, color: isToday ? C.wellbeingRed : C.text, fontWeight: isToday ? 700 : 500 }}>{d}</span>
            </div>
          );
        })}
      </div>
      {/* Score */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", paddingBottom: 22, flexShrink: 0 }}>
        <div style={{ fontSize: 56, fontWeight: 800, color: C.text, lineHeight: 1, letterSpacing: "-2px" }}>24</div>
        <div style={{ fontSize: 13, color: "#4CAF50", fontWeight: 600, marginTop: 6 }}>▲ 20</div>
      </div>
    </div>
  );
}

// ── Medication components ─────────────────────────────────────────────────────
const MED_IMG: Record<"pill" | "drop" | "syringe", string> = {
  pill:    "/images/med-pill.png",
  drop:    "/images/med-drop.png",
  syringe: "/images/med-syringe.png",
};

function MedImg({ type }: { type: "pill" | "drop" | "syringe" }) {
  return (
    <div style={{ width: 58, height: 58, borderRadius: 16, overflow: "hidden", flexShrink: 0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={MED_IMG[type]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    </div>
  );
}

const BADGE_STYLES: Record<string, { bg: string; color: string }> = {
  Crushed:   { bg: C.crushedBg,   color: C.crushedText },
  Dissolved: { bg: C.dissolvedBg, color: C.dissolvedText },
  default:   { bg: C.medGreenBg,  color: C.medGreenText },
};

function MedCard({ name, dose, type, badge, iconBg, note }: { name: string; dose: string; type: "pill" | "drop" | "syringe"; badge?: string; iconBg: string; note?: string }) {
  const bs = badge ? (BADGE_STYLES[badge] ?? BADGE_STYLES.default) : null;
  return (
    <div style={{ background: C.white, borderRadius: 16, boxShadow: C.cardShadow, marginBottom: 8, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px" }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, overflow: "hidden", background: iconBg, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={MED_IMG[type]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: C.text, fontFamily: "'SeasonMix', serif" }}>{name}</span>
            <span style={{ fontSize: 14, color: C.textMid, fontWeight: 500 }}>{dose}</span>
          </div>
          {badge && bs && (
            <span style={{ fontSize: 12, fontWeight: 600, background: bs.bg, color: bs.color, borderRadius: 20, padding: "4px 12px", display: "inline-block", marginTop: 6 }}>{badge}</span>
          )}
        </div>
      </div>
      {note && (
        <div style={{ background: C.purpleDim, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="10" cy="10" r="8" stroke={C.purple} strokeWidth="1.5" />
            <path d="M10 6V10.5" stroke={C.purple} strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="10" cy="13.5" r="1" fill={C.purple} />
          </svg>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.purple }}>{note}</span>
        </div>
      )}
    </div>
  );
}

function StringNotification({ text }: { text: string }) {
  return (
    <div style={{ background: C.purpleDim, borderRadius: 16, padding: "13px 16px", marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
        <circle cx="10" cy="10" r="8" stroke={C.purple} strokeWidth="1.5" />
        <path d="M10 6V10.5" stroke={C.purple} strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="10" cy="13.5" r="1" fill={C.purple} />
      </svg>
      <span style={{ fontSize: 14, fontWeight: 600, color: C.purple }}>{text}</span>
    </div>
  );
}

function MedTimeGroup({ time, children, showSep = true }: { time: string; children: React.ReactNode; showSep?: boolean }) {
  return (
    <div>
      <div style={{ display: "flex", gap: 14, paddingBottom: 4 }}>
        {/* Timeline column */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 40, flexShrink: 0, paddingTop: 2 }}>
          <span style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, lineHeight: 1, marginBottom: 6, whiteSpace: "nowrap" }}>{time}</span>
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#7B9FE0", flexShrink: 0 }} />
          <div style={{ width: 2, flex: 1, background: `linear-gradient(180deg, #7B9FE0 0%, rgba(123,159,224,0.15) 100%)`, marginTop: 4, borderRadius: 2, minHeight: 24 }} />
        </div>
        <div style={{ flex: 1 }}>{children}</div>
      </div>
      {showSep && <div style={{ height: 1, background: C.border, margin: "4px 0 10px 54px" }} />}
    </div>
  );
}

function MedicationSection() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <div style={{
        overflow: "hidden",
        maxHeight: expanded ? 900 : 450,
        transition: "max-height 0.45s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <MedTimeGroup time="19:40">
          <MedCard name="Aspirine" dose="15 mg" type="pill" badge="Dissolved" iconBg={C.medPurpleBg} note="Ms. Turner likes having it right after her dinner." />
        </MedTimeGroup>
        <MedTimeGroup time="16:30" showSep={expanded}>
          <MedCard name="Bentazepam" dose="10 mg" type="drop" badge="Dissolved" iconBg={C.dropBg} />
          <MedCard name="Influenza vaccine" dose="0.5ml" type="syringe" iconBg={C.medBlueBg} />
        </MedTimeGroup>
        {expanded && (
          <MedTimeGroup time="08:00" showSep={false}>
            <MedCard name="Metformin" dose="500 mg" type="pill" badge="With meal" iconBg={C.medGreenBg} />
          </MedTimeGroup>
        )}
      </div>
      <ExpandView open={expanded} onClick={() => setExpanded(v => !v)} />
    </div>
  );
}

// ── Vitals ────────────────────────────────────────────────────────────────────
function SparkChart({ color, points, unit, value, labels, yLabels, badgeMode, smoothCurve, verticalGrid, topBandColor, dotColor }: {
  color: string; points: number[]; unit: string; value: string; labels: string[]; yLabels?: string[];
  badgeMode?: boolean; smoothCurve?: boolean; verticalGrid?: boolean; topBandColor?: string; dotColor?: string;
}) {
  if (badgeMode) {
    const multiline = labels.some(l => l.includes("\n"));
    const W = 300, H = multiline ? 230 : 210;
    const padL = 8, padR = 8, padT = 16, padB = multiline ? 52 : 36;
    const cW = W - padL - padR, cH = H - padT - padB;
    const min = Math.min(...points), max = Math.max(...points);
    const range = max - min || 1;
    const pad = range * 0.25;
    const dMin = min - pad, dMax = max + pad;
    const dRange = dMax - dMin;
    const xs = points.map((_, i) => padL + (i / (points.length - 1)) * cW);
    const ys = points.map(p => padT + cH - ((p - dMin) / dRange) * cH);

    let pathD: string;
    if (smoothCurve) {
      const t = 0.35;
      pathD = `M ${xs[0].toFixed(1)} ${ys[0].toFixed(1)}`;
      for (let i = 0; i < xs.length - 1; i++) {
        const x0 = i > 0 ? xs[i - 1] : xs[0], y0 = i > 0 ? ys[i - 1] : ys[0];
        const x1 = xs[i], y1 = ys[i];
        const x2 = xs[i + 1], y2 = ys[i + 1];
        const x3 = i < xs.length - 2 ? xs[i + 2] : xs[xs.length - 1];
        const y3 = i < ys.length - 2 ? ys[i + 2] : ys[ys.length - 1];
        pathD += ` C ${(x1 + (x2 - x0) * t).toFixed(1)} ${(y1 + (y2 - y0) * t).toFixed(1)}, ${(x2 - (x3 - x1) * t).toFixed(1)} ${(y2 - (y3 - y1) * t).toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}`;
      }
    } else {
      pathD = xs.map((x, i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${ys[i].toFixed(1)}`).join(" ");
    }

    const dc = dotColor ?? color;
    const numH = 5;
    const bW = 44, bH = 24;
    return (
      <div style={{ padding: "12px 0 4px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 10 }}>
          <span style={{ fontSize: 28, fontWeight: 800, color: C.text, lineHeight: 1 }}>{value}</span>
          <span style={{ fontSize: 13, color: C.textMuted, fontWeight: 600 }}>{unit}</span>
          <span style={{ marginLeft: "auto", fontSize: 12, color: "#4CAF50", fontWeight: 600, background: "#E8F5E9", borderRadius: 6, padding: "2px 7px" }}>↑ Normal</span>
        </div>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block", overflow: "visible" }}>
          <rect x={padL} y={padT} width={cW} height={cH} fill="none" stroke="#D8D8D8" strokeWidth="1" />
          {topBandColor && <rect x={padL + 1} y={padT + 1} width={cW - 2} height={cH * 0.22} fill={topBandColor} />}
          {verticalGrid
            ? xs.map((x, i) => i > 0 && i < xs.length - 1
                ? <line key={i} x1={x} y1={padT} x2={x} y2={padT + cH} stroke="#E8E8E8" strokeWidth="1" />
                : null)
            : Array.from({ length: numH - 1 }, (_, i) => {
                const y = padT + ((i + 1) / numH) * cH;
                return <line key={i} x1={padL} y1={y} x2={padL + cW} y2={y} stroke="#E8E8E8" strokeWidth="1" />;
              })
          }
          <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          {xs.map((x, i) => {
            const badgeAbove = ys[i] + 14 + bH > padT + cH - 4;
            const by = badgeAbove ? ys[i] - 14 - bH : ys[i] + 14;
            const val = String(points[i]);
            return (
              <g key={i}>
                <circle cx={x} cy={ys[i]} r="5" fill="white" stroke={dc} strokeWidth="1.5" />
                <rect x={x - bW / 2} y={by} width={bW} height={bH} rx="8" fill="#EBEBEB" />
                <text x={x} y={by + 16} textAnchor="middle" fontSize="12" fontWeight="700" fill="#1a1a1a">{val}</text>
              </g>
            );
          })}
          {labels.map((lbl, i) => {
            const x = padL + (i / Math.max(labels.length - 1, 1)) * cW;
            const lines = lbl.split("\n");
            return lines.map((line, j) => (
              <text key={`${i}-${j}`} x={x} y={H - padB + 16 + j * 16} textAnchor="middle" fontSize="10" fill={C.textMuted}>{line}</text>
            ));
          })}
        </svg>
      </div>
    );
  }

  const W = 280, H = 140;
  const padL = yLabels ? 44 : 8, padR = 8, padT = 10, padB = 28;
  const cW = W - padL - padR, cH = H - padT - padB;
  const min = Math.min(...points), max = Math.max(...points);
  const range = max - min || 1;
  const xs = points.map((_, i) => padL + (i / (points.length - 1)) * cW);
  const ys = points.map(p => padT + cH - ((p - min) / range) * cH);
  const pathD = xs.map((x, i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${ys[i].toFixed(1)}`).join(" ");

  const ySteps = yLabels ?? [];
  const xSteps = labels;

  return (
    <div style={{ padding: "12px 0 4px" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 10 }}>
        <span style={{ fontSize: 28, fontWeight: 800, color: C.text, lineHeight: 1 }}>{value}</span>
        <span style={{ fontSize: 13, color: C.textMuted, fontWeight: 600 }}>{unit}</span>
        <span style={{ marginLeft: "auto", fontSize: 12, color: "#4CAF50", fontWeight: 600, background: "#E8F5E9", borderRadius: 6, padding: "2px 7px" }}>↑ Normal</span>
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block", overflow: "visible" }}>
        {xs.map((x, i) => (
          <line key={i} x1={x} y1={padT} x2={x} y2={padT + cH} stroke="#E8E8E8" strokeWidth="1" />
        ))}
        <line x1={padL} y1={padT + cH} x2={padL + cW} y2={padT + cH} stroke="#E8E8E8" strokeWidth="1" />
        {ySteps.map((lbl, i) => {
          const y = padT + (i / Math.max(ySteps.length - 1, 1)) * cH;
          return <text key={i} x={padL - 6} y={y + 4} fontSize="9" fill={C.textMuted} textAnchor="end">{lbl}</text>;
        })}
        <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {xs.map((x, i) => (
          <circle key={i} cx={x} cy={ys[i]} r="4" fill="white" stroke={color} strokeWidth="2" />
        ))}
        {xSteps.map((lbl, i) => {
          const x = padL + (i / Math.max(xSteps.length - 1, 1)) * cW;
          return <text key={i} x={x} y={H - 4} fontSize="9" fill={C.textMuted} textAnchor="middle">{lbl}</text>;
        })}
      </svg>
    </div>
  );
}

function VitalRow({ icon, label, chartColor, points, unit, value, labels, yLabels, badgeMode, smoothCurve, verticalGrid, topBandColor, dotColor, expandHeight = 260 }: {
  icon: React.ReactNode; label: string;
  chartColor: string; points: number[]; unit: string; value: string; labels: string[]; yLabels?: string[];
  badgeMode?: boolean; smoothCurve?: boolean; verticalGrid?: boolean; topBandColor?: string; dotColor?: string; expandHeight?: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: C.white, borderRadius: 16, boxShadow: C.cardShadow, marginBottom: 8, overflow: "hidden" }}>
      <button onClick={() => setOpen(v => !v)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", width: "100%", background: "none", border: "none", cursor: "pointer" }}>
        {icon}
        <span style={{ flex: 1, fontSize: 20, fontWeight: 700, color: C.text, textAlign: "left", fontFamily: "'SeasonMix', serif" }}>{label}</span>
        <Chevron dir={open ? "up" : "down"} color={C.textMuted} />
      </button>
      <div style={{ overflow: "hidden", maxHeight: open ? expandHeight : 0, transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1)" }}>
        <div style={{ padding: "0 18px 16px" }}>
          <SparkChart color={chartColor} points={points} unit={unit} value={value} labels={labels} yLabels={yLabels} badgeMode={badgeMode} smoothCurve={smoothCurve} verticalGrid={verticalGrid} topBandColor={topBandColor} dotColor={dotColor} />
        </div>
      </div>
    </div>
  );
}

// ── Treatment plan ────────────────────────────────────────────────────────────
const TREATMENT_TIMES: Record<string, string> = {
  "Physiotherapy session": "14:00",
  "Medication review":     "16:30",
  "Blood pressure check":  "11:00",
  "Occupational therapy":  "14:00",
  "Cardiology consultation": "14:00",
  "Mobility assessment":   "16:30",
};

function TreatmentIcon({ name }: { name: string }) {
  const n = name.toLowerCase();
  // Green bg — people icon (physiotherapy, occupational, mobility)
  if (n.includes("physiotherapy") || n.includes("occupational") || n.includes("mobility")) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="12" fill="#E0F1CE"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M5.52164 14.5522C6.34686 12.92 8.03801 11.7989 9.995 11.7989C11.9522 11.7989 13.6431 12.921 14.4683 14.5522C14.9655 15.5353 14.4243 16.6911 13.4341 17.0354C12.557 17.34 11.3847 17.6168 9.995 17.6168C8.60532 17.6168 7.43318 17.34 6.55609 17.0355C5.56441 16.6911 5.02472 15.535 5.52164 14.5522Z" fill="#29500E"/>
        <path d="M13.6837 11.8091C13.7903 11.8024 13.898 11.7989 14.0064 11.7989C15.9636 11.7989 17.6546 12.921 18.4797 14.5522C18.9769 15.5353 18.4358 16.6911 17.4455 17.0354C16.7479 17.2776 15.8635 17.5023 14.8316 17.5841C15.7912 16.7357 16.1978 15.3051 15.5423 14.0091C15.1024 13.1394 14.4631 12.3855 13.6837 11.8091Z" fill="#29500E"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M7.78853 8.59026C7.78853 7.37134 8.77649 6.38379 9.995 6.38379C11.2135 6.38379 12.2015 7.37134 12.2015 8.59026C12.2015 9.80919 11.2135 10.7967 9.995 10.7967C8.77649 10.7967 7.78853 9.80919 7.78853 8.59026Z" fill="#29500E"/>
        <path d="M12.8436 10.4656C13.1813 10.6755 13.5799 10.7967 14.0068 10.7967C15.2253 10.7967 16.2133 9.80919 16.2133 8.59026C16.2133 7.37134 15.2253 6.38379 14.0068 6.38379C13.5799 6.38379 13.1813 6.50499 12.8436 6.71489C13.1985 7.25288 13.405 7.89738 13.405 8.59026C13.405 9.28315 13.1985 9.92765 12.8436 10.4656Z" fill="#29500E"/>
      </svg>
    );
  }
  // Green bg — checklist icon (medication review)
  if (n.includes("medication")) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="12" fill="#E0F1CE"/>
        <path d="M13.7414 15.675L16.6747 12.705C16.7834 12.595 16.9216 12.54 17.0895 12.54C17.2574 12.54 17.3957 12.595 17.5044 12.705C17.613 12.815 17.6673 12.955 17.6673 13.125C17.6673 13.295 17.613 13.435 17.5044 13.545L14.1562 16.935C14.0377 17.055 13.8994 17.115 13.7414 17.115C13.5834 17.115 13.4451 17.055 13.3266 16.935L11.6377 15.225C11.529 15.115 11.4747 14.975 11.4747 14.805C11.4747 14.635 11.529 14.495 11.6377 14.385C11.7463 14.275 11.8846 14.22 12.0525 14.22C12.2204 14.22 12.3587 14.275 12.4673 14.385L13.7414 15.675ZM7.51917 18C7.19324 18 6.91423 17.8825 6.68213 17.6475C6.45003 17.4125 6.33398 17.13 6.33398 16.8V8.4C6.33398 8.07 6.45003 7.7875 6.68213 7.5525C6.91423 7.3175 7.19324 7.2 7.51917 7.2H9.99324C10.1019 6.85 10.3142 6.5625 10.6303 6.3375C10.9463 6.1125 11.292 6 11.6673 6C12.0624 6 12.4155 6.1125 12.7266 6.3375C13.0377 6.5625 13.2476 6.85 13.3562 7.2H15.8155C16.1414 7.2 16.4204 7.3175 16.6525 7.5525C16.8846 7.7875 17.0007 8.07 17.0007 8.4V10.8C17.0007 10.97 16.9439 11.1125 16.8303 11.2275C16.7167 11.3425 16.576 11.4 16.4081 11.4C16.2402 11.4 16.0994 11.3425 15.9858 11.2275C15.8723 11.1125 15.8155 10.97 15.8155 10.8V8.4H14.6303V9.6C14.6303 9.77 14.5735 9.9125 14.4599 10.0275C14.3463 10.1425 14.2056 10.2 14.0377 10.2H9.29695C9.12905 10.2 8.98831 10.1425 8.87472 10.0275C8.76114 9.9125 8.70435 9.77 8.70435 9.6V8.4H7.51917V16.8H10.4821C10.65 16.8 10.7908 16.8575 10.9044 16.9725C11.0179 17.0875 11.0747 17.23 11.0747 17.4C11.0747 17.57 11.0179 17.7125 10.9044 17.8275C10.7908 17.9425 10.65 18 10.4821 18H7.51917ZM11.6673 8.4C11.8352 8.4 11.976 8.3425 12.0895 8.2275C12.2031 8.1125 12.2599 7.97 12.2599 7.8C12.2599 7.63 12.2031 7.4875 12.0895 7.3725C11.976 7.2575 11.8352 7.2 11.6673 7.2C11.4994 7.2 11.3587 7.2575 11.2451 7.3725C11.1315 7.4875 11.0747 7.63 11.0747 7.8C11.0747 7.97 11.1315 8.1125 11.2451 8.2275C11.3587 8.3425 11.4994 8.4 11.6673 8.4Z" fill="#29500E"/>
      </svg>
    );
  }
  // Lavender bg — stethoscope icon (blood pressure, cardiology)
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="12" fill="#CCD2F2"/>
      <path d="M6 7.05882C6 6.47426 6.47426 6 7.05882 6H8.11765C8.50809 6 8.82353 6.31544 8.82353 6.70588C8.82353 7.09632 8.50809 7.41176 8.11765 7.41176H7.41176V10.2353C7.41176 11.4044 8.36029 12.3529 9.52941 12.3529C10.6985 12.3529 11.6471 11.4044 11.6471 10.2353V7.41176H10.9412C10.5507 7.41176 10.2353 7.09632 10.2353 6.70588C10.2353 6.31544 10.5507 6 10.9412 6H12C12.5846 6 13.0588 6.47426 13.0588 7.05882V10.2353C13.0588 11.9426 11.8456 13.3676 10.2353 13.6941V14.1176C10.2353 15.4831 11.3404 16.5882 12.7059 16.5882C14.0713 16.5882 15.1765 15.4831 15.1765 14.1176V12.2316C14.3537 11.9404 13.7647 11.1574 13.7647 10.2353C13.7647 9.06618 14.7132 8.11765 15.8824 8.11765C17.0515 8.11765 18 9.06618 18 10.2353C18 11.1574 17.411 11.9426 16.5882 12.2316V14.1176C16.5882 16.2618 14.85 18 12.7059 18C10.5618 18 8.82353 16.2618 8.82353 14.1176V13.6941C7.21324 13.3676 6 11.9426 6 10.2353V7.05882ZM15.8824 10.9412C16.2728 10.9412 16.5882 10.6257 16.5882 10.2353C16.5882 9.84485 16.2728 9.52941 15.8824 9.52941C15.4919 9.52941 15.1765 9.84485 15.1765 10.2353C15.1765 10.6257 15.4919 10.9412 15.8824 10.9412Z" fill="#4E4C4A"/>
    </svg>
  );
}

function TreatmentDay({ day, date, appointments, faded, showSeparator }: { day: string; date: string; appointments: string[]; faded?: boolean; showSeparator?: boolean }) {
  return (
    <>
      {showSeparator && <div style={{ height: 1, background: "#5168E7", opacity: 0.25, margin: "6px 0" }} />}
      <div style={{ display: "flex", gap: 0, marginBottom: 4, opacity: faded ? 0.45 : 1, transition: "opacity 0.35s ease" }}>
        {/* Date column with blue left border */}
        <div style={{ width: 48, flexShrink: 0, paddingTop: 6, paddingRight: 10, borderLeft: "3px solid #5168E7", paddingLeft: 8 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#322B00", textTransform: "uppercase", letterSpacing: "0.06em", lineHeight: 1 }}>{day}</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#322B00", lineHeight: 1.15, marginTop: 1 }}>{date}</div>
        </div>
        {/* Appointment cards */}
        <div style={{ flex: 1, paddingLeft: 10 }}>
          {appointments.map((apt, i) => (
            <div key={i} style={{ background: faded ? "transparent" : C.white, borderRadius: 14, padding: "10px 14px", marginBottom: 6, display: "flex", alignItems: "center", gap: 10, boxShadow: faded ? "none" : C.cardShadow, border: faded ? `1.5px dashed ${C.border}` : "none" }}>
              <div style={{ flexShrink: 0 }}>
                <TreatmentIcon name={apt} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#322B00" }}>{apt}</div>
              </div>
              <div style={{ fontSize: 12, color: "#322B00", fontWeight: 500, flexShrink: 0 }}>{TREATMENT_TIMES[apt] ?? "14:00"}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}


// ── Main component ────────────────────────────────────────────────────────────
export default function VoizePrototype() {
  const [wellbeingOpen, setWellbeingOpen] = useState(false);
  const [updatesOpen, setUpdatesOpen] = useState(false);
  const [treatmentOpen, setTreatmentOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navPills = [
    { label: "Updates",             id: "sec-updates" },
    { label: "Medication status",   id: "sec-medication" },
    { label: "Vitals",              id: "sec-vitals" },
    { label: "Treatment plan",      id: "sec-treatment" },
    { label: "Contacts & documents",id: "sec-contacts" },
  ];
  const scrollToSection = (id: string) => {
    const container = scrollRef.current;
    const el = container?.querySelector(`#${id}`) as HTMLElement | null;
    if (container && el) {
      const stickyHeader = container.firstElementChild as HTMLElement | null;
      const stickyH = stickyHeader?.offsetHeight ?? 0;
      const containerRect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      container.scrollBy({ top: elRect.top - containerRect.top - stickyH - 8, behavior: "smooth" });
    }
  };

  const [progress, setProgress] = useState(0);
  const [isCompact, setIsCompact] = useState(false);
  const [heroOpen, setHeroOpen] = useState(false);
  const touchStartY = useRef(0);
  const touchingAtTop = useRef(false);
  const lastCompactFlip = useRef(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const SCROLL_RANGE = 240;

    const COMPACT_THRESHOLD = 100;
    const EXPAND_THRESHOLD = 60;
    const onScroll = () => {
      setProgress(Math.min(1, Math.max(0, el.scrollTop / SCROLL_RANGE)));
      if (el.scrollTop > 10) setHeroOpen(false);
      setIsCompact(prev => {
        const next = el.scrollTop > COMPACT_THRESHOLD ? true : el.scrollTop < EXPAND_THRESHOLD ? false : prev;
        if (next !== prev) {
          const now = Date.now();
          if (now - lastCompactFlip.current < 400) return prev;
          lastCompactFlip.current = now;
        }
        return next;
      });
    };
    const onWheel = (e: WheelEvent) => {
      if (el.scrollTop === 0 && e.deltaY < -20 && !heroOpen) setHeroOpen(true);
      if (heroOpen && e.deltaY > 10) setHeroOpen(false);
    };
    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      touchingAtTop.current = el.scrollTop === 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      const dy = e.touches[0].clientY - touchStartY.current;
      if (touchingAtTop.current && dy > 40 && el.scrollTop === 0 && !heroOpen) setHeroOpen(true);
      if (heroOpen && dy < -30) setHeroOpen(false);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: true });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, [heroOpen]);

  return (
    <div style={{
      width: "100%", height: "100%", position: "relative",
      fontFamily: "'SeasonSans', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
      fontWeight: 600,
    }}>
      {/* ── Scroll container ─────────────────────────────────────────────── */}
      <div ref={scrollRef} style={{
        position: "absolute", inset: 0,
        background: C.bg,
        overflowY: heroOpen ? "hidden" : "auto", overflowX: "hidden",
        WebkitOverflowScrolling: "touch",
      }}>

      {/* ── Sticky header ────────────────────────────────────────────────── */}
      {(() => {
        const p = progress;
        const lerp = (a: number, b: number) => a + (b - a) * p;
        const detailOp  = lerp(1, 0);
        const nameFSize = lerp(34, 17);
        const tagPill   = `rgba(237,233,253,${lerp(1, 0)})`;
        const T = "0.48s cubic-bezier(0.4,0,0.2,1)";

        return (
          <div style={{ position: "sticky", top: 0, zIndex: 100, background: C.bg }}>

            {/* ── Hero layer ── */}
            <div style={{ overflow: "hidden", maxHeight: heroOpen ? 548 : 0, transition: `max-height ${T}` }}>
              <div style={{ position: "relative", height: 490 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/patient-turner.png" alt="Ms. Turner"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 10%", display: "block" }} />
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0) 35%, rgba(0,0,0,0.78) 100%)" }} />
                <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, padding: "0 18px" }}>
                  {/* Primary assignment pill */}
                  <div style={{ display: "inline-flex", alignItems: "center", background: "rgba(255,255,255,0.92)", borderRadius: 20, padding: "5px 14px", marginBottom: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Primary assignment</span>
                  </div>
                  {/* Name row + emergency button */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <div style={{ fontSize: 34, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", lineHeight: 1.1, fontFamily: "'SeasonMix', serif" }}>Ms. Turner, Leni</div>
                    <div style={{ width: 56, height: 56, borderRadius: 18, background: "#FFBDBD", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="28" height="28" viewBox="0 0 20 20" fill="none">
                        <path d="M2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V6C0 5.45 0.195833 4.97917 0.5875 4.5875C0.979167 4.19583 1.45 4 2 4H6V2C6 1.45 6.19583 0.979167 6.5875 0.5875C6.97917 0.195833 7.45 0 8 0H12C12.55 0 13.0208 0.195833 13.4125 0.5875C13.8042 0.979167 14 1.45 14 2V4H18C18.55 4 19.0208 4.19583 19.4125 4.5875C19.8042 4.97917 20 5.45 20 6V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20H2ZM8 4H12V2H8V4ZM9 13V15C9 15.2833 9.09583 15.5208 9.2875 15.7125C9.47917 15.9042 9.71667 16 10 16C10.2833 16 10.5208 15.9042 10.7125 15.7125C10.9042 15.5208 11 15.2833 11 15V13H13C13.2833 13 13.5208 12.9042 13.7125 12.7125C13.9042 12.5208 14 12.2833 14 12C14 11.7167 13.9042 11.4792 13.7125 11.2875C13.5208 11.0958 13.2833 11 13 11H11V9C11 8.71667 10.9042 8.47917 10.7125 8.2875C10.5208 8.09583 10.2833 8 10 8C9.71667 8 9.47917 8.09583 9.2875 8.2875C9.09583 8.47917 9 8.71667 9 9V11H7C6.71667 11 6.47917 11.0958 6.2875 11.2875C6.09583 11.4792 6 11.7167 6 12C6 12.2833 6.09583 12.5208 6.2875 12.7125C6.47917 12.9042 6.71667 13 7 13H9Z" fill="#8A1633"/>
                      </svg>
                    </div>
                  </div>
                  {/* Room / Wing pills */}
                  <div style={{ display: "flex", gap: 8 }}>
                    {[
                      { icon: <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M11.6662 9.16667C11.9023 9.16667 12.1005 9.24624 12.2603 9.40592C12.42 9.56565 12.4995 9.76389 12.4995 10C12.4995 10.2361 12.42 10.4344 12.2603 10.5941C12.1005 10.7538 11.9023 10.8333 11.6662 10.8333C11.4303 10.8333 11.2326 10.7535 11.0729 10.5941C10.9132 10.4344 10.8328 10.2361 10.8328 10C10.8328 9.76389 10.9132 9.56565 11.0729 9.40592C11.2326 9.24646 11.4303 9.1667 11.6662 9.16667Z" fill="rgba(255,255,255,0.9)"/><path fillRule="evenodd" clipRule="evenodd" d="M14.1735 2.5C15.0478 2.50018 15.7563 3.20932 15.7563 4.08366V15.9806H16.7451C17.1591 15.9808 17.4953 16.3161 17.4954 16.7301C17.4953 17.1441 17.1591 17.4803 16.7451 17.4805H3.27181C2.85768 17.4805 2.52162 17.1442 2.52148 16.7301C2.52159 16.3418 2.81705 16.0222 3.19531 15.9839L3.27181 15.9806H4.2085V4.08366C4.2085 3.20922 4.91772 2.50002 5.79215 2.5H14.1735ZM5.7596 4.00716C5.72964 4.01976 5.70833 4.0492 5.70833 4.08366V15.9806H14.2565V4.08366C14.2565 4.03775 14.2194 4.00083 14.1735 4.00065H5.79215L5.7596 4.00716Z" fill="rgba(255,255,255,0.9)"/></svg>, label: "Room 101" },
                      { icon: <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M8.8029 2.52643C9.51739 1.98468 10.5054 1.98468 11.2199 2.52643L16.0189 6.16575C16.6212 6.62255 16.9758 7.33527 16.9759 8.0912V15.0622C16.9758 16.627 15.707 17.8951 14.1423 17.8951H5.88053C4.31578 17.8951 3.04696 16.627 3.04688 15.0622V8.0912C3.04703 7.33527 3.40158 6.62255 4.00391 6.16575L8.8029 2.52643ZM10.3133 3.72109C10.1348 3.586 9.88795 3.586 9.70947 3.72109L4.90967 7.36122C4.68146 7.53444 4.54768 7.80471 4.54753 8.0912V15.0622C4.54762 15.7985 5.14421 16.3952 5.88053 16.3952H7.53499V13.446C7.53499 12.0787 8.6441 10.9697 10.0114 10.9696C11.3787 10.9697 12.487 12.0787 12.487 13.446V16.3952H14.1423C14.8786 16.3952 15.4752 15.7985 15.4753 15.0622V8.0912C15.4751 7.80471 15.3413 7.53444 15.1131 7.36122L10.3133 3.72109ZM10.0114 12.4703C9.47252 12.4704 9.03564 12.9071 9.03564 13.446V16.3952H10.9871V13.446C10.9871 12.9071 10.5503 12.4704 10.0114 12.4703Z" fill="rgba(255,255,255,0.9)"/></svg>, label: "West Wing" },
                    ].map(({ icon, label }) => (
                      <div key={label} style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 20, padding: "7px 14px", display: "flex", alignItems: "center", gap: 6 }}>
                        {icon}
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ background: "#E8E6F4", padding: "14px 18px", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Main diagnosis:</span>
                <PillTag label="Hypertension" bg="rgba(255,255,255,0.85)" color={C.text} />
                <PillTag label="Arthritis" bg="rgba(255,255,255,0.85)" color={C.text} />
              </div>
            </div>

            {/* ── Normal nav + patient card ── */}
            <div style={{ overflow: "hidden", maxHeight: heroOpen ? 0 : 600, opacity: heroOpen ? 0 : 1, transition: `max-height ${T}, opacity 0.28s` }}>
              {/* Nav bar — permanent, no animation */}
              <div style={{
                background: C.bg,
                padding: "14px 18px 10px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <svg width="30" height="36" viewBox="0 0 30 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <mask id="mask0_2815_5092" style={{maskType:"luminance"}} maskUnits="userSpaceOnUse" x="0" y="0" width="30" height="36">
                    <path d="M0 14.422C0 17.777 1.15389 20.8654 3.09077 23.3153C4.98971 25.7173 7.64128 27.5058 10.6959 28.3303C10.8037 28.3594 10.8795 28.4566 10.8795 28.5682V35.1714C10.8795 35.5616 11.2793 35.8231 11.6334 35.6592C14.5816 34.2943 18.7055 32.0092 22.2035 28.7325C26.011 25.1658 29.0767 20.4242 29.0767 14.4155C29.0767 10.4335 27.4493 6.82959 24.8183 4.22122C22.1873 1.61285 18.5527 0 14.5383 0C10.524 0 6.88939 1.61447 4.2584 4.22446C1.6274 6.83445 0 10.44 0 14.422Z" fill="white"/>
                  </mask>
                  <g mask="url(#mask0_2815_5092)">
                    <path d="M10.7231 -3.61377C22.1909 -3.61377 31.4931 5.61733 31.4931 17.0011C31.4931 28.3848 22.1973 37.6159 10.7231 37.6159C-0.751131 37.6159 -10.0469 28.3848 -10.0469 17.0011C-10.0469 5.61733 -0.751131 -3.61377 10.7231 -3.61377Z" fill="#96B8FF"/>
                    <path d="M2.90353 1.3501C13.1542 1.3501 21.4692 9.51372 21.4692 19.581C21.4692 29.6484 13.1542 37.8063 2.90353 37.8063C-7.34715 37.8063 -15.6621 29.6426 -15.6621 19.5753C-15.6621 9.508 -7.34715 1.3501 2.90353 1.3501Z" fill="#5168E7"/>
                    <path d="M-4.72495 6.75098C5.93576 6.75098 14.5833 15.3063 14.5833 25.8567C14.5833 36.4071 5.94177 44.9624 -4.72495 44.9624C-15.3917 44.9624 -24.0332 36.4071 -24.0332 25.8567C-24.0332 15.3063 -15.3857 6.75098 -4.72495 6.75098Z" fill="#31418C"/>
                  </g>
                </svg>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 15, border: `1.5px solid ${C.border}`, background: C.white, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke={C.textMuted} strokeWidth="1.3" /><path d="M5.3 5.2C5.3 4.2 6.1 3.5 7 3.5C7.9 3.5 8.7 4.2 8.7 5.2C8.7 6.1 7.9 6.7 7 7V8" stroke={C.textMuted} strokeWidth="1.3" strokeLinecap="round" /><circle cx="7" cy="10" r="0.7" fill={C.textMuted} /></svg>
                  </div>
                  <div style={{ width: 30, height: 30, borderRadius: 15, background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8 L6.5 11.5 L13 4.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Anna</span>
                  <div style={{ width: 30, height: 30, borderRadius: 15, border: `1.5px solid ${C.border}`, background: C.white, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 7H12M9.5 4.5L12 7L9.5 9.5" stroke={C.textMuted} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 2H3C2.45 2 2 2.45 2 3V11C2 11.55 2.45 12 3 12H5" stroke={C.textMuted} strokeWidth="1.3" strokeLinecap="round" /></svg>
                  </div>
                </div>
              </div>

              {/* Patient card — white card on beige */}
              {(() => {
                const emergencyBtn = (
                  <div style={{ background: "#FFBDBD", borderRadius: 20, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V6C0 5.45 0.195833 4.97917 0.5875 4.5875C0.979167 4.19583 1.45 4 2 4H6V2C6 1.45 6.19583 0.979167 6.5875 0.5875C6.97917 0.195833 7.45 0 8 0H12C12.55 0 13.0208 0.195833 13.4125 0.5875C13.8042 0.979167 14 1.45 14 2V4H18C18.55 4 19.0208 4.19583 19.4125 4.5875C19.8042 4.97917 20 5.45 20 6V18C20 18.55 19.8042 19.0208 19.4125 19.4125C19.0208 19.8042 18.55 20 18 20H2ZM8 4H12V2H8V4ZM9 13V15C9 15.2833 9.09583 15.5208 9.2875 15.7125C9.47917 15.9042 9.71667 16 10 16C10.2833 16 10.5208 15.9042 10.7125 15.7125C10.9042 15.5208 11 15.2833 11 15V13H13C13.2833 13 13.5208 12.9042 13.7125 12.7125C13.9042 12.5208 14 12.2833 14 12C14 11.7167 13.9042 11.4792 13.7125 11.2875C13.5208 11.0958 13.2833 11 13 11H11V9C11 8.71667 10.9042 8.47917 10.7125 8.2875C10.5208 8.09583 10.2833 8 10 8C9.71667 8 9.47917 8.09583 9.2875 8.2875C9.09583 8.47917 9 8.71667 9 9V11H7C6.71667 11 6.47917 11.0958 6.2875 11.2875C6.09583 11.4792 6 11.7167 6 12C6 12.2833 6.09583 12.5208 6.2875 12.7125C6.47917 12.9042 6.71667 13 7 13H9Z" fill="#8A1633"/></svg>
                  </div>
                );
                const assignmentPill = (size: number) => (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.purpleDim, borderRadius: 20, padding: "5px 10px", flexShrink: 0 }}>
                    <div style={{ width: 7, height: 7, borderRadius: 4, background: C.purple, flexShrink: 0 }} />
                    <span style={{ fontSize: size, fontWeight: 600, color: C.text }}>Primary assignment</span>
                  </div>
                );
                const locationRow = (iconSize: number, textSize: number) => (
                  <div style={{ display: "flex", gap: 14 }}>
                    {[
                      { icon: <svg width={iconSize} height={iconSize} viewBox="0 0 20 20" fill="none"><path d="M11.6662 9.16667C11.9023 9.16667 12.1005 9.24624 12.2603 9.40592C12.42 9.56565 12.4995 9.76389 12.4995 10C12.4995 10.2361 12.42 10.4344 12.2603 10.5941C12.1005 10.7538 11.9023 10.8333 11.6662 10.8333C11.4303 10.8333 11.2326 10.7535 11.0729 10.5941C10.9132 10.4344 10.8328 10.2361 10.8328 10C10.8328 9.76389 10.9132 9.56565 11.0729 9.40592C11.2326 9.24646 11.4303 9.1667 11.6662 9.16667Z" fill={C.textMuted}/><path fillRule="evenodd" clipRule="evenodd" d="M14.1735 2.5C15.0478 2.50018 15.7563 3.20932 15.7563 4.08366V15.9806H16.7451C17.1591 15.9808 17.4953 16.3161 17.4954 16.7301C17.4953 17.1441 17.1591 17.4803 16.7451 17.4805H3.27181C2.85768 17.4805 2.52162 17.1442 2.52148 16.7301C2.52159 16.3418 2.81705 16.0222 3.19531 15.9839L3.27181 15.9806H4.2085V4.08366C4.2085 3.20922 4.91772 2.50002 5.79215 2.5H14.1735ZM5.7596 4.00716C5.72964 4.01976 5.70833 4.0492 5.70833 4.08366V15.9806H14.2565V4.08366C14.2565 4.03775 14.2194 4.00083 14.1735 4.00065H5.79215L5.7596 4.00716Z" fill={C.textMuted}/></svg>, label: "Room 101" },
                      { icon: <svg width={iconSize} height={iconSize} viewBox="0 0 20 20" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M8.8029 2.52643C9.51739 1.98468 10.5054 1.98468 11.2199 2.52643L16.0189 6.16575C16.6212 6.62255 16.9758 7.33527 16.9759 8.0912V15.0622C16.9758 16.627 15.707 17.8951 14.1423 17.8951H5.88053C4.31578 17.8951 3.04696 16.627 3.04688 15.0622V8.0912C3.04703 7.33527 3.40158 6.62255 4.00391 6.16575L8.8029 2.52643ZM10.3133 3.72109C10.1348 3.586 9.88795 3.586 9.70947 3.72109L4.90967 7.36122C4.68146 7.53444 4.54768 7.80471 4.54753 8.0912V15.0622C4.54762 15.7985 5.14421 16.3952 5.88053 16.3952H7.53499V13.446C7.53499 12.0787 8.6441 10.9697 10.0114 10.9696C11.3787 10.9697 12.487 12.0787 12.487 13.446V16.3952H14.1423C14.8786 16.3952 15.4752 15.7985 15.4753 15.0622V8.0912C15.4751 7.80471 15.3413 7.53444 15.1131 7.36122L10.3133 3.72109ZM10.0114 12.4703C9.47252 12.4704 9.03564 12.9071 9.03564 13.446V16.3952H10.9871V13.446C10.9871 12.9071 10.5503 12.4704 10.0114 12.4703Z" fill={C.textMuted}/></svg>, label: "West Wing" },
                    ].map(({ icon, label: loc }) => (
                      <div key={loc} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                        {icon}<span style={{ fontSize: textSize, color: C.textMid }}>{loc}</span>
                      </div>
                    ))}
                  </div>
                );
                const diagnosisBar = (
                  <div style={{ background: "#E8E6F4", padding: "12px 16px", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 14, color: C.text, fontWeight: 700 }}>Main diagnosis:</span>
                    <PillTag label="Hypertension" bg="rgba(255,255,255,0.85)" color={C.text} />
                    <PillTag label="Arthritis" bg="rgba(255,255,255,0.85)" color={C.text} />
                  </div>
                );
                return (
                  <div style={{ margin: `6px ${isCompact ? 0 : 14}px 0`, background: C.white, borderRadius: isCompact ? 0 : 20, overflow: "hidden", boxShadow: isCompact ? "none" : "0 2px 12px rgba(0,0,0,0.07)", transition: "margin 0.35s cubic-bezier(0.4,0,0.2,1), border-radius 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s" }}>
                    {/* Relative container that cross-fades between default and compact */}
                    <div style={{ position: "relative", height: isCompact ? 138 : 290, transition: "height 0.35s cubic-bezier(0.4,0,0.2,1)", overflow: "hidden" }}>

                      {/* ── Default state ── */}
                      <div style={{ position: "absolute", inset: 0, opacity: isCompact ? 0 : 1, transition: "opacity 0.28s ease", pointerEvents: isCompact ? "none" : "auto", padding: "14px 16px 0", overflow: "hidden" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          {assignmentPill(12)}
                          {emergencyBtn}
                        </div>
                        <div style={{ fontSize: 34, fontWeight: 800, color: C.text, letterSpacing: "-0.5px", lineHeight: 1.1, fontFamily: "'SeasonMix', serif", marginBottom: 6 }}>Ms. Turner, Leni</div>
                        {locationRow(14, 13)}
                        <div style={{ display: "flex", gap: 14, marginTop: 14, alignItems: "flex-start" }}>
                          <PatientPhoto width={96} height={110} radius={14} />
                          <div style={{ flex: 1, fontSize: 13, lineHeight: 1 }}>
                            {[["Date of birth", "01-01-1941 (84)"], ["Health insurance", "X110697327 (MetLife)"], ["Move-in date", "01-03-2017"]].map(([lbl, val]) => (
                              <div key={lbl} style={{ marginBottom: 12 }}>
                                <div style={{ color: C.textMuted, marginBottom: 3, fontSize: 12 }}>{lbl}</div>
                                <div style={{ color: C.text, fontWeight: 600, fontSize: 14 }}>{val}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* ── Compact state ── */}
                      <div style={{ position: "absolute", inset: 0, opacity: isCompact ? 1 : 0, transition: "opacity 0.28s ease", pointerEvents: isCompact ? "auto" : "none", display: "flex", gap: 14, padding: "14px 14px" }}>
                        <PatientPhoto width={100} height={110} radius={14} />
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
                            {assignmentPill(11)}
                            {emergencyBtn}
                          </div>
                          <div style={{ fontSize: 24, fontWeight: 800, color: C.text, letterSpacing: "-0.4px", lineHeight: 1.15, fontFamily: "'SeasonMix', serif", marginTop: 6 }}>Ms. Turner, Leni</div>
                          <div style={{ marginTop: 8 }}>{locationRow(14, 13)}</div>
                        </div>
                      </div>
                    </div>
                    {diagnosisBar}
                  </div>
                );
              })()}
            </div>

            {/* ── Nav pills ── */}
            <div style={{
              display: "flex", overflowX: "auto", gap: 8, padding: "12px 14px",
              scrollbarWidth: "none",
            }}>
              {navPills.map(({ label, id }) => (
                <button key={id} onClick={() => scrollToSection(id)} style={{
                  background: C.white, border: "none", cursor: "pointer",
                  borderRadius: 22, padding: "9px 16px", fontSize: 13, whiteSpace: "nowrap",
                  fontWeight: 600, color: C.text, flexShrink: 0,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                }}>{label}</button>
              ))}
            </div>
          </div>
        );
      })()}

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div style={{ padding: "14px 18px 0" }}>

        {/* Warnings */}
        <div style={{ background: C.white, borderRadius: 16, padding: "14px 16px", boxShadow: C.cardShadow, marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="12" fill="#FFE6D9"/><path d="M7.02734 14.2219C7.02734 16.6775 9.01623 18.6663 11.4718 18.6663C13.3773 18.6663 15.0829 17.5052 15.7885 15.7386L17.2107 12.1663C17.3496 11.8108 17.3385 11.3997 17.1273 11.083C16.8551 10.6719 16.3718 10.4941 15.9162 10.6108L15.4829 10.7386C15.2273 10.8052 14.994 10.933 14.8051 11.1052V7.83301C14.8051 7.06634 14.1829 6.44412 13.4162 6.44412C13.3107 6.44412 13.2107 6.44412 13.1162 6.47745C12.9996 5.82745 12.4329 5.33301 11.7496 5.33301C11.1607 5.33301 10.6607 5.69967 10.4551 6.21634C10.3385 6.18301 10.2107 6.16634 10.0829 6.16634C9.31623 6.16634 8.69401 6.78856 8.69401 7.55523V7.86079C8.60512 7.83301 8.51068 7.83301 8.41623 7.83301C7.64957 7.83301 7.02734 8.45523 7.02734 9.2219V14.2219ZM8.13845 9.2219C8.13845 9.06634 8.26068 8.94412 8.41623 8.94412C8.57179 8.94412 8.69401 9.06634 8.69401 9.2219V11.9997H9.80512V7.55523C9.80512 7.39967 9.92734 7.27745 10.0829 7.27745C10.2385 7.27745 10.3607 7.39967 10.3607 7.55523V11.9997H11.4718V6.7219C11.4718 6.56634 11.594 6.44412 11.7496 6.44412C11.9051 6.44412 12.0273 6.56634 12.0273 6.7219V11.9997H13.1385V7.83301C13.1385 7.67745 13.2607 7.55523 13.4162 7.55523C13.5718 7.55523 13.694 7.67745 13.694 7.83301V13.6663H14.8051L15.3607 12.2775C15.444 12.0275 15.6385 11.8386 15.9162 11.7719L16.194 11.6941L14.7551 15.333C14.2218 16.6719 12.9218 17.5552 11.4718 17.5552C9.6329 17.5552 8.13845 16.0608 8.13845 14.2219V9.2219Z" fill="#733500"/></svg>
              <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Warnings:</span>
            </div>
            <Chevron dir="right" color={C.textMuted} />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["Nut allergy", "Diabetes mellitus"].map(tag => (
              <span key={tag} style={{ background: "#FDE8DC", color: "#8B4513", fontSize: 13, fontWeight: 600, borderRadius: 20, padding: "5px 14px" }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Characteristics */}
        <div style={{ background: C.white, borderRadius: 16, padding: "14px 16px", boxShadow: C.cardShadow, marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="12" fill="#E9ECFB"/><path d="M12 6C12.0935 6 12.1776 6.02277 12.2526 6.06771C12.3277 6.11264 12.3851 6.1859 12.4245 6.28776L13.8698 9.88151L17.5762 10.2207C17.6798 10.2398 17.7622 10.2765 17.823 10.3307C17.8837 10.3851 17.9321 10.4554 17.9681 10.5417C18.0041 10.6279 18.0097 10.7184 17.9844 10.8125L17.9603 10.8809C17.9313 10.9464 17.8873 11.0047 17.8282 11.0553L15.0196 13.6139L15.8685 17.4082C15.9012 17.5136 15.8975 17.6114 15.8581 17.7018C15.8187 17.7923 15.7612 17.8622 15.6856 17.9108L15.6289 17.9434C15.5714 17.9725 15.5126 17.9902 15.4525 17.9974C15.3925 18.0044 15.3287 17.9955 15.2611 17.9701L15.1921 17.9388L12 15.9147L8.80798 17.9388C8.73774 17.9752 8.67133 17.9955 8.60876 17.9993L8.54756 17.9974C8.48749 17.9902 8.42864 17.9725 8.37113 17.9434L8.31449 17.9108C8.25782 17.8744 8.21085 17.8262 8.17452 17.7663L8.14196 17.7018C8.1026 17.6114 8.0989 17.5136 8.13155 17.4082L8.98051 13.6139L6.17191 11.0553C6.09297 10.9878 6.041 10.9065 6.01566 10.8125C5.99671 10.7419 5.99494 10.6736 6.01045 10.6074L6.03194 10.5417C6.06793 10.4554 6.11633 10.3851 6.17712 10.3307C6.22271 10.29 6.28058 10.2592 6.3503 10.2383L6.42386 10.2207L10.1302 9.88151L11.5756 6.28776C11.615 6.1859 11.6724 6.11264 11.7474 6.06771C11.8225 6.02277 11.9066 6 12 6ZM10.8295 10.8216L7.71293 11.1061L10.0834 13.2656L9.38415 16.3887L12 14.7311L14.6153 16.3887L13.9167 13.2656L16.2865 11.1061L13.1706 10.8216L12 7.91211L10.8295 10.8216Z" fill="#1F2853"/></svg>
              <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Characteristics:</span>
            </div>
            <Chevron dir="right" color={C.textMuted} />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["Tendency to wander", "No glyburide"].map(tag => (
              <span key={tag} style={{ background: "#EEEAF8", color: "#4A3A7A", fontSize: 13, fontWeight: 600, borderRadius: 20, padding: "5px 14px" }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Medical history + Devices */}
        <div style={{ display: "flex", gap: 10, marginBottom: 32 }}>
          <button style={{ flex: 1, background: C.white, border: "none", borderRadius: 16, padding: "14px 16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: C.cardShadow }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="12" fill="#F3F3F2"/><path d="M7.79961 18C7.46961 18 7.18711 17.8825 6.95211 17.6475C6.71711 17.4125 6.59961 17.13 6.59961 16.8V8.4C6.59961 8.07 6.71711 7.7875 6.95211 7.5525C7.18711 7.3175 7.46961 7.2 7.79961 7.2H10.3196C10.4496 6.84 10.6671 6.55 10.9721 6.33C11.2771 6.11 11.6196 6 11.9996 6C12.3796 6 12.7221 6.11 13.0271 6.33C13.3321 6.55 13.5496 6.84 13.6796 7.2H16.1996C16.5296 7.2 16.8121 7.3175 17.0471 7.5525C17.2821 7.7875 17.3996 8.07 17.3996 8.4V16.8C17.3996 17.13 17.2821 17.4125 17.0471 17.6475C16.8121 17.8825 16.5296 18 16.1996 18H7.79961ZM7.79961 16.8H16.1996V8.4H7.79961V16.8ZM9.59961 15.6H12.5996C12.7696 15.6 12.9121 15.5425 13.0271 15.4275C13.1421 15.3125 13.1996 15.17 13.1996 15C13.1996 14.83 13.1421 14.6875 13.0271 14.5725C12.9121 14.4575 12.7696 14.4 12.5996 14.4H9.59961C9.42961 14.4 9.28711 14.4575 9.17211 14.5725C9.05711 14.6875 8.99961 14.83 8.99961 15C8.99961 15.17 9.05711 15.3125 9.17211 15.4275C9.28711 15.5425 9.42961 15.6 9.59961 15.6ZM9.59961 13.2H14.3996C14.5696 13.2 14.7121 13.1425 14.8271 13.0275C14.9421 12.9125 14.9996 12.77 14.9996 12.6C14.9996 12.43 14.9421 12.2875 14.8271 12.1725C14.7121 12.0575 14.5696 12 14.3996 12H9.59961C9.42961 12 9.28711 12.0575 9.17211 12.1725C9.05711 12.2875 8.99961 12.43 8.99961 12.6C8.99961 12.77 9.05711 12.9125 9.17211 13.0275C9.28711 13.1425 9.42961 13.2 9.59961 13.2ZM9.59961 10.8H14.3996C14.5696 10.8 14.7121 10.7425 14.8271 10.6275C14.9421 10.5125 14.9996 10.37 14.9996 10.2C14.9996 10.03 14.9421 9.8875 14.8271 9.7725C14.7121 9.6575 14.5696 9.6 14.3996 9.6H9.59961C9.42961 9.6 9.28711 9.6575 9.17211 9.7725C9.05711 9.8875 8.99961 10.03 8.99961 10.2C8.99961 10.37 9.05711 10.5125 9.17211 10.6275C9.28711 10.7425 9.42961 10.8 9.59961 10.8ZM11.9996 7.95C12.1296 7.95 12.2371 7.9075 12.3221 7.8225C12.4071 7.7375 12.4496 7.63 12.4496 7.5C12.4496 7.37 12.4071 7.2625 12.3221 7.1775C12.2371 7.0925 12.1296 7.05 11.9996 7.05C11.8696 7.05 11.7621 7.0925 11.6771 7.1775C11.5921 7.2625 11.5496 7.37 11.5496 7.5C11.5496 7.63 11.5921 7.7375 11.6771 7.8225C11.7621 7.9075 11.8696 7.95 11.9996 7.95Z" fill="#4E4C4A"/></svg>
              <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Medical history</span>
            </div>
            <Chevron dir="right" color={C.textMuted} />
          </button>
          <button style={{ flex: 1, background: C.white, border: "none", borderRadius: 16, padding: "14px 16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: C.cardShadow }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="12" fill="#F3F3F2"/><path d="M13.4515 8.83315V6.96987C13.4514 6.86728 13.368 6.78376 13.2654 6.78376H10.6571C10.5546 6.78386 10.4711 6.86734 10.471 6.96987V8.83315C10.4709 9.14172 10.2207 9.39202 9.91211 9.39202C9.60352 9.39202 9.35334 9.14172 9.35324 8.83315V6.96987C9.35334 6.25003 9.93725 5.66611 10.6571 5.66602H13.2654C13.9853 5.66602 14.5691 6.24997 14.5692 6.96987V8.83315C14.5691 9.14172 14.3189 9.39202 14.0103 9.39202C13.7018 9.39192 13.4516 9.14166 13.4515 8.83315Z" fill="#4E4C4A"/><path d="M16.8047 11.3179V10.3235C16.8047 9.80935 16.3881 9.39194 15.8736 9.39184H8.04938C7.53482 9.39184 7.11775 9.80929 7.11775 10.3235V15.1667C7.11775 15.6809 7.53482 16.0983 8.04938 16.0983H11.4397C11.7483 16.0984 11.9986 16.3486 11.9986 16.6572C11.9986 16.9658 11.7483 17.216 11.4397 17.2161H8.04938C6.91714 17.2161 6 16.2978 6 15.1667V10.3235C6 9.19234 6.91714 8.27409 8.04938 8.27409H15.8736C17.0058 8.27419 17.9225 9.1924 17.9225 10.3235V11.3179C17.9225 11.6265 17.6722 11.8768 17.3636 11.8768C17.055 11.8767 16.8047 11.6265 16.8047 11.3179Z" fill="#4E4C4A"/><path d="M14.5963 12.9314C14.9921 12.9367 15.372 13.0645 15.6862 13.2894C16.0004 13.0642 16.3804 12.9361 16.7772 12.9314H16.7876C17.8202 12.9377 18.6702 13.7661 18.6672 14.8039L18.6607 14.9939C18.5996 15.9306 18.0945 16.6639 17.5762 17.178C17.0222 17.7276 16.4011 18.0799 16.1048 18.2319C15.8617 18.3569 15.5796 18.3651 15.3304 18.2592C15.3091 18.2514 15.2878 18.2429 15.2676 18.2325C14.9721 18.0807 14.351 17.7276 13.7967 17.178C13.2784 16.664 12.7728 15.9309 12.7117 14.9939L12.7057 14.8039C12.7035 13.7656 13.5532 12.9377 14.5854 12.9314H14.5963ZM16.7859 14.0491C16.5262 14.0537 16.2892 14.1831 16.149 14.3897C16.0451 14.5429 15.8719 14.6346 15.6868 14.6347C15.5016 14.6348 15.328 14.5434 15.2239 14.3902C15.0838 14.1841 14.8456 14.054 14.5854 14.0491C14.1535 14.0553 13.8222 14.3994 13.8235 14.8023V14.8039C13.8235 15.4185 14.1431 15.9475 14.5837 16.3845C14.9734 16.7708 15.4184 17.042 15.6862 17.1873C15.9539 17.0422 16.3994 16.7712 16.7892 16.3845C17.2299 15.9474 17.5495 15.4183 17.5495 14.8039V14.8017C17.5511 14.3997 17.2194 14.0545 16.7859 14.0491Z" fill="#4E4C4A"/></svg>
              <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Devices</span>
            </div>
            <Chevron dir="right" color={C.textMuted} />
          </button>
        </div>

        {/* Wellbeing score */}
        <button
          onClick={() => setWellbeingOpen(v => !v)}
          style={{
            width: "100%", border: "none", cursor: "pointer", padding: 0,
            background: "linear-gradient(135deg, #FFCCD8 0%, #FFFFFF 65%)",
            borderRadius: 14, boxShadow: C.cardShadow, marginBottom: 4,
          }}
        >
          <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/wellbeing-icon.png" alt="" style={{ width: 44, height: 44, borderRadius: 22, flexShrink: 0 }} />
            <div style={{ flex: 1, textAlign: "left" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Wellbeing score:</div>
              <div style={{ fontSize: 13, color: C.text, opacity: 0.7 }}>Support required</div>
            </div>
            <div style={{ textAlign: "right", opacity: wellbeingOpen ? 0 : 1, transition: "opacity 0.2s ease" }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: C.text, lineHeight: 1, fontFamily: "'SeasonMix', serif" }}>24</div>
              <div style={{ fontSize: 12, color: "#4CAF50", fontWeight: 600, marginTop: 2 }}>▲ 20</div>
            </div>
            <Chevron dir={wellbeingOpen ? "up" : "down"} color={C.wellbeingRed} />
          </div>
          <div style={{ overflow: "hidden", maxHeight: wellbeingOpen ? 160 : 0, transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)" }}>
            <div style={{ padding: "0 16px 16px" }}>
              <WellbeingExpanded />
            </div>
          </div>
        </button>

        {/* Updates */}
        <div id="sec-updates" /><SectionTitle>Updates</SectionTitle>
        <div>
          <UpdateRow label="Incontinence"                            time="16:42" date="09/10/26" type="food" />
          <UpdateRow label="Socialising and Bingo"                  time="18:42" date="09/10/26" type="social" />
          <UpdateRow label="Check on Ms. Turner about their cat"    time="18:42" date="09/10/26" type="chat" />
          <UpdateRow label="High temperature"                       time="12:42" date="09/10/26" type="temp"  faded={!updatesOpen} />
          <div style={{ overflow: "hidden", maxHeight: updatesOpen ? 200 : 0, transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)" }}>
            <UpdateRow label="Weight check"    time="09:00" date="09/10/26" type="hygiene" />
            <UpdateRow label="Morning hygiene" time="08:30" date="09/10/26" type="weight" />
          </div>
          <ExpandView open={updatesOpen} onClick={() => setUpdatesOpen(v => !v)} />
        </div>

        <div id="sec-medication" />{/* Medication status */}
        <SectionTitle badge={
          <button style={{ background: C.white, border: "none", cursor: "pointer", borderRadius: 20, padding: "7px 16px", fontSize: 13, fontWeight: 700, color: C.text, boxShadow: C.cardShadow }}>View history</button>
        }>Medication status</SectionTitle>
        <div style={{ background: "#5B5FD6", borderRadius: 12, padding: "9px 14px", marginBottom: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Friday 18</span>
        </div>
        <MedicationSection />

        <div id="sec-vitals" />{/* Vitals */}
        <SectionTitle>Vitals</SectionTitle>
        <div>
          <VitalRow
            icon={<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M13.2998 6.90039C13.7302 6.90039 14.1129 7.17567 14.249 7.58398L18.6992 20.9375L20.4512 15.6846L20.5137 15.5371C20.684 15.2111 21.0239 15 21.4004 15H25L25.1025 15.0059C25.6065 15.0572 25.9998 15.4825 26 16C26 16.5177 25.6066 16.9438 25.1025 16.9951L25 17H22.1211L19.6484 24.417C19.5122 24.825 19.1304 25.1005 18.7002 25.1006C18.2698 25.1006 17.8872 24.8252 17.751 24.417L13.2998 11.0625L11.5488 16.3164C11.4127 16.7247 11.03 17 10.5996 17H7C6.44772 17 6 16.5523 6 16C6.00021 15.4479 6.44785 15 7 15H9.87988L12.3516 7.58398L12.4131 7.4375C12.5832 7.1112 12.9232 6.90046 13.2998 6.90039Z" fill={C.text}/></svg>}
            label="Heart rate" chartColor="#6DBF5A"
            points={[72,78,74,80,76,82,79,75,77,73]} unit="bpm" value="77"
            labels={["11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"]}
            yLabels={["80","78","76","74","72","70"]}
          />
          <VitalRow
            icon={<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M11.9721 14.2C11.8596 13.8213 11.7996 13.4163 11.7996 13C11.7996 10.6788 13.6784 8.8 15.9996 8.8C18.3209 8.8 20.1996 10.6788 20.1996 13C20.1996 13.4163 20.1396 13.8213 20.0271 14.2H17.3646L18.2871 12.5388C18.5271 12.1038 18.3734 11.5563 17.9384 11.3163C17.5034 11.0763 16.9559 11.23 16.7159 11.665L15.3059 14.2038H11.9759L11.9721 14.2ZM12.3996 8.2H9.99961C8.67586 8.2 7.59961 9.27625 7.59961 10.6V22.6C7.59961 23.9238 8.67586 25 9.99961 25H21.9996C23.3234 25 24.3996 23.9238 24.3996 22.6V10.6C24.3996 9.27625 23.3234 8.2 21.9996 8.2H19.5996C18.5984 7.44625 17.3496 7 15.9996 7C14.6496 7 13.4009 7.44625 12.3996 8.2Z" fill={C.text}/></svg>}
            label="Weight" chartColor={C.purple}
            points={[90, 92.5, 90, 93.2, 88.7, 88, 88]} unit="kg" value="88"
            labels={["18:40\n11.04","11:21\n13.04","14:25\n14.04","19:38\n16.04","10:22\n17.04","11:22\n18.04","10:00\n20.04"]}
            badgeMode smoothCurve verticalGrid topBandColor="#FFF3E0" dotColor="#4CAF50"
            expandHeight={360}
          />
          <VitalRow
            icon={<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M18.4855 7.21695C18.6581 7.06914 18.8801 6.9919 19.1071 7.00067C19.3342 7.00944 19.5496 7.10358 19.7103 7.26426C19.871 7.42494 19.9651 7.64034 19.9739 7.86741C19.9826 8.09448 19.9054 8.3165 19.7576 8.4891L16.9246 11.277L17.6103 12.1341L19.3606 16.6453C19.4498 16.8832 19.4682 17.1417 19.4138 17.3899C19.3594 17.638 19.2344 17.8651 19.0539 18.0438L16.266 20.8317C16.0068 21.0746 15.6648 21.2098 15.3096 21.2098C14.9543 21.2098 14.6124 21.0746 14.3532 20.8317L10.2029 16.6814C10.0849 16.5632 9.99213 16.4223 9.93011 16.2672C9.86808 16.1122 9.83812 15.9461 9.84204 15.7792L9.39092 9.96877H10.3563C10.4817 9.96434 10.6067 9.98613 10.7232 10.0327C10.8397 10.0793 10.9452 10.1497 11.033 10.2394L11.1593 10.3928L12.1067 13.5326M12.1067 25L7 19.9114L8.91274 17.9987L14.0194 23.1053M22.7891 9.21089C22.7891 9.21089 20.5335 11.7011 20.5335 13.2709C20.5335 13.8692 20.7712 14.4429 21.1942 14.8659C21.6172 15.2889 22.1909 15.5265 22.7891 15.5265C23.3873 15.5265 23.961 15.2889 24.3841 14.8659C24.8071 14.4429 25.0447 13.8692 25.0447 13.2709C25.0447 11.7011 22.7891 9.21089 22.7891 9.21089Z" fill={C.text}/></svg>}
            label="Blood sugar" chartColor="#1A3ACF"
            points={[69,70,71,68,68,65,67]} unit="mmol/L" value="5.6"
            labels={["11:00","12:00","13:00","14:00","15:00","16:00","17:00"]}
            badgeMode expandHeight={310}
          />
        </div>

        {/* Treatment plan */}
        <div id="sec-treatment" />
        <SectionTitle badge={
          <button style={{ background: C.white, border: "none", cursor: "pointer", borderRadius: 22, boxShadow: C.cardShadow, padding: "7px 14px", fontSize: 12, fontWeight: 600, color: C.text }}>View calendar</button>
        }>Treatment plan</SectionTitle>
        <TreatmentDay day="FRI" date="18" appointments={["Physiotherapy session", "Medication review"]} />
        <TreatmentDay day="SAT" date="19" appointments={["Blood pressure check"]} showSeparator />
        <TreatmentDay day="SUN" date="20" appointments={["Occupational therapy"]} faded={!treatmentOpen} showSeparator />
        <div style={{ overflow: "hidden", maxHeight: treatmentOpen ? 300 : 0, transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)" }}>
          <TreatmentDay day="MON" date="21" appointments={["Cardiology consultation", "Mobility assessment"]} showSeparator />
        </div>
        <ExpandView open={treatmentOpen} onClick={() => setTreatmentOpen(v => !v)} />

        <div id="sec-contacts" />
        <div style={{ display: "flex", gap: 12, marginBottom: 150, marginTop: 16 }}>
          <button style={{ flex: 1, background: "#F9F6F1", border: "none", borderRadius: 24, padding: "24px 16px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, boxShadow: C.cardShadow }}>
            <svg width="24" height="24" viewBox="0 0 18 18" fill="none">
              <path d="M9 10C9.96667 10 10.7917 9.65833 11.475 8.975C12.1583 8.29167 12.5 7.46667 12.5 6.5C12.5 5.53333 12.1583 4.70833 11.475 4.025C10.7917 3.34167 9.96667 3 9 3C8.03333 3 7.20833 3.34167 6.525 4.025C5.84167 4.70833 5.5 5.53333 5.5 6.5C5.5 7.46667 5.84167 8.29167 6.525 8.975C7.20833 9.65833 8.03333 10 9 10ZM2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H16C16.55 0 17.0208 0.195833 17.4125 0.5875C17.8042 0.979167 18 1.45 18 2V16C18 16.55 17.8042 17.0208 17.4125 17.4125C17.0208 17.8042 16.55 18 16 18H2ZM2 16H16V14.85C15.1 13.9667 14.0542 13.2708 12.8625 12.7625C11.6708 12.2542 10.3833 12 9 12C7.61667 12 6.32917 12.2542 5.1375 12.7625C3.94583 13.2708 2.9 13.9667 2 14.85V16Z" fill={C.text} />
            </svg>
            <div>
              <div style={{ fontSize: 15, color: C.text, fontWeight: 700 }}>Contacts</div>
              <div style={{ fontSize: 12, color: C.textMuted, fontWeight: 500, marginTop: 2 }}>Practitioner &amp; relatives</div>
            </div>
          </button>
          <button style={{ flex: 1, background: "#F9F6F1", border: "none", borderRadius: 24, padding: "24px 16px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, boxShadow: C.cardShadow }}>
            <svg width="24" height="24" viewBox="0 0 18 20" fill="none">
              <path d="M2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4C0 3.45 0.195833 2.97917 0.5875 2.5875C0.979167 2.19583 1.45 2 2 2H6.2C6.41667 1.4 6.77917 0.916667 7.2875 0.55C7.79583 0.183333 8.36667 0 9 0C9.63333 0 10.2042 0.183333 10.7125 0.55C11.2208 0.916667 11.5833 1.4 11.8 2H16C16.55 2 17.0208 2.19583 17.4125 2.5875C17.8042 2.97917 18 3.45 18 4V18C18 18.55 17.8042 19.0208 17.4125 19.4125C17.0208 19.8042 16.55 20 16 20H2ZM5 16H10C10.2833 16 10.5208 15.9042 10.7125 15.7125C10.9042 15.5208 11 15.2833 11 15C11 14.7167 10.9042 14.4792 10.7125 14.2875C10.5208 14.0958 10.2833 14 10 14H5C4.71667 14 4.47917 14.0958 4.2875 14.2875C4.09583 14.4792 4 14.7167 4 15C4 15.2833 4.09583 15.5208 4.2875 15.7125C4.47917 15.9042 4.71667 16 5 16ZM5 12H13C13.2833 12 13.5208 11.9042 13.7125 11.7125C13.9042 11.5208 14 11.2833 14 11C14 10.7167 13.9042 10.4792 13.7125 10.2875C13.5208 10.0958 13.2833 10 13 10H5C4.71667 10 4.47917 10.0958 4.2875 10.2875C4.09583 10.4792 4 10.7167 4 11C4 11.2833 4.09583 11.5208 4.2875 11.7125C4.47917 11.9042 4.71667 12 5 12ZM5 8H13C13.2833 8 13.5208 7.90417 13.7125 7.7125C13.9042 7.52083 14 7.28333 14 7C14 6.71667 13.9042 6.47917 13.7125 6.2875C13.5208 6.09583 13.2833 6 13 6H5C4.71667 6 4.47917 6.09583 4.2875 6.2875C4.09583 6.47917 4 6.71667 4 7C4 7.28333 4.09583 7.52083 4.2875 7.7125C4.47917 7.90417 4.71667 8 5 8ZM9 3.25C9.21667 3.25 9.39583 3.17917 9.5375 3.0375C9.67917 2.89583 9.75 2.71667 9.75 2.5C9.75 2.28333 9.67917 2.10417 9.5375 1.9625C9.39583 1.82083 9.21667 1.75 9 1.75C8.78333 1.75 8.60417 1.82083 8.4625 1.9625C8.32083 2.10417 8.25 2.28333 8.25 2.5C8.25 2.71667 8.32083 2.89583 8.4625 3.0375C8.60417 3.17917 8.78333 3.25 9 3.25Z" fill={C.text} />
            </svg>
            <div>
              <div style={{ fontSize: 15, color: C.text, fontWeight: 700 }}>Documents</div>
              <div style={{ fontSize: 12, color: C.textMuted, fontWeight: 500, marginTop: 2 }}>Residency &amp; tests</div>
            </div>
          </button>
        </div>

      </div>

      </div>{/* end scroll container */}

      {/* ── Floating mic button ──────────────────────────────────────────── */}
      <div style={{ position: "absolute", bottom: 16, left: 0, right: 0, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
        <button style={{ background: "none", border: "none", cursor: "pointer", padding: 0, pointerEvents: "auto" }}>
          <svg width="108" height="108" viewBox="0 0 147 146" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#mic_filter)">
              <ellipse cx="73.5" cy="69" rx="65.5" ry="65" fill="url(#mic_grad)"/>
              <path d="M77.7145 53.215C77.7145 52.0768 77.2705 50.9845 76.48 50.1797C75.6897 49.3753 74.6185 48.9229 73.501 48.9228C72.3831 48.9228 71.3103 49.3749 70.5199 50.1797C69.7294 50.9845 69.2854 52.0768 69.2854 53.215V68.9999C69.2854 70.1382 69.7294 71.2304 70.5199 72.0353C71.3103 72.8399 72.3832 73.2922 73.501 73.2922C74.6183 73.2921 75.6898 72.8395 76.48 72.0353C77.2705 71.2304 77.7145 70.1382 77.7145 68.9999V53.215ZM80.9121 68.9999C80.9121 71.0015 80.1329 72.9218 78.7429 74.3372C77.3529 75.7525 75.4667 76.5478 73.501 76.548C71.5352 76.548 69.6492 75.7524 68.259 74.3372C66.8689 72.9218 66.0877 71.0016 66.0877 68.9999V53.215C66.0877 51.2133 66.8689 49.2932 68.259 47.8778C69.6492 46.4624 71.535 45.667 73.501 45.667C75.4667 45.6671 77.3529 46.4625 78.7429 47.8778C80.1327 49.2931 80.9121 51.2136 80.9121 53.215V68.9999Z" fill="white"/>
              <path d="M58.3359 69.0003V65.0536C58.3359 64.1545 59.0517 63.4257 59.9347 63.4257C60.8177 63.4257 61.5336 64.1545 61.5336 65.0536V69.0003C61.5337 72.2317 62.7952 75.3317 65.0393 77.6166C67.2832 79.9009 70.3265 81.1838 73.4997 81.184C76.6732 81.184 79.7179 79.9013 81.9621 77.6166C84.2062 75.3317 85.4677 72.2317 85.4678 69.0003V65.0536C85.4678 64.1545 86.1837 63.4257 87.0667 63.4257C87.9494 63.426 88.6655 64.1547 88.6655 65.0536V69.0003C88.6654 73.0952 87.0667 77.0231 84.2229 79.9186C81.3791 82.8138 77.5213 84.4398 73.4997 84.4398C69.4785 84.4395 65.6221 82.8134 62.7785 79.9186C59.9347 77.0231 58.336 73.0952 58.3359 69.0003Z" fill="white"/>
              <path d="M71.9016 90.7058V82.8123C71.9016 81.9132 72.6167 81.184 73.4997 81.184C74.3827 81.184 75.0992 81.9132 75.0992 82.8123V90.7058C75.0988 91.6045 74.3832 92.3337 73.5004 92.3337C72.6177 92.3337 71.902 91.6045 71.9016 90.7058Z" fill="white"/>
              <path d="M81.2517 89.0771C82.1347 89.0771 82.8505 89.806 82.8505 90.705C82.8505 91.6041 82.1347 92.3329 81.2517 92.3329H65.7486C64.8656 92.3329 64.1498 91.6041 64.1498 90.705C64.1498 89.806 64.8656 89.0771 65.7486 89.0771H81.2517Z" fill="white"/>
            </g>
            <defs>
              <filter id="mic_filter" x="0" y="0" width="147" height="146" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="4"/>
                <feGaussianBlur stdDeviation="4"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0.188235 0 0 0 0 0.192157 0 0 0 0 0.2 0 0 0 0.1 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset/>
                <feGaussianBlur stdDeviation="0.5"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0.188235 0 0 0 0 0.192157 0 0 0 0 0.2 0 0 0 0.05 0"/>
                <feBlend mode="normal" in2="effect1_dropShadow" result="effect2_dropShadow"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow" result="shape"/>
              </filter>
              <radialGradient id="mic_grad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(54.1199 4) rotate(81.5209) scale(131.437 132.448)">
                <stop offset="0.280255" stopColor="#86ACFF"/>
                <stop offset="1" stopColor="#5168E7"/>
              </radialGradient>
            </defs>
          </svg>
        </button>
      </div>

    </div>
  );
}
