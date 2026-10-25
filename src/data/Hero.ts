import type { HeroContent } from "../types/site.ts";

export const heroContent = {
  meta: {
    index: "( Portfolio // 2026 )",
    role: "AI Engineer",
    availability: { label: "Available", isAvailable: true },
  },
  name: { first: "Herald", last: "Panji" },
  statement:
    "I build AI tools that automate manual work and stay practical to use, for small businesses and startups that just need things to work.",
  visual: {
    src: "/images/herald.png",
    alt: "Black-and-white portrait of Herald Panji in glasses and a striped shirt, looking off to the side against blurred night lights",
  },
  scrollCue: "Scroll to explore",
} as const satisfies HeroContent;
