// Used by storyboard.mjs and render.mjs: read motion.json from a content folder, attach the theme tokens,
// and bundle the kit once with that folder as the public dir (photo, voiceover, music via staticFile).
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { selectComposition } from "@remotion/renderer";

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export function readContent(args) {
  const [arg, ...rest] = args;
  if (!arg) throw new Error("usage: <folder with motion.json> [--theme name]");
  const dir = path.resolve(arg);
  const file = path.join(dir, "motion.json");
  if (!existsSync(file)) throw new Error(`missing ${file}`);
  const data = JSON.parse(readFileSync(file, "utf8"));
  if (!Array.isArray(data.scenes) || !data.scenes.length) throw new Error("motion.json: no scenes");
  const i = rest.indexOf("--theme");
  const theme = i >= 0 ? rest[i + 1] : data.theme ?? "aurora";
  const themeFile = path.join(KIT, "themes", `${theme}.json`);
  if (!/^[a-z0-9-]+$/.test(theme) || !existsSync(themeFile)) throw new Error(`unknown theme: ${theme}`);
  data.tokens = JSON.parse(readFileSync(themeFile, "utf8"));
  for (const k of ["voiceover", "music"]) if (data[k] && !existsSync(path.join(dir, data[k]))) throw new Error(`${k} not found: ${data[k]}`);
  for (const s of data.scenes) if (s.photo && !existsSync(path.join(dir, s.photo))) throw new Error(`photo not found: ${s.photo}`);
  return { dir, data, theme };
}

export async function prepare(dir, data) {
  const serveUrl = await bundle({ entryPoint: path.join(KIT, "src/index.ts"), publicDir: dir });
  const composition = await selectComposition({ serveUrl, id: "Reel", inputProps: data });
  return { serveUrl, composition };
}
