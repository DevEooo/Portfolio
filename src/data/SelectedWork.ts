import type { SelectedWorkContent } from "../types/site.ts";

export const selectedWorkContent = {
  title: { first: "Selected", last: "Work" },
  listLabel: "Projects",
  hint: "Hover to open",
  cursorAction: "View project",
  metaSeparator: " · ",
  photoPlaceholder: "TODO: project photo",
  projects: [
    { id: "project-01", title: "TODO: Project name", year: "2025", category: "3D Modeling", description: "TODO: one-line description", href: "/work/project-01" },
    { id: "project-02", title: "TODO: Project name", year: "2024", category: "Mobile App", description: "TODO: one-line description", href: "/work/project-02" },
    { id: "project-03", title: "TODO: Project name", year: "2024", category: "Unity 3D", description: "TODO: one-line description", href: "/work/project-03" },
    { id: "project-04", title: "TODO: Project name", year: "2024", category: "Mobile App", description: "TODO: one-line description", href: "/work/project-04" },
    { id: "project-05", title: "TODO: Project name", year: "2024", category: "Mobile App", description: "TODO: one-line description", href: "/work/project-05" },
  ],
} as const satisfies SelectedWorkContent;
