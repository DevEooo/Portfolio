import type { MarqueeContent } from "../../types/site.ts";
import CurvedLoop, { type CurvedLoopProps } from "./MarqueeLoop.tsx";
import "../../styles/Marquee.css";

const MARQUEE_LOOP = {
  shape: "line",
  viewHeight: 96,
  fontSize: 36,
  fontWeight: 400,
  letterSpacing: 2,
  speed: 1,
  scrollBoost: 0.6,
  interactive: true,
  pauseOnHover: true,
} as const satisfies CurvedLoopProps;

interface MarqueeProps {
  content: MarqueeContent;
  direction?: "left" | "right";
}

export default function Marquee({ content, direction = "left" }: MarqueeProps) {
  return (
    <div className="marquee" aria-hidden="true">
      <CurvedLoop
        {...MARQUEE_LOOP}
        marqueeText={content.list.words}
        separator={content.list.separator}
        direction={direction}
        className="marquee__text"
      />
    </div>
  );
}
