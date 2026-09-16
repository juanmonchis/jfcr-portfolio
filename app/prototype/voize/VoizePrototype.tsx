"use client";

import { useState, useRef, useEffect } from "react";

const C = {
  bg:           "#F2F0EB",
  white:        "#FFFFFF",
  text:         "#747371",
  textMid:      "#6B6880",
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
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "18px 0 10px" }}>
      <div style={{ fontSize: 20, fontWeight: 700, color: C.text, fontFamily: "'SeasonMix', serif" }}>{children}</div>
      {badge}
    </div>
  );
}

function ExpandView({ label = "Expand view", open = false, onClick }: { label?: string; open?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "11px 0 4px", display: "flex", justifyContent: "center", alignItems: "center", gap: 5 }}>
      <span style={{ fontSize: 13, color: C.purple, fontWeight: 600 }}>{open ? "Collapse view" : label}</span>
      <Chevron dir={open ? "up" : "down"} color={C.purple} />
    </button>
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
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const scores = [62, 55, 48, 70, 44, 30, 24];
  return (
    <div style={{ paddingTop: 12 }}>
      <div style={{ fontSize: 12, color: C.wellbeingRed, fontWeight: 600, marginBottom: 8, opacity: 0.7 }}>7-day trend</div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 60 }}>
        {days.map((d, i) => {
          const isToday = i === 6;
          const barH = Math.max(6, (scores[i] / 100) * 56);
          return (
            <div key={d} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <div style={{ width: "100%", height: barH, borderRadius: 4, background: isToday ? "linear-gradient(180deg, #EF5350 0%, #B71C1C 100%)" : "rgba(239,83,80,0.2)" }} />
              <span style={{ fontSize: 9, color: isToday ? C.wellbeingRed : C.textMuted, fontWeight: isToday ? 700 : 400 }}>{d}</span>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        {[["Avg score", "44"], ["Best day", "Thu"], ["Target", "70+"]].map(([k, v]) => (
          <div key={k} style={{ flex: 1, background: "rgba(229,57,53,0.07)", borderRadius: 10, padding: "8px 10px" }}>
            <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 2 }}>{k}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.wellbeingRed }}>{v}</div>
          </div>
        ))}
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

function MedCard({ name, dose, type, badge, iconBg }: { name: string; dose: string; type: "pill" | "drop" | "syringe"; badge?: string; iconBg: string }) {
  const bs = badge ? (BADGE_STYLES[badge] ?? BADGE_STYLES.default) : null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, background: C.white, borderRadius: 16, padding: "12px 14px", boxShadow: C.cardShadow, marginBottom: 8 }}>
      <MedImg type={type} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{name}</div>
        <div style={{ fontSize: 13, color: C.textMid, marginTop: 1 }}>{dose}</div>
        {badge && bs && (
          <span style={{ fontSize: 11, fontWeight: 700, background: bs.bg, color: bs.color, borderRadius: 6, padding: "3px 9px", display: "inline-block", marginTop: 5 }}>{badge}</span>
        )}
      </div>
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
          <MedCard name="Aspirine" dose="15 mg" type="pill" badge="Crushed" iconBg={C.medPurpleBg} />
          <StringNotification text="String" />
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
      {/* Expand view as white card */}
      <div style={{ background: C.white, borderRadius: 14, boxShadow: C.cardShadow, marginTop: 4 }}>
        <ExpandView open={expanded} onClick={() => setExpanded(v => !v)} />
      </div>
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
function TreatmentDay({ day, date, appointments, faded }: { day: string; date: string; appointments: string[]; faded?: boolean }) {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 8, opacity: faded ? 0.45 : 1 }}>
      <div style={{ width: 34, flexShrink: 0, paddingTop: 4 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.06em" }}>{day}</div>
        <div style={{ fontSize: 17, fontWeight: 700, color: C.text, lineHeight: 1.1 }}>{date}</div>
      </div>
      <div style={{ flex: 1 }}>
        {appointments.map((apt, i) => (
          <div key={i} style={{ background: faded ? "transparent" : C.white, borderRadius: 14, padding: "10px 14px", marginBottom: 6, display: "flex", alignItems: "center", gap: 10, boxShadow: faded ? "none" : C.cardShadow, border: faded ? `1.5px dashed ${C.border}` : "none" }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: C.purpleDim, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="2" y="3" width="10" height="9" rx="2" stroke={C.purple} strokeWidth="1.3" />
                <path d="M5 1.5V4M9 1.5V4" stroke={C.purple} strokeWidth="1.3" strokeLinecap="round" />
                <path d="M2 6h10" stroke={C.purple} strokeWidth="1.3" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{apt}</div>
              <div style={{ fontSize: 12, color: C.textMuted }}>14:00</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Bottom nav ────────────────────────────────────────────────────────────────
function BottomNav() {
  const items = [
    { label: "Contacts", icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="8" r="3.5" stroke={C.textMid} strokeWidth="1.4" />
        <path d="M4.5 19c0-3.5 2.9-6 6.5-6s6.5 2.5 6.5 6" stroke={C.textMid} strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    )},
    { label: "Documents", icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="4" y="2" width="10" height="14" rx="2" stroke={C.textMid} strokeWidth="1.4" />
        <path d="M8 6h4M8 9h4M8 12h2" stroke={C.textMid} strokeWidth="1.4" strokeLinecap="round" />
        <rect x="8" y="6" width="10" height="14" rx="2" fill={C.white} stroke={C.textMid} strokeWidth="1.4" />
        <path d="M12 10h4M12 13h4M12 16h2" stroke={C.textMid} strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    )},
    { label: "Emergency", icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="8.5" stroke="#EF5350" strokeWidth="1.4" />
        <rect x="9.5" y="5.5" width="3" height="11" rx="1.5" fill="#EF5350" />
        <rect x="5.5" y="9.5" width="11" height="3" rx="1.5" fill="#EF5350" />
      </svg>
    )},
  ];
  return (
    <div style={{ background: C.white, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-around", padding: "10px 0 18px" }}>
      {items.map(({ label, icon }) => (
        <button key={label} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "4px 16px" }}>
          {icon}
          <span style={{ fontSize: 11, color: C.textMid, fontWeight: 600 }}>{label}</span>
        </button>
      ))}
    </div>
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

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const SCROLL_RANGE = 240;

    const COMPACT_THRESHOLD = 100;
    const EXPAND_THRESHOLD = 60;
    const onScroll = () => {
      setProgress(Math.min(1, Math.max(0, el.scrollTop / SCROLL_RANGE)));
      if (el.scrollTop > 10) setHeroOpen(false);
      setIsCompact(prev => el.scrollTop > COMPACT_THRESHOLD ? true : el.scrollTop < EXPAND_THRESHOLD ? false : prev);
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
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg, #7B5CF6 0%, #5B3FD6 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2C9 2 4 8 4 12A5 5 0 0 0 14 12C14 8 9 2 9 2Z" fill="white" /></svg>
                </div>
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

        {/* Warnings + Characteristics grid */}
        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          {[
            { title: "Warnings:", items: ["Nut allergy", "No asprine"] },
            { title: "Characteristics:", items: ["Tendency to wander", "Diabetes mellitus"] },
          ].map(({ title, items }) => (
            <div key={title} style={{ flex: 1, background: C.white, borderRadius: 14, padding: "12px 14px", boxShadow: C.cardShadow }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.textMid, marginBottom: 7 }}>{title}</div>
              {items.map(item => <div key={item} style={{ fontSize: 13, color: C.purple, fontWeight: 600, lineHeight: 1.9 }}>{item}</div>)}
            </div>
          ))}
        </div>

        {/* Wellbeing score */}
        <button
          onClick={() => setWellbeingOpen(v => !v)}
          style={{
            width: "100%", border: "none", cursor: "pointer", padding: 0,
            background: "linear-gradient(to right, rgba(255,51,116,0.12) 0%, #FFFFFF 65%)",
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
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: C.text, lineHeight: 1, fontFamily: "'SeasonMix', serif" }}>24</div>
              <div style={{ fontSize: 12, color: "#4CAF50", fontWeight: 600, marginTop: 2 }}>▲ 20</div>
            </div>
            <Chevron dir={wellbeingOpen ? "up" : "down"} color={C.wellbeingRed} />
          </div>
          <div style={{ overflow: "hidden", maxHeight: wellbeingOpen ? 220 : 0, transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)" }}>
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
          <div style={{ background: C.white, borderRadius: 14, boxShadow: C.cardShadow, marginTop: 4 }}>
            <ExpandView open={updatesOpen} onClick={() => setUpdatesOpen(v => !v)} />
          </div>
        </div>

        <div id="sec-medication" />{/* Medication status */}
        <SectionTitle badge={
          <div style={{ background: C.fridayBg, borderRadius: 20, padding: "5px 12px" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.fridayText }}>Friday 18</span>
          </div>
        }>Medication status</SectionTitle>
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
        <div id="sec-treatment" /><SectionTitle>Treatment plan</SectionTitle>
        <TreatmentDay day="FRI" date="18" appointments={["X-ray appointment", "X-ray appointment"]} />
        <TreatmentDay day="SAT" date="19" appointments={["X-ray appointment"]} />
        <TreatmentDay day="SUN" date="20" appointments={["X-ray appointment"]} faded />
        <div style={{ overflow: "hidden", maxHeight: treatmentOpen ? 300 : 0, transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)" }}>
          <TreatmentDay day="MON" date="21" appointments={["Physiotherapy", "Blood test"]} />
        </div>
        <ExpandView open={treatmentOpen} onClick={() => setTreatmentOpen(v => !v)} />

        <div id="sec-contacts" />
        <SectionTitle>Contacts &amp; documents</SectionTitle>
        <div style={{ background: C.white, borderRadius: 14, boxShadow: C.cardShadow, padding: "16px", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 13, color: C.textMuted }}>No contacts or documents added</span>
        </div>

      </div>

      {/* ── Bottom nav ─────────────────────────────────────────────────────── */}
      <div style={{ position: "sticky", bottom: 0 }}>
        <BottomNav />
      </div>

      </div>{/* end scroll container */}
    </div>
  );
}
