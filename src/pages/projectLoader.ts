import type { LoaderFunctionArgs } from 'react-router';
import { projects } from '../content/Projects.ts';
import { findProject } from '../lib/projects.ts';

export function projectLoader({ params }: LoaderFunctionArgs) {
  const found = findProject(projects, params.slug);
  if (!found) throw new Response('Project not found', { status: 404 });
  return found;
}
