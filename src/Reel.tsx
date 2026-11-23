import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as poppins } from "@remotion/google-fonts/Poppins";
import { loadFont as inter } from "@remotion/google-fonts/Inter";
import { loadFont as grotesk } from "@remotion/google-fonts/SpaceGrotesk";
import type { Reel as ReelData } from "./types";
import { DEFAULT_THEME, ThemeProvider } from "./theme";
import { Background } from "./kit/Background";
import { Frame } from "./kit/Frame";
import { SceneView } from "./kit/Scenes";

const FONTS: Record<string, string> = {
  Poppins: poppins("normal", { weights: ["400", "500", "600", "700", "800"], subsets: ["latin"] }).fontFamily,
  Inter: inter("normal", { weights: ["400", "500", "600", "700", "800"], subsets: ["latin"] }).fontFamily,
  "Space Grotesk": grotesk("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] }).fontFamily,
};

export const totalFrames = (d: ReelData, fps: number) => d.scenes.reduce((n, s) => n + Math.round(s.seconds * fps), 0) || fps;

// Background and frame stay; scenes change with a short crossfade (length from the theme).
export const Reel: React.FC<ReelData> = (d) => {
  const { fps } = useVideoConfig();
  const t = d.tokens ?? DEFAULT_THEME;
  let start = 0;
  return (
    <ThemeProvider value={t}>
      <AbsoluteFill style={{ fontFamily: FONTS[t.font] ?? FONTS.Poppins, color: t.color.text }}>
        <Background />
        {d.scenes.map((s, i) => {
          const dur = Math.round(s.seconds * fps);
          const from = start;
          start += dur;
          return (
            <Sequence key={i} from={from} durationInFrames={dur} name={`${i + 1}. ${s.type}`}>
              <Fade dur={dur} len={t.motion.crossfadeFrames}><SceneView s={s} /></Fade>
            </Sequence>
          );
        })}
        <Frame />
        {d.voiceover && <Audio src={staticFile(d.voiceover)} />}
        {d.music && <Audio src={staticFile(d.music)} volume={0.12} />}
      </AbsoluteFill>
    </ThemeProvider>
  );
};

const Fade: React.FC<{ dur: number; len: number; children: React.ReactNode }> = ({ dur, len, children }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, len, dur - len, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};
