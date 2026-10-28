import type { MarqueeContent } from "../types/site.ts";

export const marqueeContent = {
  list: {
    words: "PROTOTYPE // BUILD // INTEGRATE // DELIVER // ITERATE",
    separator: "//",
  },
} as const satisfies MarqueeContent;
