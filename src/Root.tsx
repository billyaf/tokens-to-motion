import { Composition } from "remotion";
import { Reel, totalFrames } from "./Reel";
import { SIZE } from "./theme";
import type { Reel as ReelData } from "./types";
import example from "../examples/ai-tips/motion.json";

export const Root: React.FC = () => (
  <Composition
    id="Reel"
    component={Reel}
    width={SIZE.w}
    height={SIZE.h}
    fps={SIZE.fps}
    durationInFrames={totalFrames(example as ReelData, SIZE.fps)}
    defaultProps={example as ReelData}
    calculateMetadata={({ props }) => ({ durationInFrames: totalFrames(props, SIZE.fps) })}
  />
);
