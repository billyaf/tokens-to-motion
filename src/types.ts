// One reel = one motion.json (see examples/). Text may use **bold** for key words.
// File paths (photo, voiceover, music) are relative to the folder that holds motion.json.

export type Scene =
  | { type: "intro"; seconds: number; tag?: string; title: string; highlight?: string; sub?: string; photo?: string }
  | { type: "point"; seconds: number; title?: string; text: string; highlight?: string }
  | { type: "stat"; seconds: number; value: number; unit?: string; label: string; source?: string; decimals?: number }
  | { type: "list"; seconds: number; title: string; items: string[] }
  | { type: "outro"; seconds: number; text: string; tags?: string[] };

export type Theme = {
  name: string;
  font: "Poppins" | "Inter" | "Space Grotesk";
  color: { bgTop: string; bgMid: string; bgBottom: string; accent: string; onAccent: string; text: string; panel: string; card: string; onCard: string; shadow: string };
  brand: { mark: string; handle?: string; site?: string };
  motion: { crossfadeFrames: number; spring: { damping: number; mass: number } };
};

export type Reel = {
  title: string;
  theme?: string; // file name in themes/, resolved by the scripts
  tokens?: Theme; // injected by the scripts
  scenes: Scene[];
  voiceover?: string;
  music?: string;
};
