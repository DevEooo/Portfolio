import type { SelectedWorkContent } from "../types/site.ts";

export const selectedWorkContent = {
  title: { first: "Selected", last: "Work" },
  listLabel: "Projects",
  hint: "Hover to open",
  cursorAction: "View project",
  metaSeparator: " · ",
  photoPlaceholder: "TODO: project photo",
  projects: [
    { id: "project-01", title: "TODO: Project name", year: "2025", category: "3D Modeling", description: "A cascade of hand-modelled playing cards, lit and rendered in Blender", href: "/work/project-01", image: { src: "/images/selected-work/1.jpg", alt: "Playing cards tumbling through warm, dusty light", width: 1920, height: 1080 } },
    { id: "project-02", title: "TODO: Project name", year: "2024", category: "Mobile App", description: "A habit tracker with a halftone identity and gentle daily nudges", href: "/work/project-02", image: { src: "/images/selected-work/2.jpg", alt: "Coral halftone dots scattered across a deep teal field", width: 1920, height: 1080 } },
    { id: "project-03", title: "TODO: Project name", year: "2024", category: "Unity 3D", description: "A brushstroke-shaded night exploration game built in Unity", href: "/work/project-03", image: { src: "/images/selected-work/3.jpg", alt: "A gothic castle beneath a swirling, painterly night sky", width: 1920, height: 1080 } },
    { id: "project-04", title: "TODO: Project name", year: "2024", category: "Mobile App", description: "A case-notes app for mystery writers to pin clues and link suspects", href: "/work/project-04", image: { src: "/images/selected-work/4.jpg", alt: "A detective board of photos and notes joined by string", width: 1920, height: 1080 } },
    { id: "project-05", title: "TODO: Project name", year: "2024", category: "Mobile App", description: "A local news reader that layers the day's headlines into a collage", href: "/work/project-05", image: { src: "/images/selected-work/5.jpg", alt: "Torn newspaper posters layered into a monochrome collage", width: 1920, height: 1080 } },
  ],
} as const satisfies SelectedWorkContent;
