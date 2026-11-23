import { AbsoluteFill } from "remotion";
import { shade, useTheme } from "../theme";

// Brand anchors that stay on screen: a text wordmark top left (no logo files needed), and a footer pill
// with handle + site used by the outro scene.
export const Frame: React.FC = () => {
  const t = useTheme();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 60, top: 84, color: t.color.text, fontWeight: 800, fontSize: 40, letterSpacing: 4, opacity: 0.95 }}>{t.brand.mark}</div>
    </AbsoluteFill>
  );
};

export const FooterPill: React.FC<{ y: number; o?: number }> = ({ y, o = 1 }) => {
  const t = useTheme();
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: y, height: 64, opacity: o, background: t.color.card, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 8px 0 28px", color: t.color.onCard, fontSize: 22, fontWeight: 600, boxShadow: `0 10px 30px ${shade(t, 0.25)}` }}>
      <span>{t.brand.handle ?? ""}</span>
      {t.brand.site && (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 14, height: 48, padding: "0 24px 0 8px", background: t.color.onCard, color: t.color.card, borderRadius: 999, fontWeight: 700 }}>
          <span style={{ width: 32, height: 32, borderRadius: "50%", background: t.color.accent, color: t.color.onAccent, display: "grid", placeItems: "center", fontSize: 18 }}>›</span>
          {t.brand.site}
        </span>
      )}
    </div>
  );
};
