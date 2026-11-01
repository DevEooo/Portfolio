import type { ExpertiseContent } from "../types/site.ts";

export const expertiseContent = {
  eyebrow: { index: "03", label: "Expertise" },
  title: { lead: "Things I’m", accent: "good at." },
  toolsLabel: "Tools",
  usedInLabel: "Used in",
  listLabel: "Service list",
  tools: ["Python", "TypeScript", "React", "Laravel", "Tailwind CSS", "GSAP", "MySQL", "Git", "OpenCV", "Kotlin", "C#", "Java"],
  services: [
    {
      id: "workflow-automation",
      title: "Workflow automation",
      description: "Repetitive steps (data entry, weekly reports, inbox sorting) turned into pipelines that run on their own and flag you when something needs a human.",
      tools: ["Python", "MySQL", "Git"],
    },
    {
      id: "ai-assistants",
      title: "AI assistants on your data",
      description: "Chatbots that answer from your own documents, catalog or knowledge base, and show where each answer came from instead of guessing.",
      tools: ["Python", "TypeScript", "React"],
    },
    {
      id: "document-extraction",
      title: "Document & data extraction",
      description: "Invoices, forms and receipts read automatically and turned into clean rows in the spreadsheet or system you already use.",
      tools: ["Python", "OpenCV", "MySQL"],
    },
    {
      id: "ai-web-apps",
      title: "AI-powered web apps",
      description: "Fast, accessible React front ends with the AI built in, so the tool feels as simple as the problem it solves.",
      tools: ["React", "TypeScript", "Tailwind CSS", "GSAP", "Laravel"],
    },
  ],
} as const satisfies ExpertiseContent;
