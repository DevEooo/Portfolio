const INDEX_DIGITS = 2;

export function padIndex(value: number): string {
  return String(value).padStart(INDEX_DIGITS, '0');
}

export function fillTemplate(template: string, values: Readonly<Record<string, string | number>>): string {
  return template.replace(/\{(\w+)\}/g, (token, key: string) => {
    const value = values[key];
    return value === undefined ? token : String(value);
  });
}

export const TITLE_FIT_STEP = 4;
export const TITLE_FIT_MIN = 4;
export const TITLE_FIT_MAX = 32;

export function titleFit(text: string): number {
  const steps = Math.ceil(text.trim().length / TITLE_FIT_STEP) * TITLE_FIT_STEP;
  return Math.min(TITLE_FIT_MAX, Math.max(TITLE_FIT_MIN, steps));
}

export function titleFitByWord(text: string): number {
  const longest = text.trim().split(/\s+/).reduce((max, word) => Math.max(max, word.length), 0);
  return titleFit('x'.repeat(longest));
}
