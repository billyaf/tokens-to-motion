import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { shade, useTheme } from "../theme";

// "**word**" → bold (optionally in another colour).
export const Rich: React.FC<{ text: string; boldColor?: string }> = ({ text, boldColor }) => (
  <>{text.split(/(\*\*[^*]+\*\*)/g).map((p, i) => (p.startsWith("**") ? <b key={i} style={{ fontWeight: 700, color: boldColor }}>{p.slice(2, -2)}</b> : <span key={i}>{p}</span>))}</>
);

// Rise in with a soft spring; `delay` in frames. Spring settings come from the theme.
export function useEnter(delay = 0) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useTheme();
  const s = spring({ frame: f - delay, fps, config: t.motion.spring });
  return { opacity: interpolate(s, [0, 1], [0, 1]), transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)` };
}

export const Badge: React.FC<{ children: React.ReactNode; big?: boolean; tilt?: boolean; delay?: number }> = ({ children, big, tilt = true, delay = 0 }) => {
  const m = useEnter(delay);
  const t = useTheme();
  return (
    <div style={{ ...m, display: "inline-block", background: t.color.accent, color: t.color.onAccent, fontWeight: 800, textTransform: "uppercase", fontSize: big ? 84 : 46, lineHeight: 1.05, padding: big ? "14px 34px" : "10px 26px", borderRadius: 10, transform: `${m.transform} rotate(${tilt ? -2 : 0}deg)`, boxShadow: `0 12px 30px ${shade(t, 0.3)}` }}>
      {children}
    </div>
  );
};

export const Title: React.FC<{ text: string; size?: number; delay?: number }> = ({ text, size = 92, delay = 0 }) => {
  const m = useEnter(delay);
  const t = useTheme();
  return (
    <div style={{ ...m, color: t.color.text, fontWeight: 800, textTransform: "uppercase", fontSize: size, lineHeight: 1.02, letterSpacing: -1, textShadow: `0 3px 0 ${shade(t, 0.55)}, 0 10px 30px ${shade(t, 0.35)}`, textWrap: "balance" }}>
      {text}
    </div>
  );
};
