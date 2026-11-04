import type { ProjectDetail } from '../types/site.ts';

export type ProjectLookup = {
  project: ProjectDetail;
  position: number;
  total: number;
  next: ProjectDetail;
  nextPosition: number;
};

export function findProject(list: readonly ProjectDetail[], slug: string | undefined): ProjectLookup | null {
  const index = list.findIndex((project) => project.slug === slug);
  const project = list[index];
  if (index < 0 || !project) return null;
  const nextIndex = (index + 1) % list.length;
  const next = list[nextIndex] ?? project;
  return { project, position: index + 1, total: list.length, next, nextPosition: nextIndex + 1 };
}
