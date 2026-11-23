// Free preview: one PNG per scene in <folder>/storyboard/<theme>/scene-NN.png.
//   npm run storyboard -- examples/ai-tips [--theme mint]
import { mkdirSync } from "node:fs";
import path from "node:path";
import { renderStill } from "@remotion/renderer";
import { readContent, prepare } from "./shared.mjs";

const { dir, data, theme } = readContent(process.argv.slice(2));
const { serveUrl, composition } = await prepare(dir, data);
const out = path.join(dir, "storyboard", theme);
mkdirSync(out, { recursive: true });
let start = 0;
for (const [i, s] of data.scenes.entries()) {
  const dur = Math.round(s.seconds * composition.fps);
  const frame = start + Math.min(dur - 9, Math.round(dur * 0.6)); // after the entrance, before the fade-out
  start += dur;
  const file = path.join(out, `scene-${String(i + 1).padStart(2, "0")}.png`);
  await renderStill({ serveUrl, composition, inputProps: data, frame, output: file, imageFormat: "png" });
  console.log(`✓ ${path.relative(dir, file)} (${s.type}, ${s.seconds}s)`);
}
console.log(`Storyboard: ${data.scenes.length} scenes, ${(start / composition.fps).toFixed(1)} s, theme ${theme}.`);
