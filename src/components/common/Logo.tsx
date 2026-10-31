import { WORDMARK } from "./wordmark.ts";
import "../../styles/Logo.css";

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  return (
    <svg
      className={className ? `logo ${className}` : "logo"}
      viewBox={WORDMARK.viewBox}
      aria-hidden="true"
      focusable="false"
    >
      <path className="logo__letters" d={WORDMARK.letters} />
      <rect
        className="logo__dot"
        x={WORDMARK.dot.x}
        y={WORDMARK.dot.y}
        width={WORDMARK.dot.size}
        height={WORDMARK.dot.size}
      />
    </svg>
  );
}
