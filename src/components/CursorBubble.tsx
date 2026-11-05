import type { Ref } from "react";
import "../styles/CursorBubble.css";

type CursorBubbleProps = {
  /** Text shown in the middle of the bubble. Rendered as authored (no forced casing). */
  text: string;
  ref?: Ref<HTMLSpanElement>;
};

/**
 * Solid circle with a short call to action, shown by Cursor while the pointer is over an
 * element marked with `cursorBubbleTarget(label)`. Purely visual: Cursor is aria-hidden.
 */
export default function CursorBubble({ text, ref }: CursorBubbleProps) {
  return (
    <span ref={ref} className="cursor-bubble">
      <span className="cursor-bubble__text">{text}</span>
    </span>
  );
}
