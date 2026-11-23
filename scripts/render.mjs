// Render the MP4 to <folder>/video/<folder>-<theme>_vN.mp4 (version bumps, never overwrites).
//   npm run render -- examples/ai-tips [--theme mint]
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { renderMedia } from "@remotion/renderer";
import { readContent, prepare } from "./shared.mjs";

const { dir, data, theme } = readContent(process.argv.slice(2));
const { serveUrl, composition } = await prepare(dir, data);
const out = path.join(dir, "video");
mkdirSync(out, { recursive: true });
const base = `${path.basename(dir)}-${theme}`;
let v = 1;
while (existsSync(path.join(out, `${base}_v${v}.mp4`))) v++;
const file = path.join(out, `${base}_v${v}.mp4`);
let last = -1;
await renderMedia({ serveUrl, composition, inputProps: data, codec: "h264", crf: 18, audioBitrate: "192k", outputLocation: file,
  onProgress: ({ progress }) => { const p = Math.floor(progress * 10); if (p !== last) { last = p; console.log(`render ${p * 10}%`); } } });
console.log(`✓ ${path.relative(dir, file)} · ${(composition.durationInFrames / composition.fps).toFixed(1)} s`);
