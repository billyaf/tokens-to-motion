import { createContext, useContext } from "react";
import type { Theme } from "./types";
import aurora from "../themes/aurora.json";

// Canvas and safe zone for 9:16 reels. Content stays between y 270 (below the top UI) and y 1500
// (above caption and buttons), 108 px from the sides.
export const SIZE = { w: 1080, h: 1920, fps: 30 };
export const SAFE = { top: 270, bottom: 1500, side: 108 };

export const DEFAULT_THEME = aurora as Theme;
const Ctx = createContext<Theme>(DEFAULT_THEME);
export const ThemeProvider = Ctx.Provider;
export const useTheme = () => useContext(Ctx);

// "r, g, b" → rgba() with alpha, so shadows follow the theme.
export const shade = (t: Theme, a: number) => `rgba(${t.color.shadow}, ${a})`;
