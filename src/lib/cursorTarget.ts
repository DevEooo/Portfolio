export const CURSOR_ATTRIBUTE = "data-cursor";
export const CURSOR_LABEL_ATTRIBUTE = "data-cursor-label";
export const CURSOR_TARGET_SELECTOR = `[${CURSOR_ATTRIBUTE}]`;
export const CURSOR_PROJECT_SELECTOR = `[${CURSOR_ATTRIBUTE}="project"]`;

export type CursorKind = "project" | "bubble";

/** Spinning ring badge with the label written around it (used by project lists). */
export function cursorProjectTarget(label: string) {
  return { [CURSOR_ATTRIBUTE]: "project", [CURSOR_LABEL_ATTRIBUTE]: label } as const;
}

/** Solid bubble with the label in the middle (see CursorBubble). */
export function cursorBubbleTarget(label: string) {
  return { [CURSOR_ATTRIBUTE]: "bubble", [CURSOR_LABEL_ATTRIBUTE]: label } as const;
}
