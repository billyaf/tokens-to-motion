import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useTheme } from "../theme";

// Theme gradient, a soft glow behind the title, slow drifting bokeh, two translucent waves and an accent
// swoosh at the bottom. Everything moves slowly so the text stays the focus.
const BOKEH = [
  { x: 120, y: 420, r: 90, a: 0.18, accent: false },
  { x: 930, y: 640, r: 130, a: 0.12, accent: false },
  { x: 860, y: 1180, r: 70, a: 0.35, accent: true },
  { x: 90, y: 1320, r: 110, a: 0.22, accent: true },
  { x: 540, y: 300, r: 60, a: 0.14, accent: false },
];

export const Background: React.FC = () => {
  const f = useCurrentFrame();
  const t = useTheme();
  const c = t.color;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${c.bgTop} 0%, ${c.bgMid} 45%, ${c.bgBottom} 100%)`, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 32% at 50% 34%, rgba(255,255,255,.22), transparent 70%)" }} />
      {BOKEH.map((b, i) => {
        const dy = Math.sin(f / 90 + i) * 18;
        return <div key={i} style={{ position: "absolute", left: b.x - b.r, top: b.y - b.r + dy, width: b.r * 2, height: b.r * 2, borderRadius: "50%", background: b.accent ? c.accent : "#fff", opacity: b.a, filter: "blur(18px)" }} />;
      })}
      <svg width={1080} height={520} viewBox="0 0 1080 520" style={{ position: "absolute", bottom: 0 }}>
        <path d={wave(f, 0)} fill="rgba(255,255,255,.16)" />
        <path d={wave(f, 1)} fill="rgba(255,255,255,.26)" />
        <path d={`M-20 ${300 + Math.sin(f / 60) * 8} C 300 220, 700 380, 1100 ${260 + Math.cos(f / 60) * 8}`} stroke={c.accent} strokeWidth={6} fill="none" opacity={interpolate(f, [0, 20], [0, 0.9], { extrapolateRight: "clamp" })} />
      </svg>
    </AbsoluteFill>
  );
};

function wave(f: number, layer: number) {
  const amp = 26 + layer * 10, base = 330 + layer * 60, shift = f / (70 + layer * 30);
  const y = (x: number) => base + Math.sin(x / 180 + shift + layer) * amp;
  let d = `M0 ${y(0)}`;
  for (let x = 40; x <= 1080; x += 40) d += ` L${x} ${y(x).toFixed(1)}`;
  return `${d} L1080 520 L0 520 Z`;
}
