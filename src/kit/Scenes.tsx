import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { Scene } from "../types";
import { SAFE, SIZE, shade, useTheme } from "../theme";
import { FooterPill } from "./Frame";
import { Badge, Rich, Title, useEnter } from "./Text";

// Content is centred inside the safe zone so it is never covered by the platform UI.
const column: React.CSSProperties = { position: "absolute", left: SAFE.side, right: SAFE.side, top: SAFE.top, bottom: SIZE.h - SAFE.bottom, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 34 };
const columnTop: React.CSSProperties = { ...column, bottom: undefined, top: SAFE.top + 60, justifyContent: "flex-start" };

export const SceneView: React.FC<{ s: Scene }> = ({ s }) => {
  switch (s.type) {
    case "intro": return <Intro s={s} />;
    case "point": return <Point s={s} />;
    case "stat": return <Stat s={s} />;
    case "list": return <List s={s} />;
    case "outro": return <Outro s={s} />;
  }
};

const Intro: React.FC<{ s: Extract<Scene, { type: "intro" }> }> = ({ s }) => {
  const f = useCurrentFrame();
  const t = useTheme();
  const rise = interpolate(f, [8, 40], [260, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sub = useEnter(22);
  return (
    <AbsoluteFill>
      {s.photo && <Img src={staticFile(s.photo)} style={{ position: "absolute", left: "50%", bottom: -240, height: 1250, transform: `translate(-50%, ${rise}px)`, objectFit: "contain", filter: `drop-shadow(0 20px 40px ${shade(t, 0.35)})` }} />}
      <div style={s.photo ? columnTop : column}>
        {s.tag && <Badge>{s.tag}</Badge>}
        <Title text={s.title} delay={6} />
        {s.highlight && <Badge big delay={14}>{s.highlight}</Badge>}
        {s.sub && <div style={{ ...sub, color: t.color.text, fontSize: 40, fontWeight: 500, maxWidth: 820 }}><Rich text={s.sub} /></div>}
      </div>
    </AbsoluteFill>
  );
};

const Point: React.FC<{ s: Extract<Scene, { type: "point" }> }> = ({ s }) => {
  const body = useEnter(10);
  const t = useTheme();
  return (
    <div style={column}>
      {s.title && <Title text={s.title} size={64} />}
      <div style={{ ...body, background: t.color.panel, color: t.color.text, borderRadius: 28, padding: "40px 46px", fontSize: 44, lineHeight: 1.35, fontWeight: 400 }}>
        <Rich text={s.text} boldColor={t.color.accent} />
      </div>
      {s.highlight && <Badge delay={24}>{s.highlight}</Badge>}
    </div>
  );
};

const Stat: React.FC<{ s: Extract<Scene, { type: "stat" }> }> = ({ s }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();
  const n = interpolate(f, [6, fps * 1.4], [0, s.value], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const label = useEnter(18);
  const shown = n.toLocaleString("en-US", { minimumFractionDigits: s.decimals ?? 0, maximumFractionDigits: s.decimals ?? 0 });
  return (
    <div style={{ ...column, gap: 26 }}>
      <div style={{ color: t.color.text, fontWeight: 800, fontSize: 210, lineHeight: 1, letterSpacing: -4, textShadow: `0 6px 0 ${shade(t, 0.5)}`, fontVariantNumeric: "tabular-nums" }}>
        {shown}<span style={{ fontSize: 96, color: t.color.accent }}>{s.unit ?? ""}</span>
      </div>
      <div style={{ ...label, background: t.color.card, color: t.color.onCard, borderRadius: 18, padding: "18px 34px", fontSize: 44, fontWeight: 700 }}><Rich text={s.label} /></div>
      {s.source && <div style={{ ...label, color: t.color.text, opacity: 0.85, fontSize: 26 }}>Source: {s.source}</div>}
    </div>
  );
};

const Item: React.FC<{ text: string; i: number }> = ({ text, i }) => {
  const m = useEnter(12 + i * 10);
  const t = useTheme();
  return (
    <div style={{ ...m, display: "flex", alignItems: "center", gap: 24, background: t.color.card, color: t.color.onCard, borderRadius: 22, padding: "22px 28px", fontSize: 38, textAlign: "left", width: "100%", boxShadow: `0 10px 26px ${shade(t, 0.2)}` }}>
      <span style={{ flex: "none", width: 58, height: 58, borderRadius: "50%", background: t.color.accent, color: t.color.onAccent, display: "grid", placeItems: "center", fontWeight: 800, fontSize: 30 }}>{i + 1}</span>
      <span><Rich text={text} /></span>
    </div>
  );
};

const List: React.FC<{ s: Extract<Scene, { type: "list" }> }> = ({ s }) => (
  <div style={{ ...column, gap: 22 }}>
    <Title text={s.title} size={66} />
    {s.items.slice(0, 5).map((b, i) => <Item key={i} text={b} i={i} />)}
  </div>
);

const Outro: React.FC<{ s: Extract<Scene, { type: "outro" }> }> = ({ s }) => {
  const f = useCurrentFrame();
  const t = useTheme();
  const tags = useEnter(18);
  return (
    <AbsoluteFill>
      <div style={{ ...column, bottom: SIZE.h - SAFE.bottom + 150 }}>
        <Badge tilt={false}><span style={{ textTransform: "none", fontWeight: 700, fontSize: 48, lineHeight: 1.25, display: "block", whiteSpace: "pre-line" }}><Rich text={s.text} /></span></Badge>
        {s.tags && <div style={{ ...tags, color: t.color.text, fontSize: 32, fontWeight: 600 }}>{s.tags.join("  ")}</div>}
      </div>
      <FooterPill y={SAFE.bottom - 110} o={interpolate(f, [20, 36], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
    </AbsoluteFill>
  );
};
