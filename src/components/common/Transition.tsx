import type { CSSProperties, TransitionEvent } from "react";
import "../../styles/Transition.css";

type StaggerOrigin = "left" | "right" | "center" | "edges";

interface StairsRevealProps {
  /** false = blocks cover the screen, true = blocks slide away. Toggling animates both ways. */
  revealing?: boolean;
  columns?: number;
  /** ms, per-block slide duration */
  duration?: number;
  /** ms, delay added per column step */
  stagger?: number;
  /** which side the stagger starts from */
  origin?: StaggerOrigin;
  color?: string;
  easing?: string;
  zIndex?: number;
  className?: string;
  /** fires once the last column finishes; receives the state it finished in */
  onFinish?: (revealing: boolean) => void;
}

function getStaggerStep(i: number, columns: number, origin: StaggerOrigin): number {
  const mid = (columns - 1) / 2;
  switch (origin) {
    case "right":
      return columns - 1 - i;
    case "center":
      return Math.round(Math.abs(i - mid));
    case "edges":
      return Math.round(mid - Math.abs(i - mid));
    default:
      return i;
  }
}

export default function StairsReveal({
  revealing = false,
  columns = 10,
  duration = 650,
  stagger = 45,
  origin = "left",
  color = "var(--void)",
  easing = "cubic-bezier(0.76, 0, 0.24, 1)",
  zIndex = 9999,
  className = "",
  onFinish,
}: StairsRevealProps) {
  const steps = Array.from({ length: columns }, (_, i) => getStaggerStep(i, columns, origin));
  const lastStep = Math.max(...steps);
  const lastIndex = steps.indexOf(lastStep);

  const rootStyle = {
    "--stairs-color": color,
    "--stairs-duration": `${duration}ms`,
    "--stairs-easing": easing,
    zIndex,
  } as CSSProperties;

  const handleTransitionEnd = (e: TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || e.propertyName !== "transform") return;
    onFinish?.(revealing);
  };

  return (
    <div
      className={`stairs${revealing ? " is-revealing" : ""} ${className}`.trim()}
      style={rootStyle}
      aria-hidden="true"
    >
      {steps.map((step, i) => (
        <div
          key={i}
          className="stairs-column"
          style={{ "--stairs-delay": `${step * stagger}ms` } as CSSProperties}
        >
          <div className="stairs-block stairs-block--top" />
          <div
            className="stairs-block stairs-block--bottom"
            onTransitionEnd={i === lastIndex ? handleTransitionEnd : undefined}
          />
        </div>
      ))}
    </div>
  );
}
