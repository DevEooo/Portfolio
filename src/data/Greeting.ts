import type { GreetingContent } from "../types/site.ts";

export const greetingContent = {
  label: "Greetings",
  body: "Every team has work that shouldn’t need a person: the copying, the sorting, the retyping. I’m Herald, and that’s the work I go after. AI tools with a designer’s eye and an engineer’s patience. Fast, clear, and still running after the demo ends. Based in Jakarta. From busywork to background process. From a sketch to something people actually use.",
} as const satisfies GreetingContent;
