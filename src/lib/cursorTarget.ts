export const CURSOR_PROJECT_SELECTOR = '[data-cursor="project"]';
export const CURSOR_LABEL_ATTRIBUTE = "data-cursor-label";

export function cursorProjectTarget(label: string) {
  return { "data-cursor": "project", "data-cursor-label": label } as const;
}
